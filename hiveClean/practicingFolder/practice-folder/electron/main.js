const {app, BrowserWindow, ipcMain} = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');

const categories = {
    Image: [  '.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.ico'],
    Video: [  '.mp4', '.mkv', '.avi', '.mov', '.wmv', '.flv', '.webm'],
    Audio: [  '.mp3', '.wav', '.flac', '.aac', '.ogg', '.m4a'],
    Pdf:   [  '.pdf'],
    Document: ['.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt', '.csv'],
    Archive:  ['.zip', '.rar', '.7z', '.tar', '.gz'],
    Code:     ['.js', '.ts', '.jsx', '.tsx', '.py', '.html', '.css', '.json'],
    Installer:['.exe', '.msi', '.dmg', '.deb'],
}

function getCategory(ext){
    for(const [category, extensions] of Object.entries(categories)){
        if(extensions.includes(ext)){
            return category;
        }
    }
    return 'Other';
}
function createWindow() {
    const win = new BrowserWindow({
        title: 'HiveClean',
        width:1100,
        height:750,
        webPreferences:{
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
        }
        
       
    })
     if(process.env.NODE_ENV === 'development') {
             
            win.webContents.openDevTools();
            win.loadURL('http://localhost:5173');
        }
        else{
            win.loadFile(path.join(__dirname, '../dist/index.html'))
        }
}

ipcMain.handle('scan-downloads' , async () => {

    const downloadsPath = path.join(os.homedir(),'Downloads');
    const entries = fs.readdirSync(downloadsPath);

    const files = entries.map((name) =>{
        const fullPath = path.join(downloadsPath , name);
        const stat = fs.statSync(fullPath);
        if(!stat.isFile()) return null;

        const ext = path.extname(name);
        const sizeInMB = stat.size / (1024 * 1024);

        return {
            name,
            sizeInMB: parseFloat(sizeInMB.toFixed(2)),
            createdAt: stat.birthtime,
            category: getCategory(ext),
            isLarge: sizeInMB > 50,
        }
    })
    .filter(Boolean);
    files.sort((a,b) => b.sizeInMB - a.sizeInMB);

return files;
})

app.whenReady().then(() =>{
createWindow();

app.on('activate', () =>{
    if(BrowserWindow.getAllWindows().length === 0){
        createWindow();
    }
})

})
app.on('window-all-closed', () =>{
    if(process.platform !== 'darwin'){
        app.quit();
    }
})