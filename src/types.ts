import type Pipe from './api/pipe'

interface FilterBase {
  enabled: boolean
  // runtime fields (prefixed with _ so they are stripped from URL state)
  _previous?: ChainedFilter
  _processor?: Pipe
}

export interface CatFilter extends FilterBase {
  type: 'cat'
  fileName?: string
  _text?: string
}

export interface TextFilter extends FilterBase {
  type: 'text'
  text?: string
}

export interface ClipboardFilter extends FilterBase {
  type: 'clipboard'
  text?: string
}

export interface GrepFilter extends FilterBase {
  type: 'grep' | 'include' | 'exclude'
  pattern?: string
  ignoreCase?: boolean
  invert?: boolean
}

export interface ReplaceFilter extends FilterBase {
  type: 'replace'
  pattern?: string
  replace?: string
  ignoreCase?: boolean
}

export interface SortFilter extends FilterBase {
  type: 'sort'
  numeric?: boolean
  unique?: boolean
  reverse?: boolean
}

export interface SampleFilter extends FilterBase {
  type: 'sample'
  period?: number
  unit?: number
  valuePattern?: string
  fillZeros?: boolean
  functions?: string
}

export interface ThroughputFilter extends FilterBase {
  type: 'throughput'
  period?: number
  unit?: number
  valuePattern?: string
  fillZeros?: boolean
}

export interface RoundtripFilter extends FilterBase {
  type: 'roundtrip'
  start?: string
  stop?: string
}

export interface ChartFilter extends FilterBase {
  type: 'chart'
  x?: string
  y?: string
  width?: string
}

export interface ShowFilter extends FilterBase {
  type: 'show'
}

export interface EmptyFilter extends FilterBase {
  type: ''
}

export type Filter =
  | CatFilter
  | TextFilter
  | ClipboardFilter
  | GrepFilter
  | ReplaceFilter
  | SortFilter
  | SampleFilter
  | ThroughputFilter
  | RoundtripFilter
  | ChartFilter
  | ShowFilter
  | EmptyFilter

/** Adds runtime `index` (and optional `isLast`) to a specific filter type. */
export type Chained<T extends Filter> = T & { index: number; isLast?: boolean }

export type ChainedFilter = Chained<Filter>

/**
 * Flat partial of all filter fields — used for updateFilter() dispatches
 * and URL serialisation where only a subset of fields is known.
 */
export type FilterUpdate = {
  type?: Filter['type']
  enabled?: boolean
  // cat
  fileName?: string
  _text?: string
  // text
  text?: string
  // grep / replace
  pattern?: string
  ignoreCase?: boolean
  invert?: boolean
  // replace
  replace?: string
  // sample / throughput
  period?: number
  unit?: number
  valuePattern?: string
  fillZeros?: boolean
  functions?: string
  // roundtrip
  start?: string
  stop?: string
  // chart
  x?: string
  y?: string
  width?: string
  // sort
  numeric?: boolean
  unique?: boolean
  reverse?: boolean
  // runtime fields
  _previous?: ChainedFilter
  _processor?: Pipe
}

export interface ColorRule {
  pattern: string
  color: string
}

export interface FileSelectionState {
  name?: string
  text?: string
}

export interface SettingsState {
  maxLines: number
  maxChars: number
}
