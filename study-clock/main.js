import { app, BrowserWindow } from 'electron';
import { execFile } from 'child_process'

function getGeolocation() {
    return new Promise((resolve, reject) => {
        const exePath = "native_geoloc/geo_win.exe"
        execFile(exePath, (error, stdout, stderr) => {
            if (error) {
                return reject(error);
            }
            if (stderr) {
                return reject(new Error(stderr));
            }

            try {
                const [latStr, lonStr] = stdout.trim().split(',');
                const lat = parseFloat(latStr);
                const lon = parseFloat(lonStr);

                if (isNaN(lat) || isNaN(lon)) {
                    return reject(new Error('Invalid coordinate output'));
                }

                resolve([lat,lon]);
            } catch (e) {
                reject(e);
            }
        });
    });
}

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
