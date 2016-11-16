import Pipe from './pipe'

export default class Replace extends Pipe {

  getOutput(type) {
    return this.compute(this.previous.getOutput(type))
  }

  compute(lines) {
    const filter = this
    if (filter.pattern) {
      const regex = new RegExp(filter.pattern, 'g')
      const repl = filter.replace || ''
      return lines.map(line => line.replace(regex, repl))
    }
    return lines
  }
}
