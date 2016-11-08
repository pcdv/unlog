import {combineReducers} from 'redux'
import fileSelection from './fileSelection'
import filters from './filters'
import { routerReducer } from 'react-router-redux'

export default combineReducers({
  fileSelection, filters, routing: routerReducer
})