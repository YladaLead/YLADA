'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import YladaAreaShell from './YladaAreaShell'
import { getYladaAreaPathPrefix } from '@/config/ylada-areas'

type MetricRow = {
  id: string
  link_id: string
  link_slug: string | null
  link_title: string | null
  architecture: string
  main_blocker: string
  theme: string | null
  perfume_usage: string | null
  clicked_whatsapp: boolean
  clicked_at: string | null
  created_at: string
}

/** Labels de "uso do perfume" — só exibidos no segmento perfumaria. */
const PERFUME_USAGE_LABELS: Record<string, string> = {
  dia_a_dia: 'Dia a dia',
  trabalho: 'Trabalho',
  encontros: 'Encontros',
  eventos: 'Eventos',
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso)
    return d.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return iso
  }
}

interface LeadsPageContentProps {
  areaCodigo: string
  areaLabel: string
}

function formatRelativeDate(iso: string): string {
  try {
    const d = new Date(iso)
    const now = new Date()
    const diffMs = now.getTime() - d.getTime()
    const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000))
    if (diffDays === 0) return 'Hoje'
    if (diffDays === 1) return 'Ontem'
    if (diffDays < 7) return `${diffDays} dias atrás`
    return formatDate(iso)
  } catch {
    return iso
  }
}

export default function LeadsPageContent({ areaCodigo, areaLabel }: LeadsPageContentProps) {
  const prefix = getYladaAreaPathPrefix(areaCodigo)
  const linksPath = `${prefix}/links`
  const isPerfumaria = areaCodigo === 'perfumaria'
  const [metrics, setMetrics] = useState<MetricRow[]>([])
  const [loading, setLoading] = useState(true)
  const [filterLinkId, setFilterLinkId] = useState<string>('')
  const [filterPerfumeUsage, setFilterPerfumeUsage] = useState<string>('')
  const [links, setLinks] = useState<Array<{ id: string; slug: string; title: string | null }>>([])

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const params: Record<string, string> = {}
        if (filterLinkId) params.link_id = filterLinkId
        if (isPerfumaria && filterPerfumeUsage) params.perfume_usage = filterPerfumeUsage
        const [linksRes, metricsRes] = await Promise.all([
          fetch('/api/ylada/links', { credentials: 'include' }),
          fetch(
            `/api/ylada/links/metrics?${new URLSearchParams(params).toString()}`,
            { credentials: 'include' }
          ),
        ])
        const linksJson = await linksRes.json()
        const metricsJson = await metricsRes.json()
        if (linksJson?.success && Array.isArray(linksJson.data)) {
          setLinks(linksJson.data.map((l: { id: string; slug: string; title: string | null }) => ({ id: l.id, slug: l.slug, title: l.title })))
        }
        if (metricsJson?.success && Array.isArray(metricsJson.data)) {
          setMetrics(metricsJson.data)
        }
      } catch (e) {
        console.error('[leads]', e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [filterLinkId, isPerfumaria, filterPerfumeUsage])

  return (
    <YladaAreaShell areaCodigo={areaCodigo} areaLabel={areaLabel}>
      <div>
        <h1 className="text-xl font-bold text-gray-900 mb-1">Leads dos seus diagnósticos</h1>
        <p className="text-gray-600 text-sm mb-6">
          Pessoas que responderam seus diagnósticos e podem iniciar uma conversa com você.
        </p>

        <div className="flex flex-wrap gap-4 mb-6">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Diagnóstico</label>
            <select
              value={filterLinkId}
              onChange={(e) => setFilterLinkId(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="">Todos os diagnósticos</option>
              {links.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.title || l.slug}
                </option>
              ))}
            </select>
          </div>
          {isPerfumaria && (
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Uso do perfume</label>
              <select
                value={filterPerfumeUsage}
                onChange={(e) => setFilterPerfumeUsage(e.target.value)}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="">Todos</option>
                {Object.entries(PERFUME_USAGE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {loading ? (
          <p className="text-gray-500">Carregando...</p>
        ) : metrics.length === 0 ? (
          <div className="rounded-xl border border-sky-100 bg-sky-50/60 p-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Ainda não há leads</h2>
            <p className="text-gray-700 text-sm mb-4">
              Quando alguém responde seu diagnóstico, a pessoa aparece aqui para você iniciar uma conversa.
            </p>
            <p className="text-sm font-medium text-gray-800 mb-2">Para começar:</p>
            <ol className="list-decimal list-inside text-sm text-gray-700 space-y-1.5 mb-6">
              <li>Crie um diagnóstico</li>
              <li>Compartilhe o link</li>
              <li>Receba respostas e converse</li>
            </ol>
            <div className="flex flex-wrap gap-3">
              <Link
                href={linksPath}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 text-white text-sm font-medium hover:bg-sky-700 transition-colors"
              >
                🧪 Criar diagnóstico
              </Link>
              <Link
                href={linksPath}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-sky-300 bg-white text-sky-700 text-sm font-medium hover:bg-sky-50 transition-colors"
              >
                🔗 Ver diagnósticos para compartilhar
              </Link>
            </div>
          </div>
        ) : (
          <>
            <p className="text-gray-600 text-sm mb-4">
              Quando alguém responde seu diagnóstico, a pessoa aparece aqui para você iniciar uma conversa.
            </p>
            {/* Desktop: tabela */}
            <div className="hidden md:block overflow-x-auto rounded-xl border border-gray-200 bg-white">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Diagnóstico</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Resultado</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {metrics.map((m) => (
                    <tr key={m.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-600">Visitante</td>
                      <td className="px-4 py-3 text-sm">
                        <a href={`/l/${m.link_slug}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {m.link_title || m.link_slug}
                        </a>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{m.main_blocker}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{formatRelativeDate(m.created_at)}</td>
                      <td className="px-4 py-3">
                        <Link
                          href={`${prefix}/home`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 text-white text-sm font-medium hover:bg-sky-700 transition-colors"
                        >
                          💬 Conversar
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Mobile: cartões */}
            <div className="md:hidden space-y-3">
              {metrics.map((m) => (
                <div
                  key={m.id}
                  className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
                >
                  <p className="text-gray-900 font-medium mb-0.5">Visitante</p>
                  <p className="text-gray-600 text-sm mb-1">
                    <span className="text-gray-500">Diagnóstico:</span>{' '}
                    {m.link_title || m.link_slug}
                  </p>
                  <p className="text-gray-600 text-sm mb-1">
                    <span className="text-gray-500">Resultado:</span> {m.main_blocker}
                  </p>
                  <p className="text-gray-500 text-xs mb-3">{formatRelativeDate(m.created_at)}</p>
                  <Link
                    href={`${prefix}/home`}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-sky-600 text-white text-sm font-medium hover:bg-sky-700 transition-colors w-full justify-center"
                  >
                    💬 Conversar
                  </Link>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </YladaAreaShell>
  )
}
