import moment from 'moment'
import Pipe from './pipe'
import guessTimeFormat from '../util/guessTimeFormat'


export default class Roundtrip extends Pipe {

  getOutput(type) {
    switch (type) {
      case 'lines':
        return this.computeCSV(this.getInput('lines'))
      case 'data':
        return this.compute(this.getInput('lines')).map(i => ({ time: i[0], value: i[1] }))
      default:
        throw new Error(type + '??')
    }
  }

  computeCSV(lines) {
      const data = this.compute0(lines)
      return ["Time;Throughput"].concat(data.map(item => item.join(";")))
  }

  compute0(lines) {
    const period = this.period || 1000
    const res = []

    if (!lines.length)
      return []
    const format = guessTimeFormat(lines)

    if (!format)
      throw new Error('Could not guess time format')

    const weight = this.weight ? new RegExp(this.weight) : null
    let prev, rounded
    let value = 0

    lines.forEach(line => {
      const sub = line.substring(0, format.length)
      const time = moment(sub, format).valueOf()
      if (time) {
        rounded = Math.trunc(time / period)
        if (prev !== rounded) {
          if (prev)
            this.append(res, prev, rounded, value, this)

          prev = rounded
          value = 0
        }

        if (weight) {
          const repl = line.replace(weight, '$1')
          value += Number.parseInt(repl, 10)
        }
        else
          value++
      }
    })

    if (prev) {
      this.append(res, prev, rounded + 1, value, this)
    }
    return res
  }

  append(res, from, to, val) {
    const step = this.period
    while (from < to) {
      let ts = moment(from * step).format('HH:mm:ss')
      if (step < 1000)
        ts += "," + ((from * step) % 1000)
      res.push([ts, val * (this.unit || 1000) / (this.period || 1000)])
      from += 1
      if (this.fillZeros)
        val = 0
      else
        break
    }
  }
}