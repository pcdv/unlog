import React, {Component} from 'react';

class Checkbox extends Component {
  render() {
    return (
      <label>
        <input type="checkbox" checked={this.props.checked || false} onChange={e => this.props.onChange(e.target.checked)}/>
        {this.props.children}
      </label>
    );
  }
}

export default Checkbox;