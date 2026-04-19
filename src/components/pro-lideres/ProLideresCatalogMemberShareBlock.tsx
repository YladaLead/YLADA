'use client'

import { useCallback, useEffect, useState } from 'react'

type ShareLinkPayload = {
  role?: string
  visibleInCatalog?: boolean
  tokenReady?: boolean
  sharePathSlug?: string | null
  shareUrl?: string | null
  whatsappReady?: boolean
  hint?: string | null
}

export function ProLideresCatalogMemberShareBlock({ yladaLinkId }: { yladaLinkId: string }) {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [slugDraft, setSlugDraft] = useState('')
  const [data, setData] = useState<ShareLinkPayload | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(
        `/api/pro-lideres/equipe/my-share-link?ylada_link_id=${encodeURIComponent(yladaLinkId)}`,
        { credentials: 'include' }
      )
      const j = (await res.json().catch(() => ({}))) as ShareLinkPayload & { error?: string }
      if (!res.ok) {
        setData(null)
        setError(j.error || 'Não foi possível carregar o teu link.')
        return
      }
      setData(j)
      setSlugDraft((j.sharePathSlug as string | undefined)?.trim() || '')
    } catch {
      setData(null)
      setError('Erro de rede.')
    } finally {
      setLoading(false)
    }
  }, [yladaLinkId])

  useEffect(() => {
    void load()
  }, [load])

  async function saveSlug() {
    setSaving(true)
    setError(null)
    try {
      const trimmed = slugDraft.trim()
      const res = await fetch('/api/pro-lideres/equipe/member-link-share-slug', {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ylada_link_id: yladaLinkId,
          share_path_slug: trimmed.length ? trimmed : null,
        }),
      })
      const j = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError((j as { error?: string }).error || 'Não foi possível guardar.')
        return
      }
      await load()
    } catch {
      setError('Erro de rede ao guardar.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <p className="mt-3 text-xs text-slate-500" aria-live="polite">
        A carregar o teu link de divulgação…
      </p>
    )
  }

  return (
    <div className="mt-3 rounded-lg border border-sky-200/80 bg-sky-50/50 p-3 text-xs text-slate-800 shadow-sm">
      <p className="font-semibold text-slate-900">O teu link (WhatsApp contigo)</p>
      <p className="mt-1 leading-relaxed text-slate-600">
        Usa <strong className="text-slate-800">só este endereço</strong> quando partilhares esta ferramenta: o quiz é o
        mesmo da matriz, mas o contacto é <strong className="text-slate-800">o teu número</strong>.
      </p>
      {error ? <p className="mt-2 text-sm text-red-700">{error}</p> : null}
      {data?.hint ? <p className="mt-2 text-amber-900">{data.hint}</p> : null}
      {!data?.tokenReady ? null : !data.visibleInCatalog && data.role !== 'leader' ? (
        <p className="mt-2 font-medium text-amber-900">
          Esta ferramenta está oculta para a equipe — confirma com o líder se podes divulgar.
        </p>
      ) : null}
      {data?.tokenReady && data.shareUrl ? (
        <>
          <p className="mt-2 break-all font-mono text-[11px] text-slate-700" title={data.shareUrl}>
            {data.shareUrl}
          </p>
          <button
            type="button"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(data.shareUrl || '')
              } catch {
                /* ignore */
              }
            }}
            className="mt-2 inline-flex min-h-[36px] items-center rounded-lg border border-sky-300 bg-white px-3 text-xs font-semibold text-sky-900 hover:bg-sky-50"
          >
            Copiar o meu link
          </button>
          {!data.whatsappReady ? (
            <p className="mt-2 text-amber-900">
              Completa o WhatsApp no{' '}
              <a href="/pt/perfil-empresarial" className="font-semibold underline">
                perfil YLADA
              </a>{' '}
              para o botão abrir conversa contigo.
            </p>
          ) : null}
          <div className="mt-3 border-t border-sky-100 pt-3">
            <label className="block text-[11px] font-semibold text-slate-800">
              Slug opcional na URL (minúsculas, números, hífens, 3–40 caracteres)
            </label>
            <div className="mt-1.5 flex flex-col gap-2 sm:flex-row sm:items-center">
              <input
                type="text"
                value={slugDraft}
                onChange={(e) => setSlugDraft(e.target.value)}
                placeholder="ex.: maria-silva"
                autoComplete="off"
                className="min-h-[40px] w-full flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
              />
              <button
                type="button"
                disabled={saving}
                onClick={() => void saveSlug()}
                className="min-h-[40px] shrink-0 rounded-lg bg-slate-800 px-4 text-xs font-semibold text-white hover:bg-slate-900 disabled:opacity-50"
              >
                {saving ? 'A guardar…' : 'Guardar slug'}
              </button>
            </div>
            <p className="mt-1.5 text-[10px] text-slate-500">
              Deixa em branco e guarda para voltar ao segmento automático (token).
            </p>
          </div>
        </>
      ) : null}
    </div>
  )
}
