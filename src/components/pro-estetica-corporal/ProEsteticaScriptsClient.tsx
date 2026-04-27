'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useProLideresPainel } from '@/components/pro-lideres/pro-lideres-painel-context'
import type { LeaderTenantEsteticaScriptRow } from '@/types/leader-tenant'

const CATEGORY_LABEL: Record<LeaderTenantEsteticaScriptRow['category'], string> = {
  captar: 'Captar',
  retencao: 'Retenção',
  acompanhar: 'Acompanhar',
  geral: 'Geral',
}

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

const DEFAULT_SCRIPTS_API_BASE = '/api/pro-estetica-corporal'
const DEFAULT_NOEL_PAINEL_HREF = '/pro-estetica-corporal/painel/noel'
const DEFAULT_ENTRAR_NEXT_HREF =
  '/pro-estetica-corporal/entrar?next=%2Fpro-estetica-corporal%2Fpainel%2Fscripts'

export type ProEsteticaScriptsClientProps = {
  /** Base da API (ex.: `/api/pro-estetica-capilar`). */
  scriptsApiBase?: string
  noelPainelHref?: string
  entrarWithNextHref?: string
}

export function ProEsteticaScriptsClient({
  scriptsApiBase = DEFAULT_SCRIPTS_API_BASE,
  noelPainelHref = DEFAULT_NOEL_PAINEL_HREF,
  entrarWithNextHref = DEFAULT_ENTRAR_NEXT_HREF,
}: ProEsteticaScriptsClientProps = {}) {
  const { previewWithoutLogin } = useProLideresPainel()
  const [scripts, setScripts] = useState<LeaderTenantEsteticaScriptRow[]>([])
  const [canEdit, setCanEdit] = useState(true)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [category, setCategory] = useState<LeaderTenantEsteticaScriptRow['category']>('geral')

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editBody, setEditBody] = useState('')
  const [editCategory, setEditCategory] = useState<LeaderTenantEsteticaScriptRow['category']>('geral')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (previewWithoutLogin) {
      setLoading(false)
      setScripts([])
      setCanEdit(false)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${scriptsApiBase}/scripts`, { credentials: 'include' })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError((data as { error?: string }).error || 'Não foi possível carregar os scripts.')
        setScripts([])
        return
      }
      setScripts((data as { scripts?: LeaderTenantEsteticaScriptRow[] }).scripts ?? [])
      setCanEdit((data as { canEdit?: boolean }).canEdit !== false)
    } catch {
      setError('Erro de rede.')
      setScripts([])
    } finally {
      setLoading(false)
    }
  }, [previewWithoutLogin, scriptsApiBase])

  useEffect(() => {
    void load()
  }, [load])

  async function onCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!canEdit || previewWithoutLogin) return
    const t = title.trim()
    if (!t) return
    setSaving(true)
    setError(null)
    try {
      const res = await fetch(`${scriptsApiBase}/scripts`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: t, body, category }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError((data as { error?: string }).error || 'Não foi possível guardar.')
        return
      }
      setTitle('')
      setBody('')
      setCategory('geral')
      await load()
    } catch {
      setError('Erro de rede ao guardar.')
    } finally {
      setSaving(false)
    }
  }

  function startEdit(s: LeaderTenantEsteticaScriptRow) {
    setEditingId(s.id)
    setEditTitle(s.title)
    setEditBody(s.body)
    setEditCategory(s.category)
  }

  async function saveEdit() {
    if (!editingId || !canEdit) return
    setSaving(true)
    setError(null)
    try {
      const res = await fetch(`${scriptsApiBase}/scripts/${editingId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editTitle.trim(),
          body: editBody,
          category: editCategory,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError((data as { error?: string }).error || 'Não foi possível atualizar.')
        return
      }
      setEditingId(null)
      await load()
    } catch {
      setError('Erro de rede ao atualizar.')
    } finally {
      setSaving(false)
    }
  }

  async function remove(id: string) {
    if (!canEdit || !confirm('Apagar este script?')) return
    setError(null)
    try {
      const res = await fetch(`${scriptsApiBase}/scripts/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError((data as { error?: string }).error || 'Não foi possível apagar.')
        return
      }
      if (editingId === id) setEditingId(null)
      await load()
    } catch {
      setError('Erro de rede ao apagar.')
    }
  }

  async function onCopy(id: string, text: string) {
    const ok = await copyText(text)
    if (ok) {
      setCopiedId(id)
      window.setTimeout(() => setCopiedId(null), 2000)
    }
  }

  if (previewWithoutLogin) {
    return (
      <div className="max-w-2xl space-y-4 rounded-xl border border-sky-200 bg-sky-50/80 p-5 text-sm text-sky-950">
        <p className="font-semibold">Scripts guardados na base de dados</p>
        <p>
          Em pré-visualização sem login não é possível gravar. Inicia sessão para criares e gerires os teus roteiros.
        </p>
        <Link
          href={entrarWithNextHref}
          className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Iniciar sessão
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <p className="text-sm font-medium text-blue-600">Para ti</p>
        <h1 className="text-2xl font-bold text-gray-900">Scripts</h1>
        <p className="mt-1 max-w-2xl text-gray-600">
          Roteiros teus (WhatsApp, follow-up, objeções). Só o titular da operação pode criar e editar; quem tiver acesso
          de leitura vê a lista.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>
      )}

      {canEdit && (
        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900">Novo script</h2>
          <form onSubmit={onCreate} className="mt-4 space-y-3">
            <label className="block text-sm">
              <span className="mb-1 block font-medium text-gray-700">Título</span>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm"
                maxLength={200}
                required
                placeholder="Ex.: Primeira mensagem após o formulário"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block font-medium text-gray-700">Fase da jornada</span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as LeaderTenantEsteticaScriptRow['category'])}
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm"
              >
                <option value="geral">Geral</option>
                <option value="captar">Captar</option>
                <option value="retencao">Retenção</option>
                <option value="acompanhar">Acompanhar</option>
              </select>
            </label>
            <label className="block text-sm">
              <span className="mb-1 block font-medium text-gray-700">Texto</span>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={5}
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm"
                placeholder="Cola aqui a mensagem que queres reutilizar…"
              />
            </label>
            <button
              type="submit"
              disabled={saving}
              className="min-h-[44px] rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'A guardar…' : 'Guardar script'}
            </button>
          </form>
        </section>
      )}

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-gray-900">Os teus scripts</h2>
        {loading ? (
          <p className="text-gray-600">A carregar…</p>
        ) : scripts.length === 0 ? (
          <p className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-8 text-center text-sm text-gray-600">
            Ainda não tens scripts guardados. {canEdit ? 'Usa o formulário acima.' : 'O titular pode adicionar roteiros aqui.'}
          </p>
        ) : (
          <ul className="space-y-3">
            {scripts.map((s) => (
              <li key={s.id} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                {editingId === s.id ? (
                  <div className="space-y-3">
                    <input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold"
                      maxLength={200}
                    />
                    <select
                      value={editCategory}
                      onChange={(e) =>
                        setEditCategory(e.target.value as LeaderTenantEsteticaScriptRow['category'])
                      }
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                    >
                      <option value="geral">Geral</option>
                      <option value="captar">Captar</option>
                      <option value="retencao">Retenção</option>
                      <option value="acompanhar">Acompanhar</option>
                    </select>
                    <textarea
                      value={editBody}
                      onChange={(e) => setEditBody(e.target.value)}
                      rows={6}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                    />
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => void saveEdit()}
                        disabled={saving}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                      >
                        Guardar
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <span className="inline-block rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-800">
                          {CATEGORY_LABEL[s.category]}
                        </span>
                        <h3 className="mt-1 font-semibold text-gray-900">{s.title}</h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => void onCopy(s.id, s.body)}
                          className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                        >
                          {copiedId === s.id ? '✓ Copiado' : 'Copiar texto'}
                        </button>
                        {canEdit && (
                          <>
                            <button
                              type="button"
                              onClick={() => startEdit(s)}
                              className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                            >
                              Editar
                            </button>
                            <button
                              type="button"
                              onClick={() => void remove(s.id)}
                              className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50"
                            >
                              Apagar
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                    <pre className="mt-3 max-h-48 overflow-auto whitespace-pre-wrap rounded-lg bg-gray-50 p-3 font-sans text-sm text-gray-800">
                      {s.body || '—'}
                    </pre>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <p className="text-sm text-gray-500">
        Dica: usa o <Link href={noelPainelHref} className="font-medium text-blue-600 hover:text-blue-800">Noel</Link> para gerar variantes e depois grava aqui o que funcionar.
      </p>
    </div>
  )
}
