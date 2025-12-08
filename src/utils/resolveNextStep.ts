import { StepDefinition, WizardFormData } from '../types/WizardTypes'

/**
 * Определяет следующий шаг на основе текущего шага и данных формы
 */
export const resolveNextStep = (
  step: StepDefinition,
  formData: WizardFormData
): string | null => {
  if (!step.next) {
    return null
  }

  // Если next - строка, возвращаем её
  if (typeof step.next === 'string') {
    return step.next
  }

  // Если next - массив строк, возвращаем первый
  if (Array.isArray(step.next)) {
    return step.next[0] || null
  }

  // Если next - объект с условиями
  if (typeof step.next === 'object') {
    // Для radio шагов
    if (step.type === 'radio') {
      const selectedValue = formData[step.id]
      if (selectedValue !== undefined && selectedValue !== null && selectedValue !== '') {
        const nextStepId = step.next[String(selectedValue)]
        if (nextStepId) {
          return nextStepId
        }
      }
    }

    // Для checkbox-group (если есть логика выбора)
    if (step.type === 'checkbox-group') {
      // Можно добавить логику для checkbox-group если нужно
    }
  }

  return null
}

/**
 * Проверяет, должен ли шаг быть показан на основе условий
 */
export const shouldShowStep = (
  step: StepDefinition,
  formData: WizardFormData
): boolean => {
  // Если у шага нет условий показа, он всегда видим
  if (!step.fields) {
    return true
  }

  // Проверяем условия для каждого поля
  for (const field of step.fields) {
    if (field.show_if) {
      const condition = field.show_if
      // Простая проверка равенства
      if (condition.includes('==')) {
        const [fieldPath, expectedValue] = condition.split('==').map(s => s.trim())
        const actualValue = getNestedValue(formData, fieldPath)
        const cleanExpected = expectedValue.replace(/['"]/g, '')
        
        if (String(actualValue) !== cleanExpected) {
          return false
        }
      }
    }
  }

  return true
}

/**
 * Получает вложенное значение из объекта по пути
 */
const getNestedValue = (obj: any, path: string): any => {
  const keys = path.split('.')
  let value = obj

  for (const key of keys) {
    if (value === undefined || value === null) {
      return undefined
    }

    const arrayMatch = key.match(/^(\w+)\[(\d+)\]$/)
    if (arrayMatch) {
      const arrayName = arrayMatch[1]
      const index = parseInt(arrayMatch[2])
      value = value[arrayName]?.[index]
    } else {
      value = value[key]
    }
  }

  return value
}

