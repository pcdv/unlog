import Throughput from './throughput'
import Include from './include'
import Exclude from './exclude'
import Replace from './replace'
import Sort from './sort'
import Dummy from './dummy'
import Text from './text'

export function getProcessor(filter) {
  switch (filter.type) {
    case "include":
      return Include
    case "exclude":
      return Exclude
    case "replace":
      return Replace
    case "throughput":
      return Throughput
    case "sort":
      return Sort
    case "cat":
    case "text":
      return Text
    default:
    console.warn('Unknown filter: '+filter.type)
      return Dummy
  }
}

