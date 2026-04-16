'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

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
  const [panelOpen, setPanelOpen] = useState(false)
  const [tableQuery, setTableQuery] = useState('')

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

  const filteredMembers = useMemo(() => {
    const q = tableQuery.trim().toLowerCase()
    if (!q) return members
    return members.filter((m) => {
      const name = (m.displayName ?? '').toLowerCase()
      const email = (m.email ?? '').toLowerCase()
      const id = m.userId.toLowerCase()
      return name.includes(q) || email.includes(q) || id.includes(q)
    })
  }, [members, tableQuery])

  return (
    <section className="overflow-hidden rounded-xl border border-blue-100 bg-white shadow-sm" aria-labelledby="pl-attribution-heading">
      <button
        type="button"
        onClick={() => setPanelOpen((v) => !v)}
        className="flex w-full items-start justify-between gap-3 border-b border-blue-50 bg-blue-50/50 px-4 py-3 text-left transition hover:bg-blue-50"
        aria-expanded={panelOpen}
      >
        <div className="min-w-0 space-y-1">
          <p id="pl-attribution-heading" className="text-sm font-semibold text-gray-900">
            Rastreio por membro (links partilhados)
          </p>
          <p className="text-xs leading-relaxed text-gray-600">
            <strong className="font-semibold text-gray-800">Objetivo:</strong> ver{' '}
            <span className="text-gray-800">quem da equipe</span> está a usar cada ferramenta YLADA que escolhes
            abaixo — com <strong className="text-gray-800">cliques</strong> no link e{' '}
            <strong className="text-gray-800">toques em WhatsApp</strong> por pessoa (não só o total geral do link).
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {!loadingLinks && links.length > 0 && members.length > 0 ? (
            <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-gray-700 ring-1 ring-blue-100">
              {members.length}
            </span>
          ) : !loadingLinks && links.length === 0 ? (
            <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-900 ring-1 ring-amber-100">
              Sem links
            </span>
          ) : null}
          <span className="text-gray-500" aria-hidden>
            {panelOpen ? '▲' : '▼'}
          </span>
        </div>
      </button>

      {panelOpen ? (
        <div className="space-y-4 border-t border-blue-100/80 p-4">
          <div className="rounded-lg border border-gray-100 bg-gray-50/80 px-3 py-2.5 text-xs leading-relaxed text-gray-700">
            <p className="font-medium text-gray-800">Como funciona (em 3 passos)</p>
            <ol className="mt-1.5 list-decimal space-y-1 pl-4">
              <li>
                Escolhes o <strong>link YLADA</strong> (quiz, calculadora, etc.) que queres acompanhar por equipa.
              </li>
              <li>
                Clicas em <strong>Gerar / atualizar links da equipe</strong> — o sistema cria um URL único por pessoa
                com <code className="rounded bg-white px-1 font-mono text-[11px]">?pl_m=…</code>. Cada um deve usar o{' '}
                <strong>próprio link</strong> ao partilhar no campo.
              </li>
              <li>
                As colunas <strong>Cliques</strong> e <strong>WhatsApp</strong> contam só visitas e CTAs feitos com o
                link daquela pessoa. Espaço: <span className="font-mono text-blue-800">{meta.verticalCode ?? 'h-lider'}</span>.
              </li>
            </ol>
          </div>

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
                  <span className="mb-0.5 block font-medium text-gray-700">Acompanhar cada pessoa da equipa</span>
                  <span className="mb-2 block text-xs font-normal text-gray-500">
                    Primeiro escolhe o <strong className="font-medium text-gray-600">link YLADA</strong> em que queres
                    ver o desempenho individual — a tabela abaixo lista toda a gente; usa a busca para filtrar por
                    nome.
                  </span>
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
                  {loadingData ? 'A atualizar…' : 'Gerar / atualizar links da equipe'}
                </button>
              </div>

              {error && <p className="text-sm text-red-700">{error}</p>}

              {meta.slug && (
                <p className="text-xs text-gray-500">
                  Slug do link: <span className="font-mono">{meta.slug}</span>
                </p>
              )}

              <div>
                <label htmlFor="pl-attribution-table-search" className="mb-1.5 block text-xs font-semibold text-gray-700">
                  Buscar pessoa na tabela
                </label>
                <input
                  id="pl-attribution-table-search"
                  type="search"
                  value={tableQuery}
                  onChange={(e) => setTableQuery(e.target.value)}
                  placeholder="Nome ou e-mail…"
                  autoComplete="off"
                  className="w-full max-w-md rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
                {tableQuery.trim() ? (
                  <p className="mt-1.5 text-xs text-gray-500">
                    {filteredMembers.length === 0
                      ? 'Nenhum resultado.'
                      : `${filteredMembers.length} de ${members.length} na vista`}
                  </p>
                ) : null}
              </div>

              <div className="max-h-[min(60vh,28rem)] overflow-x-auto overflow-y-auto overscroll-contain rounded-lg border border-gray-100">
                <table className="min-w-full text-left text-sm">
                  <thead className="sticky top-0 z-[1] bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500 shadow-sm">
                    <tr>
                      <th className="px-3 py-2">Pessoa</th>
                      <th className="px-3 py-2">Papel</th>
                      <th className="px-3 py-2 text-right">Cliques</th>
                      <th className="px-3 py-2 text-right">WhatsApp</th>
                      <th className="px-3 py-2">Link rastreado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredMembers.map((m) => (
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
      ) : null}
    </section>
  )
}
