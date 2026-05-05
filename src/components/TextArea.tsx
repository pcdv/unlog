import React, { useState, useEffect } from 'react'

interface TextAreaProps {
  value?: string
  orig?: string
  placeholder?: string
  title?: string
  style?: React.CSSProperties
  size?: number
  onChange: (value: string) => void
}

const TextArea: React.FC<TextAreaProps> = ({ value, orig, placeholder, title, style, onChange }) => {
  const [localValue, setLocalValue] = useState<string | undefined>(value)

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  return (
    <textarea
      value={localValue != null ? localValue : orig ?? ''}
      placeholder={placeholder}
      title={title}
      style={style}
      onChange={e => setLocalValue(e.target.value)}
      onBlur={e => {
        if (localValue !== value)
          onChange(e.target.value)
      }}
    />
  )
}

export default TextArea
