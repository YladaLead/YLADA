'use client'

import { useState, useEffect, useRef } from 'react'
import YladaAreaShell from '@/components/ylada/YladaAreaShell'

/** Objetivos do link: norte para a sugestão (quiz vs calculadora e texto). */
const LINK_OBJECTIVES = [
  { value: 'captar', label: 'Captar', description: 'Trazer pessoas novas (possíveis pacientes ou clientes)' },
  { value: 'educar', label: 'Educar', description: 'Informar e explicar tema da sua especialidade' },
  { value: 'reter', label: 'Reter', description: 'Manter engajamento de quem já é paciente ou cliente' },
  { value: 'propagar', label: 'Propagar', description: 'Fazer a pessoa compartilhar com outras' },
  { value: 'indicar', label: 'Indicar', description: 'Gerar indicações (quem responde indica alguém)' },
] as const

type LinkObjectiveValue = (typeof LINK_OBJECTIVES)[number]['value']

/** Tamanho: menos (rápido) / padrão / mais (completo). */
const TAMANHO_OPTIONS = [
  { value: 'menos', label: 'Menos (mais rápido)' },
  { value: 'padrao', label: 'Padrão' },
  { value: 'mais', label: 'Mais (mais completo)' },
] as const

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

/** Nomes amigáveis para exibir no select — foco no que o visitante (possível paciente) vê. */
const TEMPLATE_DISPLAY_NAMES: Record<string, string> = {
  diagnostico_agenda: 'Quiz: tema da sua especialidade para atrair possíveis pacientes',
  calculadora_perda: 'Calculadora: resultado/insight para quem acessa (atrai e engaja)',
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

/** Títulos das sugestões: o que você (profissional) quer mostrar para seus pacientes. */
const SUGGESTION_TITLE_BY_PROFILE: Record<string, string> = {
  liberal: 'Ideias de conteúdo para você usar com seus pacientes',
  vendas: 'Ideias de conteúdo para você usar com seus clientes',
}

/** Rótulos amigáveis de perfil/categoria para exibir ao usuário (sem jargão técnico). */
const PROFILE_LABELS: Record<string, string> = {
  medicina: 'médico',
  medico: 'médico',
  nutricao: 'nutricionista',
  nutricionista: 'nutricionista',
  odontologia: 'dentista',
  odonto: 'dentista',
  psicologia: 'psicólogo',
  psi: 'psicólogo',
  coaching: 'coach',
  coach: 'coach',
  nutra: 'vendas (Nutra)',
  vendas: 'vendas',
  liberal: 'atendimento (consultório/clínica)',
}

function getFriendlyProfileLabel(profileSuggest: Record<string, string>): string {
  const cat = (profileSuggest?.category ?? '').toLowerCase().trim()
  const prof = (profileSuggest?.profession ?? '').toLowerCase().trim()
  if (PROFILE_LABELS[cat]) return PROFILE_LABELS[cat]
  if (PROFILE_LABELS[prof]) return PROFILE_LABELS[prof]
  if (cat) return cat
  if (prof) return prof
  return 'seu perfil'
}

/** Frase "por quê" da sugestão conforme objetivo e tipo (quiz/calculadora). */
function getSuggestionReason(objective: LinkObjectiveValue, isQuiz: boolean): string {
  const o = objective || 'captar'
  if (isQuiz) {
    if (o === 'captar') return 'Para captar pessoas que ainda não te conhecem: seu paciente responde algumas perguntas sobre um tema da sua especialidade, vê um resultado e pode falar com você no WhatsApp.'
    if (o === 'educar') return 'Para educar quem já te acompanha: um quiz que informa e gera curiosidade, e no final direciona para você.'
    if (o === 'reter') return 'Para reter e engajar quem já é seu paciente ou cliente: conteúdo que mantém o vínculo e abre espaço para conversa.'
    if (o === 'propagar') return 'Para que a pessoa queira compartilhar: resultado que gera identificação e incentiva divulgar para outras.'
    if (o === 'indicar') return 'Para gerar indicações: o visitante responde, vê o resultado e pode indicar alguém ou falar com você.'
  } else {
    if (o === 'captar') return 'Para captar: a pessoa preenche dados, vê um resultado ou insight (ex.: potencial) e pode falar com você no WhatsApp.'
    if (o === 'educar') return 'Para educar: uma calculadora que mostra um resultado útil e informa, gerando curiosidade para conversar com você.'
    if (o === 'reter') return 'Para reter: ferramenta que engaja quem já é seu paciente ou cliente e mantém o contato.'
    if (o === 'propagar') return 'Para propagar: resultado que a pessoa pode compartilhar ou comentar com outras.'
    if (o === 'indicar') return 'Para indicar: resultado que motiva a pessoa a indicar alguém ou falar com você.'
  }
  return 'O conteúdo atrai e desperta curiosidade; no final seu paciente pode falar com você no WhatsApp.'
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
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [linkObjective, setLinkObjective] = useState<LinkObjectiveValue>('captar')
  const [tamanho, setTamanho] = useState<'menos' | 'padrao' | 'mais'>('padrao')
  const createLinkSectionRef = useRef<HTMLDivElement>(null)
  const suggestionBoxRef = useRef<HTMLDivElement>(null)

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
      if (tJson?.success && Array.isArray(tJson.data)) {
        setTemplates(tJson.data)
      } else {
        setTemplates([])
        const err = tJson?.error || (tRes.ok ? '' : 'Resposta inválida')
        if (err) {
          const isProfileError = /criar perfil|perfil não encontrado|não permitido na tabela/i.test(err)
          const text = isProfileError ? err : `Templates: ${err}. Verifique se as migrations (ylada_link_templates) foram aplicadas no banco.`
          setMessage({ type: 'error', text: tJson?.technical ? `${text} ${tJson.technical}` : text })
        }
      }
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
    } catch (e) {
      setMessage({ type: 'error', text: 'Não foi possível carregar. Verifique sua conexão e tente recarregar a página.' })
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

  const handleDeleteLink = async (link: LinkRow) => {
    if (!confirm(`Excluir o link "${link.title || link.slug}"? Esta ação não pode ser desfeita.`)) return
    setDeletingId(link.id)
    setMessage(null)
    try {
      const res = await fetch(`/api/ylada/links/${link.id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      const json = await res.json()
      if (json?.success) {
        setLinks((prev) => prev.filter((l) => l.id !== link.id))
        setMessage({ type: 'success', text: 'Link excluído.' })
      } else {
        setMessage({ type: 'error', text: json?.error || 'Erro ao excluir.' })
      }
    } catch {
      setMessage({ type: 'error', text: 'Erro ao excluir. Tente novamente.' })
    } finally {
      setDeletingId(null)
    }
  }

  const handleInterpret = async (variation = false) => {
    if (!interpretText.trim()) {
      setMessage({ type: 'error', text: 'Digite ou escolha uma opção acima para continuar.' })
      return
    }
    if (templates.length === 0) {
      setMessage({ type: 'error', text: 'Não há templates disponíveis. É preciso popular a tabela de templates no banco (migrations) antes de usar a sugestão.' })
      return
    }
    setInterpreting(true)
    if (!variation) setInterpretResult(null)
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
          objective: linkObjective,
          variation,
          previous_template_id: variation && interpretResult?.recommendedTemplateId ? interpretResult.recommendedTemplateId : undefined,
        }),
      })
      const json = await res.json()
      if (json?.success && json?.data) {
        setInterpretResult(json.data)
        if (json.data.recommendedTemplateId) {
          setSelectedTemplateId(json.data.recommendedTemplateId)
        }
        setTimeout(() => suggestionBoxRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100)
      } else {
        const errMsg = json?.error || (res.status === 503 ? 'Serviço temporariamente indisponível.' : 'Erro ao processar.')
        setMessage({ type: 'error', text: errMsg })
      }
    } catch (e) {
      setMessage({ type: 'error', text: 'Erro de conexão. Verifique a internet e tente novamente.' })
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
            Aqui você cria links para <strong>compartilhar com seus pacientes ou possíveis pacientes</strong>. Quando <strong>eles</strong> acessam, veem um quiz ou uma calculadora — conteúdo que atrai e desperta curiosidade. No final, podem falar com você no WhatsApp.
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Você escolhe o tipo de ferramenta; a plataforma entrega o link pronto. Basta você gerar e <strong>enviar para as pessoas que você quer atingir</strong>.
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
          <h2 className="text-sm font-semibold text-gray-700 mb-2">Para que você quer usar este link com seus pacientes?</h2>
          <p className="text-xs text-gray-500 mb-3">
            Qual é o <strong>objetivo principal</strong> deste link? Isso nos ajuda a sugerir a melhor opção (quiz ou calculadora) para você.
          </p>
          <div className="flex flex-wrap gap-2 mb-3">
            {LINK_OBJECTIVES.map((obj) => (
              <button
                key={obj.value}
                type="button"
                onClick={() => setLinkObjective(obj.value)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium border transition-colors ${
                  linkObjective === obj.value
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                }`}
                title={obj.description}
              >
                {obj.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mb-2">
            Em uma frase: que tipo de conteúdo você quer que <strong>seu paciente</strong> veja quando acessar o link? Clique numa sugestão abaixo ou escreva.
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
              placeholder="Ex: Quiz sobre um tema da minha especialidade que atrai possíveis pacientes"
              value={interpretText}
              onChange={(e) => setInterpretText(e.target.value)}
              className="min-h-[80px] w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              rows={3}
            />
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => handleInterpret()}
                disabled={interpreting || templates.length === 0}
                className="self-start rounded-lg bg-gray-700 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
                title={templates.length === 0 ? 'Carregue os templates primeiro (migrations no banco).' : undefined}
              >
                {interpreting ? 'Avançando...' : 'Avançar'}
              </button>
              {templates.length === 0 && (
                <p className="text-xs text-amber-700 bg-amber-50 rounded px-2 py-1 self-start">
                  Para a sugestão funcionar, é preciso ter templates no banco (migrations 207, 208, 218).
                </p>
              )}
            </div>
          </div>
          {interpretResult && (() => {
            const isQuiz = interpretResult.recommendedTemplateName === 'diagnostico_agenda'
            const toolLabel = isQuiz ? 'quiz' : 'calculadora'
            const reason = getSuggestionReason(linkObjective, isQuiz)
            return (
              <div ref={suggestionBoxRef} className="mb-4 p-4 rounded-lg bg-blue-50 border border-blue-100 text-sm space-y-3">
                <p className="font-semibold text-gray-900">É isso que vamos criar para você</p>
                <p className="text-gray-700">
                  Sugerimos um <strong>{toolLabel}</strong> para você usar com seus pacientes. Com base no seu perfil ({getFriendlyProfileLabel(interpretResult.profileSuggest)}) e no objetivo <strong>{LINK_OBJECTIVES.find((o) => o.value === linkObjective)?.label ?? linkObjective}</strong>.
                </p>
                <p className="text-gray-700 italic">&ldquo;{reason}&rdquo;</p>
                {interpretResult.diagnosticSummary && (
                  <p className="text-gray-700">
                    <span className="font-medium text-gray-800">O que seu paciente vai ver ao acessar o link:</span>{' '}
                    {interpretResult.diagnosticSummary}
                  </p>
                )}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-xs font-medium text-gray-600">Tamanho:</span>
                  {TAMANHO_OPTIONS.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => setTamanho(t.value)}
                      className={`rounded-full px-2.5 py-1 text-xs font-medium border transition-colors ${
                        tamanho === t.value ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2 pt-2 border-t border-blue-100">
                  <button
                    type="button"
                    onClick={() => createLinkSectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    Gostei, gerar link
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInterpret(true)}
                    disabled={interpreting}
                    className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
                  >
                    {interpreting ? 'Buscando...' : 'Quero outra ideia'}
                  </button>
                </div>
              </div>
            )
          })()}
        </section>

        <section ref={createLinkSectionRef} className="bg-white rounded-lg border border-gray-200 p-4">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Criar novo link</h2>
          {interpretResult && (
            <p className="text-sm text-blue-700 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2 mb-3">
              Sugestão da etapa anterior: <strong>{interpretResult.recommendedTemplateName === 'diagnostico_agenda' ? 'Quiz' : 'Calculadora'}</strong>. O tipo já está selecionado abaixo. Clique em <strong>Gerar link</strong> para criar.
            </p>
          )}
          <p className="text-xs text-gray-500 mb-3">
            Escolha se você quer um <strong>quiz</strong> ou uma <strong>calculadora</strong>. O conteúdo será exibido <strong>para quem você enviar o link</strong> (seus possíveis pacientes ou clientes). Depois é só gerar o link e enviar para eles.
          </p>
          {loading ? (
            <p className="text-gray-500 text-sm">Carregando...</p>
          ) : templates.length === 0 ? (
            <p className="text-gray-500 text-sm">
              Nenhum template disponível. A tabela <code className="text-xs bg-gray-100 px-1 rounded">ylada_link_templates</code> precisa estar populada (rode as migrations 208 e 218 no Supabase).
            </p>
          ) : (
            <div className="flex flex-wrap items-center gap-3">
              <select
                className="rounded-md border border-gray-300 px-3 py-2 text-sm min-w-[280px]"
                value={selectedTemplateId}
                onChange={(e) => setSelectedTemplateId(e.target.value)}
              >
                <option value="">Qual tipo de link você quer enviar para seus pacientes?</option>
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
            <p className="text-gray-500 text-sm">Você ainda não criou nenhum link. Crie acima e depois envie o link para seus pacientes ou possíveis pacientes.</p>
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
                        <button
                          type="button"
                          onClick={() => handleDeleteLink(link)}
                          disabled={deletingId === link.id}
                          className="rounded px-2 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                          title="Excluir link (para testes)"
                        >
                          {deletingId === link.id ? 'Excluindo...' : 'Excluir'}
                        </button>
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
                  <label className="block text-xs font-medium text-gray-700 mb-1">Título (o que seu paciente vê ao abrir o link)</label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    placeholder="Ex: Avaliação sobre um tema da sua especialidade"
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
