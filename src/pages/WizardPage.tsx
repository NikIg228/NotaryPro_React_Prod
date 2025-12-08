import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import DynamicWizard from '../components/wizard/DynamicWizard'
import { getDocumentById } from '../utils/dataUtils'
import { DocumentSchema } from '../types/WizardTypes'

const WizardPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const document = id ? getDocumentById(parseInt(id)) : undefined

  const handleSubmit = (data: any) => {
    console.log('Form data submitted:', data)
    // Здесь можно отправить данные на сервер для генерации docx
    // alert('Данные успешно отправлены!') // Уведомление отключено
    navigate('/')
  }

  const handleCancel = () => {
    if (window.confirm('Вы уверены, что хотите отменить заполнение формы?')) {
      navigate('/')
    }
  }

  if (!document) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Документ не найден</p>
        </div>
      </div>
    )
  }

  // Преобразуем документ в DocumentSchema
  const documentSchema: DocumentSchema = {
    id: document.id,
    code: document.code,
    title: document.title,
    category: document.category,
    dev_notes: document.dev_notes,
    rules_for_cursor: document.rules_for_cursor,
    parsed: document.parsed
  }

  return (
    <DynamicWizard
      schema={documentSchema}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  )
}

export default WizardPage

