import type { SettingsState } from '../types'

const initialState: SettingsState = {
  maxLines: 15000,
  maxChars: 10 * 1000 * 1000,
}

export default function settings(state: SettingsState = initialState, _action: { type: string }): SettingsState {
  return state
}
