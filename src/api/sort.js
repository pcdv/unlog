import Pipe from './pipe'

export default class Sort extends Pipe {
  compute(lines) {
    let sortFunc 

    if (this.numeric)
      sortFunc = (a, b) => Number.parseInt(a, 10) < Number.parseInt(b, 10) ? -1 : 1
    else
      sortFunc = (a, b) => a < b ? -1 : 1
    
    lines = lines.slice().sort(sortFunc)

    if (this.unique) {
      let last
      lines = lines.filter(i => {
        const keep = last !== i
        last = i
        return keep
      })
    }

    if (this.reverse)
      lines.reverse()

    return lines
  }
}
