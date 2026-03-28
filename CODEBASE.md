# 🧬 TheSkabCode — Codebase Documentation

> A complete technical reference for every module, function, and design decision in the codebase.

---

## 📁 File Overview

| File | Lines | Purpose |
|------|-------|---------|
| `index.html` | 277 | Main HTML — all UI sections, modals, editor, navbar |
| `css/style.css` | 1127 | All styles — themes, accents, responsive, animations |
| `js/app.js` | 2289 | Entire application logic — editor, auth, rendering, background |
| `README.md` | 230 | User-facing documentation |
| `CODEBASE.md` | — | This file (developer documentation) |

---

## 🏗️ Architecture

The app is a **single-page application (SPA)** built with zero dependencies (no frameworks, no build tools). Everything runs client-side.

```
┌──────────────────────────────────────────────┐
│                  index.html                   │
│  ┌──────────┐ ┌──────────┐ ┌──────────────┐  │
│  │  Navbar   │ │   Hero   │ │  Blog List   │  │
│  └──────────┘ └──────────┘ └──────────────┘  │
│  ┌──────────┐ ┌──────────┐ ┌──────────────┐  │
│  │ Post View│ │  Editor  │ │   Modals     │  │
│  └──────────┘ └──────────┘ └──────────────┘  │
│  ┌──────────────────────────────────────────┐ │
│  │         Canvas (bg-canvas)               │ │
│  └──────────────────────────────────────────┘ │
└──────────────────────────────────────────────┘
         ▼               ▼              ▼
    css/style.css     js/app.js     CDN Libraries
                                   (marked, hljs,
                                    DOMPurify, FA)
```

### Data Flow

```
User Action → Event Listener → State Update → localStorage → Re-render DOM
```

All data lives in `localStorage` (posts, bookmarks, theme, accent, drafts) and `sessionStorage` (auth).

---

## 📄 index.html — Structure

### Sections (in order)

| Section | ID | Description |
|---------|-----|-------------|
| Background Canvas | `bg-canvas` | Full-screen fixed canvas for Pokémon + galaxy animation |
| Reading Progress | `reading-progress` | Top gradient bar shown during post reading |
| Navbar | `.navbar` | Brand, search, accent picker, theme toggle, bookmarks, archive, admin |
| Hero | `hero-section` | Title, subtitle ("Blog series by Sourav!"), stats |
| Tag Filter Bar | `controls-bar` | Dynamic tag filter buttons |
| Blog List | `blog-list` | Grid of blog post cards |
| Archive View | `archive-view` | Posts grouped by month/year |
| Bookmarks View | `bookmarks-view` | Saved reading list (admin only) |
| Empty State | `empty-state` | Shown when no posts match filters |
| Post View | `post-view` | Full blog post reader with TOC sidebar |
| Editor Modal | `editor-modal` | Full Markdown editor overlay |
| Toast Container | `toast-container` | Bottom-right notification stack |
| Confirm Dialog | `confirm-dialog` | Delete confirmation modal |
| Footer | `.site-footer` | Sticky footer with credits + export/import |

### CDN Dependencies

```html
<!-- CSS -->
<link href="highlight.js/github-dark.min.css" />  <!-- Code highlighting theme -->
<link href="font-awesome/all.min.css" />            <!-- Icons -->

<!-- JS -->
<script src="marked/marked.min.js"></script>        <!-- Markdown → HTML parser -->
<script src="highlight.js/highlight.min.js"></script><!-- Syntax highlighting -->
<script src="dompurify/purify.min.js"></script>      <!-- XSS sanitization -->
```

---

## 🎨 css/style.css — Styling Architecture

### CSS Variables System

The entire theme is driven by CSS custom properties:

```
:root
├── --font-sans, --font-mono       (typography)
├── --max-width: 1280px            (content width)
├── --radius, --radius-sm          (border radius)
└── --transition: 0.25s ease       (animation timing)

[data-accent="blue|green|purple|orange|pink|teal"]
├── --accent, --accent-hover       (primary color)
├── --accent-glow                  (background glow)
├── --gradient                     (gradient for text/badges)
├── --tag-bg, --tag-text           (tag pill colors)

[data-theme="dark|light"]
├── --bg, --bg-card, --bg-elevated (backgrounds)
├── --border                       (borders)
├── --text, --text-muted, --text-dim (text colors)
├── --danger, --success            (status colors)
├── --shadow, --shadow-sm          (box shadows)
├── --code-bg                      (code block background)
└── --overlay                      (modal overlay)
```

