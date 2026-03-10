'use client'

import { useState, useEffect } from 'react'
import YladaAreaShell from './YladaAreaShell'

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

export default function LeadsPageContent({ areaCodigo, areaLabel }: LeadsPageContentProps) {
  const [metrics, setMetrics] = useState<MetricRow[]>([])
  const [loading, setLoading] = useState(true)
  const [filterPerfumeUsage, setFilterPerfumeUsage] = useState<string>('')
  const [filterLinkId, setFilterLinkId] = useState<string>('')
  const [links, setLinks] = useState<Array<{ id: string; slug: string; title: string | null }>>([])

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const [linksRes, metricsRes] = await Promise.all([
          fetch('/api/ylada/links', { credentials: 'include' }),
          fetch(
            `/api/ylada/links/metrics?${new URLSearchParams({
              ...(filterLinkId && { link_id: filterLinkId }),
              ...(filterPerfumeUsage && { perfume_usage: filterPerfumeUsage }),
            }).toString()}`,
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
  }, [filterLinkId, filterPerfumeUsage])

  return (
    <YladaAreaShell areaCodigo={areaCodigo} areaLabel={areaLabel}>
      <div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Leads</h1>
        <p className="text-gray-600 mb-6">
          Quem preencheu o fluxo e clicou no WhatsApp. Para perfumaria, use o filtro de uso principal.
        </p>

        <div className="flex flex-wrap gap-4 mb-6">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Link</label>
            <select
              value={filterLinkId}
              onChange={(e) => setFilterLinkId(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="">Todos os links</option>
              {links.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.title || l.slug}
                </option>
              ))}
            </select>
          </div>
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
        </div>

        {loading ? (
          <p className="text-gray-500">Carregando...</p>
        ) : metrics.length === 0 ? (
          <div className="bg-gray-50 rounded-xl p-8 text-center text-gray-600">
            Nenhum lead ainda. Compartilhe seus links para começar a captar.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Link</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Resultado</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Uso perfume</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">WhatsApp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {metrics.map((m) => (
                  <tr key={m.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-600">{formatDate(m.created_at)}</td>
                    <td className="px-4 py-3 text-sm">
                      <a href={`/l/${m.link_slug}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {m.link_title || m.link_slug}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{m.main_blocker}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {m.perfume_usage ? PERFUME_USAGE_LABELS[m.perfume_usage] ?? m.perfume_usage : '—'}
                    </td>
                    <td className="px-4 py-3">
                      {m.clicked_whatsapp ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                          Cliqueu
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </YladaAreaShell>
  )
}
