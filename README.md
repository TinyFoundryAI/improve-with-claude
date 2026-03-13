# Improve with Claude – Chrome Extension

A lightweight Chrome extension that improves any selected text using Claude. Select, right-click, improve, paste.

## How it works

1. **Select** any text on a webpage.
2. **Right-click** and choose **"Improve with Claude"**.
3. A fun notification appears while Claude processes your text.
4. The improved text is **copied to your clipboard** automatically.
5. **Paste** wherever you need it.

## Installation

1. Clone or download this repository.
2. Open `chrome://extensions/` in Chrome.
3. Enable **Developer mode** (top-right toggle).
4. Click **Load unpacked** and select this folder.
5. Click the extension icon and enter your [Anthropic API key](https://console.anthropic.com/).

## Settings

Click the extension icon to open the popup where you can:

- **API Key** – Your Anthropic API key (stored in Chrome sync storage).
- **System Prompt** – Customize how Claude improves your text. A sensible default is provided.

## Files

```
manifest.json       Manifest V3 configuration
background.js       Service worker – context menu, API calls, notifications, clipboard
offscreen.html/js   Offscreen document for clipboard writes
popup.html/js/css   Settings popup UI
icons/              Extension icons (16, 32, 48, 128 px)
```

## Technical details

- **Manifest V3** with a service worker (no persistent background page).
- Uses the **Anthropic Messages API** with `claude-sonnet-4-20250514`.
- Clipboard writes use the **Offscreen Documents API** (required in MV3 service workers).
- Settings are persisted with `chrome.storage.sync`.
- Funny processing notifications rotate through 15 messages.

## Privacy

Your text is sent directly to the Anthropic API. No data is collected, stored, or sent anywhere else. Your API key is stored locally in Chrome's sync storage.

## License

MIT – see [LICENSE](LICENSE).
