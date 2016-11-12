
const DUMMY = {
  compute: function (filter, lines) {
    return lines
  }
}

class Include {
  compute(filter, lines) {
    if (filter.pattern) {
      const re = new RegExp(filter.pattern)
      return lines.filter(line => re.test(line))
    }
    return lines
  }
}

class Exclude {
  compute(filter, lines) {
    if (filter.pattern) {
      const re = new RegExp(filter.pattern)
      return lines.filter(line => !re.test(line))
    }
    return lines
  }
}

class Replace {
  compute(filter, lines) {
    if (filter.pattern && filter.replace !== undefined) {
      const re = new RegExp(filter.pattern, 'g')
      return lines.map(line => line.replace(re, filter.replace))
    }
    return lines
  }
}

const TIME_FORMATS = [
  /....-..-.. ..:..:..[.,].../
]

function guessTimeFormat(lines) {
  for (var line of lines) {
    for (var re of TIME_FORMATS) {
      if (re.test(line))
        return re
    }
  }
}

import moment from 'moment'

function append(res, from, to, val, step, fillZeros) {
  while (from < to) {
    const ts = moment(from * step).format('hh:mm:ss')+","+((from*step) % 1000)
    res.push(`${ts};${val}`)
    from += 1
    if (fillZeros)
      val = 0
    else
      break
  }
}

class Throughput {
  compute(filter, lines) {
    const res = []
    if (filter.period > 0 && lines.length > 0) {
      const format = guessTimeFormat(lines)
      const length = format.source.length
      const weight = filter.weight ? new RegExp(filter.weight) : null
      let prev, rounded
      let value = 0


      res.push("Time;Throughput")
      lines.forEach(line => {
        const time = moment(line.substring(0, length)).valueOf()
        if (time) {
          rounded = Math.trunc(time / filter.period)
          if (prev !== rounded) {
            if (prev)
              append(res, prev, rounded, value, filter.period, filter.fillZeros)

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
        append(res, prev, rounded + 1, value, filter.period, filter.fillZeros)
      }
      return res
    }
    return lines
  }
}

export function getProcessor(filter) {
  switch (filter.type) {
    case "include":
      return new Include()
    case "exclude":
      return new Exclude()
    case "replace":
      return new Replace()
    case "throughput":
      return new Throughput()
    default:
      return DUMMY
  }
}

