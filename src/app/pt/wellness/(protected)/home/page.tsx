'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
// REMOVIDO: ProtectedRoute e RequireSubscription - layout server-side cuida disso
import { useAuth } from '@/contexts/AuthContext'
import { useWellnessProfile } from '@/hooks/useWellnessProfile'
import { useAuthenticatedFetch } from '@/hooks/useAuthenticatedFetch'
import ConditionalWellnessSidebar from '@/components/wellness/ConditionalWellnessSidebar'
import NoelOnboardingCompleto from '@/components/wellness/NoelOnboardingCompleto'
import WellnessOnboardingBanners from '@/components/wellness/WellnessOnboardingBanners'

interface PlanProgress {
  current_day: number
  total_days: number
  task_of_day?: string
}

interface Stats {
  totalClientes: number
  pvMensal: number
  clientesRecorrentes: number
  proximosRecompra: number
}

interface LinkStats {
  totalClicks: number
}

interface Diagnostico {
  perfil_identificado: string
  pontos_fortes: string[]
  pontos_melhoria: string[]
  objetivo_principal?: string
  meta_pv?: number
  tempo_disponivel?: string
  experiencia?: string
}

interface Recomendacao {
  id: string
  titulo: string
  descricao: string
  acao?: string
  link?: string
}

/**
 * Página Home Wellness - Versão Simplificada
 * 
 * Validação de acesso feita no layout server-side (protected)/layout.tsx
 * Não precisa mais de ProtectedRoute ou RequireSubscription
 */
export default function WellnessHome() {
  return (
    <ConditionalWellnessSidebar>
      <WellnessHomeContent />
    </ConditionalWellnessSidebar>
  )
}

