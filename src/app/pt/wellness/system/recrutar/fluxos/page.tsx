'use client'

import { useState } from 'react'
import Link from 'next/link'
import WellnessNavBar from '@/components/wellness/WellnessNavBar'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { fluxosRecrutamento } from '@/lib/wellness-system/fluxos-recrutamento'

function FluxosRecrutamentoPageContent() {
  const [busca, setBusca] = useState('')

  const fluxosFiltrados = fluxosRecrutamento.filter(fluxo => {
    return busca === '' || 
           fluxo.nome.toLowerCase().includes(busca.toLowerCase()) || 
           fluxo.tags.some(tag => tag.toLowerCase().includes(busca.toLowerCase()))
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <WellnessNavBar showTitle title="Fluxos de Recrutamento" />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Botão Voltar ao Sistema - Bem visível no topo */}
        <div className="mb-6">
          <Link
            href="/pt/wellness/system"
            className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Voltar ao Sistema</span>
          </Link>
        </div>

        {/* Cabeçalho */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Fluxos de Recrutamento
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Escolha um fluxo para identificar pessoas com potencial de interesse em participar de apresentações de negócio
          </p>
        </div>

        {/* Busca */}
        <div className="max-w-4xl mx-auto mb-8">
          <input
            type="text"
            placeholder="Buscar fluxo..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Grid de Fluxos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-7xl mx-auto">
          {fluxosFiltrados.map((fluxo) => (
            <Link
              key={fluxo.id}
              href={`/pt/wellness/system/recrutar/fluxos/${fluxo.id}`}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {fluxo.nome}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {fluxo.objetivo}
                  </p>
                </div>
                <span className="text-2xl ml-2">👥</span>
              </div>
              
              <div className="flex items-center justify-between mt-4">
                <span className="text-sm text-gray-500">
                  {fluxo.perguntas.length} perguntas
                </span>
                <span className="text-xs text-blue-600 font-medium">
                  Ver fluxo →
                </span>
              </div>
            </Link>
          ))}
        </div>

        {fluxosFiltrados.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">
              Nenhum fluxo encontrado com os filtros selecionados.
            </p>
          </div>
        )}

        {/* Voltar */}
        <div className="text-center mt-8">
          <Link
            href="/pt/wellness/system"
            className="inline-flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            ← Voltar ao Sistema
          </Link>
        </div>
      </main>
    </div>
  )
}

export default function FluxosRecrutamentoPage() {
  return (
    <ProtectedRoute perfil="wellness" allowAdmin={true}>
      <FluxosRecrutamentoPageContent />
    </ProtectedRoute>
  )
}
