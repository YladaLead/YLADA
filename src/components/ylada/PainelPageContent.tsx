'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import YladaAreaShell from './YladaAreaShell'
import { getYladaAreaPathPrefix, getYladaLeadsPath } from '@/config/ylada-areas'
import { YLADA_PRO_UPGRADE_PITCH } from '@/config/freemium-limits'

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
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const res = await fetch('/api/ylada/dashboard', { credentials: 'include' })
        const json = await res.json()
        if (json?.success && json.data && !cancelled) setData(json.data)
      } catch {
        if (!cancelled) setData(null)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  const totalRespostas = data?.respostas_semana ?? 0
  const totalConversas = data?.conversas_semana ?? 0
  const taxaConversao = totalRespostas > 0 ? Math.round((totalConversas / totalRespostas) * 100) : 0
  const sugerirMelhorar =
    totalRespostas > 0 && taxaConversao < 30 && (data?.link_mais_ativo_semana?.id != null)

  return (
    <YladaAreaShell areaCodigo={areaCodigo} areaLabel={areaLabel}>
      <div className="max-w-2xl space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
            📊 Hoje no seu YLADA
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
            {/* Freemium: aviso progressivo para usuários Free */}
            {data?.freemium && !data.freemium.is_pro && (
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl" aria-hidden>👩</span>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {data?.respostas_hoje ?? 0}
                    </p>
                    <p className="text-xs text-gray-600">
                      {data?.respostas_hoje === 1 ? 'pessoa respondeu' : 'pessoas responderam'} hoje
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
                      {data?.conversas_hoje === 1 ? 'conversa iniciada' : 'conversas iniciadas'} hoje
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

            {/* Diagnóstico mais ativo esta semana */}
            {data?.link_mais_ativo_semana && (
              <section className="rounded-xl border border-amber-100 bg-amber-50/60 p-5">
                <h2 className="text-sm font-semibold text-amber-900 mb-2">
                  Seu diagnóstico mais ativo esta semana
                </h2>
                <p className="text-sm font-medium text-gray-900 truncate">
                  {data.link_mais_ativo_semana.title}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  👩 {data.link_mais_ativo_semana.respostas}{' '}
                  {data.link_mais_ativo_semana.respostas === 1 ? 'resposta' : 'respostas'} · 💬{' '}
                  {data.link_mais_ativo_semana.conversas}{' '}
                  {data.link_mais_ativo_semana.conversas === 1 ? 'conversa' : 'conversas'}
                </p>
                <Link
                  href={`${prefix}/links/editar/${data.link_mais_ativo_semana.id}`}
                  className="mt-3 inline-block text-sm font-medium text-amber-700 hover:text-amber-800"
                >
                  Ver diagnóstico →
                </Link>
              </section>
            )}

            {/* Próxima ação recomendada */}
            {sugerirMelhorar && data?.link_mais_ativo_semana && (
              <section className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-5">
                <h2 className="text-sm font-semibold text-gray-900 mb-2">
                  🎯 Próxima ação recomendada
                </h2>
                <p className="text-sm text-gray-700 mb-3">
                  Seu diagnóstico está recebendo respostas, mas poucas conversas começaram. Sugestão
                  do Noel: ajustar o texto ou o CTA para despertar mais interesse em falar com você.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`${prefix}/home?msg=${encodeURIComponent(
                      `Quero melhorar o diagnóstico "${data.link_mais_ativo_semana.title}" para gerar mais conversas.`
                    )}`}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
                  >
                    Perguntar ao Noel
                  </Link>
                  <Link
                    href={`${prefix}/links/editar/${data.link_mais_ativo_semana.id}`}
                    className="inline-flex items-center rounded-lg border border-emerald-600 px-4 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-50"
                  >
                    Editar diagnóstico
                  </Link>
                </div>
              </section>
            )}

            {/* Crescimento da semana */}
            <section className="rounded-xl border border-gray-200 bg-white p-5">
              <h2 className="text-sm font-semibold text-gray-900 mb-4">📈 Crescimento da semana</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {data?.links_criados_semana ?? 0}
                  </p>
                  <p className="text-xs text-gray-500">Diagnósticos criados</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {data?.respostas_semana ?? 0}
                  </p>
                  <p className="text-xs text-gray-500">Respostas recebidas</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {data?.conversas_semana ?? 0}
                  </p>
                  <p className="text-xs text-gray-500">Conversas iniciadas</p>
                </div>
              </div>
            </section>

            {/* Consultoria humana */}
            <section className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-5">
              <h2 className="text-sm font-semibold text-emerald-900 mb-2">
                🚀 Consultoria especializada por segmento
              </h2>
              <p className="text-sm text-emerald-900/90 mb-3">
                Se você quer acelerar resultados, nossa equipe ajusta com você mensagem, funil e conversão.
              </p>
              <p className="text-sm font-semibold text-emerald-800 mb-3">
                Você vai ativar previsibilidade no seu crescimento.
              </p>
              <Link
                href="/pt/consultoria"
                className="inline-flex items-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                Quero falar com especialista
              </Link>
            </section>

            {/* Dica do Noel */}
            <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                Dica do Noel
              </p>
              <p className="text-sm text-gray-700 italic">
                Diagnósticos que despertam curiosidade geram mais respostas. Evite perguntas muito
                óbvias.
              </p>
            </div>
          </>
        )}
      </div>
    </YladaAreaShell>
  )
}
