const TIME_FORMATS = [
  [/^....-..-.. ..:..:..,.../, 'YYYY-MM-DD HH:mm:ss,SSS'],
  [/^..:..:..,.../, 'HH:mm:ss,SSS'],
]

export default function guessTimeFormat(lines) {
  for (var line of lines) {
    for (var [re, format] of TIME_FORMATS) {
      if (re.test(line))
        return format
    }
  }
}
