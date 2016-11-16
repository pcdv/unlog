import Pipe from './pipe'

export default class Exclude extends Pipe {

  getOutput(type) {
    return this.compute(this.previous.getOutput(type))
  }

  compute(lines) {
    if (this.pattern) {
      const re = new RegExp(this.pattern)
      return lines.filter(line => !re.test(line))
    }
    return lines
  }
}