### Key Style Sections

| Section | Lines | Description |
|---------|-------|-------------|
| Variables & Accents | 1–22 | 6 accent palettes, CSS variables |
| Dark/Light Themes | 23–57 | Color tokens for both themes |
| Reset & Body | 59–76 | Box-sizing reset, flexbox body for sticky footer |
| Canvas | 78–85 | Fixed background canvas, `opacity: 0.5` in light theme |
| Navbar | 96–141 | Sticky nav with search, backdrop blur |
| Buttons | 176–277 | `.btn-icon`, `.btn-primary`, `.btn-secondary`, `.btn-danger`, `.btn-github` |
| Hero | 308–342 | Centered title, gradient text, stats |
| Blog Cards | 405–520 | Grid cards with hover effects, gradient bottom border, cover zoom |
| Post View | 569–654 | Two-column layout (content + TOC sidebar) |
| Markdown Content | 688–746 | Rendered post styles (headings, code, tables, blockquotes) |
| Editor Modal | 768–1065 | Full-screen editor, split panes, toolbar |
| Pane Toggle | 1042–1049 | `.editor-expanded` / `.preview-expanded` classes |
| Toasts | 1068–1096 | Slide-in notifications |
| Responsive | 1096–1127 | Breakpoints at 900px, 768px, 480px |

### Blog Card Hover Effects

```css
.blog-card:hover {
  border-color: var(--accent);
  box-shadow: 0 8px 30px rgba(0,0,0,0.2);
  transform: translateY(-4px);       /* Lift effect */
}
.blog-card::after {
  /* Gradient line at bottom, fades in on hover */
  background: var(--gradient);
  opacity: 0 → 1;
}
.blog-card:hover h3 { color: var(--accent); }          /* Title color change */
.blog-card:hover .blog-card-cover { transform: scale(1.03); } /* Cover zoom */
```

---

## ⚙️ js/app.js — Application Logic

The entire app is wrapped in an **IIFE** (Immediately Invoked Function Expression) with `'use strict'` to avoid polluting the global scope.

```javascript
(() => {
  'use strict';
  // ... entire app
})();
```

### Module Map

```
app.js (2289 lines)
├── Constants & Config          (lines 8–27)
├── State Variables             (lines 37–49)
├── DOM References              (lines 53–108)
├── Marked Configuration        (lines 110–117)
├── Default Blog Posts          (lines 120–818)
├── Storage (CRUD)              (lines 820–843)
├── Authentication              (lines 845–936)
├── Theme & Accent              (lines 919–942)
├── Utilities                   (lines 944–990)
├── Toast & Confirm             (lines 992–1008)
├── Sorting                     (lines 1010–1016)
├── Render (Blog List)          (lines 1018–1082)
├── View Post                   (lines 1084–1160)
├── Series Navigation           (lines 1162–1178)
├── Table of Contents           (lines 1180–1196)
├── Reading Progress            (lines 1198–1208)
├── Code Copy Buttons           (lines 1210–1230)
├── Navigation (goHome/hide)    (lines 1232–1252)
├── Undo/Redo                   (lines 1254–1290)
├── Auto-save Drafts            (lines 1292–1314)
├── Editor (open/close/publish) (lines 1316–1440)
├── Delete / Pin / Bookmark     (lines 1442–1480)
├── Archive & Bookmarks View    (lines 1482–1530)
├── Share (copy/twitter/linkedin)(lines 1532–1544)
├── Toolbar Actions             (lines 1546–1564)
├── Image Handling              (lines 1534–1564)
├── HTML→Markdown Converter     (lines 1566–1662)
├── Import from URL             (lines 1664–1740)
├── Pane Expand/Collapse        (lines 1742–1770)
├── Emoji Picker                (lines 1772–1778)
├── Export/Import Data          (lines 1780–1795)
├── Keyboard Shortcuts          (lines 1796–1830)
├── Deep Link Support           (lines 1832–1838)
├── Event Bindings              (lines 1840–2020)
├── Pokémon Background          (lines 2022–2610)
├── Init                        (lines 2612–2633)
```

---

### 🔐 Authentication System

**Approach**: SHA-256 hashed password with multi-layer obfuscation.

