import * as ACTION from '../constants/actions'
import type { AppDispatch, RootState } from '../store/configureStore'
import type { Filter, FilterUpdate } from '../types'

function removePrivateFields(obj: Filter): FilterUpdate {
  const res: Record<string, unknown> = {}
  for (const i in obj) {
    if (i.charAt(0) !== '_')
      res[i] = (obj as unknown as Record<string, unknown>)[i]
  }
  return res as FilterUpdate
}

export function updateQuery() {
  return (_dispatch: AppDispatch, getState: () => RootState) => {
    const { filters } = getState()
    const encoded = serializeFilters(filters.map(removePrivateFields))
    // Set URL directly (no URLSearchParams) to avoid double percent-encoding
    const newUrl = encoded
      ? `${window.location.pathname}?f=${encoded}`
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
    // Try new compact format: ?f=...
    const newFmtMatch = window.location.search.match(/(?:^[?&]|&)f=([^&]*)/)
    if (newFmtMatch?.[1]) {
      dispatch(setFilters(deserializeFilters(newFmtMatch[1]), false))
      return
    }
    // Fall back to legacy JSON format: ?filters=...
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

export function addFilter(data?: FilterUpdate) {
  return (dispatch: AppDispatch) => {
    dispatch({ type: ACTION.ADD_FILTER, filter: Object.assign({ type: '', enabled: true }, data) as Filter })
    dispatch(updateQuery())
  }
}

export function updateFilter(index: number, data: FilterUpdate) {
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

export function moveFilter(from: number, to: number) {
  return (dispatch: AppDispatch) => {
    dispatch({ type: ACTION.MOVE_FILTER, from, to })
    dispatch(updateQuery())
  }
}

export function deleteFilter(index: number) {
  return (dispatch: AppDispatch) => {
    dispatch({ type: ACTION.DELETE_FILTER, index })
    dispatch(updateQuery())
  }
}

// ── Compact URL format ───────────────────────────────────────────────────────
// Filters encoded as: <filter1>~<filter2>~...
// Each filter: [!]<typeCode>[;<key>[=<encodedValue>]]*
//   !   = disabled (omitted when enabled=true)
//   ~   = filter separator (% encoded as %7E inside values)
//   ;   = field separator (always encoded by encodeURIComponent inside values)
//   =   = key/value separator (only first occurrence per field)
// ─────────────────────────────────────────────────────────────────────────────

const TYPE_TO_CODE: Record<string, string> = {
  cat: 'c', text: 't', grep: 'g', include: 'g', exclude: 'e',
  replace: 'r', sort: 's', sample: 'sa', throughput: 'th',
  roundtrip: 'rt', show: 'sh', chart: 'ch',
}

// 2-char codes must be listed before 1-char for longest-match parsing
const CODE_TO_TYPE: [string, string][] = [
  ['sa', 'sample'], ['th', 'throughput'], ['rt', 'roundtrip'],
  ['sh', 'show'], ['ch', 'chart'],
  ['c', 'cat'], ['t', 'text'], ['g', 'grep'], ['e', 'exclude'],
  ['r', 'replace'], ['s', 'sort'],
]

function encodeValue(v: unknown): string {
  // encodeURIComponent does not encode ~, so escape it additionally
  return encodeURIComponent(String(v)).replace(/~/g, '%7E')
}

function serializeFilter(f: FilterUpdate): string {
  const type = f.type ?? ''
  if (!type) return f.enabled === false ? '!' : '-'
  const typeCode = TYPE_TO_CODE[type] ?? type
  const disabled = f.enabled === false ? '!' : ''
  const fields: string[] = []

  switch (type) {
    case 'cat':
      if (f.fileName != null) fields.push(`n=${encodeValue(f.fileName)}`)
      break
    case 'text':
      // text content is not serialised to the URL — it can be arbitrarily large
      break
    case 'grep': case 'include': case 'exclude':
      if (f.pattern != null) fields.push(`p=${encodeValue(f.pattern)}`)
      if (f.ignoreCase) fields.push('i')
      if (f.invert) fields.push('x')
      break
    case 'replace':
      if (f.pattern != null) fields.push(`p=${encodeValue(f.pattern)}`)
      if (f.replace != null) fields.push(`w=${encodeValue(f.replace)}`)
      if (f.ignoreCase) fields.push('i')
      break
    case 'sort':
      if (f.numeric) fields.push('n')
      if (f.unique) fields.push('u')
      if (f.reverse) fields.push('d')
      break
    case 'sample': case 'throughput':
      if (f.period != null) fields.push(`p=${f.period}`)
      if (f.unit != null) fields.push(`u=${f.unit}`)
      if (f.valuePattern != null) fields.push(`q=${encodeValue(f.valuePattern)}`)
      if (f.fillZeros) fields.push('z')
      if (f.functions != null) fields.push(`f=${encodeValue(f.functions)}`)
      break
    case 'roundtrip':
      if (f.start != null) fields.push(`s=${encodeValue(f.start)}`)
      if (f.stop != null) fields.push(`e=${encodeValue(f.stop)}`)
      break
    case 'chart':
      if (f.x != null) fields.push(`x=${encodeValue(f.x)}`)
      if (f.y != null) fields.push(`y=${encodeValue(f.y)}`)
      if (f.width != null) fields.push(`w=${encodeValue(f.width)}`)
      break
  }

  const fieldStr = fields.length ? ';' + fields.join(';') : ''
  return `${disabled}${typeCode}${fieldStr}`
}

function deserializeFilter(s: string): Filter {
  let rest = s
  const disabled = rest.startsWith('!')
  if (disabled) rest = rest.slice(1)

  // Empty/unconfigured filter (serialised as '-' or just '!')
  if (rest === '' || rest === '-') return { type: '', enabled: !disabled }

  // Determine type using longest-match on code list
  let type = ''
  for (const [code, t] of CODE_TO_TYPE) {
    if (rest.startsWith(code)) {
      type = t
      rest = rest.slice(code.length)
      break
    }
  }

  const filter: FilterUpdate = { type: type as Filter['type'], enabled: !disabled }
  if (!rest.startsWith(';')) return filter as Filter

  const fields = rest.slice(1).split(';')
  for (const field of fields) {
    const eqIdx = field.indexOf('=')
    const key = eqIdx >= 0 ? field.slice(0, eqIdx) : field
    // Values are read from the raw query string, so still percent-encoded here
    const val = eqIdx >= 0 ? decodeURIComponent(field.slice(eqIdx + 1)) : undefined

    switch (type) {
      case 'cat':
        if (key === 'n' && val != null) filter.fileName = val
        break
      case 'text':
        // text content is not serialised to the URL
        break
      case 'grep': case 'include': case 'exclude':
        if (key === 'p' && val != null) filter.pattern = val
        if (key === 'i') filter.ignoreCase = true
        if (key === 'x') filter.invert = true
        break
      case 'replace':
        if (key === 'p' && val != null) filter.pattern = val
        if (key === 'w' && val != null) filter.replace = val
        if (key === 'i') filter.ignoreCase = true
        break
      case 'sort':
        if (key === 'n') filter.numeric = true
        if (key === 'u') filter.unique = true
        if (key === 'd') filter.reverse = true
        break
      case 'sample': case 'throughput':
        if (key === 'p' && val != null) filter.period = Number(val)
        if (key === 'u' && val != null) filter.unit = Number(val)
        if (key === 'q' && val != null) filter.valuePattern = val
        if (key === 'z') filter.fillZeros = true
        if (key === 'f' && val != null) filter.functions = val
        break
      case 'roundtrip':
        if (key === 's' && val != null) filter.start = val
        if (key === 'e' && val != null) filter.stop = val
        break
      case 'chart':
        if (key === 'x' && val != null) filter.x = val
        if (key === 'y' && val != null) filter.y = val
        if (key === 'w' && val != null) filter.width = val
        break
    }
  }

  return filter as Filter
}

export function serializeFilters(filters: FilterUpdate[]): string | undefined {
  if (!filters?.length) return undefined
  return filters.map(serializeFilter).join('~')
}

export function deserializeFilters(encoded: string): Filter[] {
  return encoded.split('~').map(deserializeFilter)
}

// ── Legacy format (kept for backward compat / fallback) ──────────────────────

export function escapeJsonArray(arr: FilterUpdate[]): string | undefined {
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
