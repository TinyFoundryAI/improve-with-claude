// ---------------------------------------------------------------------------
// Improve with Claude – popup settings page
// ---------------------------------------------------------------------------

const DEFAULT_PROMPT =
  "Improve the following text. Make it clearer, more concise, and well-written. " +
  "Preserve the original meaning and tone. Return only the improved text, nothing else.";

const $apiKey = document.getElementById("api-key");
const $prompt = document.getElementById("system-prompt");
const $save = document.getElementById("save-btn");
const $reset = document.getElementById("reset-btn");
const $toggle = document.getElementById("toggle-key");
const $status = document.getElementById("status");

// ---- Load saved settings --------------------------------------------------

chrome.storage.sync.get({ apiKey: "", systemPrompt: DEFAULT_PROMPT }, (data) => {
  $apiKey.value = data.apiKey;
  $prompt.value = data.systemPrompt;
});

// ---- Save -----------------------------------------------------------------

$save.addEventListener("click", () => {
  const apiKey = $apiKey.value.trim();
  const systemPrompt = $prompt.value.trim() || DEFAULT_PROMPT;

  if (!apiKey) {
    showStatus("Please enter an API key.", "error");
    return;
  }

  chrome.storage.sync.set({ apiKey, systemPrompt }, () => {
    showStatus("Settings saved!", "success");
  });
});

// ---- Reset prompt to default ----------------------------------------------

$reset.addEventListener("click", () => {
  $prompt.value = DEFAULT_PROMPT;
  showStatus("Prompt reset to default (remember to save).", "success");
});

// ---- Show / hide API key --------------------------------------------------

$toggle.addEventListener("click", () => {
  const isPassword = $apiKey.type === "password";
  $apiKey.type = isPassword ? "text" : "password";
  $toggle.textContent = isPassword ? "Hide" : "Show";
});

// ---- Status helper --------------------------------------------------------

function showStatus(msg, type) {
  $status.textContent = msg;
  $status.className = "status " + type;
  setTimeout(() => {
    $status.textContent = "";
    $status.className = "status";
  }, 3000);
}
