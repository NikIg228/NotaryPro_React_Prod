// @ts-ignore
import documentsData from '../data/documents.json'

export interface Document {
  id: number
  code: string
  title: string
  category: string
  dev_notes?: string[]
  rules_for_cursor?: string[]
  parsed?: any
}

export interface Category {
  id: string
  name: string
  path: string
  documentCount: number
}

// Получить все документы
export const getAllDocuments = (): Document[] => {
  return documentsData as Document[]
}

// Получить документ по ID
export const getDocumentById = (id: number): Document | undefined => {
  return documentsData.find(doc => doc.id === id) as Document | undefined
}

// Получить все уникальные категории
export const getCategories = (): Category[] => {
  const categoryMap = new Map<string, number>()
  
  documentsData.forEach(doc => {
    const categoryPath = doc.category.split(' / ')[0] + ' / ' + doc.category.split(' / ')[1]
    const count = categoryMap.get(categoryPath) || 0
    categoryMap.set(categoryPath, count + 1)
  })
  
  const categories: Category[] = []
  let id = 1
  
  categoryMap.forEach((count, name) => {
    const pathParts = name.split(' / ')
    const categoryId = pathParts.join('-').toLowerCase().replace(/\s+/g, '-')
    
    categories.push({
      id: categoryId,
      name: name,
      path: name,
      documentCount: count
    })
    id++
  })
  
  return categories
}

// Получить документы по категории
export const getDocumentsByCategory = (categoryPath: string): Document[] => {
  return documentsData.filter(doc => {
    const docCategoryPath = doc.category.split(' / ').slice(0, 2).join(' / ')
    return docCategoryPath === categoryPath
  }) as Document[]
}

// Поиск документов
export const searchDocuments = (query: string): Document[] => {
  const lowerQuery = query.toLowerCase()
  return documentsData.filter(doc => 
    doc.title.toLowerCase().includes(lowerQuery) ||
    doc.code.toLowerCase().includes(lowerQuery) ||
    doc.category.toLowerCase().includes(lowerQuery)
  ) as Document[]
}

