import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import ReactNotification from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';

import Login from './pages/Login';
import Dropdown from './components/Dropdown';
import NavigationHeader from './components/NavigationHeader';
import Items from './pages/Home';
import Keywords from './pages/Keywords';
import Settings from './pages/Settings';
import Logs from './pages/Logs';
import icon from './assets/icon2.png';
import { connect } from 'react-redux';
import { addLog } from "./store/actions";

const ipcRenderer = window.require('electron').ipcRenderer;
const customTitlebar = window.require('custom-electron-titlebar');
const { notify } = require('./utils/notification');

function App(props) {
  const [ dropdownOpen, setDropdownOpen ] = useState(false);
  const [appVersion, setAppVersion] = useState('');
  const [theme, setTheme] = useState('dark');

  useEffect(()=> {
    console.log(props.status)
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
  return { status: state.status }
};

const mapDispatchToProps = dispatch => {
  return {
      addLog: (log) => dispatch(addLog(log))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App)