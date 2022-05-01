import React, { useState } from 'react'
import { connect } from 'react-redux';
import 'react-notifications-component/dist/theme.css'
import fbLogo from '../../../assets/icon2.png';
import { editKeyword, startKeyword } from "../../../store/actions/";
import { notify } from '../../../helpers/notification';

const ipcRenderer = window.require('electron').ipcRenderer;

function StartKeyword({ settings, keyword, startKeyword, editKeyword }) {

    const handleStart = () => {
        if (keyword.hasOwnProperty('pid')) {
            return alert('Please stop task first.');
        };

        if (!settings || !settings.hasOwnProperty('chromePath')) return notify('Error:', 'Please set your path to Google Chrome in Settings.', 'danger');
        if (!settings.hasOwnProperty('discordWebhook')) return alert('Error:', 'Please set your Discord Webhook in Settings.', 'danger');
        if (!settings.hasOwnProperty('interval')) return alert('Error:', 'Please set an interval in Settings.', 'danger');

        if (settings.desktopNotifications) new window.Notification(`Task started: ${keyword.keyword}`, {body: `Scraping for new listings...`, icon: fbLogo});
        if (settings.discordWebhook) {
            ipcRenderer.invoke(
                'send-discord-notification', 
                settings.discordWebhook, 
                "START", 
                {title: `Task started: ${keyword.keyword}`, description: `Now watching for new listings`}
            );
        };

        let path = settings.chromePath.replace(/(.exe)/g, '');

        return startKeyword(keyword, path, settings, editKeyword);
    };

    return (
        <>
        <svg onClick={handleStart} className={`w-6 ml-3 text-nanoGreen/50 hover:text-nanoGreen/100 transform hover:scale-110 duration-300 cursor-pointer`} xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 752 752" fill="currentColor">
            <path className="pointer-events-none" d="m175.63 168.56c-3.9531 0.16406-7.082 3.4102-7.0938 7.3711v400.12c0.003906 2.5586 1.3281 4.9375 3.5039 6.2852 2.1797 1.3477 4.8984 1.4727 7.1914 0.33203l400.12-200.04c2.5234-1.2461 4.1211-3.8164 4.1211-6.6328 0-2.8125-1.5977-5.3867-4.1211-6.6328l-400.12-200.04c-1.1172-0.55469-2.3555-0.81641-3.6016-0.76562z"/>
        </svg>
        </>
    );
};

const mapStateToProps = state => {
    return { settings: state.settings, keywords: state.keywords }
};

const mapDispatchToProps = dispatch => {
    return {
        editKeyword: (keyword) => dispatch(editKeyword(keyword)),
        startKeyword: (keyword, path, settings, editKeyword) => dispatch(startKeyword(keyword, path, settings, editKeyword))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(StartKeyword);

