import React from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { FieldDefinition } from '../../types/WizardTypes'
import { formatErrorForUser, getNestedError } from '../../utils/validation'
// import { createFieldValidation } from '../../utils/validation' // ВАЛИДАЦИЯ ВРЕМЕННО ОТКЛЮЧЕНА

interface FileUploadProps {
  field: FieldDefinition
}

const FileUpload: React.FC<FileUploadProps> = ({ field }) => {
  const { control, formState: { errors } } = useFormContext()
  const fieldError = getNestedError(errors, field.name)
  // ВАЛИДАЦИЯ ВРЕМЕННО ОТКЛЮЧЕНА
  const validationRules = {} // createFieldValidation(field, false)

  return (
    <Controller
      name={field.name}
      control={control}
      rules={validationRules}
      render={({ field: formField }) => (
        <div className="w-full">
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            {field.label}
            {field.min !== undefined && (
              <span className="text-gray-500 ml-2">
                (минимум {field.min} файл{field.min > 1 ? 'ов' : ''})
              </span>
            )}
            {field.max !== undefined && (
              <span className="text-gray-500 ml-2">
                (максимум {field.max} файл{field.max > 1 ? 'ов' : ''})
              </span>
            )}
          </label>
          <div className={`
            border-2 border-dashed rounded-lg p-6 text-center transition-colors
            ${fieldError ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'}
          `}>
            <input
              type="file"
              multiple={field.max !== 1}
              className="hidden"
              id={`file-${field.name}`}
              onChange={(e) => {
                const files = Array.from(e.target.files || [])
                formField.onChange(files)
              }}
            />
            <label
              htmlFor={`file-${field.name}`}
              className="cursor-pointer"
            >
              <div className="space-y-2">
                <p className="text-gray-600">
                  Нажмите для загрузки файлов
                </p>
                <p className="text-sm text-gray-500">
                  или перетащите файлы сюда
                </p>
              </div>
            </label>
            {formField.value && Array.isArray(formField.value) && formField.value.length > 0 && (
              <div className="mt-4 space-y-2">
                {formField.value.map((file: File, index: number) => (
                  <div key={index} className="text-sm text-gray-600 flex items-center justify-between bg-white p-2 rounded">
                    <span>{file.name}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const newFiles = formField.value.filter((_: File, i: number) => i !== index)
                        formField.onChange(newFiles)
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          {fieldError && (
            <p className="mt-1 text-sm text-red-600">
              {formatErrorForUser(fieldError, field.label)}
            </p>
          )}
        </div>
      )}
    />
  )
}

export default FileUpload

