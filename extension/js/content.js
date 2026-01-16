// Content script to grab links from the current page
function grabLinks() {
  console.log('Memoray Grabber: Scanning frame for files...');
  const links = Array.from(document.querySelectorAll('a'));
  const fileExtensions = [
    '.ppt', '.pptx', '.pdf', '.doc', '.docx', '.xls', '.xlsx', 
    '.zip', '.txt', '.png', '.jpg', '.jpeg', '.mp4', '.mov', '.key'
  ];
  
  const grabbedLinks = links
    .map(link => {
      const url = link.href;
      const text = link.innerText.trim() || link.getAttribute('title') || 'Untitled';
      const downloadAttr = link.getAttribute('download');
      const className = link.className || '';
      
      return {
        text: text,
        url: url,
        downloadAttr: downloadAttr,
        className: className
      };
    })
    .filter(link => {
      if (!link.url || link.url.startsWith('javascript:') || link.url.startsWith('mailto:')) return false;

      try {
        const urlObj = new URL(link.url);
        const path = urlObj.pathname.toLowerCase();
        const search = urlObj.search.toLowerCase();
        const text = link.text.toLowerCase();
        const className = link.className.toLowerCase();

        // Check if path ends with extension
        const hasExtInPath = fileExtensions.some(ext => path.endsWith(ext));
        
        // Check if query params contain extension (common in Canvas/redirects)
        const hasExtInQuery = fileExtensions.some(ext => search.includes(ext));
        
        // Check if link text contains extension
        const hasExtInText = fileExtensions.some(ext => text.includes(ext));

        // Check for common download keywords in Canvas/LMS
        const isDownloadLink = 
          path.includes('/download') || 
          path.includes('/files/') ||
          search.includes('download=') || 
          search.includes('wrap=1') ||
          className.includes('file_link') ||
          className.includes('download');

        return hasExtInPath || hasExtInQuery || hasExtInText || isDownloadLink || !!link.downloadAttr;
      } catch (e) {
        return false;
      }
    })
    .map(link => {
      // Clean up filename
      let filename = 'file';
      try {
        const urlObj = new URL(link.url);
        const pathParts = urlObj.pathname.split('/');
        filename = pathParts.pop() || 'file';
        
        // If filename is just a number (common in Canvas), try to get it from text
        if (/^\d+$/.test(filename) || filename === 'download') {
          if (link.text.includes('.')) {
            filename = link.text;
          }
        }

        // Ensure filename has an extension if possible
        if (!filename.includes('.') && link.text.includes('.')) {
          const match = link.text.match(/\.[0-9a-z]+$/i);
          if (match) filename += match[0];
        }
      } catch (e) {}

      return {
        text: link.text,
        url: link.url,
        filename: filename
      };
    });

  console.log(`Memoray Grabber: Found ${grabbedLinks.length} potential files in this frame.`);
  return grabbedLinks;
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getLinks") {
    const links = grabLinks();
    sendResponse({ links: links });
  }
});
