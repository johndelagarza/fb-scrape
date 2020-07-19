import React from 'react';
import ReactDOM from 'react-dom';

import 'semantic-ui-css/semantic.min.css'
import { ThemeProvider } from 'styled-components'
import App from './App';
import GlobalStyle from './theme/globalStyles';
import { Theme } from './theme/theme';

ReactDOM.render(
  // <ThemeProvider theme={Theme}>
  //   <GlobalStyle />
  //   <App />
  // </ThemeProvider>,
  <App />,
  document.getElementById('root')
);