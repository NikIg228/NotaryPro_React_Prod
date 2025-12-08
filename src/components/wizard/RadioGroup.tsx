import React from 'react'
import { StepDefinition } from '../../types/WizardTypes'

interface RadioGroupProps {
  step: StepDefinition
  value: any
  onChange: (value: any) => void
}

const RadioGroup: React.FC<RadioGroupProps> = ({ step, value, onChange }) => {
  return (
    <div className="space-y-4">
      {step.options?.map((option, index) => {
        const optionValue = typeof option === 'object' ? option.value : option
        const optionLabel = typeof option === 'object' ? option.label : String(option)
        const isChecked = value === optionValue
        
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
              type="radio"
              name={step.id}
              value={String(optionValue)}
              checked={isChecked}
              className="mr-3 w-4 h-4 text-black focus:ring-black"
              onChange={() => onChange(optionValue)}
            />
            <span className="text-gray-900 font-medium">{optionLabel}</span>
          </label>
        )
      })}
    </div>
  )
}

export default RadioGroup

