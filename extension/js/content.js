const FILE_EXTENSIONS = [
  '.ppt', '.pptx', '.pdf', '.doc', '.docx', '.xls', '.xlsx', 
  '.zip', '.txt', '.png', '.jpg', '.jpeg', '.mp4', '.mov', '.key'
];

function grabLinks() {
  console.log('Memoray Grabber: Scanning frame for files...');
  const files = [];
  const baseUrl = window.location.origin;

  // 1. Check all <a> tags
  const links = Array.from(document.querySelectorAll('a'));
  links.forEach(link => {
    const url = link.href;
    if (!url || url.startsWith('javascript:') || url.startsWith('mailto:')) return;

    try {
      const urlObj = new URL(url, baseUrl);
      const path = urlObj.pathname.toLowerCase();
      const search = urlObj.search.toLowerCase();
      const text = (link.innerText || link.getAttribute('title') || 'Untitled').trim();
      const className = (link.className || '').toLowerCase();

      const hasExt = FILE_EXTENSIONS.some(ext => path.endsWith(ext) || search.includes(ext) || text.toLowerCase().includes(ext));
      const isDownload = path.includes('/download') || path.includes('/files/') || search.includes('download=') || 
                         search.includes('wrap=1') || className.includes('file_link') || className.includes('download') || 
                         className.includes('attachment') || !!link.getAttribute('download');

      if (hasExt || isDownload) {
        let filename = path.split('/').pop() || 'file';
        if (filename.includes('?')) filename = filename.split('?')[0];
        if ((/^\d+$/.test(filename) || filename === 'download') && text.includes('.')) {
          filename = text;
        }
        if (!filename.includes('.') && text.includes('.')) {
          const match = text.match(/\.[0-9a-z]+$/i);
          if (match) filename += match[0];
        }
        files.push({ text, url, filename });
      }
    } catch (e) {}
  });

  // 2. Check iframes/embeds
  document.querySelectorAll('iframe, embed, object').forEach(el => {
    const src = el.src || el.data;
    if (src && FILE_EXTENSIONS.some(ext => src.toLowerCase().includes(ext))) {
      try {
        const urlObj = new URL(src, baseUrl);
        files.push({
          text: `Embedded File (${urlObj.pathname.split('/').pop()})`,
          url: src,
          filename: urlObj.pathname.split('/').pop()
        });
      } catch (e) {}
    }
  });

  console.log(`Memoray Grabber: Found ${files.length} potential files.`);
  return files;
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getLinks") {
    const links = grabLinks();
    sendResponse({ links: links });
  }
});
