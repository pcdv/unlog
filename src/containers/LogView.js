import React, { Component } from 'react';
import { connect } from 'react-redux'
import './LogView.css'

class LogView extends Component {
  render() {
    const {file, filters} = this.props

    if (!file)
      return <span/>

    return (
      <pre>
      {file.getExcerpt(filters)}
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