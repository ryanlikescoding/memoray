document.addEventListener('DOMContentLoaded', () => {
  const linkList = document.getElementById('link-list');
  const status = document.getElementById('status');
  const refreshBtn = document.getElementById('refresh');
  const downloadAllBtn = document.getElementById('download-all');
  const deepScanBtn = document.getElementById('deep-scan-btn');

  // This function will be injected into the page frames
  function grabLinksFromDocument(doc = document) {
    const fileExtensions = [
      '.ppt', '.pptx', '.pdf', '.doc', '.docx', '.xls', '.xlsx', 
      '.zip', '.txt', '.png', '.jpg', '.jpeg', '.mp4', '.mov', '.key'
    ];
    
    const links = Array.from(doc.querySelectorAll('a'));
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
          // If we're parsing a fetched document, URLs might be relative.
          // However, on Canvas they are usually absolute or can be resolved.
          const urlObj = new URL(link.url, 'https://canvas.inspirededucationschools.com');
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
          const urlObj = new URL(link.url, 'https://canvas.inspirededucationschools.com');
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

  // Wrapper for injection
  function grabLinks() {
    // This is just to satisfy the existing executeScript calls
    // It will use the default document
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
      
      chrome.scripting.executeScript({
        target: { tabId: activeTab.id, allFrames: true },
        func: grabLinks
      }, (results) => {
        if (chrome.runtime.lastError) {
          status.textContent = 'Error: Refresh the page and try again.';
          console.error(chrome.runtime.lastError);
          return;
        }
        
        let allLinks = [];
        results.forEach(result => {
          if (result.result && Array.isArray(result.result)) {
            allLinks = allLinks.concat(result.result);
          }
        });
        
        displayLinks(allLinks);
      });
    });
  }

  function displayLinks(allLinks) {
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
      status.textContent = 'No files found. Try "Deep Scan" if on homepage.';
    }
  }

  async function deepScanCourses() {
    status.textContent = 'Identifying courses...';
    linkList.innerHTML = '';
    
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const activeTab = tabs[0];
      
      // 1. Find all course links on the current page
      chrome.scripting.executeScript({
        target: { tabId: activeTab.id },
        func: () => {
          const courseLinks = Array.from(document.querySelectorAll('a'))
            .map(a => a.href)
            .filter(href => href.match(/\/courses\/\d+$/));
          return [...new Set(courseLinks)]; // Unique course links
        }
      }, async (results) => {
        const courseLinks = results[0].result || [];
        
        if (courseLinks.length === 0) {
          status.textContent = 'No course links found. Make sure you are on the Dashboard.';
          return;
        }

        status.textContent = `Found ${courseLinks.length} courses. Crawling modules...`;
        let allFiles = [];

        for (const courseUrl of courseLinks) {
          const modulesUrl = `${courseUrl}/modules`;
          status.textContent = `Scanning: ${modulesUrl}...`;
          
          try {
            const response = await fetch(modulesUrl);
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            // Extract files from the module page
            const files = grabLinksFromDocument(doc);
            allFiles = allFiles.concat(files);
          } catch (error) {
            console.error(`Error scanning ${modulesUrl}:`, error);
          }
        }

        displayLinks(allFiles);
      });
    });
  }

  refreshBtn.addEventListener('click', scanPage);
  deepScanBtn.addEventListener('click', deepScanCourses);

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
