import Pipe from './pipe'
import type { Filter } from '../types'

export default class Text extends Pipe {
  declare text?: string
  declare _text?: string

  constructor(filter: Filter, previous?: Pipe) {
    super(filter, previous)
  }

  getOutput(type: string): unknown {
    switch (type) {
      case 'lines': {
        const text = this._text ?? this.text
        if (text)
          return text.split('\n')
        else
          return ['No file loaded']
      }
      default:
        throw new Error('Invalid output type: ' + type)
    }
  }
}
