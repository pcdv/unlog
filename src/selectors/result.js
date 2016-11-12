import { createSelectorCreator, defaultMemoize } from 'reselect'
import isEqual from 'lodash/isEqual'
import { getProcessor } from '../api/processors'

// create a "selector creator" that uses lodash.isEqual instead of ===
const createDeepEqualSelector = createSelectorCreator(
  defaultMemoize,
  isEqual
)

function isFilterValid(filter) {
  if (!filter.enabled)
    return false
    
  switch (filter.type) {
    case "include":
    case "exclude":
    case "replace":
      return !!filter.pattern

    case "throughput":
      return !!filter.period

    default:
      return false
  }
}

/**
 * Returns only filters that have an effect on data (invalid and incomplete 
 * filters are ignored.)
 */
const getValidFilters = state => {
  return state.filters.filter(isFilterValid)
}

const getText = state => {
  return state.fileSelection.text
}

const MAX_LENGTH = 10 * 1024 * 1024
const MAX_LINES = 1000

export const getResult = createDeepEqualSelector(
  getValidFilters, getText,
  (filters, text) => {

    console.log("getResult() called")

    if (!filters.length || !text)
      return {text}

    let lines = text.split(/[\n\r]+/g)

    filters.forEach(filter => {
      lines = getProcessor(filter).compute(filter, lines)
    })

    const res = lines.slice(0, MAX_LINES).join('\n')
    return { text: res.length < MAX_LENGTH ? res : res.substring(0, MAX_LENGTH)}
  }
)
