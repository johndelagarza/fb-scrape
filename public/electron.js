const { app, BrowserWindow, dialog} = require('electron');
const { autoUpdater } = require("electron-updater");
const ipcMain = require('electron').ipcMain;
const path = require('path');
const isDev = require('electron-is-dev');
const Store = require('electron-store');
const url = require('url');
const fs = require('fs');
var shell = require('electron').shell;
const queryString = require('query-string');

const { getWinSettings, saveBounds } = require('./setting');
const scrape = require('./scrape');
const { sendDiscordNotification }  = require('./functions');
const {HANDLE_FETCH_DATA, FETCH_DATA_FROM_STORAGE, HANDLE_SAVE_DATA, SAVE_DATA_IN_STORAGE, REMOVE_DATA_FROM_STORAGE, HANDLE_REMOVE_DATA} = require("../src/helpers/constants");

const storage = new Store();

let mainWindow;

function createWindow() {

    const size = getWinSettings();

    mainWindow = new BrowserWindow({
          width: size[0], height: size[1],
          // minWidth: 790, 
          //minHeight: 900,
          frame: false,
          // resizable: false,
          titleBarStyle: "hidden",
          title: '',
          webPreferences: { nodeIntegration: true, webSecurity: false },
          icon: path.join(__dirname, './icon2.png'),
          name: ''
      });
  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
  
  mainWindow.setMenu(null);

  mainWindow.on("close", () => {
    saveBounds(mainWindow.getSize());
    // mainWindow = null
    // app.quit();
  });

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

ipcMain.handle('send-discord-notification', async (event, webhook, type, message) => {
  
  sendDiscordNotification(webhook, type, message)
});

ipcMain.handle('start-scrape', async (event, config) => {

  //console.log(config)
  const newListings = await scrape.scrape(config, log);
  return newListings;
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

// Storage / Data handling

ipcMain.handle(FETCH_DATA_FROM_STORAGE, (event, message) => {
  console.log("Main received: FETCH_DATA_FROM_STORAGE with message:", message)
  
  let data = storage.get(message, []);

  return data;
});

ipcMain.handle(SAVE_DATA_IN_STORAGE, (event, collection, newData) => {
  console.log("Main received: SAVE_DATA_IN_STORAGE")

  let data = storage.set(collection, newData);
  
  return data;
});

ipcMain.handle(REMOVE_DATA_FROM_STORAGE, (event, collection, newData) => {
  console.log('Main Received: REMOVE_DATA_FROM_STORAGE')

  let data = storage.set(collection, newData);
  
  return data;
});

// Auto-updater settings

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

function log(msg) {
  console.log(msg)
  return mainWindow.webContents.send(msg.id, msg);
}


