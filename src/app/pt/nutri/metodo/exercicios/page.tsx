'use client'

import Link from 'next/link'
import FormacaoHeader from '@/components/formacao/FormacaoHeader'

export default function ExerciciosPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <FormacaoHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/pt/nutri/metodo"
            className="text-blue-600 hover:text-blue-700 text-sm mb-4 inline-block"
          >
            ← Voltar para o Método YLADA
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Exercícios YLADA
          </h1>
          <p className="text-lg text-gray-700">
            Ações práticas que você aplica no mesmo dia. Cada exercício tem um objetivo claro e uma ação imediata.
          </p>
        </div>

        {/* Placeholder */}
        <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
          <div className="text-6xl mb-4">💪</div>
          <p className="text-gray-600 mb-2">Exercícios YLADA</p>
          <p className="text-sm text-gray-500">
            Os exercícios serão listados aqui. Por enquanto, acesse-os através da Jornada de 30 Dias.
          </p>
          <Link
            href="/pt/nutri/metodo/jornada"
            className="mt-6 inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Ver Jornada de 30 Dias →
          </Link>
        </div>
      </div>
    </div>
  )
}

