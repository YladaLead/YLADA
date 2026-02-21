'use client'

import { useState, useEffect } from 'react'
import YladaAreaShell from '@/components/ylada/YladaAreaShell'

type Template = { id: string; name: string; type: string; version: number; suggested_prompts?: string[] }
type LinkStats = { view: number; start: number; complete: number; cta_click: number }
type LinkRow = {
  id: string
  slug: string
  title: string | null
  status: string
  cta_whatsapp?: string | null
  created_at: string
  url: string
  template_name?: string | null
  template_type?: string | null
  stats?: LinkStats
}

/** Preferência por tipo de template conforme perfil: liberal → diagnostico/quiz, vendas → calculator. */
const TEMPLATE_TYPE_BY_PROFILE: Record<string, string[]> = {
  liberal: ['diagnostico', 'quiz', 'triagem'],
  vendas: ['calculator'],
}

/** Nomes amigáveis para exibir no select (em vez do name técnico do banco). */
const TEMPLATE_DISPLAY_NAMES: Record<string, string> = {
  diagnostico_agenda: 'Quiz: qualificar quem quer agendar',
  calculadora_perda: 'Calculadora: quanto a pessoa está deixando de faturar',
}

function getTemplateDisplayName(t: Template): string {
  return TEMPLATE_DISPLAY_NAMES[t.name] ?? t.name
}

/** Separa sugestões em "para sua atuação" (conforme perfil) e "outras opções". */
function buildSuggestionsByProfile(
  templates: Template[],
  profileType: string | null | undefined
): { forProfile: { phrase: string; templateId: string }[]; others: { phrase: string; templateId: string }[] } {
  const all: { phrase: string; templateId: string }[] = []
  for (const t of templates) {
    const prompts = Array.isArray(t.suggested_prompts) ? t.suggested_prompts : []
    for (const p of prompts) {
      if (typeof p === 'string' && p.trim()) all.push({ phrase: p.trim(), templateId: t.id })
    }
  }
  if (!profileType) {
    return { forProfile: all, others: [] }
  }
  const preferredTypes = TEMPLATE_TYPE_BY_PROFILE[profileType]
  if (!preferredTypes?.length) return { forProfile: all, others: [] }
  const templateById = new Map(templates.map((t) => [t.id, t]))
  const forProfile = all.filter((s) => {
    const type = templateById.get(s.templateId)?.type ?? ''
    return preferredTypes.includes(type)
  })
  const others = all.filter((s) => {
    const type = templateById.get(s.templateId)?.type ?? ''
    return !preferredTypes.includes(type)
  })
  return { forProfile, others }
}

/** Títulos das sugestões conforme perfil (para ficar claro para o profissional). */
const SUGGESTION_TITLE_BY_PROFILE: Record<string, string> = {
  liberal: 'Para quem atende clientes (consultório, clínica)',
  vendas: 'Para quem vende produtos ou serviços',
}

