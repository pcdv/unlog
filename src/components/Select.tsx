import React from 'react'

interface SelectOption {
  value: string
  label: string
}

function toOption(option: string | SelectOption): SelectOption {
  if (typeof option === 'string')
    return { value: option, label: option }
  return option
}

interface SelectProps {
  value?: string
  options: (string | SelectOption)[]
  onChange: (value: string) => void
}

const Select: React.FC<SelectProps> = ({ value, options, onChange }) => (
  <select value={value} onChange={e => onChange(e.target.value)}>
    {options.map(o => toOption(o)).map(o => (
      <option value={o.value} key={o.value}>{o.label}</option>
    ))}
  </select>
)

export default Select
