const TIME_FORMATS = [
  [/^(....-..-.. ..:..:..,...)/, 'YYYY-MM-DD HH:mm:ss,SSS'],
  [/^(..:..:..,...)/, 'HH:mm:ss,SSS'],
  [/^(..:..:..)/, 'HH:mm:ss'],
  [/^(\d{12,})/, 'x']
]

export default function guessTimeFormat(lines) {
  for (var line of lines) {
    for (var [re, format] of TIME_FORMATS) {
      const match = re.exec(line)
      if (match) {
        //console.log(match)
        return [format, match[1].length]
      }
    }
  }
  return [null, -1]
}
