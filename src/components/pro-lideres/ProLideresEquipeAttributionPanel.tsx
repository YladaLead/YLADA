'use client'

import { useCallback, useEffect, useState } from 'react'

type YladaLinkRow = {
  id: string
  slug: string
  title?: string | null
  template_type?: string | null
}

type AttributionMember = {
  userId: string
  role: string
  displayName: string | null
  email: string | null
  token: string | null
  shareUrl: string | null
  views: number
  whatsappClicks: number
}

const ALLOWED = new Set(['calculator', 'diagnostico', 'quiz', 'triagem'])

export function ProLideresEquipeAttributionPanel() {
  const [links, setLinks] = useState<YladaLinkRow[]>([])
  const [linkId, setLinkId] = useState('')
  const [loadingLinks, setLoadingLinks] = useState(true)
  const [loadingData, setLoadingData] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [members, setMembers] = useState<AttributionMember[]>([])
  const [meta, setMeta] = useState<{ slug?: string; title?: string; verticalCode?: string }>({})

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoadingLinks(true)
      try {
        const res = await fetch('/api/ylada/links', { credentials: 'include' })
        const data = await res.json().catch(() => ({}))
        const raw = (data.success && Array.isArray(data.data) ? data.data : []) as YladaLinkRow[]
        const filtered = raw.filter((l) => l.template_type && ALLOWED.has(String(l.template_type)))
        if (!cancelled) {
          setLinks(filtered)
          setLinkId((prev) => prev || (filtered[0]?.id ?? ''))
        }
      } catch {
        if (!cancelled) setError('Não foi possível carregar os teus links YLADA.')
      } finally {
        if (!cancelled) setLoadingLinks(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const loadAttribution = useCallback(async (ensure: boolean) => {
    if (!linkId) return
    setLoadingData(true)
    setError(null)
    try {
      const q = ensure ? '&ensure=1' : ''
      const res = await fetch(`/api/pro-lideres/equipe/attribution?link_id=${encodeURIComponent(linkId)}${q}`, {
        credentials: 'include',
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError((data as { error?: string }).error || 'Erro ao carregar métricas.')
        setMembers([])
        return
      }
      setMembers((data as { members?: AttributionMember[] }).members ?? [])
      setMeta({
        slug: (data as { slug?: string }).slug,
        title: (data as { title?: string }).title,
        verticalCode: (data as { verticalCode?: string }).verticalCode,
      })
    } catch {
      setError('Erro de rede.')
      setMembers([])
    } finally {
      setLoadingData(false)
    }
  }, [linkId])

  useEffect(() => {
    if (!linkId || loadingLinks) return
    void loadAttribution(false)
  }, [linkId, loadingLinks, loadAttribution])

  async function copyUrl(url: string) {
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      /* ignore */
    }
  }

  return (
    <section className="overflow-hidden rounded-xl border border-blue-100 bg-white shadow-sm" aria-labelledby="pl-attribution-heading">
      <div className="border-b border-blue-50 bg-blue-50/50 px-4 py-3">
        <h2 id="pl-attribution-heading" className="text-sm font-semibold text-gray-900">
          Rastreio por membro (links partilhados)
        </h2>
        <p className="mt-1 text-xs text-gray-600">
          Cada pessoa da equipa (e tu) recebe um link com <code className="rounded bg-white px-1">?pl_m=…</code>. Assim vês{' '}
          <strong className="text-gray-800">cliques</strong> e <strong className="text-gray-800">WhatsApp</strong> por
          membro. Vertical do espaço:{' '}
          <span className="font-mono text-blue-800">{meta.verticalCode ?? 'h-lider'}</span> (ex. Herbalife).
        </p>
      </div>

      <div className="space-y-4 p-4">
        {loadingLinks ? (
          <p className="text-sm text-gray-500">A carregar os teus links…</p>
        ) : links.length === 0 ? (
          <p className="text-sm text-gray-600">
            Cria primeiro uma ferramenta em{' '}
            <a href="/pt/links" className="font-medium text-blue-700 underline">
              Meus links
            </a>
            .
          </p>
        ) : (
          <>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <label className="block min-w-0 flex-1 text-sm">
                <span className="mb-1 block font-medium text-gray-700">Link YLADA</span>
                <select
                  value={linkId}
                  onChange={(e) => setLinkId(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                >
                  {links.map((l) => (
                    <option key={l.id} value={l.id}>
                      {(l.title || l.slug || l.id).slice(0, 80)}
                    </option>
                  ))}
                </select>
              </label>
              <button
                type="button"
                disabled={loadingData}
                onClick={() => void loadAttribution(true)}
                className="min-h-[44px] shrink-0 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {loadingData ? 'A atualizar…' : 'Gerar / atualizar links da equipa'}
              </button>
            </div>

            {error && <p className="text-sm text-red-700">{error}</p>}

            {meta.slug && (
              <p className="text-xs text-gray-500">
                Slug: <span className="font-mono">{meta.slug}</span>
              </p>
            )}

            <div className="overflow-x-auto rounded-lg border border-gray-100">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-3 py-2">Pessoa</th>
                    <th className="px-3 py-2">Papel</th>
                    <th className="px-3 py-2 text-right">Cliques</th>
                    <th className="px-3 py-2 text-right">WhatsApp</th>
                    <th className="px-3 py-2">Link rastreado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {members.map((m) => (
                    <tr key={m.userId} className="align-top">
                      <td className="px-3 py-2">
                        <p className="font-medium text-gray-900">{m.displayName || m.email || m.userId.slice(0, 8)}</p>
                        {m.email && m.displayName && <p className="text-xs text-gray-500">{m.email}</p>}
                      </td>
                      <td className="px-3 py-2 text-gray-700">{m.role === 'leader' ? 'Líder' : 'Equipe'}</td>
                      <td className="px-3 py-2 text-right tabular-nums text-gray-900">{m.views}</td>
                      <td className="px-3 py-2 text-right tabular-nums text-emerald-800">{m.whatsappClicks}</td>
                      <td className="max-w-[200px] px-3 py-2">
                        {m.shareUrl ? (
                          <div className="flex flex-col gap-1">
                            <button
                              type="button"
                              onClick={() => void copyUrl(m.shareUrl!)}
                              className="text-left text-xs font-medium text-blue-700 underline"
                            >
                              Copiar link
                            </button>
                            <span className="line-clamp-2 break-all font-mono text-[10px] text-gray-400" title={m.shareUrl}>
                              {m.shareUrl}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-amber-800">Gera tokens com o botão acima.</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
