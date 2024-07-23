function getSelectedText() {
  let selectedText = '';

  if (window.getSelection) {
    selectedText = window.getSelection().toString();
  }

  return selectedText;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getSelectedText') {
    const selectedText = getSelectedText();

    sendResponse({ selectedText });
  }
});
