import React, { Component } from 'react';
import FileInput from '../forks/react-simple-file-input'
import { connect } from 'react-redux'
import { loadFile, closeFile } from '../actions/fileSelection'

class FileSelection extends Component {
  render() {
    const {name, onFileChange, onCloseFile} = this.props

    return (
      <div>
        {name
          ? <div>Selected file: {name}
          <button onClick={onCloseFile}>Close</button>
          </div>
          : <FileInput onChange={onFileChange}>
            <button>Select file...</button>
          </FileInput>}
      </div>
    );
  }
}

function mapStateToProps(state) {
  const {name} = state.fileSelection
  return { name }
}

function mapDispatchToProps(dispatch) {
  return {
    onFileChange: file => dispatch(loadFile(file)),
    onCloseFile: () => dispatch(closeFile())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FileSelection)