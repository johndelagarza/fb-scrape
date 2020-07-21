import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';

import status from './store/reducers/status';
import 'semantic-ui-css/semantic.min.css'
import { ThemeProvider } from 'styled-components'
import App from './App';
import GlobalStyle from './theme/globalStyles';
import { Theme } from './theme/theme';

const rootReducer = combineReducers({
  status
});

const store = createStore(rootReducer);

ReactDOM.render(
  // <ThemeProvider theme={Theme}>
  //   <GlobalStyle />
  //   <App />
  // </ThemeProvider>,
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);