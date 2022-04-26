import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { connect } from 'react-redux';
import SettingsSidebar from '../components/SettingsSidebar';
import ScrapeSettings from './SettingTypes/ScrapeSettings';
import ProxiesSettings from './SettingTypes/ProxiesSettings';
import NotificationSettings from './SettingTypes/NotificationSettings';
import ThemeSettings from './SettingTypes/ThemeSettings';
import { setSettings, updateSettings } from "../store/actions";
import { loadSavedData, saveDataInStorage } from "../renderer.js";

const ipcRenderer = window.require('electron').ipcRenderer;
//const Discord = require('discord.js');

function Settings({ settings, setSettings, updateSettings, changeTheme, theme }) {

    function useQuery() {
        return new URLSearchParams(useLocation().search);
    };

    let query = useQuery();
    
    console.log(settings)
    return (
        <div id="Settings" className='w-full'>
            <SettingsSidebar />
            <div style={{paddingLeft: "208px"}}>
                {
                    query.get("type") === "scrape" ? (
                        <ScrapeSettings settings={settings} setSettings={setSettings} updateSettings={updateSettings} />
                    ) : query.get("type") === "proxies" ? (
                        <ProxiesSettings settings={settings} setSettings={setSettings} updateSettings={updateSettings} />
                    ) : query.get("type") === "notifications" ? (
                        <NotificationSettings settings={settings} setSettings={setSettings} updateSettings={updateSettings} />
                    ) : query.get("type") === "themes" ? (
                        <ThemeSettings settings={settings} setSettings={setSettings} updateSettings={updateSettings} />
                    ) : 
                    
                    <></>
                }
            </div>
            <button onClick={()=> changeTheme()}>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</button>
        </div>
    )
};


const mapDispatchToProps = dispatch => {
    return {
        setSettings: (settings) => dispatch(setSettings(settings)),
        updateSettings: (settings) => dispatch(updateSettings(settings))
    };
};

const mapStateToProps = state => {
    return { settings: state.settings }
  };

export default connect(mapStateToProps, mapDispatchToProps)(Settings);