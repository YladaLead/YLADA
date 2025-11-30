'use client'

import { useState } from 'react'
import Link from 'next/link'
import WellnessNavBar from '@/components/wellness/WellnessNavBar'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { fluxosClientes } from '@/lib/wellness-system/fluxos-clientes'
import { FluxoCliente } from '@/types/wellness-system'

function FluxosClientesPageContent() {
  const [filtro, setFiltro] = useState<'todos' | 'energia' | 'acelera'>('todos')
  const [busca, setBusca] = useState('')

  const fluxosFiltrados = fluxosClientes.filter(fluxo => {
    const matchFiltro = filtro === 'todos' || fluxo.kitRecomendado === filtro || (filtro === 'energia' && fluxo.kitRecomendado === 'ambos') || (filtro === 'acelera' && fluxo.kitRecomendado === 'ambos')
    const matchBusca = busca === '' || fluxo.nome.toLowerCase().includes(busca.toLowerCase()) || fluxo.tags.some(tag => tag.toLowerCase().includes(busca.toLowerCase()))
    return matchFiltro && matchBusca
  })

  const getKitEmoji = (kit: string) => {
    if (kit === 'energia') return '⚡'
    if (kit === 'acelera') return '🌿'
    return '⚡🌿'
  }

  const getKitCor = (kit: string) => {
    if (kit === 'energia') return 'bg-yellow-100 border-yellow-300'
    if (kit === 'acelera') return 'bg-green-100 border-green-300'
    return 'bg-purple-100 border-purple-300'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <WellnessNavBar showTitle title="Fluxos de Clientes" />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cabeçalho */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Fluxos de Clientes
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Escolha um fluxo para começar o diagnóstico e direcionar o cliente para o kit ideal
          </p>
        </div>

        {/* Filtros e Busca */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            {/* Busca */}
            <input
              type="text"
              placeholder="Buscar fluxo..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            
            {/* Filtros */}
            <div className="flex gap-2">
              <button
                onClick={() => setFiltro('todos')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filtro === 'todos'
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setFiltro('energia')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filtro === 'energia'
                    ? 'bg-yellow-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                ⚡ Energia
              </button>
              <button
                onClick={() => setFiltro('acelera')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filtro === 'acelera'
                    ? 'bg-green-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                🌿 Acelera
              </button>
            </div>
          </div>
        </div>

        {/* Grid de Fluxos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-7xl mx-auto">
          {fluxosFiltrados.map((fluxo) => (
            <Link
              key={fluxo.id}
              href={`/pt/wellness/system/vender/fluxos/${fluxo.id}`}
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
                <span className="text-2xl ml-2">
                  {getKitEmoji(fluxo.kitRecomendado)}
                </span>
              </div>
              
              <div className="flex items-center justify-between mt-4">
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${getKitCor(fluxo.kitRecomendado)}`}>
                  {fluxo.kitRecomendado === 'energia' && 'Kit Energia'}
                  {fluxo.kitRecomendado === 'acelera' && 'Kit Acelera'}
                  {fluxo.kitRecomendado === 'ambos' && 'Ambos'}
                </div>
                <span className="text-sm text-gray-500">
                  {fluxo.perguntas.length} perguntas
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

export default function FluxosClientesPage() {
  return (
    <ProtectedRoute perfil="wellness" allowAdmin={true}>
      <FluxosClientesPageContent />
    </ProtectedRoute>
  )
}

