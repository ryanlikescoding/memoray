document.addEventListener('DOMContentLoaded', () => {
  const linkList = document.getElementById('link-list');
  const status = document.getElementById('status');
  const refreshBtn = document.getElementById('refresh');
  const downloadAllBtn = document.getElementById('download-all');

  // This function will be injected into the page frames
  function grabLinks() {
    const fileExtensions = [
      '.ppt', '.pptx', '.pdf', '.doc', '.docx', '.xls', '.xlsx', 
      '.zip', '.txt', '.png', '.jpg', '.jpeg', '.mp4', '.mov', '.key'
    ];
    
    const links = Array.from(document.querySelectorAll('a'));
    return links
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

          const hasExtInPath = fileExtensions.some(ext => path.endsWith(ext));
          const hasExtInQuery = fileExtensions.some(ext => search.includes(ext));
          const hasExtInText = fileExtensions.some(ext => text.includes(ext));

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
        let filename = 'file';
        try {
          const urlObj = new URL(link.url);
          const pathParts = urlObj.pathname.split('/');
          filename = pathParts.pop() || 'file';
          
          if (/^\d+$/.test(filename) || filename === 'download') {
            if (link.text.includes('.')) {
              filename = link.text;
            }
          }

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
  }

  function scanPage() {
    status.textContent = 'Scanning all frames...';
    linkList.innerHTML = '';
    
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      
      // Use executeScript to run the grabber in ALL frames (including iFrames)
      chrome.scripting.executeScript({
        target: { tabId: activeTab.id, allFrames: true },
        func: grabLinks // This function is defined in content.js and injected here
      }, (results) => {
        if (chrome.runtime.lastError) {
          status.textContent = 'Error: Refresh the page and try again.';
          console.error(chrome.runtime.lastError);
          return;
        }

        // Aggregate results from all frames
        let allLinks = [];
        results.forEach(result => {
          if (result.result && Array.isArray(result.result)) {
            allLinks = allLinks.concat(result.result);
          }
        });

        // Remove duplicates based on URL
        const uniqueLinks = [];
        const seenUrls = new Set();
        allLinks.forEach(link => {
          if (!seenUrls.has(link.url)) {
            seenUrls.add(link.url);
            uniqueLinks.push(link);
          }
        });

        if (uniqueLinks.length > 0) {
          status.textContent = `Found ${uniqueLinks.length} files:`;
          uniqueLinks.forEach((link) => {
            const li = document.createElement('li');
            li.innerHTML = `
              <label>
                <input type="checkbox" value="${link.url}" data-filename="${link.filename}" checked>
                <span class="file-info">
                  <span class="file-name">${link.text}</span>
                  <span class="file-url">${link.filename}</span>
                </span>
              </label>
            `;
            linkList.appendChild(li);
          });
        } else {
          status.textContent = 'No files found. Try scrolling down or clicking "Refresh".';
        }
      });
    });
  }

  refreshBtn.addEventListener('click', scanPage);

  downloadAllBtn.addEventListener('click', () => {
    const selected = Array.from(linkList.querySelectorAll('input[type="checkbox"]:checked'));
    if (selected.length === 0) {
      alert('Please select at least one file.');
      return;
    }

    selected.forEach(checkbox => {
      chrome.runtime.sendMessage({
        action: "downloadFile",
        url: checkbox.value,
        filename: checkbox.dataset.filename
      });
    });
    
    status.textContent = `Downloading ${selected.length} files...`;
  });

  scanPage();
});
