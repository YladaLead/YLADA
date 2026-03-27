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
      } catch (err: any) {
        console.error('Erro ao carregar estatísticas:', err)
        setError(err.message || 'Erro ao carregar dados')
      } finally {
        setLoading(false)
      }
    }
    carregarDados()
  }, [])

  const negocio = useMemo(() => resumoPorNegocio(stats), [stats])

  const acoesOperacao: QuickAction[] = [
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
      id: 'ylada-behavioral-data',
      title: 'Dados comportamentais',
      description: 'Eventos operacionais e volume de gravações (telemetria)',
      icon: '📈',
      link: '/admin/ylada/behavioral-data',
      color: 'bg-violet-500',
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
              <div className="h-14 sm:h-16 w-px bg-gray-300" />
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Painel Administrativo</h1>
                <p className="text-sm text-gray-600">YLADA + Wellness — visão compacta</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">Admin</p>
                <p className="text-xs text-gray-600">Administrador do Sistema</p>
              </div>
              <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <Link
            href="/admin/contas-demo"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-gray-800 text-white hover:bg-gray-900 transition-colors"
          >
            🎬 Credenciais demo (vídeos)
          </Link>
          <span className="text-xs text-gray-500">Página interna — não use em material público</span>
        </div>

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
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200">
                <p className="text-sm font-medium text-gray-600">Total de usuários</p>
                <p className="text-3xl font-bold text-gray-900">{stats.usuariosTotal.toLocaleString('pt-BR')}</p>
                <p className="text-sm text-green-600 font-medium mt-1">{stats.usuariosAtivos.toLocaleString('pt-BR')} ativos</p>
              </div>
              <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200">
                <p className="text-sm font-medium text-gray-600">Cursos (Wellness)</p>
                <p className="text-3xl font-bold text-gray-900">{stats.cursosTotal.toLocaleString('pt-BR')}</p>
                <p className="text-sm text-green-600 font-medium mt-1">{stats.cursosAtivos.toLocaleString('pt-BR')} ativos</p>
              </div>
              <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200">
                <p className="text-sm font-medium text-gray-600">Leads gerados</p>
                <p className="text-3xl font-bold text-gray-900">{stats.leadsTotal.toLocaleString('pt-BR')}</p>
                <p className="text-sm text-gray-500 mt-1">Total acumulado</p>
              </div>
              <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200">
                <p className="text-sm font-medium text-gray-600">Receita mensal</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.receitaMensal >= 1000
                    ? `R$ ${(stats.receitaMensal / 1000).toFixed(1)}k`
                    : `R$ ${stats.receitaMensal.toFixed(2)}`}
                </p>
                <p className="text-sm text-green-600 font-medium mt-1">
                  {stats.assinaturasAtivas.toLocaleString('pt-BR')} assinaturas
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-10">
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Usuários por negócio</h2>
                <div className="space-y-2">
                  {[negocio.ylada, negocio.wellness].map((row) => (
                    <div
                      key={row.label}
                      className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-gray-50"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-lg shrink-0">{row.icon}</span>
                        <span className="font-medium text-gray-900 text-sm truncate">{row.label}</span>
                      </div>
                      <div className="text-right text-sm shrink-0">
                        <span className="font-bold text-gray-900">{row.ativos.toLocaleString('pt-BR')}</span>
                        <span className="text-gray-500"> ativos · </span>
                        <span className="text-gray-700">{row.total.toLocaleString('pt-BR')} cad.</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Receita por negócio</h2>
                <div className="space-y-2">
                  {[negocio.ylada, negocio.wellness].map((row) => (
                    <div
                      key={row.label}
                      className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-gray-50"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-lg shrink-0">{row.icon}</span>
                        <span className="font-medium text-gray-900 text-sm truncate">{row.label}</span>
                      </div>
                      <div className="text-right text-sm shrink-0">
                        <span className="font-bold text-green-700">
                          {row.mensal >= 1000
                            ? `R$ ${(row.mensal / 1000).toFixed(1)}k`
                            : `R$ ${row.mensal.toFixed(2)}`}
                          <span className="text-gray-500 font-normal">/mês</span>
                        </span>
                        <span className="text-gray-500 block text-xs">
                          {row.anual >= 1000 ? `R$ ${(row.anual / 1000).toFixed(0)}k` : `R$ ${row.anual.toFixed(2)}`} /ano
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
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

        <details className="mb-6">
          <summary className="cursor-pointer text-sm font-medium text-gray-600 hover:text-gray-900">
            Outros (templates, ChatIA)
          </summary>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 pl-4 border-l-2 border-gray-200">
            {acoesSecundarias.map((a) => (
              <ActionCard key={a.id} acao={a} />
            ))}
          </div>
        </details>
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
