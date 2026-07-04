# HiveClean 🐝

A lightweight, open-source file cleanup utility for Windows that helps you reclaim disk space by finding and safely removing duplicate files, large files, and old downloads.

## Features

- **Duplicate Detection** — Uses SHA256 hashing to find identical files across your Downloads folder
- **File Categorization** — Automatically organizes files by type (Videos, PDFs, Images, Code, Archives, etc.)
- **Large File Detection** — Identifies files over 50MB that might be taking up space
- **Safe Deletion** — Moves files to a persistent recycle bin instead of permanent deletion—undo anytime
- **Telegram Downloads** — Scan and manage files from your Telegram Desktop downloads separately
- **Session Persistence** — Your recycle bin survives app restarts with JSON-based storage
- **Real-time Filtering** — Filter by category, sort by size or date created

## Getting Started

### Download & Install

1. Go to [Releases](https://github.com/sambee-coding/HiveClean/releases)
2. Download `HiveClean_Setup_1.0.0.exe`
3. Run the installer and follow the setup wizard
4. Launch HiveClean from your Start menu

### Usage

1. **Scan Downloads** — Click the scan button to analyze your Downloads folder
2. **Browse Files** — Filter by category on the left sidebar
3. **Select Files** — Check the boxes next to files you want to delete
4. **Delete** — Click the delete button and confirm
5. **Recycle Bin** — View deleted files and restore if needed

**For Telegram Downloads:**
- Click "Select Telegram Folder" to choose your Telegram downloads location
- Click "Scan Telegram" to analyze that folder
- Use the same select/delete workflow

## Tech Stack

- **Frontend** — React + Vite + Tailwind CSS
- **Desktop Framework** — Electron
- **Backend** — Node.js + fs module
- **Authentication** — Supabase
- **Storage** — JSON (persistent recycle bin)
- **Hashing** — Node.js crypto (SHA256)

## Architecture

HiveClean uses Electron's multi-process architecture:

- **Main Process** — Handles file system operations, IPC, native dialogs
- **Renderer Process** — React UI with state management
- **IPC Bridge** — Secure communication between processes via preload script

### Key Concepts Implemented

- Session-based state with persistent disk storage
- Async file hashing for duplicate detection
- Safe deletion via `trash` package
- Native folder picker dialog for cross-platform compatibility

## Building from Source

```bash
# Install dependencies
npm install

# Start development
npm run start

# Build for production
npm run build

# Package as .exe
npm run package
```

## Project Roadmap

- [x] File scanning and categorization
- [x] Duplicate detection (SHA256)
- [x] Safe delete to recycle bin
- [x] Persistent recycle bin with restore
- [x] Telegram downloads integration
- [x] Authentication (Supabase)
- [ ] Dark mode
- [ ] Charts and analytics dashboard
- [ ] Old file detection (>6 months)

## Learning Resources

This project demonstrates:
- Building desktop apps with Electron
- React hooks and state management
- IPC communication patterns
- File system operations in Node.js
- Tailwind CSS for responsive design

## License

MIT License — feel free to use, modify, and distribute

## Author

Built by [Sambee](https://github.com/sambee-coding) • Read the [case study](link-to-portfolio)

---

**Download HiveClean:** [Get the latest release](https://github.com/sambee-coding/HiveClean/releases)
