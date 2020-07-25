import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import ReactNotification from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import { Container, Image, Divider, List, Header, Icon } from 'semantic-ui-react';

import NavigationHeader from './components/NavigationHeader';
import Home from './pages/Home';
import Keywords from './pages/Keywords';
import Settings from './pages/Settings';
import Logs from './pages/Logs';
const ipcRenderer = window.require('electron').ipcRenderer;



function App(props) {
  const [appVersion, setAppVersion] = useState('');
  useEffect(()=> {
    ipcRenderer.send('app_version');
    ipcRenderer.on('app_version', (event, arg) => {
      console.log('getting app version')
      ipcRenderer.removeAllListeners('app_version');
      return setAppVersion(arg.version);
    });
  }, []);

return (
  <div>
    <Router>
    <ReactNotification />
        <NavigationHeader />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/Keywords" component={Keywords} />
            <Route exact path="/Settings" component={Settings} />
            <Route exact path="/Logs" component={Logs} />
          </Switch>
      </Router>
      <Container textAlign="center" style={{position: "fixed", left: "0", bottom: "0", height: "40px", width: "100%", backgroundColor: "#F7EBE8", zIndex: "5", boxShadow: "-4px 0px 15px -4px rgba(0,0,0,.5)"}}>
        <div style={{marginTop: "10px"}}>
        <p style={{margin:"10px", display: "inline", textShadow: "1px 1px 6px rgba(150, 150, 150, 1)"}}>Created by John DeLaGarza</p>
        <Icon size="large" style={{margin:"10px", display: "inline", textShadow: "1px 1px 6px rgba(150, 150, 150, 1)"}} color="blue" name='twitter' link onClick={()=> ipcRenderer.invoke('open-listing', 'https://twitter.com/John_DeLaGarza')} />
        <Icon size="large" style={{margin:"10px", display: "inline", textShadow: "1px 1px 6px rgba(150, 150, 150, 1)"}} color="black" name='github' link onClick={()=> ipcRenderer.invoke('open-listing', 'https://github.com/johndelagarza')} />
        <p style={{marginRight:"10px", display: "inline", textShadow: "1px 1px 6px rgba(150, 150, 150, 1)", position: 'fixed', right: "0"}}>Version: {appVersion}</p>
        </div>
      </Container>
  </div> 
  )
};

export default App;
