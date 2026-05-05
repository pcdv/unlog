import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import Pipe from './pipe'
import guessTimeFormat from '../util/guessTimeFormat'
import type { Filter } from '../types'

dayjs.extend(customParseFormat)

const START_TS = 'start_ts'
const STOP_TS = 'stop_ts'
const START_STR = 'start_str'
const STOP_STR = 'stop_str'
const ROUNDTRIP = 'roundtrip'
const ID = 'id'

const COLUMNS = [START_TS, STOP_TS, START_STR, STOP_STR, ROUNDTRIP, ID]

interface RtItem {
  [START_TS]: number
  [STOP_TS]: number
  [START_STR]: string
  [STOP_STR]: string
  [ROUNDTRIP]: number
  [ID]: string
}

function toRow(item: RtItem): (string | number)[] {
  return [item.start_ts, item.stop_ts, item.start_str, item.stop_str, item.roundtrip, item.id]
}

export default class Roundtrip extends Pipe {
  declare start?: string
  declare stop?: string

  constructor(filter: Filter, previous?: Pipe) {
    super(filter, previous)
  }

  static isValid(filter: Filter): boolean {
    return !!(filter.start && filter.stop)
  }

  getFields(): string[] {
    return COLUMNS
  }

  getOutput(type: string): unknown {
    switch (type) {
      case 'lines':
        return this.computeCSV(this.getInput('lines') as string[])
      case 'data':
        return this.compute0(this.getInput('lines') as string[])
      default:
        throw new Error(type + '??')
    }
  }

  computeCSV(lines: string[]): string[] {
    const data = this.compute0(lines)
    return [COLUMNS.join(';'), ...data.map(item => toRow(item).join(';'))]
  }

  compute0(lines: string[]): RtItem[] {
    const res: RtItem[] = []

    if (!lines.length)
      return []
    const [format, timeLength] = guessTimeFormat(lines)

    if (!format)
      throw new Error('Could not guess time format')

    const startRe = this.start ? new RegExp(this.start) : null
    const stopRe = this.stop ? new RegExp(this.stop) : null
    const reqs: Record<string, { time: number; id: string; startStr: string }> = {}

    lines.forEach(line => {
      const sub = line.substring(0, timeLength)
      const time = dayjs(sub, format as string).valueOf()
      if (time) {
        let match = startRe?.exec(line)
        if (match) {
          const id = match[1]
          reqs[id] = { time, id, startStr: sub }
        } else {
          match = stopRe?.exec(line)
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
                [ID]: id,
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
