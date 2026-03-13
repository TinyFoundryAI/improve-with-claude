// ---------------------------------------------------------------------------
// Improve with Claude – background service worker
// ---------------------------------------------------------------------------

const DEFAULT_PROMPT =
  "Improve the following text. Make it clearer, more concise, and well-written. " +
  "Preserve the original meaning and tone. Return only the improved text, nothing else.";

const FUNNY_MESSAGES = [
  "Discobombulating your text...",
  "Teaching your words to dance...",
  "Sprinkling literary fairy dust...",
  "Consulting the grammar goblins...",
  "Polishing each syllable by hand...",
  "Running your prose through the wormhole...",
  "Whispering sweet nothings to Claude...",
  "De-spaghettifying your sentences...",
  "Giving your text a spa day...",
  "Translating from human to eloquent...",
  "Brewing a fresh pot of clarity...",
  "Untangling your dangling modifiers...",
  "Feeding your words to a very smart parrot...",
  "Reticulating splines... just kidding, improving text...",
  "Performing open-heart surgery on your paragraph...",
];

// ---- Context menu setup ---------------------------------------------------

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "improve-with-claude",
    title: "Improve with Claude",
    contexts: ["selection"],
  });
});

// ---- Context menu click handler -------------------------------------------

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId !== "improve-with-claude") return;

  const selectedText = info.selectionText;
  if (!selectedText) return;

  // Show a funny processing notification
  const funnyMsg =
    FUNNY_MESSAGES[Math.floor(Math.random() * FUNNY_MESSAGES.length)];

  chrome.notifications.create("improve-processing", {
    type: "basic",
    iconUrl: "icons/icon128.png",
    title: "Improve with Claude",
    message: funnyMsg,
  });

  try {
    const result = await improveText(selectedText);

    // Copy result to clipboard via offscreen document
    await copyToClipboard(result);

    // Clear the processing notification and show success
    chrome.notifications.clear("improve-processing");
    chrome.notifications.create("improve-done", {
      type: "basic",
      iconUrl: "icons/icon128.png",
      title: "Improve with Claude",
      message: "Ready to paste! Your improved text awaits.",
    });
  } catch (err) {
    chrome.notifications.clear("improve-processing");
    chrome.notifications.create("improve-error", {
      type: "basic",
      iconUrl: "icons/icon128.png",
      title: "Improve with Claude – Error",
      message: err.message || "Something went wrong. Check your API key in the extension settings.",
    });
  }
});

// ---- Claude API call ------------------------------------------------------

async function improveText(text) {
  const { apiKey, systemPrompt } = await chrome.storage.sync.get({
    apiKey: "",
    systemPrompt: DEFAULT_PROMPT,
  });

  if (!apiKey) {
    throw new Error(
      "No API key found. Click the extension icon to add your Anthropic API key."
    );
  }

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      system: systemPrompt || DEFAULT_PROMPT,
      messages: [
        {
          role: "user",
          content: text,
        },
      ],
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    if (response.status === 401) {
      throw new Error("Invalid API key. Please check your settings.");
    }
    throw new Error(`API error ${response.status}: ${body}`);
  }

  const data = await response.json();
  const content = data?.content?.[0]?.text;
  if (!content) {
    throw new Error("Received an empty response from Claude.");
  }
  return content;
}

// ---- Clipboard via offscreen document ------------------------------------

let creatingOffscreen = null;

async function ensureOffscreenDocument() {
  const existingContexts = await chrome.runtime.getContexts({
    contextTypes: ["OFFSCREEN_DOCUMENT"],
    documentUrls: [chrome.runtime.getURL("offscreen.html")],
  });

  if (existingContexts.length > 0) return;

  if (creatingOffscreen) {
    await creatingOffscreen;
    return;
  }

  creatingOffscreen = chrome.offscreen.createDocument({
    url: "offscreen.html",
    reasons: ["CLIPBOARD"],
    justification: "Write improved text to the clipboard",
  });

  await creatingOffscreen;
  creatingOffscreen = null;
}

async function copyToClipboard(text) {
  await ensureOffscreenDocument();

  // Send the text to the offscreen document which will write it to clipboard
  return new Promise((resolve, reject) => {
    const listener = (message) => {
      if (message.type === "clipboard-result") {
        chrome.runtime.onMessage.removeListener(listener);
        if (message.success) resolve();
        else reject(new Error(message.error || "Clipboard write failed"));
      }
    };
    chrome.runtime.onMessage.addListener(listener);

    chrome.runtime.sendMessage({
      type: "copy-to-clipboard",
      text,
    });

    // Timeout after 5 seconds
    setTimeout(() => {
      chrome.runtime.onMessage.removeListener(listener);
      reject(new Error("Clipboard write timed out"));
    }, 5000);
  });
}
