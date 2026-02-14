// Background script to handle downloads
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "downloadFile") {
    const folder = request.folder ? request.folder.replace(/[\\/:*?"<>|]/g, '_') : 'General';
    chrome.downloads.download({
      url: request.url,
      filename: `Memoray/${folder}/${request.filename}`,
      conflictAction: 'uniquify'
    }, (downloadId) => {
      if (chrome.runtime.lastError) {
        console.error('Download failed:', chrome.runtime.lastError);
      } else {
        console.log('Download started with ID:', downloadId);
      }
    });
  }
});
