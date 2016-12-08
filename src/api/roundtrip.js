import moment from 'moment'
import Pipe from './pipe'
import guessTimeFormat from '../util/guessTimeFormat'

const START_TS = 'start_ts'
const STOP_TS = 'stop_ts'
const START_STR = 'start_str'
const STOP_STR = 'stop_str'
const ROUNDTRIP = 'roundtrip'
const ID = 'id'

const COLUMNS = [START_TS, STOP_TS, START_STR, STOP_STR, ROUNDTRIP, ID]

function toRow(item) {
  return [item.start_ts, item.stop_ts, item.start_str, item.stop_str, item.roundtrip, item.id]
}

export default class Throughput extends Pipe {

  static isValid(filter) {
    return filter.start && filter.stop
  }

  getFields() {
    return COLUMNS
  }

  getOutput(type) {
    switch (type) {
      case 'lines':
        return this.computeCSV(this.getInput('lines'))
      case 'data':
        return this.compute0(this.getInput('lines'))
      default:
        throw new Error(type + '??')
    }
  }

  computeCSV(lines) {
    const data = this.compute0(lines)
    return [COLUMNS.join(';'), ...data.map(item => toRow(item).join(";"))]
  }

  compute0(lines) {
    const res = []

    if (!lines.length)
      return []
    const [format, timeLength] = guessTimeFormat(lines)

    if (!format)
      throw new Error('Could not guess time format')

    const start = this.start ? new RegExp(this.start) : null
    const stop = this.start ? new RegExp(this.stop) : null
    const reqs = {}

    lines.forEach(line => {
      const sub = line.substring(0, timeLength)
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
              res.push({
                [START_TS]: req.time,
                [STOP_TS]: time,
                [START_STR]: req.startStr,
                [STOP_STR]: sub,
                [ROUNDTRIP]: roundtrip,
                [ID]: id
              })
              delete reqs[id]
            }
          }
        }
      }
    })

    return res
  }
}