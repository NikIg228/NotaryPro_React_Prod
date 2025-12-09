import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import HomePage from './pages/HomePage'
import DocumentPage from './pages/DocumentPage'
import WizardPage from './pages/WizardPage'
import LandingPage from './pages/LandingPage'
import CategoryPage from './pages/CategoryPage'
import Header from './components/Header'

function AppContent() {
  const location = useLocation()
  const showHeader = location.pathname !== '/landing'

  return (
    <>
      {showHeader && <Header />}
      <Routes>
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/category" element={<CategoryPage />} />
        <Route path="/document/:id" element={<DocumentPage />} />
        <Route path="/document/:id/wizard" element={<WizardPage />} />
      </Routes>
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
