const { contextBridge, ipcRenderer } = require('electron');
const path = require('path');

contextBridge.exposeInMainWorld('electronAPI', {
  closeWindow: () => ipcRenderer.send('close-window'),
  minimizeWindow: () => ipcRenderer.send('minimize-window'),
  restoreWindow: () => ipcRenderer.send('restore-window'),
});

contextBridge.exposeInMainWorld('assetAPI', {
  getAssetPath: async (filename) => {
    return await ipcRenderer.invoke('get-asset-path', filename);
  }
});
