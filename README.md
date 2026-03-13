<p align="center">
  <img src="logo.svg" alt="Improve with Claude" width="128" height="128" />
</p>

<h1 align="center">Improve with Claude</h1>

<p align="center">
  A Chrome extension that improves any selected text using Claude AI.<br/>
  Select. Right-click. Improve. Paste.<br/><br/>
  <em>"Discobombulating your text..." and 14 other delightful processing messages included.</em>
</p>

---

## How it works

1. **Select** any text on a webpage.
2. **Right-click** and choose **"Improve with Claude"**.
3. A fun notification pops up while Claude works its magic — you might see *"Teaching your words to dance..."* or *"Consulting the grammar goblins..."*
4. The improved text is **copied to your clipboard** automatically.
5. **Paste** wherever you need it.

## Installation

1. Clone or download this repository:
   ```bash
   git clone https://github.com/TinyFoundryAI/improve-with-claude.git
   ```
2. Open `chrome://extensions/` in Chrome.
3. Enable **Developer mode** (top-right toggle).
4. Click **Load unpacked** and select the cloned folder.
5. Click the extension icon in the toolbar and enter your Anthropic API key.

> **Need an API key?** Sign up at [console.anthropic.com](https://console.anthropic.com/), then create a new key under **API Keys**.

## Settings

Click the extension icon to open the settings popup:

- **API Key** — Your Anthropic API key (stored locally in Chrome sync storage, never sent anywhere except the Anthropic API).
- **System Prompt** — Customize how Claude improves your text. The default prompt asks for clearer, more concise writing while preserving meaning and tone. Edit it to fit your style — make it more formal, more casual, translate to another language, whatever you want.

## Privacy

- Your text is sent **directly to the Anthropic API** — no intermediary servers.
- No data is collected, stored, or shared.
- Your API key lives in Chrome's sync storage and is only used for API authentication.

## Technical details

| | |
|---|---|
| **Manifest** | V3 with service worker |
| **Model** | `claude-sonnet-4-20250514` |
| **Clipboard** | Offscreen Documents API (required for MV3 service workers) |
| **Storage** | `chrome.storage.sync` |

## Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

## License

MIT — see [LICENSE](LICENSE).
