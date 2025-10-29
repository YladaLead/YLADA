'use client'

import { useState, useEffect } from 'react'
import YLADALogo from '@/components/YLADALogo'
import LanguageSelector from '@/components/LanguageSelector'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

// Configuração do Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

interface UserProfile {
  id: string
  name: string
  email: string
  profession: string
  specialization: string
  target_audience: string
  main_objective: string
  subscription_tier: string
}

interface ToolTemplate {
  id: string
  name: string
  type: string
  profession: string
  specialization: string
  objective: string
  description: string
  usage_count: number
  avg_conversion_rate: string
}

interface UserTool {
  id: string
  name: string
  type: string
  slug: string
  title: string
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
  const [error, setError] = useState<string | null>(null)

  // Carregar dados reais do Supabase
  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Verificar se as variáveis de ambiente estão configuradas
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.warn('Variáveis do Supabase não configuradas, usando dados mock')
        throw new Error('Supabase não configurado')
      }

      // ID do usuário de teste
      const userId = '550e8400-e29b-41d4-a716-446655440000'

      // Carregar perfil do usuário
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (userError) throw userError

      // Carregar perfil detalhado
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (profileError) throw profileError

      // Combinar dados do usuário e perfil
      const fullProfile: UserProfile = {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        profession: profileData.profession,
        specialization: profileData.specialization,
        target_audience: profileData.target_audience,
        main_objective: profileData.main_objective,
        subscription_tier: userData.subscription_tier
      }

      setUserProfile(fullProfile)

      // Carregar templates recomendados baseados no perfil
      const { data: templatesData, error: templatesError } = await supabase
        .from('templates_base')
        .select('*')
        .eq('profession', profileData.profession)
        .eq('is_active', true)
        .order('usage_count', { ascending: false })

      if (templatesError) throw templatesError

      // Transformar templates para o formato esperado
      const templates: ToolTemplate[] = templatesData.map(template => ({
        id: template.id,
        name: template.name,
        type: template.type,
        profession: template.profession,
        specialization: template.specialization,
        objective: template.objective,
        description: template.description,
        usage_count: template.usage_count,
        avg_conversion_rate: template.avg_conversion_rate
      }))

      setRecommendedTools(templates)

      // Carregar ferramentas criadas pelo usuário (mock por enquanto)
      setUserTools([
        {
          id: '1',
          name: 'Quiz Perfil Metabólico',
          type: 'quiz',
          slug: 'quiz-perfil-metabolico',
          title: 'Descubra seu Perfil Metabólico',
          views: 245,
          leads_gerados: 87,
          taxa_conversao: 35.5,
          status: 'active',
          created_at: '2024-01-15'
        }
      ])

    } catch (err) {
      console.error('Erro ao carregar dados:', err)
      
      // SEMPRE usar dados mock em caso de erro
      console.log('Usando dados mock...')
      
      setUserProfile({
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'Maria Silva',
        email: 'maria@teste.com',
        profession: 'nutricionista',
        specialization: 'emagrecimento',
        target_audience: 'iniciantes',
        main_objective: 'capturar-leads',
        subscription_tier: 'pro'
      })

      setRecommendedTools([
        {
          id: 'de9154df-cde2-4bd4-a3c6-655cd917549f',
          name: 'Quiz de Perfil de Energia',
          type: 'quiz',
          profession: 'nutricionista',
          specialization: 'emagrecimento',
          objective: 'capturar-leads',
          description: 'Descubra seu tipo de energia e necessidades nutricionais',
          usage_count: 0,
          avg_conversion_rate: '0.00'
        },
        {
          id: '4ad6cee1-d154-4a5b-b1ae-0f2141a49909',
          name: 'Calculadora de Equilíbrio',
          type: 'calculator',
          profession: 'nutricionista',
          specialization: 'bem-estar',
          objective: 'capturar-leads',
          description: 'Calcule seu índice de equilíbrio corpo e mente',
          usage_count: 0,
          avg_conversion_rate: '0.00'
        },
        {
          id: '1789dfa4-56af-4132-a6f7-8f4cbc4e9bc5',
          name: 'Checklist de Rotina Saudável',
          type: 'checklist',
          profession: 'nutricionista',
          specialization: 'habitos',
          objective: 'capturar-leads',
          description: '10 sinais de que você precisa mudar sua rotina',
          usage_count: 0,
          avg_conversion_rate: '0.00'
        }
      ])

      setUserTools([
        {
          id: '1',
          name: 'Quiz Perfil Metabólico',
          type: 'quiz',
          slug: 'quiz-perfil-metabolico',
          title: 'Descubra seu Perfil Metabólico',
          views: 245,
          leads_gerados: 87,
          taxa_conversao: 35.5,
          status: 'active',
          created_at: '2024-01-15'
        }
      ])

      // Não mostrar erro se estamos usando dados mock
      setError(null)
    } finally {
      setLoading(false)
    }
  }

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
      <header className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-6 py-6 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">Y</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">YLADA</h1>
              <p className="text-xs text-gray-500 -mt-1">Your Lead Accelerated Data App</p>
            </div>
          </Link>
          
          <div className="flex items-center space-x-6">
            <LanguageSelector />
            
            <button
              onClick={() => setActiveTab('profile')}
              className="flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                <span className="text-white font-semibold text-sm">
                  {userProfile?.name?.charAt(0) || 'M'}
                </span>
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900">{userProfile?.name}</p>
                <p className="text-xs text-gray-500">Editar perfil</p>
              </div>
            </button>
            
            <Link
              href="/create"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
            >
              + Criar Link
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Carregando dashboard...</span>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <div className="flex items-center">
              <div className="text-red-600 text-xl mr-3">⚠️</div>
              <div>
                <h3 className="text-red-800 font-semibold">Erro ao carregar dados</h3>
                <p className="text-red-600">{error}</p>
                <button 
                  onClick={loadDashboardData}
                  className="mt-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Tentar Novamente
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Welcome Section */}
            <div className="mb-10">
              <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-8 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h1 className="text-4xl font-bold mb-2">
                        Olá, {userProfile?.name}! 👋
                      </h1>
                      <p className="text-blue-100 text-lg">
                        Sua plataforma personalizada para gerar leads qualificados
                      </p>
                    </div>
                    <div className="hidden md:block">
                      <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                        <span className="text-3xl">🚀</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full flex items-center space-x-2">
                      <span className="text-lg">🥗</span>
                      <span className="font-medium">{userProfile?.profession}</span>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full flex items-center space-x-2">
                      <span className="text-lg">🎯</span>
                      <span className="font-medium">{userProfile?.specialization}</span>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full flex items-center space-x-2">
                      <span className="text-lg">👥</span>
                      <span className="font-medium">{userProfile?.target_audience}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Links Ativos</p>
                    <p className="text-3xl font-bold text-gray-900">{mockStats.totalTools}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white text-xl">🧩</span>
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-green-600">
                  <span className="font-medium">+12%</span>
                  <span className="ml-1">vs mês anterior</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Visualizações</p>
                    <p className="text-3xl font-bold text-gray-900">{mockStats.totalViews}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white text-xl">👁️</span>
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-green-600">
                  <span className="font-medium">+28%</span>
                  <span className="ml-1">vs mês anterior</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Leads Gerados</p>
                    <p className="text-3xl font-bold text-gray-900">{mockStats.totalLeads}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white text-xl">📧</span>
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-green-600">
                  <span className="font-medium">+35%</span>
                  <span className="ml-1">vs mês anterior</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Conversão Média</p>
                    <p className="text-3xl font-bold text-gray-900">{mockStats.avgConversionRate}%</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white text-xl">📊</span>
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-green-600">
                  <span className="font-medium">+8%</span>
                  <span className="ml-1">vs mês anterior</span>
                </div>
              </div>
            </div>

            {/* Ver Templates Section */}
            <div className="bg-white rounded-2xl shadow-xl mb-10 border border-gray-100">
              <div className="p-8 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      🎯 Ver Templates
                    </h2>
                    <p className="text-gray-600 text-lg">
                      Explore templates recomendados baseado no seu perfil de <span className="font-semibold text-blue-600">{userProfile?.profession}</span> especializada em <span className="font-semibold text-purple-600">{userProfile?.specialization}</span>
                    </p>
                  </div>
                  <div className="hidden md:block">
                    <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-white text-2xl">✨</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {recommendedTools.map((tool) => (
                    <div key={tool.id} className="group border-2 border-gray-100 rounded-2xl p-6 hover:border-blue-200 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50">
                      <div className="flex items-center mb-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                          <span className="text-white text-2xl">
                            {tool.type === 'quiz' ? '🧩' : 
                             tool.type === 'calculator' ? '🧮' : 
                             tool.type === 'checklist' ? '📋' : '📊'}
                          </span>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{tool.name}</h3>
                          <p className="text-sm text-gray-500 font-medium">{tool.type}</p>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-4 leading-relaxed">{tool.description}</p>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                            {tool.avg_conversion_rate}% conversão
                          </span>
                          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                            {tool.usage_count} usos
                          </span>
                        </div>
                      </div>
                      <Link
                        href={`/create?template=${tool.id}`}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 text-center block font-semibold shadow-lg hover:shadow-xl"
                      >
                        Criar Link →
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
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'profile'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Meu Perfil
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
                                    {tool.type === 'quiz' ? '🧩' : 
                                     tool.type === 'calculator' ? '🧮' : 
                                     tool.type === 'checklist' ? '📋' : '📊'}
                                  </span>
                                </div>
                                <div>
                                  <h3 className="text-lg font-semibold text-gray-900">
                                    {tool.title}
                                  </h3>
                                  <p className="text-sm text-gray-600">
                                    {tool.type} • Criado em {tool.created_at}
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
                          Nenhum link criado ainda
                        </h3>
                        <p className="text-gray-600 mb-4">
                          Comece criando seu primeiro link personalizado
                        </p>
                        <Link
                          href="/create"
                          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Criar Primeiro Link
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

                {activeTab === 'profile' && (
                  <div className="max-w-2xl mx-auto">
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-6">
                        Editar Perfil
                      </h3>
                      
                      <div className="space-y-6">
                        {/* Avatar e Nome */}
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-semibold text-xl">
                              {userProfile?.name?.charAt(0) || 'M'}
                            </span>
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900">
                              {userProfile?.name}
                            </h4>
                            <p className="text-gray-600">{userProfile?.email}</p>
                          </div>
                        </div>

                        {/* Formulário de Edição */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Profissão
                            </label>
                            <input
                              type="text"
                              value={userProfile?.profession || ''}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Ex: nutricionista"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Especialização
                            </label>
                            <input
                              type="text"
                              value={userProfile?.specialization || ''}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Ex: emagrecimento"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Público-Alvo
                            </label>
                            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                              <option value="iniciantes">Iniciantes</option>
                              <option value="intermediarios">Intermediários</option>
                              <option value="avancados">Avançados</option>
                              <option value="todos">Todos os níveis</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Objetivo Principal
                            </label>
                            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                              <option value="capturar-leads">Capturar Leads</option>
                              <option value="engajar-clientes">Engajar Clientes</option>
                              <option value="vender-produtos">Vender Produtos</option>
                              <option value="educar-publico">Educar Público</option>
                            </select>
                          </div>
                        </div>

                        {/* Botões de Ação */}
                        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                          <button className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                            Cancelar
                          </button>
                          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            Salvar Alterações
                          </button>
                        </div>
                      </div>
                    </div>
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
