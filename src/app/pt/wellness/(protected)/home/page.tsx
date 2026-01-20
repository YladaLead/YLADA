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

interface Stats {
  totalClientes: number
  pvMensal: number
  clientesRecorrentes: number
  proximosRecompra: number
}

interface LinkStats {
  totalClicks: number // Cliques nos links (views)
  totalWhatsAppClicks: number // Cliques no WhatsApp (conversions_count)
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
  const [metasResumo, setMetasResumo] = useState<{
    metaPV?: number
    metaGanhoMensal?: number
    metaRecrutamento?: number
  } | null>(null)

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

  // Recarregar resumo de metas quando o perfil NOEL for carregado
  useEffect(() => {
    if (!noelProfile || authLoading || !user || !session) return
    
    const carregarResumoMetas = async () => {
      try {
        const [pvResponse, construcaoResponse] = await Promise.all([
          authenticatedFetch('/api/wellness/pv/mensal'),
          authenticatedFetch('/api/wellness/metas-construcao')
        ])
        
        const resumo: any = {}
        
        // Meta de Ganho Mensal com Vendas (do perfil estratégico - PRIORIDADE)
        if (noelProfile?.meta_financeira) {
          resumo.metaGanhoMensal = noelProfile.meta_financeira
        }
        
        // Meta PV Mensal (estimula trabalho mensal)
        if (pvResponse.ok) {
          const pvData = await pvResponse.json()
          if (pvData.pv_mensal?.meta_pv) {
            resumo.metaPV = pvData.pv_mensal.meta_pv
          }
        }
        
        // Meta de Recrutamento (estimula trabalho mensal)
        if (construcaoResponse.ok) {
          const construcaoData = await construcaoResponse.json()
          if (construcaoData.metas?.meta_recrutamento) {
            resumo.metaRecrutamento = construcaoData.metas.meta_recrutamento
          }
        }
        
        if (Object.keys(resumo).length > 0) {
          setMetasResumo(resumo)
        }
      } catch (e) {
        console.error('Erro ao carregar resumo de metas:', e)
      }
    }
    
    carregarResumoMetas()
  }, [noelProfile, authenticatedFetch, authLoading, user, session])

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

        // Progresso do plano removido - não está sendo usado atualmente

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

