import * as ACTION from '../constants/actions'
import { replace } from 'react-router-redux'

/**
 * First use = avoid serializing full text in URL...
 */
function removePrivateFields(obj) {
  var res = {}
  for (var i in obj) {
    if (i.charAt(0) !== '_')
      res[i] = obj[i]
  }
  return res
}

/**
 * Copies current filter state into query.
 */
export function updateQuery() {
  return (dispatch, getState) => {
    const {filters, routing} = getState()
    const pathname = routing.locationBeforeTransitions ? routing.locationBeforeTransitions.pathname : ''
    const query = {
      filters: escapeJsonArray(filters.map(removePrivateFields))
    }
    dispatch(replace({ pathname, query }))
  }
}

export function loadFile(index, file) {
  return (dispatch, getState) => {
    const reader = new FileReader(file)
    reader.onload = (event) => dispatch(updateFilter(index, {file, _text: event.target.result}))
    reader.readAsText(file)
  }
}

export function initFilters() {
  return (dispatch, getState) => {
    const query = getState().routing.locationBeforeTransitions.query
    if (query.filters)
      dispatch(setFilters(toJsonArray(query.filters), false))
  }
}

export function setFilters(filters, qs) {
  return (dispatch, getState) => {
    dispatch({ type: ACTION.SET_FILTERS, filters})
    qs && dispatch(updateQuery())
  }
}

export function addFilter(data) {
  return (dispatch, getState) => {
    dispatch({ type: ACTION.ADD_FILTER, filter: Object.assign({type: "invalid", enabled: true}, data) })
    dispatch(updateQuery())
  }
}

export function updateFilter(index, data) {
  return (dispatch, getState) => {
    dispatch({ type: ACTION.UPDATE_FILTER, index, data })
    dispatch(updateQuery())
  }
}

export function upFilter(index) {
  return (dispatch, getState) => {
    dispatch({ type: ACTION.UP_FILTER, index})
    dispatch(updateQuery())
  }
}

export function downFilter(index) {
  return (dispatch, getState) => {
    dispatch({ type: ACTION.DOWN_FILTER, index})
    dispatch(updateQuery())
  }
}

export function deleteFilter(index) {
  return (dispatch, getState) => {
    dispatch({ type: ACTION.DELETE_FILTER, index })
    dispatch(updateQuery())
  }
}

export function escapeArray(arr) {
  if (!arr || !arr.length)
    return undefined

  return arr.map(i => escape(i)).join("+")
}

export function toArray(obj) {
  return obj.split("+").map(s => unescape(s))
}

export function escapeJsonArray(arr) {
  if (!arr || !arr.length)
    return undefined

  return arr.map(i => escplus(JSON.stringify(i))).join("+")
}

export function toJsonArray(obj) {
  return obj.split("+").map(s => JSON.parse(unescape(s)))
}

function escplus(s) {
  return escape(s).replace(/\+/g, '%2B')
}
