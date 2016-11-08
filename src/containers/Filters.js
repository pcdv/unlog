import React, { Component } from 'react';
import { connect } from 'react-redux'
import InputText from '../components/InputText'
import {setIncludes, setExcludes} from '../actions/filterActions'

class Filters extends Component {
  render() {
    const {include, exclude, setIncludes, setExcludes} = this.props

    return (
      <div>
        <InputText placeholder="Include regexps" value={include.join(" ")} onChange={s => setIncludes(s ? s.split(/\s+/g) : [])}/>
        <InputText placeholder="Exclude regexps" value={exclude.join(" ")} onChange={s => setExcludes(s ? s.split(/\s+/g) : [])}/>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const {include, exclude} = state.filters
  return { include, exclude }
}

export default connect(mapStateToProps, {setIncludes, setExcludes})(Filters)