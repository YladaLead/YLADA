'use client'

import WellnessNavBar from '@/components/wellness/WellnessNavBar'
import Link from 'next/link'

export default function RecrutarScriptsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <WellnessNavBar showTitle title="Scripts de Recrutamento" />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Scripts de Recrutamento
              </h1>
              <p className="text-gray-600">
                Em breve: Biblioteca completa de scripts de recrutamento
              </p>
            </div>
            
            <div className="text-center">
              <Link
                href="/pt/wellness/system"
                className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                ← Voltar ao Sistema
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

