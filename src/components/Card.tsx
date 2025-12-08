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
  const baseStyles = 'bg-white border border-gray-200 rounded-lg p-6 transition-colors'
  const hoverStyles = hover ? 'hover:bg-gray-50 hover:border-gray-300 cursor-pointer' : ''
  
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

