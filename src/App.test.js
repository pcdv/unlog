import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import configureStore from './store/configureStore'
import { Provider } from 'react-redux'

import { Route, Router, browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'

const store = configureStore()
const history = syncHistoryWithStore(browserHistory, store)

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>
    , div);
});
