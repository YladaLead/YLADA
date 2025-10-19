'use client'

import { useState, useEffect } from 'react'
import YLADALogo from '@/components/YLADALogo'
import LanguageSelector from '@/components/LanguageSelector'
import Link from 'next/link'

interface UserProfile {
  id: string
  name: string  // Mudou de 'nome' para 'name'
  email: string
  profession: string  // Mantém em inglês (como está no banco)
  specialization: string  // Mantém em inglês
  target_audience: string  // Mantém em inglês
  main_objective: string  // Mantém em inglês
  subscription_tier: string
}

interface ToolTemplate {
  id: string
  nome: string
  tipo: string
  titulo: string
  descricao: string
  taxa_conversao: number
  leads_gerados: number
}

interface UserTool {
  id: string
  nome: string
  tipo: string
  slug: string
  titulo: string
  views: number
  leads_gerados: number
  taxa_conversao: number
  status: string
  created_at: string
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [recommendedTools, setRecommendedTools] = useState<ToolTemplate[]>([])
  const [userTools, setUserTools] = useState<UserTool[]>([])
  const [loading, setLoading] = useState(true)

  // Mock data - será substituído por dados reais do Supabase
  useEffect(() => {
    // Simular carregamento de dados
    setTimeout(() => {
      setUserProfile({
        id: '550e8400-e29b-41d4-a716-446655440000',  // ID real do Supabase
        name: 'Maria Silva',  // Mudou de 'nome' para 'name'
        email: 'maria@teste.com',
        profession: 'nutricionista',
        specialization: 'emagrecimento',
        target_audience: 'iniciantes',
        main_objective: 'capturar-leads',  // Como está no banco
        subscription_tier: 'pro'
      })

      setRecommendedTools([
        {
          id: '1',
          nome: 'Quiz Perfil Metabólico',
          tipo: 'quiz',
          titulo: 'Descubra seu Perfil Metabólico',
          descricao: 'Identifica o tipo metabólico para personalizar estratégias de emagrecimento',
          taxa_conversao: 35.2,
          leads_gerados: 156
        },
        {
          id: '2',
          nome: 'Calculadora Déficit Calórico',
          tipo: 'calculadora',
          titulo: 'Seu Déficit Calórico Ideal',
          descricao: 'Calcula o déficit calórico perfeito para perda de peso sustentável',
          taxa_conversao: 42.8,
          leads_gerados: 89
        },
        {
          id: '3',
          nome: 'Diagnóstico Relação com Comida',
          tipo: 'diagnostico',
          titulo: 'Avalie sua Relação com a Comida',
          descricao: 'Identifica padrões alimentares e gatilhos emocionais',
          taxa_conversao: 28.5,
          leads_gerados: 67
        }
      ])

      setUserTools([
        {
          id: '1',
          nome: 'Quiz Perfil Metabólico',
          tipo: 'quiz',
          slug: 'quiz-perfil-metabolico',
          titulo: 'Descubra seu Perfil Metabólico',
          views: 245,
          leads_gerados: 87,
          taxa_conversao: 35.5,
          status: 'active',
          created_at: '2024-01-15'
        },
        {
          id: '2',
          nome: 'Calculadora Déficit Calórico',
          tipo: 'calculadora',
          slug: 'calculadora-deficit-calorico',
          titulo: 'Seu Déficit Calórico Ideal',
          views: 189,
          leads_gerados: 81,
          taxa_conversao: 42.9,
          status: 'active',
          created_at: '2024-01-10'
        }
      ])

      setLoading(false)
    }, 1000)
  }, [])

