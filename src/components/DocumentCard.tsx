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
      <h3 className="text-lg font-semibold text-gray-900 leading-tight">
        {title}
      </h3>
    </Card>
  )
}

export default DocumentCard

