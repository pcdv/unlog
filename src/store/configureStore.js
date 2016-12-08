import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import rootReducer from '../reducers/index';
import { routerMiddleware } from 'react-router-redux'
import { browserHistory } from 'react-router'

export default function configureStore(initialState) {
  let store = createStore(rootReducer,
    initialState,
    compose(
      applyMiddleware(thunkMiddleware, routerMiddleware(browserHistory))
      // ,
      // window.devToolsExtension ? window.devToolsExtension() : f => f
    ));

  return store;
}

export function configureTestStore(initialState) {
  let store = createStore(rootReducer, initialState, compose(
    applyMiddleware(thunkMiddleware)))

  return store;
}