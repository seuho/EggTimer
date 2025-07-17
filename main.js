const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const remoteMain = require('@electron/remote/main');

// 🔐 Initialize remote BEFORE window is created
remoteMain.initialize();

let mainWindow; // Store reference to the window

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 600,
    height: 600,
    frame: false,
    useContentSize: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
    },
  });

  remoteMain.enable(mainWindow.webContents);
  mainWindow.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();
});

ipcMain.on('close-window', () => {
  BrowserWindow.getFocusedWindow().close();
});

ipcMain.on('minimize-window', () => {
  BrowserWindow.getFocusedWindow().minimize();
});

// ✅ Restore window and bring it to front when alarm rings
ipcMain.on('restore-window', () => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) {
      mainWindow.restore();
    }
    mainWindow.show();
    mainWindow.focus();

    // Optional (for Windows taskbar flash)
    mainWindow.flashFrame(true);

    // Optional (for macOS dock bounce)
    if (process.platform === 'darwin') {
      app.dock.bounce('informational');
    }
  }
});
