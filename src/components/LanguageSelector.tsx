'use client'

import { useState } from 'react'

interface LanguageSelectorProps {
  className?: string
}

export default function LanguageSelector({ className = '' }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  const languages = [
    // Idiomas disponíveis imediatamente
    { code: 'pt', name: 'Português', flag: '🇧🇷', status: 'active' },
    { code: 'es', name: 'Español', flag: '🇪🇸', status: 'active' },
    { code: 'en', name: 'English', flag: '🇺🇸', status: 'active' }
  ]

  const handleLanguageChange = (langCode: string, status: string) => {
    if (status === 'active') {
      // Por enquanto, apenas fecha o dropdown
      // Implementação de i18n será feita depois
      console.log('Language changed to:', langCode)
      setIsOpen(false)
    } else {
      // Mostrar mensagem de "em breve"
      console.log('Language coming soon:', langCode)
      setIsOpen(false)
    }
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
      >
        <span className="w-4 h-4">🌐</span>
        <span className="text-sm font-medium">🌎 Idiomas</span>
      </button>

      {isOpen && (
        <>
          {/* Overlay para fechar ao clicar fora */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
            <div className="py-1">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code, lang.status)}
                  className="w-full px-4 py-2 text-left text-sm transition-colors flex items-center space-x-3 text-gray-700 hover:bg-gray-50"
                >
                  <span className="text-lg">{lang.flag}</span>
                  <span>{lang.name}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
