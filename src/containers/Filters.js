import React from 'react';
import { connect } from 'react-redux'
import InputText from '../components/InputText'
import TextArea from '../components/TextArea'
import Checkbox from '../components/Checkbox'
import { addFilter, updateFilter, deleteFilter, upFilter, downFilter, loadFile } from '../actions/filterActions'
import enumerate from '../util/enumerate'
import FileInput from '../forks/react-simple-file-input'


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
    case "cat":
      return <Cat filter={filter} />
    case "text":
      return <Text filter={filter} />
    case "include":
    case "exclude":
      return <Grep filter={filter} />
    case "replace":
      return <ReplaceFilter filter={filter} />
    case "throughput":
      return <ThroughputFilter filter={filter} />
    case "sort":
      return <SortFilter filter={filter} />
    default:
      return <span />
  }
}


const _Grep = ({filter, placeholder, updateFilter }) => (
  <InputText placeholder={placeholder} size={70}
    value={filter.pattern}
    onChange={s => updateFilter(filter.index, { pattern: s })} />
)
const Grep = connect(null, { updateFilter })(_Grep)


const _Text = ({filter, updateFilter }) => (
  <TextArea
    value={filter.text}
    onChange={s => updateFilter(filter.index, { text: s })} />
)
const Text = connect(null, { updateFilter })(_Text)

const _Cat = ({filter, updateFilter, loadFile }) => (
  <span>
    {name
      ? <button onClick={updateFilter(filter.index, {text: '', name: undefined})}>Close file</button>
      : <FileInput onChange={file => loadFile(filter.index, file)}>
        <button>Select file2...</button>
      </FileInput>}
  </span>
)
const Cat = connect(null, { updateFilter, loadFile })(_Cat)


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

const _SortFilter = ({filter, updateFilter }) => (
  <span>
    <Checkbox checked={filter.reverse} onChange={s => updateFilter(filter.index, { reverse: s })} >Reverse</Checkbox>
    <Checkbox checked={filter.numeric} onChange={s => updateFilter(filter.index, { numeric: s })} >Numeric</Checkbox>
    <Checkbox checked={filter.unique} onChange={s => updateFilter(filter.index, { unique: s })} >Unique</Checkbox>
  </span>
)
const SortFilter = connect(null, { updateFilter })(_SortFilter)

const _ThroughputFilter = ({filter, updateFilter}) => (
  <span>
    Period (ms):
    <InputText
      value={filter.period} size={4}
      onChange={s => updateFilter(filter.index, { period: Number.parseInt(s, 10) })} />
    Time unit (ms):
    <InputText
      placeholder="1000"
      value={filter.unit} size={4}
      onChange={s => updateFilter(filter.index, { unit: Number.parseInt(s, 10) })} />
    <InputText
      placeholder="Regexp to extract weight"
      value={filter.weight} size={30}
      onChange={s => updateFilter(filter.index, { weight: s })} />
    <Checkbox checked={filter.fillZeros} onChange={s => updateFilter(filter.index, { fillZeros: s })} >Fill zeros</Checkbox>
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
  ({filter, updateFilter}) => <Checkbox checked={filter.enabled} onChange={enabled => updateFilter(filter.index, { enabled })}></Checkbox>
)

const _ChooseType = ({filter, updateFilter}) => (
  <select value={filter.type || 'invalid'} onChange={e => updateFilter(filter.index, { type: e.target.value })}>
    <option></option>
    <option value="cat">cat</option>
    <option value="text">text</option>
    <option value="include">grep</option>
    <option value="exclude">grep -v</option>
    <option value="replace">replace</option>
    <option value="throughput">throughput</option>
    <option value="sort">sort</option>
    <option value="show">show</option>
  </select>
)

const ChooseType = connect(null, { updateFilter })(_ChooseType)
