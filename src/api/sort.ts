import Pipe from './pipe'
import type { Filter } from '../types'

export default class Sort extends Pipe {
  declare numeric?: boolean
  declare unique?: boolean
  declare reverse?: boolean

  constructor(filter: Filter, previous?: Pipe) {
    super(filter, previous)
  }

  compute(lines: string[]): string[] {
    let sortFunc: (a: string, b: string) => number

    if (this.numeric)
      sortFunc = (a, b) => Number.parseInt(a, 10) < Number.parseInt(b, 10) ? -1 : 1
    else
      sortFunc = (a, b) => a < b ? -1 : 1

    lines = lines.slice().sort(sortFunc)

    if (this.unique) {
      let last: string | undefined
      lines = lines.filter(i => {
        const keep = last !== i
        last = i
        return keep
      })
    }

    if (this.reverse)
      lines.reverse()

    return lines
  }
}
