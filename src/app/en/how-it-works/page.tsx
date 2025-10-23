'use client'

import Link from 'next/link'
import YLADALogo from '../../../components/YLADALogo'
import LanguageSelector from '../../../components/LanguageSelector'
import { useTranslations } from '../../../hooks/useTranslations'

export default function HowItWorksPageEN() {
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
            {t.howItWorks.title}
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            {t.howItWorks.subtitle}
          </p>

          {/* Passos */}
          <div className="grid sm:grid-cols-3 gap-8 mb-16">
            
            {/* Passo 1 */}
            <div className="bg-white border border-gray-200 rounded-2xl p-8 hover:border-blue-300 hover:shadow-lg transition-all duration-300">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl text-blue-600">📋</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {t.howItWorks.steps.step1.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {t.howItWorks.steps.step1.description}
                </p>
              </div>
            </div>

            {/* Passo 2 */}
            <div className="bg-white border border-gray-200 rounded-2xl p-8 hover:border-green-300 hover:shadow-lg transition-all duration-300">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl text-green-600">⚡</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {t.howItWorks.steps.step2.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {t.howItWorks.steps.step2.description}
                </p>
              </div>
            </div>

            {/* Passo 3 */}
            <div className="bg-white border border-gray-200 rounded-2xl p-8 hover:border-purple-300 hover:shadow-lg transition-all duration-300">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl text-purple-600">🚀</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {t.howItWorks.steps.step3.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {t.howItWorks.steps.step3.description}
                </p>
              </div>
            </div>
          </div>

          {/* Demonstração Visual */}
          <div className="bg-gray-50 rounded-2xl p-8 sm:p-12 border border-gray-200 mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">
              See YLADA in Action
            </h2>
            
            <div className="grid sm:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  🎯 Before YLADA
                </h3>
                <ul className="text-gray-600 text-sm space-y-2">
                  <li>• Generic links without personalization</li>
                  <li>• No data about your visitors</li>
                  <li>• Complex and expensive tools</li>
                  <li>• Time wasted on configurations</li>
                </ul>
              </div>
              
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  ✨ With YLADA
                </h3>
                <ul className="text-gray-600 text-sm space-y-2">
                  <li>• Smart and personalized links</li>
                  <li>• Detailed real-time data</li>
                  <li>• Simple and effective tools</li>
                  <li>• Results in 60 seconds</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Exemplos Práticos */}
          <div className="mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">
              Real Examples
            </h2>
            
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl text-green-600">🥗</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 text-center">
                  Nutritionist
                </h3>
                <p className="text-gray-600 text-sm text-center">
                  Metabolic profile quiz that qualifies leads and automatically schedules consultations.
                </p>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl text-blue-600">💊</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 text-center">
                  Sales Rep
                </h3>
                <p className="text-gray-600 text-sm text-center">
                  Needs calculator that increases conversions by 300% and qualifies customers.
                </p>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl text-purple-600">🧘‍♀️</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 text-center">
                  Coach
                </h3>
                <p className="text-gray-600 text-sm text-center">
                  Wellness assessment that engages clients and increases retention by 250%.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Principal */}
          <div className="text-center mb-8">
            <Link 
              href="/en/profile-selection"
              className="inline-flex items-center px-8 sm:px-12 py-4 sm:py-5 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-lg sm:text-xl font-bold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <span className="mr-3 text-lg">🚀</span>
              {t.howItWorks.cta}
            </Link>
          </div>

          {/* CTA Secundário */}
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
