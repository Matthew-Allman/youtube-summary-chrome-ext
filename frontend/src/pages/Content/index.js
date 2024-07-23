console.log('Content script loaded');

function getSelectedText() {
  let selectedText = '';

  if (window.getSelection) {
    selectedText = window.getSelection().toString();
  }

  console.log('selectedText', selectedText);

  return selectedText;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('request', request);

  if (request.action === 'getSelectedText') {
    const selectedText = getSelectedText();

    console.log('selectedText', selectedText);

    sendResponse({ selectedText });
  }
});
