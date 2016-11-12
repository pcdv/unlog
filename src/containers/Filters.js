import React from 'react';
import { connect } from 'react-redux'
import InputText from '../components/InputText'
import Checkbox from '../components/Checkbox'
import { addFilter, updateFilter, deleteFilter, upFilter, downFilter } from '../actions/filterActions'
import enumerate from '../util/enumerate'

const Filters = ({filters, addFilter}) => (
  <span>
    <button onClick={() => addFilter()}>Add pipe</button>
    {filters.map(filter => getComponentForFilter(filter))}
  </span>
)

export default connect(state => ({ filters: enumerate(state.filters) }), { addFilter })(Filters)

function getComponentForFilter(filter) {
  return (
    <div key={filter.index}>
      <UpFilter filter={filter} />
      <DownFilter filter={filter} />
      <DeleteFilter filter={filter} />
      <EnableFilter filter={filter} />
      <ChooseType filter={filter} />
      {getComponentForFilter0(filter)}
    </div>
  )
}

function getComponentForFilter0(filter) {
  switch (filter.type) {
    case "include":
    case "exclude":
      return <IncludeExclude key={filter.index} filter={filter} />
    case "replace":
      return <ReplaceFilter key={filter.index} filter={filter} />
    case "throughput":
      return <ThroughputFilter key={filter.index} filter={filter} />
    default:
      return <span/>
  }
}

const _IncludeExclude = ({filter, placeholder, updateFilter }) => (
  <InputText placeholder={placeholder}
    value={filter.pattern}
    onChange={s => updateFilter(filter.index, { pattern: s })} />
)
const IncludeExclude = connect(null, { updateFilter })(_IncludeExclude)

const _ReplaceFilter = ({filter, updateFilter }) => (
  <span>
    <InputText placeholder="Regular expression"
      value={filter.pattern} size={70}
      onChange={s => updateFilter(filter.index, { pattern: s })} />
    <InputText placeholder="Replace with"
      value={filter.replace} size={35}
      onChange={s => updateFilter(filter.index, { replace: s })} />
  </span>
)
const ReplaceFilter = connect(null, { updateFilter })(_ReplaceFilter)

const _ThroughputFilter = ({filter, updateFilter}) => (
  <span>
    Sampling period (ms):
    <InputText
      value={filter.period} size={4}
      onChange={s => updateFilter(filter.index, { period: Number.parseInt(s, 10) })} />
    <InputText
      placeholder="Regexp to extract weight"
      value={filter.weight} size={30}
      onChange={s => updateFilter(filter.index, { weight: s })} />
    Fill zeros:
    <InputText
      placeholder="y/n"
      value={filter.fillZeros} size={1}
      onChange={s => updateFilter(filter.index, { fillZeros: s })} />
  </span>
)
const ThroughputFilter = connect(null, { updateFilter })(_ThroughputFilter)

const DeleteFilter = connect(null, { deleteFilter })(
  ({filter, deleteFilter}) => <button onClick={s => deleteFilter(filter.index)}>Delete</button>
)

const UpFilter = connect(null, { upFilter })(
  ({filter, upFilter}) => <button disabled={filter.index === 0} onClick={s => upFilter(filter.index)}>Up</button>
)

const DownFilter = connect(null, { downFilter })(
  ({filter, downFilter}) => <button disabled={filter.isLast} onClick={s => downFilter(filter.index)}>Dn</button>
)

const EnableFilter = connect(null, { updateFilter })(
  ({filter, updateFilter}) => <Checkbox checked={filter.enabled} onChange={enabled => updateFilter(filter.index, {enabled})}>Enabled</Checkbox>
)

const _ChooseType = ({filter, updateFilter}) => (
  <select value={filter.type || 'invalid'} onChange={e => updateFilter(filter.index, { type: e.target.value })}>
    <option></option>
    <option value="include">grep</option>
    <option value="exclude">grep -v</option>
    <option value="replace">replace</option>
    <option value="throughput">throughput</option>
    <option value="show">show</option>
  </select>
)

const ChooseType = connect(null, { updateFilter })(_ChooseType)
