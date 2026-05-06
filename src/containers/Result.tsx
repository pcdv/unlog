import React, { lazy, Suspense } from 'react'
import { useSelector } from 'react-redux'
import download from '../util/download'
import { getResult } from '../selectors/result'
import enumerate from '../util/enumerate'
import type { RootState } from '../store/configureStore'
import type { Visualisation } from '../api/context'

const Chart = lazy(() => import('./Chart'))

const Result: React.FC = () => {
  const result = useSelector((state: RootState) => getResult(state))

  return (
    <div className="result-area">
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
      return <Suspense key={viz.index} fallback={null}><Chart viz={viz as ChartViz} /></Suspense>
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
  <div>
    <div className="result-toolbar">
      <button onClick={() => download('out.csv', viz.text ?? '')}>Download as CSV</button>
      {viz.charsDropped ? <span className="result-warn">{viz.charsDropped} characters were truncated.</span> : null}
      {viz.linesDropped ? <span className="result-warn">{viz.linesDropped} lines were truncated.</span> : null}
    </div>
    <pre>{viz.text}</pre>
  </div>
)

interface ChartViz extends Visualisation {
  data: Record<string, unknown>[]
  filter: { width?: string; x?: string; y?: string }
  index: number
}
