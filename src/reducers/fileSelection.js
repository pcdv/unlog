import * as ACTION from '../constants/actions'

export default function fileSelection(state = {}, action) {
  switch (action.type) {
    case ACTION.REPLACE_LOG_FILE:
      return Object.assign({}, state, {
        name: action.name,
        file: action.file
      })

    case ACTION.CLOSE_LOG_FILE:
      return {}
      
    default:
      return state
  }
}