import React from 'react';
import { connect } from 'react-redux'
import InputText from '../components/InputText'
import { addFilter, updateFilter, deleteFilter } from '../actions/filterActions'
import enumerate from '../util/enumerate'

const Filters = ({filters, addFilter}) => (
  <div>
    <button onClick={() => addFilter()}>Add filter</button>
    {filters.map(filter => getComponentForFilter(filter))}
  </div>
)

export default connect(state => ({ filters: enumerate(state.filters) }), { addFilter })(Filters)

function getComponentForFilter(filter) {
  switch (filter.type) {
    case "include":
    case "exclude":
      return <IncludeExclude key={filter.index} filter={filter} />
    case "replace":
      return <ReplaceFilter key={filter.index} filter={filter} />
    case "throughput":
      return <ThroughputFilter key={filter.index} filter={filter} />
    default:
      return <Unknown key={filter.index} filter={filter} />
  }
}

const Unknown = ({filter }) => (
  <div>
    <ChooseType filter={filter} />
    <DeleteFilter filter={filter} />
  </div>
)

const _IncludeExclude = ({filter, placeholder, updateFilter }) => (
  <div>
    <ChooseType filter={filter} />
    <InputText placeholder={placeholder}
      value={filter.pattern}
      onChange={s => updateFilter(filter.index, { pattern: s })} />
    <DeleteFilter filter={filter} />
  </div>
)
const IncludeExclude = connect(null, { updateFilter })(_IncludeExclude)

const _ReplaceFilter = ({filter, updateFilter }) => (
  <div>
    <ChooseType filter={filter} />
    <InputText
      value={filter.pattern} size={70}
      onChange={s => updateFilter(filter.index, { pattern: s })} />
    <InputText
      value={filter.replace} size={35}
      onChange={s => updateFilter(filter.index, { replace: s })} />
    <DeleteFilter filter={filter} />
  </div>
)
const ReplaceFilter = connect(null, { updateFilter })(_ReplaceFilter)

const _ThroughputFilter = ({filter, updateFilter}) => (
  <div>
    <ChooseType filter={filter} />
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

    <DeleteFilter filter={filter} />
  </div>
)
const ThroughputFilter = connect(null, { updateFilter })(_ThroughputFilter)

const _DeleteFilter = ({filter, deleteFilter}) => (
  <span>
    <button onClick={s => deleteFilter(filter.index)}>Delete</button>
  </span>
)
const DeleteFilter = connect(null, { deleteFilter })(_DeleteFilter)

const _ChooseType = ({filter, updateFilter}) => (
  <select value={filter.type} onChange={e => updateFilter(filter.index, { type: e.target.value })}>
    <option value=""></option>
    <option value="include">include</option>
    <option value="exclude">exclude</option>
    <option value="replace">replace</option>
    <option value="throughput">throughput</option>
  </select>
)

const ChooseType = connect(null, { updateFilter })(_ChooseType)
