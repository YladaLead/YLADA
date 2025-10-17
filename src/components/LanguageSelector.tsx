'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Globe } from 'lucide-react'

interface LanguageSelectorProps {
  className?: string
}

export default function LanguageSelector({ className = '' }: LanguageSelectorProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const languages = [
    { code: 'pt', name: 'Português', flag: '🇧🇷' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'en', name: 'English', flag: '🇺🇸' }
  ]

  const handleLanguageChange = (langCode: string) => {
    // Para Next.js com i18n, precisamos usar o router com locale
    router.push(pathname, { locale: langCode })
    setIsOpen(false)
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-emerald-600 transition-colors"
      >
        <Globe className="w-4 h-4" />
        <span className="text-sm font-medium">Idioma</span>
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
                  onClick={() => handleLanguageChange(lang.code)}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors flex items-center space-x-3"
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
