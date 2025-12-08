import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import { getDocumentById } from '../utils/dataUtils'
import DocumentInfo from '../components/DocumentInfo'
import DocumentSteps from '../components/DocumentSteps'

const DocumentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const document = id ? getDocumentById(parseInt(id)) : undefined

  if (!document) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Документ не найден
            </h1>
            <Button onClick={() => navigate('/')} variant="secondary">
              Вернуться на главную
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-gray-600 hover:text-gray-900 transition-colors"
        >
          ← Назад
        </button>

        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 block">
                {document.code}
              </span>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {document.title}
              </h1>
              <p className="text-gray-600 text-lg">
                {document.category}
              </p>
            </div>
            <Button onClick={() => navigate(`/document/${document.id}/wizard`)}>
              Начать заполнение
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <DocumentSteps steps={document.parsed?.steps || []} />
          </div>
          
          <div className="space-y-6">
            <DocumentInfo document={document} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default DocumentPage

