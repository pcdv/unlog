import { combineReducers } from '@reduxjs/toolkit'
import fileSelection from './fileSelection'
import filters from './filters'
import settings from './settings'
import colorRules from './colorRules'

const rootReducer = combineReducers({
  fileSelection,
  filters,
  settings,
  colorRules,
})

export default rootReducer
