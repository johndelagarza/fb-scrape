import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';

import status from './store/reducers/status';
import 'semantic-ui-css/semantic.min.css'
import App from './App';

const rootReducer = combineReducers({
  status
});

const store = createStore(rootReducer);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);