function WellnessHomeContent() {
  const { user, loading: authLoading, session } = useAuth()
  const { profile, loading: profileLoading } = useWellnessProfile()
  const router = useRouter()
  const authenticatedFetch = useAuthenticatedFetch()
  
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [onboardingComplete, setOnboardingComplete] = useState(false)
  const [planProgress, setPlanProgress] = useState<PlanProgress | null>(null)
  const [stats, setStats] = useState<Stats | null>(null)
  const [diagnostico, setDiagnostico] = useState<Diagnostico | null>(null)
  const [recomendacoes, setRecomendacoes] = useState<Recomendacao[]>([])
  const [ultimosMateriais, setUltimosMateriais] = useState<any[]>([])
  const [acoesHoje, setAcoesHoje] = useState(0)
  const [acoesSemana, setAcoesSemana] = useState(0)
  const [nivelEngajamento, setNivelEngajamento] = useState('iniciante')
  const [loading, setLoading] = useState(true)
  const [noelProfile, setNoelProfile] = useState<any>(null)
  const [metasCalculadas, setMetasCalculadas] = useState<any>(null)
  const [loadingTimeout, setLoadingTimeout] = useState(false) // Timeout de segurança para evitar loading infinito
  const [linkStats, setLinkStats] = useState<LinkStats | null>(null)

  // Carregar perfil NOEL e calcular metas
  // CORREÇÃO: Aguardar autenticação completar antes de fazer requisições
  useEffect(() => {
    // Não fazer requisições enquanto autenticação está carregando ou sem usuário
    if (authLoading || !user || !session) {
      console.log('🔄 Home: Aguardando autenticação completar antes de carregar perfil NOEL...')
      return
    }
    
    const loadNoelProfile = async () => {
      try {
        console.log('🔍 Home: Carregando perfil NOEL para user:', user.id)
        // Usar authenticatedFetch para garantir que o token seja enviado
        const response = await authenticatedFetch('/api/wellness/noel/onboarding/check')
        if (response.ok) {
          const data = await response.json()
          if (data.profile) {
            setNoelProfile(data.profile)
            
            // Calcular metas se tiver perfil estratégico completo
            if (data.profile.tipo_trabalho && data.profile.meta_financeira) {
              try {
                const { calcularMetasAutomaticas } = await import('@/lib/noel-wellness/goals-calculator')
                const metas = calcularMetasAutomaticas(data.profile)
                setMetasCalculadas(metas)
              } catch (e) {
                console.error('Erro ao calcular metas:', e)
              }
            }
          }
        } else {
          console.warn('⚠️ Home: Erro ao carregar perfil NOEL:', response.status)
        }
      } catch (e) {
        console.error('Erro ao carregar perfil NOEL:', e)
      }
    }
    loadNoelProfile()
  }, [authenticatedFetch, authLoading, user, session])

  // Carregar dados iniciais
  // CORREÇÃO: Aguardar autenticação completar antes de fazer requisições
  useEffect(() => {
    // Não fazer requisições enquanto autenticação está carregando ou sem usuário
    if (authLoading || !user || !session) {
      console.log('🔄 Home: Aguardando autenticação completar antes de carregar dados...', { authLoading, hasUser: !!user, hasSession: !!session })
      return
    }
    
    const carregarDados = async () => {
      try {
        setLoading(true)
        console.log('🔍 Home: Carregando dados para user:', user.id)

        // Carregar progresso do plano
        if (user?.id) {
          try {
            // Buscar diretamente do Supabase via API interna (usando authenticatedFetch)
            const planResponse = await authenticatedFetch('/api/wellness/plano/progresso')
            if (planResponse.ok) {
              const planData = await planResponse.json()
              if (planData.success && planData.data) {
                setPlanProgress({
                  current_day: planData.data.current_day || 1,
                  total_days: 90,
                  task_of_day: `Dia ${planData.data.current_day || 1} do seu plano`
                })
              } else {
                // Se não tiver progresso, começar do dia 1
                setPlanProgress({
                  current_day: 1,
                  total_days: 90,
                  task_of_day: 'Dia 1 do seu plano'
                })
              }
            } else {
              // Fallback: dia 1
              setPlanProgress({
                current_day: 1,
                total_days: 90,
                task_of_day: 'Dia 1 do seu plano'
              })
            }
          } catch (e) {
            console.error('Erro ao carregar plano:', e)
            // Fallback: dia 1
            setPlanProgress({
              current_day: 1,
              total_days: 90,
              task_of_day: 'Dia 1 do seu plano'
            })
          }
        }

        // Carregar estatísticas (usando authenticatedFetch)
        try {
          const statsResponse = await authenticatedFetch('/api/wellness/consultor/estatisticas')
          if (statsResponse.ok) {
            const statsData = await statsResponse.json()
            if (statsData.success) {
              setStats({
                totalClientes: statsData.data.totalClientes || 0,
                pvMensal: statsData.data.pvMensal || 0,
                clientesRecorrentes: statsData.data.clientesRecorrentes || 0,
                proximosRecompra: statsData.data.proximosRecompra || 0
              })
            }
          }
        } catch (e) {
          console.error('Erro ao carregar estatísticas:', e)
        }

        // Carregar estatísticas dos links (apenas cliques/views)
        try {
          // Buscar ferramentas para obter total de cliques
          const ferramentasResponse = await authenticatedFetch('/api/wellness/ferramentas?profession=wellness')
          if (ferramentasResponse.ok) {
            const ferramentasData = await ferramentasResponse.json()
            const tools = ferramentasData.tools || []
            const totalClicks = tools.reduce((acc: number, tool: any) => acc + (tool.views || 0), 0)
            
            setLinkStats({
              totalClicks: totalClicks
            })
          }
        } catch (e) {
          console.error('Erro ao carregar estatísticas dos links:', e)
        }

        // Carregar diagnóstico (usando authenticatedFetch)
        try {
          const diagResponse = await authenticatedFetch('/api/wellness/consultor/diagnostico')
          if (diagResponse.ok) {
            const diagData = await diagResponse.json()
            if (diagData.hasDiagnostico && diagData.diagnostico) {
              setDiagnostico({
                perfil_identificado: diagData.diagnostico.perfil_identificado || 'Consultor em Desenvolvimento',
                pontos_fortes: diagData.diagnostico.pontos_fortes?.slice(0, 2) || [],
                pontos_melhoria: diagData.diagnostico.pontos_melhoria?.slice(0, 2) || [],
                objetivo_principal: diagData.perfil?.objetivo_principal || null,
                meta_pv: diagData.perfil?.meta_pv || null,
                tempo_disponivel: diagData.perfil?.tempo_disponivel || null,
                experiencia: diagData.perfil?.experiencia_vendas || null
              })
            }
          }
        } catch (e) {
          console.error('Erro ao carregar diagnóstico:', e)
        }

        // Gerar recomendações inteligentes (apenas 2 cards)
        setRecomendacoes([
          {
            id: '1',
            titulo: 'Sugestão do NOEL para hoje',
            descricao: 'Envie 3 convites leves para pessoas próximas',
            acao: 'Falar com NOEL',
            link: '/pt/wellness/noel'
          },
          {
            id: '2',
            titulo: 'Script do dia',
            descricao: 'Use o Fluxo 1 para convites leves',
            acao: 'Ver scripts',
            link: '/pt/wellness/fluxos'
          }
        ])

        // Simular últimos materiais (será integrado com dados reais na Fase 3)
        setUltimosMateriais([
          { id: '1', tipo: 'fluxo', titulo: 'Fluxo 2-5-10', link: '/pt/wellness/fluxos/acao-diaria' },
          { id: '2', tipo: 'script', titulo: 'Script de Convite Leve', link: '/pt/wellness/fluxos' }
        ])

        // Simular progresso (será integrado com dados reais)
        setAcoesHoje(2)
        setAcoesSemana(12)
        setNivelEngajamento('em-desenvolvimento')

      } catch (error) {
        console.error('Erro ao carregar dados:', error)
      } finally {
        setLoading(false)
      }
    }

    carregarDados()
  }, [user, authenticatedFetch, authLoading, session])

  // Verificar onboarding
  // CORREÇÃO: Aguardar autenticação completar antes de verificar
  useEffect(() => {
    // Não fazer requisições enquanto autenticação está carregando ou sem usuário
    if (authLoading || !user || !session) {
      return
    }
    
    if (!onboardingComplete && !profileLoading) {
      // Verificar se já tem perfil configurado (usando authenticatedFetch)
      const checkOnboarding = async () => {
        try {
          console.log('🔍 Home: Verificando onboarding para user:', user.id)
          const response = await authenticatedFetch('/api/wellness/noel/onboarding/check')
          if (response.ok) {
            const data = await response.json()
            // Mostrar onboarding se não tiver perfil OU se precisa atualizar para novos campos
            if (!data.hasProfile || !data.onboardingComplete || data.needsUpdate) {
              setShowOnboarding(true)
            } else {
              setOnboardingComplete(true)
            }
          } else {
            console.warn('⚠️ Home: Erro ao verificar onboarding:', response.status)
          }
        } catch (e) {
          console.error('❌ Home: Erro ao verificar onboarding:', e)
          // Se der erro, assumir que precisa fazer onboarding
          setShowOnboarding(true)
        }
      }
      checkOnboarding()
    }
  }, [profileLoading, onboardingComplete, authenticatedFetch, authLoading, user, session])

  const handleOnboardingComplete = async (onboardingData: any): Promise<void> => {
    try {
      console.log('💾 Salvando onboarding:', onboardingData)
      
      // Usar authenticatedFetch para garantir que o token seja enviado
      const response = await authenticatedFetch('/api/wellness/noel/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(onboardingData)
      })

      const responseData = await response.json()
      console.log('📡 Resposta da API:', responseData)

      if (!response.ok) {
        // Se não for OK, lançar erro com mensagem amigável
        const errorMessage = responseData.message || 
                            responseData.error || 
                            'Erro ao salvar perfil. Tente novamente.'
        console.error('❌ Erro ao salvar onboarding:', {
          status: response.status,
          error: responseData.error,
          message: responseData.message,
          required: responseData.required
        })
        throw new Error(errorMessage)
      }

      if (responseData.success) {
        console.log('✅ Onboarding salvo com sucesso')
        setShowOnboarding(false)
        setOnboardingComplete(true)
      } else {
        // Se não tiver success: true, lançar erro
        throw new Error(responseData.error || 'Erro ao salvar perfil. Tente novamente.')
      }
    } catch (error: any) {
      console.error('❌ Erro ao salvar onboarding:', error)
      // Re-throw para o componente tratar
      throw error
    }
  }

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Consultor'
  const frasesMotivacionais = [
    'Movimento gera clareza.',
    'Consistência cria confiança.',
    'Pequenos passos diários viram grandes resultados.',
    'Ação gera resultado.'
  ]
  const fraseMotivacional = frasesMotivacionais[Math.floor(Math.random() * frasesMotivacionais.length)]

  // 🚨 CORREÇÃO: Timeout de segurança para evitar loading infinito
  // Se autenticação já terminou e temos usuário, mostra conteúdo mesmo que dados ainda estejam carregando
  // Os dados vão aparecer quando carregarem (loading local apenas para UX, não bloqueia)
  useEffect(() => {
    // Timeout de 3 segundos para evitar loading infinito
    const timer = setTimeout(() => {
      setLoadingTimeout(true)
    }, 3000)
    
    return () => clearTimeout(timer)
  }, [])

  // Mostrar loading APENAS se:
  // 1. authLoading é true (autenticação ainda não terminou)
  // 2. OU loading é true E ainda não passou timeout E não temos usuário autenticado
  // Se já temos usuário autenticado, mostrar conteúdo mesmo que dados ainda estejam carregando
  const shouldShowLoading = authLoading || (loading && !loadingTimeout && !user)
  
  if (shouldShowLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">
              {authLoading ? 'Verificando sessão...' : 'Carregando...'}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24 sm:pb-20">
      {/* Onboarding Modal */}
      {showOnboarding && (
        <NoelOnboardingCompleto 
          onComplete={handleOnboardingComplete}
          onClose={() => setShowOnboarding(false)}
        />
      )}
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Banners de Onboarding */}
        <WellnessOnboardingBanners profile={noelProfile} />

        {/* BLOCO 1 — Boas-vindas do NOEL */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 sm:p-6 border border-green-200 shadow-sm mb-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-3xl shadow-md">
                👤
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                Olá, {userName.split(' ')[0]}! 👋
              </h1>
              <p className="text-gray-700 mb-4">
                "Pequenas ações diárias criam grandes resultados."
              </p>
              <button
                onClick={() => router.push('/pt/wellness/noel')}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 px-6 rounded-lg text-sm transition-colors shadow-md hover:shadow-lg"
              >
                Perguntar ao NOEL →
              </button>
            </div>
          </div>
        </div>

        {/* BLOCO 2 — Ação do Dia (MAIS IMPORTANTE - NO TOPO) */}
        {planProgress && (
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 sm:p-6 border border-green-200 shadow-sm mb-6">
            <div className="flex items-start gap-3 mb-4">
              <span className="text-2xl">🎯</span>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-gray-900 mb-1">Sua Ação de Hoje</h2>
                <p className="text-gray-700 text-sm sm:text-base mb-2">
                  Dia {planProgress.current_day} / {planProgress.total_days} – Plano de Crescimento
                </p>
              </div>
            </div>
            <button
              onClick={() => router.push(`/pt/wellness/plano/${planProgress.current_day}`)}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg text-base transition-colors shadow-md hover:shadow-lg"
            >
              Ver ação do dia
            </button>
          </div>
        )}

        {/* BLOCO 2.5 — Estatísticas dos Links (Apenas Cliques) */}
        {linkStats && (
          <div className="bg-white rounded-xl p-4 sm:p-5 border border-gray-200 shadow-sm mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-500">📊 Cliques nos Links</h3>
              <button
                onClick={() => router.push('/pt/wellness/links?ranking=true')}
                className="text-xs text-green-600 hover:text-green-700 font-medium"
              >
                Ver ranking →
              </button>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-100 text-center">
              <p className="text-xs text-gray-500 mb-1">👆 Total de Cliques</p>
              <p className="text-3xl font-bold text-green-600">{linkStats.totalClicks}</p>
            </div>
          </div>
        )}

        {/* BLOCO 6 — Recomendações do NOEL (2 cards apenas) */}
        {recomendacoes.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-500 mb-3">💡 Recomendações do NOEL</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {recomendacoes.map((rec) => (
                <button
                  key={rec.id}
                  onClick={() => rec.link && router.push(rec.link)}
                  className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all text-left"
                >
                  <h4 className="font-semibold text-gray-900 mb-1 text-sm">{rec.titulo}</h4>
                  <p className="text-xs text-gray-600 mb-2">{rec.descricao}</p>
                  <p className="text-xs text-green-600 font-medium">{rec.acao || 'Ver mais'} →</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* BLOCO 7 — Próximos Passos (3 linhas simples) */}
        <div className="bg-white rounded-xl p-4 sm:p-5 border border-gray-200 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 mb-3">📌 Próximos Passos</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">1.</span>
              <span>Enviar convites (ação do dia)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">2.</span>
              <span>Fazer acompanhamento</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">3.</span>
              <span>Publicar divulgação simples</span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  )
}