```
Password → SHA-256 → Hash₁
                       ↓
              Compare with reconstructed hash
              (4 reversed hex-escaped chunks)
                       ↓
            Hash₁ → SHA-256 → Hash₂
                       ↓
              Compare with second reconstructed hash
              (2 reversed hex-escaped chunks)
                       ↓
              Both match? → Grant admin access
```

**Why obfuscated?**
- The hash is split into **4 reversed chunks** stored as **hex-escaped strings** (`\x65\x36...`)
- Variable names are obfuscated (`_0xc`, `_0xv`, `_0xh`, `_0xr`, `_0xcheck`)
- **Double SHA-256 verification** — even reconstructing the first hash doesn't help without the second check
- No variable named "password" or "hash" near the verification code

**Key functions:**
| Function | Purpose |
|----------|---------|
| `_0xh(s)` | SHA-256 hash using Web Crypto API |
| `_0xr(s)` | Reverse a string |
| `_0xcheck(input)` | Full verification: hash → compare → double-hash → compare |
| `loginAsAdmin()` | Prompt for password → verify → set `authUser` |
| `isAdmin()` | Check if `authUser.isAdmin === true` |
| `updateAuthUI()` | Show/hide admin-only elements based on auth state |

**Storage**: `sessionStorage` (cleared when tab closes).

---

### 📝 Editor System

#### Opening the Editor

```
openEditor(post?)
├── If post is null → New post mode
│   ├── Check for saved draft in localStorage
│   └── Restore draft if found
├── If post exists → Edit mode
│   └── Populate fields from post data
├── Reset undo/redo history
├── Start auto-save timer (every 5s)
└── Show modal
```

#### Publishing

```
publishPost()
├── Validate title & content
├── If editingId → Update existing post
├── Else → Create new post with generated ID
├── Save to localStorage
├── Clear draft
├── Close editor
└── Go home & re-render
```

#### Toolbar Actions

| Action | Markdown Inserted |
|--------|-------------------|
| `bold` | `**selected**` |
| `italic` | `*selected*` |
| `strikethrough` | `~~selected~~` |
| `underline` | `<u>selected</u>` |
| `h1/h2/h3` | `\n# / ## / ###` |
| `ul/ol` | `\n- / \n1.` |
| `checklist` | `\n- [ ]` |
| `link` | `[selected](url)` |
| `image` | `![alt](url)` |
| `code` | `` `selected` `` |
| `codeblock` | ` ```javascript\n...\n``` ` |
| `blockquote` | `\n>` |
| `table` | Full markdown table template |
| `highlight` | `<mark>selected</mark>` |
| `superscript` | `<sup>selected</sup>` |
| `subscript` | `<sub>selected</sub>` |
| `inline-image` | Opens file picker → base64 embed |

#### Pane Expand/Collapse

```
togglePaneExpand('editor' | 'preview')
├── 'editor' → .editor-panes.add('editor-expanded')
│              .pane-preview { display: none }
├── 'preview' → .editor-panes.add('preview-expanded')
│               .pane-editor { display: none }
└── Toggle again → restore side-by-side (1fr 1fr)
```

---

### 🌐 Import from URL

#### Flow

```
importFromUrl()
├── Prompt user for URL
├── Try 5 CORS proxies sequentially (8s timeout each):
│   ├── api.codetabs.com
│   ├── corsproxy.io
│   ├── api.allorigins.win
│   ├── cors-anywhere.herokuapp.com
│   └── thingproxy.freeboard.io
├── If proxy succeeds → htmlToMarkdown(html, url)
└── If ALL fail → showPasteImportModal(url)
    ├── Show modal with instructions
    ├── User pastes content manually
    ├── Detect HTML vs plain text
    └── Convert and populate editor
```

#### HTML → Markdown Converter

`htmlToMarkdown(html, baseUrl)` — Recursive DOM walker:

| HTML Element | Markdown Output |
|-------------|-----------------|
| `<h1>-<h6>` | `# ` to `#####` |
| `<p>`, `<div>` | Content + `\n\n` |
| `<strong>`, `<b>` | `**text**` |
| `<em>`, `<i>` | `*text*` |
| `<code>` | `` `text` `` |
| `<pre><code>` | ` ```lang\ncode\n``` ` |
| `<a href>` | `[text](absoluteUrl)` |
| `<img src>` | `![alt](absoluteUrl)` |
| `<li>` | `- text` |
| `<blockquote>` | `> text` |
| `<table>` | Full markdown table with `---` separator |
| `<hr>` | `---` |

