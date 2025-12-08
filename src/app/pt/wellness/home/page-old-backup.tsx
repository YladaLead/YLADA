'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ProtectedRoute from '../../../../components/auth/ProtectedRoute'
import RequireSubscription from '@/components/auth/RequireSubscription'
import { useAuth } from '@/contexts/AuthContext'
import { useWellnessProfile } from '@/hooks/useWellnessProfile'
import WellnessNavBar from '@/components/wellness/WellnessNavBar'
import { buildWellnessToolUrl, getAppUrl } from '@/lib/url-utils'
import { getScriptsByTipo } from '@/lib/wellness-system/scripts-completo'
import type { TipoScript } from '@/types/wellness-system'
import QRCode from '@/components/QRCode'
import NoelOnboardingCompleto from '@/components/wellness/NoelOnboardingCompleto'
import DynamicTemplatePreview from '@/components/shared/DynamicTemplatePreview'
import { fluxosRecrutamento } from '@/lib/wellness-system/fluxos-recrutamento'

interface Template {
  id: string
  nome: string
  categoria: string
  objetivo: string
  icon: string
  descricao: string
  slug: string
  templateId?: string
}

interface Script {
  id: string
  tipo: string
  titulo: string
  conteudo: string
  contexto: string
}

interface UserObjective {
  objetivo_principal?: string
  tempo_disponivel?: string
  experiencia?: string
  canal_preferido?: string
}

export default function WellnessHome() {
  return (
    <ProtectedRoute perfil="wellness" allowAdmin={true}>
      <RequireSubscription area="wellness">
        <WellnessHomeContent />
      </RequireSubscription>
    </ProtectedRoute>
  )
}

