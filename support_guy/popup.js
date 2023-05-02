document.getElementById("generateResponse").addEventListener("click", () => {
  console.log("Popup button clicked");
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "triggerGenerateResponse" });
  });
});