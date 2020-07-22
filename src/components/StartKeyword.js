import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux';
import { Container, Image, Menu, Modal, Header, Portal, Segment, Form, Button, Icon, Input, Divider, Dropdown } from 'semantic-ui-react';
import { Link, withRouter, Redirect } from 'react-router-dom';
import 'react-notifications-component/dist/theme.css'
import fbLogo from './icon.png';
import { updateKeywords, startKeyword } from "../store/actions/action";

// const Discord = require('discord.js');
// const { ipcRenderer, remote, Notification } = window.require('electron');
// const path = require('path');

function StartKeyword(props) {
    const [showConfirm, setConfirm] = useState(false);
    console.log(props)
    return (
        <Icon size="large" style={{margin:"10px"}} color="green" name='play' link onClick={()=> {
            const notification = new window.Notification(`Task started: ${props.keyword.keyword}`, {body: `Scraping for new listings...`, icon: fbLogo});
            return startScrape(props.startKeyword, props.status.settings, props.keyword, props.updateKeywords);
        }}>
        </Icon>
    );
};

const mapStateToProps = state => {
    return { status: state.status }
};

const mapDispatchToProps = dispatch => {
    return {
        updateKeywords: (keywords) => dispatch(updateKeywords(keywords)),
        startKeyword: (keyword, path, settings, save) => dispatch(startKeyword(keyword, path, settings, save))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(StartKeyword);

const startScrape = async (start, settings, keyword, saveKeywords) => {
    if (!settings || !settings.hasOwnProperty('chromePath')) return alert('Error: Please set your path to Google Chrome in Settings.');
    //if (!settings.hasOwnProperty('discordWebhook')) return alert('Error: Please set your Discord Webhook in Settings.');
    if (!settings.hasOwnProperty('interval')) return alert('Error: Please set an interval in Settings.');
    // let keywords = await JSON.parse(localStorage.getItem('keywords'));

    // const elementIdex = await keywords.findIndex(e => {
    //     return e.keyword === keyword.keyword;
    // });
    // let updatedKeyword = keywords[elementIdex] = {...keywords[elementIdex], online: true};
    // let newKeywords = await keywords.map(e => e.keyword === keyword.keyword ? updatedKeyword : e);
    // localStorage.setItem('keywords', JSON.stringify(newKeywords));
    // console.log(newKeywords)
    // saveKeywords(newKeywords);
    let path = await settings.chromePath.replace(/(.exe)/g, '');
    
    return start(keyword, path, settings, saveKeywords);
};