'use client'

import { useState } from 'react'
import { 
  BarChart3, 
  Users, 
  Link, 
  TrendingUp, 
  Settings, 
  Plus, 
  Copy, 
  Eye,
  Download,
  Star,
  Gift,
  Target,
  ArrowRight,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview')

  const stats = {
    totalLeads: 247,
    thisMonth: 89,
    conversionRate: 23.5,
    revenue: 12450
  }

  const tools = [
    {
      id: 'bmi',
      name: 'Calculadora de IMC',
      description: 'Análise corporal completa',
      leads: 45,
      conversion: 18,
      status: 'active'
    },
    {
      id: 'protein',
      name: 'Necessidades Proteicas',
      description: 'Cálculo de proteína diária',
      leads: 32,
      conversion: 12,
      status: 'active'
    },
    {
      id: 'body-composition',
      name: 'Composição Corporal',
      description: 'Avaliação de massa muscular',
      leads: 28,
      conversion: 8,
      status: 'active'
    },
    {
      id: 'meal-planner',
      name: 'Planejador de Refeições',
      description: 'Cardápio personalizado',
      leads: 19,
      conversion: 6,
      status: 'draft'
    },
    {
      id: 'hydration',
      name: 'Monitor de Hidratação',
      description: 'Controle de água diária',
      leads: 15,
      conversion: 4,
      status: 'draft'
    },
    {
      id: 'nutrition-assessment',
      name: 'Avaliação Nutricional',
      description: 'Identificação de deficiências',
      leads: 12,
      conversion: 3,
      status: 'draft'
    }
  ]

  const recentLeads = [
    {
      id: 1,
      name: 'Maria Silva',
      email: 'maria@email.com',
      phone: '(11) 99999-9999',
      tool: 'Calculadora de IMC',
      date: '2024-01-15',
      status: 'new'
    },
    {
      id: 2,
      name: 'João Santos',
      email: 'joao@email.com',
      phone: '(11) 88888-8888',
      tool: 'Necessidades Proteicas',
      date: '2024-01-15',
      status: 'contacted'
    },
    {
      id: 3,
      name: 'Ana Costa',
      email: 'ana@email.com',
      phone: '(11) 77777-7777',
      tool: 'Composição Corporal',
      date: '2024-01-14',
      status: 'converted'
    }
  ]

  const generateShareableLink = (toolId: string) => {
    const baseUrl = 'https://ylara.app'
    const link = `${baseUrl}/tools/${toolId}?ref=your-id`
    navigator.clipboard.writeText(link)
    alert('Link copiado para a área de transferência!')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-600 to-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">Y</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">YLADA Dashboard</h1>
                <p className="text-sm text-gray-600">Painel de controle para profissionais de bem-estar</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                <Plus className="w-4 h-4 mr-2 inline" />
                Nova Ferramenta
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Leads</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalLeads}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              +12% este mês
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Leads Este Mês</p>
                <p className="text-3xl font-bold text-gray-900">{stats.thisMonth}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-blue-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              +8% vs mês anterior
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Taxa de Conversão</p>
                <p className="text-3xl font-bold text-gray-900">{stats.conversionRate}%</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-yellow-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              +2.3% este mês
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Receita Gerada</p>
                <p className="text-3xl font-bold text-gray-900">R$ {stats.revenue.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Gift className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              +15% este mês
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Visão Geral
              </button>
              <button
                onClick={() => setActiveTab('tools')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'tools'
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Ferramentas
              </button>
              <button
                onClick={() => setActiveTab('leads')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'leads'
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Leads
              </button>
              <button
                onClick={() => setActiveTab('rewards')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'rewards'
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Recompensas
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo das Ferramentas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {tools.slice(0, 3).map((tool) => (
                    <div key={tool.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{tool.name}</h4>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          tool.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {tool.status === 'active' ? 'Ativo' : 'Rascunho'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{tool.description}</p>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">{tool.leads} leads</span>
                        <span className="text-emerald-600">{tool.conversion} conversões</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'tools' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Suas Ferramentas</h3>
                  <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                    <Plus className="w-4 h-4 mr-2 inline" />
                    Criar Nova Ferramenta
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {tools.map((tool) => (
                    <div key={tool.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-gray-900">{tool.name}</h4>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          tool.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {tool.status === 'active' ? 'Ativo' : 'Rascunho'}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-4">{tool.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-gray-900">{tool.leads}</p>
                          <p className="text-xs text-gray-600">Leads</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-emerald-600">{tool.conversion}</p>
                          <p className="text-xs text-gray-600">Conversões</p>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={() => generateShareableLink(tool.id)}
                          className="flex-1 px-3 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition-colors"
                        >
                          <Copy className="w-4 h-4 mr-1 inline" />
                          Copiar Link
                        </button>
                        <button className="px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'leads' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Leads Recentes</h3>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    <Download className="w-4 h-4 mr-2 inline" />
                    Exportar
                  </button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nome
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Contato
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ferramenta
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Data
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {recentLeads.map((lead) => (
                        <tr key={lead.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {lead.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div>
                              <div>{lead.email}</div>
                              <div>{lead.phone}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {lead.tool}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {lead.date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              lead.status === 'new' 
                                ? 'bg-blue-100 text-blue-800'
                                : lead.status === 'contacted'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {lead.status === 'new' ? 'Novo' : lead.status === 'contacted' ? 'Contatado' : 'Convertido'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'rewards' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Sistema de Recompensas</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="border border-gray-200 rounded-lg p-6 text-center">
                    <div className="w-16 h-16 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Star className="w-8 h-8 text-yellow-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Bronze</h4>
                    <p className="text-sm text-gray-600 mb-4">10 leads gerados</p>
                    <div className="bg-yellow-50 rounded-lg p-3">
                      <p className="text-sm font-medium text-yellow-800">Desconto 20% em ferramentas</p>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-6 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Star className="w-8 h-8 text-gray-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Prata</h4>
                    <p className="text-sm text-gray-600 mb-4">50 leads gerados</p>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm font-medium text-gray-800">Acesso premium gratuito</p>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-6 text-center">
                    <div className="w-16 h-16 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Star className="w-8 h-8 text-yellow-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Ouro</h4>
                    <p className="text-sm text-gray-600 mb-4">100 leads gerados</p>
                    <div className="bg-yellow-50 rounded-lg p-3">
                      <p className="text-sm font-medium text-yellow-800">Consultoria gratuita</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 bg-emerald-50 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <Gift className="w-6 h-6 text-emerald-600 mr-2" />
                    <h4 className="font-semibold text-gray-900">Seu Progresso</h4>
                  </div>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Leads gerados: {stats.totalLeads}</span>
                      <span>Meta: 100</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(stats.totalLeads / 100) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Você está no nível <strong>Bronze</strong>. Continue gerando leads para desbloquear mais recompensas!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
