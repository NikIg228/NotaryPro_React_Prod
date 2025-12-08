import { StepDefinition } from '../types/WizardTypes'
import { validateStep } from './validateStep'

export const getStepIndex = (steps: StepDefinition[], stepId: string): number => {
  return steps.findIndex((step) => step.id === stepId)
}

export const getNextStep = (step: StepDefinition, formData: any): string | null => {
  if (!step.next) {
    return null
  }

  // Если next - строка
  if (typeof step.next === 'string') {
    return step.next
  }

  // Если next - массив строк
  if (Array.isArray(step.next)) {
    return step.next[0] || null
  }

  // Если next - объект с условиями
  if (typeof step.next === 'object') {
    // Для radio и checkbox-group нужно найти выбранное значение
    if (step.type === 'radio' || step.type === 'checkbox-group') {
      // Ищем значение в formData по ключам шага
      const stepKey = step.id
      const selectedValue = formData[stepKey]

      // Обработка null и пустых строк для radio полей
      if (selectedValue !== undefined && selectedValue !== null && selectedValue !== '') {
        const nextStepId = step.next[String(selectedValue)]
        if (nextStepId) {
          return nextStepId
        }
      }
    }
  }

  return null
}

/**
 * Получает список ошибок валидации для шага
 */
export const getStepErrors = (
  step: StepDefinition,
  formData: any,
  errors: any
): Array<{ field: string; message: string }> => {
  const validationResult = validateStep(step, formData, errors)
  return validationResult.errors
}

// Вспомогательные функции перенесены в validation.ts

