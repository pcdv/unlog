import React from 'react'
import { useSelector } from 'react-redux'
import download from '../util/download'
import { getResult } from '../selectors/result'
import enumerate from '../util/enumerate'
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from 'recharts'
import type { RootState } from '../store/configureStore'
import type { Visualisation } from '../api/context'

const Result: React.FC = () => {
  const result = useSelector((state: RootState) => getResult(state))

  return (
    <div>
      {result.errors.map((e, i) => <pre key={i}>{"" + (e as Error).stack}</pre>)}
      {enumerate(result.visualisations).map(viz => getViz(viz))}
    </div>
  )
}

export default Result

function getViz(viz: Visualisation & { index: number; isLast?: boolean }) {
  switch (viz.type) {
    case 'show':
      return <Show viz={viz as ShowViz} key={viz.index} />
    case 'chart':
      return <Chart viz={viz as ChartViz} key={viz.index} />
    default:
      return <pre key={viz.index}>Unknown viz {viz.type}</pre>
  }
}

interface ShowViz extends Visualisation {
  text?: string
  charsDropped?: number
  linesDropped?: number
  index: number
}

const Show: React.FC<{ viz: ShowViz }> = ({ viz }) => (
  <pre>
    <button onClick={() => download('out.csv', viz.text ?? '')}>Download as CSV</button>
    <br />
    {viz.charsDropped ? <h2>{viz.charsDropped} characters were truncated.</h2> : null}
    {viz.linesDropped ? <h2>{viz.linesDropped} lines were truncated.</h2> : null}
    {viz.text}
  </pre>
)

interface ChartViz extends Visualisation {
  data: Record<string, unknown>[]
  filter: { width?: string; x?: string; y?: string }
  index: number
}

const Chart: React.FC<{ viz: ChartViz }> = ({ viz }) => (
  <LineChart width={parseInt(viz.filter.width ?? '600', 10)} height={300} data={viz.data}>
    <Line type="monotone" dataKey={viz.filter.y} stroke="#8884d8" dot={false} />
    <CartesianGrid stroke="#ccc" />
    <XAxis dataKey={viz.filter.x} minTickGap={20} />
    <YAxis />
  </LineChart>
)
