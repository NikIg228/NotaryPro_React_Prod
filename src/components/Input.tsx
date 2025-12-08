import React, { useState, useRef, useEffect } from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  required?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ 
  label, 
  error, 
  required = false,
  type,
  value,
  onChange,
  className = '',
  ...props 
}, ref) => {
  const [displayValue, setDisplayValue] = useState<string>('')
  const inputRef = useRef<HTMLInputElement>(null)

  // Для полей типа date используем текстовый ввод с маской
  const isDateField = type === 'date'

  useEffect(() => {
    if (isDateField && value) {
      // Преобразуем значение даты в формат ДД.ММ.ГГГГ
      if (typeof value === 'string') {
        // Если значение уже в формате YYYY-MM-DD, преобразуем
        if (value.match(/^\d{4}-\d{2}-\d{2}$/)) {
          const [year, month, day] = value.split('-')
          setDisplayValue(`${day}.${month}.${year}`)
        } else {
          setDisplayValue(value)
        }
      } else {
        setDisplayValue('')
      }
    } else if (!isDateField) {
      setDisplayValue(value as string || '')
    }
  }, [value, isDateField])

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value.replace(/\D/g, '') // Удаляем все нецифровые символы
    
    // Ограничиваем длину до 8 цифр (ДДММГГГГ)
    if (input.length > 8) {
      input = input.slice(0, 8)
    }

    // Форматируем как ДД.ММ.ГГГГ
    let formatted = ''
    if (input.length > 0) {
      formatted = input.slice(0, 2)
      if (input.length > 2) {
        formatted += '.' + input.slice(2, 4)
        if (input.length > 4) {
          formatted += '.' + input.slice(4, 8)
        }
      }
    }

    setDisplayValue(formatted)

    // Преобразуем в формат YYYY-MM-DD для формы
    if (input.length === 8) {
      const day = input.slice(0, 2)
      const month = input.slice(2, 4)
      const year = input.slice(4, 8)
      
      // Проверяем валидность даты
      const dayNum = parseInt(day, 10)
      const monthNum = parseInt(month, 10)
      const yearNum = parseInt(year, 10)
      
      if (dayNum >= 1 && dayNum <= 31 && monthNum >= 1 && monthNum <= 12 && yearNum >= 1900 && yearNum <= 2100) {
        const dateValue = `${year}-${month}-${day}`
        if (onChange) {
          const syntheticEvent = {
            ...e,
            target: { ...e.target, value: dateValue }
          } as React.ChangeEvent<HTMLInputElement>
          onChange(syntheticEvent)
        }
      }
    } else if (onChange) {
      // Если дата неполная, очищаем значение
      const syntheticEvent = {
        ...e,
        target: { ...e.target, value: '' }
      } as React.ChangeEvent<HTMLInputElement>
      onChange(syntheticEvent)
    }
  }

  const handleDateKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Разрешаем только цифры, Backspace, Delete, стрелки и Tab
    if (!/[0-9]/.test(e.key) && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) {
      e.preventDefault()
    }
  }

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          {label} {required && <span className="text-red-600">*</span>}
        </label>
      )}
      <input
        ref={ref || inputRef}
        type={isDateField ? 'text' : type}
        value={isDateField ? displayValue : (value || '')}
        onChange={isDateField ? handleDateChange : onChange}
        onKeyDown={isDateField ? handleDateKeyDown : undefined}
        placeholder={isDateField ? 'ДД.ММ.ГГГГ' : props.placeholder}
        maxLength={isDateField ? 10 : undefined}
        className={`
          w-full px-4 py-2 border rounded-lg
          focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent
          text-gray-900 placeholder-gray-400
          ${error ? 'border-red-300' : 'border-gray-200'}
          ${className}
        `}
        {...(isDateField ? {} : props)}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input

