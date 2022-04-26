import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { connect } from 'react-redux';
import Sidebar from './components/Sidebar';
import Scrape from './components/Scrape';
import Proxies from './components/Proxies';
import Notifications from './components/Notifications';
import Themes from './components/Themes';
import { setSettings, updateSettings } from "../../store/actions";
import { loadSavedData, saveDataInStorage } from "../../renderer.js";

function Settings({ settings, setSettings, updateSettings, changeTheme, theme }) {

    function useQuery() {
        return new URLSearchParams(useLocation().search);
    };

    let query = useQuery();
    
    console.log(settings)
    return (
        <div id="Settings" className='w-full'>
            <Sidebar />
            <div style={{paddingLeft: "208px"}}>
                {
                    query.get("type") === "scrape" ? (
                        <Scrape settings={settings} updateSettings={updateSettings} />
                    ) : query.get("type") === "proxies" ? (
                        <Proxies settings={settings} updateSettings={updateSettings} />
                    ) : query.get("type") === "notifications" ? (
                        <Notifications settings={settings} updateSettings={updateSettings} />
                    ) : query.get("type") === "themes" ? (
                        <Themes settings={settings} updateSettings={updateSettings} />
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