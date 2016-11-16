import Pipe from './pipe'

const TIME_FORMATS = [
  [/^....-..-.. ..:..:..,.../, 'YYYY-MM-DD HH:mm:ss,SSS'],
  [/^..:..:..,.../, 'HH:mm:ss,SSS'],
]

function guessTimeFormat(lines) {
  for (var line of lines) {
    for (var [re, format] of TIME_FORMATS) {
      if (re.test(line))
        return format
    }
  }
}

import moment from 'moment'

function append(res, from, to, val, filter) {
  const step = filter.period
  while (from < to) {
    let ts = moment(from * step).format('HH:mm:ss')
    if (step < 1000)
      ts += "," + ((from * step) % 1000)
    res.push(`${ts};${val * (filter.unit || 1000) / (filter.period || 1000)}`)
    from += 1
    if (filter.fillZeros)
      val = 0
    else
      break
  }
}

export default class Throughput extends Pipe {

  getOutput(type) {
    return this.compute(this.previous.getOutput(type))
  }
  compute(lines) {
    const filter = this
    const res = []
    if (filter.period > 0 && lines.length > 0) {
      const format = guessTimeFormat(lines)

      if (!format)
        return ['Could not guess time format']

      const length = format.length
      const weight = filter.weight ? new RegExp(filter.weight) : null
      let prev, rounded
      let value = 0


      res.push("Time;Throughput")
      lines.forEach(line => {
        const sub = line.substring(0, length)
        const time = moment(sub, format).valueOf()
        if (time) {
          rounded = Math.trunc(time / filter.period)
          if (prev !== rounded) {
            if (prev)
              append(res, prev, rounded, value, filter)

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
        append(res, prev, rounded + 1, value, filter)
      }
      return res
    }
    return lines
  }
}