const Store = require('electron-store');
const settingsStore = new Store();

function getWinSettings() {
    const default_size = [800, 650];
    
    const size = settingsStore.get('win-size');

    if (size) return size;
    else {
        settingsStore.set('win-size', default_size);
        return default_size;
    }
}

function saveBounds (bounds) {
    const currentBounds = settingsStore.get('win-size');

    if (currentBounds[0] !== bounds[0] || currentBounds[1] !== bounds[1]) {
        settingsStore.set("win-size", bounds);
        console.log("bounds saved: ", bounds);
    }
};

module.exports = {
    getWinSettings: getWinSettings,
    saveBounds: saveBounds
}