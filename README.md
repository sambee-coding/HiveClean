# 🐝 HiveClean

A smart desktop file cleaner for students, developers, and heavy download users. Built with Electron, React, and Node.js.

![HiveClean Dashboard](https://placeholder.com/banner)

---

## What It Does

Your Downloads folder is a graveyard. HiveClean scans it and shows you exactly what's in there — categorized, sorted by size, and flagged for cleanup.

- Scans your Downloads folder instantly
- Detects file types and groups them by category
- Flags large files (50MB+) so you can find space-wasters fast
- Shows total storage used at a glance
- Filter by category — Images, Videos, PDFs, Archives, and more

---

## Tech Stack

| Layer | Technology |
|---|---|
| Desktop shell | Electron |
| UI | React + Tailwind CSS |
| Build tool | Vite |
| File system | Node.js `fs` + `path` + `os` |
| IPC bridge | Electron `ipcMain` / `ipcRenderer` |

---

## Project Structure

```
hiveClean/
├── electron/
│   ├── main.js          # Main process — file scanning, IPC handlers
│   └── preload.js       # Secure bridge between React and Node.js
├── src/
│   ├── App.jsx          # Main UI — sidebar, stat cards, file table
│   ├── main.jsx         # React entry point
│   └── index.css        # Tailwind import
├── vite.config.js
└── package.json
```

---

## How It Works

Electron runs two processes side by side:

**Main process** (Node.js) — has full access to your filesystem. Reads the Downloads folder, extracts file metadata, detects categories, and flags large files.

**Renderer process** (React) — the UI. Has zero direct filesystem access. Communicates with the main process through a secure IPC bridge.

```
React button click
  → window.electronAPI.scanDownloads()   [preload bridge]
  → ipcMain.handle('scan-downloads')     [Node.js]
  → reads Downloads folder with fs
  → returns file array back through IPC
  → React renders the results
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- npm

### Installation

```bash
git clone https://github.com/sambee-coding/HiveClean.git
cd hiveclean/hiveClean
npm install
```

### Run in development

```bash
npm run start
```

This starts Vite on `localhost:5173` and opens the Electron desktop window simultaneously.

> Always test in the **desktop window**, not the browser tab. The browser has no filesystem access.

### Build for production

```bash
npm run build
```

---

## File Categories

| Category | Extensions |
|---|---|
| Image | `.jpg` `.jpeg` `.png` `.gif` `.webp` `.svg` `.bmp` |
| Video | `.mp4` `.mkv` `.avi` `.mov` `.wmv` `.webm` |
| Audio | `.mp3` `.wav` `.flac` `.aac` `.ogg` `.m4a` |
| PDF | `.pdf` |
| Document | `.doc` `.docx` `.xls` `.xlsx` `.ppt` `.pptx` `.txt` `.csv` |
| Archive | `.zip` `.rar` `.7z` `.tar` `.gz` |
| Code | `.js` `.ts` `.jsx` `.tsx` `.py` `.html` `.css` `.json` |
| Installer | `.exe` `.msi` `.dmg` `.deb` |

---

## Roadmap

- [x] Scan Downloads folder
- [x] File type detection and categorization
- [x] Large file detection (50MB+)
- [x] Dashboard UI with stat cards and category filters
- [ ] Duplicate file detection (SHA256 hashing)
- [ ] Safe delete to Recycle Bin
- [ ] Undo / restore deleted files
- [ ] Cleanup summary and space saved tracking
- [ ] Search and filter by name, size, date
- [ ] Dark mode
- [ ] Windows `.exe` packaging

---

## What I Learned Building This

- How Electron's two-process architecture works (Main vs Renderer)
- IPC communication between Node.js and React
- Why `contextIsolation` and `nodeIntegration: false` matter for security
- Node.js `fs.readdirSync`, `fs.statSync`, and file metadata
- Building dynamic UIs that derive state rather than storing redundant data

---

## Author

**Samrawit Bitew** — [@sambee-coding](https://github.com/sambee-coding)

Follow the build journey on the [Sambee Telegram channel](https://t.me/sambecoding)

---

## License

MIT
