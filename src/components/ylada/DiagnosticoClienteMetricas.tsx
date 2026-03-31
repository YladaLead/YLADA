'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuthenticatedFetch } from '@/hooks/useAuthenticatedFetch'
import { getYladaAreaPathPrefix } from '@/config/ylada-areas'

interface LinkStats {
  view: number
  start: number
  complete: number
  cta_click: number
  result_view?: number
  share_click?: number
  full_analysis_expand?: number
  diagnosis_count?: number
  conversion_rate?: number | null
}

interface LinkItem {
  id: string
  slug: string
  title: string
  url: string
  template_name: string | null
  template_type: string | null
  status: string
  stats: LinkStats
  created_at: string
}

interface DiagnosticoClienteMetricasProps {
  areaCodigo: string
  areaLabel: string
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return iso
  }
}

export default function DiagnosticoClienteMetricas({ areaCodigo, areaLabel }: DiagnosticoClienteMetricasProps) {
  const fetchAuth = useAuthenticatedFetch()
  const prefix = getYladaAreaPathPrefix(areaCodigo)

  const [links, setLinks] = useState<LinkItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const res = await fetchAuth('/api/ylada/links')
        const json = await res.json()
        if (!cancelled && json?.success && json?.data) setLinks(json.data)
      } catch (e) {
        if (!cancelled) console.warn('[DiagnosticoClienteMetricas]', e)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [fetchAuth])

  const totals = links.reduce(
    (acc, l) => ({
      views: acc.views + (l.stats?.view ?? 0),
      starts: acc.starts + (l.stats?.start ?? 0),
      completes: acc.completes + (l.stats?.complete ?? 0),
      ctaClicks: acc.ctaClicks + (l.stats?.cta_click ?? 0),
      diagnoses: acc.diagnoses + (l.stats?.diagnosis_count ?? 0),
    }),
    { views: 0, starts: 0, completes: 0, ctaClicks: 0, diagnoses: 0 }
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-gray-500">Carregando métricas...</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Diagnóstico do cliente</h1>
        <p className="mt-1 text-gray-600">
          Métricas dos diagnósticos e quizzes que você envia para atrair e qualificar clientes.
        </p>
      </div>

      {links.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
          <p className="text-gray-600">Você ainda não tem links criados.</p>
          <p className="mt-2 text-sm text-gray-500">
            Crie seu primeiro diagnóstico ou quiz para começar a atrair clientes.
          </p>
          <Link
            href={`${prefix}/links`}
            className="mt-4 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Criar link
          </Link>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <p className="text-2xl font-bold text-gray-900">{links.length}</p>
              <p className="text-sm text-gray-600">Links ativos</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <p className="text-2xl font-bold text-gray-900">{totals.views}</p>
              <p className="text-sm text-gray-600">Visualizações</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <p className="text-2xl font-bold text-gray-900">{totals.completes}</p>
              <p className="text-sm text-gray-600">Diagnósticos completos</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <p className="text-2xl font-bold text-gray-900">{totals.ctaClicks}</p>
              <p className="text-sm text-gray-600">Cliques no CTA</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <p className="text-2xl font-bold text-gray-900">{totals.diagnoses}</p>
              <p className="text-sm text-gray-600">Resultados gerados</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <p className="text-2xl font-bold text-gray-900">
                {totals.diagnoses > 0
                  ? `${((totals.ctaClicks / totals.diagnoses) * 100).toFixed(1)}%`
                  : '—'}
              </p>
              <p className="text-sm text-gray-600">Taxa de conversão</p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="font-semibold text-gray-900">Por link</h2>
            {links.map((link) => (
              <div
                key={link.id}
                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">{link.title || link.slug}</h3>
                    <p className="text-xs text-gray-500">
                      {link.template_name || 'Link'} · {formatDate(link.created_at)}
                    </p>
                  </div>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-blue-600 hover:underline"
                  >
                    {link.url}
                  </a>
                </div>
                <div className="mt-4 flex flex-wrap gap-4 text-sm">
                  <span title="Visualizações">
                    <strong>{link.stats?.view ?? 0}</strong> views
                  </span>
                  <span title="Iniciaram">
                    <strong>{link.stats?.start ?? 0}</strong> iniciaram
                  </span>
                  <span title="Completaram">
                    <strong>{link.stats?.complete ?? 0}</strong> completaram
                  </span>
                  <span title="Cliques no CTA">
                    <strong>{link.stats?.cta_click ?? 0}</strong> cliques CTA
                  </span>
                  <span title="Compartilhar">
                    <strong>{link.stats?.share_click ?? 0}</strong> compartilhar
                  </span>
                  <span title="Análise completa expandida">
                    <strong>{link.stats?.full_analysis_expand ?? 0}</strong> análise expandida
                  </span>
                  {typeof link.stats?.diagnosis_count === 'number' && (
                    <span title="Resultados gerados">
                      <strong>{link.stats.diagnosis_count}</strong> resultados
                    </span>
                  )}
                  {typeof link.stats?.conversion_rate === 'number' && (
                    <span
                      title="Taxa de conversão (cliques WhatsApp / respostas)"
                      className={
                        link.stats.conversion_rate < 10
                          ? 'text-amber-600 font-medium'
                          : undefined
                      }
                    >
                      <strong>{link.stats.conversion_rate}%</strong> conversão
                    </span>
                  )}
                </div>
                <div className="mt-3 flex flex-wrap gap-3">
                  <Link
                    href={`${prefix}/links/editar/${link.id}`}
                    className="text-sm text-gray-500 hover:underline"
                  >
                    Editar link →
                  </Link>
                  {(link.stats?.diagnosis_count ?? 0) >= 3 && (
                    <Link
                      href={`${prefix}/home?msg=${encodeURIComponent(
                        `Quero melhorar o diagnóstico do link "${link.title || link.slug}". Ele está com ${link.stats?.conversion_rate ?? 0}% de conversão.`
                      )}`}
                      className="text-sm text-amber-600 font-medium hover:underline"
                      title="Pedir ao Noel sugestões para melhorar a conversão"
                    >
                      Melhorar diagnóstico →
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <Link href={`${prefix}/crescimento`} className="text-sm text-gray-500 hover:underline">
        ← Voltar ao sistema de crescimento
      </Link>
    </div>
  )
}
