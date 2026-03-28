# ✨ TheSkabCode — Sourav's Blog

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![GitHub Pages](https://img.shields.io/badge/Deploy-GitHub%20Pages-blue.svg)](https://pages.github.com/)
[![No Dependencies](https://img.shields.io/badge/Dependencies-None-brightgreen.svg)](#)
[![Pure HTML/CSS/JS](https://img.shields.io/badge/Stack-HTML%20%7C%20CSS%20%7C%20JS-orange.svg)](#)

> **"Blog series by Sourav!"**

A feature-rich, zero-dependency static blog platform with a Markdown editor, Pokémon-themed animated background, and secure admin authentication — all powered by pure HTML, CSS, and JavaScript.

![Dark Mode](https://img.shields.io/badge/Theme-Dark%20%2F%20Light-blueviolet)
![Responsive](https://img.shields.io/badge/Responsive-Desktop%20%7C%20Tablet%20%7C%20Mobile-success)
![XSS Safe](https://img.shields.io/badge/Security-XSS%20Safe%20(DOMPurify)-critical)

---

## 📑 Table of Contents

- [Features](#-features)
- [Markdown Editor](#-markdown-editor)
- [Background Animation](#-background-animation)
- [Authentication](#-authentication)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Deploy to GitHub Pages](#-deploy-to-github-pages)
- [Keyboard Shortcuts](#-keyboard-shortcuts)
- [Important Notes](#-important-notes)
- [License](#-license)

---

## 🚀 Features

| Feature | Description |
|---|---|
| 📝 Markdown Editor | Side-by-side live preview with rich toolbar |
| 🖼️ Cover Images | Set a cover image for each post |
| 💾 Auto-Save Drafts | Drafts saved every 5 seconds automatically |
| 🔍 Search | Search across titles, content, and tags |
| 🏷️ Tag Filtering | Filter posts by tags |
| 📌 Pin Posts | Pin important posts to the top |
| 🔖 Bookmarks / Reading List | Save posts for later (admin only) |
| 🗂️ Archive View | Posts grouped by month |
| 📊 Reading Progress Bar | Visual progress indicator while reading |
| ⏱️ Read Time Badges | Quick Read · Medium · Deep Dive |
| 📖 Table of Contents | Auto-generated sidebar from headings |
| 🔗 Deep Linking | Share direct links via URL hash (`#post-id`) |
| 📤 Share Buttons | Copy link, Twitter/X, LinkedIn |
| 📚 Post Series Navigation | Navigate between posts in a series |
| 🎨 6 Accent Themes | Blue, Green, Purple, Orange, Pink, Teal |
| 🌙 Dark / Light Mode | Toggle between themes |
| ✏️ Custom Subtitle | Editable subtitle (admin) |
| 💾 Export / Import | Backup and restore data as JSON |
| 📱 Responsive Design | Desktop, tablet, and mobile layouts |
| 📄 3 Pre-loaded Posts | BiRefNet, YOLOX, RT-DETR |

---

## ✍️ Markdown Editor

A full-featured Markdown editor with live side-by-side preview.

### Toolbar

| Tool | Description |
|---|---|
| **Bold / Italic / Strikethrough / Underline** | Inline text formatting |
| **H1 – H3** | Heading levels |
| **Bullet / Numbered / Checklist** | List types |
| **Link** | Insert hyperlink |
| **Image URL** | Insert image from URL |
| **📷 Upload Image** | Upload image from device |
| **Inline Code / Code Block** | Code formatting |
| **Blockquote** | Block quotation |
| **Horizontal Rule** | Divider line |
| **Table** | Insert Markdown table |
| **Highlight** | Highlighted text |
| **Superscript / Subscript** | Sup/sub text |
| **😀 Emoji Picker** | Insert emojis |
| **🌐 Import from URL** | Fetch content from a URL (tries 5 CORS proxies; falls back to manual paste modal) |

### Editor Features

- **Expand / Collapse** editor and preview panes independently
- **Inline images** via toolbar upload, paste (`Ctrl+V`), or drag & drop
- **Undo / Redo** with `Ctrl+Z` / `Ctrl+Shift+Z`
- **Word count & read time** in editor footer
- **Markdown cheat sheet** panel
- **Code blocks** with syntax highlighting + copy button

---

## 🌌 Background Animation

A Pokémon-themed animated canvas background with a galaxy scene:

- 🌟 **Galaxy** — Nebula clouds, 200 twinkling stars, shooting stars
- ⚡ **Floating sprites** — Pokéballs, Pikachu, Eevee, Bulbasaur, Charmander, Squirtle, Gengar, Snorlax silhouettes
- 📖 **Reading mode** — Pauses to a static calm galaxy when viewing a blog post
- 🎨 **Theme-aware** — Adapts colors for light and dark mode
- 👁️ Eye-soothing and non-distracting

---

## 🔐 Authentication

- Admin access is protected by a **SHA-256 hashed password**
- The hash is **obfuscated** using hex-escaped reversed chunks with **double-hash verification**
- **No plaintext password** is ever stored in source code
- No GitHub OAuth or external auth services required

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Pure HTML, CSS, JavaScript |
| **Markdown** | [marked.js](https://marked.js.org/) (CDN) |
| **Syntax Highlighting** | [highlight.js](https://highlightjs.org/) (CDN) |
| **Sanitization** | [DOMPurify](https://github.com/cure53/DOMPurify) (CDN) |
| **Icons** | [Font Awesome](https://fontawesome.com/) (CDN) |
| **Storage** | `localStorage` / `sessionStorage` |
| **Build Step** | ❌ None |
| **Dependencies** | ❌ None (`npm` not required) |
| **Backend** | ❌ None |

---

## 📁 Project Structure

```
myNewApp/
├── index.html          # Main HTML entry point
├── css/
│   └── style.css       # All styles (themes, responsive, animations)
├── js/
│   └── app.js          # Application logic
├── assets/             # Static assets
└── README.md           # This file
```

---

## 🏁 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/iamskab/<repo-name>.git
   cd <repo-name>
   ```

2. **Open in browser**
   ```
   Open index.html directly in your browser — no server required.
   ```

3. **Log in as admin** — click the admin button and enter your password.

---

## 🌐 Deploy to GitHub Pages

1. Push the repository to GitHub
2. Go to **Settings → Pages**
3. Set **Branch**: `main`, **Folder**: `/ (root)`
4. Your blog will be live at:
   ```
   https://iamskab.github.io/<repo-name>/
   ```

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl + B` | Bold |
| `Ctrl + I` | Italic |
| `Ctrl + K` | Insert link |
| `Ctrl + Z` | Undo |
| `Ctrl + Shift + Z` | Redo |
| `Ctrl + Enter` | Publish post |
| `Tab` | Indent |
| `Escape` | Close modal / panel |

---

## ⚠️ Important Notes

- **Data is stored in `localStorage`** — it is per-browser and will be lost if browser data is cleared. Use the Export feature to back up your posts.
- **Images are embedded as Base64** — keep individual images under **5 MB** to avoid performance issues.
- **Admin access uses a hashed password** — secure by design, no plaintext ever stored in source.
- **XSS protection** — all rendered Markdown is sanitized through DOMPurify.

---

## 📜 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2025 Sourav Karmakar

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

<p align="center">Built with ❤️ by <strong>Sourav Karmakar</strong> · <a href="https://github.com/iamskab">GitHub @iamskab</a></p>
