import Pipe from './pipe'

export default class Include extends Pipe {

  static isValid(filter) {
    return !!filter.pattern
  }

  getOutput(type) {
    return this.compute(this.previous.getOutput(type))
  }

  compute(lines) {
    if (this.pattern) {
      let flags = ''
      if (this.ignoreCase)
        flags += 'i'
      const re = new RegExp(this.pattern, flags)
      return lines.filter(line => re.test(line))
    }
    return lines
  }
}
