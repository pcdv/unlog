import * as ACTION from '../constants/actions'

const initialState = [
  {type: 'cat', enabled: true}
]

export default function filters(state = initialState, action) {
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

    case ACTION.UP_FILTER:
      return [
        ...state.slice(0, action.index - 1),
        state[action.index],
        state[action.index - 1],
        ...state.slice(action.index + 1)]

    case ACTION.DOWN_FILTER:
      return [
        ...state.slice(0, action.index),
        state[action.index + 1],
        state[action.index],
        ...state.slice(action.index + 2)]

    case ACTION.DELETE_FILTER:
      if (action.index >= 0 && action.index < state.length)
        return [...state.slice(0, action.index), ...state.slice(action.index + 1)]
      break

    default:
      return state
  }
}