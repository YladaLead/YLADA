'use client'

import Link from 'next/link'
import WellnessNavBar from '@/components/wellness/WellnessNavBar'

export default function WellnessCursosPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <WellnessNavBar showTitle={true} title="Trilha de Aprendizado" />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 sm:p-12 text-center">
          {/* Ícone */}
          <div className="mb-6">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <span className="text-5xl">🚧</span>
            </div>
          </div>

          {/* Título */}
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Trilha de Aprendizado
          </h1>

          {/* Mensagem */}
          <p className="text-lg sm:text-xl text-gray-600 mb-2">
            Em construção
          </p>
          <p className="text-base text-gray-500">
            Em breve você terá acesso a uma trilha completa de aprendizado.
          </p>
        </div>
      </main>
    </div>
  )
}
