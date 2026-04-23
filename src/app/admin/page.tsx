'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useMemo } from 'react'
import { createClient } from '@/lib/supabase-client'
import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute'

const supabase = createClient()

type QuickAction = {
  id: string
  title: string
  description: string
  icon: string
  link: string
  color: string
  destaque?: boolean
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
}

const AREAS_YLADA_MATRIZ = ['nutri', 'coach', 'nutra'] as const

function resumoPorNegocio(stats: StatsData) {
  let yladaTotal = 0
  let yladaAtivos = 0
  let yladaMensal = 0
  let yladaAnual = 0
  for (const a of AREAS_YLADA_MATRIZ) {
    yladaTotal += stats.usuariosPorArea[a]?.total ?? 0
    yladaAtivos += stats.usuariosPorArea[a]?.ativos ?? 0
    yladaMensal += stats.receitasPorArea[a]?.mensal ?? 0
    yladaAnual += stats.receitasPorArea[a]?.anual ?? 0
  }
  const w = stats.usuariosPorArea.wellness ?? { total: 0, ativos: 0 }
  const wr = stats.receitasPorArea.wellness ?? { mensal: 0, anual: 0 }
  return {
    ylada: {
      label: 'YLADA (matriz / legado)',
      total: yladaTotal,
      ativos: yladaAtivos,
      mensal: yladaMensal,
      anual: yladaAnual,
      icon: '🔷',
    },
    wellness: {
      label: 'Wellness (Herbalife)',
      total: w.total,
      ativos: w.ativos,
      mensal: wr.mensal,
      anual: wr.anual,
      icon: '💖',
    },
  }
}

function AdminDashboard() {
  return <AdminDashboardContent />
}

