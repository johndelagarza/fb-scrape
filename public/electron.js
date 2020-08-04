const { app, BrowserWindow, dialog} = require('electron');
const { autoUpdater } = require("electron-updater");
const ipcMain = require('electron').ipcMain;
const path = require('path');
const isDev = require('electron-is-dev');
const url = require('url');
const fbScrape = require('./fbScrape').scrape;
const ebayScrape = require('./ebayScrape').scrape;
var shell = require('electron').shell;

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
          minWidth: 790, 
          minHeight: 890,
          frame: true,
          // resizable: false,
          webPreferences: { nodeIntegration: true },
          title: "Thrifter",
          icon: path.join(__dirname, './icon.png'),
          name: ''
      });
  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
  
  mainWindow.setMenu(null);
  
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }
  mainWindow.once('ready-to-show', () => {
    console.log('checking for updates')
    if (!isDev) autoUpdater.checkForUpdatesAndNotify();
  });
  mainWindow.on('closed', () => mainWindow = null);
};



app.on('ready', createWindow);

app.on('window-all-closed', () => {
  app.quit()
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
  console.log(config)
  let newListings;

  switch (config.platform) {
    case 'facebook':
      return newListings = await fbScrape(config, log);
    case 'ebay':
      return newListings = await ebayScrape(config, log);
    default:
      break;
  };
  
  return newListings;
});

ipcMain.handle('open-listing', async (event, url) => {
  return shell.openExternal(url);
});

ipcMain.on('app_version', (event) => {
  console.log('checking for updates')
  if (!isDev) autoUpdater.checkForUpdates();
  event.sender.send('app_version', { version: app.getVersion() });
});

autoUpdater.on('update-available', () => {
  console.log('update available')
  mainWindow.webContents.send('update_available');
});

autoUpdater.on('update-downloaded', () => {
  mainWindow.webContents.send('update_downloaded');
});

ipcMain.on('restart_app', () => {
  autoUpdater.quitAndInstall();
});

function log(msg) {
  console.log(msg)
  return mainWindow.webContents.send(msg.keyword, msg);
};


