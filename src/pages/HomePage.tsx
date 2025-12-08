import React, { useState, useMemo } from 'react'
import DocumentCard from '../components/DocumentCard'
import Search from '../components/Search'
import { getAllDocuments, searchDocuments } from '../utils/dataUtils'

const HomePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')

  // Получаем все документы
  const allDocuments = useMemo(() => {
    return getAllDocuments()
  }, [])

  // Фильтруем документы
  const filteredDocuments = useMemo(() => {
    let docs = allDocuments

    // Поиск
    if (searchQuery) {
      docs = searchDocuments(searchQuery)
    }

    return docs
  }, [allDocuments, searchQuery])

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Документы
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

export default HomePage

