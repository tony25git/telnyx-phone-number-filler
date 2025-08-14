# Telnyx Phone Number Filler Browser Extension

A Chrome/Edge browser extension that formats numbers and pastes them directly into active websites.

## Features

- Format numbers in multiple styles (decimal, currency, percentage, scientific, plain)
- Customizable separators (newline, comma, semicolon, tab, space)
- Add custom prefix and suffix to formatted numbers
- Real-time preview of formatted output  
- Direct paste into input fields, textareas, and contenteditable elements
- Works with any website (except Chrome internal pages)

## Installation

1. Open Chrome/Edge and go to Extensions page:
   - Chrome: `chrome://extensions/`
   - Edge: `edge://extensions/`

2. Enable "Developer mode" (toggle in top-right corner)

3. Click "Load unpacked"

4. Select the "Telnyx Phone Number Filler Extension" folder

5. The extension icon will appear in your browser toolbar

## Usage

1. Navigate to any website with input fields
2. Click the extension icon in your browser toolbar
3. Enter your numbers in the text area (one per line or comma-separated)
4. Choose your formatting options:
   - **Format**: Decimal, Currency, Percentage, Scientific, Plain
   - **Decimal Places**: 0-10 decimal places
   - **Separator**: How to separate multiple numbers
   - **Prefix/Suffix**: Optional text before/after each number
5. Preview the formatted result
6. Click "Paste to Active Page" to insert the formatted numbers

## Supported Input Types

The extension can paste into:
- Text inputs (`<input type="text">`)
- Email inputs (`<input type="email">`) 
- Tel inputs (`<input type="tel">`)
- Number inputs (`<input type="number">`)
- Text areas (`<textarea>`)
- Contenteditable elements

## Examples

**Input:** `1234.56, 7890.12`
**Format:** Currency, 2 decimals, comma separator
**Output:** `$1,234.56, $7,890.12`

**Input:** `0.1234, 0.5678`  
**Format:** Percentage, 1 decimal, newline separator
**Output:** 
```
12.3%
56.8%
```

## Troubleshooting

- **"Cannot paste to Chrome internal pages"**: The extension cannot access chrome:// or extension pages for security reasons
- **"Failed to paste"**: Click on an input field on the webpage first, then try pasting again
- **No suitable input field found**: Make sure the webpage has text inputs, textareas, or contenteditable elements

## Privacy

This extension:
- Only accesses the active tab when you click "Paste"
- Does not collect or store any data
- Does not send data to external servers
- Only runs when you explicitly use it