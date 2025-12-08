import React, { useState, useEffect, useMemo } from 'react'
import { useFormContext } from 'react-hook-form'
import { StepDefinition, WizardFormData } from '../../types/WizardTypes'
import Button from '../Button'
import FormFieldRenderer from './FormFieldRenderer'

interface WizardArrayProps {
  step: StepDefinition
  formData: WizardFormData
  onDataChange: (data: WizardFormData) => void
}

const WizardArray: React.FC<WizardArrayProps> = ({ step, formData, onDataChange }) => {
  const { watch, setValue } = useFormContext()
  const watchedValues = watch()

  const arrayName = useMemo(() => {
    // Для input-mode шагов используем manual_fields
    const fieldsToUse = step.fields || step.manual_fields || []
    if (fieldsToUse.length === 0) return ''
    const firstFieldName = fieldsToUse[0].name
    const match = firstFieldName.match(/^(\w+)\[/)
    return match ? match[1] : ''
  }, [step.fields, step.manual_fields])

  const getArrayLength = (): number => {
    // Для input-mode шагов всегда начинаем с 1 элемента
    if (step.dynamicCountFrom) {
      const count = watchedValues[step.dynamicCountFrom]
      // Если dynamicCountFrom установлен, но значение не задано, начинаем с 1
      if (count === undefined || count === null) {
        return step.min || 1
      }
      return Math.max(step.min || 1, Math.min(step.max || 10, Number(count) || step.min || 1))
    } else {
      const currentArray = watchedValues[arrayName] || formData[arrayName] || []
      const currentLength = Array.isArray(currentArray) ? currentArray.length : 0
      // Всегда начинаем минимум с 1 элемента
      return Math.max(step.min || 1, currentLength || step.min || 1)
    }
  }

  const [arrayLength, setArrayLength] = useState(getArrayLength())

  useEffect(() => {
    const newLength = getArrayLength()
    if (newLength !== arrayLength) {
      setArrayLength(newLength)
      if (arrayName && newLength > arrayLength) {
        const currentArray = watchedValues[arrayName] || []
        const newArray = [...currentArray]
        while (newArray.length < newLength) {
          newArray.push({})
        }
        setValue(arrayName as any, newArray)
        onDataChange({ [arrayName]: newArray })
      }
    }
  }, [watchedValues[step.dynamicCountFrom || ''], formData[step.dynamicCountFrom || ''], arrayLength, arrayName, watchedValues, setValue, onDataChange, step.dynamicCountFrom])

  // Инициализация массива при первом рендере
  useEffect(() => {
    if (arrayName && (!watchedValues[arrayName] || !Array.isArray(watchedValues[arrayName]))) {
      const initialArray = Array.from({ length: arrayLength }).map(() => ({}))
      setValue(arrayName as any, initialArray)
      onDataChange({ [arrayName]: initialArray })
    }
  }, [arrayName, arrayLength, setValue, onDataChange, watchedValues])

  const canAdd = step.max === undefined || arrayLength < step.max
  const canRemove = step.min === undefined || arrayLength > step.min

  const handleAdd = () => {
    if (canAdd) {
      const newLength = arrayLength + 1
      setArrayLength(newLength)
      if (arrayName) {
        const currentArray = watchedValues[arrayName] || []
        const newArray = [...currentArray, {}]
        setValue(arrayName as any, newArray)
        onDataChange({ [arrayName]: newArray })
      }
    }
  }

  const handleRemove = (index: number) => {
    if (canRemove && arrayLength > (step.min || 1)) {
      const newLength = arrayLength - 1
      setArrayLength(newLength)
      if (arrayName) {
        const currentArray = watchedValues[arrayName] || []
        const newArray = currentArray.filter((_: any, i: number) => i !== index)
        setValue(arrayName as any, newArray)
        onDataChange({ [arrayName]: newArray })
        // Обновляем счетчик если используется dynamicCountFrom
        if (step.dynamicCountFrom) {
          setValue(step.dynamicCountFrom as any, newLength)
          onDataChange({ [step.dynamicCountFrom]: newLength })
        }
      }
    }
  }

  return (
    <div className="space-y-8">
      {Array.from({ length: arrayLength }).map((_, index) => (
        <div key={index} className="space-y-6">
          {step.item_label && (
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">
                {step.item_label} {index + 1}
              </h3>
              {canRemove && arrayLength > (step.min || 1) && (
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="text-red-600 hover:text-red-700 transition-colors"
                  title="Удалить"
                >
                  <svg 
                    className="w-5 h-5" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                    />
                  </svg>
                </button>
              )}
            </div>
          )}
          {!step.item_label && canRemove && arrayLength > (step.min || 1) && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="text-red-600 hover:text-red-700 transition-colors"
                title="Удалить"
              >
                <svg 
                  className="w-5 h-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                  />
                </svg>
              </button>
            </div>
          )}
          <div className="space-y-6">
            {(step.fields || step.manual_fields || []).map((field, fieldIndex) => {
              const fieldName = field.name.replace('[]', `[${index}]`)
              return (
                <FormFieldRenderer
                  key={fieldIndex}
                  field={{
                    ...field,
                    name: fieldName
                  }}
                  formData={watchedValues}
                />
              )
            })}
          </div>
        </div>
      ))}
      {canAdd && (
        <div className="pt-2">
          <Button 
            variant="secondary" 
            onClick={handleAdd}
            className="w-full sm:w-auto"
          >
            + Добавить еще
          </Button>
        </div>
      )}
    </div>
  )
}

export default WizardArray
