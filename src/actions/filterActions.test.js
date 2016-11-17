import {escapeJsonArray, toJsonArray} from './filterActions'

it ('serializes replace rules', () => {
  const rule = {
    pattern: 'foo++\\S+',
    replace: 'bar++'
  }

  const esc = escapeJsonArray([rule])
  const arr = toJsonArray(esc)

  expect(arr[0]).toEqual(rule)

})