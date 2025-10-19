'use client'

import { useState } from 'react'
import { Globe } from 'lucide-react'

interface LanguageSelectorProps {
  className?: string
}

export default function LanguageSelector({ className = '' }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  const languages = [
    // MERCADO LATAM (PRIORIDADE MÁXIMA)
    { code: 'pt', name: 'Português (Brasil)', flag: '🇧🇷', status: 'active', region: 'latam' },
    { code: 'pt-pt', name: 'Português (Portugal)', flag: '🇵🇹', status: 'coming-soon', region: 'latam' },
    { code: 'es', name: 'Español (LATAM)', flag: '🌎', status: 'coming-soon', region: 'latam' },
    
    // MERCADO NORTE-AMERICANO
    { code: 'en', name: 'English (US)', flag: '🇺🇸', status: 'active', region: 'north-america' },
    { code: 'en-ca', name: 'English (Canada)', flag: '🇨🇦', status: 'coming-soon', region: 'north-america' },
    
    // MERCADO EUROPEU (SEGUNDA FASE)
    { code: 'fr', name: 'Français', flag: '🇫🇷', status: 'planned', region: 'europe' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪', status: 'planned', region: 'europe' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹', status: 'planned', region: 'europe' },
    
    // MERCADO ASIÁTICO (TERCEIRA FASE)
    { code: 'zh', name: '中文', flag: '🇨🇳', status: 'planned', region: 'asia' },
    { code: 'ja', name: '日本語', flag: '🇯🇵', status: 'planned', region: 'asia' },
    { code: 'ko', name: '한국어', flag: '🇰🇷', status: 'planned', region: 'asia' }
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
        <span className="text-sm font-medium">🌎 LATAM-First</span>
        <span className="text-xs text-green-600 font-medium">3 idiomas</span>
      </button>

      {isOpen && (
        <>
          {/* Overlay para fechar ao clicar fora */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-20 max-h-96 overflow-y-auto">
            <div className="py-1">
              {/* MERCADO LATAM - PRIORIDADE MÁXIMA */}
              <div className="px-3 py-2 text-xs font-semibold text-green-600 uppercase tracking-wide border-b border-green-200 bg-green-50">
                🌎 LATAM - Prioridade Máxima
              </div>
              {languages.filter(lang => lang.region === 'latam').map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code, lang.status)}
                  className={`w-full px-4 py-2 text-left text-sm transition-colors flex items-center space-x-3 ${
                    lang.status === 'active' 
                      ? 'text-gray-700 hover:bg-green-50 hover:text-green-600' 
                      : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-lg">{lang.flag}</span>
                  <span>{lang.name}</span>
                  <span className={`ml-auto text-xs font-medium ${
                    lang.status === 'active' ? 'text-green-600' : 'text-orange-500'
                  }`}>
                    {lang.status === 'active' ? '✓' : '🔜'}
                  </span>
                </button>
              ))}
              
              {/* MERCADO NORTE-AMERICANO */}
              <div className="px-3 py-2 text-xs font-semibold text-blue-600 uppercase tracking-wide border-b border-blue-200 bg-blue-50 mt-2">
                🇺🇸 Norte-Americano
              </div>
              {languages.filter(lang => lang.region === 'north-america').map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code, lang.status)}
                  className={`w-full px-4 py-2 text-left text-sm transition-colors flex items-center space-x-3 ${
                    lang.status === 'active' 
                      ? 'text-gray-700 hover:bg-blue-50 hover:text-blue-600' 
                      : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-lg">{lang.flag}</span>
                  <span>{lang.name}</span>
                  <span className={`ml-auto text-xs font-medium ${
                    lang.status === 'active' ? 'text-green-600' : 'text-orange-500'
                  }`}>
                    {lang.status === 'active' ? '✓' : '🔜'}
                  </span>
                </button>
              ))}
              
              {/* MERCADO EUROPEU - SEGUNDA FASE */}
              <div className="px-3 py-2 text-xs font-semibold text-purple-600 uppercase tracking-wide border-b border-purple-200 bg-purple-50 mt-2">
                🇪🇺 Europeu - Segunda Fase
              </div>
              {languages.filter(lang => lang.region === 'europe').map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code, lang.status)}
                  className="w-full px-4 py-2 text-left text-sm text-gray-400 hover:bg-gray-50 transition-colors flex items-center space-x-3"
                >
                  <span className="text-lg opacity-60">{lang.flag}</span>
                  <span>{lang.name}</span>
                  <span className="ml-auto text-xs text-gray-400 font-medium">📋</span>
                </button>
              ))}
              
              {/* MERCADO ASIÁTICO - TERCEIRA FASE */}
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-200 bg-gray-50 mt-2">
                🌏 Asiático - Terceira Fase
              </div>
              {languages.filter(lang => lang.region === 'asia').map((lang) => (
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
