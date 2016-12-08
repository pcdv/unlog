export default class Pipe {
  constructor(filter, previous) {
    Object.assign(this, filter)
    this.previous = previous
  }

  static isValid(filter) {
    return filter.enabled
  }

  getPrevious() {
    if (!this.previous)
      throw new Error('No previous pipe given to ' + this.constructor.name)
    return this.previous
  }

  getInput(type) {
    return this.getPrevious().getOutput(type)
  }

  getOutput(type) {
    //console.log(this)
    return this.compute(this.getInput(type))
  }

  getFields() {
    if (this.previous)
      return this.previous.getFields()
    return []
  }

  exec(context) {

  }

  compute(data) {
    return data
  }
}