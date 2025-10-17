'use client'

import { HelpCircle } from 'lucide-react'

interface HelpButtonProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  position?: 'fixed' | 'inline'
}

export default function HelpButton({ 
  className = '', 
  size = 'md', 
  position = 'fixed' 
}: HelpButtonProps) {
  const whatsappUrl = 'https://api.whatsapp.com/send?phone=5519996049800&text=Estou%20no%20site%20e%20preciso%20de%20ajuda'

  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-12 h-12',
    lg: 'w-14 h-14'
  }

  const iconSizes = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-7 h-7'
  }

  const positionClasses = position === 'fixed' 
    ? 'fixed bottom-6 right-6 z-50' 
    : 'inline-block'

  return (
    <button
      onClick={() => window.open(whatsappUrl, '_blank')}
      className={`
        ${positionClasses}
        ${sizeClasses[size]}
        bg-emerald-600 hover:bg-emerald-700 
        text-white rounded-full shadow-lg hover:shadow-xl 
        transition-all duration-300 transform hover:scale-110
        flex items-center justify-center
        ${className}
      `}
      title="Precisa de ajuda? Fale conosco no WhatsApp!"
    >
      <HelpCircle className={iconSizes[size]} />
    </button>
  )
}
