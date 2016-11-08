import React, { Component } from 'react';
import { connect } from 'react-redux'
import { addReplaceRule, updateReplaceRule, deleteReplaceRule } from '../actions/filterActions'
import InputText from '../components/InputText'

class ReplaceRules extends Component {
  render() {
    const {replaceRules, dispatch} = this.props

    return (
      <div>
        <button onClick={() => dispatch(addReplaceRule())}>Add replace rule</button>
        {replaceRules.map(r => <ReplaceRule rule={r} key={r.index} dispatch={dispatch} />)}
      </div>
    );
  }
}

function mapStateToProps(state) {
  const {replaceRules} = state.filters
  let index = 0
  return { replaceRules: replaceRules.map(r => Object.assign(r, {index: index++})) }
}

export default connect(mapStateToProps)(ReplaceRules)

class ReplaceRule extends Component {
  render() {
    const {rule, dispatch} = this.props
    return (
      <div>
        <InputText placeholder="Pattern" value={rule.pattern} onChange={s => dispatch(updateReplaceRule(rule.index, { pattern: s }))} />
        <InputText placeholder="Replace" value={rule.replace} onChange={s => dispatch(updateReplaceRule(rule.index, { replace: s }))} />
        <button onClick={s => dispatch(deleteReplaceRule(rule.index))}>Delete</button>
      </div>
    )
  }
}
