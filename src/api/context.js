export default class Context {
  constructor(settings) {
    this.settings = settings
    this.errors = []
    this.visualisations = []
  }

  addError(error) {
    this.errors.push(error)
  }

  addVisualisation(viz) {
    this.visualisations.push(viz)
  }
}