import Pipe from './pipe'
import type { Filter } from '../types'

// Module-level cache: avoid re-splitting the same string on every recompute.
let _cachedText: string | undefined
let _cachedLines: string[] | undefined

export default class Text extends Pipe {
  declare text?: string
  declare _text?: string

  constructor(filter: Filter, previous?: Pipe) {
    super(filter, previous)
  }

  getOutput(type: string, limit?: number): unknown {
    switch (type) {
      case 'lines': {
        const text = this._text ?? this.text
        if (text) {
          if (text !== _cachedText) {
            _cachedText = text
            _cachedLines = text.split('\n')
          }
          const lines = _cachedLines!
          return limit !== undefined ? lines.slice(0, limit) : lines
        }
        return ['No file loaded']
      }
      default:
        throw new Error('Invalid output type: ' + type)
    }
  }
}
