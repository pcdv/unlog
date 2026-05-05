import { combineReducers } from '@reduxjs/toolkit'
import fileSelection from './fileSelection'
import filters from './filters'
import settings from './settings'

const rootReducer = combineReducers({
  fileSelection,
  filters,
  settings,
})

export default rootReducer
