import React, { Component } from 'react';
import { connect } from 'react-redux'
import download from '../util/download'
import { getResult } from '../selectors/result'
import enumerate from '../util/enumerate'

// TODO: compute derived data in state + show it here
class Result extends Component {
  render() {
    const {result} = this.props

    return (
      <div>
        {result.errors.map(e => <pre key={e+""}>{""+e.stack}</pre>)}
        {enumerate(result.visualisations).map(viz => getViz(viz))}
      </div>
    );
  }
}

function mapStateToProps(state) {
  const result = getResult(state)
  return { result }
}


export default connect(mapStateToProps)(Result)

function getViz(viz) {
  switch (viz.type) {
    case "show":
      return <Show viz={viz} key={viz.index} />
    default:
      return <pre>Unknown viz {viz.type}</pre>
  }
}

const Show = ({viz}) => (
  <pre>
    <button onClick={() => download("out.csv", viz.text)}>Download as CSV</button>
    <br />
    {viz.charsDropped ? <h2>{viz.charsDropped}characters were truncated.</h2> : null}
    {viz.linesDropped ? <h2>{viz.linesDropped}lines were truncated.</h2> : null}
    {viz.text}
  </pre>
)