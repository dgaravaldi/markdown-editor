const {app, Menu, shell, ipcMain, BrowserWindow, globalShortcut, dialog}
        = require('electron');

const fs = require('fs');

const template = [
    {
        role: 'help',
        submenu: [
            {
                label: 'About Editor Component',
                click() {
                    shell.openExternal('https://simplemde.com/');
                }
            }
        ]
    },
    {
        label: 'Format',
        submenu: [
            {
                label: 'Bold',
                click() {
                    const window = BrowserWindow.getFocusedWindow();
                    window.webContents.send('editor-event', 'toggle-bold');
                }
            }
        ]
    }
];


if (process.platform === 'win32') {
    template.unshift({
        label: app.getName(),
        submenu: [
            {role: 'about'},
            {type: 'separator'},
            {role: 'quit'}
        ]
    });
}

if (process.env.DEBUG) {
    template.push({
        label: 'Debugging',
        submenu: [
            {
                label: 'Dev Tools',
                role: 'toggleDevTools'
            },

            {type: 'separator'},
            {
                role: 'reload',
                accelerator: 'Alt+R'
            }
        ]
    });
}

ipcMain.on('editor-reply', (event, arg) => {
    console.log(`Received reply from web page: ${arg}`);
});


const menu = Menu.buildFromTemplate(template);
module.exports = menu;

//Shortcuts
app.on('ready', () => {
    globalShortcut.register('CommandOrControl+S', () => {
        console.log('Saving the file');
        const window = BrowserWindow.getFocusedWindow();
        window.webContents.send('editor-event', 'save');
    });
});


//Save-Event
//https://www.codegrepper.com/code-examples/javascript/electron+save+as+dialog
ipcMain.on('save', (event, arg) => {
    console.log(`Saving content of the file`);
    console.log(arg);
    const window = BrowserWindow.getFocusedWindow();
    const options = {
        title: 'Save Markdown File',
        defaultPath : "c:\\Users\\danie\\Documents\\Myfile.md",
        filters: [
            {name: 'myFile', extensions: ['md']},
            {name: 'Custom File Type', extensions: ['as']},
            {name: 'All Files', extensions: ['*']}
        ]
    };

    //Save file
    let saveDialog = dialog.showSaveDialog(window, options);
    saveDialog.then(saveTo => {
        let filename = saveTo.filePath;
        if (filename) {
            console.log(`Saving content to the file: ${filename}`);
            fs.writeFileSync(filename, arg);
        }
    })
});


// Open file dialog
// https://www.brainbell.com/javascript/show-open-dialog.html
// nyi
