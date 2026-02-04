'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { useTranslations } from '../hooks/useTranslations'
import { Language, languageNames, languageFlags } from '../lib/i18n'

interface LanguageSelectorProps {
  className?: string
}

const LOCALE_PREFIX = /^\/(pt|en|es)(\/|$)/

export default function LanguageSelector({ className = '' }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname() ?? ''
  const { t, currentLang, changeLanguage } = useTranslations()

  // Idioma exibido = o que está na URL (prioridade) ou o do hook (localStorage)
  const langFromUrl = pathname.match(LOCALE_PREFIX)?.[1] as Language | undefined
  const displayLang: Language = langFromUrl ?? currentLang

  const languages: Language[] = ['pt', 'en', 'es']

  const handleLanguageChange = (langCode: Language) => {
    changeLanguage(langCode)
    setIsOpen(false)

    if (typeof window === 'undefined') return

    const currentPath = window.location.pathname
    // Remover apenas o prefixo de idioma válido (pt, en, es)
    let pathWithoutLang = (currentPath.replace(LOCALE_PREFIX, (_match, _lang, slash) => (slash === '/' ? '/' : '')) || '').trim() || '/'
    // /us não existe como rota em nenhum idioma; usar home
    if (pathWithoutLang === '/us' || pathWithoutLang.startsWith('/us/')) {
      pathWithoutLang = pathWithoutLang === '/us' ? '/' : pathWithoutLang.slice(4) || '/'
    }
    // Na raiz (/), ir para /pt, /en ou /es sem barra trailing
    const newPath = pathWithoutLang === '/' ? `/${langCode}` : `/${langCode}${pathWithoutLang}`.replace(/\/+/g, '/')
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
          {/* Overlay para fechar ao clicar fora — acima do header (z-50) */}
          <div 
            className="fixed inset-0 z-[100]" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown — acima do overlay para ser clicável */}
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-[110]">
            <div className="py-1">
              {languages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => handleLanguageChange(lang)}
                  className={`w-full px-4 py-2 text-left text-sm transition-colors flex items-center justify-between text-gray-700 hover:bg-gray-50 ${
                    displayLang === lang ? 'bg-blue-50 text-blue-600' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{languageFlags[lang]}</span>
                    <span>{languageNames[lang]}</span>
                  </div>
                  {displayLang === lang && (
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
