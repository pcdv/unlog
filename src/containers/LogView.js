import React, { Component } from 'react';
import { connect } from 'react-redux'
import './LogView.css'
import download from '../util/download'

class LogView extends Component {
  render() {
    const {file, filters} = this.props

    if (!file)
      return <span />

    const text = file.getExcerpt(filters)
    
    return (
      <pre>
        <button onClick={() => download("out.csv", text)}>Download as CSV</button>
        {text}
      </pre>
    );
  }
}

function mapStateToProps(state) {
  const {file} = state.fileSelection
  const {filters} = state
  return { file, filters }
}


export default connect(mapStateToProps)(LogView)