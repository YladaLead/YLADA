'use client'

import Link from 'next/link'
import YLADALogo from '../../../components/YLADALogo'
import LanguageSelector from '../../../components/LanguageSelector'
import { useTranslations } from '../../../hooks/useTranslations'

export default function EscolhaPerfilPage() {
  const { t } = useTranslations()

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm h-16 sm:h-20 flex items-center">
        <div className="container mx-auto px-4 py-0.5 flex items-center justify-between">
          <Link href="/pt">
            <YLADALogo size="md" responsive={true} />
          </Link>
          <LanguageSelector />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-4 sm:py-6 lg:py-8">
        <div className="text-center max-w-6xl mx-auto">

          {/* Breadcrumb */}
          <div className="mb-8">
            <Link 
              href="/pt"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              ← Voltar para a página principal
            </Link>
          </div>

          {/* Título Principal */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            {t.profile.title}
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            {t.profile.subtitle}
          </p>

          {/* Cards de Perfil */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6 mb-16">
            
            {/* Nutricionista */}
            <Link 
              href="/pt/nutri"
              className="group bg-white border border-gray-200 rounded-2xl p-8 hover:border-green-300 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-green-200 transition-colors">
                  <span className="text-3xl">🥗</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {t.profile.nutri.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {t.profile.nutri.description}
                </p>
              </div>
            </Link>

            {/* Consultor Nutra */}
            <Link 
              href="/pt/consultor"
              className="group bg-white border border-gray-200 rounded-2xl p-8 hover:border-blue-300 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-200 transition-colors">
                  <span className="text-3xl">💊</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {t.profile.sales.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {t.profile.sales.description}
                </p>
              </div>
            </Link>

            {/* Coach de Bem-estar */}
            <Link 
              href="/pt/coach"
              className="group bg-white border border-gray-200 rounded-2xl p-8 hover:border-purple-300 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-purple-200 transition-colors">
                  <span className="text-3xl">🧘‍♀️</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {t.profile.coach.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {t.profile.coach.description}
                </p>
              </div>
            </Link>

            {/* Consultor de Bem-Estar (Wellness) */}
            <Link 
              href="/pt/wellness"
              className="group bg-white border border-gray-200 rounded-2xl p-8 hover:border-teal-300 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-teal-200 transition-colors">
                  <span className="text-3xl">💚</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Consultor de Bem-Estar
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Transforme vidas com ferramentas profissionais de avaliação, engajamento e coaching em bem-estar.
                </p>
              </div>
            </Link>
          </div>

          {/* Seção de Dúvidas */}
          <div className="bg-gray-50 rounded-2xl p-8 sm:p-12 border border-gray-200 mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">
              Ainda não tem certeza?
            </h2>
            
            <div className="grid sm:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  🤔 Não se encaixa em nenhum perfil?
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  O YLADA funciona para qualquer profissional que queira conectar-se melhor com seu público.
                </p>
                <Link 
                  href="/pt/templates"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Explore nossos templates →
                </Link>
              </div>
              
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  💡 Quer ver exemplos?
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Veja como outros profissionais estão usando o YLADA para crescer seus negócios.
                </p>
                <Link 
                  href="/pt/templates"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Ver templates →
                </Link>
              </div>
            </div>
          </div>

          {/* CTA Alternativo */}
          <div className="text-center">
            <Link 
              href="/pt/templates"
              className="inline-flex items-center px-8 py-4 bg-gray-100 text-gray-700 text-lg font-semibold rounded-xl hover:bg-gray-200 transition-colors"
            >
              <span className="mr-3">📋</span>
              Ver todos os templates disponíveis
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
