import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    // Скроллим в самый верх страницы при изменении пути
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' // Мгновенный скролл без анимации
    })
  }, [pathname])

  return null
}

export default ScrollToTop

