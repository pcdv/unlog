import React, { useRef } from 'react'

interface FileInputProps {
  onChange?: (file: File) => void
  children?: React.ReactNode
}

const FileInput: React.FC<FileInputProps> = ({ onChange, children }) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && onChange) {
      onChange(file)
    }
    // Reset so the same file can be re-selected
    event.target.value = ''
  }

  const handleClick = () => {
    inputRef.current?.click()
  }

  return (
    <span onClick={handleClick}>
      <input
        type="file"
        ref={inputRef}
        onChange={handleChange}
        style={children ? { display: 'none' } : {}}
      />
      {children}
    </span>
  )
}

export default FileInput