function ActionCard({ acao }: { acao: QuickAction }) {
  return (
    <Link
      href={acao.link}
      className={`bg-white rounded-xl p-5 shadow-sm border-2 transition-all group ${
        acao.destaque
          ? 'border-blue-300 hover:border-blue-400 hover:shadow-lg'
          : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
      }`}
    >
      <div className="flex items-start space-x-3">
        <div
          className={`${acao.color} rounded-lg p-2.5 text-white group-hover:scale-105 transition-transform shadow-md shrink-0`}
        >
          <span className="text-xl">{acao.icon}</span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-gray-900 mb-0.5">{acao.title}</h3>
          <p className="text-sm text-gray-600 leading-snug">{acao.description}</p>
        </div>
      </div>
    </Link>
  )
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
      wellness: { total: 0, ativos: 0 },
    },
    receitasPorArea: {
      nutri: { mensal: 0, anual: 0 },
      coach: { mensal: 0, anual: 0 },
      nutra: { mensal: 0, anual: 0 },
      wellness: { mensal: 0, anual: 0 },
    },
  })

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const carregarDados = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch('/api/admin/stats', { credentials: 'include' })
        const data = await response.json().catch(() => ({} as { success?: boolean; stats?: StatsData; error?: string }))
        if (!response.ok) {
          const msg =
            typeof data.error === 'string' && data.error.trim()
              ? data.error
              : `Erro ao carregar estatísticas (${response.status})`
          throw new Error(msg)
        }
        if (data.success && data.stats) {
          setStats(data.stats)
        } else {
          throw new Error(
            typeof data.error === 'string' && data.error.trim() ? data.error : 'Formato de dados inválido'
          )
        }
      } catch (err: unknown) {
        console.error('Erro ao carregar estatísticas:', err)
        setError(err instanceof Error ? err.message : 'Erro ao carregar dados')
      } finally {
        setLoading(false)
      }
    }
    carregarDados()
  }, [])

  const negocio = useMemo(() => resumoPorNegocio(stats), [stats])

  const acoesOperacao: QuickAction[] = [
    {
      id: 'minha-orientacao',
      title: 'Minha orientação',
      description: 'Tarefas semanais para otimizar: checklist + próximo passo sugerido',
      icon: '📋',
      link: '/admin/minha-orientacao',
      color: 'bg-emerald-600',
      destaque: true,
    },
    {
      id: 'inteligencia-ylada',
      title: 'Inteligência YLADA',
      description: 'Decisões em um lugar: insights, funil, intenção e links para o restante',
      icon: '🧠',
      link: '/admin/inteligencia-ylada',
      color: 'bg-indigo-600',
      destaque: true,
    },
    {
      id: 'usuarios',
      title: 'Usuários',
      description: 'Contas, perfis e segmentos (YLADA + Wellness)',
      icon: '👥',
      link: '/admin/usuarios',
      color: 'bg-blue-500',
      destaque: true,
    },
    {
      id: 'whatsapp-workshop-inscricoes',
      title: 'Workshop — inscrições (WhatsApp)',
      description:
        'Quem preencheu as landings (ex.: Nutri → Empresária, Gláucia); pendentes e 1ª mensagem. Agenda: WhatsApp → workshop.',
      icon: '📱',
      link: '/admin/whatsapp/cadastros-workshop',
      color: 'bg-purple-600',
      destaque: true,
    },
    {
      id: 'subscriptions',
      title: 'Gerenciar Assinaturas',
      description: 'Planos gratuitos e migração de assinaturas',
      icon: '🎁',
      link: '/admin/subscriptions',
      color: 'bg-green-500',
    },
    {
      id: 'receitas',
      title: 'Receitas & Assinaturas',
      description: 'Controle financeiro e assinaturas',
      icon: '💰',
      link: '/admin/receitas',
      color: 'bg-yellow-500',
      destaque: true,
    },
    {
      id: 'trials',
      title: 'Trials (3 dias)',
      description:
        'Trials ativos — água, presidentes e demais convites. Incluir trial Freedom (YLADA) na API quando estiver no banco.',
      icon: '🎁',
      link: '/admin/trials',
      color: 'bg-emerald-600',
      destaque: true,
    },
    {
      id: 'ylada-links',
      title: 'Diagnósticos (YLADA)',
      description: 'Diagnósticos e quem emite (dono / presidente)',
      icon: '🧪',
      link: '/admin/ylada/links',
      color: 'bg-indigo-500',
    },
    {
      id: 'ylada-valuation',
      title: 'Valuation (intenção & conversão)',
      description: 'Dados estruturados para narrativa estratégica — separado de Analytics',
      icon: '💎',
      link: '/admin/ylada/valuation',
      color: 'bg-slate-700',
      destaque: true,
    },
    {
      id: 'funnel-tracking',
      title: 'Funil visitante (Tracking)',
      description: 'Da página inicial ao cadastro: quantos passam em cada etapa',
      icon: '📍',
      link: '/admin/tracking',
      color: 'bg-cyan-600',
      destaque: true,
    },
    {
      id: 'ylada-behavioral-data',
      title: 'Dados comportamentais',
      description: 'Telemetria geral; o funil da landing está em “Funil visitante (Tracking)”',
      icon: '📈',
      link: '/admin/ylada/behavioral-data',
      color: 'bg-violet-500',
    },
    {
      id: 'ylada-usage-survey',
      title: 'Pesquisa de uso (anônima)',
      description: 'Respostas da página /pt/pesquisa-uso-ylada — perfil 1–4 e JSON',
      icon: '📝',
      link: '/admin/ylada/usage-survey',
      color: 'bg-teal-600',
    },
    {
      id: 'ylada-uso-wellness-v1',
      title: 'Pesquisa Wellness v1',
      description: 'Respostas de /uso-wellness-v1 — hábitos, Noel e JSON',
      icon: '🌿',
      link: '/admin/ylada/uso-wellness-v1',
      color: 'bg-emerald-600',
    },
    {
      id: 'ylada-clinicas-estetica-corporal',
      title: 'Clínicas estética corporal',
      description: 'Intake B2B /pt/clinicas-estetica-corporal — CSV e notificação e-mail',
      icon: '💆‍♀️',
      link: '/admin/ylada/clinicas-estetica-corporal',
      color: 'bg-teal-600',
    },
    {
      id: 'pro-lideres-onboarding',
      title: 'Pro Líderes onboarding',
      description: 'Criar links de onboarding e acompanhar respostas por e-mail',
      icon: '🧭',
      link: '/admin/pro-lideres/onboarding',
      color: 'bg-emerald-600',
      destaque: true,
    },
    {
      id: 'pro-lideres-manual-leader',
      title: 'Pro Líderes — cadastro manual',
      description: 'Senha definida por ti, conta + tenant + texto para enviar ao líder',
      icon: '🔑',
      link: '/admin/pro-lideres/manual-leader',
      color: 'bg-teal-700',
      destaque: true,
    },
    {
      id: 'pro-lideres-consultoria',
      title: 'Pro Líderes — consultoria',
      description: 'Materiais, passo a passo, documentos e formulários com respostas guardadas',
      icon: '📋',
      link: '/admin/pro-lideres/consultoria',
      color: 'bg-emerald-700',
      destaque: true,
    },
    {
      id: 'pro-estetica-corporal-onboarding',
      title: 'Pro Estética Corporal — onboarding',
      description: 'Links de questionário (consultoria); respostas aplicadas ao ambiente da dona',
      icon: '💆‍♀️',
      link: '/admin/pro-estetica-corporal/onboarding',
      color: 'bg-sky-600',
      destaque: true,
    },
    {
      id: 'motor-crescimento-hub',
      title: 'Motor de crescimento',
      description: 'Documentação, agentes e checklist',
      icon: '📚',
      link: '/admin/motor-crescimento',
      color: 'bg-indigo-600',
      destaque: true,
    },
    {
      id: 'minhas-acoes-growth',
      title: 'Minhas ações (growth)',
      description: 'Checklist de captação — salva no navegador',
      icon: '✅',
      link: '/admin/minhas-acoes',
      color: 'bg-emerald-600',
      destaque: true,
    },
    {
      id: 'analytics',
      title: 'Analytics',
      description: 'Relatórios detalhados',
      icon: '📊',
      link: '/admin/analytics',
      color: 'bg-orange-500',
      destaque: true,
    },
    {
      id: 'config',
      title: 'Configurações',
      description: 'Configurações do sistema',
      icon: '⚙️',
      link: '/admin/config',
      color: 'bg-gray-500',
    },
    {
      id: 'support-agents',
      title: 'Atendentes de suporte',
      description: 'Equipe de atendimento',
      icon: '👨‍💼',
      link: '/admin/support/agents',
      color: 'bg-pink-500',
    },
  ]

  const acoesWellness: QuickAction[] = [
    {
      id: 'presidentes',
      title: 'Presidentes autorizados',
      description: 'Lista para trial e convites',
      icon: '🏆',
      link: '/admin/presidentes',
      color: 'bg-purple-500',
      destaque: true,
    },
    {
      id: 'email-authorizations',
      title: 'Autorizações por e-mail',
      description: 'Autorizar e-mails antes do cadastro',
      icon: '📧',
      link: '/admin/email-authorizations',
      color: 'bg-indigo-500',
    },
    {
      id: 'noel-learning',
      title: 'NOEL — sugestões de aprendizado',
      description: 'Conteúdo de aprendizado no app Wellness (admin)',
      icon: '🧠',
      link: '/admin/wellness/learning-suggestions',
      color: 'bg-emerald-500',
      destaque: true,
    },
    {
      id: 'biblioteca-upload',
      title: 'Biblioteca Wellness — upload',
      description: 'Vídeos, PDFs e imagens',
      icon: '📚',
      link: '/admin/wellness/biblioteca/upload',
      color: 'bg-teal-500',
    },
    {
      id: 'notificacoes-push',
      title: 'Notificações push',
      description: 'Envio para usuários (em evolução)',
      icon: '🔔',
      link: '/admin/notificacoes-push',
      color: 'bg-green-500',
    },
  ]

  const marketingBiblioteca: QuickAction[] = [
    {
      id: 'diagnosticos-links',
      title: 'Biblioteca de diagnósticos (SEO)',
      description: 'Páginas indexáveis, campanhas e anúncios',
      icon: '📣',
      link: '/admin/diagnosticos-links',
      color: 'bg-amber-500',
      destaque: true,
    },
    {
      id: 'gerar-fluxos',
      title: 'Gerador de fluxos (IA)',
      description: 'Novos fluxos para alimentar a biblioteca',
      icon: '🤖',
      link: '/admin/fluxos/gerar',
      color: 'bg-indigo-600',
      destaque: true,
    },
  ]

  const acoesSecundarias: QuickAction[] = [
    {
      id: 'chat-qa',
      title: 'ChatIA — Perguntas e respostas',
      description: 'Respostas do assistente (revisar se ainda em uso)',
      icon: '🤖',
      link: '/admin/chat-qa',
      color: 'bg-cyan-500',
    },
    {
      id: 'templates',
      title: 'Templates',
      description: 'Templates prontos da plataforma',
      icon: '🎨',
      link: '/admin/templates',
      color: 'bg-purple-500',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <Link href="/" className="shrink-0">
                <Image
                  src="/images/logo/ylada/horizontal/azul-claro/ylada-horizontal-azul-claro-30.png"
                  alt="YLADA"
                  width={200}
                  height={70}
                  className="h-10 sm:h-14 w-auto"
                />
              </Link>
              <div className="h-10 sm:h-14 w-px bg-gray-300 shrink-0 hidden sm:block" />
              <div className="min-w-0">
                <h1 className="text-lg sm:text-2xl font-bold text-gray-900 truncate">Painel admin</h1>
                <p className="text-xs sm:text-sm text-gray-600">Visão geral</p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 sm:gap-4 shrink-0">
              <div className="text-right hidden md:block">
                <p className="text-sm font-medium text-gray-900">Admin</p>
                <p className="text-xs text-gray-600">Sistema</p>
              </div>
              <div className="h-9 w-9 sm:h-10 sm:w-10 bg-blue-100 rounded-full flex items-center justify-center text-sm">
                <span className="text-blue-600">A</span>
              </div>
              <button
                onClick={async () => {
                  try {
                    const { clearCachedAdminCheck } = await import('@/lib/auth-cache')
                    clearCachedAdminCheck()
                  } catch (e) {
                    console.error('Erro ao limpar cache:', e)
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {loading && (
          <div className="mb-8 text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            <p className="mt-2 text-sm text-gray-600">Carregando estatísticas...</p>
          </div>
        )}

        {error && !loading && (
          <div className="mb-8 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800">Erro ao carregar dados: {error}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {!loading && !error && (
          <div className="mb-6">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Usuários ativos</p>
                  <p className="text-3xl sm:text-4xl font-bold text-gray-900 tabular-nums">
                    {stats.usuariosAtivos.toLocaleString('pt-BR')}
                    <span className="text-lg sm:text-xl font-semibold text-gray-400 ml-1">
                      / {stats.usuariosTotal.toLocaleString('pt-BR')}
                    </span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">ativos · total cadastrados</p>
                </div>
                <div className="flex flex-col sm:items-end gap-2 shrink-0">
                  <Link
                    href="/admin/contas-demo"
                    className="inline-flex items-center justify-center min-h-[44px] px-4 rounded-xl text-sm font-semibold bg-gray-900 text-white hover:bg-gray-800 active:bg-black w-full sm:w-auto text-center"
                  >
                    🎬 Credenciais demo
                  </Link>
                  <span className="text-[10px] text-gray-400 text-center sm:text-right max-w-[14rem] sm:max-w-none">
                    Uso interno — vídeos
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        <section className="mb-10">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Operação & YLADA</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {acoesOperacao.map((a) => (
              <ActionCard key={a.id} acao={a} />
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Wellness</h2>
          <p className="text-sm text-gray-500 mb-3">Presidentes, convites, NOEL, biblioteca e avisos</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {acoesWellness.map((a) => (
              <ActionCard key={a.id} acao={a} />
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Marketing & biblioteca</h2>
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {marketingBiblioteca.map((a) => (
                <ActionCard key={a.id} acao={a} />
              ))}
            </div>
          </div>
        </section>

        <details className="mb-10">
          <summary className="cursor-pointer text-sm font-medium text-gray-600 hover:text-gray-900">
            Outros (templates, ChatIA)
          </summary>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 pl-4 border-l-2 border-gray-200">
            {acoesSecundarias.map((a) => (
              <ActionCard key={a.id} acao={a} />
            ))}
          </div>
        </details>

        {!loading && !error && (
          <section className="mb-6 pt-2 border-t border-gray-200">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
              Resumo financeiro e negócios
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                  <p className="text-xs font-medium text-gray-500">Leads</p>
                  <p className="text-2xl font-bold text-gray-900 tabular-nums">
                    {stats.leadsTotal.toLocaleString('pt-BR')}
                  </p>
                  <p className="text-[11px] text-gray-400 mt-0.5">acumulado</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                  <p className="text-xs font-medium text-gray-500">Receita / mês</p>
                  <p className="text-2xl font-bold text-gray-900 tabular-nums">
                    {stats.receitaMensal >= 1000
                      ? `R$ ${(stats.receitaMensal / 1000).toFixed(1)}k`
                      : `R$ ${stats.receitaMensal.toFixed(0)}`}
                  </p>
                  <p className="text-[11px] text-green-700 mt-0.5 font-medium">
                    {stats.assinaturasAtivas.toLocaleString('pt-BR')} assinaturas
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 shadow-sm">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  YLADA vs Wellness
                </h3>
                <div className="space-y-3">
                  {[negocio.ylada, negocio.wellness].map((row) => (
                    <div
                      key={row.label}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 py-3 border-b border-gray-100 last:border-0 last:pb-0"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-lg shrink-0">{row.icon}</span>
                        <span className="font-medium text-gray-900 text-sm truncate">{row.label}</span>
                      </div>
                      <div className="flex flex-wrap items-baseline justify-between sm:justify-end gap-x-4 gap-y-1 text-sm pl-7 sm:pl-0">
                        <span className="text-gray-700">
                          <strong className="text-gray-900">{row.ativos.toLocaleString('pt-BR')}</strong>{' '}
                          <span className="text-gray-500">ativos</span> · {row.total.toLocaleString('pt-BR')} cad.
                        </span>
                        <span className="font-semibold text-green-700 tabular-nums">
                          {row.mensal >= 1000
                            ? `R$ ${(row.mensal / 1000).toFixed(1)}k/mês`
                            : `R$ ${row.mensal.toFixed(0)}/mês`}
                          <span className="text-gray-400 font-normal text-xs ml-1">
                            ({row.anual >= 1000 ? `R$ ${(row.anual / 1000).toFixed(0)}k` : `R$ ${row.anual.toFixed(0)}`}/ano)
                          </span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

export default function AdminDashboardPage() {
  return (
    <AdminProtectedRoute>
      <AdminDashboard />
    </AdminProtectedRoute>
  )
}
