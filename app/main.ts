import * as path from 'path';
import { app, BrowserWindow } from 'electron';
import { System } from './System';
import { is } from 'electron-util';

System.Debug = is.development;
System.Url = 'https://playground.babylonjs.com/';
//System.Url = 'https://austin-eng.com/webgpu-samples/samples/rotatingCube';

app.commandLine.appendSwitch('--force_high_performance_gpu');
app.commandLine.appendSwitch('--enable-unsafe-webgpu');
app.commandLine.appendSwitch('--use_dawn');
//app.commandLine.appendSwitch('--enable-logging');

function createWindow() {
    const window = new BrowserWindow({
        width: 1920,
        height: 1080,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        },
    });

    window.removeMenu();
    window.loadURL(System.Url);
    window.webContents.on('did-finish-load', () => {
    });
    window.webContents.on('before-input-event', (event, input) => {
        if (input.control && input.key.toLowerCase() === 'w') {
            app.quit(); 
        } else if (input.key === 'F5') {
            window.reload();
        } else if (input.key === 'F12') {
            window.webContents.toggleDevTools();
            event.preventDefault();
        } else if (input.key === 'F11' || (input.alt && input.key == 'Enter')) {
            window.fullScreen = !window.isFullScreen();
            event.preventDefault();
        } 
    })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
    // const filter = { urls: [System.Url] };
    // session.defaultSession.webRequest.onBeforeSendHeaders(filter, (details, callback) => {
        //     details.requestHeaders['Origin'] = System.Url;
        //     callback({ requestHeaders: details.requestHeaders })
        // });
        
    createWindow();

    app.on('activate', function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });

});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
