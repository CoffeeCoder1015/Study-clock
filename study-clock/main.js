import { app, BrowserWindow} from 'electron';
import {execFile} from 'child_process'

execFile("native_geoloc/geo_win.exe",(err,stdout) => {
  console.log(stdout)
})

function createWindow() {
  const win = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      contextIsolation: true,
      backgroundThrottling: false
    },
  });

  win.loadFile("out/index.html")
  win.loadURL("http://localhost:3000")
}



app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
