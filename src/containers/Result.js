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
        {result.errors.map(e => <pre key={e + ""}>{"" + e.stack}</pre>)}
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
    case "chart":
      return <Chart viz={viz} key={viz.index} />
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

import { LineChart, Line, CartesianGrid, XAxis, YAxis } from 'recharts'
const Chart = ({viz}) => (
  <LineChart width={parseInt(viz.filter.width || 600, 10)} height={300} data={viz.data}>
    <Line type="monotone" dataKey={viz.filter.y} stroke="#8884d8" dot={false}/>
    <CartesianGrid stroke="#ccc" />
    <XAxis dataKey={viz.filter.x} minTickGab={20}/>
    <YAxis />
  </LineChart>
)
/*

quote
%26%2327%3b)%3balert(42)
*/