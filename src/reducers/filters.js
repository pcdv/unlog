import * as ACTION from '../constants/actions'

export default function filters(state = [], action) {
  switch (action.type) {

    case ACTION.SET_FILTERS:
      return action.filters

    case ACTION.ADD_FILTER:
      return [...state, action.filter]

    case ACTION.UPDATE_FILTER:
      return [
        ...state.slice(0, action.index),
        Object.assign({}, state[action.index], action.data),
        ...state.slice(action.index + 1)]

    case ACTION.DELETE_FILTER:
      if (action.index >= 0 && action.index < state.length)
        return [...state.slice(0, action.index), ...state.slice(action.index + 1)]
      break

    default:
      return state
  }
}