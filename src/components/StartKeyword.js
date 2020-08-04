import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux';
import { Container, Image, Menu, Modal, Header, Portal, Segment, Form, Button, Icon, Input, Divider, Dropdown } from 'semantic-ui-react';
import { Link, withRouter, Redirect } from 'react-router-dom';
import 'react-notifications-component/dist/theme.css'
import fbLogo from './icon.png';
import { updateKeywords, startKeyword } from "../store/actions/action";

function StartKeyword(props) {
    const [showConfirm, setConfirm] = useState(false);
    
    return (
        <Icon size="large" style={{margin:"10px"}} color="green" name='play' link onClick={()=> {
            if (props.keyword.hasOwnProperty('pid')) {
                return alert('Please stop task first.');
            }
            
            return startScrape(props.startKeyword, props.status.settings, props.keyword.platform, props.keyword, props.updateKeywords);
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
        startKeyword: (platform, keyword, path, settings, save) => dispatch(startKeyword(platform, keyword, path, settings, save))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(StartKeyword);

const startScrape = async (start, settings, platform, keyword, saveKeywords) => {
    if (!settings || !settings.hasOwnProperty('chromePath')) return alert('Error: Please set your path to Google Chrome in Settings.');
    if (!settings.hasOwnProperty('discordWebhook')) return alert('Error: Please set your Discord Webhook in Settings.');
    if (!settings.hasOwnProperty('interval')) return alert('Error: Please set an interval in Settings.');
    new window.Notification(`Task started: ${keyword.keyword}`, {body: `Scraping for new listings...`, icon: fbLogo});
    let path = await settings.chromePath.replace(/(.exe)/g, '');
    console.log(platform)
    return start(platform, keyword, path, settings, saveKeywords);
};