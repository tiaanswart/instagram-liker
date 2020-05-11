// Called when the user clicks on the browser action icon.
chrome.browserAction.onClicked.addListener(function() {
  chrome.tabs.query({ url: ['https://instagram.com/', 'https://instagram.com/*'] }, function(tabs) {
    if (tabs.length) {
      chrome.tabs.highlight({ tabs: [tabs[0].index] });
      chrome.tabs.reload(tabs[0].tabId);
    } else {
      chrome.tabs.create({ url: 'https://instagram.com/' });
    }
  });
});