'use client'

import { useState } from 'react'
import { useTranslations } from '../hooks/useTranslations'
import { Language, languageNames, languageFlags } from '../lib/i18n'

interface LanguageSelectorProps {
  className?: string
}

export default function LanguageSelector({ className = '' }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { t, currentLang, changeLanguage } = useTranslations()

  const languages: Language[] = ['pt', 'en', 'es']

  const handleLanguageChange = (langCode: Language) => {
    changeLanguage(langCode)
    setIsOpen(false)
    
    // Navegar para a rota do idioma selecionado
    const currentPath = window.location.pathname
    const pathWithoutLang = currentPath.replace(/^\/[a-z]{2}/, '') || '/'
    const newPath = `/${langCode}${pathWithoutLang}`
    
    window.location.href = newPath
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-2 sm:px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
      >
        <span className="text-lg">🌍</span>
        <span className="text-sm font-medium hidden sm:block">{t.header.languages}</span>
      </button>

      {isOpen && (
        <>
          {/* Overlay para fechar ao clicar fora */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
            <div className="py-1">
              {languages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => handleLanguageChange(lang)}
                  className={`w-full px-4 py-2 text-left text-sm transition-colors flex items-center justify-between text-gray-700 hover:bg-gray-50 ${
                    currentLang === lang ? 'bg-blue-50 text-blue-600' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{languageFlags[lang]}</span>
                    <span>{languageNames[lang]}</span>
                  </div>
                  {currentLang === lang && (
                    <span className="text-xs text-blue-600 font-medium">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
