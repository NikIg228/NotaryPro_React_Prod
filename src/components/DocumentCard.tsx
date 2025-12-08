import React from 'react'
import Card from './Card'
import { useNavigate } from 'react-router-dom'

interface DocumentCardProps {
  id: number
  code: string
  title: string
  category: string
}

const DocumentCard: React.FC<DocumentCardProps> = ({ 
  id, 
  code, 
  title, 
  category 
}) => {
  const navigate = useNavigate()

  const handleClick = () => {
    // Переход к wizard форме документа
    navigate(`/document/${id}/wizard`)
  }

  return (
    <Card onClick={handleClick} hover>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            {code}
          </span>
          <span className="text-xs text-gray-400">{category.split('/')[0].trim()}</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 leading-tight">
          {title}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-2">
          {category}
        </p>
      </div>
    </Card>
  )
}

export default DocumentCard

