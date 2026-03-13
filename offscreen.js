// Offscreen document – handles clipboard writes on behalf of the service worker.

chrome.runtime.onMessage.addListener((message) => {
  if (message.type !== "copy-to-clipboard") return;

  const textarea = document.getElementById("clipboard-area");
  textarea.value = message.text;
  textarea.select();

  let success = false;
  try {
    success = document.execCommand("copy");
  } catch (e) {
    // fall through
  }

  // Also try the modern API as a fallback
  if (!success && navigator.clipboard) {
    navigator.clipboard.writeText(message.text).then(
      () => {
        chrome.runtime.sendMessage({ type: "clipboard-result", success: true });
      },
      (err) => {
        chrome.runtime.sendMessage({
          type: "clipboard-result",
          success: false,
          error: err.message,
        });
      }
    );
    return;
  }

  chrome.runtime.sendMessage({ type: "clipboard-result", success });
});
