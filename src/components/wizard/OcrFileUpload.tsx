import React, { useRef, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import Button from '../Button'

interface OcrFileUploadProps {
  fieldName: string
  min: number
  max: number
}

const OcrFileUpload: React.FC<OcrFileUploadProps> = ({ fieldName, min, max }) => {
  const { control } = useFormContext()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleFileSelect = () => {
    fileInputRef.current?.click()
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent, onChange: (files: File[]) => void) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      onChange(files.slice(0, max))
    }
  }

  const handlePaste = (e: React.ClipboardEvent, onChange: (files: File[]) => void, currentFiles: File[]) => {
    const items = Array.from(e.clipboardData.items)
    const files: File[] = []
    
    items.forEach((item) => {
      if (item.kind === 'file') {
        const file = item.getAsFile()
        if (file) {
          files.push(file)
        }
      }
    })

    if (files.length > 0) {
      const newFiles = [...(currentFiles || []), ...files].slice(0, max)
      onChange(newFiles)
    }
  }

  return (
    <Controller
      name={fieldName}
      control={control}
      render={({ field: { onChange, value } }) => {
        const files = (value || []) as File[]

        return (
          <div className="w-full">
            <div
              className={`
                border-2 border-dashed rounded-lg p-12 text-center transition-colors
                ${isDragging ? 'border-gray-400 bg-gray-50' : 'border-gray-300'}
              `}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, onChange)}
              onPaste={(e) => handlePaste(e, onChange, files)}
            >
              {/* Иконка загрузки */}
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>
              </div>

              {/* Основной текст */}
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Перетащите файлы сюда
              </h3>

              {/* Вторичный текст */}
              <p className="text-sm text-gray-600 mb-4">
                или используйте кнопку ниже
              </p>

              {/* Требование */}
              <p className="text-xs text-gray-500 mb-6">
                Требуется {min} файл{min > 1 ? 'а' : ''}
              </p>

              {/* Скрытый input */}
              <input
                ref={fileInputRef}
                type="file"
                multiple={max > 1}
                className="hidden"
                onChange={(e) => {
                  const selectedFiles = Array.from(e.target.files || [])
                  onChange(selectedFiles.slice(0, max))
                }}
              />

              {/* Кнопка выбора файлов */}
              <Button
                variant="secondary"
                onClick={handleFileSelect}
                className="mb-4"
              >
                Выбрать файлы
              </Button>

              {/* Подсказка про Ctrl+V */}
              <p className="text-xs text-gray-500 mt-4">
                Также можно вставить файлы из буфера обмена (Ctrl+V)
              </p>

              {/* Список загруженных файлов */}
              {files.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-sm font-medium text-gray-900 mb-3">
                    Загружено файлов: {files.length} / {max}
                  </p>
                  <div className="space-y-2">
                    {files.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                      >
                        <span className="text-sm text-gray-700 truncate flex-1">
                          {file.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const newFiles = files.filter((_, i) => i !== index)
                            onChange(newFiles)
                          }}
                          className="text-red-600 hover:text-red-700 ml-3"
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
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )
      }}
    />
  )
}

export default OcrFileUpload

