import React from 'react'
import Card from '../Card'

interface InputModeSelectorProps {
  selectedMode: 'manual' | 'ocr'
  onModeChange: (mode: 'manual' | 'ocr') => void
}

const InputModeSelector: React.FC<InputModeSelectorProps> = ({ selectedMode, onModeChange }) => {
  return (
    <div className="grid grid-cols-2 gap-6 mb-8">
      {/* Ручной ввод */}
      <Card 
        hover={true}
        className={`
          cursor-pointer transition-all
          ${selectedMode === 'manual' 
            ? 'border-black border-2 bg-gray-50' 
            : 'border-gray-200 hover:border-gray-300'
          }
        `}
        onClick={() => onModeChange('manual')}
      >
        <div className="flex flex-col items-center text-center py-6">
          <div className="mb-4">
            <svg 
              className="w-12 h-12 text-gray-700" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" 
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Ручной ввод данных
          </h3>
          <p className="text-sm text-gray-600">
            Заполните все поля формы вручную
          </p>
        </div>
      </Card>

      {/* OCR ввод */}
      <Card 
        hover={true}
        className={`
          cursor-pointer transition-all
          ${selectedMode === 'ocr' 
            ? 'border-black border-2 bg-gray-50' 
            : 'border-gray-200 hover:border-gray-300'
          }
        `}
        onClick={() => onModeChange('ocr')}
      >
        <div className="flex flex-col items-center text-center py-6">
          <div className="mb-4">
            <svg 
              className="w-12 h-12 text-gray-700" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Ввод с отсканированного документа
          </h3>
          <p className="text-sm text-gray-600">
            Загрузите документ для автоматического заполнения
          </p>
        </div>
      </Card>
    </div>
  )
}

export default InputModeSelector

