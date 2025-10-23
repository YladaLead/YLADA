'use client'

import { useTranslations } from '../../hooks/useTranslations'
import YLADALogo from '../../components/YLADALogo'
import LanguageSelector from '../../components/LanguageSelector'
import Link from 'next/link'

export default function HomePage() {
  const { t } = useTranslations()

  return (
    <div className="min-h-screen bg-white">
      {/* Header - Clean Design */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm h-16 sm:h-20 flex items-center">
        <div className="container mx-auto px-4 py-0.5 flex items-center justify-between">
          <Link href="/pt">
            <YLADALogo size="md" responsive={true} />
          </Link>
          <LanguageSelector />
        </div>
      </header>

      {/* Hero Section - Filosofia YLADA */}
      <main className="container mx-auto px-4 py-4 sm:py-6 lg:py-8">
        <div className="text-center max-w-5xl mx-auto">

          {/* Badge de Filosofia */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-8 border border-blue-200">
            🧭 {t.main.badge}
          </div>

          {/* Título Principal - Filosofia Universal */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-8 leading-tight">
            {t.main.title}
          </h1>
          
          {/* Subtítulo - Propósito Universal */}
          <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            {t.main.subtitle}
          </p>

          {/* CTA Principal */}
          <div className="mb-16">
            <Link 
              href="/pt/como-funciona"
              className="inline-flex items-center px-8 sm:px-12 py-4 sm:py-5 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-lg sm:text-xl font-bold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <span className="mr-3 text-lg">🚀</span>
              {t.main.cta}
            </Link>
            
            {/* Credibilidade Universal */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-sm text-gray-500">
              <div className="flex items-center">
                <span className="text-blue-500 mr-2">✅</span>
                <span className="text-gray-700 font-medium">{t.main.credibility.professionals}</span>
              </div>
              <div className="flex items-center">
                <span className="text-blue-500 mr-2">🌍</span>
                <span className="text-gray-700 font-medium">{t.main.credibility.global}</span>
              </div>
              <div className="flex items-center">
                <span className="text-blue-500 mr-2">⚡</span>
                <span className="text-gray-700 font-medium">{t.main.credibility.quickStart}</span>
              </div>
            </div>
          </div>

          {/* Benefícios - 3 Pilares da Filosofia YLADA */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 hover:border-blue-300">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-xl text-blue-600">⚡</span>
              </div>
              <h3 className="text-lg font-bold mb-3 text-gray-900 text-center">Simplicidade</h3>
              <p className="text-gray-600 text-sm leading-relaxed text-center">
                <span className="text-blue-600 font-semibold">Um link, infinitas possibilidades</span>. 
                Transforme qualquer ideia em uma ferramenta inteligente em segundos.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 hover:border-blue-300">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-xl text-blue-600">🎯</span>
              </div>
              <h3 className="text-lg font-bold mb-3 text-gray-900 text-center">Inteligência</h3>
              <p className="text-gray-600 text-sm leading-relaxed text-center">
                <span className="text-blue-600 font-semibold">IA que entende seu público</span>. 
                Cada ferramenta é otimizada para converter visitantes em conexões reais.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 hover:border-blue-300 sm:col-span-2 lg:col-span-1">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-xl text-blue-600">🌍</span>
              </div>
              <h3 className="text-lg font-bold mb-3 text-gray-900 text-center">Escalabilidade</h3>
              <p className="text-gray-600 text-sm leading-relaxed text-center">
                <span className="text-blue-600 font-semibold">Cresça sem limites</span>. 
                Da primeira conexão ao milhão de usuários, o YLADA escala com você.
              </p>
            </div>
          </div>

          {/* CTA Final */}
          <div className="text-center">
            <Link 
              href="/pt/como-funciona"
              className="inline-flex items-center px-8 sm:px-12 py-4 sm:py-5 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-lg sm:text-xl font-bold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <span className="mr-3 text-lg">🚀</span>
              {t.main.cta}
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center">
            <div className="mb-4">
              <YLADALogo size="lg" />
            </div>
            <p className="text-gray-600 text-sm mb-3">
              {t.footer.tagline}
            </p>
            <p className="text-gray-500 text-xs">
              {t.footer.copyright}
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
