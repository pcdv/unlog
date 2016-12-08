import React from 'react';

function toOption(option) {
  if (typeof option === 'string')
    return { value: option, label: option }
  else
    return option
}

const Select = ({value, options, onChange}) => (
  <select value={value} onChange={e => onChange(e.target.value)}>
    {options.map(o => toOption(o)).map(o => <option value={o.value} key={o.value}>{o.label}</option>)}
  </select>
)

export default Select;