function WellnessHomeContent() {
  const { user } = useAuth()
  const { profile, loading: profileLoading } = useWellnessProfile()
  const router = useRouter()
  
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [userObjective, setUserObjective] = useState<UserObjective | null>(null)
  const [selectedTool, setSelectedTool] = useState<Template | null>(null)
  const [selectedScriptType, setSelectedScriptType] = useState<'ja-conhece' | 'nao-conhece' | 'pedir-indicacao'>('nao-conhece')
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [onboardingComplete, setOnboardingComplete] = useState(false)
  const [viewMode, setViewMode] = useState<'home' | 'ferramentas' | 'scripts'>('home')
  const [searchTerm, setSearchTerm] = useState('')
  const [onboardingChecked, setOnboardingChecked] = useState(false)
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null)
  const [filtroTipo, setFiltroTipo] = useState<'todos' | 'vendas' | 'recrutamento'>('todos')
  const [filtroCategoria, setFiltroCategoria] = useState<string>('todas')
  const [filtroObjetivo, setFiltroObjetivo] = useState<string>('todos')
  
  // Estatísticas rápidas
  const [stats, setStats] = useState<{
    totalClientes: number
    pvMensal: number
    clientesRecorrentes: number
    proximosRecompra: number
  } | null>(null)
  const [loadingStats, setLoadingStats] = useState(false)

  // Diagnóstico do consultor
  const [diagnostico, setDiagnostico] = useState<{
    perfil_identificado: string
    pontos_fortes: string[]
    pontos_melhoria: string[]
    recomendacoes: string[]
    orientacoes_personalizadas: string[]
    proximos_passos: string[]
  } | null>(null)
  const [loadingDiagnostico, setLoadingDiagnostico] = useState(false)

  // Carregar templates disponíveis
  useEffect(() => {
    const carregarTemplates = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/wellness/templates', {
          credentials: 'include'
        })
        
        if (response.ok) {
          const data = await response.json()
          if (data.templates) {
            setTemplates(data.templates)
          }
        }
      } catch (error) {
        console.error('Erro ao carregar templates:', error)
      } finally {
        setLoading(false)
      }
    }

    carregarTemplates()
  }, [])

  // Verificar se precisa fazer onboarding (apenas uma vez)
  useEffect(() => {
    const verificarOnboarding = async () => {
      if (!user || onboardingChecked || showOnboarding) return
      
      try {
        setOnboardingChecked(true) // Marcar como verificado para evitar loops
        const response = await fetch('/api/wellness/noel/onboarding', {
          credentials: 'include'
        })
        
        if (response.ok) {
          const data = await response.json()
          if (!data.onboardingComplete) {
            setShowOnboarding(true)
          } else {
            setOnboardingComplete(true)
            // Carregar objetivo do perfil
            if (data.profile) {
              setUserObjective({
                objetivo_principal: data.profile.objetivo_principal,
                tempo_disponivel: data.profile.tempo_disponivel,
                experiencia: data.profile.experiencia_vendas,
                canal_preferido: Array.isArray(data.profile.canal_preferido) 
                  ? data.profile.canal_preferido[0] 
                  : data.profile.canal_preferido || 'whatsapp'
              })
            }
          }
        }
      } catch (error) {
        console.error('Erro ao verificar onboarding:', error)
        setOnboardingChecked(false) // Resetar em caso de erro para tentar novamente
      }
    }

    verificarOnboarding()
  }, [user]) // Removido onboardingChecked e showOnboarding das dependências para evitar loop

  // Carregar estatísticas rápidas
  useEffect(() => {
    const carregarEstatisticas = async () => {
      if (viewMode !== 'home') return
      
      try {
        setLoadingStats(true)
        
        // Buscar clientes
        const clientesResponse = await fetch('/api/wellness/clientes', {
          credentials: 'include'
        })
        
        // Buscar PV mensal
        const pvResponse = await fetch('/api/wellness/pv/mensal', {
          credentials: 'include'
        })

        if (clientesResponse.ok && pvResponse.ok) {
          const clientesData = await clientesResponse.json()
          const pvData = await pvResponse.json()
          
          const clientes = clientesData.clientes || []
          const pvMensal = pvData.pv_mensal?.pv_total || 0
          
          // Calcular estatísticas
          const totalClientes = clientes.length
          const clientesRecorrentes = clientes.filter((c: any) => c.status === 'cliente_recorrente').length
          
          // Clientes próximos de recompra (7 dias)
          const hoje = new Date()
          const proximosRecompra = clientes.filter((c: any) => {
            if (!c.ultima_compra?.previsao_recompra) return false
            const recompra = new Date(c.ultima_compra.previsao_recompra)
            const diff = Math.ceil((recompra.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24))
            return diff <= 7 && diff >= 0
          }).length

          setStats({
            totalClientes,
            pvMensal,
            clientesRecorrentes,
            proximosRecompra
          })
        }
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error)
      } finally {
        setLoadingStats(false)
      }
    }

    carregarEstatisticas()
  }, [viewMode])

  // Carregar diagnóstico do consultor
  useEffect(() => {
    const carregarDiagnostico = async () => {
      if (!onboardingComplete) return
      
      try {
        setLoadingDiagnostico(true)
        const response = await fetch('/api/wellness/consultor/diagnostico', {
          credentials: 'include'
        })
        
        if (response.ok) {
          const data = await response.json()
          if (data.hasDiagnostico && data.diagnostico) {
            setDiagnostico(data.diagnostico)
          }
        }
      } catch (error) {
        console.error('Erro ao carregar diagnóstico:', error)
      } finally {
        setLoadingDiagnostico(false)
      }
    }

    carregarDiagnostico()
  }, [onboardingComplete])

  // Salvar onboarding
  const handleOnboardingComplete = async (onboardingData: any): Promise<void> => {
    try {
      console.log('💾 Salvando onboarding:', onboardingData)
      
      const response = await fetch('/api/wellness/noel/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(onboardingData)
      })

      const responseData = await response.json()
      console.log('📡 Resposta da API:', responseData)

      if (!response.ok) {
        const errorMessage = responseData.details 
          ? `${responseData.error}: ${responseData.details}${responseData.hint ? ` (${responseData.hint})` : ''}`
          : responseData.error || 'Erro ao salvar onboarding'
        console.error('❌ Erro detalhado:', {
          status: response.status,
          error: responseData.error,
          details: responseData.details,
          hint: responseData.hint,
          code: responseData.code
        })
        throw new Error(errorMessage)
      }

      if (responseData.success) {
        setShowOnboarding(false)
        setOnboardingComplete(true)
        setOnboardingChecked(true) // Marcar como verificado após salvar
        setUserObjective({
          objetivo_principal: onboardingData.objetivo_principal,
          tempo_disponivel: onboardingData.tempo_disponivel,
          experiencia: onboardingData.experiencia_vendas,
          canal_preferido: Array.isArray(onboardingData.canal_preferido) 
            ? onboardingData.canal_preferido[0] 
            : (onboardingData.canal_preferido || 'whatsapp')
        })
        
        // Mostrar mensagem de sucesso
        alert('✅ Perfil configurado com sucesso!')
      } else {
        throw new Error('Resposta inesperada da API')
      }
    } catch (error: any) {
      console.error('❌ Erro ao salvar onboarding:', error)
      throw error // Re-throw para o componente tratar
    }
  }

  // Gerar link da ferramenta
  const gerarLink = (template: Template): string | null => {
    // Se não tiver userSlug, não pode gerar link
    if (!profile?.userSlug) {
      return null
    }
    const baseUrl = getAppUrl()
    return `${baseUrl}/pt/wellness/${profile.userSlug}/${template.slug}`
  }

  // Obter scripts contextuais baseados no objetivo e tipo de pessoa
  const obterScripts = (template: Template, tipoPessoa: 'ja-conhece' | 'nao-conhece' | 'pedir-indicacao') => {
    const scripts: Script[] = []
    
    // Scripts de abertura baseados no tipo de pessoa
    const aberturaScripts = getScriptsByTipo('abertura' as TipoScript)
    
    if (tipoPessoa === 'ja-conhece') {
      // Para quem já conhece - scripts mais diretos
      scripts.push(...aberturaScripts.filter(s => 
        s.id === 'abertura-1' || // Direta para pessoas próximas
        s.id === 'abertura-2' || // Leve/Amigável
        s.id === 'abertura-7'    // Lead Morno
      ))
    } else if (tipoPessoa === 'nao-conhece') {
      // Para quem não conhece - scripts mais educativos
      scripts.push(...aberturaScripts.filter(s => 
        s.id === 'abertura-3' || // Curiosa (mais poderosa)
        s.id === 'abertura-4' || // Consultiva
        s.id === 'abertura-6'    // Lead Frio
      ))
    } else if (tipoPessoa === 'pedir-indicacao') {
      // Para pedir indicação
      scripts.push(...aberturaScripts.filter(s => 
        s.id === 'abertura-9'    // Via Indicação
      ))
    }

    return scripts
  }

  // Obter CTA contextual baseado na ferramenta
  const obterCTA = (template: Template) => {
    // CTAs específicos por tipo de ferramenta
    if (template.slug.includes('agua') || template.slug.includes('hidratacao')) {
      return {
        mensagem: 'Melhore sua hidratação',
        botao: 'Saiba como melhorar sua hidratação',
        acao: 'whatsapp'
      }
    } else if (template.slug.includes('imc')) {
      return {
        mensagem: 'Entenda seu IMC',
        botao: 'Saiba mais sobre seu IMC',
        acao: 'whatsapp'
      }
    } else if (template.slug.includes('quiz')) {
      return {
        mensagem: 'Descubra seu perfil',
        botao: 'Ver seus resultados',
        acao: 'whatsapp'
      }
    }
    
    // CTA padrão
    return {
      mensagem: 'Saiba mais',
      botao: 'Fale comigo sobre seus resultados',
      acao: 'whatsapp'
    }
  }

  // Mostrar loading apenas se ainda não tiver tentado carregar
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <WellnessNavBar showTitle={true} title="Home" />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando ferramentas...</p>
          </div>
        </div>
      </div>
    )
  }

  // Não bloquear se o perfil ainda estiver carregando (não é crítico)
  // O perfil pode ser carregado em background

  // Não bloquear renderização se não tiver userSlug - apenas mostrar aviso
  // O userSlug pode ser configurado depois, não é crítico para ver o home

  return (
    <div className="min-h-screen bg-gray-50">
      <WellnessNavBar showTitle={true} title="Home" />
      
      {/* Onboarding Modal */}
      {showOnboarding && (
        <NoelOnboardingCompleto 
          onComplete={handleOnboardingComplete}
          onClose={() => setShowOnboarding(false)}
        />
      )}
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Seção de Diagnóstico e Perfil */}
        {diagnostico && onboardingComplete && (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-8 mb-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h1 className="text-2xl font-semibold mb-2 flex items-center gap-3 text-gray-800">
                  <span className="text-3xl">📊</span>
                  Seu Diagnóstico Personalizado
                </h1>
                <p className="text-gray-600 text-sm">
                  Análise baseada no seu perfil e objetivos
                </p>
              </div>
              <button
                onClick={() => setShowOnboarding(true)}
                className="bg-white hover:bg-gray-50 border border-blue-200 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
              >
                ✏️ Atualizar Perfil
              </button>
            </div>

            {/* Perfil Identificado */}
            <div className="bg-white rounded-xl p-6 border border-blue-100 shadow-sm mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span>🎯</span> Seu Perfil
              </h2>
              <p className="text-xl font-bold text-blue-600">{diagnostico.perfil_identificado}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Pontos Fortes */}
              <div className="bg-white rounded-xl p-6 border border-green-200 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <span>✅</span> Pontos Fortes
                </h3>
                <ul className="space-y-2">
                  {diagnostico.pontos_fortes.map((ponto, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-700">
                      <span className="text-green-500 mt-1">•</span>
                      <span>{ponto}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Pontos de Melhoria */}
              <div className="bg-white rounded-xl p-6 border border-orange-200 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <span>📈</span> Áreas de Desenvolvimento
                </h3>
                <ul className="space-y-2">
                  {diagnostico.pontos_melhoria.map((ponto, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-700">
                      <span className="text-orange-500 mt-1">•</span>
                      <span>{ponto}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Recomendações */}
            <div className="bg-white rounded-xl p-6 border border-purple-200 shadow-sm mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span>💡</span> Recomendações Estratégicas
              </h3>
              <ul className="space-y-2">
                {diagnostico.recomendacoes.map((recomendacao, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-700">
                    <span className="text-purple-500 mt-1">→</span>
                    <span>{recomendacao}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Orientações Personalizadas */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-200 shadow-sm mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span>🎯</span> Orientações Personalizadas para Você
              </h3>
              <ul className="space-y-3">
                {diagnostico.orientacoes_personalizadas.map((orientacao, index) => (
                  <li key={index} className="flex items-start gap-3 text-gray-800">
                    <span className="text-emerald-600 mt-1 font-bold">•</span>
                    <span className="flex-1">{orientacao}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Próximos Passos */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span>🚀</span> Próximos Passos (Ações Imediatas)
              </h3>
              <ul className="space-y-3">
                {diagnostico.proximos_passos.map((passo, index) => (
                  <li key={index} className="flex items-start gap-3 text-gray-800">
                    <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <span className="flex-1 font-medium">{passo}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Banner de Lembretes - Onde você está (fallback se não tiver diagnóstico) */}
        {userObjective && !diagnostico && (
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100 p-8 mb-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h1 className="text-2xl font-semibold mb-2 flex items-center gap-3 text-gray-800">
                  <span className="text-3xl">🎯</span>
                  Você está aqui
                </h1>
                <p className="text-gray-600 text-sm">
                  Lembre-se do que você se propôs a alcançar
                </p>
              </div>
              <button
                onClick={() => setShowOnboarding(true)}
                className="bg-white hover:bg-gray-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
              >
                ✏️ Editar
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-4 border border-green-100 shadow-sm">
                <p className="text-xs text-gray-500 mb-2 font-medium">Seu Objetivo</p>
                <p className="text-lg font-semibold text-gray-800">
                  {userObjective.objetivo_principal === 'vender_mais' ? '💰 Vender mais' :
                   userObjective.objetivo_principal === 'construir_carteira' ? '👥 Construir carteira' :
                   userObjective.objetivo_principal === 'melhorar_rotina' ? '📅 Melhorar rotina' :
                   userObjective.objetivo_principal === 'voltar_ritmo' ? '🔄 Voltar ao ritmo' :
                   '📚 Aprender a divulgar'}
                </p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-green-100 shadow-sm">
                <p className="text-xs text-gray-500 mb-2 font-medium">Tempo Disponível</p>
                <p className="text-lg font-semibold text-gray-800">
                  {userObjective.tempo_disponivel === '15_minutos' ? '⏱️ 15 min/dia' :
                   userObjective.tempo_disponivel === '30_minutos' ? '⏰ 30 min/dia' :
                   userObjective.tempo_disponivel === '1_hora' ? '🕐 1h/dia' :
                   '🕑 +1h/dia'}
                </p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-green-100 shadow-sm">
                <p className="text-xs text-gray-500 mb-2 font-medium">Sua Experiência</p>
                <p className="text-lg font-semibold text-gray-800">
                  {userObjective.experiencia === 'sim_regularmente' ? '✅ Experiente' :
                   userObjective.experiencia === 'ja_vendi_tempo' ? '⏳ Já vendi' :
                   '🆕 Iniciante'}
                </p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-green-100 shadow-sm">
                <p className="text-xs text-gray-500 mb-2 font-medium">Canal Principal</p>
                <p className="text-lg font-semibold text-gray-800">
                  {userObjective.canal_preferido === 'whatsapp' ? '💬 WhatsApp' :
                   userObjective.canal_preferido === 'instagram' ? '📸 Instagram' :
                   userObjective.canal_preferido === 'presencial' ? '🚶 Presencial' :
                   userObjective.canal_preferido === 'grupos' ? '👥 Grupos' :
                   '🔄 Misto'}
                </p>
              </div>
            </div>

            {/* Mensagem Motivacional */}
            <div className="mt-6 pt-6 border-t border-green-100">
              <p className="text-gray-600 text-center text-sm italic">
                "O que você faz hoje determina onde você estará amanhã. Continue focado no seu objetivo!"
              </p>
            </div>
          </div>
        )}

        {/* Estatísticas Rápidas */}
        {viewMode === 'home' && stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div 
              onClick={() => router.push('/pt/wellness/clientes')}
              className="bg-gradient-to-br from-orange-50 to-orange-100/50 border border-orange-200 rounded-xl p-4 cursor-pointer hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">👥</span>
                <span className="text-xs text-orange-600 font-medium group-hover:text-orange-700">Ver todos →</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalClientes}</p>
              <p className="text-xs text-gray-600 mt-1">Total de Clientes</p>
            </div>

            <div 
              onClick={() => router.push('/pt/wellness/evolucao')}
              className="bg-gradient-to-br from-teal-50 to-teal-100/50 border border-teal-200 rounded-xl p-4 cursor-pointer hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">📈</span>
                <span className="text-xs text-teal-600 font-medium group-hover:text-teal-700">Ver detalhes →</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.pvMensal.toFixed(0)}</p>
              <p className="text-xs text-gray-600 mt-1">PV Mensal</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100/50 border border-green-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">✅</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.clientesRecorrentes}</p>
              <p className="text-xs text-gray-600 mt-1">Recorrentes</p>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100/50 border border-yellow-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">⏰</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.proximosRecompra}</p>
              <p className="text-xs text-gray-600 mt-1">Próximos de Recompra</p>
            </div>
          </div>
        )}

        {/* Menu Principal - Cards de Navegação */}
        {viewMode === 'home' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Card: Peça Ajuda ao NOEL */}
            <button
              onClick={() => router.push('/pt/wellness/noel')}
              className="bg-gradient-to-br from-white to-purple-50/30 border-2 border-purple-100 rounded-xl p-6 shadow-sm hover:shadow-lg hover:border-purple-300 transition-all duration-300 text-left group transform hover:-translate-y-1"
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl p-3 shadow-sm group-hover:shadow-md transition-shadow">
                  <span className="text-3xl group-hover:scale-110 transition-transform block">🤖</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-1 text-gray-800 group-hover:text-purple-700 transition-colors">Peça Ajuda ao NOEL</h3>
                  <p className="text-gray-500 text-xs">Sua inteligência artificial</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">Clique para abrir o chat e receber orientações personalizadas</p>
            </button>

            {/* Card: Meus Clientes */}
            <button
              onClick={() => router.push('/pt/wellness/clientes')}
              className="bg-gradient-to-br from-white to-orange-50/30 border-2 border-orange-100 rounded-xl p-6 shadow-sm hover:shadow-lg hover:border-orange-300 transition-all duration-300 text-left group transform hover:-translate-y-1"
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl p-3 shadow-sm group-hover:shadow-md transition-shadow">
                  <span className="text-3xl group-hover:scale-110 transition-transform block">👥</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-1 text-gray-800 group-hover:text-orange-700 transition-colors">Meus Clientes</h3>
                  <p className="text-gray-500 text-xs">Gerencie seus clientes</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">Cadastre clientes, registre compras e acompanhe PV gerado</p>
            </button>

            {/* Card: Minha Evolução */}
            <button
              onClick={() => router.push('/pt/wellness/evolucao')}
              className="bg-gradient-to-br from-white to-teal-50/30 border-2 border-teal-100 rounded-xl p-6 shadow-sm hover:shadow-lg hover:border-teal-300 transition-all duration-300 text-left group transform hover:-translate-y-1"
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="bg-gradient-to-br from-teal-100 to-teal-200 rounded-xl p-3 shadow-sm group-hover:shadow-md transition-shadow">
                  <span className="text-3xl group-hover:scale-110 transition-transform block">📈</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-1 text-gray-800 group-hover:text-teal-700 transition-colors">Minha Evolução</h3>
                  <p className="text-gray-500 text-xs">Acompanhe seu progresso</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">Veja seu PV mensal, metas e evolução de carreira</p>
            </button>

            {/* Card: Ferramentas */}
            <button
              onClick={() => setViewMode('ferramentas')}
              className="bg-gradient-to-br from-white to-green-50/30 border-2 border-green-100 rounded-xl p-6 shadow-sm hover:shadow-lg hover:border-green-300 transition-all duration-300 text-left group transform hover:-translate-y-1"
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-xl p-3 shadow-sm group-hover:shadow-md transition-shadow">
                  <span className="text-3xl group-hover:scale-110 transition-transform block">📊</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-1 text-gray-800 group-hover:text-green-700 transition-colors">Ferramentas</h3>
                  <p className="text-gray-500 text-xs">Acesse todas as suas ferramentas</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">Visualize links, scripts, previews e fluxos de cada ferramenta</p>
            </button>

            {/* Card: Scripts */}
            <button
              onClick={() => setViewMode('scripts')}
              className="bg-gradient-to-br from-white to-blue-50/30 border-2 border-blue-100 rounded-xl p-6 shadow-sm hover:shadow-lg hover:border-blue-300 transition-all duration-300 text-left group transform hover:-translate-y-1"
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl p-3 shadow-sm group-hover:shadow-md transition-shadow">
                  <span className="text-3xl group-hover:scale-110 transition-transform block">📝</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-1 text-gray-800 group-hover:text-blue-700 transition-colors">Scripts</h3>
                  <p className="text-gray-500 text-xs">Biblioteca completa de scripts</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">Scripts prontos para copiar e usar em suas conversas</p>
            </button>

            {/* Card: Configurações */}
            <button
              onClick={() => router.push('/pt/wellness/configuracao')}
              className="bg-gradient-to-br from-white to-gray-50/30 border-2 border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-lg hover:border-gray-300 transition-all duration-300 text-left group transform hover:-translate-y-1"
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl p-3 shadow-sm group-hover:shadow-md transition-shadow">
                  <span className="text-3xl group-hover:scale-110 transition-transform block">⚙️</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-1 text-gray-800 group-hover:text-gray-700 transition-colors">Configurações</h3>
                  <p className="text-gray-500 text-xs">Gerencie seu perfil e preferências</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">Ajuste seu perfil, senha e outras configurações</p>
            </button>
          </div>
        )}

        {/* Visualização: Ferramentas */}
        {viewMode === 'ferramentas' && (
          <div className="mb-8">
            {/* Header com botão voltar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setViewMode('home')}
                  className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
                >
                  <span>←</span>
                  <span>Voltar</span>
                </button>
                <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                  <span className="text-3xl">📊</span>
                  Ferramentas
                </h2>
              </div>
            </div>

            {/* Barra de Busca e Filtros */}
            <div className="mb-6 space-y-4">
              {/* Barra de Busca */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="🔍 Buscar ferramenta..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 pl-10 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
              </div>

              {/* Filtros */}
              <div className="flex flex-wrap gap-3">
                {/* Filtro por Tipo */}
                <div className="flex items-center gap-2">
                  <label className="text-xs font-medium text-gray-700">Tipo:</label>
                  <select
                    value={filtroTipo}
                    onChange={(e) => setFiltroTipo(e.target.value as 'todos' | 'vendas' | 'recrutamento')}
                    className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="todos">Todas</option>
                    <option value="vendas">💰 Vendas</option>
                    <option value="recrutamento">👥 Recrutamento</option>
                  </select>
                </div>

                {/* Filtro por Categoria */}
                <div className="flex items-center gap-2">
                  <label className="text-xs font-medium text-gray-700">Categoria:</label>
                  <select
                    value={filtroCategoria}
                    onChange={(e) => setFiltroCategoria(e.target.value)}
                    className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="todas">Todas</option>
                    {Array.from(new Set(templates.map(t => t.categoria))).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Botão Limpar Filtros */}
                {(filtroTipo !== 'todos' || filtroCategoria !== 'todas' || filtroObjetivo !== 'todos' || searchTerm) && (
                  <button
                    onClick={() => {
                      setFiltroTipo('todos')
                      setFiltroCategoria('todas')
                      setFiltroObjetivo('todos')
                      setSearchTerm('')
                    }}
                    className="text-xs text-gray-600 hover:text-gray-800 underline"
                  >
                    Limpar filtros
                  </button>
                )}
              </div>
            </div>

            {templates.length === 0 ? (
              <p className="text-gray-600 text-center py-8">Nenhuma ferramenta disponível no momento.</p>
            ) : (
              <>
                {/* Filtrar ferramentas */}
                {(() => {
                  // Ferramentas de Recrutamento
                  const ferramentasRecrutamento = templates.filter((template) => {
                    const nomeLower = template.nome.toLowerCase()
                    const slugLower = template.slug?.toLowerCase() || ''
                    return (
                      nomeLower.includes('propósito') ||
                      nomeLower.includes('proposito') ||
                      nomeLower.includes('equilíbrio') ||
                      nomeLower.includes('equilibrio') ||
                      nomeLower.includes('potencial') ||
                      nomeLower.includes('crescimento') ||
                      nomeLower.includes('ganho') ||
                      nomeLower.includes('prosperidade') ||
                      slugLower.includes('quiz-proposito') ||
                      slugLower.includes('quiz-potencial') ||
                      slugLower.includes('quiz-ganhos')
                    )
                  })

                  // Ferramentas de Vendas (todas as outras)
                  const ferramentasVendas = templates.filter((template) => {
                    const nomeLower = template.nome.toLowerCase()
                    const slugLower = template.slug?.toLowerCase() || ''
                    return !(
                      nomeLower.includes('propósito') ||
                      nomeLower.includes('proposito') ||
                      nomeLower.includes('equilíbrio') ||
                      nomeLower.includes('equilibrio') ||
                      nomeLower.includes('potencial') ||
                      nomeLower.includes('crescimento') ||
                      nomeLower.includes('ganho') ||
                      nomeLower.includes('prosperidade') ||
                      slugLower.includes('quiz-proposito') ||
                      slugLower.includes('quiz-potencial') ||
                      slugLower.includes('quiz-ganhos')
                    )
                  })

                  // Filtrar por busca
                  const filtrarPorBusca = (lista: Template[]) => {
                    if (!searchTerm) return lista
                    const term = searchTerm.toLowerCase()
                    return lista.filter((t) =>
                      t.nome.toLowerCase().includes(term) ||
                      t.categoria.toLowerCase().includes(term) ||
                      t.slug?.toLowerCase().includes(term)
                    )
                  }

                  // Filtrar por categoria
                  const filtrarPorCategoria = (lista: Template[]) => {
                    if (filtroCategoria === 'todas') return lista
                    return lista.filter((t) => t.categoria === filtroCategoria)
                  }

                  // Aplicar todos os filtros
                  let vendasFiltradas = filtrarPorBusca(ferramentasVendas)
                  let recrutamentoFiltradas = filtrarPorBusca(ferramentasRecrutamento)
                  
                  vendasFiltradas = filtrarPorCategoria(vendasFiltradas)
                  recrutamentoFiltradas = filtrarPorCategoria(recrutamentoFiltradas)

                  // Filtrar por tipo (vendas/recrutamento)
                  const mostrarVendas = filtroTipo === 'todos' || filtroTipo === 'vendas'
                  const mostrarRecrutamento = filtroTipo === 'todos' || filtroTipo === 'recrutamento'

                  return (
                    <>
                      {/* Ferramentas de Vendas */}
                      {mostrarVendas && vendasFiltradas.length > 0 && (
                        <div className="mb-8">
                          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <span>💰</span>
                            <span>Ferramentas de Vendas</span>
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {vendasFiltradas.map((template) => {
                              const link = gerarLink(template)
                              const cta = obterCTA(template)
                              
                              return (
                                <div
                                  key={template.id}
                                  className="bg-white border border-gray-200 rounded-xl p-5 hover:border-green-300 hover:shadow-md transition-all"
                                >
                                  {/* Header da Ferramenta - Sem ícone */}
                                  <div className="mb-4">
                                    <h3 className="font-semibold text-gray-800 text-lg mb-1">{template.nome}</h3>
                                    <p className="text-xs text-gray-500">{template.categoria}</p>
                                  </div>

                                  {/* Link - Botão Grande para Copiar */}
                                  {link ? (
                                    <div className="mb-3">
                                      <button
                                        onClick={() => {
                                          navigator.clipboard.writeText(link)
                                          alert('✅ Link copiado!')
                                        }}
                                        className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg text-sm font-semibold shadow-sm transition-colors flex items-center justify-center gap-2"
                                        title="Copiar link"
                                      >
                                        <span>🔗</span>
                                        <span>Copiar Seu Link</span>
                                        <span>📋</span>
                                      </button>
                                      <p className="text-xs text-gray-500 mt-1.5 text-center truncate">
                                        {link.replace(/^https?:\/\//, '')}
                                      </p>
                                    </div>
                                  ) : (
                                    <div className="mb-3 p-3 bg-gray-50 border border-gray-200 rounded-lg text-center">
                                      <p className="text-xs text-gray-500">
                                        Configure seu perfil para gerar seu link personalizado
                                      </p>
                                    </div>
                                  )}

                                  {/* Botões Secundários */}
                                  <div className="grid grid-cols-2 gap-2 mb-3">
                                    <button
                                      onClick={() => {
                                        setSelectedTool(template)
                                        setSelectedScriptType('nao-conhece')
                                      }}
                                      className="bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
                                    >
                                      <span>📝</span>
                                      <span>Scripts</span>
                                    </button>
                                    <button
                                      onClick={() => {
                                        setPreviewTemplate(template)
                                      }}
                                      className="bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
                                    >
                                      <span>👁️</span>
                                      <span>Preview</span>
                                    </button>
                                  </div>


                                  {/* Como Funciona - Expandível */}
                                  <details className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                                    <summary className="cursor-pointer font-medium text-gray-700 flex items-center gap-2 text-sm">
                                      <span>📋</span>
                                      <span>Como funciona</span>
                                    </summary>
                                    <div className="mt-2 pt-2 border-t border-gray-200">
                                      <ol className="space-y-1.5 text-xs text-gray-600">
                                        <li className="flex items-start gap-2">
                                          <span className="font-medium text-green-600">1.</span>
                                          <span>Compartilhe o link com seus contatos</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                          <span className="font-medium text-green-600">2.</span>
                                          <span>Use os scripts para iniciar conversas</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                          <span className="font-medium text-green-600">3.</span>
                                          <span>Acompanhe os resultados no home</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                          <span className="font-medium text-green-600">4.</span>
                                          <span>Peça ajuda ao NOEL quando precisar</span>
                                        </li>
                                      </ol>
                                    </div>
                                  </details>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )}

                      {/* Ferramentas de Recrutamento */}
                      {mostrarRecrutamento && recrutamentoFiltradas.length > 0 && (
                        <div className="mb-8">
                          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <span>👥</span>
                            <span>Ferramentas de Recrutamento</span>
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {recrutamentoFiltradas.map((template) => {
                              const link = gerarLink(template)
                              const cta = obterCTA(template)
                              
                              return (
                                <div
                                  key={template.id}
                                  className="bg-white border border-gray-200 rounded-xl p-5 hover:border-green-300 hover:shadow-md transition-all"
                                >
                                  {/* Header da Ferramenta - Sem ícone */}
                                  <div className="mb-4">
                                    <h3 className="font-semibold text-gray-800 text-lg mb-1">{template.nome}</h3>
                                    <p className="text-xs text-gray-500">{template.categoria}</p>
                                  </div>

                                  {/* Link - Botão Grande para Copiar */}
                                  {link ? (
                                    <div className="mb-3">
                                      <button
                                        onClick={() => {
                                          navigator.clipboard.writeText(link)
                                          alert('✅ Link copiado!')
                                        }}
                                        className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg text-sm font-semibold shadow-sm transition-colors flex items-center justify-center gap-2"
                                        title="Copiar link"
                                      >
                                        <span>🔗</span>
                                        <span>Copiar Seu Link</span>
                                        <span>📋</span>
                                      </button>
                                      <p className="text-xs text-gray-500 mt-1.5 text-center truncate">
                                        {link.replace(/^https?:\/\//, '')}
                                      </p>
                                    </div>
                                  ) : (
                                    <div className="mb-3 p-3 bg-gray-50 border border-gray-200 rounded-lg text-center">
                                      <p className="text-xs text-gray-500">
                                        Configure seu perfil para gerar seu link personalizado
                                      </p>
                                    </div>
                                  )}

                                  {/* Botões Secundários */}
                                  <div className="grid grid-cols-2 gap-2 mb-3">
                                    <button
                                      onClick={() => {
                                        setSelectedTool(template)
                                        setSelectedScriptType('nao-conhece')
                                      }}
                                      className="bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
                                    >
                                      <span>📝</span>
                                      <span>Scripts</span>
                                    </button>
                                    <button
                                      onClick={() => {
                                        setPreviewTemplate(template)
                                      }}
                                      className="bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
                                    >
                                      <span>👁️</span>
                                      <span>Preview</span>
                                    </button>
                                  </div>


                                  {/* Como Funciona - Expandível */}
                                  <details className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                                    <summary className="cursor-pointer font-medium text-gray-700 flex items-center gap-2 text-sm">
                                      <span>📋</span>
                                      <span>Como funciona</span>
                                    </summary>
                                    <div className="mt-2 pt-2 border-t border-gray-200">
                                      <ol className="space-y-1.5 text-xs text-gray-600">
                                        <li className="flex items-start gap-2">
                                          <span className="font-medium text-green-600">1.</span>
                                          <span>Compartilhe o link com seus contatos</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                          <span className="font-medium text-green-600">2.</span>
                                          <span>Use os scripts para iniciar conversas</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                          <span className="font-medium text-green-600">3.</span>
                                          <span>Acompanhe os resultados no home</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                          <span className="font-medium text-green-600">4.</span>
                                          <span>Peça ajuda ao NOEL quando precisar</span>
                                        </li>
                                      </ol>
                                    </div>
                                  </details>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )}

                      {/* Mensagem se não encontrar nada */}
                      {((mostrarVendas && vendasFiltradas.length === 0) || !mostrarVendas) && 
                       ((mostrarRecrutamento && recrutamentoFiltradas.length === 0) || !mostrarRecrutamento) && 
                       (mostrarVendas || mostrarRecrutamento) && (
                        <div className="text-center py-8">
                          <p className="text-gray-600">
                            {searchTerm 
                              ? `Nenhuma ferramenta encontrada com "${searchTerm}"`
                              : 'Nenhuma ferramenta encontrada com os filtros selecionados'}
                          </p>
                        </div>
                      )}
                    </>
                  )
                })()}

                {/* Seção de Fluxos de Recrutamento */}
                {filtroTipo === 'todos' || filtroTipo === 'recrutamento' ? (
                  <div className="mt-12 mb-8">
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <span>👥</span>
                        <span>Fluxos de Recrutamento</span>
                      </h2>
                      <p className="text-gray-600 text-sm">
                        Diagnósticos para identificar pessoas com potencial de interesse em apresentações de negócio
                      </p>
                    </div>

                    {/* Filtrar fluxos por busca */}
                    {(() => {
                      const fluxosFiltrados = fluxosRecrutamento.filter(fluxo => {
                        if (searchTerm) {
                          const term = searchTerm.toLowerCase()
                          return (
                            fluxo.nome.toLowerCase().includes(term) ||
                            fluxo.objetivo.toLowerCase().includes(term) ||
                            fluxo.tags.some(tag => tag.toLowerCase().includes(term))
                          )
                        }
                        return true
                      })

                      if (fluxosFiltrados.length === 0) {
                        return (
                          <div className="text-center py-8">
                            <p className="text-gray-600">
                              {searchTerm 
                                ? `Nenhum fluxo encontrado com "${searchTerm}"`
                                : 'Nenhum fluxo disponível'}
                            </p>
                          </div>
                        )
                      }

                      return (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {fluxosFiltrados.map((fluxo) => {
                            const link = profile?.userSlug 
                              ? `${window.location.origin}/pt/wellness/${profile.userSlug}/fluxos/recrutamento/${fluxo.id}`
                              : null

                            return (
                              <div
                                key={fluxo.id}
                                className="bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all"
                              >
                                {/* Header do Fluxo */}
                                <div className="mb-4">
                                  <h3 className="font-semibold text-gray-800 text-lg mb-1">{fluxo.nome}</h3>
                                  <p className="text-xs text-gray-500 line-clamp-2">{fluxo.objetivo}</p>
                                </div>

                                {/* Informações do Fluxo */}
                                <div className="mb-3 flex items-center gap-2 text-xs text-gray-500">
                                  <span>📋</span>
                                  <span>{fluxo.perguntas.length} perguntas</span>
                                </div>

                                {/* Link - Botão Grande para Copiar */}
                                {link ? (
                                  <div className="mb-3">
                                    <button
                                      onClick={() => {
                                        navigator.clipboard.writeText(link)
                                        alert('✅ Link copiado!')
                                      }}
                                      className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg text-sm font-semibold shadow-sm transition-colors flex items-center justify-center gap-2"
                                      title="Copiar link"
                                    >
                                      <span>🔗</span>
                                      <span>Copiar Link do Fluxo</span>
                                      <span>📋</span>
                                    </button>
                                    <p className="text-xs text-gray-500 mt-1.5 text-center truncate">
                                      {link.replace(/^https?:\/\//, '')}
                                    </p>
                                  </div>
                                ) : (
                                  <div className="mb-3 p-3 bg-gray-50 border border-gray-200 rounded-lg text-center">
                                    <p className="text-xs text-gray-500">
                                      Configure seu perfil para gerar seu link personalizado
                                    </p>
                                  </div>
                                )}

                                {/* Tags */}
                                {fluxo.tags.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-3">
                                    {fluxo.tags.slice(0, 3).map((tag, idx) => (
                                      <span
                                        key={idx}
                                        className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded"
                                      >
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      )
                    })()}
                  </div>
                ) : null}
              </>
            )}
          </div>
        )}

        {/* Visualização: Scripts */}
        {viewMode === 'scripts' && (
          <div className="mb-8">
            {/* Header com botão voltar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setViewMode('home')}
                  className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
                >
                  <span>←</span>
                  <span>Voltar</span>
                </button>
                <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                  <span className="text-3xl">📝</span>
                  Biblioteca de Scripts
                </h2>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
              <p className="text-gray-600 mb-4 text-center text-sm">Scripts prontos para copiar e usar</p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {['abertura', 'pos-link', 'oferta', 'fechamento'].map((tipo) => (
                  <button
                    key={tipo}
                    onClick={() => {
                      // Mostrar scripts do tipo
                      alert(`Scripts de ${tipo} serão mostrados aqui`)
                    }}
                    className="bg-white hover:bg-gray-50 border border-gray-200 rounded-lg p-4 text-left transition-all hover:border-green-300 hover:shadow-sm"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">
                        {tipo === 'abertura' ? '👋' :
                         tipo === 'pos-link' ? '📨' :
                         tipo === 'oferta' ? '💰' :
                         '✅'}
                      </span>
                      <h3 className="font-semibold text-gray-800 text-base capitalize">
                        {tipo === 'abertura' ? 'Abertura' :
                         tipo === 'pos-link' ? 'Pós-Link' :
                         tipo === 'oferta' ? 'Oferta' :
                         'Fechamento'}
                      </h3>
                    </div>
                    <p className="text-xs text-gray-600">
                      {tipo === 'abertura' ? 'Scripts para iniciar conversas' :
                       tipo === 'pos-link' ? 'Scripts após enviar link' :
                       tipo === 'oferta' ? 'Scripts para fazer ofertas' :
                       'Scripts para fechar vendas'}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Modal de Scripts */}
        {selectedTool && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    Scripts - {selectedTool.nome}
                  </h2>
                  <button
                    onClick={() => setSelectedTool(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                {/* Tabs de tipo de pessoa */}
                <div className="flex gap-2 mb-4 border-b">
                  <button
                    onClick={() => setSelectedScriptType('nao-conhece')}
                    className={`px-4 py-2 text-sm font-medium ${
                      selectedScriptType === 'nao-conhece'
                        ? 'border-b-2 border-green-600 text-green-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Não Conhece
                  </button>
                  <button
                    onClick={() => setSelectedScriptType('ja-conhece')}
                    className={`px-4 py-2 text-sm font-medium ${
                      selectedScriptType === 'ja-conhece'
                        ? 'border-b-2 border-green-600 text-green-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Já Conhece
                  </button>
                  <button
                    onClick={() => setSelectedScriptType('pedir-indicacao')}
                    className={`px-4 py-2 text-sm font-medium ${
                      selectedScriptType === 'pedir-indicacao'
                        ? 'border-b-2 border-green-600 text-green-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Pedir Indicação
                  </button>
                </div>

                {/* Scripts */}
                <div className="space-y-4">
                  {obterScripts(selectedTool, selectedScriptType).map((script) => (
                    <div key={script.id} className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">{script.titulo}</h3>
                      <p className="text-sm text-gray-700 mb-2 whitespace-pre-wrap">{script.conteudo}</p>
                      <p className="text-xs text-gray-500 italic">{script.contexto}</p>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(script.conteudo)
                          alert('Script copiado!')
                        }}
                        className="mt-2 text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded"
                      >
                        📋 Copiar Script
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Botão NOEL sempre visível - Redireciona para página do NOEL */}
      <button
        onClick={() => router.push('/pt/wellness/noel')}
        className="fixed bottom-6 right-6 z-50 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg transition-all transform hover:scale-105 flex items-center justify-center"
        style={{ width: '56px', height: '56px' }}
        title="Falar com o NOEL"
      >
        <span className="text-2xl">🤖</span>
      </button>

      {/* Modal de Preview da Ferramenta */}
      {previewTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => setPreviewTemplate(null)}>
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            {/* Header do Modal */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{previewTemplate.icon}</span>
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{previewTemplate.nome}</h3>
                  <p className="text-sm text-gray-500">{previewTemplate.categoria}</p>
                </div>
              </div>
              <button
                onClick={() => setPreviewTemplate(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                title="Fechar preview"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Preview da Ferramenta */}
            <div className="flex-1 overflow-y-auto p-6">
              <DynamicTemplatePreview
                template={previewTemplate}
                profession="wellness"
                onClose={() => setPreviewTemplate(null)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