  const mockStats = {
    totalTools: userTools.length,
    totalViews: userTools.reduce((sum, tool) => sum + tool.views, 0),
    totalLeads: userTools.reduce((sum, tool) => sum + tool.leads_gerados, 0),
    avgConversionRate: userTools.length > 0 ? 
      (userTools.reduce((sum, tool) => sum + tool.taxa_conversao, 0) / userTools.length).toFixed(1) : 0
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
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {/* Welcome Section */}
            <div className="mb-8">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
                <h1 className="text-3xl font-bold mb-2">
                  Olá, {userProfile?.name}! 👋
                </h1>
                <div className="flex items-center space-x-4 text-blue-100">
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                    🥗 {userProfile?.profession}
                  </span>
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                    🎯 {userProfile?.specialization}
                  </span>
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                    👥 {userProfile?.target_audience}
                  </span>
                </div>
                <p className="mt-3 text-blue-100">
                  Sua plataforma personalizada para gerar leads qualificados
                </p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <span className="text-blue-600 text-xl">🧩</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Ferramentas Ativas</p>
                    <p className="text-2xl font-bold text-gray-900">{mockStats.totalTools}</p>
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
                    <p className="text-sm font-medium text-gray-600">Conversão Média</p>
                    <p className="text-2xl font-bold text-gray-900">{mockStats.avgConversionRate}%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommended Tools Section */}
            <div className="bg-white rounded-lg shadow-sm mb-8">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  🎯 Ferramentas Recomendadas para Você
                </h2>
                <p className="text-gray-600">
                  Baseado no seu perfil de {userProfile?.profession} especializada em {userProfile?.specialization}
                </p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {recommendedTools.map((tool) => (
                    <div key={tool.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center mb-3">
                        <div className="p-2 bg-blue-100 rounded-lg mr-3">
                          <span className="text-blue-600 text-lg">
                            {tool.tipo === 'quiz' ? '🧩' : 
                             tool.tipo === 'calculadora' ? '🧮' : 
                             tool.tipo === 'diagnostico' ? '📊' : '📋'}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{tool.titulo}</h3>
                          <p className="text-sm text-gray-600">{tool.tipo}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{tool.descricao}</p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-green-600 font-medium">
                          {tool.taxa_conversao}% conversão
                        </span>
                        <span className="text-gray-500">
                          {tool.leads_gerados} leads
                        </span>
                      </div>
                      <Link
                        href={`/create?template=${tool.id}`}
                        className="mt-3 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-center block"
                      >
                        Criar Agora
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'overview'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Minhas Ferramentas
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
                {activeTab === 'overview' && (
                  <div className="space-y-4">
                    {userTools.length > 0 ? (
                      userTools.map((tool) => (
                        <div key={tool.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center mb-2">
                                <div className="p-2 bg-blue-100 rounded-lg mr-3">
                                  <span className="text-blue-600 text-lg">
                                    {tool.tipo === 'quiz' ? '🧩' : 
                                     tool.tipo === 'calculadora' ? '🧮' : 
                                     tool.tipo === 'diagnostico' ? '📊' : '📋'}
                                  </span>
                                </div>
                                <div>
                                  <h3 className="text-lg font-semibold text-gray-900">
                                    {tool.titulo}
                                  </h3>
                                  <p className="text-sm text-gray-600">
                                    {tool.tipo} • Criado em {tool.created_at}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <span>👁️ {tool.views} visualizações</span>
                                <span>📧 {tool.leads_gerados} leads</span>
                                <span className="text-green-600 font-medium">
                                  {tool.taxa_conversao}% conversão
                                </span>
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  tool.status === 'active' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {tool.status === 'active' ? 'Ativo' : 'Inativo'}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <a
                                href={`/link/${tool.slug}`}
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
                                Pausar
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12">
                        <div className="text-gray-400 text-6xl mb-4">🧩</div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          Nenhuma ferramenta criada ainda
                        </h3>
                        <p className="text-gray-600 mb-4">
                          Comece criando sua primeira ferramenta personalizada
                        </p>
                        <Link
                          href="/create"
                          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Criar Primeira Ferramenta
                        </Link>
                      </div>
                    )}
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
          </>
        )}
      </main>
    </div>
  )
}
