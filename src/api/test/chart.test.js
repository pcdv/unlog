import { getResult } from '../../selectors/result'
import { setFilters } from '../../actions/filterActions'
import configureStore from '../../store/configureStore'

function compute(filters, text) {
  const store = configureStore()
  const file = { type: 'text', text, enabled: true }
  const show = { type: 'chart', enabled: true }
  store.dispatch(setFilters([file, ...filters, show]))
  return getResult(store.getState())
}

const log = `
2016-11-01 10:13:21,687 MM1 6 0    13 12 11 10 8 8
2016-11-01 10:13:21,707 MM1 2 0    13 13
2016-11-01 10:13:23,373 MM1 6 0    13 13 11 9 9 9
2016-11-01 10:13:23,391 MM1 4 0    14 13 13 12
2016-11-01 10:13:23,436 MM1 1 0    13
2016-11-01 10:13:23,681 MM1 10 0    10 10 10 9 9 8 8 7 4 0
2016-11-01 10:13:23,699 MM1 3 0    13 13 13
2016-11-01 10:13:25,416 MM1 3 0    13 13 12
`

it('throughput generates valid data', () => {
  const filters = [{ type: 'throughput', period: 1000, enabled: true }]
  expect(compute(filters, log).visualisations[0].data).toEqual(
    [
      { "Throughput": 2, "start": 1477991601000, "values": [1, 1] },
      { "Throughput": 5, "start": 1477991603000, "values": [1, 1, 1, 1, 1] },
      { "Throughput": 1, "start": 1477991605000, "values": [1] }
    ]
  )
})

const log2 = `
14:07:00,478 START ID=a
14:07:00,481 STOP ID=a
`

it('roundtrip generates valid data', () => {
  const filters = [{ type: 'roundtrip', start: 'START ID=(\\S+)', stop: 'STOP ID=(\\S+)', enabled: true }]
  expect(compute(filters, log2).visualisations[0].data).toEqual(
    [{
      id: "a",
      roundtrip: 3,
      start_ts: 1481202420478,
      start_str: "14:07:00,478",
      stop_ts: 1481202420481,
      stop_str: "14:07:00,481"
    }]
  )
})
