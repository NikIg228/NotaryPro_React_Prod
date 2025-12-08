import React from 'react'
import { useFormContext, Controller } from 'react-hook-form'
import { StepDefinition, WizardFormData } from '../../types/WizardTypes'
import Card from '../Card'
import RadioGroup from './RadioGroup'
import CheckboxGroup from './CheckboxGroup'
import WizardArray from './WizardArray'
import FormFieldRenderer from './FormFieldRenderer'
import NumberInput from './NumberInput'
import InputModeSelector from './InputModeSelector'
import Input from '../Input'
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
  const { watch, control } = useFormContext()
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

            {/* Специальный случай: выбор срока (дни / месяцы) с полем ввода под выбранным форматом */}
            {step.id === 'term' && (
              <div className="mt-2">
                {selectedValue === 'days' && (
                  <Controller
                    name="term.days"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="number"
                        label="Количество дней"
                        min={1}
                        max={31}
                        onChange={(e) => {
                          let v = parseInt(e.target.value || '0', 10)
                          if (Number.isNaN(v)) v = 1
                          if (v < 1) v = 1
                          if (v > 31) v = 31
                          field.onChange(v)
                        }}
                      />
                    )}
                  />
                )}
                {selectedValue === 'months' && (
                  <Controller
                    name="term.months"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="number"
                        label="Количество месяцев"
                        min={1}
                        max={36}
                        onChange={(e) => {
                          let v = parseInt(e.target.value || '0', 10)
                          if (Number.isNaN(v)) v = 1
                          if (v < 1) v = 1
                          if (v > 36) v = 36
                          field.onChange(v)
                        }}
                      />
                    )}
                  />
                )}
              </div>
            )}
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
                selectedMode="manual"
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
          <div className="text-center py-8">
            <p className="text-gray-600">
              Проверка данных...
            </p>
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

