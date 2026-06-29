import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  variant?: 'default' | 'situation' | 'result' | 'choice'
}

const variantStyles = {
  default: 'bg-white border-calm-100',
  situation: 'bg-white border-calm-200 border-l-4 border-l-calm-500',
  result: 'bg-gradient-to-br from-sage-50 to-calm-50 border-sage-200 border-l-4 border-l-sage-500',
  choice: 'bg-white border-calm-100 hover:border-calm-300 hover:shadow-soft cursor-pointer transition-all duration-200',
}

export function Card({ children, className = '', variant = 'default' }: CardProps) {
  return (
    <div className={`rounded-2xl border shadow-card p-6 ${variantStyles[variant]} ${className}`}>
      {children}
    </div>
  )
}
