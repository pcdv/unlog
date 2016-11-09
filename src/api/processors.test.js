import { LoadedFile } from './processors'

it("should tolerate invalid filters", () => {
    const filters = [{}]
    const file = new LoadedFile("foo")
    const res = file.getExcerpt(filters)
    expect(res).toEqual("foo")
})

it("applies include rule", () => {
    const filters = [{ type: 'include', pattern: 'bar' }]
    const file = new LoadedFile("foo\nbar\nbaz")
    const res = file.getExcerpt(filters)
    expect(res).toEqual("bar")
})

it("applies exclude rule", () => {
    const filters = [{ type: 'exclude', pattern: 'bar' }]
    const file = new LoadedFile("foo\nbar\nbaz")
    const res = file.getExcerpt(filters)
    expect(res).toEqual("foo\nbaz")
})

it("applies replace rule", () => {
    const filters = [{ type: 'replace', pattern: 'b(.)r', replace: '$1' }]
    const file = new LoadedFile("foo\nbar\nbaz")
    const res = file.getExcerpt(filters)
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
const file = new LoadedFile(log)
it('fills zeros', () => {
    const filters = [{ type: 'throughput', period: 1000, fillZeros: 'y' }]
    const res = file.getExcerpt(filters)
    expect(res).toEqual(`Time;Throughput
10:13:21;2
10:13:22;0
10:13:23;5
10:13:24;0
10:13:25;1`)
})

it('calculates weight', () => {
    const filters = [{ type: 'throughput', period: 1000, weight: '.*MM1 (\\d+) .*' }]
    const res = file.getExcerpt(filters)
    expect(res).toEqual(`Time;Throughput
10:13:21;8
10:13:23;24
10:13:25;3`)

})
