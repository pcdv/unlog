import { createSelectorCreator, defaultMemoize, createSelector } from 'reselect'
import isEqual from 'lodash/isEqual'
import { getProcessor, Context } from '../api'

// create a "selector creator" that uses lodash.isEqual instead of ===
const createDeepEqualSelector = createSelectorCreator(
  defaultMemoize,
  isEqual
)

const filterSelector = state => state.filters

/**
 * Returns only filters that have an effect on data (invalid and incomplete 
 * filters are ignored.)
 */
const getValidFilters = createSelector(
  filterSelector,
  (filters) => filters.filter(f => f.enabled && getProcessor(f).isValid(f))
)

/**
 * Gives access to previous (enabled) filter in every filter for UI purposes.
 */
export const getChainedFilters = createSelector(
  filterSelector,
  (filters) => {
    const res = []
    let lastEnabled
    for (let i = 0; i < filters.length; i++) {
      const fi = Object.assign({}, filters[i])
      fi.index = i
      if (fi.enabled) {
        if (lastEnabled)
          fi._previous = lastEnabled
        lastEnabled = fi
        fi._processor = new (getProcessor(fi))(fi)
      }
      res.push(fi)
    }
    return res
  }
)

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
  getValidFilters, getSettings,
  (filters, settings) => {
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
      //console.error(error)
      context.addError(error)
    }

    return context
  }
)
