import React, { useState, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import DocumentCard from '../components/DocumentCard'
import Search from '../components/Search'
import Filters from '../components/Filters'
import { getDocumentsByCategory, searchDocuments } from '../utils/dataUtils'

const CategoryPage: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const categoryPath = location.state?.categoryPath || ''
  
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])

  // Получаем все документы категории
  const allDocuments = useMemo(() => {
    if (!categoryPath) return []
    return getDocumentsByCategory(categoryPath)
  }, [categoryPath])

  // Фильтруем документы
  const filteredDocuments = useMemo(() => {
    let docs = allDocuments

    // Поиск
    if (searchQuery) {
      docs = searchDocuments(searchQuery).filter(doc => 
        allDocuments.some(d => d.id === doc.id)
      )
    }

    // Фильтры (можно добавить логику фильтрации по типам документов)
    if (selectedFilters.length > 0) {
      // Пока фильтры не реализованы, возвращаем все документы
    }

    return docs
  }, [allDocuments, searchQuery, selectedFilters])

  // Получаем уникальные подкатегории для фильтров
  const filterOptions = useMemo(() => {
    const subcategories = new Set<string>()
    allDocuments.forEach(doc => {
      const parts = doc.category.split(' / ')
      if (parts.length > 2) {
        subcategories.add(parts[2])
      }
    })
    return Array.from(subcategories).map(sub => ({
      value: sub,
      label: sub
    }))
  }, [allDocuments])

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
            {categoryPath || 'Категория документов'}
          </h1>
          <p className="text-gray-600">
            {filteredDocuments.length} {filteredDocuments.length === 1 ? 'документ найден' : 'документов найдено'}
          </p>
        </div>

        <div className="mb-8 space-y-6">
          <Search
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Поиск документов..."
            className="max-w-md"
          />
          
          {filterOptions.length > 0 && (
            <Filters
              options={filterOptions}
              selected={selectedFilters}
              onChange={setSelectedFilters}
            />
          )}
        </div>

        {filteredDocuments.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              Документы не найдены
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.map((doc) => (
              <DocumentCard
                key={doc.id}
                id={doc.id}
                code={doc.code}
                title={doc.title}
                category={doc.category}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default CategoryPage

