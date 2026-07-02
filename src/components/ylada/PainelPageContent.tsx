'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import YladaAreaShell from './YladaAreaShell'
import { getYladaAreaPathPrefix, getYladaLeadsPath } from '@/config/ylada-areas'
import { YLADA_PRO_UPGRADE_PITCH } from '@/config/freemium-limits'
import { useIsAndroidTWA } from '@/lib/native-app'

type DashboardData = {
  respostas_hoje: number
  conversas_hoje: number
  respostas_semana: number
  conversas_semana: number
  links_criados_semana: number
  link_mais_ativo_semana: {
    id: string
    title: string
    respostas: number
    conversas: number
  } | null
  respostas_mes?: number
  freemium?: {
    is_pro: boolean
    whatsapp_clicks_mes?: number
    limite_whatsapp_clicks?: number
    noel_analises_mes?: number
    limite_noel_analises?: number
  }
}

type FunnelData = { views: number; completes: number; clicks: number }

type Dica = {
  icon: string
  titulo: string
  corpo: string
  noelMsg: string
}

/** Gera até 2 dicas operacionais determinísticas — zero LLM, sem chamada ao servidor. */
function gerarDicas(funnel: FunnelData, titulo?: string | null): Dica[] {
  const dicas: Dica[] = []
  const effectiveViews = Math.max(funnel.views, funnel.completes)
  const taxaResposta = effectiveViews > 0 ? funnel.completes / effectiveViews : null
  const taxaClique = funnel.completes > 0 ? funnel.clicks / funnel.completes : null

  // Ainda sem alcance
  if (effectiveViews < 3) {
    dicas.push({
      icon: '📤',
      titulo: 'Diagnóstico ainda pouco visto',
      corpo:
        'Compartilhe o link no WhatsApp ou stories para ele começar a trabalhar. Quanto mais circula, mais diagnósticos chegam — e a pessoa chega já aquecida.',
      noelMsg: 'Quero dicas de como distribuir meu diagnóstico para chegar a mais pessoas.',
    })
  }

  // Muitas aberturas mas baixa conclusão
  if (effectiveViews >= 5 && taxaResposta !== null && taxaResposta < 0.4) {
    dicas.push({
      icon: '✏️',
      titulo: 'Pessoas abrem mas poucas respondem',
      corpo: `${effectiveViews} aberturas, ${funnel.completes} respostas. Algo trava no meio. Revise as primeiras perguntas: estão longas, técnicas demais ou pouco relacionadas com a dor que motivou o clique?`,
      noelMsg: titulo
        ? `Meu diagnóstico "${titulo}" tem ${effectiveViews} aberturas mas só ${funnel.completes} respostas. Como posso melhorar a taxa de conclusão?`
        : `Meu diagnóstico tem ${effectiveViews} aberturas mas só ${funnel.completes} respostas. Como melhorar a taxa de conclusão?`,
    })
  }

  // Boas respostas mas baixo clique no WhatsApp
  if (funnel.completes >= 3 && taxaClique !== null && taxaClique < 0.25) {
    dicas.push({
      icon: '💬',
      titulo: 'Pessoas respondem mas não iniciam conversa',
      corpo: `${funnel.completes} respostas, ${funnel.clicks} iniciaram contato (${Math.round(taxaClique * 100)}%). A devolutiva está despertando interesse suficiente? Revise o texto do resultado e o CTA do botão.`,
      noelMsg: titulo
        ? `Tenho ${funnel.completes} respostas no diagnóstico "${titulo}" mas só ${funnel.clicks} clicaram no WhatsApp. Como melhorar o CTA?`
        : `Tenho ${funnel.completes} respostas mas só ${funnel.clicks} clicaram no WhatsApp. Como melhorar o CTA?`,
    })
  }

  // Convertendo bem — reforço positivo + próximo passo
  if (funnel.completes >= 5 && taxaClique !== null && taxaClique >= 0.3) {
    dicas.push({
      icon: '🚀',
      titulo: `${Math.round(taxaClique * 100)}% de quem responde inicia conversa`,
      corpo:
        'Seu diagnóstico está convertendo. Hora de aumentar o alcance: compartilhe em mais canais, use o link em bio, ou crie variações para diferentes entradas (Instagram, grupos, status).',
      noelMsg: 'Meu diagnóstico está convertendo bem. Como posso escalar o alcance para mais pessoas?',
    })
  }

  return dicas.slice(0, 2)
}

