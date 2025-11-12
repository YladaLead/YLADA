'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase-client'

const supabase = createClient()

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const safetyTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isAuthenticatedRef = useRef(false)
  const hasCheckedRef = useRef(false)

  // Detectar quando a página está sendo redirecionada
  useEffect(() => {
    const handleBeforeUnload = () => {
      console.log('⚠️ AdminDashboard: Página está sendo descarregada/redirecionada')
      console.log('⚠️ AdminDashboard: Estado atual:', {
        isAuthenticated,
        loading,
        isAuthenticatedRef: isAuthenticatedRef.current
      })
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [isAuthenticated, loading])

  // Limpar cache ao carregar
  useEffect(() => {
    // Limpar Service Workers
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
          registration.unregister()
        })
      })
    }
  }, [])

  useEffect(() => {
    // Evitar múltiplas execuções
    if (hasCheckedRef.current) {
      console.log('⚠️ AdminDashboard: Já verificou autenticação, ignorando...')
      return
    }
    
    let mounted = true
    hasCheckedRef.current = true
    
    const checkAuth = async () => {
      try {
        console.log('🚀 AdminDashboard: INICIANDO verificação de autenticação...')
        console.log('📌 AdminDashboard: Timestamp:', new Date().toISOString())
        
        // Verificar sessão
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        console.log('📋 AdminDashboard: Resultado da sessão:', {
          hasSession: !!session,
          hasError: !!sessionError,
          errorMessage: sessionError?.message,
          userId: session?.user?.id,
          email: session?.user?.email
        })
        
        if (!mounted) {
          console.log('⚠️ AdminDashboard: Componente desmontado, cancelando...')
          return
        }
        
        if (!session || sessionError) {
          console.log('❌ AdminDashboard: Sem sessão, redirecionando para login')
          if (mounted) {
            window.location.href = '/admin/login'
          }
          return
        }

        console.log('✅ AdminDashboard: Sessão encontrada! User:', session.user.email)

        // Verificar se é admin usando API route (evita problemas de RLS)
        console.log('🔍 AdminDashboard: Verificando se é admin via API...')
        let isAdmin = false
        
        try {
          const checkAdminResponse = await fetch('/api/admin/check', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${session.access_token}`,
              'Content-Type': 'application/json'
            }
          })

          if (checkAdminResponse.ok) {
            const checkData = await checkAdminResponse.json()
            isAdmin = checkData.isAdmin === true
            
            console.log('📋 AdminDashboard: Resultado da verificação de admin:', {
              isAdmin,
              hasError: !checkAdminResponse.ok,
              responseStatus: checkAdminResponse.status
            })
          } else {
            console.error('❌ AdminDashboard: Erro na API de verificação de admin:', checkAdminResponse.status)
            // Fallback: tentar query direta
            const { data: profile, error: profileError } = await supabase
              .from('user_profiles')
              .select('is_admin')
              .eq('user_id', session.user.id)
              .maybeSingle()

            if (!profileError && profile) {
              isAdmin = profile.is_admin === true
              console.log('📋 AdminDashboard: Usando fallback (query direta):', { isAdmin })
            } else {
              console.error('❌ AdminDashboard: Erro no fallback também:', profileError?.message)
            }
          }
        } catch (apiError: any) {
          console.error('❌ AdminDashboard: Erro ao chamar API de verificação:', apiError.message)
          // Fallback: tentar query direta
          try {
            const { data: profile, error: profileError } = await supabase
              .from('user_profiles')
              .select('is_admin')
              .eq('user_id', session.user.id)
              .maybeSingle()

            if (!profileError && profile) {
              isAdmin = profile.is_admin === true
              console.log('📋 AdminDashboard: Usando fallback após erro de API:', { isAdmin })
            } else {
              console.error('❌ AdminDashboard: Erro no fallback também:', profileError?.message)
            }
          } catch (fallbackError: any) {
            console.error('❌ AdminDashboard: Erro no fallback:', fallbackError.message)
          }
        }

        if (!mounted) {
          console.log('⚠️ AdminDashboard: Componente desmontado após buscar perfil, cancelando...')
          return
        }

        if (!isAdmin) {
          console.log('❌ AdminDashboard: Não é admin')
          if (mounted) {
            window.location.href = '/admin/login'
          }
          return
        }

        console.log('✅✅✅ AdminDashboard: ACESSO PERMITIDO! É admin!')
        console.log('🔄 AdminDashboard: Definindo isAuthenticated=true e loading=false')
        
        if (mounted) {
          // Limpar timeout de segurança ANTES de mudar o estado
          if (safetyTimeoutRef.current) {
            console.log('🧹 AdminDashboard: Limpando timeout de segurança')
            clearTimeout(safetyTimeoutRef.current)
            safetyTimeoutRef.current = null
          }
          isAuthenticatedRef.current = true
          setIsAuthenticated(true)
          setLoading(false)
          console.log('✅ AdminDashboard: Estado atualizado com sucesso!')
          console.log('✅ AdminDashboard: Página deve permanecer carregada agora')
        }
      } catch (error: any) {
        console.error('❌ AdminDashboard: Erro geral:', error.message)
        console.error('❌ AdminDashboard: Stack:', error.stack)
        if (mounted) {
          window.location.href = '/admin/login'
        }
      }
    }

    checkAuth()
    
    // Listener para detectar mudanças na autenticação - DESABILITADO para evitar redirecionamentos
    // O listener estava causando redirecionamentos desnecessários
    // const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
    //   console.log('🔄 AdminDashboard: Auth state changed:', event)
    //   // Não fazer nada - deixar o checkAuth inicial fazer o trabalho
    // })
    
    // Timeout de segurança - se não concluir em 10 segundos, redirecionar
    // Só redireciona se ainda não autenticado
    safetyTimeoutRef.current = setTimeout(() => {
      if (mounted && !isAuthenticatedRef.current) {
        console.log('⏰ AdminDashboard: Timeout de segurança ativado, verificando sessão...')
        // Verificar novamente se ainda não autenticado
        supabase.auth.getSession().then(({ data: { session } }) => {
          console.log('⏰ AdminDashboard: Verificação do timeout:', {
            hasSession: !!session,
            isAuthenticated: isAuthenticatedRef.current
          })
          if (!session && mounted && !isAuthenticatedRef.current) {
            console.error('⏰ AdminDashboard: TIMEOUT DE SEGURANÇA - sem sessão, redirecionando...')
            window.location.href = '/admin/login'
          } else if (session && mounted) {
            console.log('⏰ AdminDashboard: Sessão ainda existe, não redirecionando')
          }
        })
      }
    }, 10000)

    return () => {
      console.log('🧹 AdminDashboard: Cleanup - desmontando componente')
      mounted = false
      // subscription.unsubscribe() // Removido porque não estamos usando mais
      if (safetyTimeoutRef.current) {
        clearTimeout(safetyTimeoutRef.current)
        safetyTimeoutRef.current = null
      }
    }
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return <AdminDashboardContent />
}

function AdminDashboardContent() {
  const [stats, setStats] = useState({
    usuariosTotal: 152,
    usuariosAtivos: 138,
    cursosTotal: 8,
    cursosAtivos: 6,
    templatesTotal: 47,
    leadsTotal: 5240,
    receitaMensal: 45230.50,
    assinaturasAtivas: 138
  })

  const [filtroArea, setFiltroArea] = useState<'todos' | 'nutri' | 'coach' | 'nutra' | 'wellness'>('todos')

  const usuariosPorArea = {
    nutri: { total: 45, ativos: 42 },
    coach: { total: 38, ativos: 35 },
    nutra: { total: 32, ativos: 28 },
    wellness: { total: 37, ativos: 33 }
  }

  const receitasPorArea = {
    nutri: { mensal: 12000, anual: 144000 },
    coach: { mensal: 11200, anual: 134400 },
    nutra: { mensal: 10500, anual: 126000 },
    wellness: { mensal: 11530.50, anual: 138366 }
  }

  const acoesRapidas = [
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
        </div>

        {/* Stats Cards - Visão Macro */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Usuários</p>
                <p className="text-3xl font-bold text-gray-900">{stats.usuariosTotal}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium text-green-600">{stats.usuariosAtivos} ativos</span>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Cursos</p>
                <p className="text-3xl font-bold text-gray-900">{stats.cursosTotal}</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📚</span>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium text-green-600">{stats.cursosAtivos} ativos</span>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Leads Gerados</p>
                <p className="text-3xl font-bold text-gray-900">{stats.leadsTotal}</p>
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
                <p className="text-3xl font-bold text-gray-900">R$ {(stats.receitaMensal / 1000).toFixed(1)}k</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium text-green-600">{stats.assinaturasAtivas} assinaturas</span>
            </div>
          </div>
        </div>

        {/* Distribuição por Área */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Usuários por Área */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Usuários por Área</h2>
            <div className="space-y-3">
              {Object.entries(usuariosPorArea).map(([area, dados]) => (
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
                      <p className="text-sm text-gray-600">{dados.total} usuários</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">{dados.ativos}</p>
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
              {Object.entries(receitasPorArea).map(([area, receitas]) => (
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
                      <p className="text-sm text-gray-600">R$ {(receitas.mensal / 1000).toFixed(1)}k/mês</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">R$ {(receitas.anual / 1000).toFixed(0)}k</p>
                    <p className="text-xs text-gray-600">anual</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

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

        {/* Atividade Recente */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Atividade Recente</h2>
          <div className="space-y-3">
            <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
              <span className="text-2xl">📚</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Novo curso criado</p>
                <p className="text-xs text-gray-600">Nutrição Clínica Básica • 2 horas atrás</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
              <span className="text-2xl">👥</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Novo usuário cadastrado</p>
                <p className="text-xs text-gray-600">Maria Silva • 4 horas atrás</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
              <span className="text-2xl">🎨</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Template atualizado</p>
                <p className="text-xs text-gray-600">Calculadora IMC • 6 horas atrás</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

