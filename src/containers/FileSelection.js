import React, { Component } from 'react';
import FileInput from '../forks/react-simple-file-input'
import { connect } from 'react-redux'
import { loadFile, closeFile } from '../actions/fileSelection'

class FileSelection extends Component {
  render() {
    const {name, onFileChange, onCloseFile} = this.props

    return (
      <span>
        {name
          ? <button onClick={onCloseFile}>Close file</button>
          : <FileInput onChange={onFileChange}>
            <button>Select file...</button>
          </FileInput>}
      </span>
    );
  }
}

function mapStateToProps(state) {
  const {name} = state.fileSelection
  return { name }
}

const mapDispatchToProps = {
  onFileChange: loadFile,
  onCloseFile: closeFile
}

export default connect(mapStateToProps, mapDispatchToProps)(FileSelection)