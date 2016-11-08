import * as ACTION from '../constants/actions'
import { replace } from 'react-router-redux'

export function setIncludes(include, qs = true) {
  return (dispatch, getState) => {
    dispatch({ type: ACTION.SET_INCLUDES, include })
    qs && dispatch(updateQuery())
  }
}

export function setExcludes(exclude, qs = true) {
  return (dispatch, getState) => {
    dispatch({ type: ACTION.SET_EXCLUDES, exclude })
    qs && dispatch(updateQuery())
  }
}

export function setReplaceRules(rules, qs = true) {
  return (dispatch, getState) => {
    dispatch({ type: ACTION.SET_REPLACE_RULES, rules })
    qs && dispatch(updateQuery())
  }
}


/**
 * Copies current filter state into query.
 */
export function updateQuery() {
  return (dispatch, getState) => {
    const {filters} = getState()
    const query = {
      include: escapeArray(filters.include),
      exclude: escapeArray(filters.exclude),
      replace: escapeJsonArray(filters.replaceRules)
    }
    dispatch(replace({ query }))
  }
}

export function initFilters() {
  return (dispatch, getState) => {
    const query = getState().routing.locationBeforeTransitions.query
    if (query.include)
      dispatch(setIncludes(toArray(query.include), false))
    if (query.exclude)
      dispatch(setExcludes(toArray(query.exclude), false))
    if (query.replace)
      dispatch(setReplaceRules(toJsonArray(query.replace), false))  
  }
}

export function addReplaceRule() {
  return (dispatch, getState) => {
    dispatch({ type: ACTION.ADD_REPLACE_RULE })
    dispatch(updateQuery())
  }
}

export function updateReplaceRule(index, data) {
  return (dispatch, getState) => {
    dispatch({ type: ACTION.UPDATE_REPLACE_RULE, index, data })
    dispatch(updateQuery())
  }
}

export function deleteReplaceRule(index) {
  return (dispatch, getState) => {
    dispatch({ type: ACTION.DELETE_REPLACE_RULE, index })
    dispatch(updateQuery())
  }
}

function escapeArray(arr) {
  if (!arr || !arr.length)
    return undefined

  return arr.map(i => escape(i)).join("+")
}


function escapeJsonArray(arr) {
  if (!arr || !arr.length)
    return undefined

  return arr.map(i => escape(JSON.stringify(i))).join("+")
}

function toArray(obj) {
  return obj.split("+").map(s => unescape(s))
}

function toJsonArray(obj) {
  return obj.split("+").map(s => JSON.parse(unescape(s)))
}
