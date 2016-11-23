import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import configureStore from './store/configureStore'
import { Provider } from 'react-redux'
import { Route, Router, browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'

const store = configureStore()
const history = syncHistoryWithStore(browserHistory, store)

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={App}></Route>
      <Route path="/unlog" component={App}></Route>
    </Router>
  </Provider>,
  document.getElementById('root')
);
