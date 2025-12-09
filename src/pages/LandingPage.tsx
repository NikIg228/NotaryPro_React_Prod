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
  const [videoError, setVideoError] = useState<string | null>(null)
  const [videoAspectRatio, setVideoAspectRatio] = useState<number | null>(null)

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
          Профессиональный инструмент для нотариусов, формирующий документы в соответствии с Законом „о Нотариате“ и Методическими рекомендациями РНП.
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
            <div 
              className="bg-gray-200 rounded overflow-hidden relative mx-auto"
              style={{
                aspectRatio: videoAspectRatio ? `${videoAspectRatio}` : '16/9',
                maxWidth: '100%',
                maxHeight: '90vh'
              }}
            >
              <video 
                className="w-full h-full object-contain" 
                controls 
                preload="metadata"
                playsInline
                onError={(e) => {
                  const video = e.currentTarget
                  const error = video.error
                  let errorMessage = 'Не удалось загрузить видео.'
                  
                  if (error) {
                    switch (error.code) {
                      case error.MEDIA_ERR_ABORTED:
                        errorMessage = 'Загрузка видео была прервана.'
                        break
                      case error.MEDIA_ERR_NETWORK:
                        errorMessage = 'Ошибка сети при загрузке видео.'
                        break
                      case error.MEDIA_ERR_DECODE:
                        errorMessage = 'Браузер не может декодировать видео.'
                        break
                      case error.MEDIA_ERR_SRC_NOT_SUPPORTED:
                        errorMessage = 'Формат видео не поддерживается браузером.'
                        break
                      default:
                        errorMessage = `Ошибка загрузки видео (код: ${error.code}).`
                    }
                  }
                  
                  console.error('Video error:', error, errorMessage)
                  setVideoError(errorMessage)
                }}
                onLoadedMetadata={(e) => {
                  const video = e.currentTarget
                  const aspectRatio = video.videoWidth / video.videoHeight
                  setVideoAspectRatio(aspectRatio)
                  setVideoError(null)
                }}
              >
                <source src="/Нотариус финальное.mp4" type="video/mp4" />
                Ваш браузер не поддерживает воспроизведение видео.
              </video>
              {videoError && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 text-white p-4 text-center">
                  <div>
                    <p className="text-lg font-semibold mb-2">Ошибка загрузки видео</p>
                    <p className="text-sm">{videoError}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Блок о стоимости */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          {/* Заголовок */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Меньше 999 ₸ в день — полный профессиональный инструмент для нотариусов
            </h2>
          </div>

          {/* Описательный текст */}
          <div className="mb-8">
            <p className="text-lg text-gray-700 mb-4">
              Использование сервиса NotaryPro.kz обходится менее чем в 1 000 тенге в сутки.
              Нотариус получает полный доступ ко всем функциям, включая:
            </p>
            <ul className="space-y-2 mb-6">
              {[
                'автоматизированное формирование документов;',
                'корректные формулировки, соответствующие законодательству РК;',
                'стандартизированные текстовые модули;',
                'автоматическую подстановку реквизитов;',
                'систему предотвращения технических ошибок;',
                'постоянные обновления в соответствии с изменениями в законодательстве.'
              ].map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-gray-400 mr-2">•</span>
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Стоимость спокойным текстом под основной частью */}
          <div className="mb-8 text-center">
            <p className="text-lg text-gray-600">
              Фиксированная стоимость: 29 900 ₸ в месяц
            </p>
          </div>

          {/* Сноска мелким шрифтом */}
          <p className="text-sm text-gray-500 mb-12 text-center">
            Стоимость указана с целью удобства расчёта. Ежедневное списание не производится.
            Оплата осуществляется один раз в месяц.
            В течение бесплатного 7-дневного периода оплата не взимается.
          </p>

          {/* Блок преимуществ и что входит в стоимость */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Преимущества */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Почему это выгодно:
              </h3>
              <ul className="space-y-3">
                {[
                  '999 ₸ в день — меньше стоимости одной нотариальной расписки',
                  'Экономия времени: до 30–40 минут на каждом документе',
                  'Минимизация риска технических ошибок',
                  'Приведение документов к единообразию',
                  'Оплата всего один раз в месяц'
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Что входит в стоимость */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                В подписку включено:
              </h3>
              <ul className="space-y-3">
                {[
                  'Неограниченное использование конструктора документов',
                  'Доступ ко всем шаблонам',
                  'Авто-заполнение реквизитов (ФИО, ИИН, паспорт, VIN, адрес регистрации и др.)',
                  'Постоянные обновления формулировок',
                  'Техническая поддержка'
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Блок перед кнопкой регистрации */}
          <div className="text-center bg-gradient-to-b from-gray-50 to-white p-8 rounded-lg border border-gray-200">
            <p className="text-xl text-gray-900 mb-2 font-semibold">
              Попробуйте сервис бесплатно 7 дней
            </p>
            <p className="text-gray-600 mb-6">
              Без обязательств. Без привязки банковской карты.
            </p>
            <p className="text-gray-700 mb-6">
              Оплатите только после того, как убедитесь в эффективности инструмента.
            </p>
            <Button 
              onClick={() => document.getElementById('registration')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-lg px-8 py-4"
            >
              Получить 7-дневный доступ
            </Button>
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
              'создание проекта нотариального документа в соответствии с  Методическими рекомендациям и нотариальной практике, утверждённой РНП и Законом о "Нотариате";',
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
                title: 'Создание проекта нотариального документа',
                text: 'в соответствии с  Методическими рекомендациям и нотариальной практике, утверждённой РНП и Законом о "Нотариате"'
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

export default LandingPage
