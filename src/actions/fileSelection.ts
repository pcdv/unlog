import * as ACTION from '../constants/actions'
import type { AppDispatch } from '../store/configureStore'

export function loadFile(file: File) {
  return (dispatch: AppDispatch) => {
    const reader = new FileReader()
    reader.onload = (event) => dispatch(replaceLogFile(file, event.target?.result as string))
    reader.readAsText(file)
  }
}

export function replaceLogFile(file: File, text: string) {
  return {
    type: ACTION.REPLACE_LOG_FILE,
    name: file.name,
    text,
  } as const
}

export function closeFile() {
  return {
    type: ACTION.CLOSE_LOG_FILE,
  } as const
}
