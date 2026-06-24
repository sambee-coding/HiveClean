const { contextBridge, ipcRenderer } = require('electron')


contextBridge.exposeInMainWorld('electronAPI', {
  version: () => process.versions.electron,

  scanDownloads: () => ipcRenderer.invoke('scan-downloads'),
  deleteFiles: (filePaths) => ipcRenderer.invoke('delete-files', filePaths),
  saveDeletedFiles : (filePaths) => ipcRenderer.invoke('save-deleted-files', filePaths),
  loadDeletedFiles : () => ipcRenderer.invoke('load-deleted-files'),
})