export default function MatrixLinksPage() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [links, setLinks] = useState<LinkRow[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [selectedTemplateId, setSelectedTemplateId] = useState('')
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [interpretText, setInterpretText] = useState('')
  const [interpreting, setInterpreting] = useState(false)
  const [interpretResult, setInterpretResult] = useState<{
    profileSuggest: Record<string, string>
    recommendedTemplateId: string | null
    recommendedTemplateName?: string
    diagnosticSummary?: string | null
    confidence: number
  } | null>(null)
  const [editingLink, setEditingLink] = useState<LinkRow | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editCtaWhatsapp, setEditCtaWhatsapp] = useState('')
  const [savingEdit, setSavingEdit] = useState(false)
  const [profile, setProfile] = useState<{ profile_type?: string | null; profession?: string | null } | null>(null)

  const segment = 'ylada'

  const loadTemplatesAndLinks = async () => {
    setLoading(true)
    setMessage(null)
    try {
      const [tRes, lRes, pRes] = await Promise.all([
        fetch('/api/ylada/templates', { credentials: 'include' }),
        fetch('/api/ylada/links', { credentials: 'include' }),
        fetch(`/api/ylada/profile?segment=${encodeURIComponent(segment)}`, { credentials: 'include' }),
      ])
      const tJson = await tRes.json()
      const lJson = await lRes.json()
      const pJson = await pRes.json()
      if (tJson?.success && Array.isArray(tJson.data)) setTemplates(tJson.data)
      if (lJson?.success && Array.isArray(lJson.data)) setLinks(lJson.data)
      if (pJson?.success && pJson.data?.profile) {
        const p = pJson.data.profile as Record<string, unknown>
        setProfile({
          profile_type: typeof p.profile_type === 'string' ? p.profile_type : null,
          profession: typeof p.profession === 'string' ? p.profession : null,
        })
      } else {
        setProfile(null)
      }
    } catch {
      setMessage({ type: 'error', text: 'Não foi possível carregar.' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTemplatesAndLinks()
  }, [])

  const handleCreateLink = async () => {
    if (!selectedTemplateId) {
      setMessage({ type: 'error', text: 'Escolha um template.' })
      return
    }
    setCreating(true)
    setMessage(null)
    try {
      const res = await fetch('/api/ylada/links/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ template_id: selectedTemplateId }),
      })
      const json = await res.json()
      if (json?.success && json?.data) {
        const base = typeof window !== 'undefined' ? window.location.origin : ''
        const url = json.data.url || `${base}/l/${json.data.slug}`
        const template = templates.find((t) => t.id === selectedTemplateId)
        setLinks((prev) => [
          {
            ...json.data,
            url,
            template_name: template?.name ?? null,
            template_type: template?.type ?? null,
            stats: { view: 0, start: 0, complete: 0, cta_click: 0 },
          },
          ...prev,
        ])
        setMessage({ type: 'success', text: `Link criado: ${url}` })
        setSelectedTemplateId('')
      } else {
        setMessage({ type: 'error', text: json?.error || 'Erro ao criar link.' })
      }
    } catch {
      setMessage({ type: 'error', text: 'Erro ao criar link. Tente novamente.' })
    } finally {
      setCreating(false)
    }
  }

  const copyUrl = (url: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(url)
      setMessage({ type: 'success', text: 'URL copiada!' })
    }
  }

  const openEditModal = (link: LinkRow) => {
    setEditingLink(link)
    setEditTitle(link.title ?? '')
    setEditCtaWhatsapp(link.cta_whatsapp ?? '')
    setMessage(null)
  }

  const closeEditModal = () => {
    setEditingLink(null)
    setEditTitle('')
    setEditCtaWhatsapp('')
  }

  const handleSaveEdit = async () => {
    if (!editingLink) return
    setSavingEdit(true)
    setMessage(null)
    try {
      const res = await fetch(`/api/ylada/links/${editingLink.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          title: editTitle.trim() || null,
          cta_whatsapp: editCtaWhatsapp.trim() || null,
        }),
      })
      const json = await res.json()
      if (json?.success) {
        setLinks((prev) =>
          prev.map((l) =>
            l.id === editingLink.id
              ? { ...l, title: editTitle.trim() || l.title, cta_whatsapp: editCtaWhatsapp.trim() || null }
              : l
          )
        )
        setMessage({ type: 'success', text: 'Link atualizado.' })
        closeEditModal()
      } else {
        setMessage({ type: 'error', text: json?.error || 'Erro ao atualizar.' })
      }
    } catch {
      setMessage({ type: 'error', text: 'Erro ao atualizar. Tente novamente.' })
    } finally {
      setSavingEdit(false)
    }
  }

  const handleUpdateStatus = async (linkId: string, newStatus: string) => {
    setMessage(null)
    try {
      const res = await fetch(`/api/ylada/links/${linkId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus }),
      })
      const json = await res.json()
      if (json?.success) {
        setLinks((prev) => prev.map((l) => (l.id === linkId ? { ...l, status: newStatus } : l)))
        setMessage({ type: 'success', text: newStatus === 'active' ? 'Link ativado.' : newStatus === 'paused' ? 'Link pausado.' : 'Link arquivado.' })
      } else {
        setMessage({ type: 'error', text: json?.error || 'Erro ao atualizar.' })
      }
    } catch {
      setMessage({ type: 'error', text: 'Erro ao atualizar. Tente novamente.' })
    }
  }

  const handleInterpret = async () => {
    if (!interpretText.trim()) {
      setMessage({ type: 'error', text: 'Digite um texto para interpretar.' })
      return
    }
    setInterpreting(true)
    setInterpretResult(null)
    setMessage(null)
    try {
      const res = await fetch('/api/ylada/interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          text: interpretText.trim(),
          profile_type: profile?.profile_type ?? undefined,
          profession: profile?.profession ?? undefined,
        }),
      })
      const json = await res.json()
      if (json?.success && json?.data) {
        setInterpretResult(json.data)
        if (json.data.recommendedTemplateId) {
          setSelectedTemplateId(json.data.recommendedTemplateId)
        }
      } else {
        setMessage({ type: 'error', text: json?.error || 'Erro ao interpretar.' })
      }
    } catch {
      setMessage({ type: 'error', text: 'Erro ao interpretar. Tente novamente.' })
    } finally {
      setInterpreting(false)
    }
  }

  return (
    <YladaAreaShell areaCodigo="ylada" areaLabel="YLADA">
      <div className="max-w-2xl space-y-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Links inteligentes</h1>
          <p className="text-gray-600 mb-2">
            Crie ferramentas (quiz, calculadora) para compartilhar com seus possíveis clientes ou pacientes — eles preenchem, veem um resultado e podem falar com você no WhatsApp.
          </p>
          <p className="text-xs text-gray-500 mt-1">
            O conteúdo do quiz e da calculadora é <strong>oficial da plataforma</strong> (definido pelos templates). Você só gera o link para compartilhar.
          </p>
        </div>

        {message && (
          <div
            className={`p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}
          >
            {message.text}
          </div>
        )}

        <section className="bg-white rounded-lg border border-gray-200 p-4">
          <h2 className="text-sm font-semibold text-gray-700 mb-2">Para que você quer usar este link?</h2>
          <p className="text-xs text-gray-500 mb-3">
            {profile?.profile_type
              ? 'Clique numa sugestão da sua área ou descreva com suas palavras. O link será um quiz ou uma calculadora pronta da plataforma.'
              : 'Escolha uma sugestão abaixo ou descreva como quer engajar. O template já define o conteúdo oficial (quiz ou calculadora).'}
          </p>
          {templates.length > 0 && (() => {
            const { forProfile, others } = buildSuggestionsByProfile(templates, profile?.profile_type)
            const hasAny = forProfile.length > 0 || others.length > 0
            if (!hasAny) return null
            const suggestionChip = (s: { phrase: string; templateId: string }) => (
              <button
                key={`${s.templateId}-${s.phrase.slice(0, 24)}`}
                type="button"
                onClick={() => {
                  setInterpretText(s.phrase)
                  setSelectedTemplateId(s.templateId)
                  setInterpretResult(null)
                  setMessage(null)
                }}
                className="rounded-full px-3 py-1.5 text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200 transition-colors"
              >
                {s.phrase}
              </button>
            )
            return (
              <div className="mb-3 space-y-3">
                {profile?.profile_type && forProfile.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-gray-700 mb-2">
                      {SUGGESTION_TITLE_BY_PROFILE[profile.profile_type] ?? 'Sugestões para sua atuação'}
                    </p>
                    <div className="flex flex-wrap gap-2">{forProfile.map(suggestionChip)}</div>
                  </div>
                )}
                {others.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-gray-600 mb-2">
                      {profile?.profile_type ? 'Outras opções' : 'Sugestões (clique para usar)'}
                    </p>
                    <div className="flex flex-wrap gap-2">{others.map(suggestionChip)}</div>
                  </div>
                )}
                {!profile?.profile_type && forProfile.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-gray-600 mb-2">Sugestões (clique para usar)</p>
                    <div className="flex flex-wrap gap-2">{forProfile.map(suggestionChip)}</div>
                  </div>
                )}
              </div>
            )
          })()}
          <div className="flex flex-col gap-2 mb-4">
            <textarea
              placeholder="Ex: Quero um quiz para qualificar quem tem interesse em agendar comigo"
              value={interpretText}
              onChange={(e) => setInterpretText(e.target.value)}
              className="min-h-[80px] w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              rows={3}
            />
            <button
              type="button"
              onClick={handleInterpret}
              disabled={interpreting}
              className="self-start rounded-lg bg-gray-700 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
            >
              {interpreting ? 'Interpretando...' : 'Interpretar'}
            </button>
          </div>
          {interpretResult && (
            <div className="mb-4 p-3 rounded-lg bg-gray-50 border border-gray-200 text-sm space-y-2">
              <p className="font-medium text-gray-700">Sugestão (processo reverso — apenas valide):</p>
              <p className="text-gray-600">
                Perfil: {Object.entries(interpretResult.profileSuggest)
                  .filter(([, v]) => v)
                  .map(([k, v]) => `${k}=${v}`)
                  .join(', ') || '—'}
              </p>
              <p className="text-gray-600">
                Template: {interpretResult.recommendedTemplateName || interpretResult.recommendedTemplateId || '—'} (confiança: {(interpretResult.confidence * 100).toFixed(0)}%)
              </p>
              {interpretResult.diagnosticSummary && (
                <>
                  <p className="font-medium text-gray-700 mt-2">Diagnóstico (conteúdo oficial deste link):</p>
                  <p className="text-gray-600 italic">{interpretResult.diagnosticSummary}</p>
                  <p className="text-xs text-gray-500 mt-1">Se estiver de acordo, use &quot;Gerar link&quot; abaixo para criar o link e compartilhar.</p>
                </>
              )}
            </div>
          )}
        </section>

        <section className="bg-white rounded-lg border border-gray-200 p-4">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Criar novo link</h2>
          <p className="text-xs text-gray-500 mb-3">
            Escolha o tipo de ferramenta que você quer compartilhar: um <strong>quiz</strong> para qualificar quem quer agendar ou uma <strong>calculadora</strong> de potencial. Depois é só gerar o link e enviar para seus clientes ou pacientes.
          </p>
          {loading ? (
            <p className="text-gray-500 text-sm">Carregando...</p>
          ) : templates.length === 0 ? (
            <p className="text-gray-500 text-sm">Nenhum template disponível.</p>
          ) : (
            <div className="flex flex-wrap items-center gap-3">
              <select
                className="rounded-md border border-gray-300 px-3 py-2 text-sm min-w-[280px]"
                value={selectedTemplateId}
                onChange={(e) => setSelectedTemplateId(e.target.value)}
              >
                <option value="">Qual tipo de ferramenta?</option>
                {(() => {
                  const preferredTypes = profile?.profile_type ? TEMPLATE_TYPE_BY_PROFILE[profile.profile_type] : null
                  const sorted = preferredTypes?.length
                    ? [...templates].sort((a, b) => {
                        const matchA = preferredTypes.includes(a.type) ? 1 : 0
                        const matchB = preferredTypes.includes(b.type) ? 1 : 0
                        return matchB - matchA
                      })
                    : templates
                  return sorted.map((t) => (
                    <option key={t.id} value={t.id}>
                      {getTemplateDisplayName(t)}
                    </option>
                  ))
                })()}
              </select>
              <button
                type="button"
                onClick={handleCreateLink}
                disabled={creating || !selectedTemplateId}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {creating ? 'Criando...' : 'Gerar link'}
              </button>
            </div>
          )}
        </section>

        <section className="bg-white rounded-lg border border-gray-200 p-4">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Seus links</h2>
          {links.length === 0 ? (
            <p className="text-gray-500 text-sm">Você ainda não criou nenhum link. Use o bloco acima para criar.</p>
          ) : (
            <ul className="space-y-4">
              {links.map((link) => {
                const stats = link.stats ?? { view: 0, start: 0, complete: 0, cta_click: 0 }
                const isActive = link.status === 'active'
                return (
                  <li key={link.id} className="py-3 border-b border-gray-100 last:border-0 last:pb-0">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <p className="text-sm font-medium text-gray-900 truncate">{link.title || link.slug}</p>
                          <span
                            className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                              link.status === 'active'
                                ? 'bg-green-100 text-green-800'
                                : link.status === 'paused'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {link.status === 'active' ? 'Ativo' : link.status === 'paused' ? 'Pausado' : 'Arquivado'}
                          </span>
                        </div>
                        {link.template_name && (
                          <p className="text-xs text-gray-500 mb-0.5">
                            Template: {link.template_name}
                            {link.template_type ? ` (${link.template_type})` : ''}
                          </p>
                        )}
                        <p className="text-xs text-gray-400 truncate">{link.url}</p>
                        <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
                          <span title="Visualizações">{stats.view} views</span>
                          <span title="Conclusões">{stats.complete} conclusões</span>
                          <span title="Cliques no WhatsApp">{stats.cta_click} cliques WhatsApp</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => openEditModal(link)}
                          className="rounded px-2 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100"
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => copyUrl(link.url)}
                          className="rounded px-2 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50"
                        >
                          Copiar URL
                        </button>
                        {isActive && (
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(link.id, 'paused')}
                            className="rounded px-2 py-1.5 text-xs font-medium text-amber-700 hover:bg-amber-50"
                          >
                            Pausar
                          </button>
                        )}
                        {link.status === 'paused' && (
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(link.id, 'active')}
                            className="rounded px-2 py-1.5 text-xs font-medium text-green-700 hover:bg-green-50"
                          >
                            Ativar
                          </button>
                        )}
                        {link.status !== 'archived' && (
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(link.id, 'archived')}
                            className="rounded px-2 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100"
                          >
                            Arquivar
                          </button>
                        )}
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </section>

        {editingLink && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            aria-modal="true"
            role="dialog"
            onClick={closeEditModal}
          >
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 w-full max-w-md p-5" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Editar link</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Título (exibido na ferramenta)</label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    placeholder="Ex: Diagnóstico da sua agenda"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">WhatsApp (número ou link)</label>
                  <input
                    type="text"
                    value={editCtaWhatsapp}
                    onChange={(e) => setEditCtaWhatsapp(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    placeholder="5511999999999 ou https://wa.me/..."
                  />
                  <p className="text-xs text-gray-500 mt-1">Número com DDD, sem espaços, ou link completo.</p>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-5">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  disabled={savingEdit}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {savingEdit ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </YladaAreaShell>
  )
}
