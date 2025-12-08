import React, { useMemo, useState } from 'react'
import { StepDefinition } from '../../types/WizardTypes'
import { getDictionaryOptions } from '../../utils/dictionaryLoader'

interface CheckboxGroupProps {
  step: StepDefinition
  value: string[]
  onChange: (value: string[]) => void
}

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({ step, value = [], onChange }) => {
  const [search, setSearch] = useState('')

  const options = useMemo(() => {
    if (step.optionsFrom) {
      return getDictionaryOptions(step.optionsFrom)
    }
    return (step.options || []) as Array<{ value: string; label: string }>
  }, [step.options, step.optionsFrom])

  const filteredOptions = useMemo(() => {
    if (!search.trim()) return options
    const query = search.toLowerCase()
    return options.filter(opt => opt.label.toLowerCase().includes(query))
  }, [options, search])

  const handleToggle = (optionValue: string) => {
    const newValue = value.includes(optionValue)
      ? value.filter(v => v !== optionValue)
      : [...value, optionValue]
    onChange(newValue)
  }

  const handleSelectAll = () => {
    if (value.length === options.length) {
      onChange([])
    } else {
      onChange(options.map(opt => opt.value))
    }
  }

  const allSelected = value.length === options.length && options.length > 0

  return (
    <div className="space-y-4">
      {step.select_all && (
        <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={handleSelectAll}
            className="mr-3 w-4 h-4 text-black focus:ring-black rounded"
          />
          <span className="text-gray-900 font-semibold">Выбрать всё</span>
        </label>
      )}

      {/* Поиск по списку (особенно полезно для стран мира) */}
      {options.length > 10 && (
        <div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск..."
            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          />
        </div>
      )}

      {filteredOptions.map((option, index) => {
        const isChecked = value.includes(option.value)
        
        return (
          <label
            key={index}
            className={`
              flex items-center p-4 border rounded-lg cursor-pointer transition-colors
              ${isChecked 
                ? 'border-black bg-gray-50' 
                : 'border-gray-200 hover:bg-gray-50'
              }
            `}
          >
            <input
              type="checkbox"
              checked={isChecked}
              onChange={() => handleToggle(option.value)}
              className="mr-3 w-4 h-4 text-black focus:ring-black rounded"
            />
            <span className="text-gray-900 font-medium">{option.label}</span>
          </label>
        )
      })}
    </div>
  )
}

export default CheckboxGroup
