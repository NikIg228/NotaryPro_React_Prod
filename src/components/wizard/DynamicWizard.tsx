import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { DocumentSchema, WizardFormData } from '../../types/WizardTypes'
import { resolveNextStep, shouldShowStep } from '../../utils/resolveNextStep'
// import { validateStep } from '../../utils/validateStep' // ВАЛИДАЦИЯ ВРЕМЕННО ОТКЛЮЧЕНА
import WizardStepRenderer from './WizardStepRenderer'
import WizardErrors from './WizardErrors'
import Button from '../Button'

interface DynamicWizardProps {
  schema: DocumentSchema
  onSubmit: (data: WizardFormData) => void
  onCancel?: () => void
}

const DynamicWizard: React.FC<DynamicWizardProps> = ({ schema, onSubmit, onCancel }) => {
  const methods = useForm<WizardFormData>({
    mode: 'onChange',
    defaultValues: {}
  })

  const [currentStepId, setCurrentStepId] = useState<string>(schema.parsed.steps[0].id)
  const [stepHistory, setStepHistory] = useState<string[]>([schema.parsed.steps[0].id])
  const [formData, setFormData] = useState<WizardFormData>({})
  const [stepErrors, setStepErrors] = useState<Array<{ field: string; message: string }>>([])
  const errorsRef = useRef<HTMLDivElement>(null)

  // Получаем текущий шаг
  const currentStep = useMemo(() => {
    return schema.parsed.steps.find(step => step.id === currentStepId)
  }, [schema.parsed.steps, currentStepId])

  const currentStepIndex = useMemo(() => {
    return schema.parsed.steps.findIndex(step => step.id === currentStepId)
  }, [schema.parsed.steps, currentStepId])

  const progress = useMemo(() => {
    return ((currentStepIndex + 1) / schema.parsed.steps.length) * 100
  }, [currentStepIndex, schema.parsed.steps.length])

  // Обновление ошибок при изменении данных формы
  // ВАЛИДАЦИЯ ВРЕМЕННО ОТКЛЮЧЕНА
  // useEffect(() => {
  //   const subscription = methods.watch((value) => {
  //     if (currentStep) {
  //       const errors = methods.formState.errors
  //       const validationResult = validateStep(currentStep, { ...formData, ...value }, errors)
  //       setStepErrors(validationResult.errors)
  //     }
  //   })
  //   return () => subscription.unsubscribe()
  // }, [methods, currentStep, formData])

  // Прокрутка к ошибкам
  useEffect(() => {
    if (stepErrors.length > 0 && errorsRef.current) {
      errorsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [stepErrors])

  const handleNext = useCallback(async () => {
    if (!currentStep) return

    const values = methods.getValues()
    
    // ВАЛИДАЦИЯ ВРЕМЕННО ОТКЛЮЧЕНА для просмотра структуры шагов
    
    // Очищаем ошибки
    setStepErrors([])

    // Сохраняем данные текущего шага
    setFormData((prev) => ({ ...prev, ...values }))

    // Определяем следующий шаг
    const nextStepId = resolveNextStep(currentStep, { ...formData, ...values })
    
    if (!nextStepId) {
      // Если следующего шага нет, пытаемся найти следующий шаг по индексу
      const currentIndex = schema.parsed.steps.findIndex(step => step.id === currentStepId)
      if (currentIndex < schema.parsed.steps.length - 1) {
        const nextStep = schema.parsed.steps[currentIndex + 1]
        setCurrentStepId(nextStep.id)
        setStepHistory((prev) => [...prev, nextStep.id])
        return
      }
      // Если это действительно последний шаг, остаёмся на нём
      return
    }

    // Проверяем, существует ли следующий шаг
    const nextStep = schema.parsed.steps.find(step => step.id === nextStepId)
    if (nextStep) {
      // Переходим на следующий шаг по логике
      setCurrentStepId(nextStepId)
      setStepHistory((prev) => [...prev, nextStepId])
      return
    }
    
    // Если шаг не найден, переходим на следующий по порядку
    const currentIndex = schema.parsed.steps.findIndex(step => step.id === currentStepId)
    if (currentIndex < schema.parsed.steps.length - 1) {
      const fallbackNextStep = schema.parsed.steps[currentIndex + 1]
      setCurrentStepId(fallbackNextStep.id)
      setStepHistory((prev) => [...prev, fallbackNextStep.id])
    }
  }, [currentStep, methods, schema.parsed.steps, formData, onSubmit])

  const handleBack = useCallback(() => {
    if (stepHistory.length > 1) {
      const newHistory = [...stepHistory]
      newHistory.pop()
      const previousStepId = newHistory[newHistory.length - 1]
      setCurrentStepId(previousStepId)
      setStepHistory(newHistory)
    } else if (onCancel) {
      onCancel()
    }
  }, [stepHistory, onCancel])

  // handleSubmit временно не используется - кнопка "Далее" всегда листает шаги
  // const handleSubmit = useCallback(() => {
  //   const values = methods.getValues()
  //   const finalData = { ...formData, ...values }
  //   onSubmit(finalData)
  // }, [methods, formData, onSubmit])

  if (!currentStep) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Шаг не найден</p>
        </div>
      </div>
    )
  }

  // Проверяем, должен ли шаг быть показан
  const isStepVisible = shouldShowStep(currentStep, { ...formData, ...methods.getValues() })
  if (!isStepVisible) {
    // Если шаг скрыт, переходим к следующему
    handleNext()
    return null
  }

  // Всегда показываем кнопку "Далее", чтобы можно было листать шаги
  // const isLastStep = false // currentStepIndex === schema.parsed.steps.length - 1 || currentStep.type === 'final'

  return (
    <FormProvider {...methods}>
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-6 py-12">
          {/* Прогресс-бар */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-medium text-gray-600">
                Шаг {currentStepIndex + 1} из {schema.parsed.steps.length}
              </h2>
              <span className="text-sm font-medium text-gray-600">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-black h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Заголовок документа */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {schema.title}
            </h1>
          </div>

          {/* Отображение ошибок */}
          {stepErrors.length > 0 && (
            <div ref={errorsRef} className="mb-6">
              <WizardErrors
                errors={stepErrors}
                onErrorClick={(fieldName) => {
                  const element = document.querySelector(`[name="${fieldName}"]`)
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' })
                    ;(element as HTMLElement).focus()
                  }
                }}
              />
            </div>
          )}

          {/* Текущий шаг */}
          <div className="mb-8">
            <WizardStepRenderer
              step={currentStep}
              formData={formData}
              onDataChange={(data) => {
                Object.keys(data).forEach((key) => {
                  methods.setValue(key as any, data[key])
                })
              }}
            />
          </div>

          {/* Навигация */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <div>
              {stepHistory.length > 1 ? (
                <Button variant="secondary" onClick={handleBack}>
                  ← Назад
                </Button>
              ) : onCancel ? (
                <Button variant="secondary" onClick={onCancel}>
                  Отмена
                </Button>
              ) : null}
            </div>
            <div>
              <Button onClick={handleNext}>
                Далее →
              </Button>
            </div>
          </div>
        </div>
      </div>
    </FormProvider>
  )
}

export default DynamicWizard