- **Relative URLs** are resolved to absolute using the source page URL
- **Scripts/styles/nav/footer** are stripped before processing

---

### 🎨 Rendering System

#### Blog List Render Cycle

```
render()
├── Get search query from input
├── Filter posts by:
│   ├── Search text (title, content, tags)
│   └── Active tag filter
├── Sort: newest first, pinned on top
├── Update hero stats (post count, tag count)
├── Render tag filter bar
├── If no results → Show empty state
└── Else → Generate card HTML for each post
    ├── Pin badge (if pinned)
    ├── Bookmark badge (if bookmarked)
    ├── Cover image (if present)
    ├── Meta (author, date, read time)
    ├── Title, excerpt (3-line clamp)
    ├── Tags
    └── Read time badge
```

#### Post View

```
viewPost(id)
├── Find post by ID
├── Hide all sections, show post view
├── Pause background animation → static galaxy
├── Render metadata (author, date, read time)
├── Parse Markdown → HTML (marked.js)
├── Sanitize HTML (DOMPurify)
├── Add code copy buttons to <pre> blocks
├── Build Table of Contents from headings
├── Render series navigation (if part of series)
└── Update pin/bookmark button states
```

---

### 🌌 Background Animation System

The animated background renders on a fixed `<canvas>` behind all content.

#### Layer Architecture

```
Layer 1: Nebula Clouds (5 gradient ellipses, slowly drifting)
Layer 2: Stars (200 twinkling dots with cross-glow)
Layer 3: Shooting Stars (random spawns, fade trails)
Layer 4: Sparkles (45 pulsing accent-colored dots)
Layer 5: Pokémon (20 floating silhouettes)
```

#### Pokémon Drawing Functions

Each Pokémon is drawn using pure Canvas 2D API calls (no images):

| Function | Character | Color |
|----------|-----------|-------|
| `drawPokeball()` | Pokéball | Red/White |
| `drawPikachu()` | Pikachu silhouette | Accent color |
| `drawEevee()` | Eevee silhouette | Accent color |
| `drawBulbasaur()` | Bulbasaur | `#4ecdc4` teal + green bulb |
| `drawCharmander()` | Charmander | `#ff8c42` orange + flame |
| `drawSquirtle()` | Squirtle | `#5bc0eb` blue + brown shell |
| `drawGengar()` | Gengar | `#7b5ea7` purple + red eyes |
| `drawSnorlax()` | Snorlax | `#2d4059` dark + cream belly |

#### Animation States

| State | Trigger | Behavior |
|-------|---------|----------|
| **Running** | Home page | Full animation loop at 60fps |
| **Paused (static)** | Reading a post | Draws one frame of calm galaxy (nebulae + dim stars), no animation loop |
| **Resumed** | Click "Back" | Restarts `requestAnimationFrame` loop |
| **Reinitialized** | Theme toggle | Regenerates stars/nebulae with theme-appropriate colors |

#### Theme Adaptation

| Element | Dark Theme | Light Theme |
|---------|-----------|-------------|
| Canvas opacity | `1.0` | `0.5` |
| Star colors | White, warm, cool | Muted grays, tans |
| Nebula colors | Vibrant (blue, purple, pink) | Pastel (cornflower, lavender, peach) |

---

### 💾 Storage Schema

#### localStorage Keys

| Key | Type | Content |
|-----|------|---------|
| `theskabcode_posts` | `Array<Post>` | All blog posts |
| `theskabcode_theme` | `string` | `"dark"` or `"light"` |
| `theskabcode_accent` | `string` | `"blue"`, `"green"`, etc. |
| `theskabcode_subtitle` | `string` | (legacy, cleared on load) |
| `theskabcode_bookmarks` | `Array<string>` | Post IDs |
| `theskabcode_views` | `Object` | `{ postId: count }` |
| `theskabcode_draft` | `Object` | Auto-saved editor state |

#### Post Object Schema

```javascript
{
  id: string,          // e.g. "lq3x7k2m9"
  title: string,
  content: string,     // Raw Markdown
  tags: string[],      // e.g. ["python", "deep-learning"]
  series?: string,     // Optional series name
  cover: string,       // Base64 data URL or empty
  pinned: boolean,
  createdAt: number,   // Date.now() timestamp
  updatedAt: number|null
}
```

