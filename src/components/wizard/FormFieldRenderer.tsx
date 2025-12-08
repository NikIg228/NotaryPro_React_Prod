import React, { useMemo } from 'react'
import { useFormContext, Controller } from 'react-hook-form'
import { FieldDefinition } from '../../types/WizardTypes'
import Input from '../Input'
import FileUpload from './FileUpload'
import { getDictionaryOptions } from '../../utils/dictionaryLoader'
import { shouldShowField, getNestedError, formatErrorForUser } from '../../utils/validation'

interface FormFieldRendererProps {
  field: FieldDefinition
  formData: any
}

const FormFieldRenderer: React.FC<FormFieldRendererProps> = ({ field, formData }) => {
  const { control, formState: { errors } } = useFormContext()
  const fieldError = getNestedError(errors, field.name)

  const isVisible = shouldShowField(field, formData)
  if (!isVisible) {
    return null
  }

  const renderField = () => {
    switch (field.type) {
      case 'text':
      case 'date':
      case 'number':
        return (
          <Controller
            name={field.name}
            control={control}
            rules={{
              // ВАЛИДАЦИЯ ВРЕМЕННО ОТКЛЮЧЕНА
              required: false,
              // required: field.min !== undefined && field.min > 0 ? (field.label ? `Поле '${field.label}' обязательно для заполнения` : false) : false,
              // min: field.min !== undefined ? { value: field.min, message: `Минимум: ${field.min}` } : undefined,
              // max: field.max !== undefined ? { value: field.max, message: `Максимум: ${field.max}` } : undefined,
            }}
            render={({ field: formField }) => (
              <Input
                {...formField}
                type={field.type}
                label={field.label}
                required={field.min !== undefined && field.min > 0}
                error={fieldError ? formatErrorForUser(fieldError, field.label) : undefined}
              />
            )}
          />
        )

      case 'file':
        return <FileUpload field={field} />

      case 'multiselect':
        const options = useMemo(() => {
          if (field.dictionary) {
            return getDictionaryOptions(field.dictionary)
          }
          return []
        }, [field.dictionary])

        return (
          <Controller
            name={field.name}
            control={control}
            render={({ field: formField }) => (
              <div className="w-full">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  {field.label}
                </label>
                <select
                  {...formField}
                  multiple
                  className={`
                    w-full px-4 py-2 border rounded-lg
                    focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent
                    text-gray-900 min-h-[120px]
                    ${fieldError ? 'border-red-300' : 'border-gray-200'}
                  `}
                >
                  {options.map((option, index) => (
                    <option key={index} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {fieldError && (
                  <p className="mt-1 text-sm text-red-600">
                    {formatErrorForUser(fieldError, field.label)}
                  </p>
                )}
              </div>
            )}
          />
        )

      case 'checkbox':
        return (
          <Controller
            name={field.name}
            control={control}
            render={({ field: formField }) => (
              <label className="flex items-center">
                <input
                  type="checkbox"
                  {...formField}
                  checked={formField.value || false}
                  className="mr-3 w-4 h-4 text-black focus:ring-black rounded"
                />
                <span className="text-gray-900">{field.label}</span>
              </label>
            )}
          />
        )

      default:
        return (
          <div className="text-gray-600">
            Тип поля "{field.type}" не поддерживается
          </div>
        )
    }
  }

  return <div>{renderField()}</div>
}

export default FormFieldRenderer

