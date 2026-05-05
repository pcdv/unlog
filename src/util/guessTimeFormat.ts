const TIME_FORMATS: [RegExp, string][] = [
  [/^(....-..-.. ..:..:..,...)/, 'YYYY-MM-DD HH:mm:ss,SSS'],
  [/^(..:..:..,...)/, 'HH:mm:ss,SSS'],
  [/^(..:..:..)/, 'HH:mm:ss'],
  [/^(\d{12,})/, 'x'],
]

export default function guessTimeFormat(lines: string[]): [string | null, number] {
  for (const line of lines) {
    for (const [re, format] of TIME_FORMATS) {
      const match = re.exec(line)
      if (match) {
        return [format, match[1].length]
      }
    }
  }
  return [null, -1]
}
