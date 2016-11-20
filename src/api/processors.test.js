import { getResult } from '../selectors/result'
import { setFilters } from '../actions/filterActions'
import configureStore from '../store/configureStore'

function apply(filters, text) {
    const store = configureStore()
    const file = {type: 'text', text, enabled: true}
    store.dispatch(setFilters([file].concat(filters)))
    return getResult(store.getState()).text
}

it("should tolerate invalid filters", () => {
    const filters = [{}]
    const res = apply(filters, "foo")
    expect(res).toEqual("foo")
})

it("applies include rule", () => {
    const filters = [{ type: 'include', pattern: 'bar', enabled: true }]
    const file = "foo\nbar\nbaz"
    const res = apply(filters, file)
    expect(res).toEqual("bar")
})

it("applies exclude rule", () => {
    const filters = [{ type: 'exclude', pattern: 'bar', enabled: true }]
    const file = "foo\nbar\nbaz"
    const res = apply(filters, file)
    expect(res).toEqual("foo\nbaz")
})

it("applies replace rule", () => {
    const filters = [{ type: 'replace', pattern: 'b(.)r', replace: '$1', enabled: true }]
    const file = "foo\nbar\nbaz"
    const res = apply(filters, file)
    expect(res).toEqual("foo\na\nbaz")
})

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

it('fills zeros', () => {
    const filters = [{ type: 'throughput', period: 1000, fillZeros: 'y', enabled: true }]
    expect(apply(filters, log)).toEqual(`Time;Throughput
10:13:21;2
10:13:22;0
10:13:23;5
10:13:24;0
10:13:25;1`)
})

it('calculates weight', () => {
    const filters = [{ type: 'throughput', period: 1000, weight: '.*MM1 (\\d+) .*', enabled: true }]
    expect(apply(filters, log)).toEqual(`Time;Throughput
10:13:21;8
10:13:23;24
10:13:25;3`)
})

it('supports weird periods', () => {
    const filters = [{ type: 'throughput', period: 5000, enabled: true }]
    expect(apply(filters, log)).toEqual(`Time;Throughput
10:13:20;1.4
10:13:25;0.2`)
})


it('supports HH:mm:ss,SSS', () => {
    const filters = [{ type: 'throughput', period: 5000, enabled: true }]
    expect(apply(filters, log.replace(/2016-11-01 /g, ''))).toEqual(`Time;Throughput
10:13:20;1.4
10:13:25;0.2`)
})

it('gives useful feedback when time cannot be parsed', () => {
    const filters = [{ type: 'throughput', period: 5000, enabled: true }]
    expect(apply(filters, 'foo\nbar')).toEqual('Error: Could not guess time format')
})

it('WTF', () => {
    const filters = [{ type: 'throughput', period: 1000, enabled: true }]
    expect(apply(filters, `
eeeeeeeeee 2016-11-01 10:13:21,687 MM3     13 12 12 11 10 9 9
eeeeeeeeee 2016-11-01 10:13:21,687 MM2     13 11 10 10 9 8`)).toEqual('Error: Could not guess time format')
})

it('sorts numeric values with reverse and unique flags', () => {
    const log = [1, 3, 10, 15, 20, 10, 2].join('\n')
    const filters = [{ type: 'sort', numeric: true, unique: true, reverse: true, enabled: true }]
    const res = apply(filters, log)
    expect(res.split('\n').join(' ')).toEqual('20 15 10 3 2 1')
})

it('calculates roundtrip', () => {
    const filters = [{ type: 'roundtrip', start: 'start id=(\\w+)', stop: 'stop id=(\\w+)', enabled: true }]
    expect(apply(filters, `
2016-11-01 10:13:21,687 MM3     start id=toto
2016-11-01 10:13:21,692 MM2     stop id=toto`)).toEqual('Start timestamp;Stop timestamp;Start;Stop;Roundtrip;ID\n1477991601687;1477991601692;2016-11-01 10:13:21,687;2016-11-01 10:13:21,692;5;toto')
})

