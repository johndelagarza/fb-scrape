import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import ReactNotification from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import { ThemeProvider } from 'styled-components'
import GlobalStyle from './theme/globalStyles';
import { lightTheme, darkTheme } from './theme/theme';

import NavigationHeader from './components/NavigationHeader';
import Items from './pages/Items';
import Keywords from './pages/Keywords';
import Settings from './pages/Settings';
import Logs from './pages/Logs';
import icon from './assets/icon2.png';

const ipcRenderer = window.require('electron').ipcRenderer;
const customTitlebar = window.require('custom-electron-titlebar');
const { notify } = require('./utils/notification');

function App(props) {
  const [appVersion, setAppVersion] = useState('');
  const [theme, setTheme] = useState('light');

  useEffect(()=> {
    let titleBar = new customTitlebar.Titlebar({
      backgroundColor: customTitlebar.Color.fromHex(lightTheme.colors.body),
      icon: icon,
      menu: null
    });
    
    titleBar.updateTitle(' ');

    ipcRenderer.send('app_version');

    ipcRenderer.on('app_version', (event, arg) => {
      console.log('getting app version')
      ipcRenderer.removeAllListeners('app_version');
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

    if (!theme) localStorage.setItem('theme', 'light');
    return setTheme(theme);
  }, []);

  const changeTheme = () => {
    let currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'light') {
      setTheme('dark');
      return localStorage.setItem('theme', 'dark');
    } else {
      setTheme('light');
      return localStorage.setItem('theme', 'light');
    }
  };

  function restartApp() {
    ipcRenderer.send('restart_app');
  }

return (
  <div>
    <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
    <GlobalStyle />
      <Router>
      <ReactNotification />
          <NavigationHeader />
            <Switch>
              <Route exact path="/" component={Items} />
              <Route exact path="/Keywords" component={Keywords} />
              <Route exact path="/Settings" render={(props) => <Settings {...props} theme={theme} changeTheme={changeTheme} />} />
              <Route exact path="/Logs" component={Logs} />
            </Switch>
        </Router>
      </ThemeProvider>
  </div> 
  )
};

export default App;
