console.log("Background is running");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Received message:", request);
  if (request.action === "generateResponse") {
    makeApiCall(request.email.body, sendResponse);
    return true;
  }
});

function makeApiCall(emailBody, sendResponse) {
  console.log("makeApiCall function called");

  const apiURL = "http://127.0.0.1:8000/generate_response/";

  fetch(`${apiURL}?email=${encodeURIComponent(emailBody)}`, {
    method: "GET",
  })
    .then((response) => {
      console.log("Response:", response);
      return response.json();
    })
    .then((data) => {
      console.log("Success:", data.response);
      sendResponse({ response: data.response });
    })
    .catch((error) => {
      console.error("Error:", error);
      sendResponse({ error: error });
    });

  return true;
}
