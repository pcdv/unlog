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
    return !!(filter as Grep).pattern
  }

  getOutput(type: string, limit?: number): unknown {
    // Grep may filter out many lines, so it cannot forward the limit upstream.
    // Instead it early-exits its own loop once it has accumulated enough results.
    return this.compute(this.getInput(type) as string[], limit)
  }

  compute(lines: string[], limit?: number): string[] {
    if (this.pattern) {
      let flags = ''
      if (this.ignoreCase)
        flags += 'i'
      const re = new RegExp(this.pattern, flags)
      const result: string[] = []
      for (const line of lines) {
        if (re.test(line) !== (this.invert ?? false)) {
          result.push(line)
          if (limit !== undefined && result.length >= limit) break
        }
      }
      return result
    }
    return lines
  }
}
