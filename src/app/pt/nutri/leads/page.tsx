'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function NutriLeads() {
  const [filtroStatus, setFiltroStatus] = useState('todos')
  const [filtroFerramenta, setFiltroFerramenta] = useState('todas')
  const [busca, setBusca] = useState('')

  const leads = [
    {
      id: 1,
      nome: 'Maria Silva',
      email: 'maria@email.com',
      telefone: '(11) 99999-9999',
      idade: 28,
      cidade: 'São Paulo',
      ferramenta: 'Quiz Interativo',
      resultado: 'Metabolismo Rápido',
      status: 'novo',
      data: '2024-01-15',
      ultimoContato: null,
      observacoes: 'Interessada em emagrecimento',
      score: 85
    },
    {
      id: 2,
      nome: 'João Santos',
      email: 'joao@email.com',
      telefone: '(11) 88888-8888',
      idade: 35,
      cidade: 'Rio de Janeiro',
      ferramenta: 'Calculadora de IMC',
      resultado: 'IMC: 28.5 (Sobrepeso)',
      status: 'contatado',
      data: '2024-01-14',
      ultimoContato: '2024-01-16',
      observacoes: 'Agendou consulta para próxima semana',
      score: 92
    },
    {
      id: 3,
      nome: 'Ana Costa',
      email: 'ana@email.com',
      telefone: '(11) 77777-7777',
      idade: 24,
      cidade: 'Belo Horizonte',
      ferramenta: 'Post de Curiosidades',
      resultado: 'Interesse em Detox',
      status: 'convertido',
      data: '2024-01-13',
      ultimoContato: '2024-01-15',
      observacoes: 'Primeira consulta realizada',
      score: 78
    },
    {
      id: 4,
      nome: 'Carlos Oliveira',
      email: 'carlos@email.com',
      telefone: '(11) 66666-6666',
      idade: 42,
      cidade: 'Salvador',
      ferramenta: 'Quiz Interativo',
      resultado: 'Metabolismo Lento',
      status: 'novo',
      data: '2024-01-12',
      ultimoContato: null,
      observacoes: 'Busca por ganho de massa muscular',
      score: 73
    },
    {
      id: 5,
      nome: 'Fernanda Lima',
      email: 'fernanda@email.com',
      telefone: '(11) 55555-5555',
      idade: 31,
      cidade: 'Porto Alegre',
      ferramenta: 'Template Post Dica',
      resultado: 'Interesse em Alimentação Saudável',
      status: 'contatado',
      data: '2024-01-11',
      ultimoContato: '2024-01-14',
      observacoes: 'Aguardando retorno',
      score: 88
    }
  ]

  const status = ['todos', 'novo', 'contatado', 'convertido', 'perdido']
  const ferramentas = ['todas', 'Quiz Interativo', 'Calculadora de IMC', 'Post de Curiosidades', 'Template Post Dica']

  const leadsFiltrados = leads.filter(lead => {
    const statusMatch = filtroStatus === 'todos' || lead.status === filtroStatus
    const ferramentaMatch = filtroFerramenta === 'todas' || lead.ferramenta === filtroFerramenta
    const buscaMatch = busca === '' || 
      lead.nome.toLowerCase().includes(busca.toLowerCase()) ||
      lead.email.toLowerCase().includes(busca.toLowerCase()) ||
      lead.cidade.toLowerCase().includes(busca.toLowerCase())
    
    return statusMatch && ferramentaMatch && buscaMatch
  })

  const getStatusClasses = (status: string) => {
    const statusClasses = {
      novo: 'bg-blue-100 text-blue-800',
      contatado: 'bg-yellow-100 text-yellow-800',
      convertido: 'bg-green-100 text-green-800',
      perdido: 'bg-red-100 text-red-800'
    }
    return statusClasses[status as keyof typeof statusClasses] || statusClasses.novo
  }

  const getScoreClasses = (score: number) => {
    if (score >= 90) return 'bg-green-100 text-green-800'
    if (score >= 80) return 'bg-blue-100 text-blue-800'
    if (score >= 70) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/pt/nutri/dashboard">
                <Image
                  src="/logos/ylada-logo-horizontal-vazado.png"
                  alt="YLADA"
                  width={120}
                  height={40}
                  className="h-8 w-auto"
                />
              </Link>
              <div className="h-8 w-px bg-gray-300"></div>
              <h1 className="text-xl font-semibold text-gray-900">
                Leads NUTRI
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/pt/nutri/dashboard"
                className="text-gray-600 hover:text-gray-900"
              >
                ← Voltar ao Dashboard
              </Link>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Exportar Leads
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Leads</p>
                <p className="text-3xl font-bold text-gray-900">{leads.length}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Novos</p>
                <p className="text-3xl font-bold text-blue-600">{leads.filter(l => l.status === 'novo').length}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🆕</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Contatados</p>
                <p className="text-3xl font-bold text-yellow-600">{leads.filter(l => l.status === 'contatado').length}</p>
              </div>
              <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📞</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Convertidos</p>
                <p className="text-3xl font-bold text-green-600">{leads.filter(l => l.status === 'convertido').length}</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar
              </label>
              <input
                type="text"
                placeholder="Nome, email ou cidade..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filtroStatus}
                onChange={(e) => setFiltroStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {status.map(statusItem => (
                  <option key={statusItem} value={statusItem}>
                    {statusItem === 'todos' ? 'Todos os status' : statusItem}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ferramenta
              </label>
              <select
                value={filtroFerramenta}
                onChange={(e) => setFiltroFerramenta(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {ferramentas.map(ferramenta => (
                  <option key={ferramenta} value={ferramenta}>
                    {ferramenta === 'todas' ? 'Todas as ferramentas' : ferramenta}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Lista de Leads */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Leads ({leadsFiltrados.length})
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lead
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contato
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ferramenta
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Resultado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leadsFiltrados.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{lead.nome}</div>
                        <div className="text-sm text-gray-500">{lead.idade} anos • {lead.cidade}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-gray-900">{lead.email}</div>
                        <div className="text-sm text-gray-500">{lead.telefone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{lead.ferramenta}</div>
                      <div className="text-sm text-gray-500">{lead.data}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{lead.resultado}</div>
                      <div className="text-sm text-gray-500">{lead.observacoes}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusClasses(lead.status)}`}>
                        {lead.status}
                      </span>
                      {lead.ultimoContato && (
                        <div className="text-xs text-gray-500 mt-1">
                          Último contato: {lead.ultimoContato}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getScoreClasses(lead.score)}`}>
                        {lead.score}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          Contatar
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                          Ver Detalhes
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Ações Rápidas */}
        <div className="mt-8 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              <span className="text-2xl mr-3">📧</span>
              <div>
                <h3 className="font-medium text-gray-900">Campanha de Email</h3>
                <p className="text-sm text-gray-600">Enviar email para leads selecionados</p>
              </div>
            </button>
            
            <button className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
              <span className="text-2xl mr-3">📊</span>
              <div>
                <h3 className="font-medium text-gray-900">Relatório de Leads</h3>
                <p className="text-sm text-gray-600">Gerar relatório detalhado</p>
              </div>
            </button>
            
            <button className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
              <span className="text-2xl mr-3">🎯</span>
              <div>
                <h3 className="font-medium text-gray-900">Segmentação</h3>
                <p className="text-sm text-gray-600">Criar segmentos de leads</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
