import { forwardToRenderer, triggerAlias, replayActionMain } from 'electron-redux';
const { status } = require('./reducers/status');

const app = combineReducers(status);
 
const store = createStore(
  app,
  applyMiddleware(
    forwardToRenderer, // IMPORTANT! This goes last
  ),
);
 
replayActionMain(store);