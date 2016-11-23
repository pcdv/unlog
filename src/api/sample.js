import moment from 'moment'
import Pipe from './pipe'
import guessTimeFormat from '../util/guessTimeFormat'

function sumArray(arr) {
  return arr.reduce((prev, cur) => prev + cur, 0)
}

const FUNCTIONS = {
  min: {
    name: 'min',
    apply: arr => Math.min(...arr)
  },
  max: {
    name: 'max',
    apply: arr => Math.max(...arr)
  },
  sum: {
    name: 'sum',
    apply: sumArray,
  },
  avg: {
    name: 'Average',
    apply: arr => sumArray(arr) / arr.length
  },
  throughput: {
    name: 'Throughput',
    apply: (arr, filter) => sumArray(arr) * (filter.unit || 1000) / (filter.period || 1000)
  }
}


class Interval {
  constructor(start) {
    this.start = start
    this.values = []
  }

  handle(value) {
    this.values.push(value)
  }
}


/**
 * A generalisation of 'Throughput': we sample logs with a given period and for each interval
 * we compute a number of functions like min, max, avg, sum, etc.
 */
export default class Sample extends Pipe {

  constructor(filter, previous) {
    super(filter, previous)
    this.functions = (this.functions || '').split(/[\s,]+/).map(name => FUNCTIONS[name]).filter(func => func)
  }

  getOutput(type) {
    switch (type) {
      case 'lines':
        return this.computeCSV(this.getInput('lines'))
      case 'data':
        return this.computeIntervals(this.getInput('lines'))
      default:
        throw new Error(type + '??')
    }
  }

  computeCSV(lines) {
    const intervals = this.computeIntervals(lines)

    const header = (["Time"].concat(this.functions.map(f => f.name))).join(";")

    const timeFormat = this.period >= 1000 ? 'HH:mm:ss' : 'HH:mm:ss,SSS'

    const res = [header].concat(intervals.map(interval => {
      const res = [moment(new Date(interval.start)).format(timeFormat)]
      for (let func of this.functions) {
        res.push(interval[func.name])
      }
      return res.join(';')
    }))

    return res
  }

  computeIntervals(lines) {
    const period = this.period || 1000
    const res = []

    if (!lines.length)
      return []
    const [format, timeLength] = guessTimeFormat(lines)

    if (!format)
      throw new Error('Could not guess time format')

    const valuePattern = this.valuePattern ? new RegExp(this.valuePattern) : null
    let currentInterval, roundedTime

    lines.forEach(line => {
      const sub = line.substring(0, timeLength)
      const time = moment(sub, format).valueOf()
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
        }
        else
          currentInterval.handle(1)
      }
    })

    if (currentInterval) {
      this.appendInterval(res, currentInterval)
    }

    return res.map(interval => this.computeInterval(interval))
  }

  /**
   * Appends interval to list, optionally filling the gaps (when fillZeros is set).
   */
  appendInterval(res, interval) {
    const last = res.length ? res[res.length - 1] : null
    const step = this.period

    if (this.fillZeros && last) {
      for (let time = last.start + step; time < interval.start; time += step) {
        res.push(new Interval(time))
      }
    }

    res.push(interval)
  }

  /**
   * Applies all configured functions to given interval.
   */
  computeInterval(interval) {
    for (let func of this.functions) {
      interval[func.name] = func.apply(interval.values, this)
    }
    return interval
  }
}
