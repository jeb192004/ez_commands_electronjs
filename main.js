const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const fs = require('fs');

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  })
  ipcMain.handle('close_app', () => app.quit())
  /**RECEIVE THE EMAIL TEMPLATE AND SAVE IT */
  ipcMain.handle('load_commands', async (event, arg) => {
    var commands = await load_commands(arg)
    return commands
  })
  ipcMain.handle('save_commands', async (event, arg) => {
    var res = await save_commands(arg)
    return res
  })
  win.loadFile('index.html')
}


app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

async function load_commands(val) {
  return new Promise((resolve, reject) => {
    fs.readFile(app.getPath('home') + '/Documents/ez_commands.json', 'utf8', function (err, data) {
      if (err) { console.log(err) }
      resolve(data);
    });
  })
}

async function save_commands(val) {
  return new Promise((resolve, reject) => {
    fs.writeFile(app.getPath('home') + '/Documents/ez_commands.json', JSON.stringify(val), function(err) {
      if(err) {
          return console.log(err);
      }
      resolve("The file was saved!");
  }); 
  })
}