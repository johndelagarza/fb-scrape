import React, { useEffect } from 'react';
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
      <Container textAlign="center" style={{position: "fixed", left: "0", bottom: "0", height: "40px", width: "100%"}}>
        <p style={{margin:"10px", display: "inline"}}>Created by John DeLaGarza</p>
        <Icon size="large" style={{margin:"10px", display: "inline"}} color="blue" name='twitter' link onClick={()=> ipcRenderer.invoke('open-listing', 'https://twitter.com/John_DeLaGarza')} />
        <Icon size="large" style={{margin:"10px", display: "inline"}} color="black" name='github' link onClick={()=> ipcRenderer.invoke('open-listing', 'https://github.com/johndelagarza')} />
      </Container>
  </div> 
  )
};

export default App;
