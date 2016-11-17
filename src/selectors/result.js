import { createSelectorCreator, defaultMemoize } from 'reselect'
import isEqual from 'lodash/isEqual'
import { getProcessor } from '../api'

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

function chainPipes(filters) {
  return filters.reduce((previous, filter) => {
    const pipeClass = getProcessor(filter)
    return new pipeClass(filter, previous)
  }, undefined)
}

export const getResult = createDeepEqualSelector(
  getValidFilters, getSettings, (filters, settings) => {

    let lines
    try {
      if (!filters.length)
        throw new Error('No pipes')

      const last = chainPipes(filters)
      if (!last.getOutput)
        throw new Error('Invalid pipe implementation: ' + last.constructor.name)
      lines = last.getOutput('lines')
    }
    catch (error) {
      lines = [error]
    }

    const linesDropped = lines.length <= settings.maxLines ? 0 : lines.length - settings.maxLines
    const res = lines.slice(0, settings.maxLines).join('\n')
    const txt = res.length < settings.maxChars ? res : res.substring(0, settings.maxChars)
    const charsDropped = res.length <= settings.maxChars ? 0 : res.length - txt.length
    return { text: txt, charsDropped, linesDropped }
  }
)
