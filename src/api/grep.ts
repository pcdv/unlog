import Pipe from './pipe'
import type { Filter } from '../types'

export default class Grep extends Pipe {
  declare pattern?: string
  declare ignoreCase?: boolean
  declare invert?: boolean

  constructor(filter: Filter, previous?: Pipe) {
    super(filter, previous)
  }

  static isValid(filter: Filter): boolean {
    return !!filter.pattern
  }

  compute(lines: string[]): string[] {
    if (this.pattern) {
      let flags = ''
      if (this.ignoreCase)
        flags += 'i'
      const re = new RegExp(this.pattern, flags)
      if (this.invert)
        return lines.filter(line => !re.test(line))
      else
        return lines.filter(line => re.test(line))
    }
    return lines
  }
}