interface PainelPageContentProps {
  areaCodigo?: string
  areaLabel?: string
}

export default function PainelPageContent({
  areaCodigo = 'ylada',
  areaLabel = 'YLADA',
}: PainelPageContentProps) {
  const prefix = getYladaAreaPathPrefix(areaCodigo)
  const [data, setData] = useState<DashboardData | null>(null)
  const [funnel, setFunnel] = useState<FunnelData>({ views: 0, completes: 0, clicks: 0 })
  const [loading, setLoading] = useState(true)
  // Android (TWA): app B2B só-login, sem venda dentro — esconde o pitch de upgrade.
  const isTWA = useIsAndroidTWA()

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const [dashRes, metricsRes] = await Promise.all([
          fetch('/api/ylada/dashboard', { credentials: 'include' }),
          fetch('/api/ylada/links/metrics', { credentials: 'include' }),
        ])
        const [dashJson, metricsJson] = await Promise.all([
          dashRes.json().catch(() => ({})),
          metricsRes.json().catch(() => ({})),
        ])
        if (!cancelled) {
          if (dashJson?.success && dashJson.data) setData(dashJson.data as DashboardData)
          if (metricsJson?.funnel) setFunnel(metricsJson.funnel as FunnelData)
        }
      } catch {
        // silently fall through — UI renders with zeroes
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void load()
    return () => { cancelled = true }
  }, [])

  const effectiveViews = Math.max(funnel.views, funnel.completes)
  const dicas = loading ? [] : gerarDicas(funnel, data?.link_mais_ativo_semana?.title)

  return (
    <YladaAreaShell areaCodigo={areaCodigo} areaLabel={areaLabel}>
      <div className="max-w-2xl space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
            📊 Resultados
          </h1>
          <p className="text-sm text-gray-600">
            O que está acontecendo com seus diagnósticos.
          </p>
        </div>

        {loading ? (
          <div className="rounded-xl border border-gray-200 bg-white p-6 animate-pulse">
            <div className="h-20 bg-gray-100 rounded-lg" />
          </div>
        ) : (
          <>
            {/* Freemium: aviso progressivo para usuários Free. No app iOS o CTA
                de upgrade leva ao paywall IAP (IAP-tampão); no Android (TWA) é
                escondido — app B2B só-login, sem venda dentro. */}
            {data?.freemium && !data.freemium.is_pro && !isTWA && (
              <section className="rounded-xl border border-sky-200 bg-sky-50/80 p-5">
                <p className="text-sm font-medium text-gray-900 mb-1">
                  {data.freemium.whatsapp_clicks_mes ?? 0}/{data.freemium.limite_whatsapp_clicks ?? 10} contatos no WhatsApp este mês
                </p>
                {typeof data.freemium.noel_analises_mes === 'number' && (
                  <p className="text-sm text-gray-700 mb-2">
                    {data.freemium.noel_analises_mes}/{data.freemium.limite_noel_analises ?? 10} análises do Noel
                  </p>
                )}
                <p className="text-xs text-gray-600 mb-2">
                  Cada contato é uma pessoa que clicou no botão e te contactou no WhatsApp.
                </p>
                {(data.freemium.whatsapp_clicks_mes ?? 0) >= (data.freemium.limite_whatsapp_clicks ?? 10) ? (
                  <>
                    <div className="rounded-lg border border-amber-200 bg-amber-50/90 p-3 mb-3">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-900/80 mb-1.5">
                        Limite do mês utilizado
                      </p>
                      <p className="text-sm text-amber-950 leading-relaxed">
                        Seus contatos pelo WhatsApp neste mês chegaram ao teto do plano gratuito. No próximo ciclo o contador renova sozinho.
                      </p>
                    </div>
                    <div className="rounded-lg border border-sky-200 bg-gradient-to-br from-sky-50 to-white p-3 mb-3">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-sky-800 mb-1.5">
                        Plano Pro
                      </p>
                      <p className="text-sm text-slate-800 leading-relaxed">{YLADA_PRO_UPGRADE_PITCH}</p>
                    </div>
                  </>
                ) : (data.freemium.whatsapp_clicks_mes ?? 0) >= 7 ? (
                  <p className="text-sm text-gray-700 mb-3">
                    Seu diagnóstico está gerando contatos. Faltam {(data.freemium.limite_whatsapp_clicks ?? 10) - (data.freemium.whatsapp_clicks_mes ?? 0)} para o limite gratuito.
                  </p>
                ) : (data.freemium.whatsapp_clicks_mes ?? 0) >= 5 ? (
                  <p className="text-sm text-gray-700 mb-3">
                    {(data.freemium.whatsapp_clicks_mes ?? 0)} pessoas já te contactaram no WhatsApp este mês.
                  </p>
                ) : (
                  <p className="text-sm text-gray-700 mb-3">
                    Seu diagnóstico está gerando resultado.
                  </p>
                )}
                <Link
                  href="/pt/precos"
                  className="inline-flex w-full sm:w-auto justify-center items-center gap-1.5 rounded-xl bg-gradient-to-r from-sky-600 to-sky-700 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-sky-600/20 hover:from-sky-700 hover:to-sky-800 transition-all"
                >
                  Quero o plano Pro
                </Link>
                {(data.freemium.whatsapp_clicks_mes ?? 0) >= (data.freemium.limite_whatsapp_clicks ?? 10) ? (
                  <p className="text-xs text-slate-500 mt-2">Veja preços e ative em um clique.</p>
                ) : null}
              </section>
            )}

            {/* Atividade de hoje */}
            <section className="rounded-xl border border-sky-100 bg-sky-50/60 p-5">
              <h2 className="text-sm font-semibold text-gray-800 mb-4">Atividade de hoje</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl" aria-hidden>👩</span>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {data?.respostas_hoje ?? 0}
                    </p>
                    <p className="text-xs text-gray-600">
                      {(data?.respostas_hoje ?? 0) === 1 ? 'respondeu' : 'responderam'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl" aria-hidden>💬</span>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {data?.conversas_hoje ?? 0}
                    </p>
                    <p className="text-xs text-gray-600">
                      {(data?.conversas_hoje ?? 0) === 1 ? 'conversa' : 'conversas'}
                    </p>
                  </div>
                </div>
              </div>
              <Link
                href={`${prefix}/${getYladaLeadsPath(areaCodigo)}`}
                className="mt-4 inline-block text-sm font-medium text-sky-600 hover:text-sky-800"
              >
                Ver leads →
              </Link>
            </section>

            {/* Funil acumulado (todos os links) */}
            <section className="rounded-xl border border-gray-200 bg-white p-5">
              <h2 className="text-sm font-semibold text-gray-900 mb-1">Funil dos seus diagnósticos</h2>
              <p className="text-xs text-gray-500 mb-4">Total acumulado em todos os links ativos.</p>
              <div className="grid grid-cols-3 gap-3">
                <FunnelCard emoji="👁️" label="Abriram" value={effectiveViews} />
                <FunnelCard emoji="✅" label="Responderam" value={funnel.completes} />
                <FunnelCard emoji="🔥" label="Clicaram" value={funnel.clicks} />
              </div>
              {effectiveViews > 0 && funnel.completes > 0 && (
                <p className="mt-3 text-xs text-gray-500">
                  Taxa de resposta:{' '}
                  <span className="font-medium text-gray-700">
                    {Math.round((funnel.completes / effectiveViews) * 100)}%
                  </span>
                  {funnel.clicks > 0 && funnel.completes > 0 && (
                    <>
                      {' '}· WhatsApp:{' '}
                      <span className="font-medium text-gray-700">
                        {Math.round((funnel.clicks / funnel.completes) * 100)}%
                      </span>
                    </>
                  )}
                </p>
              )}
              <Link
                href={`${prefix}/${getYladaLeadsPath(areaCodigo)}`}
                className="mt-3 inline-block text-sm font-medium text-sky-600 hover:text-sky-800"
              >
                Ver quem respondeu →
              </Link>
            </section>

            {/* Diagnóstico mais ativo esta semana */}
            {data?.link_mais_ativo_semana && (
              <section className="rounded-xl border border-amber-100 bg-amber-50/60 p-5">
                <h2 className="text-xs font-semibold uppercase tracking-wide text-amber-700 mb-2">
                  Mais ativo esta semana
                </h2>
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {data.link_mais_ativo_semana.title}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  {data.link_mais_ativo_semana.respostas}{' '}
                  {data.link_mais_ativo_semana.respostas === 1 ? 'resposta' : 'respostas'} ·{' '}
                  {data.link_mais_ativo_semana.conversas}{' '}
                  {data.link_mais_ativo_semana.conversas === 1 ? 'conversa' : 'conversas'}
                </p>
                <Link
                  href={`${prefix}/links/editar/${data.link_mais_ativo_semana.id}`}
                  className="mt-3 inline-block text-sm font-medium text-amber-700 hover:text-amber-800"
                >
                  Abrir diagnóstico →
                </Link>
              </section>
            )}

            {/* Esta semana */}
            <section className="rounded-xl border border-gray-200 bg-white p-5">
              <h2 className="text-sm font-semibold text-gray-900 mb-4">📈 Esta semana</h2>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {data?.links_criados_semana ?? 0}
                  </p>
                  <p className="text-xs text-gray-500">Criados</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {data?.respostas_semana ?? 0}
                  </p>
                  <p className="text-xs text-gray-500">Respostas</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {data?.conversas_semana ?? 0}
                  </p>
                  <p className="text-xs text-gray-500">Conversas</p>
                </div>
              </div>
            </section>

            {/* Dicas operacionais — determinísticas, zero LLM */}
            {dicas.length > 0 && (
              <section className="space-y-3">
                <h2 className="text-sm font-semibold text-gray-900">🎯 O que ajustar agora</h2>
                {dicas.map((dica) => (
                  <div
                    key={dica.titulo}
                    className="rounded-xl border border-sky-100 bg-sky-50/60 p-4"
                  >
                    <p className="text-sm font-semibold text-gray-900 mb-1">
                      {dica.icon} {dica.titulo}
                    </p>
                    <p className="text-sm text-gray-700 leading-relaxed mb-3">{dica.corpo}</p>
                    <Link
                      href={`${prefix}/home?msg=${encodeURIComponent(dica.noelMsg)}`}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-sky-600 px-3 py-2 text-xs font-semibold text-white hover:bg-sky-700"
                    >
                      Perguntar ao Noel
                    </Link>
                  </div>
                ))}
              </section>
            )}
          </>
        )}
      </div>
    </YladaAreaShell>
  )
}

function FunnelCard({ emoji, label, value }: { emoji: string; label: string; value: number }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50/80 p-3 text-center">
      <p className="text-xl mb-1">{emoji}</p>
      <p className="text-2xl font-bold text-gray-900 tabular-nums">{value}</p>
      <p className="text-[11px] font-medium text-gray-500 mt-0.5">{label}</p>
    </div>
  )
}
