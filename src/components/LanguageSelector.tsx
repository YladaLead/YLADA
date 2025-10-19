'use client'

import { useState } from 'react'
import { Globe } from 'lucide-react'

interface LanguageSelectorProps {
  className?: string
}

export default function LanguageSelector({ className = '' }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  const languages = [
    // Idiomas principais (funcionando)
    { code: 'pt', name: 'Português', flag: '🇧🇷', status: 'active' },
    { code: 'es', name: 'Español', flag: '🇪🇸', status: 'active' },
    { code: 'en', name: 'English', flag: '🇺🇸', status: 'active' },
    
    // Idiomas em desenvolvimento (próximos)
    { code: 'fr', name: 'Français', flag: '🇫🇷', status: 'coming-soon' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪', status: 'coming-soon' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹', status: 'coming-soon' },
    
    // Idiomas LATAM (prioridade alta)
    { code: 'mx', name: 'Español (MX)', flag: '🇲🇽', status: 'coming-soon' },
    { code: 'ar', name: 'Español (AR)', flag: '🇦🇷', status: 'coming-soon' },
    { code: 'co', name: 'Español (CO)', flag: '🇨🇴', status: 'coming-soon' },
    
    // Idiomas asiáticos (expansão futura)
    { code: 'zh', name: '中文', flag: '🇨🇳', status: 'planned' },
    { code: 'ja', name: '日本語', flag: '🇯🇵', status: 'planned' },
    { code: 'ko', name: '한국어', flag: '🇰🇷', status: 'planned' }
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
        <Globe className="w-4 h-4" />
        <span className="text-sm font-medium">🌍 Global</span>
        <span className="text-xs text-blue-600 font-medium">12 idiomas</span>
      </button>

      {isOpen && (
        <>
          {/* Overlay para fechar ao clicar fora */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-20 max-h-80 overflow-y-auto">
            <div className="py-1">
              {/* Seção: Idiomas Ativos */}
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-100">
                🌍 Disponíveis Agora
              </div>
              {languages.filter(lang => lang.status === 'active').map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code, lang.status)}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center space-x-3"
                >
                  <span className="text-lg">{lang.flag}</span>
                  <span>{lang.name}</span>
                  <span className="ml-auto text-xs text-green-600 font-medium">✓</span>
                </button>
              ))}
              
              {/* Seção: Em Breve */}
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-100 mt-2">
                🚀 Em Breve
              </div>
              {languages.filter(lang => lang.status === 'coming-soon').map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code, lang.status)}
                  className="w-full px-4 py-2 text-left text-sm text-gray-500 hover:bg-gray-50 transition-colors flex items-center space-x-3"
                >
                  <span className="text-lg opacity-60">{lang.flag}</span>
                  <span>{lang.name}</span>
                  <span className="ml-auto text-xs text-orange-500 font-medium">🔜</span>
                </button>
              ))}
              
              {/* Seção: Planejados */}
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-100 mt-2">
                📅 Planejados
              </div>
              {languages.filter(lang => lang.status === 'planned').map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code, lang.status)}
                  className="w-full px-4 py-2 text-left text-sm text-gray-400 hover:bg-gray-50 transition-colors flex items-center space-x-3"
                >
                  <span className="text-lg opacity-40">{lang.flag}</span>
                  <span>{lang.name}</span>
                  <span className="ml-auto text-xs text-gray-400 font-medium">📋</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
