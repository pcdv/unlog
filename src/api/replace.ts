import Pipe from './pipe'
import type { Filter } from '../types'

export default class Replace extends Pipe {
  declare pattern?: string
  declare replace?: string
  declare ignoreCase?: boolean

  constructor(filter: Filter, previous?: Pipe) {
    super(filter, previous)
  }

  static isValid(filter: Filter): boolean {
    return !!(filter as Replace).pattern
  }

  getOutput(type: string, limit?: number): unknown {
    return this.compute(this.getInput(type, limit) as string[], limit)
  }

  compute(lines: string[], limit?: number): string[] {
    if (this.pattern) {
      let flags = 'g'
      if (this.ignoreCase) flags += 'i'
      let rePattern = this.pattern
      
      // Auto-anchor greedy match-all at the start to prevent O(N^2) global search
      // catastrophic backtracking on non-matching lines.
      if (rePattern.startsWith('.*')) {
        rePattern = '^' + rePattern
      }

      let regex: RegExp
      try {
        regex = new RegExp(rePattern, flags)
      } catch (e) {
        return lines // Ignore invalid regex
      }
      
      const repl = this.replace ?? ''
      const result: string[] = []
      const t0 = Date.now()
      let i = 0

      for (const line of lines) {
        result.push(line.replace(regex, repl))
        i++
        if (i % 100 === 0 && Date.now() - t0 > 5000) {
          throw new Error(`Replace filter timed out after 5s (catastrophic backtracking in /${this.pattern}/)`)
        }
        if (limit !== undefined && result.length >= limit) break
      }
      return result
    }
    return limit !== undefined ? lines.slice(0, limit) : lines
  }
}
