'use client'

import Link from 'next/link'
import YLADALogo from '../../../components/YLADALogo'
import LanguageSelector from '../../../components/LanguageSelector'
import { useTranslations } from '../../../hooks/useTranslations'

export default function ProfileSelectionPageEN() {
  const { t } = useTranslations('en')

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm h-16 sm:h-20 flex items-center">
        <div className="container mx-auto px-4 py-0.5 flex items-center justify-between">
          <Link href="/en">
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
              href="/en"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              ← Back to main page
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
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            
            {/* Nutritionist */}
            <Link 
              href="/en/nutritionist"
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

            {/* Sales */}
            <Link 
              href="/en/sales"
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

            {/* Coach */}
            <Link 
              href="/en/coach"
              className="group bg-white border border-gray-200 rounded-2xl p-8 hover:border-purple-300 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 sm:col-span-2 lg:col-span-1"
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
          </div>

          {/* Seção de Dúvidas */}
          <div className="bg-gray-50 rounded-2xl p-8 sm:p-12 border border-gray-200 mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">
              Still not sure?
            </h2>
            
            <div className="grid sm:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  🤔 Don't fit any profile?
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  YLADA works for any professional who wants to better connect with their audience.
                </p>
                <Link 
                  href="/en/templates"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Explore our templates →
                </Link>
              </div>
              
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  💡 Want to see examples?
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  See how other professionals are using YLADA to grow their businesses.
                </p>
                <Link 
                  href="/en/templates"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  View templates →
                </Link>
              </div>
            </div>
          </div>

          {/* CTA Alternativo */}
          <div className="text-center">
            <Link 
              href="/en/templates"
              className="inline-flex items-center px-8 py-4 bg-gray-100 text-gray-700 text-lg font-semibold rounded-xl hover:bg-gray-200 transition-colors"
            >
              <span className="mr-3">📋</span>
              View all available templates
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
