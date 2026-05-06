import React from 'react'
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from 'recharts'
import type { Visualisation } from '../api/context'

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

export default Chart
