import Pipe from './pipe'

export default class Text extends Pipe {
  getOutput(type) {
    switch (type) {
      case 'lines':
        const text = this._text || this.text
        if (text)
          return text.split('\n')
        else
          return ['No file loaded']
      default:
        throw new Error('Invalid output type: '+type)
    }
  }
}
