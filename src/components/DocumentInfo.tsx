import React from 'react'
import Card from './Card'
import { Document } from '../utils/dataUtils'

interface DocumentInfoProps {
  document: Document
}

const DocumentInfo: React.FC<DocumentInfoProps> = ({ document }) => {
  return (
    <>
      {document.dev_notes && document.dev_notes.length > 0 && (
        <Card hover={false}>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Технические заметки
          </h3>
          <ul className="space-y-2">
            {document.dev_notes.map((note, index) => (
              <li key={index} className="text-sm text-gray-600 flex items-start">
                <span className="text-gray-400 mr-2">•</span>
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {document.rules_for_cursor && document.rules_for_cursor.length > 0 && (
        <Card hover={false}>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Правила реализации
          </h3>
          <ul className="space-y-2">
            {document.rules_for_cursor.map((rule, index) => (
              <li key={index} className="text-sm text-gray-600 flex items-start">
                <span className="text-gray-400 mr-2">•</span>
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {document.parsed?.placeholders && document.parsed.placeholders.length > 0 && (
        <Card hover={false}>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Плейсхолдеры
          </h3>
          <div className="flex flex-wrap gap-2">
            {document.parsed.placeholders.map((placeholder: string, index: number) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded font-mono"
              >
                {placeholder}
              </span>
            ))}
          </div>
        </Card>
      )}
    </>
  )
}

export default DocumentInfo

