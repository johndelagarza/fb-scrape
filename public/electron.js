const { app, BrowserWindow, dialog, autoUpdater } = require('electron');
//const { autoUpdater } = require("electron-updater");
//const log = require('electron-log');
const ipcMain = require('electron').ipcMain;
const path = require('path');
const isDev = require('electron-is-dev');
const url = require('url');
const scrape = require('./scrape');
const fs = require('fs'); 
var shell = require('electron').shell;
const queryString = require('query-string');
// autoUpdater.logger = log;
// autoUpdater.logger.transports.file.level = 'info';
// log.info('App starting...');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
          minWidth: 790, 
          minHeight: 890,
          frame: true,
          // resizable: false,
          webPreferences: { nodeIntegration: true },
          title: "FB Scrape",
          icon: path.join(__dirname, './icon.png'),
          name: ''
      });
  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
  
  mainWindow.setMenu(null);
  //startAutoUpdater(squirrelUrl)
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

ipcMain.handle('app-version', (event) => {
  let version = app.getVersion();
  return version;
});



// const squirrelUrl = "http://45.76.59.62:3050";

// const startAutoUpdater = (squirrelUrl) => {
//   // The Squirrel application will watch the provided URL
//   autoUpdater.setFeedURL(squirrelUrl);
//   autoUpdater.checkForUpdates();
// };



