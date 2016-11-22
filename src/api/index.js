import Throughput from './throughput'
import Grep from './grep'
import Replace from './replace'
import Sort from './sort'
import Dummy from './dummy'
import Text from './text'
import Roundtrip from './roundtrip'
import Show from './show'

export const Context = require('./context')['default']

export function getProcessor(filter) {
  switch (filter.type) {
    case "include":
    case "grep":
      return Grep
    case "exclude":
      filter.invert = true
      return Grep
    case "replace":
      return Replace
    case "throughput":
      return Throughput
    case "roundtrip":
      return Roundtrip
    case "sort":
      return Sort
    case "cat":
    case "text":
      return Text
    case "show":
      return Show
    default:
      console.warn('Unknown filter: ' + filter.type)
      return Dummy
  }
}

