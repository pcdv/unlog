import Throughput from './throughput'
import Grep from './grep'
import Replace from './replace'
import Sort from './sort'
import Dummy from './dummy'
import Text from './text'
import Roundtrip from './roundtrip'

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
    default:
      console.warn('Unknown filter: ' + filter.type)
      return Dummy
  }
}

