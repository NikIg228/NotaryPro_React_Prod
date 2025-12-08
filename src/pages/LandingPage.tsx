import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import Input from '../components/Input'

const LandingPage: React.FC = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    fullName: '',
    licenseNumber: '',
    licenseDate: '',
    licenseIssuer: '',
    phone: '',
    email: '',
    city: '',
    password: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Здесь будет логика регистрации
    console.log('Registration data:', formData)
    // После регистрации можно перенаправить на главную страницу
    navigate('/')
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Блок 1. Главный экран */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Инструмент для нотариусов, соответствующий Закону «О нотариате» и Методологиям РНП
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Автоматизированная подготовка документов с соблюдением всех обязательных требований законодательства и профессиональных стандартов.
          </p>
          <Button 
            onClick={() => document.getElementById('registration')?.scrollIntoView({ behavior: 'smooth' })}
            className="text-lg px-8 py-4"
          >
            Получить бесплатный доступ на 7 дней
          </Button>
          <div className="mt-12 bg-gray-100 rounded-lg p-8">
            <p className="text-gray-600 mb-4">Краткая презентация возможностей сервиса</p>
            <div className="aspect-video bg-gray-200 rounded flex items-center justify-center">
              <span className="text-gray-400">Видео презентация</span>
            </div>
          </div>
        </div>
      </section>

      {/* Блок 2. Актуальные задачи */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Ежедневные задачи, требующие повышенной точности
          </h2>
          <div className="space-y-4">
            {[
              'Строгое соблюдение формулировок, реквизитов и порядка составления документов.',
              'Риск технических неточностей при высокой рабочей нагрузке.',
              'Использование устаревших шаблонов и несогласованных формулировок.',
              'Значительные временные затраты на ручное заполнение данных.'
            ].map((item, index) => (
              <div key={index} className="flex items-start">
                <span className="text-red-600 mr-3">–</span>
                <p className="text-gray-700 text-lg">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Блок 3. Решение */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Профессиональный инструмент для автоматизированной подготовки документов
          </h2>
          <div className="space-y-4">
            <p className="text-lg text-gray-700 mb-6">Сервис обеспечивает:</p>
            {[
              'формирование документов с использованием корректных, проверенных формулировок, соответствующих Методологиям РНП;',
              'автоматическую подстановку обязательных реквизитов, включая даты, ФИО, ИИН, данные удостоверяющих документов;',
              'исключение технических ошибок за счёт стандартизированного подхода;',
              'подготовку проекта документа за минимальное время.'
            ].map((item, index) => (
              <div key={index} className="flex items-start">
                <span className="text-green-600 mr-3">–</span>
                <p className="text-gray-700 text-lg">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Блок 4. Преимущества */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Скорость и точность выполнения нотариальных действий
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Подготовка договора купли-продажи',
                text: 'от 3 минут, вместо привычных 30–40 минут ручной работы.'
              },
              {
                title: 'Формулировки и структура документов',
                text: 'в соответствии с Законом «О нотариате» и Методологиями РНП.'
              },
              {
                title: 'Минимизация технических ошибок',
                text: 'благодаря автоматизации реквизитов и унификации шаблонов.'
              }
            ].map((card, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{card.title}</h3>
                <p className="text-gray-600">{card.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Блок 5. Социальное подтверждение */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Сервис используется нотариусами в различных регионах Казахстана
          </h2>
          <p className="text-lg text-gray-700">
            Отмечается сокращение времени подготовки документов, снижение нагрузки и повышение точности формулировок в повседневной работе.
          </p>
        </div>
      </section>

      {/* Блок 6. Как работает сервис */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Работа с системой проста и не требует специальных навыков
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Заполните короткую регистрационную форму'
              },
              {
                step: '2',
                title: 'Получите доступ к инструменту и шаблонам, приведённым к профессиональным стандартам'
              },
              {
                step: '3',
                title: 'Формируйте документы быстро, точно и без технических ошибок'
              }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <p className="text-gray-700 text-lg">{item.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Блок 7. Форма регистрации */}
      <section id="registration" className="py-16 px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
            Получите бесплатный доступ на 7 дней
          </h2>
          <p className="text-lg text-gray-600 mb-8 text-center">
            Регистрация занимает менее 1 минуты.
          </p>
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg space-y-6">
            <Input
              type="text"
              label="ФИО"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              required
            />
            <Input
              type="text"
              label="№ лицензии"
              value={formData.licenseNumber}
              onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
              required
            />
            <Input
              type="date"
              label="Дата выдачи лицензии"
              value={formData.licenseDate}
              onChange={(e) => handleInputChange('licenseDate', e.target.value)}
              required
            />
            <Input
              type="text"
              label="Орган выдавший лицензию"
              value={formData.licenseIssuer}
              onChange={(e) => handleInputChange('licenseIssuer', e.target.value)}
              required
            />
            <Input
              type="tel"
              label="Телефон"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              required
            />
            <Input
              type="email"
              label="Email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required
            />
            <Input
              type="text"
              label="Город"
              value={formData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              required
            />
            <Input
              type="password"
              label="Пароль"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              required
            />
            <Button type="submit" className="w-full text-lg py-4">
              Создать аккаунт
            </Button>
            <p className="text-sm text-gray-500 text-center mt-4">
              Регистрация бесплатная. Банковские реквизиты не требуются.
            </p>
          </form>
        </div>
      </section>

      {/* Блок 8. Безопасность */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Конфиденциальность и защита данных
          </h2>
          <div className="space-y-4">
            {[
              'Передача данных осуществляется по защищённому протоколу.',
              'Сервис не хранит и не обрабатывает персональные данные клиентов нотариусов.',
              'Соответствует требованиям законодательства Республики Казахстан в области информации и защиты персональных данных.',
              'Все изменения в законодательстве оперативно учитываются в актуальных формулировках.'
            ].map((item, index) => (
              <div key={index} className="flex items-start">
                <span className="text-blue-600 mr-3">–</span>
                <p className="text-gray-700 text-lg">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Блок 9. FAQ */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Ответы на распространённые вопросы
          </h2>
          <div className="space-y-6">
            {[
              {
                q: 'Подходит ли сервис для всех нотариальных действий?',
                a: 'Сервис содержит шаблоны и формулировки для основных действий, требующих точности и стандартизации. Ассортимент расширяется и обновляется.'
              },
              {
                q: 'Обновляются ли документы при изменении законодательства?',
                a: 'Да. Обновление производится оперативно в соответствии с изменениями нормативных актов.'
              },
              {
                q: 'Что происходит по завершении бесплатного периода?',
                a: 'Вы сможете выбрать удобный тариф или прекратить использование без каких-либо обязательств.'
              },
              {
                q: 'Нужны ли дополнительные программы или обучение?',
                a: 'Нет. Интерфейс интуитивный и не требует специальной подготовки.'
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Блок 10. Футер */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">NotaryPro.kz</h3>
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
            <p>&copy; 2024 NotaryPro.kz. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
