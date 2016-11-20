import Pipe from './pipe'

export default class Grep extends Pipe {

  static isValid(filter) {
    return !!filter.pattern
  }

  compute(lines) {
    if (this.pattern) {
      let flags = ''
      if (this.ignoreCase)
        flags += 'i'
      const re = new RegExp(this.pattern, flags)
      if (this.invert)
        return lines.filter(line => !re.test(line))
      else
        return lines.filter(line => re.test(line))
    }
    return lines
  }
}
