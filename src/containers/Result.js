import React, { Component } from 'react';
import { connect } from 'react-redux'
import download from '../util/download'
import {getResult} from '../selectors/result'

// TODO: compute derived data in state + show it here
class Result extends Component {
  render() {
    const {result} = this.props

    if (!result.text)
      return <span />

    return (
      <pre>
        <button onClick={() => download("out.csv", result.text)}>Download as CSV</button>
        {result.text}
      </pre>
    );
  }
}

function mapStateToProps(state) {
  const result = getResult(state)
  return { result }
}


export default connect(mapStateToProps)(Result)