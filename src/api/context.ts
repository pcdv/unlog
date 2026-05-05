import type { SettingsState } from '../types'

export interface Visualisation {
  type: string
  [key: string]: unknown
}

export default class Context {
  settings: SettingsState
  errors: Error[]
  visualisations: Visualisation[]

  constructor(settings: SettingsState) {
    this.settings = settings
    this.errors = []
    this.visualisations = []
  }

  addError(error: Error) {
    this.errors.push(error)
  }

  addVisualisation(viz: Visualisation) {
    this.visualisations.push(viz)
  }
}
