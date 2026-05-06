import Pipe from './pipe'
import type { Filter } from '../types'

export default class Replace extends Pipe {
  declare pattern?: string
  declare replace?: string

  constructor(filter: Filter, previous?: Pipe) {
    super(filter, previous)
  }

  static isValid(filter: Filter): boolean {
    return !!(filter as Replace).pattern
  }

  compute(lines: string[]): string[] {
    if (this.pattern) {
      const regex = new RegExp(this.pattern, 'g')
      const repl = this.replace ?? ''
      return lines.map(line => line.replace(regex, repl))
    }
    return lines
  }
}
