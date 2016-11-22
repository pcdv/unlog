import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import fileSelection from './fileSelection'
import filters from './filters'
import settings from './settings'

export default combineReducers({
  fileSelection, // FIXME useless but required by title in App
  filters,
  settings,
  routing: routerReducer
})