import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import fileSelection from './fileSelection'
import filters from './filters'

export default combineReducers({
  fileSelection,
  filters,
  routing: routerReducer
})