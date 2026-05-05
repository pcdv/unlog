import type { Filter } from '../types'
import type Context from './context'

export default class Pipe {
  previous?: Pipe
  type!: string
  enabled!: boolean

  constructor(filter: Filter, previous?: Pipe) {
    Object.assign(this, filter)
    this.previous = previous
  }

  static isValid(filter: Filter): boolean {
    return filter.enabled
  }

  getPrevious(): Pipe {
    if (!this.previous)
      throw new Error('No previous pipe given to ' + this.constructor.name)
    return this.previous
  }

  getInput(type: string): unknown {
    return this.getPrevious().getOutput(type)
  }

  getOutput(type: string): unknown {
    return this.compute(this.getInput(type) as string[])
  }

  getFields(): string[] {
    if (this.previous)
      return this.previous.getFields()
    return []
  }

  exec(_context: Context): void {
    // override in subclasses
  }

  compute(data: string[]): string[] {
    return data
  }
}
