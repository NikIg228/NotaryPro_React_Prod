import { FieldDefinition } from '../types/WizardTypes'

/**
 * Форматирует сообщение об ошибке для пользователя на русском языке
 */
export const formatErrorForUser = (
  error: any,
  fieldLabel?: string
): string => {
  if (typeof error === 'string') {
    return error
  }

  if (error?.message) {
    return error.message
  }

  if (error?.type === 'required') {
    return fieldLabel
      ? `Поле '${fieldLabel}' обязательно для заполнения`
      : 'Это поле обязательно для заполнения'
  }

  if (error?.type === 'min') {
    return `Минимум ${error.min} элемент(ов) требуется`
  }

  if (error?.type === 'max') {
    return `Максимум ${error.max} элемент(ов) разрешено`
  }

  if (error?.type === 'pattern') {
    return 'Неверный формат данных'
  }

  if (error?.type === 'validate') {
    return error.message || 'Проверка не пройдена'
  }

  return 'Произошла ошибка валидации'
}

/**
 * Создает схему валидации для поля с учетом условной логики
 */
export const createFieldValidation = (
  field: FieldDefinition,
  isConditional: boolean = false
) => {
  const rules: any = {}

  // Если поле условное, делаем его опциональным
  if (isConditional) {
    rules.required = false
  } else if (field.min !== undefined && field.min > 0) {
    // Для file полей required определяется через min
    if (field.type === 'file') {
      rules.required = false // Валидация через validate
    } else {
      rules.required = field.label
        ? `Поле '${field.label}' обязательно для заполнения`
        : 'Это поле обязательно для заполнения'
    }
  }

  // Валидация для числовых полей
  if (field.type === 'number') {
    if (field.min !== undefined) {
      rules.min = {
        value: field.min,
        message: `Минимальное значение: ${field.min}`
      }
    }
    if (field.max !== undefined) {
      rules.max = {
        value: field.max,
        message: `Максимальное значение: ${field.max}`
      }
    }
  }

  // Валидация для текстовых полей
  if (field.type === 'text') {
    // Специальная валидация для ИИН (12 цифр)
    if (field.name.includes('iin') || field.name.includes('IIN')) {
      rules.pattern = {
        value: /^\d{12}$/,
        message: 'ИИН должен содержать 12 цифр'
      }
    }
  }

  // Валидация для дат
  if (field.type === 'date') {
    rules.validate = (value: string) => {
      if (!value) return true // required обрабатывается отдельно
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/
      if (!dateRegex.test(value)) {
        return 'Дата должна быть в формате ДД.ММ.ГГГГ'
      }
      return true
    }
  }

  // Валидация для upload полей (file type)
  if (field.type === 'file') {
    rules.validate = (value: File[] | FileList | null) => {
      if (!value) {
        // Проверяем required через min
        if (field.min !== undefined && field.min > 0) {
          return 'Необходимо загрузить файлы'
        }
        return true
      }
      const files = Array.isArray(value) ? value : Array.from(value || [])
      if (files.length === 0) {
        if (field.min !== undefined && field.min > 0) {
          return 'Необходимо загрузить файлы'
        }
        return true
      }
      
      // Проверка количества файлов для upload полей
      if (field.min !== undefined && files.length < field.min) {
        return `Необходимо загрузить минимум ${field.min} файл(ов)`
      }
      if (field.max !== undefined && files.length > field.max) {
        return `Можно загрузить максимум ${field.max} файл(ов)`
      }
      
      return true
    }
  }

  return rules
}

/**
 * Проверяет, должно ли поле быть видимым на основе условий
 */
