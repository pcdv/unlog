import Pipe from './pipe'
import type { Filter } from '../types'

export default class Dummy extends Pipe {
  constructor(filter: Filter, previous?: Pipe) {
    super(filter, previous)
  }

  getOutput(type: string): unknown {
    if (!this.previous)
      return ['Invalid filter']
    else
      return super.getOutput(type)
  }
}
