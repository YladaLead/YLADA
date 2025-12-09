'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ProtectedRoute from '../../../../components/auth/ProtectedRoute'
import RequireSubscription from '@/components/auth/RequireSubscription'
import { useAuth } from '@/contexts/AuthContext'
import { useWellnessProfile } from '@/hooks/useWellnessProfile'
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

export default function WellnessHome() {
  return (
    <ProtectedRoute perfil="wellness" allowAdmin={true}>
      <RequireSubscription area="wellness">
        <ConditionalWellnessSidebar>
          <WellnessHomeContent />
        </ConditionalWellnessSidebar>
      </RequireSubscription>
    </ProtectedRoute>
  )
}

function WellnessHomeContent() {
  const { user } = useAuth()
  const { profile, loading: profileLoading } = useWellnessProfile()
  const router = useRouter()
  
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

  // Carregar perfil NOEL e calcular metas
  useEffect(() => {
    const loadNoelProfile = async () => {
      try {
        const response = await fetch('/api/wellness/noel/onboarding/check', {
          credentials: 'include'
        })
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
        }
      } catch (e) {
        console.error('Erro ao carregar perfil NOEL:', e)
      }
    }
    loadNoelProfile()
  }, [])

  // Carregar dados iniciais
  useEffect(() => {
    const carregarDados = async () => {
      try {
        setLoading(true)

        // Carregar progresso do plano
        if (user?.id) {
          try {
            // Buscar diretamente do Supabase via API interna
            const planResponse = await fetch('/api/wellness/plano/progresso', {
              credentials: 'include'
            })
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

        // Carregar estatísticas
        try {
          const statsResponse = await fetch('/api/wellness/consultor/estatisticas', {
            credentials: 'include'
          })
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

        // Carregar diagnóstico
        try {
          const diagResponse = await fetch('/api/wellness/consultor/diagnostico', {
            credentials: 'include'
          })
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
  }, [user])

  // Verificar onboarding
  useEffect(() => {
    if (!onboardingComplete && !profileLoading) {
      // Verificar se já tem perfil configurado
      const checkOnboarding = async () => {
        try {
          const response = await fetch('/api/wellness/noel/onboarding/check', {
            credentials: 'include'
          })
          if (response.ok) {
            const data = await response.json()
            // Mostrar onboarding se não tiver perfil OU se precisa atualizar para novos campos
            if (!data.hasProfile || !data.onboardingComplete || data.needsUpdate) {
              setShowOnboarding(true)
            } else {
              setOnboardingComplete(true)
            }
          }
        } catch (e) {
          // Se der erro, assumir que precisa fazer onboarding
          setShowOnboarding(true)
        }
      }
      checkOnboarding()
    }
  }, [profileLoading, onboardingComplete])

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando...</p>
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

        {/* BLOCO 3 — Objetivo Principal (pequeno, minimalista) */}
        {diagnostico && diagnostico.objetivo_principal && (
          <button
            onClick={() => router.push('/pt/wellness/perfil')}
            className="w-full bg-white rounded-xl p-4 border border-gray-200 shadow-sm mb-6 text-left hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-1">💼 Objetivo Principal</p>
                <p className="text-base font-semibold text-gray-900">
                  {diagnostico.objetivo_principal === 'vender_mais' ? '💰 Vender mais' :
                   diagnostico.objetivo_principal === 'construir_carteira' ? '👥 Construir carteira' :
                   diagnostico.objetivo_principal === 'melhorar_rotina' ? '📅 Melhorar rotina' :
                   diagnostico.objetivo_principal === 'voltar_ritmo' ? '🔄 Voltar ao ritmo' :
                   diagnostico.objetivo_principal === 'aprender_divulgar' ? '📚 Aprender a divulgar' :
                   diagnostico.objetivo_principal}
                </p>
              </div>
              <span className="text-green-600 ml-2 text-sm">Ver relatório completo →</span>
            </div>
          </button>
        )}

        {/* BLOCO 3.1 — Metas Automáticas do NOEL */}
        {metasCalculadas && (
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-5 sm:p-6 border border-purple-200 shadow-sm mb-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🎯</span>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Suas Metas Automáticas</h3>
                  <p className="text-xs text-gray-600">Calculadas pelo NOEL baseado no seu perfil</p>
                </div>
              </div>
              <button
                onClick={() => router.push('/pt/wellness/conta/perfil')}
                className="text-xs text-purple-600 hover:text-purple-700 font-medium"
              >
                Editar perfil →
              </button>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              {metasCalculadas.bebidas_dia > 0 && (
                <div className="bg-white rounded-lg p-3 border border-purple-100">
                  <p className="text-xs text-gray-500 mb-1">🥤 Bebidas/dia</p>
                  <p className="text-xl font-bold text-purple-600">{metasCalculadas.bebidas_dia}</p>
                </div>
              )}
              {metasCalculadas.kits_semana > 0 && (
                <div className="bg-white rounded-lg p-3 border border-purple-100">
                  <p className="text-xs text-gray-500 mb-1">📦 Kits/semana</p>
                  <p className="text-xl font-bold text-purple-600">{metasCalculadas.kits_semana}</p>
                </div>
              )}
              {metasCalculadas.convites_semana > 0 && (
                <div className="bg-white rounded-lg p-3 border border-purple-100">
                  <p className="text-xs text-gray-500 mb-1">👥 Convites/semana</p>
                  <p className="text-xl font-bold text-purple-600">{metasCalculadas.convites_semana}</p>
                </div>
              )}
              {metasCalculadas.produtos_fechados_semana > 0 && (
                <div className="bg-white rounded-lg p-3 border border-purple-100">
                  <p className="text-xs text-gray-500 mb-1">📦 Produtos/semana</p>
                  <p className="text-xl font-bold text-purple-600">{metasCalculadas.produtos_fechados_semana}</p>
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg p-3 border border-purple-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 mb-1">💰 Meta Financeira Mensal</p>
                  <p className="text-lg font-bold text-gray-900">
                    R$ {metasCalculadas.meta_financeira_mensal.toLocaleString('pt-BR')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 mb-1">📋 Plano</p>
                  <p className="text-sm font-semibold text-purple-600">{metasCalculadas.plano_nome}</p>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-purple-200">
              <p className="text-xs text-gray-600 text-center">
                💡 Essas metas são ajustadas automaticamente conforme seu perfil estratégico
              </p>
            </div>
          </div>
        )}

        {/* BLOCO 4 — Acompanhamento do Mês (KPIs rápidos - 4 cards em linha) */}
        {stats && (
          <div className="bg-white rounded-xl p-4 sm:p-5 border border-gray-200 shadow-sm mb-6">
            <h3 className="text-sm font-medium text-gray-500 mb-3">📊 Acompanhamento do Mês</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                onClick={() => router.push('/pt/wellness/clientes')}
                className="bg-gray-50 rounded-lg p-3 border border-gray-100 hover:bg-gray-100 transition-colors text-left"
              >
                <p className="text-xs text-gray-500 mb-1">Clientes</p>
                <p className="text-xl font-bold text-gray-900">{stats.totalClientes}</p>
              </button>
              <button
                onClick={() => router.push('/pt/wellness/clientes')}
                className="bg-gray-50 rounded-lg p-3 border border-gray-100 hover:bg-gray-100 transition-colors text-left"
              >
                <p className="text-xs text-gray-500 mb-1">Recorrentes</p>
                <p className="text-xl font-bold text-green-600">{stats.clientesRecorrentes}</p>
              </button>
              <button
                onClick={() => router.push('/pt/wellness/evolucao')}
                className="bg-gray-50 rounded-lg p-3 border border-gray-100 hover:bg-gray-100 transition-colors text-left"
              >
                <p className="text-xs text-gray-500 mb-1">PV Mensal</p>
                <p className="text-xl font-bold text-blue-600">{stats.pvMensal.toFixed(0)}</p>
              </button>
              <button
                onClick={() => router.push('/pt/wellness/clientes')}
                className="bg-gray-50 rounded-lg p-3 border border-gray-100 hover:bg-gray-100 transition-colors text-left"
              >
                <p className="text-xs text-gray-500 mb-1">Recompra</p>
                <p className="text-xl font-bold text-orange-600">{stats.proximosRecompra}</p>
              </button>
            </div>
          </div>
        )}

        {/* BLOCO 5 — Atalhos Rápidos (cards grandes) */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-500 mb-3">🔗 Atalhos Rápidos</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              onClick={() => router.push('/pt/wellness/fluxos')}
              className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all text-center group"
            >
              <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">🔄</div>
              <p className="text-sm font-semibold text-gray-900">Fluxos & Ações</p>
            </button>
            <button
              onClick={() => router.push('/pt/wellness/biblioteca')}
              className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all text-center group"
            >
              <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">📚</div>
              <p className="text-sm font-semibold text-gray-900">Biblioteca</p>
            </button>
            <button
              onClick={() => router.push('/pt/wellness/treinos/2-5-10')}
              className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all text-center group"
            >
              <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">⚡</div>
              <p className="text-sm font-semibold text-gray-900">Treino 2-5-10</p>
            </button>
            <button
              onClick={() => router.push('/pt/wellness/treinos/plano-presidente')}
              className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all text-center group"
            >
              <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">🏆</div>
              <p className="text-sm font-semibold text-gray-900">Plano Presidente</p>
            </button>
          </div>
        </div>

        {/* BLOCO 5.1 — Progresso do Distribuidor */}
        <div className="bg-white rounded-xl p-5 sm:p-6 border border-gray-200 shadow-sm mb-6">
          <h3 className="text-sm font-medium text-gray-500 mb-4">📊 Meu Progresso</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-1">Ações Hoje</p>
              <p className="text-2xl font-bold text-gray-900">{acoesHoje}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-1">Ações da Semana</p>
              <p className="text-2xl font-bold text-green-600">{acoesSemana}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-1">Nível de Engajamento</p>
              <p className="text-lg font-semibold text-blue-600 capitalize">{nivelEngajamento.replace('-', ' ')}</p>
            </div>
          </div>
        </div>

        {/* BLOCO 5.2 — Últimos Materiais Acessados */}
        {ultimosMateriais.length > 0 && (
          <div className="bg-white rounded-xl p-5 sm:p-6 border border-gray-200 shadow-sm mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500">📥 Últimos Materiais Acessados</h3>
              <button
                onClick={() => router.push('/pt/wellness/biblioteca')}
                className="text-xs text-green-600 hover:text-green-700 font-medium"
              >
                Ver Tudo →
              </button>
            </div>
            <div className="space-y-2">
              {ultimosMateriais.map((material) => (
                <button
                  key={material.id}
                  onClick={() => router.push(material.link)}
                  className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{material.tipo === 'fluxo' ? '🔄' : '💬'}</span>
                    <span className="text-sm font-medium text-gray-900">{material.titulo}</span>
                  </div>
                </button>
              ))}
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
              <span>Fazer follow-up</span>
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
