const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  version: () => process.versions.electron,

  scanDownloads: () => ipcRenderer.invoke('scan-downloads'),
})

