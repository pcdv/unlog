import React, { Component } from 'react';

/**
 * Like <textarea/> but allows to dispatch onChange(value) only when focus is lost.
 */
class TextArea extends Component {

  constructor(props) {
    super(props)
    this.state = { value: props.value }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ value: nextProps.value })
  }

  render() {
    const {orig, placeholder, title, style, size} = this.props
    const {value} = this.state

    return (
      <textarea
        value={(value != null ? value : orig) || ""}
        placeholder={placeholder} 
        title={title}
        style={style}
        size={size}
        onChange={e => this.setState({ value: e.target.value })}
        onBlur={e => {
          if (this.state.value !== this.props.value)
            this.props.onChange(this.state.value)
        } }
        />
    );
  }
}

export default TextArea;