'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { formatDisplayTitle } from '@/lib/ylada/strategic-intro'
import { usePathname } from 'next/navigation'
import YladaAreaShell from '@/components/ylada/YladaAreaShell'
import { getYladaAreaPathPrefix } from '@/config/ylada-areas'
import { useAuth } from '@/hooks/useAuth'
import { CompartilharDiagnosticoContent } from '@/components/ylada/CompartilharDiagnosticoContent'

type FormField = { id: string; label: string; type?: string; options?: string[] }
type LinkStats = { view: number; start: number; complete: number; cta_click: number; diagnosis_count?: number; conversion_rate?: number | null }
type LinkData = {
  id: string
  slug: string
  title: string | null
  config_json: {
    title?: string
    page?: { title?: string; subtitle?: string }
    form?: { fields?: FormField[]; submit_label?: string }
  }
  cta_whatsapp?: string | null
  url?: string
  stats?: LinkStats
}

/** Deriva areaCodigo e areaLabel do pathname (ex: /pt/psi/links/editar/123 → psi). */
function useAreaFromPath() {
  const pathname = usePathname()
  if (!pathname) return { areaCodigo: 'ylada' as const, areaLabel: 'YLADA' }
  const m = pathname.match(/^\/pt\/(med|psi|odonto|nutra|nutri|coach|psicanalise|perfumaria|seller|estetica|fitness)\//)
  const area = m?.[1] ?? 'ylada'
  const labels: Record<string, string> = { med: 'Médicos', psi: 'Psicologia', odonto: 'Odontologia', nutra: 'Nutra', nutri: 'Nutri', coach: 'Coach', psicanalise: 'Psicanálise', perfumaria: 'Perfumaria', seller: 'Vendedores', estetica: 'Estética', fitness: 'Fitness' }
  return { areaCodigo: area as 'ylada' | 'med' | 'psi' | 'odonto' | 'nutra' | 'nutri' | 'coach' | 'psicanalise' | 'perfumaria' | 'seller' | 'estetica' | 'fitness', areaLabel: labels[area] ?? 'YLADA' }
}

export default function EditarLinkPage({ params }: { params: Promise<{ id: string }> }) {
  const { areaCodigo, areaLabel } = useAreaFromPath()
  const linksPath = `${getYladaAreaPathPrefix(areaCodigo)}/links`
  const [id, setId] = useState<string | null>(null)
  const [link, setLink] = useState<LinkData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editFields, setEditFields] = useState<FormField[]>([])
  const [editingFieldIndex, setEditingFieldIndex] = useState<number | null>(null)
  const [showCompartilhar, setShowCompartilhar] = useState(false)
  const { userProfile } = useAuth()

  useEffect(() => {
    params.then((p) => setId(p.id))
  }, [params])

  useEffect(() => {
    if (!id) return
    setLoading(true)
    fetch(`/api/ylada/links/by-id/${id}`, { credentials: 'include' })
      .then((r) => r.json())
      .then((json) => {
        if (json?.success && json?.data) {
          const d = json.data as LinkData
          setLink(d)
          const pageTitle = d.config_json?.page?.title ?? d.config_json?.title ?? d.title ?? ''
          setEditTitle(formatDisplayTitle(pageTitle))
          setEditFields(d.config_json?.form?.fields ?? [])
        } else {
          setMessage({ type: 'error', text: json?.error || 'Link não encontrado' })
        }
      })
      .catch(() => setMessage({ type: 'error', text: 'Erro ao carregar' }))
      .finally(() => setLoading(false))
  }, [id])

  const handleSave = async () => {
    if (!link) return
    setSaving(true)
    setMessage(null)
    try {
      const config = { ...link.config_json }
      config.title = editTitle
      config.page = { ...config.page, title: editTitle }
      config.form = { ...config.form, fields: editFields, submit_label: config.form?.submit_label ?? 'Ver resultado' }

      const res = await fetch(`/api/ylada/links/by-id/${link.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ config_json: config }),
      })
      const json = await res.json()
      if (json?.success) {
        setMessage({ type: 'success', text: 'Salvo!' })
        setLink((prev) => (prev ? { ...prev, config_json: config } : null))
        setEditingFieldIndex(null)
        // Disparar geração de diagnóstico via IA (memoriza para não chamar de novo)
        const arch = (config.meta as Record<string, unknown>)?.architecture as string | undefined
        if (arch === 'RISK_DIAGNOSIS' || arch === 'BLOCKER_DIAGNOSIS') {
          fetch(`/api/ylada/links/by-id/${link.id}/generate-diagnosis?force=true`, {
            method: 'POST',
            credentials: 'include',
          }).catch(() => {})
        }
      } else {
        setMessage({ type: 'error', text: json?.error || 'Erro ao salvar' })
      }
    } catch {
      setMessage({ type: 'error', text: 'Erro ao salvar' })
    } finally {
      setSaving(false)
    }
  }

  const updateField = (index: number, updates: Partial<FormField>) => {
    setEditFields((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], ...updates }
      return next
    })
  }

  const updateOption = (fieldIndex: number, optIndex: number, value: string) => {
    setEditFields((prev) => {
      const next = [...prev]
      const opts = [...(next[fieldIndex].options ?? [])]
      opts[optIndex] = value
      next[fieldIndex] = { ...next[fieldIndex], options: opts }
      return next
    })
  }

  const addOption = (fieldIndex: number) => {
    setEditFields((prev) => {
      const next = [...prev]
      const opts = [...(next[fieldIndex].options ?? [])]
      opts.push('Nova opção')
      next[fieldIndex] = { ...next[fieldIndex], options: opts }
      return next
    })
  }

  const removeOption = (fieldIndex: number, optIndex: number) => {
    setEditFields((prev) => {
      const next = [...prev]
      const opts = [...(next[fieldIndex].options ?? [])]
      opts.splice(optIndex, 1)
      next[fieldIndex] = { ...next[fieldIndex], options: opts }
      return next
    })
  }

  const addQuestionAt = (atIndex: number) => {
    const nextId = `q${Date.now()}`
    const newField: FormField = { id: nextId, label: 'Nova pergunta', type: 'single', options: ['Opção A', 'Opção B', 'Opção C'] }
    setEditFields((prev) => {
      const next = [...prev]
      next.splice(atIndex, 0, newField)
      return next
    })
    setEditingFieldIndex(atIndex)
  }

  const removeQuestion = (index: number) => {
    if (editFields.length <= 1) return
    if (!confirm('Excluir esta pergunta? Esta ação não pode ser desfeita.')) return
    setEditFields((prev) => prev.filter((_, i) => i !== index))
    setEditingFieldIndex(null)
  }

  if (loading || !link) {
    return (
      <YladaAreaShell areaCodigo={areaCodigo} areaLabel={areaLabel}>
        <div className="max-w-xl mx-auto py-8">
          {loading ? (
            <p className="text-sm text-gray-500">Carregando...</p>
          ) : (
            <div>
              <p className="text-sm text-red-600 mb-4">{message?.text}</p>
              <Link href={linksPath} className="text-sm text-sky-600 hover:underline">
                ← Voltar aos links
              </Link>
            </div>
          )}
        </div>
      </YladaAreaShell>
    )
  }

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
  const previewUrl = link.url ?? `${baseUrl}/l/${link.slug}`
  const tituloLink = link.title ?? link.config_json?.title ?? link.config_json?.page?.title ?? 'Diagnóstico'
  const respostas = link.stats?.diagnosis_count ?? link.stats?.complete ?? 0
  const metaSugerida = 20

  return (
    <YladaAreaShell areaCodigo={areaCodigo} areaLabel={areaLabel}>
      <div className="max-w-xl mx-auto space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link href={linksPath} className="text-sm text-sky-600 hover:underline flex items-center gap-1">
            <span>←</span> Voltar aos links
          </Link>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 justify-end">
            <button
              type="button"
              onClick={() => setShowCompartilhar(true)}
              className="text-sm font-medium text-emerald-700 hover:text-emerald-900 hover:underline"
            >
              Compartilhar link
            </button>
            <a
              href={previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-sky-600 hover:underline"
            >
              Ver como visitante →
            </a>
          </div>
        </div>

        <div className="rounded-xl border border-sky-100 bg-sky-50/50 p-4 text-sm text-gray-700">
          <p className="font-medium text-gray-900 mb-1">Personalize se quiser</p>
          <p>
            Se o quiz já combina com você, pode salvar e usar assim mesmo. Quiser mudar título ou perguntas, edite abaixo —{' '}
            <span className="text-gray-600">é isso que seu paciente ou cliente vê no link.</span>
          </p>
        </div>

        <h1 className="text-lg font-bold text-gray-900">Editar quiz</h1>
        <p className="text-sm text-gray-600">
          Toque em qualquer pergunta para abrir e editar o texto e as opções.
        </p>

        {message && (
          <div
            className={`p-3 rounded-lg text-sm ${
              message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Preview editável — Título */}
        <div className="bg-white rounded-2xl border border-sky-100 shadow-sm p-5 sm:p-6">
          <label className="block text-[10px] font-semibold uppercase tracking-wider text-sky-600 mb-2">
            Título (o que aparece na primeira tela)
          </label>
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full text-lg font-bold text-gray-900 bg-transparent border-b-2 border-transparent hover:border-sky-200 focus:border-sky-500 focus:outline-none py-1 transition-colors"
            placeholder="Ex.: Perda de peso e emagrecimento"
          />
        </div>

        {/* Preview editável — Perguntas */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-gray-800">Perguntas do quiz</h2>

          {editFields.length === 0 ? (
            <button
              type="button"
              onClick={() => addQuestionAt(0)}
              className="w-full py-8 rounded-2xl border-2 border-dashed border-gray-200 text-gray-500 hover:border-sky-300 hover:text-sky-600 hover:bg-sky-50/50 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Adicionar primeira pergunta
            </button>
          ) : (
            <>
              {editFields.map((field, i) => (
            <div key={`block-${i}`} className="space-y-2">
              <button
                type="button"
                onClick={() => addQuestionAt(i)}
                className="w-full py-2 rounded-lg border border-dashed border-gray-200 text-gray-400 hover:border-sky-300 hover:text-sky-600 hover:bg-sky-50/30 transition-colors flex items-center justify-center gap-1.5 text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Nova pergunta aqui
              </button>
            <div
              key={`${field.id}-${i}`}
              className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all ${
                editingFieldIndex === i ? 'border-sky-400 ring-2 ring-sky-100' : 'border-gray-100 hover:border-sky-200'
              }`}
            >
              <div className="flex items-start gap-2">
                {editingFieldIndex !== i && (
                <button
                  type="button"
                  onClick={() => setEditingFieldIndex(i)}
                  className="flex-1 text-left p-5 sm:p-6 min-w-0"
                >
                <span className="text-[10px] font-semibold uppercase tracking-wider text-sky-600">
                  Pergunta {i + 1}
                </span>
                <p className="mt-1 text-base font-medium text-gray-900">{field.label || '(sem texto)'}</p>
                {Array.isArray(field.options) && field.options.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {field.options.map((opt, j) => (
                      <div
                        key={j}
                        className="flex items-center gap-3 py-2 px-3 rounded-lg border border-gray-100 bg-gray-50/50"
                      >
                        <span className="flex-shrink-0 w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center text-xs font-medium text-gray-600">
                          {String.fromCharCode(65 + j)}
                        </span>
                        <span className="text-sm text-gray-700">{opt || '(vazio)'}</span>
                      </div>
                    ))}
                  </div>
                )}
                </button>
                )}
                {editFields.length > 1 && (
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); removeQuestion(i) }}
                    className="p-3 text-red-600 hover:bg-red-50 rounded-lg shrink-0"
                    title="Excluir pergunta"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
              {editingFieldIndex === i && (
                <div className="border-t border-gray-100 p-5 sm:p-6 bg-sky-50/30 space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-sky-600">Pergunta {i + 1}</span>
                    <button type="button" onClick={() => setEditingFieldIndex(null)} className="text-xs text-gray-500 hover:text-gray-700">Fechar</button>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Texto da pergunta</label>
                    <input
                      type="text"
                      value={field.label}
                      onChange={(e) => updateField(i, { label: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium"
                      placeholder="Texto da pergunta"
                    />
                  </div>
                  {Array.isArray(field.options) && (
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">Opções (como no quiz)</label>
                      <div className="space-y-3">
                        {field.options.map((opt, j) => (
                          <div key={j} className="flex items-center gap-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-sky-300 bg-sky-50 flex items-center justify-center text-xs font-semibold text-sky-700">
                              {String.fromCharCode(65 + j)}
                            </span>
                            <input
                              type="text"
                              value={opt}
                              onChange={(e) => updateOption(i, j, e.target.value)}
                              className="flex-1 rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
                              placeholder={`Texto da opção ${String.fromCharCode(65 + j)}`}
                            />
                            <button
                              type="button"
                              onClick={() => removeOption(i, j)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg shrink-0"
                              aria-label="Remover opção"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => addOption(i)}
                          className="text-sm text-sky-600 hover:text-sky-800 font-medium flex items-center gap-1.5"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          Adicionar opção
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            </div>
          ))}
              <button
                type="button"
                onClick={() => addQuestionAt(editFields.length)}
                className="w-full py-2 rounded-lg border border-dashed border-gray-200 text-gray-400 hover:border-sky-300 hover:text-sky-600 hover:bg-sky-50/30 transition-colors flex items-center justify-center gap-1.5 text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Nova pergunta ao final
              </button>
            </>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-3 px-4 rounded-xl bg-sky-600 text-white font-medium hover:bg-sky-700 disabled:opacity-50 transition-colors"
          >
            {saving ? 'Salvando...' : 'Salvar alterações'}
          </button>
          <a
            href={previewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3 px-4 rounded-xl bg-gray-100 text-gray-800 font-medium hover:bg-gray-200 text-center transition-colors"
          >
            Ver preview
          </a>
        </div>

        <div className="rounded-xl border border-gray-200 bg-gray-50/80 p-4 sm:p-5 space-y-3">
          <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <span aria-hidden>📊</span> Respostas e divulgação
          </h2>
          {respostas > 0 ? (
            <>
              <p className="text-sm text-gray-800">
                <span className="font-semibold text-emerald-800">{respostas}</span>{' '}
                {respostas === 1 ? 'pessoa já respondeu' : 'pessoas já responderam'} a este diagnóstico.
              </p>
              <p className="text-xs text-gray-600">
                Meta sugerida: {metaSugerida} respostas. Continue usando o mesmo link para somar mais respostas.
              </p>
            </>
          ) : (
            <p className="text-sm text-gray-600">
              Quando terminar de editar e salvar, use o botão abaixo para copiar mensagens e divulgar. As respostas aparecem aqui depois que as pessoas começarem a responder.
            </p>
          )}
          <button
            type="button"
            onClick={() => setShowCompartilhar(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Compartilhar diagnóstico
          </button>
        </div>
      </div>

      {showCompartilhar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" aria-modal="true" role="dialog" onClick={() => setShowCompartilhar(false)}>
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 w-full max-w-lg max-h-[90vh] overflow-y-auto p-5" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Compartilhar diagnóstico</h3>
            <p className="text-xs text-gray-600 mb-4">{tituloLink}</p>
            <CompartilharDiagnosticoContent
              titulo={tituloLink}
              url={previewUrl}
              nomeProfissional={userProfile?.nome_completo ?? 'Profissional'}
              contador={respostas}
            />
            <button type="button" onClick={() => setShowCompartilhar(false)} className="mt-4 w-full py-2 text-sm text-gray-500 hover:text-gray-700">
              Fechar
            </button>
          </div>
        </div>
      )}
    </YladaAreaShell>
  )
}
