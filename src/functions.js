const { ipcRenderer, remote, Notification } = window.require('electron');
const { notify } = require('./utils/notification');

export const getSettings = () => {
    let settings = localStorage.getItem('settings');

    if (!settings) {
        return null;
    } else if (settings) {
        return JSON.parse(settings);
    };
};

export const getKeywords = () => {
    let keywords = localStorage.getItem('keywords');

    if (!keywords) {
        return [];
    } else if (keywords.length > 0) {
        keywords = JSON.parse(keywords);
        return keywords.map(keyword => {
            if (keyword.hasOwnProperty('pid')) {
                clearInterval(keyword.pid);
                delete keyword.pid
                return { ...keyword, online: false };
            } else return keyword;
        });
    };
};

export const startScrape = (action) => {
    //scrape(action.keyword, action.path, action.settings, action.saveKeywords);
    const intervalPid = setInterval(()=> scrape(action.keyword, action.path, action.settings, action.saveKeywords), parseInt(action.settings.interval));
    return intervalPid;
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

export const scrape = async (keyword, path, settings, saveKeywords) => {
    let keywords = await JSON.parse(localStorage.getItem('keywords'));

    const elementIdex = await keywords.findIndex(e => {
        return e.keyword === keyword.keyword;
    });
    //if (!keywords[elementIdex].pid) return alert('Error: No process id, killing scrape.');
    if (keywords[elementIdex].online === false) return alert('Error: Stopped, killing scrape.');

    try {
        const listings = await ipcRenderer.invoke('startScrape', {
            path: path, 
            keyword: keyword.keyword,
            url: keyword.url, 
            proxies: settings.hasOwnProperty('proxies') && settings.proxies.length > 0 ? settings.proxies : null, 
            discordWebhook: settings.discordWebhook,
            headless: settings.headless,
            rotateUserAgents: settings.rotateUserAgents
        });
        console.log(listings)
        if (!listings) return;
        const newListings = await findNewListings(keywords[elementIdex], listings);
        
        let updatedKeyword = keywords[elementIdex] = {...keywords[elementIdex], currentListings: newListings};
        let newKeywords = await keywords.map(e => e.keyword === keyword.keyword ? updatedKeyword : e);

        localStorage.setItem('keywords', JSON.stringify(newKeywords));
        
        return saveKeywords(newKeywords);
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
        let settings = JSON.parse(localStorage.getItem('settings'));

        let newListings = await listings.map((listing)=> {   
            if (!currentListingsIds.includes(listing.id)) {
                console.log('New listing found!');
                
                if (settings.discordWebhook !== null) {
                    ipcRenderer.invoke(
                        'sendDiscordNotification', 
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

// export const sendDiscordNotification = async (discordWebhook, listing) => {
//     discordWebhook = discordWebhook.split('/webhooks/').pop();
//     let id = await discordWebhook.match(/[^/]+/);
//     let token = await discordWebhook.match(/[^/]+$/);
    
//     const hook = new Discord.WebhookClient(id, token);
//     const embed = new Discord.MessageEmbed()
//         .setColor('#0099ff')
//         .setTitle(listing.title)
//         .setURL(listing.url)
//         .addField('Price:', listing.price)
//         .addField('Location', listing.location)
//         .setImage(listing.image)
//         .setTimestamp();
// //return notify('Bad Discord Webhook', `Correct format: https://discord.com/api/webhooks/736765543024188/ZtKRS489WyPSb3oKDilFgh8h7xyts14Y3JJTxOOR-kggZgAu_5Gd54uJ966aloItd`, 'danger');
//     try {
//         await hook.send(embed);
//     } catch (error) {
//         notify('Error', `${error.message}`, 'danger');
//     }
// };