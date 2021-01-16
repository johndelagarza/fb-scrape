const { app, BrowserWindow, dialog} = require('electron');
const { autoUpdater } = require("electron-updater");
const ipcMain = require('electron').ipcMain;
const path = require('path');
const isDev = require('electron-is-dev');
const url = require('url');
const scrape = require('./scrape');
const fs = require('fs'); 
var shell = require('electron').shell;
const queryString = require('query-string');

let mainWindow;

function createWindow() {
 
    mainWindow = new BrowserWindow({
          // minWidth: 790, 
          // minHeight: 890,
          frame: false,
          // resizable: false,
          titleBarStyle: "hidden",
          title: '',
          webPreferences: { nodeIntegration: true },
          icon: path.join(__dirname, './icon2.png'),
          name: ''
      });
  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
  
  mainWindow.setMenu(null);

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }
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
  const urlParsed = queryString.parse(url);
  const keyword = urlParsed.query;
  function log(msg) {
    console.log(msg)
    return mainWindow.webContents.send(msg.keyword, msg);
  }
  console.log(config)
  const newListings = await scrape.scrape(config, log);
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

ipcMain.on('app_version', (event) => {
  //if (!isDev) autoUpdater.checkForUpdates();
  autoUpdater.checkForUpdates();
  console.log('CURRENT VERSION: ' + app.getVersion())
  event.sender.send('app_version', { version: app.getVersion() });
});

autoUpdater.on('update-available', (data) => {
  console.log('update available')
  mainWindow.webContents.send('update_available', data);
});

autoUpdater.on('update-downloaded', (data) => {
  mainWindow.webContents.send('update_downloaded', data);
});

ipcMain.on('restart_app', () => {
  autoUpdater.quitAndInstall();
});



