import React, { useEffect } from 'react';
import { HashRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import ReactNotification from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';

import NavigationHeader from './components/NavigationHeader';
import Home from './pages/Home';
import Keywords from './pages/Keywords';
import Settings from './pages/Settings';
import Logs from './pages/Logs';

function App(props) {

  // useEffect(async ()=> {
  //   let keywords = JSON.parse(localStorage.getItem('keywords'));

  //   keywords = await keywords.map(keyword => {
  //     if (keyword.online === true) {
  //       return { ...keyword, online: false };
  //     } else return keyword;
  //   });
  //   return localStorage.setItem('keywords', JSON.stringify(keywords));
  // }, []);

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
  </div> 
  )
};

export default App;
