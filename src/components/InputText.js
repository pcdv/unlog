import React, {Component} from 'react';

/**
 * Like <input type="text"/> but allows to dispatch onChange(value) 
 * only when Enter is pressed or focus is lost.
 */
class InputText extends Component {
  state = {}

  componentWillReceiveProps(nextProps) {
    this.setState({value: nextProps.value})
  }
  
  render() {
    const {orig, placeholder, title} = this.props
    const {value} = this.state

    return (
      <input type="text" value={(value != null ? value : orig) || ""} placeholder={placeholder} title={title}
        onChange={e => this.setState({ value: e.target.value }) }
        onKeyUp={e => {
          if (e.keyCode === 27)
            this.setState({ value: null })
          else if (e.keyCode === 13 && this.state.value !== this.props.value)
            this.props.onChange(e.target.value)
        } }
        onBlur={e => {
          if (this.state.value !== this.props.value)
            this.props.onChange(this.state.value)
        } }
        />
    );
  }
}

export default InputText;