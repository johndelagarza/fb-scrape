import React, { useState, useEffect } from 'react'
import { Container, Image, Menu, Modal, Header, Portal, Segment, Form, Button, Icon, Input, Divider, Dropdown } from 'semantic-ui-react';
import { Link, withRouter, Redirect } from 'react-router-dom';
import 'react-notifications-component/dist/theme.css'
import fbLogo from './icon.png';

const Discord = require('discord.js');
const { ipcRenderer, remote, Notification } = window.require('electron');
const path = require('path');

//let interval;
const notification = {
    title: 'New listing found!',
    body: 'BTC just beat your target price!'
};

function StartKeyword(props) {
    const [showConfirm, setConfirm] = useState(false);

    const startKeyword = async (keyword) => {
        //console.log(interval)
        //clearInterval(interval);
        //interval = null;
        let settings = await JSON.parse(localStorage.getItem('settings'));
        if (!settings || !settings.hasOwnProperty('chromePath')) return alert('Error: Please set your path to Google Chrome in Settings.');
        if (!settings.hasOwnProperty('discordWebhook')) return alert('Error: Please set your Discord Webhook in Settings.');
        if (!settings.hasOwnProperty('interval')) return alert('Error: Please set an interval in Settings.');
        let keywords = await JSON.parse(localStorage.getItem('keywords'));
    
        const elementIdex = await keywords.findIndex(e => {
            return e.keyword === keyword.keyword;
        });
        let updatedKeyword = keywords[elementIdex] = {...keywords[elementIdex], online: true};
        let newKeywords = await keywords.map(e => e.keyword === keyword.keyword ? updatedKeyword : e);
        localStorage.setItem('keywords', JSON.stringify(newKeywords));
        props.saveKeywords(newKeywords);
        let path = await settings.chromePath.replace(/(.exe)/g, '');
        try {
            scrape(keyword, path, settings)
            return setInterval(()=> {
                return scrape(keyword, path, settings)
            }, parseInt(settings.interval));
        } catch (error) {
            return console.log(error)
        };
    };

    const scrape = async (keyword, path, settings) => {
        let keywords = await JSON.parse(localStorage.getItem('keywords'));
    
        const elementIdex = await keywords.findIndex(e => {
            return e.keyword === keyword.keyword;
        });
        
        if (keywords[elementIdex].online === false) return clearInterval(scrape);
    
        try {
            //console.log('Starting scrape for: ' + keyword.keyword)
            const listings = await ipcRenderer.invoke('startScrape', {
                path: path, 
                url: keyword.url, 
                proxies: settings.hasOwnProperty('proxies') ? settings.proxies : null, 
                discordWebhook: settings.discordWebhook
            });
            console.log(listings);
            const newListings = await findNewListings(keywords[elementIdex], listings);
            console.log('returned listings after cross-checking: ')
            console.log(newListings);
            //if (newListings.includes(null)) return;
            let updatedKeyword = keywords[elementIdex] = {...keywords[elementIdex], currentListings: newListings};
            let newKeywords = await keywords.map(e => e.keyword === keyword.keyword ? updatedKeyword : e);
            console.log('new keywords after updating local storage: ')
            console.log(newKeywords)
            localStorage.setItem('keywords', JSON.stringify(newKeywords));
            return props.saveKeywords(newKeywords);
        } catch (error) {
            return console.log(error.message);
        }
    };

    return (
        <Icon size="large" style={{margin:"10px"}} color="green" name='play' link onClick={()=> {
            const notification = new window.Notification(`Task started: ${props.keyword.keyword}`, {body: `Scraping for new listings...`, icon: fbLogo});
            startKeyword(props.keyword);
        }}>
        </Icon>
    );
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
        console.log('New current listings concat: ')
        console.log(newCurrentListings)
        if (newCurrentListings.length > 24) {
            newCurrentListings.length = 24;
            console.log('listings after clipping to 24: ')
            console.log(newCurrentListings)
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

export default StartKeyword;

