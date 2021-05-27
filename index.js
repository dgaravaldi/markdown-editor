const { app, BrowserWindow, Menu } = require('electron');
const { autoUpdater } = require('electron-updater');

const menu = require('./menu');

let window;

app.on('ready', () => {
    window = new BrowserWindow({
        title: "Markdown-Editor",
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            //Import and flag, else web console throw error
            contextIsolation: false
        }
    });
    window.loadFile('index.html');
    //autoUpdater.checkForUpdatesAndNotify();
});

Menu.setApplicationMenu(menu);
