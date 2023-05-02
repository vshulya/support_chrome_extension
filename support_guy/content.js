console.log("Content script is running");

const script1 = document.createElement("script");
script1.src = chrome.runtime.getURL("jquery.js");
(document.head || document.documentElement).appendChild(script1);

const script2 = document.createElement("script");
script2.src = chrome.runtime.getURL("gmail.js");
(document.head || document.documentElement).appendChild(script2);

function waitForGmail(callback) {
  console.log("Waiting for Gmail.js to load");
  if (typeof Gmail === "undefined") {
    setTimeout(() => waitForGmail(callback), 100);
  } else {
    console.log("Gmail.js is loaded");
    callback();
  }
}

function extractEmailData() {
  const subject =
    document.querySelector("h2[data-legacy-thread-id]")?.innerText.trim() || "";
  const body = document.querySelector(".a3s.aiL")?.innerText.trim() || "";

  return {
    subject: subject,
    body: body,
  };
}

function handleViewThread() {
  console.log("Viewing an email thread");

  setTimeout(() => {
    const emailData = extractEmailData();
    console.log("Extracted email data:", emailData);

    if (emailData.subject || emailData.body) {
      $("div[role='tabpanel']").append(
        "<button id='generateResponse'>Generate Response</button>"
      );

      chrome.runtime.onMessage.addListener(onMessageListener);
    } else {
      console.warn(
        "Email data is not available or has an unexpected structure."
      );
    }
  }, 1000);
}

waitForGmail(() => {
  const gmail = new Gmail();

  function handleViewThread() {
    console.log("Viewing an email thread");

    setTimeout(() => {
      const emailData = extractEmailData();
      console.log("Extracted email data:", emailData);

      if (emailData.subject || emailData.body) {
        $("div[role='tabpanel']").append(
          "<button id='generateResponse'>Generate Response</button>"
        );

        chrome.runtime.onMessage.addListener(onMessageListener);
      } else {
        console.warn(
          "Email data is not available or has an unexpected structure."
        );
      }
    }, 1000);
  }

  gmail.observe.on("view_thread", handleViewThread);

  gmail.observe.before("view_thread", () => {
    chrome.runtime.onMessage.removeListener(onMessageListener);
    $("button#generateResponse").remove(); // Remove the Generate Response button
  });

  function onMessageListener(request, sender, sendResponse) {
    if (request.action === "triggerGenerateResponse") {
      console.log("Handling triggerGenerateResponse message");
      const emailData = extractEmailData();
      chrome.runtime.sendMessage(
        { action: "generateResponse", email: emailData },
        (response) => {
          console.log("Message sent to background.js");

          if (response.error) {
            console.error("Error while generating response:", response.error);
          } else {
            console.log("Received response from GPT:", response.response);
            composeEmail(response.response);
          }
        }
      );
    }
  }

  function composeEmail(response) {
    console.log("composeEmail called with response:", response);

    const replyButton = $("div[role='button'][aria-label*='Reply']").first();

    if (replyButton.length > 0) {
      console.log("Clicking on the reply button");
      replyButton.click();

      setTimeout(() => {
        const replyComposer = $(
          "div[aria-label='Message Body'][role='textbox']"
        ).first();

        if (replyComposer.length > 0) {
          console.log("Setting the response in the reply composer");
          replyComposer.text(response);
        } else {
          console.error("Could not find the reply composer");
        }
      }, 1000);
    } else {
      console.error("Could not find the reply button");
    }
  }

  // Add a click event listener for the Generate Response button
  $(document).on("click", "#generateResponse", () => {
    chrome.runtime.sendMessage({ action: "triggerGenerateResponse" });
  });
});
