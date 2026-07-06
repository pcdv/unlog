import type { SettingsState } from '../types'
import * as ACTION from '../constants/actions'

const initialState: SettingsState = {
  maxLines: 15000,
  maxChars: 10 * 1000 * 1000,
}

export default function settings(state: SettingsState = initialState, action: { type: string; folded?: boolean }): SettingsState {
  if (action.type === ACTION.SET_HEADER_FOLDED) {
    return { ...state, headerFolded: action.folded }
  }
  return state
}
