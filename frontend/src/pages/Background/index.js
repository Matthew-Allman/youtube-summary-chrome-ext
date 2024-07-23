console.log('background script working');

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getSelectedText') {
    // Get the active tab where the message is sent from
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];

      if (activeTab && activeTab.id) {
        chrome.scripting.executeScript(
          {
            target: { tabId: activeTab.id },
            files: ['contentScript.bundle.js'],
          },
          () => {
            chrome.tabs.sendMessage(
              activeTab.id,
              { action: 'getSelectedText' },
              (response) => {
                console.log('response', response);

                sendResponse(response);
              }
            );
          }
        );
      } else {
        sendResponse({ error: 'Active tab not found.' });
      }
    });
    return true; // Indicates that the response will be sent asynchronously
  }
});
