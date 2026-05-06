import * as ACTION from '../constants/actions'
import type { Filter, FilterUpdate } from '../types'

interface SetFiltersAction { type: typeof ACTION.SET_FILTERS; filters: Filter[] }
interface AddFilterAction { type: typeof ACTION.ADD_FILTER; filter: Filter }
interface UpdateFilterAction { type: typeof ACTION.UPDATE_FILTER; index: number; data: FilterUpdate }
interface UpFilterAction { type: typeof ACTION.UP_FILTER; index: number }
interface DownFilterAction { type: typeof ACTION.DOWN_FILTER; index: number }
interface DeleteFilterAction { type: typeof ACTION.DELETE_FILTER; index: number }
interface MoveFilterAction { type: typeof ACTION.MOVE_FILTER; from: number; to: number }

type FiltersAction =
  | SetFiltersAction
  | AddFilterAction
  | UpdateFilterAction
  | UpFilterAction
  | DownFilterAction
  | DeleteFilterAction
  | MoveFilterAction

const initialState: Filter[] = [
  { type: 'cat', enabled: true },
  { type: 'show', enabled: true },
]

export default function filters(state: Filter[] = initialState, action: FiltersAction): Filter[] {
  switch (action.type) {
    case ACTION.SET_FILTERS:
      return action.filters

    case ACTION.ADD_FILTER:
      return [...state.slice(0, -1), action.filter, state[state.length - 1]]

    case ACTION.UPDATE_FILTER:
      return [
        ...state.slice(0, action.index),
        Object.assign({}, state[action.index], action.data) as Filter,
        ...state.slice(action.index + 1),
      ]

    case ACTION.UP_FILTER:
      return [
        ...state.slice(0, action.index - 1),
        state[action.index],
        state[action.index - 1],
        ...state.slice(action.index + 1),
      ]

    case ACTION.DOWN_FILTER:
      return [
        ...state.slice(0, action.index),
        state[action.index + 1],
        state[action.index],
        ...state.slice(action.index + 2),
      ]

    case ACTION.MOVE_FILTER: {
      const next = [...state]
      const [item] = next.splice(action.from, 1)
      next.splice(action.to, 0, item)
      return next
    }

    case ACTION.DELETE_FILTER:
      if (action.index >= 0 && action.index < state.length)
        return [...state.slice(0, action.index), ...state.slice(action.index + 1)]
      return state

    default:
      return state
  }
}
