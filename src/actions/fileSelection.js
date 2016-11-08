import * as ACTION from '../constants/actions'

export function loadFile(file) {
  console.log(file)
  return (dispatch, getState) => {
    const reader = new FileReader(file)
    reader.onload = (event) => dispatch(replaceLogFile(file, event.target.result))
    reader.readAsText(file)
  }
}

const MAX_LENGTH = 1024 * 1024

class LoadedFile {
  constructor(data) {
    this.data = data
  }

  getExcerpt(options) {
    let text = this.data
    let lines

    if (options.include && options.include.length) {
      lines = lines || text.split(/[\n\r]+/g)

      options.include.forEach(pat => {
        const re = new RegExp(pat)
        lines = lines.filter(line => re.test(line))
      })
    }

    if (options.exclude && options.exclude.length) {
      lines = lines || text.split(/[\n\r]+/g)

      options.exclude.forEach(pat => {
        const re = new RegExp(pat)
        lines = lines.filter(line => !re.test(line))
      })
    }

    if (options.replaceRules && options.replaceRules.length) {
      lines = lines || text.split(/[\n\r]+/g)

      options.replaceRules.forEach(r => {
        if (r.pattern) {
          const re = new RegExp(r.pattern)
          lines = lines.map(line => line.replace(re, r.replace))
        }
      })
    }

    const res = lines ? lines.join('\n') : text
    return res.length < MAX_LENGTH ? res : res.substring(0, MAX_LENGTH)
  }
}

export function replaceLogFile(file, text) {
  return {
    type: ACTION.REPLACE_LOG_FILE,
    name: file.name,
    file: new LoadedFile(text)
  }
}

export function closeFile() {
  return {
    type: ACTION.CLOSE_LOG_FILE
  }
}