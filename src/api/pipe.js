export default class Pipe {
  constructor(filter, previous) {
    Object.assign(this, filter)
    this.previous = previous
  }

  static isValid(filter) {
    return filter.enabled
  }

  getOutput(type) {
    if (!this.previous)
      throw new Error('No previous pipe given to '+this.constructor.name)
    return this.compute(this.previous.getOutput(type))
  }

  compute(data) {
    return data
  }
}