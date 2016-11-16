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

export const getResult = createDeepEqualSelector(
  getValidFilters, getSettings,
  (filters, settings) => {

    if (!filters.length)
      return { text: 'No pipes' }

    let previousPipe

    const pipes = filters.map(filter => {
      const pipeClass = getProcessor(filter)
      const pipe = new pipeClass(filter, previousPipe) 
      previousPipe = pipe
      return pipe
    })

    const last = pipes[pipes.length - 1]
    
    if (!last.getOutput)
      throw new Error('Invalid pipe implementation: '+last.constructor.name)
    const lines = last.getOutput('lines')

    const linesDropped = lines.length <= settings.maxLines ? 0 : lines.length - settings.maxLines
    const res = lines.slice(0, settings.maxLines).join('\n')
    const txt = res.length < settings.maxChars ? res : res.substring(0, settings.maxChars)
    const charsDropped = res.length <= settings.maxChars ? 0 : res.length - txt.length
    return { text: txt, charsDropped, linesDropped }
  }
)
