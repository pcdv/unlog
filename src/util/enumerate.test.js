import enumerate from './enumerate'

it("should override index", () => {
  const arr = []
  arr.push({ foo: 'bar', index: 42 })
  arr.push({ foo: 'bar2', index: 43 })
  const enu = enumerate(arr)
  expect(enu[0]).toEqual({index: 0, foo: 'bar'})
  expect(enu[1]).toEqual({index: 1, foo: 'bar2'})
})