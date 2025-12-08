import React from 'react'

interface FilterOption {
  value: string
  label: string
}

interface FiltersProps {
  options: FilterOption[]
  selected: string[]
  onChange: (selected: string[]) => void
  className?: string
}

const Filters: React.FC<FiltersProps> = ({ 
  options, 
  selected, 
  onChange,
  className = ''
}) => {
  const handleToggle = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter(v => v !== value))
    } else {
      onChange([...selected, value])
    }
  }

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {options.map((option) => {
        const isSelected = selected.includes(option.value)
        return (
          <button
            key={option.value}
            onClick={() => handleToggle(option.value)}
            className={`
              px-4 py-2 rounded-lg font-medium transition-colors
              ${isSelected 
                ? 'bg-black text-white hover:bg-gray-900' 
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
              }
            `}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

export default Filters

