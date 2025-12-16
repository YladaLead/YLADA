'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import ChatIA from '../../../../../components/ChatIA'
import CoachSidebar from "@/components/coach/CoachSidebar"
import { useAuth } from '@/contexts/AuthContext'

export default function CoachHome() {
  return <CoachHomeContent />
}

function CoachHomeContent() {
  const { user, userProfile, loading } = useAuth()
  
  const [perfil, setPerfil] = useState({
    nome: '',
    bio: ''
  })
  const [stats, setStats] = useState({
    leadsHoje: 0,
    clientesAtivas: 0,
    formularios: 0,
    consultasSemana: 0,
    taxaConversao: 0,
    leadsTotal: 0,
    conversoes: 0
  })
  const [leadsRecentes, setLeadsRecentes] = useState<Array<{
    id: string
    name: string
    email: string
    phone: string
    created_at: string
    source: string
  }>>([])
  const [proximasConsultas, setProximasConsultas] = useState<Array<{
    id: string
    client_name: string
    title: string
    start_time: string
    type: string
  }>>([])
  const [carregandoDados, setCarregandoDados] = useState(true)
  const [chatAberto, setChatAberto] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [novosFormularios, setNovosFormularios] = useState({
    total: 0,
    por_formulario: [] as Array<{ form_id: string; form_name: string; count: number }>
  })
  const [carregandoFormularios, setCarregandoFormularios] = useState(false)

  // Carregar perfil do usuário
  useEffect(() => {
    if (!user) return
    
    const nomeInicial = userProfile?.nome_completo || (user?.email ? user.email.split('@')[0] : null) || 'Nutricionista'
    setPerfil({
      nome: nomeInicial,
      bio: ''
    })
    
    const carregarPerfil = async () => {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 3000)
        
        const response = await fetch('/api/c/profile', {
          credentials: 'include',
          signal: controller.signal
        })
        
        clearTimeout(timeoutId)
        
        if (response.ok) {
          const data = await response.json()
          if (data.profile) {
            setPerfil({
              nome: data.profile.nome || nomeInicial,
              bio: data.profile.bio || ''
            })
          }
        }
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          console.warn('Erro ao carregar perfil:', error)
        }
      }
    }

    carregarPerfil()
  }, [user, userProfile])

  // Carregar notificações de novos formulários
  useEffect(() => {
    if (!user) return

    const carregarNovosFormularios = async () => {
      try {
        setCarregandoFormularios(true)
        const response = await fetch('/api/coach/formularios/respostas/novas', {
          credentials: 'include'
        })

        if (response.ok) {
          const data = await response.json()
          if (data.success) {
            setNovosFormularios({
              total: data.data.total || 0,
              por_formulario: data.data.por_formulario || []
            })
          }
        }
      } catch (error) {
        console.error('Erro ao carregar novos formulários:', error)
      } finally {
        setCarregandoFormularios(false)
      }
    }

    carregarNovosFormularios()
    
    // Atualizar a cada 60 segundos
    const interval = setInterval(carregarNovosFormularios, 60000)
    return () => clearInterval(interval)
  }, [user])

  // Carregar dados do dashboard
  useEffect(() => {
    if (!user) return
      
    const carregarDados = async () => {
      try {
        setCarregandoDados(true)
        
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 8000)
        
        // Carregar stats do dashboard
        const dashboardResponse = await fetch('/api/c/dashboard', {
          credentials: 'include',
          signal: controller.signal
        })
        
        if (dashboardResponse.ok) {
          const dashboardData = await dashboardResponse.json()
          
          if (dashboardData.stats) {
            const leadsTotal = dashboardData.stats.leadsGerados || 0
            const conversoes = dashboardData.stats.conversoes || 0
            const taxaConversao = leadsTotal > 0 ? Math.round((conversoes / leadsTotal) * 100) : 0
            
            // Calcular leads de hoje (mock - será substituído por query real)
            const leadsHoje = Math.floor(Math.random() * 5) + 1
            
            // Calcular consultas da semana (mock - será substituído por query real)
            const consultasSemana = Math.floor(Math.random() * 10) + 3
            
            setStats({
              leadsHoje: leadsHoje,
              clientesAtivas: dashboardData.stats.clientesAtivos || 0,
              formularios: 5, // Mock - será substituído por query real
              consultasSemana: consultasSemana,
              taxaConversao: taxaConversao,
              leadsTotal: leadsTotal,
              conversoes: conversoes
            })
          }
        }
        
        // Carregar leads recentes (últimos 5)
        try {
          const leadsResponse = await fetch('/api/leads?limit=5', {
            credentials: 'include',
            signal: controller.signal
          })
          
          if (leadsResponse.ok) {
            const leadsData = await leadsResponse.json()
            // A API retorna { success: true, data: { leads: [...] } }
            const leads = leadsData.data?.leads || leadsData.leads || []
            if (Array.isArray(leads)) {
              setLeadsRecentes(leads.slice(0, 5).map((lead: any) => ({
                id: lead.id,
                name: lead.name,
                email: lead.email || '',
                phone: lead.phone || '',
                created_at: lead.created_at,
                source: lead.source || lead.additional_data?.source || 'template'
              })))
            }
          }
        } catch (error) {
          console.warn('Erro ao carregar leads recentes:', error)
        }
        
        // Carregar próximas consultas (mock - será substituído por query real quando tabela appointments existir)
        // Por enquanto, deixar vazio ou usar dados mock
        setProximasConsultas([])
        
        clearTimeout(timeoutId)
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          console.error('Erro ao carregar dados:', error)
        }
      } finally {
        setCarregandoDados(false)
      }
    }

    carregarDados()
  }, [user])

  // Aguardar autenticação
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }
  
  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <CoachSidebar 
        isMobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />
      
      {/* Main Content */}
      <div className="flex-1 lg:ml-56">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 text-gray-600 hover:text-gray-900"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Home</h1>
          <div className="w-10"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6 py-4 sm:py-6 lg:py-8">
          {/* Notificação de Novos Formulários */}
          {novosFormularios.total > 0 && (
            <div className="mb-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-4 sm:p-6 text-white shadow-lg animate-pulse">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">🔔</div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold">
                      Você tem {novosFormularios.total} novo{novosFormularios.total > 1 ? 's' : ''} formulário{novosFormularios.total > 1 ? 's' : ''} preenchido{novosFormularios.total > 1 ? 's' : ''}!
                    </h3>
                    {novosFormularios.por_formulario.length > 0 && (
                      <p className="text-sm text-yellow-50 mt-1">
                        {novosFormularios.por_formulario.slice(0, 3).map(f => `${f.form_name} (${f.count})`).join(', ')}
                        {novosFormularios.por_formulario.length > 3 && '...'}
                      </p>
                    )}
                  </div>
                </div>
                <Link
                  href="/pt/coach/formularios"
                  className="px-4 py-2 bg-white text-orange-600 rounded-lg hover:bg-orange-50 transition-colors font-semibold text-sm sm:text-base whitespace-nowrap"
                >
                  Ver Formulários →
                </Link>
              </div>
            </div>
          )}

          {/* Hero Section - Boas-vindas */}
          <div className="mb-8 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-6 sm:p-8 text-white shadow-lg">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">
              Olá, {perfil.nome || 'Coach'}! 👋
            </h1>
            <p className="text-purple-100 text-sm sm:text-base">
              Visão geral do seu negócio. Acompanhe suas métricas e acesse rapidamente todas as áreas.
            </p>
          </div>
          
          {/* Métricas Principais */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                <div className="text-2xl mb-2">📩</div>
                <div className="text-2xl font-bold text-gray-900">{stats.leadsHoje}</div>
                <div className="text-sm text-gray-600">Leads Hoje</div>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                <div className="text-2xl mb-2">👩‍⚕️</div>
                <div className="text-2xl font-bold text-gray-900">{stats.clientesAtivas}</div>
                <div className="text-sm text-gray-600">Clientes Ativas</div>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                <div className="text-2xl mb-2">📝</div>
                <div className="text-2xl font-bold text-gray-900">{stats.formularios}</div>
                <div className="text-sm text-gray-600">Formulários</div>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                <div className="text-2xl mb-2">📅</div>
                <div className="text-2xl font-bold text-gray-900">{stats.consultasSemana}</div>
                <div className="text-sm text-gray-600">Consultas Semana</div>
              </div>
            </div>

          {/* Seção: Captação de Clientes */}
          <div className="mb-8 bg-gradient-to-br from-purple-50 to-purple-50 rounded-xl p-6 sm:p-8 shadow-sm border border-purple-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">🎯 Captação de Clientes</h2>
                <p className="text-gray-700">Atraia novas clientes com ferramentas inteligentes.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              {/* Links Personalizados */}
              <div className="bg-white rounded-lg p-6 text-center hover:shadow-md transition-shadow border border-purple-100 flex flex-col justify-between">
                <div>
                  <div className="text-4xl mb-3">🔗</div>
                  <h3 className="font-semibold text-gray-900">Links Personalizados</h3>
                  <p className="text-sm text-gray-600 mt-1">Crie e compartilhe</p>
                </div>
                <div className="mt-4 flex flex-col gap-2">
                  <Link
                    href="/pt/coach/ferramentas"
                    className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                  >
                    Ver Meus Links →
                  </Link>
                  <Link
                    href="/pt/coach/c/ferramentas/nova"
                    className="inline-flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                  >
                    + Criar Novo Link
                  </Link>
                </div>
              </div>
              
              {/* Quizzes Personalizados */}
              <div className="bg-white rounded-lg p-6 text-center hover:shadow-md transition-shadow border border-purple-100 flex flex-col justify-between">
                <div>
                  <div className="text-4xl mb-3">📝</div>
                  <h3 className="font-semibold text-gray-900">Quizzes Personalizados</h3>
                  <p className="text-sm text-gray-600 mt-1">Engaje e eduque</p>
                </div>
                <div className="mt-4 flex flex-col gap-2">
                  <Link
                    href="/pt/coach/quizzes"
                    className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                  >
                    Ver Meus Quizzes →
                  </Link>
                  <Link
                    href="/pt/coach/quiz-personalizado"
                    className="inline-flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                  >
                    + Criar Novo Quiz
                  </Link>
                </div>
              </div>
              
              {/* Portal do Bem-Estar */}
              <div className="bg-white rounded-lg p-6 text-center hover:shadow-md transition-shadow border border-purple-100 flex flex-col justify-between">
                <div>
                  <div className="text-4xl mb-3">🌐</div>
                  <h3 className="font-semibold text-gray-900">Portal do Bem-Estar</h3>
                  <p className="text-sm text-gray-600 mt-1">Organize conteúdos</p>
                </div>
                <div className="mt-4 flex flex-col gap-2">
                  <Link
                    href="/pt/coach/c/portals"
                    className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                  >
                    Ver Meus Portais →
                  </Link>
                  <Link
                    href="/pt/coach/c/portals/novo"
                    className="inline-flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                  >
                    + Criar Novo Portal
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Seção: Gestão de Clientes */}
          <div className="mb-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 sm:p-8 shadow-sm border border-green-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">📁 Gestão de Clientes</h2>
                <p className="text-gray-700">Organize seus atendimentos com clareza.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              <Link 
                href="/pt/coach/clientes"
                className="bg-white rounded-lg p-6 text-center hover:shadow-md transition-shadow border border-green-100"
              >
                <div className="text-4xl mb-3">📋</div>
                <h3 className="font-semibold text-gray-900">Lista de Clientes</h3>
                <p className="text-sm text-gray-600 mt-1">Visualize todos</p>
              </Link>
              
              <Link 
                href="/pt/coach/clientes/kanban"
                className="bg-white rounded-lg p-6 text-center hover:shadow-md transition-shadow border border-green-100"
              >
                <div className="text-4xl mb-3">📌</div>
                <h3 className="font-semibold text-gray-900">Kanban (Trello)</h3>
                <p className="text-sm text-gray-600 mt-1">Organize por status</p>
              </Link>
              
              <Link 
                href="/pt/coach/agenda"
                className="bg-white rounded-lg p-6 text-center hover:shadow-md transition-shadow border border-green-100"
              >
                <div className="text-4xl mb-3">📅</div>
                <h3 className="font-semibold text-gray-900">Agenda</h3>
                <p className="text-sm text-gray-600 mt-1">Gerencie consultas</p>
              </Link>
            </div>
          </div>

          {/* Seção: Formulários Personalizados */}
          <div className="mb-8 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-6 sm:p-8 shadow-sm border border-purple-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">🧩 Formulários Personalizados</h2>
                <p className="text-gray-700">Crie e envie anamneses completas.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              <Link 
                href="/pt/coach/formularios/novo"
                className="bg-white rounded-lg p-6 text-center hover:shadow-md transition-shadow border border-purple-100"
              >
                <div className="text-4xl mb-3">➕</div>
                <h3 className="font-semibold text-gray-900">Criar Formulário</h3>
                <p className="text-sm text-gray-600 mt-1">Novo formulário</p>
              </Link>
              
              <Link 
                href="/pt/coach/formularios"
                className="bg-white rounded-lg p-6 text-center hover:shadow-md transition-shadow border border-purple-100"
              >
                <div className="text-4xl mb-3">📁</div>
                <h3 className="font-semibold text-gray-900">Meus Formulários</h3>
                <p className="text-sm text-gray-600 mt-1">Gerenciar</p>
              </Link>
              
              <Link 
                href="/pt/coach/formularios/respostas"
                className="bg-white rounded-lg p-6 text-center hover:shadow-md transition-shadow border border-purple-100"
              >
                <div className="text-4xl mb-3">📨</div>
                <h3 className="font-semibold text-gray-900">Respostas Recebidas</h3>
                <p className="text-sm text-gray-600 mt-1">Ver respostas</p>
              </Link>
            </div>
          </div>

          {/* Seção: Filosofia YLADA */}
          <div className="mb-8 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-6 sm:p-8 shadow-sm border border-yellow-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">✨ Filosofia YLADA</h2>
                <p className="text-gray-700">Aprenda a pensar como uma Nutricionista Empresária.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              <Link 
                href="/pt/coach/cursos"
                className="bg-white rounded-lg p-6 text-center hover:shadow-md transition-shadow border border-yellow-100"
              >
                <div className="text-4xl mb-3">🎓</div>
                <h3 className="font-semibold text-gray-900">Módulo 1</h3>
                <p className="text-sm text-gray-600 mt-1">Fundamentos</p>
              </Link>
              
              <Link 
                href="/pt/coach/cursos"
                className="bg-white rounded-lg p-6 text-center hover:shadow-md transition-shadow border border-yellow-100"
              >
                <div className="text-4xl mb-3">🚀</div>
                <h3 className="font-semibold text-gray-900">Módulo 2</h3>
                <p className="text-sm text-gray-600 mt-1">Crescimento</p>
              </Link>
              
              <Link 
                href="/pt/coach/cursos"
                className="bg-white rounded-lg p-6 text-center hover:shadow-md transition-shadow border border-yellow-100"
              >
                <div className="text-4xl mb-3">📈</div>
                <h3 className="font-semibold text-gray-900">Módulo 3</h3>
                <p className="text-sm text-gray-600 mt-1">Expansão</p>
              </Link>
            </div>
          </div>

          {/* Seção: Leads Recentes e Próximas Consultas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Leads Recentes */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">📩 Leads Recentes</h3>
                <Link 
                  href="/pt/coach/leads"
                  className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                >
                  Ver todos →
                </Link>
              </div>
              
              {carregandoDados ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600 text-sm">Carregando leads...</p>
                </div>
              ) : leadsRecentes.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 text-sm mb-4">Nenhum lead recente</p>
                  <Link 
                    href="/pt/coach/c/ferramentas/nova"
                    className="inline-block bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                  >
                    Criar Ferramenta
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {leadsRecentes.map((lead) => (
                    <div 
                      key={lead.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{lead.name}</p>
                        <p className="text-sm text-gray-600 truncate">{lead.email || lead.phone}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(lead.created_at).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <Link
                        href={`/pt/c/leads?convert=${lead.id}`}
                        className="ml-3 px-3 py-1.5 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors whitespace-nowrap"
                      >
                        Converter
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Próximas Consultas */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">📅 Próximas Consultas</h3>
                <Link 
                  href="/pt/coach/agenda"
                  className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                >
                  Ver agenda →
                </Link>
              </div>
              
              {carregandoDados ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600 text-sm">Carregando consultas...</p>
                </div>
              ) : proximasConsultas.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 text-sm mb-4">Nenhuma consulta agendada</p>
                  <Link 
                    href="/pt/coach/agenda?nova=true"
                    className="inline-block bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                  >
                    Agendar Consulta
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {proximasConsultas.map((consulta) => (
                    <div 
                      key={consulta.id}
                      className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <p className="font-medium text-gray-900">{consulta.client_name}</p>
                      <p className="text-sm text-gray-600">{consulta.title}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(consulta.start_time).toLocaleString('pt-BR')}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Seção: Ações Rápidas */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">⚡ Ações Rápidas</h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Link
                href="/pt/coach/c/ferramentas/nova"
                className="bg-purple-50 hover:bg-purple-100 rounded-lg p-4 text-center transition-colors border border-purple-200"
              >
                <div className="text-2xl mb-2">➕</div>
                <p className="font-medium text-gray-900 text-sm">Criar Link</p>
              </Link>
              
              <Link
                href="/pt/coach/clientes/novo"
                className="bg-green-50 hover:bg-green-100 rounded-lg p-4 text-center transition-colors border border-green-200"
              >
                <div className="text-2xl mb-2">➕</div>
                <p className="font-medium text-gray-900 text-sm">Cliente</p>
              </Link>
              
              <Link
                href="/pt/coach/formularios/novo"
                className="bg-purple-50 hover:bg-purple-100 rounded-lg p-4 text-center transition-colors border border-purple-200"
              >
                <div className="text-2xl mb-2">➕</div>
                <p className="font-medium text-gray-900 text-sm">Formulário</p>
              </Link>
              
              <Link
                href="/pt/coach/agenda?nova=true"
                className="bg-orange-50 hover:bg-orange-100 rounded-lg p-4 text-center transition-colors border border-orange-200"
              >
                <div className="text-2xl mb-2">➕</div>
                <p className="font-medium text-gray-900 text-sm">Consulta</p>
              </Link>
            </div>
          </div>
        </div>

        {/* Chat com IA */}
        <ChatIA isOpen={chatAberto} onClose={() => setChatAberto(false)} area="coach" />
        
        {/* Botão Flutuante do Chat */}
        {!chatAberto && (
          <div className="fixed bottom-6 right-6 z-50">
            <button
              onClick={() => setChatAberto(true)}
              className="bg-purple-600 text-white p-4 rounded-full shadow-lg hover:bg-purple-700 transition-colors"
            >
              <span className="text-2xl">💬</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
