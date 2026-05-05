import React from 'react'

interface CheckboxProps {
  checked?: boolean
  onChange: (checked: boolean) => void
  children?: React.ReactNode
}

const Checkbox: React.FC<CheckboxProps> = ({ checked, onChange, children }) => (
  <label>
    <input
      type="checkbox"
      checked={checked ?? false}
      onChange={e => onChange(e.target.checked)}
    />
    {children}
  </label>
)

export default Checkbox
