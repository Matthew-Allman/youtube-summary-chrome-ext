document.addEventListener('DOMContentLoaded', () => {
  document
    .getElementById('get-highlighted-text')
    .addEventListener('click', () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(
          tabs[0].id,
          { action: 'getSelectedText' },
          (response) => {
            document.getElementById('highlighted-text').textContent =
              response.selectedText;
          }
        );
      });
    });
});
