'use client'

import { useState } from 'react'
import YLADALogo from '@/components/YLADALogo'
import LanguageSelector from '@/components/LanguageSelector'
import Link from 'next/link'

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('links')

  // Mock data - depois será integrado com Supabase
  const mockLinks = [
    {
      id: 1,
      title: 'Quiz de Energia Matinal',
      url: 'https://ylada.com/l/abc123',
      category: 'Energia & Foco',
      type: 'Quiz',
      createdAt: '2024-01-15',
      views: 45,
      leads: 12,
      status: 'active'
    },
    {
      id: 2,
      title: 'Tabela de Metas Semanais',
      url: 'https://ylada.com/l/def456',
      category: 'Fitness & Saúde',
      type: 'Tabela',
      createdAt: '2024-01-14',
      views: 23,
      leads: 8,
      status: 'active'
    }
  ]

  const mockStats = {
    totalLinks: 2,
    totalViews: 68,
    totalLeads: 20,
    conversionRate: 29.4
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <YLADALogo />
          </Link>
          <div className="flex items-center space-x-4">
            <LanguageSelector />
            <Link
              href="/create"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Criar Novo Link
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Meu Dashboard
          </h1>
          <p className="text-gray-600">
            Gerencie seus links e acompanhe o desempenho
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-blue-600 text-xl">🔗</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total de Links</p>
                <p className="text-2xl font-bold text-gray-900">{mockStats.totalLinks}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-green-600 text-xl">👁️</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Visualizações</p>
                <p className="text-2xl font-bold text-gray-900">{mockStats.totalViews}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-purple-600 text-xl">📧</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Leads Gerados</p>
                <p className="text-2xl font-bold text-gray-900">{mockStats.totalLeads}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <span className="text-orange-600 text-xl">📊</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Taxa de Conversão</p>
                <p className="text-2xl font-bold text-gray-900">{mockStats.conversionRate}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('links')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'links'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Meus Links
              </button>
              <button
                onClick={() => setActiveTab('leads')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'leads'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Leads Capturados
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'analytics'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Analytics
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'links' && (
              <div className="space-y-4">
                {mockLinks.map((link) => (
                  <div key={link.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {link.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {link.category} • {link.type} • Criado em {link.createdAt}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>👁️ {link.views} visualizações</span>
                          <span>📧 {link.leads} leads</span>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            link.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {link.status === 'active' ? 'Ativo' : 'Inativo'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                        >
                          Ver
                        </a>
                        <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                          Editar
                        </button>
                        <button className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors">
                          Excluir
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'leads' && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📧</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Leads Capturados
                </h3>
                <p className="text-gray-600">
                  Aqui você verá todos os leads gerados pelos seus links
                </p>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📊</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Analytics Detalhados
                </h3>
                <p className="text-gray-600">
                  Gráficos e métricas detalhadas dos seus links
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
