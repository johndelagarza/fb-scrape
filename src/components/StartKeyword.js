import React, { useState, useEffect } from 'react'
import { Container, Image, Menu, Modal, Header, Portal, Segment, Form, Button, Icon, Input, Divider, Dropdown } from 'semantic-ui-react';
import { Link, withRouter, Redirect } from 'react-router-dom';
import 'react-notifications-component/dist/theme.css'
import { store } from 'react-notifications-component';
const Discord = require('discord.js');

const ipcRenderer = window.require('electron').ipcRenderer;

function StartKeyword(props) {
    const [showConfirm, setConfirm] = useState(false);

    return (
        <Icon size="large" style={{margin:"10px"}} color="green" name='play' link onClick={()=> {
            startKeyword(props.keyword).then(()=> props.refreshKeywords());
        }}>
        </Icon>
    );
};

const startKeyword = async (keyword) => {
    let keywords = await JSON.parse(localStorage.getItem('keywords'));

    const elementIdex = await keywords.findIndex(e => {
        return e.keyword === keyword.keyword;
    });
    let updatedKeyword = keywords[elementIdex] = {...keywords[elementIdex], online: true};
    let newKeywords = await keywords.map(e => e.keyword === keyword.keyword ? updatedKeyword : e);
    localStorage.setItem('keywords', JSON.stringify(newKeywords));

    let settings = await JSON.parse(localStorage.getItem('settings'));
    let path = await settings.chromePath.replace(/(.exe)/g, '');
    try {
        scrape(keyword, path, settings)
        return setInterval(()=> scrape(keyword, path, settings), 60000);
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
        console.log('Starting scrape for: ' + keyword.keyword)
        const listings = await ipcRenderer.invoke('startScrape', {
            path: path, 
            url: keyword.url, 
            proxies: settings.proxies, 
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
        return localStorage.setItem('keywords', JSON.stringify(newKeywords));
    } catch (error) {
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

