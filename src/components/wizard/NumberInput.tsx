import React from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { StepDefinition } from '../../types/WizardTypes'
import Input from '../Input'
import { formatErrorForUser, getNestedError } from '../../utils/validation'

interface NumberInputProps {
  step: StepDefinition
  value: number | null
  onChange: (value: number) => void
}

const NumberInput: React.FC<NumberInputProps> = ({ step }) => {
  const { control, formState: { errors } } = useFormContext()
  const fieldError = getNestedError(errors, step.id)

  const validationRules = {
    // ВАЛИДАЦИЯ ВРЕМЕННО ОТКЛЮЧЕНА
    required: false,
    // required: step.label ? `Поле '${step.label}' обязательно для заполнения` : false,
    // min: step.min !== undefined ? { value: step.min, message: `Минимум: ${step.min}` } : undefined,
    // max: step.max !== undefined ? { value: step.max, message: `Максимум: ${step.max}` } : undefined,
  }

  return (
    <Controller
      name={step.id}
      control={control}
      rules={validationRules}
      render={({ field: formField }) => (
        <Input
          {...formField}
          type="number"
          label={step.label || step.title || step.id}
          min={step.min}
          max={step.max}
          error={fieldError ? formatErrorForUser(fieldError, step.label) : undefined}
        />
      )}
    />
  )
}

export default NumberInput
