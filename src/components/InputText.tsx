import React, { useState, useEffect } from 'react'

interface InputTextProps {
  value?: string | number
  orig?: string | number
  placeholder?: string
  title?: string
  style?: React.CSSProperties
  size?: number
  onChange: (value: string) => void
}

const InputText: React.FC<InputTextProps> = ({ value, orig, placeholder, title, style, size, onChange }) => {
  const [localValue, setLocalValue] = useState<string | number | undefined>(value)

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  return (
    <input
      type="text"
      value={localValue != null ? localValue : orig ?? ''}
      placeholder={placeholder}
      title={title}
      style={style}
      size={size}
      onChange={e => setLocalValue(e.target.value)}
      onKeyUp={e => {
        if (e.key === 'Escape')
          setLocalValue(undefined)
        else if (e.key === 'Enter' && localValue !== value)
          onChange((e.target as HTMLInputElement).value)
      }}
      onBlur={e => {
        if (localValue !== value)
          onChange(e.target.value)
      }}
    />
  )
}

export default InputText
