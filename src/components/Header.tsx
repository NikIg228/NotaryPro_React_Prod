import React from 'react'
import { Link } from 'react-router-dom'

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-gray-900 hover:text-black transition-colors">
            Notary
          </Link>
          <nav className="flex items-center gap-4">
            {/* Можно добавить навигацию при необходимости */}
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header

