import { createSelectorCreator, defaultMemoize } from 'reselect'
import isEqual from 'lodash/isEqual'
import { getProcessor, Context } from '../api'

// create a "selector creator" that uses lodash.isEqual instead of ===
const createDeepEqualSelector = createSelectorCreator(
  defaultMemoize,
  isEqual
)

/**
 * Returns only filters that have an effect on data (invalid and incomplete 
 * filters are ignored.)
 */
const getValidFilters = state => {
  return state.filters.filter(filter => filter.enabled && getProcessor(filter).isValid(filter))
}

const getSettings = state => {
  return state.settings
}

let computeIterations = 0

export function getIterationCount() {
  return computeIterations
}

function chainPipes(filters) {
  return filters.reduce((previous, filter) => {
    const pipeClass = getProcessor(filter)
    return new pipeClass(filter, previous)
  }, undefined)
}

export const getResult = createDeepEqualSelector(
  getValidFilters, getSettings, (filters, settings) => {
    computeIterations++

    const context = new Context(settings)
    try {
      if (!filters.length)
        throw new Error('No pipes')

      const last = chainPipes(filters)

      if (!last.getOutput)
        throw new Error('Invalid pipe implementation: ' + last.constructor.name)

      last.exec(context)
    }
    catch (error) {
      console.error(error)
      context.addError(""+error)
    }

    return context
  }
)
