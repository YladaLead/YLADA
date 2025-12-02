'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import FormacaoHeader from '@/components/formacao/FormacaoHeader'

export default function FerramentaPage() {
  const params = useParams()
  const ferramentaId = params.id as string

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <FormacaoHeader />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/pt/nutri/metodo/ferramentas"
            className="text-blue-600 hover:text-blue-700 text-sm"
          >
            ← Voltar para Ferramentas
          </Link>
        </div>

        {/* Header */}
        <div className="bg-white rounded-xl p-6 mb-6 shadow-md border border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Ferramenta YLADA
          </h1>
          <p className="text-gray-600">ID: {ferramentaId}</p>
        </div>

        {/* Placeholder */}
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
          <p className="text-gray-600 mb-4">
            Conteúdo da ferramenta será preenchido em breve.
          </p>
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Descrição</h3>
              <p className="text-gray-600">Descrição da ferramenta...</p>
            </div>
            <div>
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                Baixar PDF
              </button>
            </div>
          </div>
        </div>

        {/* Navegação */}
        <div className="mt-8 flex items-center justify-between">
          <Link
            href="/pt/nutri/metodo/jornada"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Voltar para a Jornada
          </Link>
        </div>
      </div>
    </div>
  )
}