#### sessionStorage Keys

| Key | Type | Content |
|-----|------|---------|
| `theskabcode_auth` | `Object` | `{ isAdmin: true }` |

---

### 🔄 Event Binding Map

All events are bound in the `bindEvents()` function:

| Element | Event | Handler |
|---------|-------|---------|
| `#nav-home` | click | `goHome()` |
| `#btn-theme` | click | `toggleTheme()` |
| `#btn-login` | click | `loginAsAdmin()` |
| `#btn-logout` | click | `logout()` |
| `#btn-new-post` | click | `openEditor()` |
| `#btn-archive` | click | `showArchive()` |
| `#btn-bookmarks` | click | `showBookmarks()` |
| `#search-input` | input | `render()` |
| `.blog-card` | click (delegated) | `viewPost(id)` |
| `.tag-filter` | click (delegated) | Set `activeTag` → `render()` |
| `#btn-back` | click | `goHome()` |
| `#btn-edit` | click | `openEditor(post)` |
| `#btn-delete` | click | `deletePost(id)` |
| `#btn-pin-post` | click | `togglePin(id)` |
| `#btn-bookmark-post` | click | `toggleBookmark(id)` |
| `#btn-publish` | click | `publishPost()` |
| `#btn-fullscreen` | click | Toggle `.fullscreen` class |
| `#btn-import-url` | click | `importFromUrl()` |
| `#btn-expand-editor` | click | `togglePaneExpand('editor')` |
| `#btn-expand-preview` | click | `togglePaneExpand('preview')` |
| `#editor-textarea` | input | `saveSnapshot()` + `updatePreview()` |
| `#editor-textarea` | paste | Handle pasted images |
| `#editor-textarea` | drop | Handle dropped images |
| `document` | keydown | Editor shortcuts |
| `window` | scroll | `updateReadingProgress()` |
| `window` | hashchange | `handleHash()` |
| `window` | resize | Resize canvas |

---

### 🚀 Initialization Sequence

```javascript
init()
├── initTheme()          // Apply saved dark/light theme
├── initAccent()         // Apply saved accent color
├── loadPosts()          // Load from localStorage (+ seed defaults)
├── loadBookmarks()      // Load bookmarked post IDs
├── loadViews()          // Load view counts
├── loadSubtitle()       // Clear legacy subtitle cache
├── loadAuth()           // Restore session from sessionStorage
├── initEmojiPicker()    // Populate emoji grid
├── initBgCanvas()       // Start background animation
├── bindEvents()         // Attach all event listeners
├── updateAuthUI()       // Show/hide admin elements
├── render()             // Render blog list
└── handleHash()         // Check URL for deep link (#post-id)
```

---

### 📦 Default Blog Posts

Three posts are pre-loaded when `localStorage` has no existing default posts:

| ID | Title | Tags | Pinned |
|----|-------|------|--------|
| `birefnet-001` | BiRefNet: Bilateral Reference Network | deep-learning, computer-vision, segmentation | ✅ Yes |
| `yolox-002` | YOLOX: Real-Time Object Detection | deep-learning, object-detection, yolo | No |
| `rtdetr-003` | RT-DETR (RfDETR): End-to-End Detector | deep-learning, object-detection, transformer | No |

Each post contains ~200+ lines of Markdown with code blocks, tables, images, and links.

---

## 🔒 Security Considerations

| Aspect | Implementation |
|--------|---------------|
| **XSS Prevention** | All rendered Markdown sanitized through DOMPurify |
| **Password Storage** | SHA-256 hash only — plaintext never in source |
| **Hash Obfuscation** | Hex-escaped, reversed, split chunks with double verification |
| **Session** | `sessionStorage` — cleared on tab close |
| **CORS Proxy** | Used only for URL import, not for auth |
| **No Secrets in Source** | No API keys, tokens, or credentials |

---

## 📱 Responsive Breakpoints

| Breakpoint | Changes |
|------------|---------|
| `> 1280px` | Full width, two-column post layout with sidebar |
| `≤ 900px` | Post layout becomes single column |
| `≤ 768px` | Editor panes stack vertically, smaller typography |
| `≤ 480px` | Search hidden, compact navbar, reduced padding |

---

<p align="center"><em>Last updated: March 2026</em></p>
