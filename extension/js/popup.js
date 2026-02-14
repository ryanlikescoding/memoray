document.addEventListener('DOMContentLoaded', () => {
  const linkList = document.getElementById('link-list');
  const status = document.getElementById('status');
  const refreshBtn = document.getElementById('refresh');
  const downloadAllBtn = document.getElementById('download-all');

  // Constants for scanning
  const FILE_EXTENSIONS = [
    '.ppt', '.pptx', '.pdf', '.doc', '.docx', '.xls', '.xlsx', 
    '.zip', '.txt', '.png', '.jpg', '.jpeg', '.mp4', '.mov', '.key'
  ];

  const MAX_PAGES_TO_SCAN = 40; // Increased to handle large modules
  let scannedPagesCount = 0;
  const discoveredFiles = new Map(); // URL -> {text, filename, folder}
  const scannedPages = new Set();

  // The core link extraction logic
  function extractLinksFromDoc(doc, baseUrl, folder = 'General') {
    const files = [];
    const internalLinks = [];

    // Try to get a better folder name if we're on a Canvas course page
    const courseTitleEl = doc.querySelector('.course-title, #course_header, .ellipsis');
    let detectedFolder = folder;
    if (courseTitleEl) {
      const title = courseTitleEl.innerText.trim();
      if (title && title.length < 50) detectedFolder = title.replace(/[\\/:*?"<>|]/g, '_');
    }

    // 1. Check all <a> tags
    const links = Array.from(doc.querySelectorAll('a'));
    links.forEach(link => {
      const url = link.href;
      if (!url || url.startsWith('javascript:') || url.startsWith('mailto:')) return;

      try {
        const urlObj = new URL(url, baseUrl);
        const path = urlObj.pathname.toLowerCase();
        const search = urlObj.search.toLowerCase();
        const text = (link.innerText || link.getAttribute('title') || 'Untitled').trim();
        const className = (link.className || '').toLowerCase();

        // Check if it's a file
        const textLower = text.toLowerCase();
        const hasExt = FILE_EXTENSIONS.some(ext => path.endsWith(ext) || search.includes(ext) || textLower.includes(ext));
        const isDownload = path.includes('/download') || path.includes('/files/') || path.includes('/preview') ||
                           search.includes('download=') || search.includes('wrap=1') || 
                           textLower.includes('download') ||
                           className.includes('file_link') || className.includes('download') || 
                           className.includes('attachment') || !!link.getAttribute('download');
        
        // Canvas specific: detect module items that are likely files
        // These are links like /courses/123/modules/items/456
        const isModuleItem = path.includes('/modules/items/');
        const looksLikeFile = text.includes('.') || 
                             className.includes('file') || 
                             className.includes('attachment') ||
                             link.querySelector('[class*="icon-document"], [class*="icon-pdf"], [class*="icon-pptx"]');

        if (hasExt || isDownload) {
          let filename = path.split('/').pop() || 'file';
          if (filename.includes('?')) filename = filename.split('?')[0];
          
          // Better filename from text if the URL filename is just a number
          if ((/^\d+$/.test(filename) || filename === 'download' || filename === 'preview') && text.includes('.')) {
            filename = text;
          }
          
          if (!filename.includes('.') && text.includes('.')) {
            const match = text.match(/\.[0-9a-z]+$/i);
            if (match) filename += match[0];
          }

          files.push({ text, url, filename, folder: detectedFolder });
        } else if (urlObj.origin === new URL(baseUrl).origin) {
          // NEVER follow /files links as they are often restricted
          if (path.includes('/files')) return;

          // Prioritize module items as they lead to files
          if (isModuleItem && looksLikeFile) {
            console.log(`[Discovery] Prioritizing module item: ${text}`);
            internalLinks.unshift(url);
          } else if (isModuleItem || path.includes('/assignments/')) {
            internalLinks.push(url);
          }
        }
      } catch (e) {}
    });

    // 2. Check iframes/embeds for direct file links (like PDF viewers)
    doc.querySelectorAll('iframe, embed, object').forEach(el => {
      const src = el.src || el.data;
      if (src && FILE_EXTENSIONS.some(ext => src.toLowerCase().includes(ext))) {
        try {
          const urlObj = new URL(src, baseUrl);
          const filename = urlObj.pathname.split('/').pop();
          files.push({
            text: `Embedded File (${filename})`,
            url: src,
            filename: filename,
            folder: detectedFolder
          });
        } catch (e) {}
      }
    });

    return { files, internalLinks };
  }

  function displayFiles() {
    linkList.innerHTML = '';
    const sortedFiles = Array.from(discoveredFiles.values()).sort((a, b) => {
      // Sort by folder first, then by text
      if (a.folder !== b.folder) return a.folder.localeCompare(b.folder);
      return a.text.localeCompare(b.text);
    });
    
    if (sortedFiles.length > 0) {
      status.textContent = `Found ${sortedFiles.length} files:`;
      let currentFolder = '';
      
      sortedFiles.forEach((link) => {
        if (link.folder !== currentFolder) {
          currentFolder = link.folder;
          const folderHeader = document.createElement('li');
          folderHeader.className = 'folder-header';
          folderHeader.innerHTML = `<strong>📁 ${currentFolder}</strong>`;
          linkList.appendChild(folderHeader);
        }

        const li = document.createElement('li');
        li.innerHTML = `
          <label>
            <input type="checkbox" value="${link.url}" data-filename="${link.filename}" data-folder="${link.folder}" checked>
            <span class="file-info">
              <span class="file-name">${link.text}</span>
              <span class="file-url">${link.filename}</span>
            </span>
          </label>
        `;
        linkList.appendChild(li);
      });
    } else {
      status.textContent = 'No files found yet...';
    }
  }

  async function crawlPage(url, depth = 0, folder = 'General') {
    // Clean URL: remove trailing colons or whitespace that might cause 400 errors
    url = url.trim().replace(/:+$/, '');
    
    if (scannedPagesCount >= MAX_PAGES_TO_SCAN || scannedPages.has(url)) return;
    
    scannedPages.add(url);
    scannedPagesCount++;
    console.log(`[Crawl] Scanning: ${url} (Depth: ${depth}, Folder: ${folder})`);
    status.textContent = `Scanning... Found ${discoveredFiles.size} files (${scannedPagesCount} pages)`;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      // Use credentials: 'include' to ensure Canvas session cookies are sent
      const response = await fetch(url, { 
        signal: controller.signal,
        credentials: 'include' 
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        console.warn(`[Crawl] Fetch failed for ${url} - Status: ${response.status} ${response.statusText}`);
        return;
      }

      // Handle redirects (important for module items that point to files)
      const finalUrl = response.url;
      const contentType = response.headers.get('content-type') || '';
      
      // If the final URL or the original URL is a file, or if it's not HTML
      const isFileUrl = FILE_EXTENSIONS.some(ext => finalUrl.toLowerCase().includes(ext) || url.toLowerCase().includes(ext));
      if (isFileUrl || !contentType.includes('text/html')) {
        const urlObj = new URL(finalUrl);
        let filename = urlObj.pathname.split('/').pop() || 'file';
        if (filename.includes('?')) filename = filename.split('?')[0];
        
        if (!discoveredFiles.has(finalUrl)) {
          console.log(`[Crawl] Found file after redirect: ${filename}`);
          discoveredFiles.set(finalUrl, { text: filename, url: finalUrl, filename, folder });
          displayFiles();
        }
        return;
      }

      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const baseUrl = new URL(url).origin;
      
      const { files, internalLinks } = extractLinksFromDoc(doc, url, folder);
      
      let newFilesFound = 0;
      files.forEach(file => {
        if (!discoveredFiles.has(file.url)) {
          discoveredFiles.set(file.url, file);
          newFilesFound++;
        }
      });
      
      if (newFilesFound > 0) {
        console.log(`[Crawl] Found ${newFilesFound} new files on ${url}`);
        displayFiles();
      }

      // Recurse into internal links
      if (scannedPagesCount < MAX_PAGES_TO_SCAN && depth < 2) { // Limit depth to avoid infinite loops
        for (const link of internalLinks) {
          const isUtility = /logout|login|auth|settings|profile|search|help|api|static|download|preview/i.test(link);
          if (!isUtility && !scannedPages.has(link)) {
            await crawlPage(link, depth + 1, folder);
            if (scannedPagesCount >= MAX_PAGES_TO_SCAN) break;
          }
        }
      }
    } catch (e) {
      if (e.name === 'AbortError') {
        console.error(`[Crawl] Timeout fetching ${url}`);
      } else {
        console.error(`[Crawl] Error scanning ${url}:`, e);
      }
    }
  }

  function scanPage() {
    console.log('[Scan] Starting page scan...');
    discoveredFiles.clear();
    scannedPages.clear();
    scannedPagesCount = 0;
    linkList.innerHTML = '';
    status.textContent = 'Scanning current page...';
    
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      if (!activeTab?.id) {
        status.textContent = 'Error: No active tab found.';
        return;
      }

      // Don't scan chrome:// or other restricted pages
      if (activeTab.url.startsWith('chrome://') || activeTab.url.startsWith('edge://')) {
        status.textContent = 'Cannot scan system pages.';
        return;
      }

      // 1. Immediately scan all frames
      chrome.scripting.executeScript({
        target: { tabId: activeTab.id, allFrames: true },
        func: () => {
          const FILE_EXTENSIONS = ['.ppt', '.pptx', '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.zip', '.txt', '.png', '.jpg', '.jpeg', '.mp4', '.mov', '.key'];
          const files = [];
          
          const courseTitleEl = document.querySelector('.course-title, #course_header, .ellipsis');
          let folder = 'General';
          if (courseTitleEl) {
            const title = courseTitleEl.innerText.trim();
            if (title && title.length < 50) folder = title.replace(/[\\/:*?"<>|]/g, '_');
          }

          document.querySelectorAll('a').forEach(link => {
            const url = link.href;
            if (!url || url.startsWith('javascript:') || url.startsWith('mailto:')) return;
            try {
              const urlObj = new URL(url, document.baseURI);
              const path = urlObj.pathname.toLowerCase();
              const text = (link.innerText || link.getAttribute('title') || 'Untitled').trim();
              const hasExt = FILE_EXTENSIONS.some(ext => path.endsWith(ext) || text.toLowerCase().includes(ext));
              if (hasExt || link.hasAttribute('download')) {
                files.push({ text, url, filename: path.split('/').pop() || 'file', folder });
              }
            } catch (e) {}
          });
          return files;
        }
      }, (results) => {
        if (chrome.runtime.lastError) {
          console.error('[Scan] Scripting error:', chrome.runtime.lastError);
        } else if (results) {
          results.forEach(res => {
            if (res.result) {
              res.result.forEach(file => {
                if (!discoveredFiles.has(file.url)) discoveredFiles.set(file.url, file);
              });
            }
          });
          displayFiles();
        }

        // 2. Start background crawl
        crawlPage(activeTab.url).then(() => {
          if (discoveredFiles.size === 0) {
            status.textContent = 'No files found on this page.';
            // If it's a Canvas dashboard, the crawl might have failed to find courses
            if (activeTab.url.includes('canvas')) {
              status.textContent = 'Canvas detected. Starting course discovery...';
              deepScanCourses();
            }
          } else {
            status.textContent = `Scan complete. Found ${discoveredFiles.size} files.`;
          }
        });
      });
    });
  }

  async function deepScanCourses() {
    console.log('[DeepScan] Starting deep scan...');
    status.textContent = 'Looking for courses...';
    
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const activeTab = tabs[0];
      if (!activeTab?.url) return;

      const currentUrl = activeTab.url;
      const urlObj = new URL(currentUrl);
      const origin = urlObj.origin;
      
      // If we are already in a course, scan its specific sections first
      const courseMatch = currentUrl.match(/\/courses\/(\d+)/);
      if (courseMatch) {
        const courseId = courseMatch[1];
        const courseBase = `${origin}/courses/${courseId}`;
        console.log(`[DeepScan] Currently in course ${courseId}. Priority scanning modules...`);
        
        // ONLY scan modules and assignments (files link is restricted)
        status.textContent = 'Scanning course modules...';
        await crawlPage(`${courseBase}/modules`, 0, 'Current Course');
        
        status.textContent = 'Scanning assignments...';
        await crawlPage(`${courseBase}/assignments`, 0, 'Current Course');
        await crawlPage(`${courseBase}/syllabus`, 0, 'Current Course');
      }

      // Also search the page for other course links (dashboard or sidebar)
      console.log('[DeepScan] Searching page for course links...');
      chrome.scripting.executeScript({
        target: { tabId: activeTab.id },
        func: () => {
          const courseSelectors = [
            'a[href*="/courses/"]',
            '.ic-DashboardCard__link',
            '.course-list-table-row a',
            '.custom_course_list_item a',
            '#section-tabs a[href*="/courses/"]'
          ];
          
          const courses = [];
          const seenUrls = new Set();

          document.querySelectorAll(courseSelectors.join(',')).forEach(a => {
            try {
              const href = a.href;
              if (/\/courses\/\d+/.test(href) && !/activity_stream|notifications|conversations|grades|calendar|groups|external_tools/i.test(href)) {
                const match = href.match(/(.*\/courses\/\d+)/);
                if (match) {
                  const url = match[1];
                  if (!seenUrls.has(url)) {
                    seenUrls.add(url);
                    let name = 'General';
                    const card = a.closest('.ic-DashboardCard');
                    if (card) {
                      const titleEl = card.querySelector('.ic-DashboardCard__header-title');
                      if (titleEl) name = titleEl.innerText.trim();
                    } else {
                      name = a.innerText.trim() || 'General';
                    }
                    // Clean up name
                    name = name.split('\n')[0].trim().substring(0, 40);
                    courses.push({ url, name });
                  }
                }
              }
            } catch (e) {}
          });
          return courses;
        }
      }, async (results) => {
        const courses = results[0]?.result || [];
        console.log(`[DeepScan] Found ${courses.length} courses to scan.`);
        
        if (courses.length === 0 && !courseMatch) {
          status.textContent = 'No courses found. Navigate to a course or dashboard.';
          return;
        }

        // Scan found courses (limit to first 5 to avoid overloading)
        const coursesToScan = courses.slice(0, 5);
        for (let i = 0; i < coursesToScan.length; i++) {
          const course = coursesToScan[i];
          // Skip if it's the current course (already scanned)
          if (courseMatch && course.url.includes(`/courses/${courseMatch[1]}`)) continue;

          const courseUrl = course.url.replace(/\/$/, '');
          status.textContent = `Scanning modules for ${course.name}...`;
          console.log(`[DeepScan] Scanning course modules: ${course.name} (${courseUrl})`);
          
          await crawlPage(`${courseUrl}/modules`, 0, course.name);
          await crawlPage(`${courseUrl}/assignments`, 0, course.name);
        }
        
        if (discoveredFiles.size > 0) {
          status.textContent = `Scan complete. Found ${discoveredFiles.size} files.`;
        } else {
          status.textContent = 'Scan finished. No files found.';
        }
      });
    });
  }

  refreshBtn.addEventListener('click', () => {
    console.log('[UI] Refreshing scan...');
    // Reset states
    discoveredFiles.clear();
    scannedPages.clear();
    scannedPagesCount = 0;
    linkList.innerHTML = '';
    
    // Check if we should do a simple scan or a deep scan
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const url = tabs[0]?.url || '';
      if (url.includes('canvas')) {
        status.textContent = 'Restarting Canvas deep scan...';
        scanPage();
        deepScanCourses();
      } else {
        scanPage();
      }
    });
  });

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
        filename: checkbox.dataset.filename,
        folder: checkbox.dataset.folder || 'General'
      });
    });
    
    status.textContent = `Downloading ${selected.length} files...`;
  });

  // Automatically trigger scan
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const url = tabs[0]?.url || '';
    
    // Always scan the current page first for immediate results
    scanPage();
    
    // If it's Canvas, also perform a deep scan in the background
    if (url.includes('canvas.inspirededucationschools.com')) {
      console.log('Canvas detected, adding deep scan results...');
      deepScanCourses();
    }
  });
});
