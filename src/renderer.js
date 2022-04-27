const { ipcRenderer } = require("electron");
const { FETCH_DATA_FROM_STORAGE, SAVE_DATA_IN_STORAGE, REMOVE_DATA_FROM_STORAGE} = require("./helpers/constants")

// -----------------------------------------------------------------
// Functions for calling main

// Ask main to load data from its persistent storage
async function loadSavedData(collection) {
    console.log("Renderer sending: FETCH_DATA_FROM_STORAGE")
    let data = await ipcRenderer.invoke(FETCH_DATA_FROM_STORAGE, collection);
    return data;
};
  
// Send item message to main
async function saveDataInStorage(collection, newArray) {
    console.log("Renderer sending: SAVE_DATA_IN_STORAGE")
    let data = await ipcRenderer.invoke(SAVE_DATA_IN_STORAGE, collection, newArray);
    return data;
};
  
// Remove an item
async function removeDataFromStorage(collection, newArray) {
    console.log("Renderer sending: REMOVE_DATA_FROM_STORAGE")
    let data = await ipcRenderer.invoke(REMOVE_DATA_FROM_STORAGE, collection, newArray);
    return data;
};
  
module.exports = { loadSavedData, saveDataInStorage, removeDataFromStorage }