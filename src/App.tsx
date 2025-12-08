import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import DocumentPage from './pages/DocumentPage'
import WizardPage from './pages/WizardPage'
import Header from './components/Header'

function App() {
  return (
    <Router
      future={{
        v7_relativeSplatPath: true,
        v7_startTransition: true,
      }}
    >
      <div className="min-h-screen bg-white">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/document/:id" element={<DocumentPage />} />
          <Route path="/document/:id/wizard" element={<WizardPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App

