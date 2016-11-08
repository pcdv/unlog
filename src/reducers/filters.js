import * as ACTION from '../constants/actions'

const INITIAL_STATE = {
  include: [],
  exclude: [],
  replaceRules: [],
}

export default function filters(state = INITIAL_STATE, action) {
  switch (action.type) {

    case ACTION.SET_INCLUDES:
      return Object.assign({}, state, { include: action.include })

    case ACTION.SET_EXCLUDES:
      return Object.assign({}, state, { exclude: action.exclude })

    case ACTION.SET_REPLACE_RULES:
      return Object.assign({}, state, { replaceRules: action.rules})

    case ACTION.ADD_REPLACE_RULE:
      return Object.assign({}, state, { replaceRules: [...state.replaceRules, { pattern: '', replace: '' }] })

    case ACTION.UPDATE_REPLACE_RULE: {
      const rules = state.replaceRules
      const newRules = [...rules.slice(0, action.index), Object.assign({}, rules[action.index], action.data), ...rules.slice(action.index + 1)]
      return Object.assign({}, state, { replaceRules: newRules })
    }

    case ACTION.DELETE_REPLACE_RULE: {
      const rules = state.replaceRules
      const newRules = [...rules.slice(0, action.index), ...rules.slice(action.index + 1)]
      return Object.assign({}, state, { replaceRules: newRules })
    }

    default:
      return state
  }
}