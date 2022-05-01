import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import ReactNotification from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';

import Login from './Pages/Login/Login';
import Dropdown from './components/Dropdown';
import NavigationHeader from './components/NavigationHeader';
import Items from './Pages/Home/Home';
import Keywords from './Pages/Keywords/Keywords';
import Settings from './Pages/Settings/Settings';
import Logs from './Pages/Logs/Logs';
import icon from './assets/icon2.png';
import { connect } from 'react-redux';
import { loadSavedData } from "./renderer";
import { setKeywords, setSettings, setLogs, setUser } from "./store/actions";
import { checkAuth } from './api/auth';

const ipcRenderer = window.require('electron').ipcRenderer;
const customTitlebar = window.require('custom-electron-titlebar');
const { notify } = require('./helpers/notification');

function App({ setKeywords, setSettings, setLogs, setUser, auth }) {
  const [ dropdownOpen, setDropdownOpen ] = useState(false);
  const [appVersion, setAppVersion] = useState('');
  const [theme, setTheme] = useState('dark');

  const noAuthRoutes = ['/login', '/logout']

  useEffect(()=> {

    const isNoAuthRoute = noAuthRoutes.includes(window.location.pathname);
  
    if (!isNoAuthRoute) {
      checkAuth().then(response => response.success ? setUser(response.success.user) : null)
    };

    loadSavedData("keywords").then(data => setKeywords(data));
    loadSavedData("settings").then(data => setSettings(data));
    loadSavedData("logs").then(data => setLogs(data));

    let titleBar = new customTitlebar.Titlebar({
      backgroundColor: customTitlebar.Color.fromHex("#13131C"),
      titleHorizontalAlignment: 'left',
      icon: icon,
      menu: null
    });

    ipcRenderer.send('app_version');

    ipcRenderer.on('app_version', (event, arg) => {
      console.log('getting app version')
      ipcRenderer.removeAllListeners('app_version');
      titleBar.updateTitle(arg.version);
      return setAppVersion(arg.version);
    });

    ipcRenderer.on('update_available', (event, arg) => {
      console.log('update available');
      console.log(arg)
      notify('Update Available', `Version: ${arg.version} found.`, 'info');
      
      ipcRenderer.removeAllListeners('update_available');
      //message.innerText = 'A new update is available. Downloading now...';
      //notification.classList.remove('hidden');
    });

    ipcRenderer.on('update_downloaded', (event, arg) => {
      console.log('Update downloaded.');
      console.log(arg)
      notify('Update Downloaded', `Version: ${arg.version} downloaded.`, 'success');
      ipcRenderer.removeAllListeners('update_downloaded');
      // message.innerText = 'Update Downloaded. It will be installed on restart. Restart now?';
      // restartButton.classList.remove('hidden');
      // notification.classList.remove('hidden');
    });

    let theme = localStorage.getItem('theme');

    if (!theme) {
      localStorage.setItem('theme', 'dark');
      theme = 'dark'
    }

    let body = document.getElementById("main");
    body.className = `theme-${theme}`

    return setTheme(theme);
  }, []);

  const changeTheme = () => {
    let currentTheme = localStorage.getItem('theme');
    let body = document.getElementById("main");
    
    if (currentTheme === 'light') {
      setTheme('dark');
      body.className = "theme-dark"

      return localStorage.setItem('theme', 'dark');
    } else {
      setTheme('light');
      body.className = "theme-light"
      
      return localStorage.setItem('theme', 'light');
    }
  };

  function restartApp() {
    ipcRenderer.send('restart_app');
  }

  const toggle = () => {
    setDropdownOpen(!dropdownOpen);
  };
  console.log(auth)
  return (
    <div>
      <Router>
      <ReactNotification className="fixed bottom-2 right-0" />
        <Route exact path="/" component={Login} />
        <NavigationHeader toggle={toggle} />
        <Dropdown isOpen={dropdownOpen} toggle={toggle} />
          <Switch>
            <Route exact path="/home" component={Items} />
            <Route exact path="/Keywords" component={Keywords} />
            <Route exact path="/Settings" render={(props) => <Settings {...props} theme={theme} changeTheme={changeTheme} />} />
            <Route exact path="/Logs" component={Logs} />
          </Switch>
        </Router>
    </div> 
  )
};

const mapStateToProps = state => {
  return { auth: state.auth }
};

const mapDispatchToProps = dispatch => {
  return {
      setKeywords: (data) => dispatch(setKeywords(data)),
      setSettings: (data) => dispatch(setSettings(data)),
      setLogs: (data) => dispatch(setLogs(data)),
      setUser: (data) => dispatch(setUser(data))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App)