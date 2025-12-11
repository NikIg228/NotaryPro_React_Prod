import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import DynamicWizard from '../components/wizard/DynamicWizard'
import { getDocumentById } from '../utils/dataUtils'
import { DocumentSchema } from '../types/WizardTypes'
import ConfirmModal from '../components/ConfirmModal'

const WizardPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const document = id ? getDocumentById(parseInt(id)) : undefined
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [shouldBlock, setShouldBlock] = useState(true)
  const navigationAttemptedRef = useRef(false)

  // Обработка навигации назад в браузере (закрытие вкладки/окна)
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (shouldBlock) {
        e.preventDefault()
        e.returnValue = 'Вы уверены, что хотите покинуть страницу? Несохраненные данные будут потеряны.'
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [shouldBlock])

  // Обработка навигации через react-router (кнопка "Назад" в браузере)
  useEffect(() => {
    if (!shouldBlock) return

    // Добавляем состояние в историю для отслеживания
    window.history.pushState(null, '', location.pathname)
    
    const handlePopState = () => {
      if (shouldBlock && !navigationAttemptedRef.current) {
        setShowCancelModal(true)
        // Возвращаемся на текущую страницу
        window.history.pushState(null, '', location.pathname)
      }
    }

    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [shouldBlock, location.pathname])

  const handleSubmit = (data: any) => {
    console.log('Form data submitted:', data)
    // Здесь можно отправить данные на сервер для генерации docx
    navigate('/')
  }

  const handleCancel = () => {
    setShowCancelModal(true)
  }

  const handleConfirmCancel = () => {
    setShowCancelModal(false)
    setShouldBlock(false)
    navigationAttemptedRef.current = true
    navigate('/')
  }

  const handleCancelModal = () => {
    setShowCancelModal(false)
    navigationAttemptedRef.current = false
  }

  if (!document) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Документ не найден</p>
        </div>
      </div>
    )
  }

  // Преобразуем документ в DocumentSchema
  const documentSchema: DocumentSchema = {
    id: document.id,
    code: document.code,
    title: document.title,
    category: document.category,
    dev_notes: document.dev_notes,
    rules_for_cursor: document.rules_for_cursor,
    parsed: document.parsed
  }

  return (
    <>
      <DynamicWizard
        schema={documentSchema}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
      <ConfirmModal
        isOpen={showCancelModal}
        title={`Подтвердите действие на ${window.location.hostname}`}
        message="Вы уверены, что хотите отменить заполнение формы?"
        confirmText="OK"
        cancelText="Отмена"
        onConfirm={handleConfirmCancel}
        onCancel={handleCancelModal}
      />
    </>
  )
}

export default WizardPage

