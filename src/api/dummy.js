import Pipe from './pipe'

export default class Dummy extends Pipe {
  getOutput(type) {
    if (!this.previous)
      return ["Invalid filter"]
    else
      return super.getOutput(type)
  }
}
