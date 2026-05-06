import Pipe from './pipe'
import type Context from './context'
import type { Filter } from '../types'

export default class Show extends Pipe {
  constructor(filter: Filter, previous?: Pipe) {
    super(filter, previous)
  }

  exec(context: Context): void {
    const settings = context.settings

    // Request one extra line so we can detect (and report) truncation even when
    // an upstream pipe (e.g. Grep) stopped early once it reached the limit.
    const lines = this.getPrevious().getOutput('lines', settings.maxLines + 1) as string[]
    const linesDropped = lines.length > settings.maxLines ? lines.length - settings.maxLines : 0
    const res = lines.slice(0, settings.maxLines).join('\n')

    const txt = res.length < settings.maxChars ? res : res.substring(0, settings.maxChars)
    const charsDropped = res.length <= settings.maxChars ? 0 : res.length - txt.length

    context.addVisualisation({
      type: 'show',
      text: txt,
      charsDropped,
      linesDropped,
    })
  }

  getOutput(type: string): unknown {
    return this.getPrevious().getOutput(type)
  }
}
