import React from 'react'
import { Link } from 'react-router-dom'

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img 
              src="/logo_transparent.png" 
              alt="NotaryPro.kz" 
              className="h-[60px] w-auto"
            />
          </Link>
          <nav className="flex items-center gap-4">
            <Link 
              to="/landing" 
              className="text-gray-700 hover:text-purple-600 transition-colors"
            >
              Landing
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header

