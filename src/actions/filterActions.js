import * as ACTION from '../constants/actions'
import { replace } from 'react-router-redux'

export function setIncludes(include) {
  return (dispatch, getState) => {
    dispatch({ type: ACTION.SET_INCLUDES, include })
    dispatch(updateQuery('include', include))
  }
}

export function setExcludes(exclude) {
  return (dispatch, getState) => {
    dispatch({ type: ACTION.SET_EXCLUDES, exclude })
    dispatch(updateQuery('exclude', exclude))
  }
}

export function updateQuery(key, arg) {
  return (dispatch, getState) => {
    const query = Object.assign({}, getState().routing.locationBeforeTransitions.query, {[key]: escapeArray(arg)})
    dispatch(replace({ query: query }))
  }
}

export function initFilters() {
  return (dispatch, getState) => {
    const query = getState().routing.locationBeforeTransitions.query
    if (query.include)
      dispatch(setIncludes(toArray(query.include)))
    if (query.exclude)
      dispatch(setExcludes(toArray(query.exclude)))
  }
}

export function addReplaceRule() {
  return {
    type: ACTION.ADD_REPLACE_RULE
  }
}

export function updateReplaceRule(index, data) {
  return {
    type: ACTION.UPDATE_REPLACE_RULE, index, data
  }
}

function escapeArray(arr) {
  if (!arr || !arr.length)
    return undefined

  return arr.map(i => escape(i)).join("+")
}

function toArray(obj) {
  return obj.split("+").map(s => unescape(s))
}
