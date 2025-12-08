import { StepDefinition, WizardFormData } from '../types/WizardTypes'
import { getNestedValue } from './validation'

/**
 * Валидирует шаг согласно правилам из dev_notes и rules_for_cursor
 */
export const validateStep = (
  step: StepDefinition,
  formData: WizardFormData,
  errors?: any
): { isValid: boolean; errors: Array<{ field: string; message: string }> } => {
  const stepErrors: Array<{ field: string; message: string }> = []

  // Валидация для radio шагов
  if (step.type === 'radio') {
    const value = formData[step.id]
    if (value === null || value === undefined || value === '') {
      stepErrors.push({
        field: step.id,
        message: `Поле '${step.title || step.label || step.id}' обязательно для заполнения. Пожалуйста, выберите один из вариантов.`
      })
    }
  }

  // Валидация для checkbox-group
  if (step.type === 'checkbox-group') {
    const value = formData[step.id]
    if (step.validation?.min !== undefined) {
      const selectedCount = Array.isArray(value) ? value.length : 0
      if (selectedCount < step.validation.min) {
        stepErrors.push({
          field: step.id,
          message: `Минимум ${step.validation.min} элемент(ов) требуется`
        })
      }
    }
  }

  // Валидация для number шагов
  if (step.type === 'number') {
    const value = formData[step.id]
    if (value === null || value === undefined || value === '') {
      stepErrors.push({
        field: step.id,
        message: `Поле '${step.label || step.id}' обязательно для заполнения`
      })
    } else {
      const numValue = Number(value)
      if (step.min !== undefined && numValue < step.min) {
        stepErrors.push({
          field: step.id,
          message: `Минимальное значение: ${step.min}`
        })
      }
      if (step.max !== undefined && numValue > step.max) {
        stepErrors.push({
          field: step.id,
          message: `Максимальное значение: ${step.max}`
        })
      }
    }
  }

  // Валидация для array шагов
  if (step.type === 'array') {
    const arrayName = step.fields?.[0]?.name.split('[')[0] || ''
    const arrayValue = formData[arrayName] || []
    
    if (step.min !== undefined && arrayValue.length < step.min) {
      stepErrors.push({
        field: arrayName,
        message: `Минимум ${step.min} элемент(ов) требуется`
      })
    }
    
    if (step.max !== undefined && arrayValue.length > step.max) {
      stepErrors.push({
        field: arrayName,
        message: `Максимум ${step.max} элемент(ов) разрешено`
      })
    }

    // Валидация полей внутри массива
    if (step.fields) {
      arrayValue.forEach((_item: any, index: number) => {
        step.fields?.forEach((field) => {
          if (field.name.includes('[]')) {
            const fieldName = field.name.replace('[]', `[${index}]`)
            const value = getNestedValue({ [arrayName]: arrayValue }, fieldName)
            
            // Проверка обязательных полей (если поле не имеет required флага, проверяем по типу)
            if (field.type === 'file') {
              if (!value || (Array.isArray(value) && value.length === 0)) {
                stepErrors.push({
                  field: fieldName,
                  message: `Необходимо загрузить файлы для ${step.item_label || 'элемента'} ${index + 1}`
                })
              } else if (Array.isArray(value)) {
                // Проверка min/max для файлов
                if (field.min !== undefined && value.length < field.min) {
                  stepErrors.push({
                    field: fieldName,
                    message: `Необходимо загрузить минимум ${field.min} файл(ов)`
                  })
                }
                if (field.max !== undefined && value.length > field.max) {
                  stepErrors.push({
                    field: fieldName,
                    message: `Можно загрузить максимум ${field.max} файл(ов)`
                  })
                }
              }
            }
          }
        })
      })
    }
  }

  // Валидация для form шагов
  if (step.type === 'form' && step.fields) {
    step.fields.forEach((field) => {
      const fieldName = field.name.replace('[]', '[0]')
      const value = getNestedValue(formData, fieldName)

      // Проверка обязательных полей
      if (field.type === 'file') {
        if (!value || (Array.isArray(value) && value.length === 0)) {
          stepErrors.push({
            field: field.name,
            message: `Необходимо загрузить файлы`
          })
        } else if (Array.isArray(value)) {
          if (field.min !== undefined && value.length < field.min) {
            stepErrors.push({
              field: field.name,
              message: `Необходимо загрузить минимум ${field.min} файл(ов)`
            })
          }
          if (field.max !== undefined && value.length > field.max) {
            stepErrors.push({
              field: field.name,
              message: `Можно загрузить максимум ${field.max} файл(ов)`
            })
          }
        }
      }
    })
  }

  // Валидация для input-mode шагов
  if (step.type === 'input-mode' && step.manual_fields) {
    const inputMode = formData[step.input_mode_field || `${step.id}_mode`]
    const count = inputMode || step.min || 1
    
    for (let i = 0; i < count; i++) {
      step.manual_fields.forEach((field) => {
        const fieldName = field.name.replace('[0]', `[${i}]`)
        const value = getNestedValue(formData, fieldName)
        
        if (!value || value === '') {
          stepErrors.push({
            field: fieldName,
            message: `Поле '${field.label}' обязательно для заполнения`
          })
        }
      })
    }
  }

  // Валидация правил из validation шага
  if (step.type === 'validation' && step.rules) {
    step.rules.forEach((rule) => {
      // required: field_name
      if (rule.startsWith('required:')) {
        const fieldPath = rule.split('required:')[1].trim()
        const value = getNestedValue(formData, fieldPath)
        if (value === undefined || value === null || value === '') {
          stepErrors.push({
            field: fieldPath,
            message: `Поле '${fieldPath}' обязательно для заполнения`
          })
        }
      }

      // required_array_min: array_name, count
      if (rule.startsWith('required_array_min:')) {
        const parts = rule.split('required_array_min:')[1].split(',')
        const arrayName = parts[0].trim()
        const minCount = parseInt(parts[1]?.trim() || '1')
        const arrayValue = formData[arrayName] || []
        if (arrayValue.length < minCount) {
          stepErrors.push({
            field: arrayName,
            message: `Минимум ${minCount} элемент(ов) требуется для '${arrayName}'`
          })
        }
      }

      // xor: condition1 || condition2
      if (rule.startsWith('xor:')) {
        const conditions = rule.split('xor:')[1].split('||').map(s => s.trim())
        const satisfiedCount = conditions.filter(condition => {
          const value = getNestedValue(formData, condition)
          return value === true || (Array.isArray(value) && value.length > 0) || value
        }).length
        
        if (satisfiedCount !== 1) {
          stepErrors.push({
            field: conditions.join(' или '),
            message: `Должен быть выбран ровно один из вариантов`
          })
        }
      }

      // field >= value или field <= value
      if (rule.includes('>=') || rule.includes('<=')) {
        const match = rule.match(/(\w+)\s*(>=|<=)\s*(\d+)/)
        if (match) {
          const [, fieldPath, operator, expectedValue] = match
          const actualValue = getNestedValue(formData, fieldPath)
          const numActual = Number(actualValue)
          const numExpected = Number(expectedValue)
          
          if (operator === '>=' && numActual < numExpected) {
            stepErrors.push({
              field: fieldPath,
              message: `Значение должно быть не менее ${expectedValue}`
            })
          } else if (operator === '<=' && numActual > numExpected) {
            stepErrors.push({
              field: fieldPath,
              message: `Значение должно быть не более ${expectedValue}`
            })
          }
        }
      }
    })
  }

  // Проверка ошибок react-hook-form
  if (errors && Object.keys(errors).length > 0) {
    const stepFieldNames = [
      ...(step.fields?.map(f => f.name) || []),
      ...(step.manual_fields?.map(f => f.name) || []),
      step.id
    ]
    
    stepFieldNames.forEach((fieldName) => {
      const normalizedName = fieldName.replace('[]', '[0]')
      const error = getNestedError(errors, normalizedName)
      if (error) {
        const field = [...(step.fields || []), ...(step.manual_fields || [])].find(f => f.name === fieldName)
        stepErrors.push({
          field: fieldName,
          message: error.message || `Ошибка в поле '${field?.label || fieldName}'`
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
 * Получает вложенную ошибку из объекта ошибок
 */
const getNestedError = (errors: any, path: string): any => {
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

