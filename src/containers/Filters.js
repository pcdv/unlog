import React from 'react';
import { connect } from 'react-redux'
import InputText from '../components/InputText'
import TextArea from '../components/TextArea'
import Checkbox from '../components/Checkbox'
import Select from '../components/Select'
import { addFilter, updateFilter, deleteFilter, upFilter, downFilter, loadFile } from '../actions/filterActions'
import { getChainedFilters } from '../selectors/result'
import FileInput from '../forks/react-simple-file-input'


const Filters = ({filters, addFilter}) => (
  <span>
    <button onClick={() => addFilter()}>Add pipe</button>
    {filters.map(filter => getComponentForFilter(filter))}
  </span>
)

export default connect(state => ({ filters: getChainedFilters(state) }), { addFilter })(Filters)

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
    case "grep":
    case "exclude":
      return <Grep filter={filter} />
    case "replace":
      return <ReplaceFilter filter={filter} />
    case "throughput":
      return <ThroughputFilter filter={filter} />
    case "sample":
      return <SampleFilter filter={filter} />
    case "roundtrip":
      return <Roundtrip filter={filter} />
    case "sort":
      return <SortFilter filter={filter} />
    case "chart":
      return <ChartFilter filter={filter} />
    default:
      return <span />
  }
}

const _Grep = ({filter, placeholder, updateFilter }) => (
  <span>
    <InputText placeholder={placeholder} size={70}
      value={filter.pattern}
      onChange={s => updateFilter(filter.index, { pattern: s })} />
    <Checkbox checked={filter.ignoreCase} onChange={s => updateFilter(filter.index, { ignoreCase: s })} >Ignore case</Checkbox>
    <Checkbox checked={filter.invert} onChange={s => updateFilter(filter.index, { invert: s })} >Invert match</Checkbox>
  </span>
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
    {filter.file
      ? <button onClick={() => updateFilter(filter.index, { text: '', file: undefined })}>Close file</button>
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

const _ChartFilter = ({filter, updateFilter }) => {
  let fields = []
  try {
    fields = filter._previous._processor.getFields()
  }
  catch (e) { }

  return (
    <span>
      X: <Select value={filter.x} options={fields} onChange={x => updateFilter(filter.index, { x })}/>
      Y: <Select value={filter.y} options={fields} onChange={y => updateFilter(filter.index, { y })}/>
      <InputText placeholder="Width : 600"
        value={filter.width} size={10}
        onChange={width => updateFilter(filter.index, { width })} />
    </span>
  )
}
const ChartFilter = connect(null, { updateFilter })(_ChartFilter)

const _Roundtrip = ({filter, updateFilter }) => (
  <span>
    <InputText placeholder="Start regex with one capturing group to identify ID"
      value={filter.start} size={70}
      onChange={s => updateFilter(filter.index, { start: s })} />
    <InputText placeholder="Stop regex"
      value={filter.stop} size={35}
      onChange={s => updateFilter(filter.index, { stop: s })} />
  </span>
)
const Roundtrip = connect(null, { updateFilter })(_Roundtrip)

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
      value={filter.valuePattern} size={30}
      onChange={s => updateFilter(filter.index, { valuePattern: s })} />
    <Checkbox checked={filter.fillZeros} onChange={s => updateFilter(filter.index, { fillZeros: s })} >Fill zeros</Checkbox>
  </span>
)
const ThroughputFilter = connect(null, { updateFilter })(_ThroughputFilter)

const _SampleFilter = ({filter, updateFilter}) => (
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
      placeholder="min, max, throughput, sum"
      value={filter.functions} size={20}
      onChange={functions => updateFilter(filter.index, { functions })} />
    <InputText
      placeholder="Regexp to extract weight"
      value={filter.valuePattern} size={30}
      onChange={s => updateFilter(filter.index, { valuePattern: s })} />
    <Checkbox checked={filter.fillZeros} onChange={s => updateFilter(filter.index, { fillZeros: s })} >Fill zeros</Checkbox>
  </span>
)
const SampleFilter = connect(null, { updateFilter })(_SampleFilter)


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
    <option value="grep">grep</option>
    <option value="replace">replace</option>
    <option value="throughput">throughput</option>
    <option value="sample">sample</option>
    <option value="roundtrip">roundtrip</option>
    <option value="sort">sort</option>
    <option value="show">show</option>
    <option value="chart">chart</option>
  </select>
)

const ChooseType = connect(null, { updateFilter })(_ChooseType)
