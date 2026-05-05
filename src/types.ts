import type Pipe from './api/pipe'

export interface Filter {
  type: string
  enabled: boolean
  index?: number
  // grep/include/exclude
  pattern?: string
  ignoreCase?: boolean
  invert?: boolean
  // text/cat
  text?: string
  fileName?: string
  _text?: string
  // replace
  replace?: string
  // sample/throughput
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
  // runtime fields (prefixed with _ so they are stripped from URL state)
  _previous?: ChainedFilter
  _processor?: Pipe
}

export interface ChainedFilter extends Filter {
  index: number
  isLast?: boolean
}

export interface FileSelectionState {
  name?: string
  text?: string
}

export interface SettingsState {
  maxLines: number
  maxChars: number
}
