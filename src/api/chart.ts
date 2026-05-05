import Pipe from './pipe'
import type Context from './context'
import type { Filter } from '../types'

export default class Chart extends Pipe {
  constructor(filter: Filter, previous?: Pipe) {
    super(filter, previous)
  }

  exec(context: Context): void {
    const data = this.getPrevious().getOutput('data')

    context.addVisualisation({
      type: 'chart',
      data: data as Record<string, unknown>[],
      filter: this,
    })
  }
}
