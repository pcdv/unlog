import Pipe from './pipe'

/**
 * Simple visualisation of lines.
 */
export default class Show extends Pipe {

  exec(context) {
    const settings = context.settings

    let lines = this.getPrevious().getOutput('lines')
    const linesDropped = lines.length <= settings.maxLines ? 0 : lines.length - settings.maxLines
    const res = lines.slice(0, settings.maxLines).join('\n')
 
    const txt = res.length < settings.maxChars ? res : res.substring(0, settings.maxChars)
    const charsDropped = res.length <= settings.maxChars ? 0 : res.length - txt.length

    context.addVisualisation({
      type: 'show',
      text: txt,
      charsDropped,
      linesDropped
    })
  }
}