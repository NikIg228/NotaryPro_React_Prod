import React, { useState } from 'react'
import Card from './Card'

interface Step {
  id: string
  type: string
  title?: string
  label?: string
  fields?: any[]
  options?: any[]
  next?: string | { [key: string]: string }
  [key: string]: any
}

interface DocumentStepsProps {
  steps: Step[]
}

const DocumentSteps: React.FC<DocumentStepsProps> = ({ steps }) => {
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set())

  const toggleStep = (stepId: string) => {
    const newExpanded = new Set(expandedSteps)
    if (newExpanded.has(stepId)) {
      newExpanded.delete(stepId)
    } else {
      newExpanded.add(stepId)
    }
    setExpandedSteps(newExpanded)
  }

  const getStepTypeLabel = (type: string): string => {
    const typeLabels: { [key: string]: string } = {
      'form': 'Форма',
      'radio': 'Выбор',
      'checkbox-group': 'Множественный выбор',
      'array': 'Массив',
      'number': 'Число',
      'input-mode': 'Режим ввода',
      'validation': 'Валидация',
      'final': 'Завершение'
    }
    return typeLabels[type] || type
  }

  const renderStepContent = (step: Step) => {
    if (!expandedSteps.has(step.id)) {
      return null
    }

    return (
      <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
        {step.fields && step.fields.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Поля:</h4>
            <ul className="space-y-1">
              {step.fields.map((field: any, idx: number) => (
                <li key={idx} className="text-sm text-gray-600">
                  <span className="font-mono text-xs text-gray-500">{field.name}</span>
                  {' - '}
                  <span>{field.label}</span>
                  {field.type && (
                    <span className="ml-2 text-xs text-gray-400">({field.type})</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {step.options && step.options.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Варианты:</h4>
            <ul className="space-y-1">
              {step.options.map((option: any, idx: number) => (
                <li key={idx} className="text-sm text-gray-600">
                  <span className="font-mono text-xs text-gray-500">{option.value}</span>
                  {' - '}
                  <span>{option.label}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {step.manual_fields && step.manual_fields.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Ручные поля:</h4>
            <ul className="space-y-1">
              {step.manual_fields.map((field: any, idx: number) => (
                <li key={idx} className="text-sm text-gray-600">
                  <span className="font-mono text-xs text-gray-500">{field.name}</span>
                  {' - '}
                  <span>{field.label}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {step.next && (
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Следующий шаг:</h4>
            <p className="text-sm text-gray-600 font-mono">
              {typeof step.next === 'string' ? step.next : JSON.stringify(step.next, null, 2)}
            </p>
          </div>
        )}

        {step.validation && (
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Валидация:</h4>
            <p className="text-sm text-gray-600">
              {JSON.stringify(step.validation, null, 2)}
            </p>
          </div>
        )}

        {step.rules && step.rules.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Правила:</h4>
            <ul className="space-y-1">
              {step.rules.map((rule: string, idx: number) => (
                <li key={idx} className="text-sm text-gray-600">
                  {rule}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    )
  }

  return (
    <Card hover={false}>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Структура документа
      </h2>
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
          >
            <div
              className="flex items-start justify-between cursor-pointer"
              onClick={() => toggleStep(step.id)}
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    Шаг {index + 1}
                  </span>
                  <span className="text-xs font-medium text-gray-500 px-2 py-1 bg-gray-50 rounded">
                    {getStepTypeLabel(step.type)}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {step.title || step.label || step.id}
                </h3>
                {step.item_label && (
                  <p className="text-sm text-gray-600 mt-1">
                    Элемент: {step.item_label}
                  </p>
                )}
              </div>
              <button className="text-gray-400 hover:text-gray-600 ml-4">
                {expandedSteps.has(step.id) ? '−' : '+'}
              </button>
            </div>
            {renderStepContent(step)}
          </div>
        ))}
      </div>
    </Card>
  )
}

export default DocumentSteps