export const shouldShowField = (
  field: FieldDefinition,
  formData: any
): boolean => {
  // Если у поля нет условия показа, оно всегда видимо
  if (!field.show_if) {
    return true
  }

  // Парсим условие (например, "parentField == 'value'")
  const condition = field.show_if
  
  // Простая проверка равенства
  if (condition.includes('==')) {
    const [fieldPath, expectedValue] = condition.split('==').map((s: string) => s.trim())
    const actualValue = getNestedValue(formData, fieldPath)
    return String(actualValue) === expectedValue.replace(/['"]/g, '')
  }

  // Проверка на true/false
  if (condition.includes('== true') || condition.includes('== false')) {
    const fieldPath = condition.split('==')[0].trim()
    const expectedValue = condition.includes('true')
    const actualValue = getNestedValue(formData, fieldPath)
    return Boolean(actualValue) === expectedValue
  }

  return true
}

/**
 * Получает вложенное значение из объекта по пути
 */
export const getNestedValue = (obj: any, path: string): any => {
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

/**
 * Валидирует шаг с учетом условных полей
 * @deprecated Используйте validateStep из validateStep.ts
 */
export const validateStepWithConditionals = (
  step: any,
  formData: any,
  errors: any
): { isValid: boolean; errors: Array<{ field: string; message: string }> } => {
  const stepErrors: Array<{ field: string; message: string }> = []

  // Валидация полей формы
  if (step.fields) {
    for (const field of step.fields) {
      // Пропускаем условные поля, если условие не выполнено
      if (!shouldShowField(field, formData)) {
        continue
      }

      if (field.required) {
        const fieldName = field.name.replace('[]', '[0]')
        const value = getNestedValue(formData, fieldName)

        if (value === undefined || value === null || value === '') {
          stepErrors.push({
            field: field.name,
            message: formatErrorForUser(
              { type: 'required' },
              field.label
            )
          })
        }

        // Для upload полей проверяем наличие файлов
        if (field.type === 'upload') {
          if (!value || (Array.isArray(value) && value.length === 0)) {
            stepErrors.push({
              field: field.name,
              message: 'Необходимо загрузить файлы'
            })
          }
        }
      }
    }
  }

  // Валидация для radio полей
  if (step.type === 'radio') {
    const stepValue = formData[step.id]
    if (stepValue === null || stepValue === undefined || stepValue === '') {
      stepErrors.push({
        field: step.id,
        message: `Поле '${step.title}' обязательно для заполнения. Пожалуйста, выберите один из вариантов.`
      })
    }
  }

  // Валидация для checkbox-group
  if (step.type === 'checkbox-group' && step.validation) {
    const stepValue = formData[step.id]
    if (step.validation.min !== undefined) {
      const selectedCount = Array.isArray(stepValue) ? stepValue.length : 0
      if (selectedCount < step.validation.min) {
        stepErrors.push({
          field: step.id,
          message: `Минимум ${step.validation.min} элемент(ов) требуется`
        })
      }
    }
  }

  // Проверка ошибок react-hook-form
  if (errors && Object.keys(errors).length > 0) {
    const stepFieldNames = step.fields?.map((f: FieldDefinition) => f.name) || []
    stepFieldNames.forEach((fieldName: string) => {
      const normalizedName = fieldName.replace('[]', '[0]')
      const error = getNestedError(errors, normalizedName)
      if (error) {
        const field = step.fields?.find((f: FieldDefinition) => f.name === fieldName)
        stepErrors.push({
          field: fieldName,
          message: formatErrorForUser(error, field?.label)
        })
      }
    })
  }

  return {
    isValid: stepErrors.length === 0,
    errors: stepErrors
  }
}

/**
 * Получает вложенную ошибку из объекта ошибок по пути
 */
export const getNestedError = (errors: any, path: string): any => {
  const keys = path.split('.')
  let current = errors

  for (const key of keys) {
    if (current === undefined || current === null) {
      return undefined
    }

    const arrayMatch = key.match(/^(\w+)\[(\d+)\]$/)
    if (arrayMatch) {
      const arrayName = arrayMatch[1]
      const index = parseInt(arrayMatch[2])
      current = current[arrayName]?.[index]
    } else {
      current = current[key]
    }
  }

  return current
}

