'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import ChatIA from '../../../../components/ChatIA'
import ProtectedRoute from '../../../../components/auth/ProtectedRoute'
import NutriSidebar from '../../../../components/nutri/NutriSidebar'
import { useAuth } from '@/contexts/AuthContext'

export default function NutriDashboard() {
  return (
    <ProtectedRoute perfil="nutri" allowAdmin={true}>
      <NutriDashboardContent />
    </ProtectedRoute>
  )
}

function NutriDashboardContent() {
  const { user, userProfile, loading } = useAuth()
  
  // TODOS OS HOOKS DEVEM ESTAR NO TOPO, ANTES DE QUALQUER RETORNO CONDICIONAL
  const [perfil, setPerfil] = useState({
    nome: '',
    bio: ''
  })
  const [carregandoPerfil, setCarregandoPerfil] = useState(true)
  const [stats, setStats] = useState({
    ferramentasAtivas: 0,
    leadsGerados: 0,
    conversoes: 0,
    clientesAtivos: 0
  })
  const [ferramentasAtivas, setFerramentasAtivas] = useState<Array<{
    id: string
    nome: string
    categoria: string
    leads: number
    conversoes: number
    status: string
    icon: string
  }>>([])
  const [carregandoDados, setCarregandoDados] = useState(true)
  const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null)
  const [mensagemErro, setMensagemErro] = useState<string | null>(null)
  const [excluindoId, setExcluindoId] = useState<string | null>(null)
  const [mostrarConfirmacaoExclusao, setMostrarConfirmacaoExclusao] = useState<string | null>(null)
  const [alterandoStatusId, setAlterandoStatusId] = useState<string | null>(null)
  const [chatAberto, setChatAberto] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Escutar evento para abrir ChatIA do botão unificado
  useEffect(() => {
    const handleOpenChatIA = () => {
      setChatAberto(true)
    }
    
    window.addEventListener('openChatIA', handleOpenChatIA)
    
    return () => {
      window.removeEventListener('openChatIA', handleOpenChatIA)
    }
  }, [])

  // Carregar perfil do usuário - otimizado com timeout menor e fallback rápido
  useEffect(() => {
    // Só executar se houver usuário autenticado
    if (!user) {
      setCarregandoPerfil(false)
      return
    }
    
    // Usar dados disponíveis imediatamente (não bloquear renderização)
    const nomeInicial = userProfile?.nome_completo || (user?.email ? user.email.split('@')[0] : null) || 'Usuário'
    setPerfil({
      nome: nomeInicial,
      bio: ''
    })
    setCarregandoPerfil(false)
    
    // Carregar perfil completo em background (não bloquear UI)
    const carregarPerfil = async () => {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 3000) // 3s timeout
        
        const response = await fetch('/api/nutri/profile', {
          credentials: 'include',
          signal: controller.signal
        })
        
        clearTimeout(timeoutId)
        
        if (response.ok) {
          const data = await response.json()
          if (data.profile) {
            setPerfil({
              nome: data.profile.nome || userProfile?.nome_completo || (user?.email ? user.email.split('@')[0] : null) || 'Usuário',
              bio: data.profile.bio || ''
            })
          }
        }
      } catch (error: any) {
        // Ignorar erros silenciosamente - já temos dados do userProfile
        if (error.name !== 'AbortError') {
          console.warn('Erro ao carregar perfil (não crítico):', error)
        }
      }
    }

    carregarPerfil()
  }, [user, userProfile])

  // Carregar dados do dashboard - otimizado com timeout e abort controller
  useEffect(() => {
    if (!user) return
      
    const carregarDados = async () => {
      try {
        setCarregandoDados(true)
        
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 8000) // 8s timeout
        
        // Usar API do dashboard que já calcula conversões
        const response = await fetch('/api/nutri/dashboard', {
          credentials: 'include',
          signal: controller.signal
        })
        
        clearTimeout(timeoutId)
        
        if (!response.ok) {
          // Se a resposta não for OK, tentar ler o erro
          let errorMessage = 'Erro ao carregar dados do dashboard'
          try {
            const errorData = await response.json()
            errorMessage = errorData.error || errorMessage
            console.error('❌ Erro na API do dashboard Nutri:', {
              status: response.status,
              error: errorData,
              technical: errorData.technical
            })
          } catch (e) {
            console.error('❌ Erro ao processar resposta de erro:', e)
          }
          
          // Mostrar mensagem de erro ao usuário
          setMensagemErro(errorMessage)
          setTimeout(() => setMensagemErro(null), 10000)
          return
        }
        
        const data = await response.json()
        
        if (data.error) {
          console.error('❌ API retornou erro:', data.error)
          setMensagemErro(data.error)
          setTimeout(() => setMensagemErro(null), 10000)
          return
        }
        
        // A API do dashboard retorna ferramentas já processadas com conversões
        if (data.ferramentas && Array.isArray(data.ferramentas)) {
          setFerramentasAtivas(data.ferramentas.map((f: any) => ({
            id: f.id,
            nome: f.nome,
            categoria: f.categoria,
            leads: f.leads || 0,
            conversoes: f.conversoes || 0, // Usar conversões calculadas pela API
            status: f.status,
            icon: f.icon || '🔗'
          })))
        } else {
          // Fallback: buscar ferramentas diretamente se a API não retornar formato esperado
          const ferramentasResponse = await fetch('/api/nutri/ferramentas', {
            credentials: 'include',
            signal: controller.signal
          })
          
          if (ferramentasResponse.ok) {
            const ferramentasData = await ferramentasResponse.json()
            const ferramentas = ferramentasData.tools || ferramentasData.ferramentas || []
            
            setFerramentasAtivas(ferramentas.map((f: any) => {
              let categoria = 'Geral'
              if (f.template_slug?.startsWith('calc-')) {
                categoria = 'Calculadora'
              } else if (f.template_slug?.startsWith('quiz-')) {
                categoria = 'Quiz'
              } else if (f.template_slug?.startsWith('planilha-') || f.template_slug?.startsWith('template-')) {
                categoria = 'Planilha'
              }
              
              // Calcular conversões como estimativa (30% dos leads) se não houver dados reais
              const leads = f.leads_count || f.views || 0
              const conversoes = Math.round(leads * 0.3) // Estimativa: 30% de conversão
              
              return {
                id: f.id,
                nome: f.title || f.nome,
                categoria: categoria,
                leads: leads,
                conversoes: conversoes,
                status: f.status,
                icon: f.emoji || '🔗'
              }
            }))
          }
        }
        
        // Atualizar estatísticas se a API do dashboard retornar
        if (data.stats) {
          setStats({
            ferramentasAtivas: data.stats.ferramentasAtivas || 0,
            leadsGerados: data.stats.leadsGerados || 0,
            conversoes: data.stats.conversoes || 0,
            clientesAtivos: data.stats.clientesAtivos || 0
          })
        } else {
          // Fallback: calcular estatísticas manualmente
          const ferramentas = data.ferramentas || []
          const ativas = ferramentas.filter((f: any) => 
            f.status === 'active' || f.status === 'ativa' || f.status === 'ativo'
          )
          
          const totalLeads = ferramentas.reduce((acc: number, f: any) => acc + (f.leads || 0), 0)
          const totalConversoes = ferramentas.reduce((acc: number, f: any) => acc + (f.conversoes || 0), 0)
          
          setStats({
            ferramentasAtivas: ativas.length,
            leadsGerados: totalLeads,
            conversoes: totalConversoes,
            clientesAtivos: totalConversoes
          })
        }
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

  // Aguardar autenticação carregar antes de renderizar
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }
  
  // Se não houver usuário após carregar, não renderizar (ProtectedRoute deve redirecionar)
  if (!user) {
    return null
  }

  // Alternar status de uma ferramenta
  const alternarStatus = async (ferramentaId: string, statusAtual: string) => {
    try {
      setAlterandoStatusId(ferramentaId)
      const novoStatus = statusAtual === 'active' || statusAtual === 'ativa' || statusAtual === 'ativo' ? 'inactive' : 'active'
      
      const response = await fetch('/api/nutri/ferramentas', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          id: ferramentaId,
          status: novoStatus
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao alterar status')
      }

      // Atualizar estado local
      setFerramentasAtivas(prev => prev.map(f => 
        f.id === ferramentaId 
          ? { ...f, status: novoStatus }
          : f
      ))
      
      setMensagemSucesso(`Ferramenta ${novoStatus === 'active' ? 'ativada' : 'desativada'} com sucesso!`)
      setTimeout(() => setMensagemSucesso(null), 3000)
    } catch (error: any) {
      console.error('Erro ao alterar status:', error)
      setMensagemErro(error.message || 'Erro ao alterar status. Tente novamente.')
      setTimeout(() => setMensagemErro(null), 5000)
    } finally {
      setAlterandoStatusId(null)
    }
  }

  // Excluir ferramenta
  const excluirFerramenta = async (ferramentaId: string) => {
    try {
      setExcluindoId(ferramentaId)
      
      const response = await fetch(`/api/nutri/ferramentas?id=${ferramentaId}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao excluir ferramenta')
      }

      // Remover da lista local
      setFerramentasAtivas(prev => prev.filter(f => f.id !== ferramentaId))
      
      setMensagemSucesso('Ferramenta excluída com sucesso!')
      setTimeout(() => setMensagemSucesso(null), 3000)
      setMostrarConfirmacaoExclusao(null)
    } catch (error: any) {
      console.error('Erro ao excluir ferramenta:', error)
      setMensagemErro(error.message || 'Erro ao excluir ferramenta. Tente novamente.')
      setTimeout(() => setMensagemErro(null), 5000)
      setMostrarConfirmacaoExclusao(null)
    } finally {
      setExcluindoId(null)
    }
  }


  return (
    <div className="min-h-screen bg-gray-50 flex">
      <NutriSidebar 
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
          <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
          <div className="w-10"></div>
        </div>
      
      {/* Mensagens de Sucesso/Erro */}
      {mensagemSucesso && (
        <div className="fixed top-4 right-4 bg-blue-50 border-2 border-blue-400 rounded-lg shadow-lg p-4 z-50 max-w-md" style={{ animation: 'slideInRight 0.3s ease-out' }}>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <span className="text-blue-600 text-2xl">✅</span>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-blue-900 mb-1">Sucesso!</h3>
              <p className="text-xs text-blue-700">{mensagemSucesso}</p>
            </div>
            <button 
              onClick={() => setMensagemSucesso(null)}
              className="text-blue-600 hover:text-blue-800 text-lg font-bold"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {mensagemErro && (
        <div className="fixed top-4 right-4 bg-red-50 border-2 border-red-400 rounded-lg shadow-lg p-4 z-50 max-w-md" style={{ animation: 'slideInRight 0.3s ease-out' }}>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <span className="text-red-600 text-2xl">❌</span>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-red-900 mb-1">Erro</h3>
              <p className="text-xs text-red-700">{mensagemErro}</p>
            </div>
            <button 
              onClick={() => setMensagemErro(null)}
              className="text-red-600 hover:text-red-800 text-lg font-bold"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {mostrarConfirmacaoExclusao && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-start space-x-4 mb-6">
              <div className="flex-shrink-0">
                <span className="text-red-600 text-4xl">⚠️</span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Confirmar Exclusão</h3>
                <p className="text-sm text-gray-600">
                  Tem certeza que deseja excluir esta ferramenta? Esta ação não pode ser desfeita.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setMostrarConfirmacaoExclusao(null)}
                className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                disabled={excluindoId !== null}
              >
                Cancelar
              </button>
              <button
                onClick={() => excluirFerramenta(mostrarConfirmacaoExclusao)}
                disabled={excluindoId !== null}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {excluindoId === mostrarConfirmacaoExclusao ? 'Excluindo...' : 'Excluir'}
              </button>
            </div>
          </div>
        </div>
      )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Hero Section - Boas-vindas */}
        <div className="mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 sm:p-8 text-white shadow-lg">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            Olá, {perfil.nome || 'Nutricionista'}! 👋
          </h1>
          <p className="text-blue-100 text-sm sm:text-base">
            Visão geral do seu negócio. Acompanhe suas métricas e acesse rapidamente todas as áreas.
          </p>
        </div>

        {/* Stats Cards - Visão Geral */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-gray-600">Leads Hoje</p>
              <span className="text-lg">📈</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.leadsGerados}</p>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-gray-600">Clientes Ativos</p>
              <span className="text-lg">👥</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.clientesAtivos}</p>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-gray-600">Links Ativos</p>
              <span className="text-lg">🔗</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.ferramentasAtivas}</p>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-gray-600">Taxa Conversão</p>
              <span className="text-lg">🎯</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {stats.leadsGerados > 0 
                ? `${Math.round((stats.conversoes / stats.leadsGerados) * 100)}%`
                : '0%'}
            </p>
          </div>
        </div>

        {/* ============================================ */}
        {/* ÁREA 1: 🎯 CAPTAÇÃO DE CLIENTES - RESUMO */}
        {/* ============================================ */}
        <div className="mb-8 bg-white rounded-xl p-6 shadow-sm border-2 border-blue-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🎯</span>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Captação de Clientes</h2>
                <p className="text-sm text-gray-600">Resumo da sua captação</p>
              </div>
            </div>
            <Link 
              href="/pt/nutri/ferramentas"
              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              Ver tudo →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">🔗</span>
                <span className="text-2xl font-bold text-blue-600">{stats.ferramentasAtivas}</span>
              </div>
              <h3 className="font-semibold text-gray-900 text-sm mb-1">Links Ativos</h3>
              <p className="text-xs text-gray-600">Ferramentas em funcionamento</p>
            </div>

            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">📈</span>
                <span className="text-2xl font-bold text-purple-600">{stats.leadsGerados}</span>
              </div>
              <h3 className="font-semibold text-gray-900 text-sm mb-1">Leads Gerados</h3>
              <p className="text-xs text-gray-600">Total de contatos capturados</p>
            </div>

            <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">🎯</span>
                <span className="text-2xl font-bold text-indigo-600">{stats.conversoes}</span>
              </div>
              <h3 className="font-semibold text-gray-900 text-sm mb-1">Conversões</h3>
              <p className="text-xs text-gray-600">Leads que viraram clientes</p>
            </div>
          </div>

          {/* Links Ativos - Preview (máximo 3) */}
          {ferramentasAtivas.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 text-sm">Links Recentes</h3>
                <Link 
                  href="/pt/nutri/ferramentas" 
                  className="text-blue-600 hover:text-blue-700 text-xs font-medium"
                >
                  Ver todos →
                </Link>
              </div>
              <div className="space-y-2">
                {ferramentasAtivas.slice(0, 3).map((ferramenta) => {
                  const isActive = ferramenta.status === 'active' || ferramenta.status === 'ativa' || ferramenta.status === 'ativo'
                  return (
                    <Link
                      key={ferramenta.id}
                      href={`/pt/nutri/ferramentas/${ferramenta.id}/editar`}
                      className="flex items-center justify-between p-2 bg-white rounded-lg hover:bg-blue-50 transition-colors border border-gray-200"
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className="text-lg">{ferramenta.icon}</span>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 text-xs truncate">{ferramenta.nome}</h4>
                          <p className="text-xs text-gray-500">{ferramenta.leads} leads</p>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        isActive ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-600'
                      }`}>
                        {isActive ? 'Ativo' : 'Inativo'}
                      </span>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* ============================================ */}
        {/* ÁREA 2: 👥 GESTÃO DE CLIENTES - RESUMO */}
        {/* ============================================ */}
        <div className="mb-8 bg-white rounded-xl p-6 shadow-sm border-2 border-green-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="text-3xl">👥</span>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Gestão de Clientes</h2>
                <p className="text-sm text-gray-600">Resumo da sua gestão</p>
              </div>
            </div>
            <Link 
              href="/pt/nutri/clientes"
              className="text-green-600 hover:text-green-700 font-medium text-sm"
            >
              Ver tudo →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link 
              href="/pt/nutri/clientes"
              className="bg-green-50 rounded-lg p-4 border border-green-200 hover:bg-green-100 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">👤</span>
                <span className="text-2xl font-bold text-green-600">{stats.clientesAtivos}</span>
              </div>
              <h3 className="font-semibold text-gray-900 text-sm mb-1">Clientes Ativos</h3>
              <p className="text-xs text-gray-600">Total de clientes</p>
            </Link>

            <Link 
              href="/pt/nutri/agenda"
              className="bg-teal-50 rounded-lg p-4 border border-teal-200 hover:bg-teal-100 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">📅</span>
                <span className="text-2xl font-bold text-teal-600">-</span>
              </div>
              <h3 className="font-semibold text-gray-900 text-sm mb-1">Agenda</h3>
              <p className="text-xs text-gray-600">Consultas e agendamentos</p>
            </Link>

            <Link 
              href="/pt/nutri/acompanhamento"
              className="bg-emerald-50 rounded-lg p-4 border border-emerald-200 hover:bg-emerald-100 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">📊</span>
                <span className="text-2xl font-bold text-emerald-600">-</span>
              </div>
              <h3 className="font-semibold text-gray-900 text-sm mb-1">Acompanhamento</h3>
              <p className="text-xs text-gray-600">Evolução e progresso</p>
            </Link>
          </div>
        </div>

        {/* ============================================ */}
        {/* ÁREA 3: 📚 FORMAÇÃO - RESUMO */}
        {/* ============================================ */}
        <div className="mb-8 bg-white rounded-xl p-6 shadow-sm border-2 border-purple-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="text-3xl">📚</span>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Formação</h2>
                <p className="text-sm text-gray-600">Resumo da sua formação</p>
              </div>
            </div>
            <Link 
              href="/pt/nutri/cursos"
              className="text-purple-600 hover:text-purple-700 font-medium text-sm"
            >
              Ver tudo →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link 
              href="/pt/nutri/cursos"
              className="bg-purple-50 rounded-lg p-4 border border-purple-200 hover:bg-purple-100 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">🎓</span>
                <span className="text-2xl font-bold text-purple-600">-</span>
              </div>
              <h3 className="font-semibold text-gray-900 text-sm mb-1">Cursos</h3>
              <p className="text-xs text-gray-600">Aprenda e evolua</p>
            </Link>

            <Link 
              href="/pt/nutri/meu-progresso"
              className="bg-pink-50 rounded-lg p-4 border border-pink-200 hover:bg-pink-100 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">📈</span>
                <span className="text-2xl font-bold text-pink-600">-</span>
              </div>
              <h3 className="font-semibold text-gray-900 text-sm mb-1">Meu Progresso</h3>
              <p className="text-xs text-gray-600">Acompanhe sua evolução</p>
            </Link>

            <Link 
              href="/pt/nutri/certificados"
              className="bg-amber-50 rounded-lg p-4 border border-amber-200 hover:bg-amber-100 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">🏆</span>
                <span className="text-2xl font-bold text-amber-600">-</span>
              </div>
              <h3 className="font-semibold text-gray-900 text-sm mb-1">Certificados</h3>
              <p className="text-xs text-gray-600">Conquistas e certificações</p>
            </Link>
          </div>
        </div>

        </div>

        {/* Chat com IA - Removido botão flutuante duplicado */}
        {/* O botão unificado está no SupportChatWidget (layout) */}
        <ChatIA isOpen={chatAberto} onClose={() => setChatAberto(false)} area="nutri" />
      </div>
    </div>
  )
}
