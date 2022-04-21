import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux';
import { Link, withRouter, Redirect } from 'react-router-dom';
import 'react-notifications-component/dist/theme.css'
import fbLogo from './icon.png';
import { updateKeywords, startKeyword, stopKeyword  } from "../store/actions/action";

const ipcRenderer = window.require('electron').ipcRenderer;

function StartKeyword(props) {
    const [showConfirm, setConfirm] = useState(false);

    const handleStart = () => {
        if (props.keyword.hasOwnProperty('pid')) {
            return alert('Please stop task first.');
        }

        if (props.status.settings.desktopNotifications) new window.Notification(`Task started: ${props.keyword.keyword}`, {body: `Scraping for new listings...`, icon: fbLogo});
        if (props.status.settings.discordWebhook) {
            ipcRenderer.invoke(
                'sendDiscordNotification', 
                props.status.settings.discordWebhook, 
                "START", 
                {title: `Task started: ${props.keyword.keyword}`, description: `Now watching for new listings`}
            );
        }

        return startScrape(props.startKeyword, props.status.settings, props.keyword, props.updateKeywords);
    };

    const handleStop = () => {
        return props.stopKeyword(props.keyword);
    };
    
    return (
        <>
        {
            props.keyword.hasOwnProperty('pid') ?
                <svg onClick={handleStop} className={`w-6 ml-3 text-error/50 hover:text-error/100 transform hover:scale-110 duration-300 cursor-pointer`} xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 752 752" fill="currentColor">
                    <path xmlns="http://www.w3.org/2000/svg" d="m562.93 612.79h-374.77c-26.922 0-48.945-22.027-48.945-48.941v-374.77c0-26.922 22.023-48.945 48.945-48.945h374.77c26.918 0 48.945 22.023 48.945 48.945v374.77c-0.003906 26.914-22.027 48.941-48.949 48.941z" fill-rule="evenodd"/>
                </svg>
            :
                <svg onClick={handleStart} className={`w-6 ml-3 text-nanoGreen/50 hover:text-nanoGreen/100 transform hover:scale-110 duration-300 cursor-pointer`} xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 752 752" fill="currentColor">
                    <path className="pointer-events-none" d="m175.63 168.56c-3.9531 0.16406-7.082 3.4102-7.0938 7.3711v400.12c0.003906 2.5586 1.3281 4.9375 3.5039 6.2852 2.1797 1.3477 4.8984 1.4727 7.1914 0.33203l400.12-200.04c2.5234-1.2461 4.1211-3.8164 4.1211-6.6328 0-2.8125-1.5977-5.3867-4.1211-6.6328l-400.12-200.04c-1.1172-0.55469-2.3555-0.81641-3.6016-0.76562z"/>
                </svg>
        }
        </>
    );
};

const mapStateToProps = state => {
    return { status: state.status }
};

const mapDispatchToProps = dispatch => {
    return {
        updateKeywords: (keywords) => dispatch(updateKeywords(keywords)),
        startKeyword: (keyword, path, settings, save) => dispatch(startKeyword(keyword, path, settings, save)),
        stopKeyword: (keyword) => dispatch(stopKeyword(keyword))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(StartKeyword);

const startScrape = async (start, settings, keyword, saveKeywords) => {
    if (!settings || !settings.hasOwnProperty('chromePath')) return alert('Error: Please set your path to Google Chrome in Settings.');
    if (!settings.hasOwnProperty('discordWebhook')) return alert('Error: Please set your Discord Webhook in Settings.');
    if (!settings.hasOwnProperty('interval')) return alert('Error: Please set an interval in Settings.');

    let path = await settings.chromePath.replace(/(.exe)/g, '');
    
    return start(keyword, path, settings, saveKeywords);
};