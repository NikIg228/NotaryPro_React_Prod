import React from 'react'
import Input from './Input'

interface SearchProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

const Search: React.FC<SearchProps> = ({ 
  value, 
  onChange, 
  placeholder = 'Поиск документов...',
  className = ''
}) => {
  return (
    <div className={className}>
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full"
      />
    </div>
  )
}

export default Search

