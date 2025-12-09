import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import Header from './components/Header'

// Lazy load pages for code splitting
const HomePage = lazy(() => import('./pages/HomePage'))
const DocumentPage = lazy(() => import('./pages/DocumentPage'))
const WizardPage = lazy(() => import('./pages/WizardPage'))
const LandingPage = lazy(() => import('./pages/LandingPage'))
const CategoryPage = lazy(() => import('./pages/CategoryPage'))

function AppContent() {
  const location = useLocation()
  const showHeader = location.pathname !== '/landing'

  return (
    <>
      {showHeader && <Header />}
      <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center">Загрузка...</div>}>
        <Routes>
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/category" element={<CategoryPage />} />
          <Route path="/document/:id" element={<DocumentPage />} />
          <Route path="/document/:id/wizard" element={<WizardPage />} />
        </Routes>
      </Suspense>
    </>
  )
}

function App() {
  return (
    <Router
      future={{
        v7_relativeSplatPath: true,
        v7_startTransition: true,
      }}
    >
      <AppContent />
    </Router>
  )
}

export default App
