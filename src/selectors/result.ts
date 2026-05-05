import { createSelectorCreator, lruMemoize, createSelector } from 'reselect'
import isEqual from 'lodash/isEqual'
import { getProcessor, Context } from '../api'
import type { RootState } from '../store/configureStore'
import type { Filter, ChainedFilter } from '../types'
import type Pipe from '../api/pipe'

const createDeepEqualSelector = createSelectorCreator(lruMemoize, isEqual)

const filterSelector = (state: RootState) => state.filters

const getValidFilters = createSelector(
  filterSelector,
  (filters: Filter[]) => filters.filter(f => f.enabled && getProcessor(f).isValid(f))
)

export const getChainedFilters = createSelector(
  filterSelector,
  (filters: Filter[]): ChainedFilter[] => {
    const res: ChainedFilter[] = []
    let lastEnabled: ChainedFilter | undefined
    for (let i = 0; i < filters.length; i++) {
      const fi = Object.assign({}, filters[i]) as ChainedFilter
      fi.index = i
      if (fi.enabled) {
        if (lastEnabled)
          fi._previous = lastEnabled
        lastEnabled = fi
        fi._processor = new (getProcessor(fi))(fi) as Pipe
      }
      res.push(fi)
    }
    return res
  }
)

const getSettings = (state: RootState) => state.settings

let computeIterations = 0

export function getIterationCount(): number {
  return computeIterations
}

function chainPipes(filters: Filter[]): Pipe {
  return filters.reduce((previous: Pipe | undefined, filter: Filter) => {
    const PipeClass = getProcessor(filter)
    return new PipeClass(filter, previous)
  }, undefined) as Pipe
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

      if (!last.exec)
        throw new Error('Invalid pipe implementation: ' + last.constructor.name)

      last.exec(context)
    } catch (error) {
      context.addError(error as Error)
    }

    return context
  }
)
