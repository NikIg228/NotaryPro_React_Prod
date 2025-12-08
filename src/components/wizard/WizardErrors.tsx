import React from 'react'
import Card from '../Card'

interface WizardErrorsProps {
  errors: Array<{ field: string; message: string }>
  onErrorClick?: (fieldName: string) => void
}

const WizardErrors: React.FC<WizardErrorsProps> = ({ errors, onErrorClick }) => {
  if (errors.length === 0) {
    return null
  }

  return (
    <Card hover={false} className="border-red-200 bg-red-50">
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-red-900 mb-2">
          Обнаружены ошибки:
        </h3>
        {errors.map((error, index) => (
          <div
            key={index}
            className="text-sm text-red-700 cursor-pointer hover:text-red-900"
            onClick={() => onErrorClick?.(error.field)}
          >
            • {error.message}
          </div>
        ))}
      </div>
    </Card>
  )
}

export default WizardErrors

