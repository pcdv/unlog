import Pipe from './pipe'
import type Context from './context'
import type { Filter } from '../types'

export default class Show extends Pipe {
  constructor(filter: Filter, previous?: Pipe) {
    super(filter, previous)
  }

  exec(context: Context): void {
    const settings = context.settings

    const lines = this.getPrevious().getOutput('lines') as string[]
    const linesDropped = lines.length <= settings.maxLines ? 0 : lines.length - settings.maxLines
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
