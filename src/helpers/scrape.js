import { loadSavedData, saveDataInStorage, removeDataFromStorage } from "../renderer";
const { ipcRenderer, remote, Notification } = window.require('electron');
const { notify } = require('./notification');

// export const getKeywords = () => {
//     let keywords = localStorage.getItem('keywords');

//     if (!keywords) {
//         return [];
//     } else if (keywords.length > 0) {
//         keywords = JSON.parse(keywords);
//         return keywords.map(keyword => {
//             if (keyword.hasOwnProperty('pid')) {
//                 clearInterval(keyword.pid);
//                 delete keyword.pid
//                 return { ...keyword, online: false };
//             } else return keyword;
//         });
//     };
// };

export const startScrape = (action) => {

    const intervalPid = setInterval(async ()=> {
        let keywords = await loadSavedData("keywords");
        let index = keywords.findIndex(e => e.id === action.keyword.id);
        
        action.editKeyword({...keywords[index], lastActive: Date.now()});
        scrape({...keywords[index], lastActive: Date.now()}, action.path, action.settings, action.editKeyword)

    }, parseInt(action.settings.interval));
    
    return intervalPid;
};

export const scrape = async (keyword, path, settings, editKeyword) => {
    console.log(keyword)
// if keyword is not online, return
    if (keyword.online === false) return notify('Error:', 'Stopped, killing scrape.', 'danger');
// initate the scrape

    try {

        const listings = await ipcRenderer.invoke('start-scrape', {
            path: path, 
            keyword: keyword,
            url: keyword.url, 
            proxies: settings.hasOwnProperty('proxies') && settings.proxies.length > 0 ? settings.proxies : null, 
            discordWebhook: settings.discordWebhook,
            headless: settings.headless,
            rotateUserAgents: settings.rotateUserAgents
        });
        console.log(listings)
        if (!listings) return;
// compare stored listings vs new ones and then edit the keyword's currentListings value
        const newListings = await findNewListings(keyword, listings);
        
        let updatedKeyword = {...keyword, currentListings: newListings};
        
        return editKeyword(updatedKeyword);
    } catch (error) {
        console.trace(error.message);
        return console.log(error.message);
    }
};

export const findNewListings = async (keyword, listings) => {
    console.log(keyword)
    if (keyword.hasOwnProperty('currentListings') && typeof Array) {
        let currentListings = keyword.currentListings;
        let currentListingsIds = await currentListings.map(listing => listing.id);
        let settings = await loadSavedData('settings');

        let newListings = await listings.map((listing)=> {   
            if (!currentListingsIds.includes(listing.id)) {
                console.log('New listing found!');
                
                if (settings.discordWebhook !== null) {
                    ipcRenderer.invoke(
                        'send-discord-notification', 
                        settings.discordWebhook, 
                        "NEW_LISTING", 
                        {title: `New Listing Found: ${keyword.keyword}`, description: listing}
                    );
                }

                if (settings.desktopNotifications) {
                    new window.Notification(`New Listing Found: ${keyword.keyword}`, {body: `${listing.title} - ${listing.price}`, icon: listing});
                }
                //notification.addEventListener('click', ()=> ipcRenderer.invoke('open-listing', listing.url))
                
                return listing;
            } else {
                console.log('Listing already exists.');
                return null;
            }
        });
        
        newListings = await newListings.filter(listing => listing !== null);
        //if (newListings.length < 5) newListings.forEach(listing => sendDiscordNotification(settings.discordWebhook, listing));
        
        let newCurrentListings = newListings.concat(currentListings);
        
        if (newCurrentListings.length > 400) {
            newCurrentListings.length = 200;
            return newCurrentListings;
        };
    
        return newCurrentListings;
    } else {
        return listings;
    };
};

export const stopScrape = (action, keywords) => {
    clearInterval(action.keyword.pid);

    let updatedKeywords = keywords.map(keyword => {
        if (keyword.keyword === action.keyword.keyword) {
            delete keyword.pid
            return { ...keyword, online: false, lastActive: Date.now() };
        } else return keyword;
    });
    return updatedKeywords
};