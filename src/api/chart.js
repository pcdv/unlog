import Pipe from './pipe'

/**
 * 
 */
export default class Chart extends Pipe {

  exec(context) {

    let data = this.getPrevious().getOutput('data')

    context.addVisualisation({
      type: 'chart', data, filter: this
    })
  }
}