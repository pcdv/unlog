import * as ACTION from '../constants/actions'
import type { FileSelectionState } from '../types'

interface ReplaceLogFileAction {
  type: typeof ACTION.REPLACE_LOG_FILE
  name: string
  text: string
}

interface CloseLogFileAction {
  type: typeof ACTION.CLOSE_LOG_FILE
}

type FileSelectionAction = ReplaceLogFileAction | CloseLogFileAction

export default function fileSelection(
  state: FileSelectionState = {},
  action: FileSelectionAction
): FileSelectionState {
  switch (action.type) {
    case ACTION.REPLACE_LOG_FILE:
      return { ...state, name: action.name, text: action.text }

    case ACTION.CLOSE_LOG_FILE:
      return {}

    default:
      return state
  }
}
