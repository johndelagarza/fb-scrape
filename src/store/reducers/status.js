import * as actionTypes from "../actions/actionTypes";
const Discord = require('discord.js');
const { ipcRenderer, remote, Notification } = window.require('electron');


const INITIAL_STATE = {
    keywords: [],
    settings: null,
    logs: {}
};

export default (state = INITIAL_STATE, action) => {
    let settings = getSettings();
    let keywords = getKeywords();
    if (settings) state = {...state, settings: settings};
    if (keywords) state = {...state, keywords: keywords};

    switch (action.type) {
        case actionTypes.UPDATE_SETTINGS: {
            return { ...state, settings: action.settings };
        }
        case actionTypes.UPDATE_KEYWORDS: {
            return { ...state, keywords: action.keywords};
        }
        case actionTypes.START_KEYWORD: {
            console.log('spawning scrape')
            
            const intervalPid = setInterval(()=> scrape(action.keyword, action.path, action.settings, action.saveKeywords), parseInt(action.settings.interval));
            
            let updatedKeywords = state.keywords.map(keyword => keyword.keyword === action.keyword.keyword ? { ...keyword, online: true, pid: intervalPid } : keyword);
            localStorage.setItem('keywords', JSON.stringify(updatedKeywords));
            return { ...state, keywords: updatedKeywords };
        }
        case actionTypes.STOP_KEYWORD: {
            clearInterval(action.keyword.pid);
            let updatedKeywords = state.keywords.map(keyword => {
                if (keyword.keyword === action.keyword.keyword) {
                    delete keyword.pid
                    return { ...keyword, online: false };
                } else return keyword;
            });
            console.log(updatedKeywords);
            localStorage.setItem('keywords', JSON.stringify(updatedKeywords));
            return { ...state, keywords: updatedKeywords };
        }
        default:
            return state;
    }
}; 

const getSettings = () => {
    let settings = localStorage.getItem('settings');

    if (!settings) {
        return null;
    } else if (settings) {
        return JSON.parse(settings);
    };
};

const getKeywords = () => {
    let keywords = localStorage.getItem('keywords');

    if (!keywords) {
        return [];
    } else if (keywords.length > 0) {
        return JSON.parse(keywords);
    };
};

const scrape = async (keyword, path, settings, saveKeywords) => {
    let keywords = await JSON.parse(localStorage.getItem('keywords'));

    const elementIdex = await keywords.findIndex(e => {
        return e.keyword === keyword.keyword;
    });
    if (!keywords[elementIdex].pid) return console.log('No process id, killing scrape.');
    if (keywords[elementIdex].online === false) return console.log('Stopped, killing scrape.');

    try {
        const listings = await ipcRenderer.invoke('startScrape', {
            path: path, 
            url: keyword.url, 
            proxies: settings.hasOwnProperty('proxies') ? settings.proxies : null, 
            discordWebhook: settings.discordWebhook
        });
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

const findNewListings = async (keyword, listings) => {
    console.log(keyword)
    if (keyword.hasOwnProperty('currentListings') && typeof Array) {
        let currentListings = keyword.currentListings;
        let currentListingsUrls = await currentListings.map(listing => listing.url);
        let settings = JSON.parse(localStorage.getItem('settings'));

        let newListings = await listings.map((listing)=> {   
            if (!currentListingsUrls.includes(listing.url)) {
                console.log('New listing found!');
                //const notification = new window.Notification(`New Listing Found: ${keyword.keyword}`, {body: `${listing.title} - ${listing.price}`, icon: listing});
                //notification.addEventListener('click', ()=> ipcRenderer.invoke('open-listing', listing.url))
                sendDiscordNotification(settings.discordWebhook, listing);
                return listing;
            } else {
                console.log('Listing already exists.');
                return null;
            }
        });
        newListings = await newListings.filter(listing => listing !== null);
        let newCurrentListings = newListings.concat(currentListings);

        if (newCurrentListings.length > 50) {
            newCurrentListings.length = 50;
            return newCurrentListings;
        };
    
        return newCurrentListings;
    } else {
        return listings;
    };
};

const sendDiscordNotification = async (discordWebhook, listing) => {
    discordWebhook = discordWebhook.split('https://discordapp.com/api/webhooks/').pop();
    let id = await discordWebhook.match(/[^/]+/);
    let token = await discordWebhook.match(/[^/]+$/);
    
    const hook = new Discord.WebhookClient(id, token);
    const embed = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle(listing.title)
        .setURL(listing.url)
        .addField('Price:', listing.price)
        .addField('Location', listing.location)
        .setImage(listing.image)
        .setTimestamp();

    return hook.send(embed);
};

const stopKeyword = async (keyword, pid) => {
    clearInterval(pid);
};