        // Carregar estatísticas dos links (cliques nos links + cliques no WhatsApp)
        try {
          // Buscar ferramentas para obter total de cliques e conversões
          const ferramentasResponse = await authenticatedFetch('/api/wellness/ferramentas?profession=wellness')
          if (ferramentasResponse.ok) {
            const ferramentasData = await ferramentasResponse.json()
            const tools = ferramentasData.tools || []
            const totalClicks = tools.reduce((acc: number, tool: any) => acc + (tool.views || 0), 0)
            const totalWhatsAppClicks = tools.reduce((acc: number, tool: any) => acc + (tool.conversions_count || 0), 0)
            
            setLinkStats({
              totalClicks: totalClicks,
              totalWhatsAppClicks: totalWhatsAppClicks
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
        if (responseData.profile) {
          setNoelProfile(responseData.profile)
        }
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
  
  // Frases motivacionais de Mark Hughes, Jim Rohn e Eric Worre
  // As frases trocam a cada carregamento da página (aleatório)
  const frasesMotivacionais = [
    // Mark Hughes
    { frase: 'Grandes histórias começam com passos pequenos — mas com intenção gigante.', autor: 'Mark Hughes' },
    { frase: 'Quando você está em movimento, tudo ao redor começa a se mover com você.', autor: 'Mark Hughes' },
    { frase: 'O que você faz repetidamente constrói o que você se torna.', autor: 'Mark Hughes' },
    { frase: 'Quando sua visão é clara, sua energia aumenta.', autor: 'Mark Hughes' },
    { frase: 'As pessoas seguem quem está em movimento. Seja esse movimento.', autor: 'Mark Hughes' },
    { frase: 'Todo dia é uma chance de construir algo maior.', autor: 'Mark Hughes' },
    { frase: 'A forma como você chega determina a forma como as pessoas respondem.', autor: 'Mark Hughes' },
    // Jim Rohn
    { frase: 'A disciplina que você exerce hoje é a liberdade que você vive amanhã.', autor: 'Jim Rohn' },
    { frase: 'O seu potencial é maior do que suas desculpas.', autor: 'Jim Rohn' },
    { frase: 'Trabalhe mais em você do que no seu negócio.', autor: 'Jim Rohn' },
    { frase: 'O progresso de hoje é a vitória de amanhã.', autor: 'Jim Rohn' },
    { frase: 'Sua vida não melhora por acaso, melhora por mudança.', autor: 'Jim Rohn' },
    { frase: 'Não deseje que fosse mais fácil. Deseje ser melhor.', autor: 'Jim Rohn' },
    // Eric Worre
    { frase: 'Amadores tentam. Profissionais fazem até dar certo.', autor: 'Eric Worre' },
    { frase: 'Não existe dia perfeito. Existe decisão.', autor: 'Eric Worre' },
    { frase: 'Profissionais têm rotina. E rotina gera resultado.', autor: 'Eric Worre' },
    { frase: 'A diferença entre os melhores e os medíocres é o treino constante.', autor: 'Eric Worre' },
    { frase: 'Quando você trata o negócio como hobby, ele te paga como hobby. Quando trata como profissão, ele te paga como profissão.', autor: 'Eric Worre' }
  ]
  const fraseMotivacional = frasesMotivacionais[Math.floor(Math.random() * frasesMotivacionais.length)]
  
  // Objetivo principal do perfil (para mostrar no card de metas)
  const objetivoPrincipal = noelProfile?.objetivo_principal || 'Crescer no projeto'

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
          singlePage={true}
          initialData={noelProfile || undefined}
          onComplete={handleOnboardingComplete}
          onClose={() => setShowOnboarding(false)}
        />
      )}
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Banners de Onboarding */}
        <WellnessOnboardingBanners profile={noelProfile} />

        {/* BLOCO 1 — Boas-vindas do NOEL */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 sm:p-6 border border-green-200 shadow-sm mb-6">
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

        {/* BLOCO 1.5 — Card de Resumo do Perfil e Metas */}
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-5 sm:p-6 border border-purple-200 shadow-sm mb-6">
          <div className="mb-4 pb-4 border-b border-purple-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">📋 Resumo do Perfil e Metas</h2>
            
            {/* Objetivo Principal */}
            <div className="mb-3">
              <p className="text-xs text-gray-600 mb-1">🎯 Objetivo Principal</p>
              <p className="text-gray-800 font-medium text-base">
                {objetivoPrincipal}
              </p>
            </div>

            {/* Resumo de Metas Mensais (que estimulam o trabalho) */}
            {metasResumo && (
              <div className="mt-4 space-y-3">
                {metasResumo.metaGanhoMensal && metasResumo.metaGanhoMensal > 0 && (
                  <div className="bg-white/80 rounded-lg p-3 border border-purple-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">💵</span>
                        <span className="text-sm text-gray-600">Meta de Ganho no Mês (Vendas)</span>
                      </div>
                      <span className="font-bold text-lg text-green-600">
                        R$ {metasResumo.metaGanhoMensal.toLocaleString('pt-BR')}
                      </span>
                    </div>
                  </div>
                )}
                {metasResumo.metaPV && metasResumo.metaPV > 0 && (
                  <div className="bg-white/80 rounded-lg p-3 border border-purple-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">💰</span>
                        <span className="text-sm text-gray-600">Meta PV Mensal</span>
                      </div>
                      <span className="font-bold text-lg text-blue-600">
                        {metasResumo.metaPV.toLocaleString('pt-BR')} PV
                      </span>
                    </div>
                  </div>
                )}
                {metasResumo.metaRecrutamento && metasResumo.metaRecrutamento > 0 && (
                  <div className="bg-white/80 rounded-lg p-3 border border-purple-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🚀</span>
                        <span className="text-sm text-gray-600">Meta de Recrutamento</span>
                      </div>
                      <span className="font-bold text-lg text-purple-600">
                        {metasResumo.metaRecrutamento} pessoas
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            <div className="mt-4 pt-3 border-t border-purple-200">
              <button
                onClick={() => router.push('/pt/wellness/conta/perfil')}
                className="text-sm text-purple-600 hover:text-purple-700 font-medium"
              >
                Ver perfil completo →
              </button>
            </div>
          </div>
          
          <div className="mb-4 pb-4 border-b border-purple-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">💫 Inspiração do Dia</h3>
            <p className="text-gray-700 italic text-sm">
              "{fraseMotivacional.frase}"
            </p>
            <p className="text-gray-500 text-xs mt-1">— {fraseMotivacional.autor}</p>
          </div>

          <div className="bg-white/60 rounded-lg p-4 border border-purple-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">💬 Lembrete Diário</h3>
            <p className="text-sm text-gray-700">
              <strong>10 links por dia para vendas</strong> e <strong>10 links por dia para recrutamento</strong>
            </p>
          </div>
        </div>

        {/* BLOCO 2 — Estatísticas dos Links (Cliques nos Links + Cliques no WhatsApp) */}
        {linkStats && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-500">📊 Estatísticas de Engajamento</h3>
              <button
                onClick={() => router.push('/pt/wellness/links?ranking=true')}
                className="text-xs text-green-600 hover:text-green-700 font-medium"
              >
                Ver ranking →
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Card: Cliques nos Links */}
              <div className="bg-white rounded-xl p-4 sm:p-5 border border-gray-200 shadow-sm">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-100 text-center">
                  <p className="text-xs text-gray-500 mb-1">🔗 Cliques nos Links</p>
                  <p className="text-3xl font-bold text-green-600">{linkStats.totalClicks}</p>
                  <p className="text-xs text-gray-500 mt-1">Quando acessam o quiz/diagnóstico</p>
                </div>
              </div>
              
              {/* Card: Cliques no WhatsApp */}
              <div className="bg-white rounded-xl p-4 sm:p-5 border border-gray-200 shadow-sm">
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-100 text-center">
                  <p className="text-xs text-gray-500 mb-1">💬 Cliques no WhatsApp</p>
                  <p className="text-3xl font-bold text-blue-600">{linkStats.totalWhatsAppClicks}</p>
                  <p className="text-xs text-gray-500 mt-1">Quando clicam no botão WhatsApp</p>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  )
}

