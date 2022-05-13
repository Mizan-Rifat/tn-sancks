import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import Store from 'redux/Store';
import App from './App';
import Parse from 'parse';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

Parse.initialize(process.env.REACT_APP_PARSE_APP_ID);
Parse.masterKey = process.env.REACT_APP_PARSE_MASTER_KEY;
Parse.serverURL = 'http://localhost:1337/parse';
// Parse.serverURL = 'https://tn-snacks.herokuapp.com/parse';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={Store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

serviceWorkerRegistration.register();
