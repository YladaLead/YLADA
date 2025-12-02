'use client'

import Link from 'next/link'
import FormacaoHeader from '@/components/formacao/FormacaoHeader'
import { pilaresConfig } from '@/types/pilares'

const coresPilares = [
  'from-blue-600 to-indigo-600',
  'from-purple-600 to-pink-600',
  'from-green-600 to-teal-600',
  'from-orange-600 to-red-600',
  'from-indigo-600 to-purple-600'
]

export default function PilaresPage() {
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
            Pilares do Método YLADA
          </h1>
          <p className="text-lg text-gray-700">
            Os 5 fundamentos que estruturam sua transformação em Nutri-Empresária.
          </p>
        </div>

        {/* Grid de Pilares */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pilaresConfig.map((pilar, index) => (
            <Link
              key={pilar.id}
              href={`/pt/nutri/metodo/pilares/${pilar.id}`}
              className="bg-white rounded-xl p-6 shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              <div className={`w-16 h-16 bg-gradient-to-r ${coresPilares[index]} rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4`}>
                {pilar.numero}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Pilar {pilar.numero} — {pilar.nome}
              </h3>
              {pilar.subtitulo && (
                <p className="text-sm text-gray-500 mb-2 italic">
                  {pilar.subtitulo}
                </p>
              )}
              <p className="text-gray-600 text-sm mb-4">
                {pilar.descricao_curta || 'Descrição será preenchida em breve.'}
              </p>
              <div className="text-blue-600 font-medium text-sm">
                Acessar Pilar →
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

