'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

interface Usuario {
  id: string
  nome: string
  email: string
  area: 'nutri' | 'coach' | 'consultor' | 'wellness'
  status: 'ativo' | 'inativo' | 'suspenso'
  assinatura: 'mensal' | 'anual' | 'gratuita'
  dataCadastro: string
  leadsGerados: number
  cursosCompletos: number
  tipo: string
}

export default function AdminUsuarios() {
  const [filtroArea, setFiltroArea] = useState<'todos' | 'nutri' | 'coach' | 'consultor' | 'wellness'>('todos')
  const [filtroStatus, setFiltroStatus] = useState<'todos' | 'ativo' | 'inativo' | 'suspenso'>('todos')
  const [busca, setBusca] = useState('')

  const usuarios: Usuario[] = [
    {
      id: '1',
      nome: 'Dra. Ana Silva',
      email: 'ana@nutri.com',
      area: 'nutri',
      status: 'ativo',
      assinatura: 'mensal',
      dataCadastro: '2024-01-15',
      leadsGerados: 42,
      cursosCompletos: 3,
      tipo: 'Nutricionista Registrada'
    },
    {
      id: '2',
      nome: 'Dr. João Santos',
      email: 'joao@coach.com',
      area: 'coach',
      status: 'ativo',
      assinatura: 'anual',
      dataCadastro: '2023-12-01',
      leadsGerados: 58,
      cursosCompletos: 5,
      tipo: 'Coach Certificado'
    },
    {
      id: '3',
      nome: 'Maria Costa',
      email: 'maria@consultor.com',
      area: 'consultor',
      status: 'ativo',
      assinatura: 'mensal',
      dataCadastro: '2024-02-10',
      leadsGerados: 35,
      cursosCompletos: 2,
      tipo: 'Consultor Nutra'
    },
    {
      id: '4',
      nome: 'Pedro Oliveira',
      email: 'pedro@wellness.com',
      area: 'wellness',
      status: 'ativo',
      assinatura: 'anual',
      dataCadastro: '2023-11-20',
      leadsGerados: 76,
      cursosCompletos: 4,
      tipo: 'Distribuidor Herbalife'
    }
  ]

  const usuariosFiltrados = usuarios.filter(u => {
    const matchArea = filtroArea === 'todos' || u.area === filtroArea
    const matchStatus = filtroStatus === 'todos' || u.status === filtroStatus
    const matchBusca = busca === '' || 
      u.nome.toLowerCase().includes(busca.toLowerCase()) ||
      u.email.toLowerCase().includes(busca.toLowerCase())
    return matchArea && matchStatus && matchBusca
  })

  const getAreaIcon = (area: string) => {
    switch (area) {
      case 'nutri': return '🥗'
      case 'coach': return '💜'
      case 'consultor': return '🔬'
      case 'wellness': return '💖'
      default: return '👤'
    }
  }

  const getAreaColor = (area: string) => {
    switch (area) {
      case 'nutri': return 'bg-green-100 text-green-800'
      case 'coach': return 'bg-purple-100 text-purple-800'
      case 'consultor': return 'bg-blue-100 text-blue-800'
      case 'wellness': return 'bg-teal-100 text-teal-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ativo':
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Ativo</span>
      case 'inativo':
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Inativo</span>
      case 'suspenso':
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">Suspenso</span>
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
                  src="/logos/ylada-logo-horizontal-vazado.png"
                  alt="YLADA"
                  width={180}
                  height={60}
                  className="h-12"
                />
              </Link>
              <div className="h-12 w-px bg-gray-300"></div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Usuários</h1>
                <p className="text-sm text-gray-600">Gerencie seus nutricionistas, coaches e consultores</p>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Busca */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
              <input
                type="text"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Nome ou email..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filtro Área */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Área</label>
              <select
                value={filtroArea}
                onChange={(e) => setFiltroArea(e.target.value as any)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="todos">Todos</option>
                <option value="nutri">Nutricionistas</option>
                <option value="coach">Coaches</option>
                <option value="consultor">Consultores</option>
                <option value="wellness">Wellness</option>
              </select>
            </div>

            {/* Filtro Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={filtroStatus}
                onChange={(e) => setFiltroStatus(e.target.value as any)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="todos">Todos</option>
                <option value="ativo">Ativos</option>
                <option value="inativo">Inativos</option>
                <option value="suspenso">Suspensos</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Total</p>
            <p className="text-2xl font-bold text-gray-900">{usuarios.length}</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Ativos</p>
            <p className="text-2xl font-bold text-green-600">{usuarios.filter(u => u.status === 'ativo').length}</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Inativos</p>
            <p className="text-2xl font-bold text-gray-600">{usuarios.filter(u => u.status === 'inativo').length}</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Mostrando</p>
            <p className="text-2xl font-bold text-blue-600">{usuariosFiltrados.length}</p>
          </div>
        </div>

        {/* Lista de Usuários */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuário</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Área</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assinatura</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leads</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {usuariosFiltrados.map((usuario) => (
                  <tr key={usuario.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                          {usuario.nome.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{usuario.nome}</div>
                          <div className="text-sm text-gray-500">{usuario.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-xl mr-2">{getAreaIcon(usuario.area)}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getAreaColor(usuario.area)} capitalize`}>
                          {usuario.area}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(usuario.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 capitalize">{usuario.assinatura}</div>
                      <div className="text-xs text-gray-500">{usuario.dataCadastro}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{usuario.leadsGerados}</div>
                      <div className="text-xs text-gray-500">{usuario.cursosCompletos} cursos</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-4">Editar</button>
                      <button className="text-gray-600 hover:text-gray-900">Ver</button>
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

