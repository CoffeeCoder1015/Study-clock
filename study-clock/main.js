import { app, BrowserWindow, ipcMain } from 'electron';
import { execFile } from 'child_process'
import path from 'path';

var geoCache = null

function getGeolocation() {
    if ( geoCache != null ){
        return new Promise((resolve,reject) => {
            resolve(geoCache)
        })
    }
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

                geoCache = [lat,lon]
                console.log(geoCache);
                resolve([lat,lon]);
            } catch (e) {
                reject(e);
            }
        });
    });
}

getGeolocation()

function createWindow() {
    const win = new BrowserWindow({
        width: 1024,
        height: 768,
        webPreferences: {
            contextIsolation: true,
            backgroundThrottling: false,
            preload: path.join(import.meta.dirname,"preload.js")
        },
    });

    win.loadFile("out/index.html")

    ipcMain.handle("get-location", async () => {
        return await getGeolocation()
    })
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
