import Grep from './grep'
import Replace from './replace'
import Sort from './sort'
import Dummy from './dummy'
import Text from './text'
import Roundtrip from './roundtrip'
import Show from './show'
import Sample from './sample'
import Chart from './chart'
import type Pipe from './pipe'
import type { Filter } from '../types'

export { default as Context } from './context'

type PipeConstructor = new (filter: Filter, previous?: Pipe) => Pipe

export function getProcessor(filter: Filter): PipeConstructor & { isValid: (f: Filter) => boolean } {
  switch (filter.type) {
    case 'include':
    case 'grep':
      return Grep
    case 'exclude':
      return Grep
    case 'replace':
      return Replace
    case 'throughput':
      return Sample
    case 'sample':
      return Sample
    case 'roundtrip':
      return Roundtrip
    case 'sort':
      return Sort
    case 'cat':
    case 'text':
    case 'clipboard':
      return Text
    case 'show':
      return Show
    case 'chart':
      return Chart
    default:
      return Dummy
  }
}
