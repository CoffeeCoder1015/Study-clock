const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  getLocation: () => ipcRenderer.invoke('get-location')
});
