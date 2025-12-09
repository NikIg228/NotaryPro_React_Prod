import React, { useState, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Search from '../components/Search'
import Button from '../components/Button'
import { getDocumentsByMainCategory, searchDocuments } from '../utils/dataUtils'

const CategoryPage: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const mainCategory = location.state?.mainCategory || ''
  
  const [searchQuery, setSearchQuery] = useState('')

  // Получаем все документы категории
  const allDocuments = useMemo(() => {
    if (!mainCategory) {
      // Если категория не передана, перенаправляем на главную
      navigate('/')
      return []
    }
    return getDocumentsByMainCategory(mainCategory)
  }, [mainCategory, navigate])

  // Фильтруем и сортируем документы по алфавиту
  const filteredDocuments = useMemo(() => {
    let docs = allDocuments

    // Поиск
    if (searchQuery) {
      docs = searchDocuments(searchQuery).filter(doc => 
        allDocuments.some(d => d.id === doc.id)
      )
    }

    // Сортировка по алфавиту по названию
    return docs.sort((a, b) => a.title.localeCompare(b.title, 'ru'))
  }, [allDocuments, searchQuery])

  const handleCreateClick = (docId: number) => {
    navigate(`/document/${docId}/wizard`)
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <button
          onClick={() => navigate('/')}
          className="mb-6 text-gray-600 hover:text-gray-900 transition-colors"
        >
          ← Назад к категориям
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {mainCategory || 'Категория документов'}
          </h1>
          <p className="text-gray-600">
            {filteredDocuments.length} {filteredDocuments.length === 1 ? 'документ найден' : 'документов найдено'}
          </p>
        </div>

        <div className="mb-8">
          <Search
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Поиск документов..."
            className="max-w-md"
          />
        </div>

        {filteredDocuments.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              Документы не найдены
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredDocuments.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <h3 className="text-lg font-semibold text-gray-900 flex-1">
                  {doc.title}
                </h3>
                <Button
                  onClick={() => handleCreateClick(doc.id)}
                  className="ml-4"
                >
                  Создать
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default CategoryPage

