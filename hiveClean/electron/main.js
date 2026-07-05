const { app, BrowserWindow, ipcMain , dialog} = require("electron");
const path = require("path");
const fs = require("fs");
const os = require("os");
const crypto = require("crypto");
const { shell } = require("electron");

// ─── FILE CATEGORY DETECTOR ─────────────────────────────── ← top level ✓
function getCategory(ext) {
  const categories = {
    Image: [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".bmp", ".ico"],
    Video: [".mp4", ".mkv", ".avi", ".mov", ".wmv", ".flv", ".webm"],
    Audio: [".mp3", ".wav", ".flac", ".aac", ".ogg", ".m4a"],
    PDF: [".pdf"],
    Document: [
      ".doc",
      ".docx",
      ".xls",
      ".xlsx",
      ".ppt",
      ".pptx",
      ".txt",
      ".csv",
    ],
    Archive: [".zip", ".rar", ".7z", ".tar", ".gz"],
    Code: [".js", ".ts", ".jsx", ".tsx", ".py", ".html", ".css", ".json"],
    Installer: [".exe", ".msi", ".dmg", ".deb"],
  };
  for (const [category, extensions] of Object.entries(categories)) {
    if (extensions.includes(ext.toLowerCase())) return category;
  }
  return "Other";
}

// ─── IPC HANDLER ────────────────────────────────────────── ← top level ✓
ipcMain.handle("scan-downloads", async () => {
  const downloadsPath = path.join(os.homedir(), "Downloads");
  const entries = fs.readdirSync(downloadsPath);

  const files = entries
    .map((name) => {
      const fullPath = path.join(downloadsPath, name);
      const stat = fs.statSync(fullPath);
      if (!stat.isFile()) return null;

      const ext = path.extname(name);
      const sizeInMB = stat.size / (1024 * 1024);

      return {
        name,
        sizeInMB: parseFloat(sizeInMB.toFixed(2)),
        createdAt: stat.birthtime,
        path: fullPath,
        extension: ext,
        category: getCategory(ext),
        isLarge: sizeInMB > 50,
        source:'downloads',
      };
    })
    .filter(Boolean);

  files.sort((a, b) => b.sizeInMB - a.sizeInMB);
  /*
    const seen = {}
   files.forEach(file => {
      try {
    const fileContent = fs.readFileSync(file.path)
    const hash = crypto.createHash('sha256').update(fileContent).digest('hex')
    if(seen[hash]){
      file.isDuplicate = true
      file.duplicateOf = seen[hash].name
    }
    else{
      seen[hash] = file
    }
  } catch (err) {
    console.error(`Couldn't read ${file.name}: ${err.message}`)
  }
});
*/
  /*
    const seen = {};
    files.forEach(file =>{
  file.isDuplicate = true
  file.duplicateOf = null

    });
    */
  const seen = {};

  files.forEach((file) => {
    file.isDuplicate = false;
    file.duplicateOf = null;
  });

  for (const file of files) {
    try {
      const content = await fs.promises.readFile(file.path);
      const hash = crypto.createHash("sha256").update(content).digest("hex");
      if (seen[hash]) {
        file.isDuplicate = true;
        file.duplicateOf = seen[hash].name;
      } else {
        seen[hash] = file;
      }
    } catch (err) {
      console.log(`couldn't read ${file.name}:${err.message}`);
    }
  }

  return files;
});



ipcMain.handle("scan-telegram", async (event,telegramPath) => {
  console.log('Telegram path received:', telegramPath)
  
  if (fs.existsSync(telegramPath)) {
    const enteries = fs.readdirSync(telegramPath);
    const files = enteries
      .map((name) => {
        const fullPath = path.join(telegramPath, name);
        const stat = fs.statSync(fullPath);

        if (!stat.isFile()) return null;
        const ext = path.extname(name);
        const sizeInMB = stat.size / (1024 * 1024);

        return {
          name,
          sizeInMB: parseFloat(sizeInMB.toFixed(2)),
          createdAt: stat.birthtime,
          path: fullPath,
          extension: ext,
          category: getCategory(ext),
          isLarge: sizeInMB > 50,
          source: 'telegram',
        };
      })
      .filter(Boolean);

    files.sort((a, b) => b.sizeInMB - a.sizeInMB);

    const seen = {};

    files.forEach((file) => {
      file.isDuplicate = false;
      file.duplicateOf = null;
    });

    for (const file of files) {
      try {
        const content = await fs.promises.readFile(file.path);
        const hash = crypto.createHash("sha256").update(content).digest("hex");
        if (seen[hash]) {
          file.isDuplicate = true;
          file.duplicateOf = seen[hash].name;
        } else {
          seen[hash] = file;
        }
      } catch (err) {
        console.log(`couldn't read ${file.name}:${err.message}`);
      }
    }
    return files;
  } else {
    return [];
  }
});



ipcMain.handle("delete-files", async (event, filePaths) => {
  try {
    for (const filePath of filePaths) {
      await shell.trashItem(filePath);
    }
    const response = { success: true, deleted: filePaths.length };
    return response;
  } catch (err) {
    const error = { success: false, error: err.message };
    return error;
  }
});

ipcMain.handle('load-deleted-files', async () => {
  const filePath = path.join(app.getPath('userData'), 'deletedFiles.json')
  
  try {
    // Create directory if it doesn't exist (fixes Linux first-run issue)
    const dirPath = path.dirname(filePath)
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true })
    }
    
    const raw = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(raw)
  } catch (err) {
    console.error(`error loading deleted files: ${err.message}`)
    return []
  }
})

ipcMain.handle("save-deleted-files", (event, newDeletedFiles) => {
  //saving the deleted files
  const filePath = path.join(app.getPath("userData"), "deletedFiles.json");
  const data = fs.writeFileSync(filePath, JSON.stringify(newDeletedFiles));
  return data;
});
/*
ipcMain.handle("load-deleted-files", () => {
  //loading the deleted file from the save-delted-files
  const filePath = path.join(app.getPath("userData"), "deletedFiles.json");
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.error(`there is error ${err.message}`);
    return [];
  }
});

*/
ipcMain.handle("select-telegram-folder", async () => {
  const result = await dialog.showOpenDialog({
    properties: ["openDirectory"],
  })
  if(!result.canceled && result.filePaths.length > 0){
    return result.filePaths[0]
  }
  else{
    return null
  }
})
// ─── WINDOW ─────────────────────────────────────────────── ← createWindow is clean
function createWindow() {
  const win = new BrowserWindow({
    title: "HiveClean",
    width: 1100,
    height: 750,
    icon: path.join(__dirname, "../src/assets/icon.png"),
    titleBarStyle: "hidden", // hides the default titlebar
    titleBarOverlay: {
      color: "#fbbf24", // amber-400 — matches your app theme
      symbolColor: "#ffffff", // color of the min/max/close buttons
      height: 20, // height of the titlebar in px
    },
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (process.env.NODE_ENV === "development") {
    win.loadURL("http://localhost:5173");
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, "../dist/index.html"));
  }
}

// ─── LIFECYCLE ──────────────────────────────────────────────
app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
