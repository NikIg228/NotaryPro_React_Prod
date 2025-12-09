import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  hover?: boolean
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className = '',
  onClick,
  hover = true
}) => {
  const baseStyles = 'bg-white border border-gray-200 rounded-lg p-6 transition-all duration-200'
  const hoverStyles = hover ? 'hover:bg-purple-50 hover:border-purple-300 hover:shadow-md cursor-pointer' : ''
  
  return (
    <div
      className={`${baseStyles} ${hoverStyles} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

export default Card

