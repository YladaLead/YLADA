'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

interface Receita {
  id: string
  usuario: string
  area: 'nutri' | 'coach' | 'consultor' | 'wellness'
  tipo: 'mensal' | 'anual'
  valor: number
  status: 'ativa' | 'cancelada' | 'expirada'
  dataInicio: string
  proxVencimento: string
  historico: number
}

export default function AdminReceitas() {
  const [filtroArea, setFiltroArea] = useState<'todos' | 'nutri' | 'coach' | 'consultor' | 'wellness'>('todos')
  const [periodo, setPeriodo] = useState<'mes' | 'ano' | 'historico'>('mes')

  const receitas: Receita[] = [
    {
      id: '1',
      usuario: 'Dra. Ana Silva',
      area: 'nutri',
      tipo: 'mensal',
      valor: 97,
      status: 'ativa',
      dataInicio: '2024-01-15',
      proxVencimento: '2024-04-15',
      historico: 291
    },
    {
      id: '2',
      usuario: 'Dr. João Santos',
      area: 'coach',
      tipo: 'anual',
      valor: 997,
      status: 'ativa',
      dataInicio: '2023-12-01',
      proxVencimento: '2024-12-01',
      historico: 997
    },
    {
      id: '3',
      usuario: 'Maria Costa',
      area: 'consultor',
      tipo: 'mensal',
      valor: 97,
      status: 'ativa',
      dataInicio: '2024-02-10',
      proxVencimento: '2024-05-10',
      historico: 291
    },
    {
      id: '4',
      usuario: 'Pedro Oliveira',
      area: 'wellness',
      tipo: 'anual',
      valor: 997,
      status: 'ativa',
      dataInicio: '2023-11-20',
      proxVencimento: '2024-11-20',
      historico: 997
    }
  ]

  const receitasFiltradas = receitas.filter(r => filtroArea === 'todos' || r.area === filtroArea)

  const totalMensal = receitasFiltradas
    .filter(r => r.status === 'ativa')
    .reduce((sum, r) => sum + (r.tipo === 'mensal' ? r.valor : 0), 0)

  const totalAnual = receitasFiltradas
    .filter(r => r.status === 'ativa')
    .reduce((sum, r) => sum + (r.tipo === 'anual' ? r.valor : 0), 0)

  const totalReceitas = totalMensal + totalAnual

  const getAreaIcon = (area: string) => {
    switch (area) {
      case 'nutri': return '🥗'
      case 'coach': return '💜'
      case 'consultor': return '🔬'
      case 'wellness': return '💖'
      default: return '👤'
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ativa':
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Ativa</span>
      case 'cancelada':
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">Cancelada</span>
      case 'expirada':
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Expirada</span>
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/admin">
                <Image
                  src="/images/logo/ylada/horizontal/azul-claro/ylada-horizontal-azul-claro-30.png"
                  alt="YLADA"
                  width={180}
                  height={60}
                  className="h-12"
                />
              </Link>
              <div className="h-12 w-px bg-gray-300"></div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Receitas & Assinaturas</h1>
                <p className="text-sm text-gray-600">Controle financeiro completo por área</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Link
                href="/admin"
                className="text-gray-600 hover:text-gray-900 text-sm px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                ← Voltar
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtros */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Filtro Área */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filtrar por Área</label>
              <div className="flex flex-wrap gap-2">
                {['todos', 'nutri', 'coach', 'consultor', 'wellness'].map((area) => (
                  <button
                    key={area}
                    onClick={() => setFiltroArea(area as any)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filtroArea === area
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {area === 'todos' ? 'Todos' : area.charAt(0).toUpperCase() + area.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Período */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Período</label>
              <div className="flex gap-2">
                {['mes', 'ano', 'historico'].map((p) => (
                  <button
                    key={p}
                    onClick={() => setPeriodo(p as any)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      periodo === p
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {p === 'mes' ? 'Mensal' : p === 'ano' ? 'Anual' : 'Histórico'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Resumo Financeiro */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 shadow-sm border-2 border-green-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Mensal</p>
                <p className="text-3xl font-bold text-green-700">R$ {totalMensal}</p>
              </div>
              <div className="h-12 w-12 bg-green-500 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-2xl text-white">📅</span>
              </div>
            </div>
            <p className="text-xs text-gray-600">
              {receitasFiltradas.filter(r => r.tipo === 'mensal' && r.status === 'ativa').length} assinaturas ativas
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 shadow-sm border-2 border-blue-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Anual</p>
                <p className="text-3xl font-bold text-blue-700">R$ {totalAnual}</p>
              </div>
              <div className="h-12 w-12 bg-blue-500 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-2xl text-white">💎</span>
              </div>
            </div>
            <p className="text-xs text-gray-600">
              {receitasFiltradas.filter(r => r.tipo === 'anual' && r.status === 'ativa').length} assinaturas ativas
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 shadow-sm border-2 border-purple-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Geral</p>
                <p className="text-3xl font-bold text-purple-700">R$ {totalReceitas}</p>
              </div>
              <div className="h-12 w-12 bg-purple-500 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-2xl text-white">💰</span>
              </div>
            </div>
            <p className="text-xs text-gray-600">
              {receitasFiltradas.filter(r => r.status === 'ativa').length} assinaturas
            </p>
          </div>
        </div>

        {/* Lista de Receitas */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuário</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Área</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Próximo Vencimento</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Histórico</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {receitasFiltradas.map((receita) => (
                  <tr key={receita.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{receita.usuario}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-xl mr-2">{getAreaIcon(receita.area)}</span>
                        <span className="text-sm text-gray-900 capitalize">{receita.area}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        receita.tipo === 'mensal' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {receita.tipo === 'mensal' ? 'Mensal' : 'Anual'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">R$ {receita.valor}</div>
                      <div className="text-xs text-gray-500">
                        {receita.tipo === 'mensal' ? '/mês' : '/ano'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(receita.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{receita.proxVencimento}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">R$ {receita.historico}</div>
                      <div className="text-xs text-gray-500">Total pago</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900">Ver</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}

