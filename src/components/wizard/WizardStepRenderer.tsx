import React from 'react'
import { useFormContext } from 'react-hook-form'
import { StepDefinition, WizardFormData } from '../../types/WizardTypes'
import Card from '../Card'
import RadioGroup from './RadioGroup'
import CheckboxGroup from './CheckboxGroup'
import WizardArray from './WizardArray'
import FormFieldRenderer from './FormFieldRenderer'
import NumberInput from './NumberInput'
import InputModeSelector from './InputModeSelector'
import OcrUploadBlock from './OcrUploadBlock'

interface WizardStepRendererProps {
  step: StepDefinition
  formData: WizardFormData
  onDataChange: (data: WizardFormData) => void
}

const WizardStepRenderer: React.FC<WizardStepRendererProps> = ({ 
  step, 
  onDataChange 
}) => {
  const { watch } = useFormContext()
  const watchedValues = watch()

  const renderStepContent = () => {
    switch (step.type) {
      case 'form':
        return (
          <div className="space-y-6">
            {step.fields?.map((field, index) => (
              <FormFieldRenderer
                key={index}
                field={field}
                formData={watchedValues}
              />
            ))}
            {step.manual_fields?.map((field, index) => (
              <FormFieldRenderer
                key={`manual-${index}`}
                field={field}
                formData={watchedValues}
              />
            ))}
          </div>
        )

      case 'radio': {
        const selectedValue = watchedValues[step.id]

        return (
          <div className="space-y-6">
            <RadioGroup
              step={step}
              value={selectedValue}
              onChange={(value) => {
                onDataChange({ [step.id]: value })
              }}
            />
          </div>
        )
      }

      case 'checkbox-group':
        return (
          <CheckboxGroup
            step={step}
            value={watchedValues[step.id] || []}
            onChange={(value) => {
              onDataChange({ [step.id]: value })
            }}
          />
        )

      case 'array':
        return (
          <WizardArray
            step={step}
            formData={watchedValues}
            onDataChange={onDataChange}
          />
        )

      case 'number':
        return (
          <NumberInput
            step={step}
            value={watchedValues[step.id]}
            onChange={(value) => {
              onDataChange({ [step.id]: value })
            }}
          />
        )

      case 'input-mode':
        const inputModeField = step.input_mode_field || `${step.id}_mode`
        // Режим ввода хранится в отдельном поле
        const inputModeTypeField = `${inputModeField}_type`
        const inputMode = watchedValues[inputModeTypeField] || null
        
        return (
          <div className="space-y-8">
            {/* Селектор способа ввода (ручной/OCR) - показывается всегда первым */}
            {!inputMode && (
              <InputModeSelector
                selectedMode={watchedValues[inputModeTypeField] || 'manual'}
                onModeChange={(mode) => {
                  onDataChange({ 
                    [inputModeTypeField]: mode,
                    // Инициализируем массив с одним элементом
                    [inputModeField]: 1
                  })
                }}
              />
            )}
            
            {/* Кнопка "Назад" для возврата к выбору формата */}
            {inputMode && (
              <div className="mb-4">
                <button
                  type="button"
                  onClick={() => {
                    onDataChange({ 
                      [inputModeTypeField]: null,
                      [inputModeField]: null
                    })
                  }}
                  className="text-sm text-gray-600 hover:text-gray-900 underline flex items-center gap-2"
                >
                  <svg 
                    className="w-4 h-4" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M15 19l-7-7 7-7" 
                    />
                  </svg>
                  Назад к выбору формата
                </button>
              </div>
            )}
            
            {/* Форма для ручного ввода */}
            {inputMode === 'manual' && step.manual_fields && (
              <WizardArray
                step={{
                  ...step,
                  type: 'array',
                  min: step.min || 1,
                  max: step.max || 2,
                  fields: step.manual_fields,
                  item_label: step.item_label || step.title
                }}
                formData={watchedValues}
                onDataChange={onDataChange}
              />
            )}
            
            {/* Блок для OCR - загрузка файлов */}
            {inputMode === 'ocr' && (
              <OcrUploadBlock
                step={step}
                formData={watchedValues}
                onDataChange={onDataChange}
              />
            )}
          </div>
        )

      case 'validation':
        return (
          <div className="space-y-6">
            <div className="text-center py-4">
              <p className="text-gray-600 mb-6">
                Проверка данных...
              </p>
            </div>
            
            {/* Превью документа Word */}
            <div className="border-2 border-gray-300 rounded-lg bg-white shadow-lg overflow-hidden">
              {/* Заголовок Word документа */}
              <div className="bg-blue-600 text-white px-4 py-2 flex items-center gap-2">
                <svg 
                  className="w-5 h-5" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                </svg>
                <span className="font-semibold">Превью документа</span>
                <span className="ml-auto text-sm opacity-75">Microsoft Word</span>
              </div>
              
              {/* Содержимое документа (заглушка) */}
              <div className="p-8 bg-white min-h-[400px]">
                <div className="max-w-3xl mx-auto space-y-4">
                  {/* Имитация текста документа */}
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      ДОКУМЕНТ
                    </h3>
                    <div className="w-24 h-1 bg-gray-300 mx-auto"></div>
                  </div>
                  
                  <div className="space-y-4 text-gray-700">
                    <p className="text-justify">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                      Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                      Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
                    </p>
                    <p className="text-justify">
                      Duis aute irure dolor in reprehenderit in voluptate velit esse 
                      cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat 
                      cupidatat non proident, sunt in culpa qui officia deserunt mollit 
                      anim id est laborum.
                    </p>
                    
                    {/* Имитация таблицы или структурированных данных */}
                    <div className="border border-gray-300 rounded p-4 mt-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="font-semibold text-gray-900 mb-1">Поле 1:</p>
                          <p className="text-gray-600">Значение 1</p>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 mb-1">Поле 2:</p>
                          <p className="text-gray-600">Значение 2</p>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-justify mt-6">
                      Sed ut perspiciatis unde omnis iste natus error sit voluptatem 
                      accusantium doloremque laudantium, totam rem aperiam.
                    </p>
                  </div>
                  
                  {/* Подпись */}
                  <div className="mt-12 pt-8 border-t border-gray-300">
                    <div className="flex justify-between">
                      <div>
                        <p className="text-gray-600 mb-2">Подпись:</p>
                        <div className="w-48 h-12 border border-gray-300 rounded"></div>
                      </div>
                      <div>
                        <p className="text-gray-600 mb-2">Дата:</p>
                        <div className="w-32 h-12 border border-gray-300 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Футер документа */}
              <div className="bg-gray-100 px-4 py-2 border-t border-gray-300 flex items-center justify-between text-sm text-gray-600">
                <span>Страница 1 из 1</span>
                <span>100%</span>
              </div>
            </div>
            
            <div className="text-center text-sm text-gray-500 mt-4">
              Это превью документа. Финальный документ будет сгенерирован после подтверждения.
            </div>
          </div>
        )

      case 'final':
        return (
          <div className="text-center py-8">
            <p className="text-lg font-semibold text-gray-900 mb-2">
              Готово к генерации документа
            </p>
            <p className="text-gray-600">
              Все данные заполнены и проверены
            </p>
          </div>
        )

      default:
        return (
          <div className="text-gray-600">
            Тип шага "{step.type}" не поддерживается
          </div>
        )
    }
  }

  return (
    <Card hover={false}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {step.title || step.label || step.id}
        </h2>
        {step.item_label && (
          <p className="text-sm text-gray-600">
            {step.item_label}
          </p>
        )}
      </div>
      {renderStepContent()}
    </Card>
  )
}

export default WizardStepRenderer

