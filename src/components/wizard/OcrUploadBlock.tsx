import React, { useState, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { StepDefinition, WizardFormData } from '../../types/WizardTypes'
import Card from '../Card'
import Button from '../Button'
import OcrFileUpload from './OcrFileUpload'

interface OcrUploadBlockProps {
  step: StepDefinition
  formData: WizardFormData
  onDataChange: (data: WizardFormData) => void
}

const OcrUploadBlock: React.FC<OcrUploadBlockProps> = ({ step, formData, onDataChange }) => {
  const { watch, setValue } = useFormContext()
  const watchedValues = watch()

  // Определяем имя массива
  const arrayName = step.manual_fields?.[0]?.name.match(/^(\w+)\[/)?.[1] || 'items'
  
  // Получаем текущее количество элементов (по умолчанию 1)
  const getArrayLength = (): number => {
    const currentArray = watchedValues[arrayName] || formData[arrayName] || []
    return Math.max(1, Array.isArray(currentArray) ? currentArray.length : 1)
  }

  const [arrayLength, setArrayLength] = useState(getArrayLength())

  useEffect(() => {
    const newLength = getArrayLength()
    if (newLength !== arrayLength) {
      setArrayLength(newLength)
    }
  }, [watchedValues[arrayName], formData[arrayName]])

  const canAdd = step.max === undefined || arrayLength < step.max

  const handleAdd = () => {
    if (canAdd) {
      const newLength = arrayLength + 1
      setArrayLength(newLength)
      const currentArray = watchedValues[arrayName] || []
      const newArray = [...currentArray, { attachments: [] }]
      setValue(arrayName as any, newArray)
      onDataChange({ [arrayName]: newArray })
    }
  }

  const handleRemove = (index: number) => {
    if (arrayLength > 1) {
      const newLength = arrayLength - 1
      setArrayLength(newLength)
      const currentArray = watchedValues[arrayName] || []
      const newArray = currentArray.filter((_: any, i: number) => i !== index)
      setValue(arrayName as any, newArray)
      onDataChange({ [arrayName]: newArray })
    }
  }

  return (
    <div className="space-y-6">
      {Array.from({ length: arrayLength }).map((_, index) => {
        const fieldName = `${arrayName}[${index}].attachments`
        return (
          <Card key={index} hover={false}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                {step.item_label || step.title || 'Элемент'} {index + 1}
              </h3>
              {arrayLength > 1 && (
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
            <OcrFileUpload
              fieldName={fieldName}
              min={2}
              max={2}
            />
          </Card>
        )
      })}
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

export default OcrUploadBlock

