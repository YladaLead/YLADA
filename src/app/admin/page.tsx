'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-client'
import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute'

const supabase = createClient()

function AdminDashboard() {

  // AdminProtectedRoute já faz toda a verificação
  // Este componente apenas renderiza o conteúdo
  return <AdminDashboardContent />
}

interface StatsData {
  usuariosTotal: number
  usuariosAtivos: number
  cursosTotal: number
  cursosAtivos: number
  leadsTotal: number
  receitaMensal: number
  assinaturasAtivas: number
  usuariosPorArea: Record<string, { total: number; ativos: number }>
  receitasPorArea: Record<string, { mensal: number; anual: number }>
  atividadesRecentes: Array<{
    tipo: string
    descricao: string
    area?: string
    timestamp: string
  }>
}

function AdminDashboardContent() {
  const [stats, setStats] = useState<StatsData>({
    usuariosTotal: 0,
    usuariosAtivos: 0,
    cursosTotal: 0,
    cursosAtivos: 0,
    leadsTotal: 0,
    receitaMensal: 0,
    assinaturasAtivas: 0,
    usuariosPorArea: {
      nutri: { total: 0, ativos: 0 },
      coach: { total: 0, ativos: 0 },
      nutra: { total: 0, ativos: 0 },
      wellness: { total: 0, ativos: 0 }
    },
    receitasPorArea: {
      nutri: { mensal: 0, anual: 0 },
      coach: { mensal: 0, anual: 0 },
      nutra: { mensal: 0, anual: 0 },
      wellness: { mensal: 0, anual: 0 }
    },
    atividadesRecentes: []
  })

  const [filtroArea, setFiltroArea] = useState<'todos' | 'nutri' | 'coach' | 'nutra' | 'wellness'>('todos')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Buscar dados da API
  useEffect(() => {
    const carregarDados = async () => {
      try {
        setLoading(true)
        setError(null)

        const url = `/api/admin/stats${filtroArea !== 'todos' ? `?area=${filtroArea}` : ''}`
        const response = await fetch(url, {
          credentials: 'include'
        })

        if (!response.ok) {
          throw new Error('Erro ao carregar estatísticas')
        }

        const data = await response.json()

        if (data.success && data.stats) {
          setStats(data.stats)
        } else {
          throw new Error('Formato de dados inválido')
        }
      } catch (err: any) {
        console.error('Erro ao carregar estatísticas:', err)
        setError(err.message || 'Erro ao carregar dados')
      } finally {
        setLoading(false)
      }
    }

    carregarDados()
  }, [filtroArea])

  const acoesRapidas = [
    {
      id: 'whatsapp-chat',
      title: 'WhatsApp Chat',
      description: 'Atendimento WhatsApp em tempo real',
      icon: '💬',
      link: '/admin/whatsapp',
      color: 'bg-green-500',
      destaque: true
    },
    {
      id: 'whatsapp-workshop',
      title: 'Workshop WhatsApp',
      description: 'Gerenciar sessões e apresentações',
      icon: '📅',
      link: '/admin/whatsapp/workshop',
      color: 'bg-green-600',
      destaque: true
    },
    {
      id: 'whatsapp-relatorios',
      title: 'Relatórios WhatsApp',
      description: 'Índices e diagnósticos por tags',
      icon: '📊',
      link: '/admin/whatsapp/relatorios',
      color: 'bg-green-700',
      destaque: true
    },
    {
      id: 'whatsapp-carol',
      title: 'Carol - IA de Atendimento',
      description: 'Automação e disparos automáticos',
      icon: '🤖',
      link: '/admin/whatsapp/carol',
      color: 'bg-purple-600',
      destaque: true
    },
    {
      id: 'whatsapp-agendadas',
      title: 'Agendadas para Aula',
      description: 'Filtrar por data, hora e sessão',
      icon: '📅',
      link: '/admin/whatsapp/agendadas',
      color: 'bg-blue-600',
      destaque: true
    },
    {
      id: 'whatsapp-cadastros-workshop',
      title: 'Cadastros do Workshop',
      description: 'Listar e processar cadastros em massa',
      icon: '📋',
      link: '/admin/whatsapp/cadastros-workshop',
      color: 'bg-purple-500',
      destaque: true
    },
    {
      id: 'usuarios',
      title: 'Usuários',
      description: 'Gerenciar nutricionistas, coaches, nutras e wellness',
      icon: '👥',
      link: '/admin/usuarios',
      color: 'bg-blue-500',
      destaque: true
    },
    {
      id: 'subscriptions',
      title: 'Gerenciar Assinaturas',
      description: 'Criar planos gratuitos e migrar assinaturas',
      icon: '🎁',
      link: '/admin/subscriptions',
      color: 'bg-green-500',
      destaque: true
    },
    {
      id: 'cursos',
      title: 'Cursos',
      description: 'Criar e editar cursos por área',
      icon: '📚',
      link: '/admin/cursos',
      color: 'bg-green-500'
    },
    {
      id: 'receitas',
      title: 'Receitas & Assinaturas',
      description: 'Controle financeiro e assinaturas',
      icon: '💰',
      link: '/admin/receitas',
      color: 'bg-yellow-500'
    },
    {
      id: 'trials',
      title: 'Trials de 3 Dias',
      description: 'Visualizar e coordenar trials ativos',
      icon: '🎁',
      link: '/admin/trials',
      color: 'bg-green-500',
      destaque: true
    },
    {
      id: 'presidentes',
      title: 'Presidentes Autorizados',
      description: 'Gerenciar lista de presidentes para trial',
      icon: '🏆',
      link: '/admin/presidentes',
      color: 'bg-purple-500'
    },
    {
      id: 'email-authorizations',
      title: 'Autorizações por Email',
      description: 'Autorizar emails antes do cadastro',
      icon: '📧',
      link: '/admin/email-authorizations',
      color: 'bg-indigo-500',
      destaque: true
    },
    {
      id: 'chat-qa',
      title: 'ChatIA - Perguntas e Respostas',
      description: 'Gerenciar respostas do assistente virtual',
      icon: '🤖',
      link: '/admin/chat-qa',
      color: 'bg-cyan-500',
      destaque: true
    },
    {
      id: 'templates',
      title: 'Templates',
      description: 'Gerenciar templates prontos',
      icon: '🎨',
      link: '/admin/templates',
      color: 'bg-purple-500'
    },
    {
      id: 'analytics',
      title: 'Analytics',
      description: 'Relatórios detalhados',
      icon: '📊',
      link: '/admin/analytics',
      color: 'bg-orange-500'
    },
    {
      id: 'config',
      title: 'Configurações',
      description: 'Configurações do sistema',
      icon: '⚙️',
      link: '/admin/config',
      color: 'bg-gray-500'
    },
    {
      id: 'support-agents',
      title: 'Atendentes de Suporte',
      description: 'Gerenciar equipe de atendimento',
      icon: '👨‍💼',
      link: '/admin/support/agents',
      color: 'bg-pink-500',
      destaque: true
    },
    {
      id: 'noel-learning',
      title: 'NOEL - Sugestões de Aprendizado',
      description: 'Gerenciar sugestões de aprendizado do NOEL (Wellness)',
      icon: '🧠',
      link: '/admin/wellness/learning-suggestions',
      color: 'bg-emerald-500',
      destaque: true
    },
    {
      id: 'biblioteca-upload',
      title: 'Biblioteca Wellness - Upload',
      description: 'Adicionar vídeos, PDFs e imagens à biblioteca',
      icon: '📚',
      link: '/admin/wellness/biblioteca/upload',
      color: 'bg-teal-500',
      destaque: true
    },
    {
      id: 'notificacoes-push',
      title: 'Notificações Push',
      description: 'Enviar notificações para usuários com links para materiais',
      icon: '🔔',
      link: '/admin/notificacoes-push',
      color: 'bg-green-500',
      destaque: true
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Image
                  src="/images/logo/ylada/horizontal/azul-claro/ylada-horizontal-azul-claro-30.png"
                  alt="YLADA"
                  width={200}
                  height={70}
                  className="h-14 sm:h-16 w-auto"
                />
              </Link>
              <div className="h-14 sm:h-16 w-px bg-gray-300"></div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Painel Administrativo
                </h1>
                <p className="text-sm text-gray-600">Gerenciamento completo do YLADA</p>
              </div>
            </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">Admin</p>
                        <p className="text-xs text-gray-600">Administrador do Sistema</p>
                      </div>
                      <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600">A</span>
                      </div>
                      <button
                        onClick={async () => {
                          // Limpar cache ao fazer logout
                          try {
                            const { clearCachedAdminCheck } = await import('@/lib/auth-cache')
                            clearCachedAdminCheck()
                          } catch (error) {
                            console.error('Erro ao limpar cache:', error)
                          }
                          await supabase.auth.signOut()
                          window.location.href = '/admin/login'
                        }}
                        className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Sair
                      </button>
                    </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtro por Área */}
        <div className="mb-6 bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Filtrar por Área</h3>
            <div className="flex flex-wrap gap-2">
              {['todos', 'nutri', 'coach', 'nutra', 'wellness'].map((area) => (
                <button
                  key={area}
                  onClick={() => setFiltroArea(area as any)}
                  disabled={loading}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filtroArea === area
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {area === 'todos' ? 'Todos' : area.charAt(0).toUpperCase() + area.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="mb-8 text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-sm text-gray-600">Carregando estatísticas...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="mb-8 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800">Erro ao carregar dados: {error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {/* Stats Cards - Visão Macro */}
        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total de Usuários</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.usuariosTotal.toLocaleString('pt-BR')}</p>
                  </div>
                  <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">👥</span>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium text-green-600">{stats.usuariosAtivos.toLocaleString('pt-BR')} ativos</span>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Cursos</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.cursosTotal.toLocaleString('pt-BR')}</p>
                  </div>
                  <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">📚</span>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium text-green-600">{stats.cursosAtivos.toLocaleString('pt-BR')} ativos</span>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Leads Gerados</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.leadsTotal.toLocaleString('pt-BR')}</p>
                  </div>
                  <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">🎯</span>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  Total acumulado
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Receita Mensal</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {stats.receitaMensal >= 1000 
                        ? `R$ ${(stats.receitaMensal / 1000).toFixed(1)}k`
                        : `R$ ${stats.receitaMensal.toFixed(2)}`
                      }
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">💰</span>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium text-green-600">{stats.assinaturasAtivas.toLocaleString('pt-BR')} assinaturas</span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Ações Rápidas */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Ações Rápidas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {acoesRapidas.map((acao) => (
              <Link
                key={acao.id}
                href={acao.link}
                className={`bg-white rounded-xl p-6 shadow-sm border-2 transition-all group ${
                  acao.destaque 
                    ? 'border-blue-300 hover:border-blue-400 hover:shadow-lg' 
                    : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className={`${acao.color} rounded-lg p-3 text-white group-hover:scale-110 transition-transform shadow-md`}>
                    <span className="text-2xl">{acao.icon}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {acao.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {acao.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Distribuição por Área */}
        {!loading && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Usuários por Área */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Usuários por Área</h2>
              <div className="space-y-3">
                {Object.entries(stats.usuariosPorArea).map(([area, dados]) => (
                  <div key={area} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        area === 'nutri' ? 'bg-green-100' :
                        area === 'coach' ? 'bg-purple-100' :
                        area === 'nutra' ? 'bg-blue-100' :
                        'bg-teal-100'
                      }`}>
                        <span className="text-xl">{
                          area === 'nutri' ? '🥗' :
                          area === 'coach' ? '💜' :
                          area === 'nutra' ? '🔬' :
                          '💖'
                        }</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 capitalize">{area}</p>
                        <p className="text-sm text-gray-600">{dados.total.toLocaleString('pt-BR')} usuários</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">{dados.ativos.toLocaleString('pt-BR')}</p>
                      <p className="text-xs text-gray-600">ativos</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Receitas por Área */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Receitas por Área (Mensal)</h2>
              <div className="space-y-3">
                {Object.entries(stats.receitasPorArea).map(([area, receitas]) => (
                  <div key={area} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        area === 'nutri' ? 'bg-green-100' :
                        area === 'coach' ? 'bg-purple-100' :
                        area === 'nutra' ? 'bg-blue-100' :
                        'bg-teal-100'
                      }`}>
                        <span className="text-xl">{
                          area === 'nutri' ? '🥗' :
                          area === 'coach' ? '💜' :
                          area === 'nutra' ? '🔬' :
                          '💖'
                        }</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 capitalize">{area}</p>
                        <p className="text-sm text-gray-600">
                          {receitas.mensal >= 1000 
                            ? `R$ ${(receitas.mensal / 1000).toFixed(1)}k/mês`
                            : `R$ ${receitas.mensal.toFixed(2)}/mês`
                          }
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">
                        {receitas.anual >= 1000 
                          ? `R$ ${(receitas.anual / 1000).toFixed(0)}k`
                          : `R$ ${receitas.anual.toFixed(2)}`
                        }
                      </p>
                      <p className="text-xs text-gray-600">anual</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Atividade Recente */}
        {!loading && !error && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Atividade Recente</h2>
            <div className="space-y-3">
              {stats.atividadesRecentes.length > 0 ? (
                stats.atividadesRecentes.map((atividade, index) => {
                  // Calcular tempo relativo
                  const timestamp = new Date(atividade.timestamp)
                  const agora = new Date()
                  const diffMs = agora.getTime() - timestamp.getTime()
                  const diffHoras = Math.floor(diffMs / (1000 * 60 * 60))
                  const diffMinutos = Math.floor(diffMs / (1000 * 60))
                  
                  let tempoRelativo = ''
                  if (diffMinutos < 60) {
                    tempoRelativo = diffMinutos <= 1 ? 'agora' : `${diffMinutos} minutos atrás`
                  } else if (diffHoras < 24) {
                    tempoRelativo = diffHoras === 1 ? '1 hora atrás' : `${diffHoras} horas atrás`
                  } else {
                    const diffDias = Math.floor(diffHoras / 24)
                    tempoRelativo = diffDias === 1 ? '1 dia atrás' : `${diffDias} dias atrás`
                  }

                  // Ícone baseado no tipo
                  const icon = atividade.tipo === 'lead' ? '🎯' : atividade.tipo === 'curso' ? '📚' : '📝'

                  return (
                    <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                      <span className="text-2xl">{icon}</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{atividade.descricao}</p>
                        <p className="text-xs text-gray-600">{tempoRelativo}</p>
                      </div>
                    </div>
                  )
                })
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">Nenhuma atividade recente</p>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

// Exportar com AdminProtectedRoute (igual outras páginas admin)
export default function AdminDashboardPage() {
  return (
    <AdminProtectedRoute>
      <AdminDashboard />
    </AdminProtectedRoute>
  )
}

