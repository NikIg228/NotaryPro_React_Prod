import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../components/Card'
import { getMainCategories } from '../utils/dataUtils'

const HomePage: React.FC = () => {
  const navigate = useNavigate()

  // Получаем все основные категории в алфавитном порядке
  const categories = useMemo(() => {
    return getMainCategories().sort()
  }, [])

  const handleCategoryClick = (category: string) => {
    navigate('/category', { 
      state: { 
        mainCategory: category 
      } 
    })
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Нотари
          </h1>
          <p className="text-gray-600">
            Выберите категорию документов для создания
          </p>
        </div>

        <div className="space-y-4">
          {categories.map((category) => (
            <Card 
              key={category}
              onClick={() => handleCategoryClick(category)}
              hover
              className="cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  {category}
                </h2>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Футер */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <img 
                src="/logo_transparent.png" 
                alt="NotaryPro.kz" 
                className="h-[120px] w-auto mb-4"
              />
            </div>
            <div>
              <h4 className="font-semibold mb-4">Контакты поддержки</h4>
              <p className="text-gray-400">Email: support@notarypro.kz</p>
              <p className="text-gray-400">Телефон: +7 (XXX) XXX-XX-XX</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Документы</h4>
              <a href="#" className="block text-gray-400 hover:text-white mb-2">Политика конфиденциальности</a>
              <a href="#" className="block text-gray-400 hover:text-white">Договор-оферта</a>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Поддержка</h4>
              <a href="#" className="block text-gray-400 hover:text-white">WhatsApp-поддержка</a>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 NotaryPro.kz. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage

