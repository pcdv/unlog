export default class Pipe {
  constructor(filter, previous) {
    Object.assign(this, filter)
    this.previous = previous
  }

  static isValid(filter) {
    return filter.enabled
  }

  getInput(type) {
    if (!this.previous)
      throw new Error('No previous pipe given to '+this.constructor.name)
    return this.previous.getOutput(type)
  }

  getOutput(type) {
    return this.compute(this.getInput(type))
  }

  compute(data) {
    return data
  }
}