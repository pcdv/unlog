import * as ACTION from '../constants/actions'

export function loadFile(file) {
  return (dispatch, getState) => {
    const reader = new FileReader(file)
    reader.onload = (event) => dispatch(replaceLogFile(file, event.target.result))
    reader.readAsText(file)
  }
}

export function replaceLogFile(file, text) {
  return {
    type: ACTION.REPLACE_LOG_FILE,
    name: file.name,
    text
  }
}

export function closeFile() {
  return {
    type: ACTION.CLOSE_LOG_FILE
  }
}