import type { ColorRule } from '../types'
import * as ACTION from '../constants/actions'

interface Action {
  type: string
  rule?: ColorRule
  index?: number
  rules?: ColorRule[]
  color?: string
  pattern?: string
}

const initialState: ColorRule[] = []

export default function colorRules(
  state: ColorRule[] = initialState,
  action: Action,
): ColorRule[] {
  switch (action.type) {
    case ACTION.ADD_COLOR_RULE:
      return action.rule ? [...state, action.rule] : state
    case ACTION.REMOVE_COLOR_RULE:
      return action.index !== undefined
        ? state.filter((_, i) => i !== action.index)
        : state
    case ACTION.UPDATE_COLOR_RULE:
      return action.index !== undefined
        ? state.map((r, i) =>
            i === action.index
              ? { pattern: action.pattern ?? r.pattern, color: action.color ?? r.color }
              : r,
          )
        : state
    case ACTION.SET_COLOR_RULES:
      return action.rules ?? state
    default:
      return state
  }
}
