import React from 'react'
import FileInput from '../forks/react-simple-file-input'
import { useDispatch, useSelector } from 'react-redux'
import { loadFile, closeFile } from '../actions/fileSelection'
import type { RootState, AppDispatch } from '../store/configureStore'

const FileSelection: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const name = useSelector((state: RootState) => state.fileSelection.name)

  return (
    <span>
      {name
        ? <button onClick={() => dispatch(closeFile())}>Close file</button>
        : <FileInput onChange={file => dispatch(loadFile(file))}>
          <button>Select file...</button>
        </FileInput>}
    </span>
  )
}

export default FileSelection
