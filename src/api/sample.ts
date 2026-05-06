import dayjs from 'dayjs'
import Pipe from './pipe'
import guessTimeFormat from '../util/guessTimeFormat'
import type Context from './context'
import type { Filter } from '../types'

function sumArray(arr: number[]): number {
  return arr.reduce((prev, cur) => prev + cur, 0)
}

interface SampleFunction {
  name: string
  apply: (arr: number[], filter?: Sample) => number
}

const FUNCTIONS: Record<string, SampleFunction> = {
  min: {
    name: 'min',
    apply: arr => Math.min(...arr),
  },
  max: {
    name: 'max',
    apply: arr => Math.max(...arr),
  },
  sum: {
    name: 'sum',
    apply: sumArray,
  },
  avg: {
    name: 'Average',
    apply: arr => sumArray(arr) / arr.length,
  },
  throughput: {
    name: 'Throughput',
    apply: (arr, filter) => sumArray(arr) * (filter?.unit ?? 1000) / (filter?.period ?? 1000),
  },
}

class Interval {
  start: number
  values: number[]

  constructor(start: number) {
    this.start = start
    this.values = []
  }

  handle(value: number) {
    this.values.push(value)
  }
}

export default class Sample extends Pipe {
  declare period?: number
  declare unit?: number
  declare valuePattern?: string
  declare fillZeros?: boolean
  declare functions?: string
  private _functions!: SampleFunction[]

  constructor(filter: Filter, previous?: Pipe) {
    super(filter, previous)
    const funcNames = this.type === 'throughput' ? 'throughput' : (this.functions || '')
    this._functions = funcNames.split(/[\s,]+/).map(name => FUNCTIONS[name]).filter(Boolean)
  }

  getFields(): string[] {
    return ['start', ...this._functions.map(f => f.name)]
  }

  getOutput(type: string): unknown {
    switch (type) {
      case 'lines':
        return this.computeCSV(this.getInput('lines') as string[])
      case 'data':
        return this.computeIntervals(this.getInput('lines') as string[])
      default:
        throw new Error(type + '??')
    }
  }

  computeCSV(lines: string[]): string[] {
    const intervals = this.computeIntervals(lines)
    const header = (['Time'].concat(this._functions.map(f => f.name))).join(';')
    const timeFormat = (this.period ?? 0) >= 1000 ? 'HH:mm:ss' : 'HH:mm:ss,SSS'

    return [header].concat(intervals.map(interval => {
      const row = [dayjs(interval.start).format(timeFormat)]
      for (const func of this._functions) {
        row.push(String(interval[func.name]))
      }
      return row.join(';')
    }))
  }

  computeIntervals(lines: string[]): Record<string, number>[] {
    const period = this.period ?? 1000
    const res: Interval[] = []

    if (!lines.length)
      return []
    const [format, timeLength] = guessTimeFormat(lines)

    if (!format)
      throw new Error('Could not guess time format')

    const valuePattern = this.valuePattern ? new RegExp(this.valuePattern) : null
    let currentInterval: Interval | null = null
    let roundedTime = 0

    lines.forEach(line => {
      const sub = line.substring(0, timeLength)
      const time = dayjs(sub, format as string).valueOf()
      if (time) {
        roundedTime = Math.trunc(time / period) * period

        if (!currentInterval)
          currentInterval = new Interval(roundedTime)

        if (currentInterval.start !== roundedTime) {
          this.appendInterval(res, currentInterval)
          currentInterval = new Interval(roundedTime)
        }

        if (valuePattern) {
          const repl = line.replace(valuePattern, '$1')
          currentInterval.handle(Number.parseInt(repl, 10))
        } else {
          currentInterval.handle(1)
        }
      }
    })

    if (currentInterval) {
      this.appendInterval(res, currentInterval)
    }

    return res.map(interval => this.computeInterval(interval))
  }

  appendInterval(res: Interval[], interval: Interval): void {
    const last = res.length ? res[res.length - 1] : null
    const step = this.period ?? 1000

    if (this.fillZeros && last) {
      for (let time = last.start + step; time < interval.start; time += step) {
        res.push(new Interval(time))
      }
    }

    res.push(interval)
  }

  computeInterval(interval: Interval): Record<string, number> {
    const res: Record<string, number> = { start: interval.start }
    for (const func of this._functions) {
      res[func.name] = func.apply(interval.values, this)
    }
    return res
  }

  exec(_context: Context): void {
    // Sample doesn't directly add visualisations; used via getOutput
  }
}
