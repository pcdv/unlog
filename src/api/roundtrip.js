import moment from 'moment'
import Pipe from './pipe'
import guessTimeFormat from '../util/guessTimeFormat'

export default class Throughput extends Pipe {

  static isValid(filter) {
    return filter.start && filter.stop
  }

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
    return ["Start timestamp;Stop timestamp;Start;Stop;Roundtrip;ID"].concat(data.map(item => item.join(";")))
  }

  compute0(lines) {
    const res = []

    if (!lines.length)
      return []
    const format = guessTimeFormat(lines)

    if (!format)
      throw new Error('Could not guess time format')

    const start = this.start ? new RegExp(this.start) : null
    const stop = this.start ? new RegExp(this.stop) : null
    const reqs = {}

    lines.forEach(line => {
      const sub = line.substring(0, format.length)
      const time = moment(sub, format).valueOf()
      if (time) {
        let match = start.exec(line)
        if (match) {
          const id = match[1]
          reqs[id] = { time, id, startStr: sub }
        }

        else {
          match = stop.exec(line)
          if (match) {
            const id = match[1]
            const req = reqs[id]
            if (req) {
              const roundtrip = time - req.time
              res.push([req.time, time, req.startStr, sub, roundtrip, req.id])
              delete reqs[id]
            }
          }
        }
      }
    })

    return res
  }
}