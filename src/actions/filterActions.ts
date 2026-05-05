import * as ACTION from '../constants/actions'
import type { AppDispatch, RootState } from '../store/configureStore'
import type { Filter } from '../types'

function removePrivateFields(obj: Filter): Partial<Filter> {
  const res: Record<string, unknown> = {}
  for (const i in obj) {
    if (i.charAt(0) !== '_')
      res[i] = (obj as unknown as Record<string, unknown>)[i]
  }
  return res as Partial<Filter>
}

export function updateQuery() {
  return (_dispatch: AppDispatch, getState: () => RootState) => {
    const { filters } = getState()
    const params = new URLSearchParams()
    const encoded = escapeJsonArray(filters.map(removePrivateFields))
    if (encoded) params.set('filters', encoded)
    const newUrl = params.toString()
      ? `${window.location.pathname}?${params.toString()}`
      : window.location.pathname
    window.history.replaceState(null, '', newUrl)
  }
}

export function loadFile(index: number, file: File) {
  return (dispatch: AppDispatch) => {
    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result as string
      dispatch(updateFilter(index, { fileName: file.name, _text: text }))
    }
    reader.readAsText(file)
  }
}

export function initFilters() {
  return (dispatch: AppDispatch) => {
    const params = new URLSearchParams(window.location.search)
    const filtersParam = params.get('filters')
    if (filtersParam)
      dispatch(setFilters(toJsonArray(filtersParam), false))
  }
}

export function setFilters(filters: Filter[], qs: boolean) {
  return (dispatch: AppDispatch) => {
    dispatch({ type: ACTION.SET_FILTERS, filters })
    if (qs) dispatch(updateQuery())
  }
}

export function addFilter(data?: Partial<Filter>) {
  return (dispatch: AppDispatch) => {
    dispatch({ type: ACTION.ADD_FILTER, filter: Object.assign({ type: 'invalid', enabled: true }, data) })
    dispatch(updateQuery())
  }
}

export function updateFilter(index: number, data: Partial<Filter>) {
  return (dispatch: AppDispatch) => {
    dispatch({ type: ACTION.UPDATE_FILTER, index, data })
    dispatch(updateQuery())
  }
}

export function upFilter(index: number) {
  return (dispatch: AppDispatch) => {
    dispatch({ type: ACTION.UP_FILTER, index })
    dispatch(updateQuery())
  }
}

export function downFilter(index: number) {
  return (dispatch: AppDispatch) => {
    dispatch({ type: ACTION.DOWN_FILTER, index })
    dispatch(updateQuery())
  }
}

export function deleteFilter(index: number) {
  return (dispatch: AppDispatch) => {
    dispatch({ type: ACTION.DELETE_FILTER, index })
    dispatch(updateQuery())
  }
}

export function escapeJsonArray(arr: Partial<Filter>[]): string | undefined {
  if (!arr || !arr.length)
    return undefined

  return arr.map(i => escplus(JSON.stringify(i))).join('+')
}

export function toJsonArray(obj: string): Filter[] {
  return obj.split('+').map(s => JSON.parse(decodeURIComponent(s)) as Filter)
}

function escplus(s: string): string {
  return encodeURIComponent(s).replace(/\+/g, '%2B')
}
