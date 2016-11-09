import * as ACTION from '../constants/actions'
import { replace } from 'react-router-redux'

/**
 * Copies current filter state into query.
 */
export function updateQuery() {
  return (dispatch, getState) => {
    const {filters} = getState()
    const query = {
      filters: escapeJsonArray(filters)
    }
    dispatch(replace({ query }))
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
    dispatch({ type: ACTION.ADD_FILTER, filter: Object.assign({}, data) })
    dispatch(updateQuery())
  }
}

export function updateFilter(index, data) {
  return (dispatch, getState) => {
    dispatch({ type: ACTION.UPDATE_FILTER, index, data })
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
