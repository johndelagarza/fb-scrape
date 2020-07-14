const { app, BrowserWindow, dialog } = require('electron');
const { autoUpdater } = require("electron-updater");
const log = require('electron-log');
const ipcMain = require('electron').ipcMain;
const path = require('path');
const isDev = require('electron-is-dev');
const url = require('url');
const scrape = require('../facebook/scrape');
const fs = require('fs'); 
var shell = require('electron').shell;

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
          width: 1200, 
          height: 800,
          frame: true,
          webPreferences: { nodeIntegration: true },
          title: "FB Scrape"
      });
  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);

  mainWindow.setMenu(null);
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }
  mainWindow.on('closed', () => mainWindow = null);
};

app.on('ready', createWindow);

app.on('ready', function()  {
  autoUpdater.checkForUpdatesAndNotify();
});

ipcMain.handle('setChromePath', async () => {
  const findPath = await dialog.showOpenDialog({
    title: 'Select Path to Chrome',
    defaultPath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application',
    filters: [
      { name: 'All Files', extensions: ['*'] }
    ],
    properties: ['openFile']
  });
  let chromePath = findPath.filePaths.pop();
  console.log(chromePath);
  return chromePath;
});

ipcMain.handle('startScrape', async (event, config) => {
  //console.log(config)
  const newListings = await scrape.scrape(config.path, config.url, config.proxies, config.discordWebhook);
  return newListings;
});

ipcMain.handle('get-logs', async (event, config) => {
  let logs = fs.readFileSync('./scrapes.log','utf8', (err, data) => {
    if (err) throw err;
    console.log(data);
    return data;
  });
  return logs;
});

ipcMain.handle('open-listing', async (event, url) => {
  return shell.openExternal(url);
});


autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('Checking for update...');
})
autoUpdater.on('update-available', (info) => {
  sendStatusToWindow('Update available.');
})
autoUpdater.on('update-not-available', (info) => {
  sendStatusToWindow('Update not available.');
})
autoUpdater.on('error', (err) => {
  sendStatusToWindow('Error in auto-updater. ' + err);
})
autoUpdater.on('download-progress', (progressObj) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
  log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
  sendStatusToWindow(log_message);
})
autoUpdater.on('update-downloaded', (info) => {
  sendStatusToWindow('Update downloaded');
});

