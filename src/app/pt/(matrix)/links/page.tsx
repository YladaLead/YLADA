'use client'

import { useState, useEffect, useRef } from 'react'
import YladaAreaShell from '@/components/ylada/YladaAreaShell'
import { getFlowById } from '@/config/ylada-flow-catalog'

/** Objetivos do link: norte para a sugestão (quiz vs calculadora e texto). */
const LINK_OBJECTIVES = [
  { value: 'captar', label: 'Captar', description: 'Trazer pessoas novas (possíveis pacientes ou clientes)' },
  { value: 'educar', label: 'Educar', description: 'Informar e explicar tema da sua especialidade' },
  { value: 'reter', label: 'Reter', description: 'Manter engajamento de quem já é paciente ou cliente' },
  { value: 'propagar', label: 'Propagar', description: 'Fazer a pessoa compartilhar com outras' },
  { value: 'indicar', label: 'Indicar', description: 'Gerar indicações (quem responde indica alguém)' },
] as const

type LinkObjectiveValue = (typeof LINK_OBJECTIVES)[number]['value']

/** Frase "Você quer X pessoas sobre {tema}" por objetivo. */
const OBJETIVO_PHRASE: Record<LinkObjectiveValue, string> = {
  captar: 'captar',
  educar: 'educar',
  reter: 'reter',
  propagar: 'propagar',
  indicar: 'indicar',
}

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

/** Rótulo do perfil a partir do contexto da página (cadastro/simulação). Preferir este para evitar eco do texto digitado na interpretação. */
function getProfileLabelFromPage(profile: { profile_type?: string | null; profession?: string | null } | null): string | null {
  if (!profile) return null
  const pt = (profile.profile_type ?? '').toLowerCase().trim()
  const pr = (profile.profession ?? '').toLowerCase().trim()
  if (PROFILE_LABELS[pt]) return PROFILE_LABELS[pt]
  if (PROFILE_LABELS[pr]) return PROFILE_LABELS[pr]
  if (pt) return pt
  if (pr) return pr
  return null
}

/** Frase de propósito da sugestão por objetivo (evita "usar com seus pacientes" quando o objetivo é Captar). */
function getSuggestionPurposePhrase(objective: LinkObjectiveValue): string {
  const o = objective || 'captar'
  switch (o) {
    case 'captar':
      return 'para captar possíveis pacientes'
    case 'educar':
      return 'para educar quem já te acompanha'
    case 'reter':
      return 'para reter e engajar seus pacientes'
    case 'propagar':
      return 'para que as pessoas queiram compartilhar'
    case 'indicar':
      return 'para gerar indicações'
    default:
      return 'para você usar com quem acessa seu link'
  }
}

export default function MatrixLinksPage() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [links, setLinks] = useState<LinkRow[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [interpretText, setInterpretText] = useState('')
  const [interpreting, setInterpreting] = useState(false)
  /** strategyCards: 1 card (slot single) quando só BLOCKER permitido; 2 cards (qualidade + volume) caso contrário. */
  const [interpretResult, setInterpretResult] = useState<{
    interpretacao?: { objetivo: LinkObjectiveValue; tema: string; tipo_publico?: string; area_profissional?: string } | null
    strategies?: [string, string]
    strategyCards?: Array<{ slot: string; flow_id: string; title: string; subtitle?: string; description?: string }>
    safe_theme?: string | null
    profileSuggest: Record<string, string>
    o_que_captar?: string | null
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
  /** Fluxo escolhido nos cards; null = ainda nos 2 cards. */
  const [selectedFlowId, setSelectedFlowId] = useState<string | null>(null)
  /** 'cards' = 2 cards, 'detail' = Tela 3, 'preview' = Tela 4. */
  const [strategyView, setStrategyView] = useState<'cards' | 'detail' | 'preview'>('cards')
  const linksListRef = useRef<HTMLDivElement>(null)
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

  // Sincronizar perfil quando a página ganha foco (ex.: usuário ativou perfil simulado em outra aba ou em Perfis para testes)
  useEffect(() => {
    const refetchProfile = () => {
      fetch(`/api/ylada/profile?segment=${encodeURIComponent(segment)}`, { credentials: 'include' })
        .then((r) => r.json())
        .then((pJson) => {
          if (pJson?.success && pJson.data?.profile) {
            const p = pJson.data.profile as Record<string, unknown>
            setProfile({
              profile_type: typeof p.profile_type === 'string' ? p.profile_type : null,
              profession: typeof p.profession === 'string' ? p.profession : null,
            })
          } else {
            setProfile(null)
          }
        })
        .catch(() => {})
    }
    const onFocus = () => refetchProfile()
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [segment])

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
      const res = await fetch(`/api/ylada/links/by-id/${editingLink.id}`, {
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
      const res = await fetch(`/api/ylada/links/by-id/${linkId}`, {
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
      const res = await fetch(`/api/ylada/links/by-id/${link.id}`, {
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
    setInterpreting(true)
    if (!variation) setInterpretResult(null)
    setMessage(null)
    try {
      // Usar perfil mais recente (inclui perfil simulado se acabou de ativar em Perfis para testes)
      let profileToSend = profile
      try {
        const pRes = await fetch(`/api/ylada/profile?segment=${encodeURIComponent(segment)}`, { credentials: 'include' })
        const pJson = await pRes.json()
        if (pJson?.success && pJson.data?.profile) {
          const p = pJson.data.profile as Record<string, unknown>
          profileToSend = {
            profile_type: typeof p.profile_type === 'string' ? p.profile_type : null,
            profession: typeof p.profession === 'string' ? p.profession : null,
          }
          setProfile(profileToSend)
        }
      } catch {
        // mantém profile atual
      }
      const res = await fetch('/api/ylada/interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          text: interpretText.trim(),
          profile_type: profileToSend?.profile_type ?? undefined,
          profession: profileToSend?.profession ?? undefined,
          objective: linkObjective,
          variation,
          previous_template_id: variation && interpretResult?.recommendedTemplateId ? interpretResult.recommendedTemplateId : undefined,
        }),
      })
      const json = await res.json()
      if (json?.success && json?.data) {
        setInterpretResult(json.data)
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

  /** Volta à Tela 1 (intenção) para alterar objetivo/tema. */
  const handleBackToIntention = () => {
    setInterpretResult(null)
    setSelectedFlowId(null)
    setStrategyView('cards')
    setMessage(null)
  }

  /** Tela 3 → volta aos 2 cards. */
  const handleBackToCards = () => {
    setSelectedFlowId(null)
    setStrategyView('cards')
  }

  /** Tela 4 → Confirmar e gerar link: envia interpretacao + flow_id quando disponível (Etapa 7). */
  const handleConfirmAndGenerate = async () => {
    setCreating(true)
    setMessage(null)
    try {
      const hasFlow = !!selectedFlowId && !!interpretResult?.interpretacao && !!interpretResult?.strategies
      const body = hasFlow
        ? {
            flow_id: selectedFlowId,
            interpretacao: {
              objetivo: interpretResult.interpretacao?.objetivo ?? linkObjective,
              tema: interpretResult.interpretacao?.tema ?? interpretResult.o_que_captar ?? '',
              tipo_publico: interpretResult.interpretacao?.tipo_publico,
              area_profissional: interpretResult.interpretacao?.area_profissional,
            },
          }
        : { template_id: interpretResult?.recommendedTemplateId || templates[0]?.id }

      if (!body.flow_id && !(body as { template_id?: string }).template_id) {
        setMessage({ type: 'error', text: 'Nenhum template disponível. Configure os templates no banco (migrations).' })
        setCreating(false)
        return
      }

      const res = await fetch('/api/ylada/links/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      })
      const json = await res.json()
      if (json?.success && json?.data) {
        const base = typeof window !== 'undefined' ? window.location.origin : ''
        const url = json.data.url || `${base}/l/${json.data.slug}`
        setLinks((prev) => [
          { ...json.data, url, template_name: null, template_type: null, stats: { view: 0, start: 0, complete: 0, cta_click: 0 } },
          ...prev,
        ])
        setMessage({ type: 'success', text: `Link criado com sucesso. URL: ${url} — role até "Seus links" para ver.` })
        setStrategyView('cards')
        setSelectedFlowId(null)
        setInterpretResult(null)
        setTimeout(() => linksListRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300)
      } else {
        setMessage({ type: 'error', text: json?.error || 'Erro ao criar link.' })
      }
    } catch {
      setMessage({ type: 'error', text: 'Erro ao criar link. Tente novamente.' })
    } finally {
      setCreating(false)
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

        {/* Tela 1 — Intenção | Tela 2 — 2 cards de estratégias */}
        <section className="bg-white rounded-lg border border-gray-200 p-4">
          {!interpretResult?.strategies ? (
            <>
              {/* Tela 1: Qual é o objetivo deste link? */}
              <h2 className="text-sm font-semibold text-gray-700 mb-2">Qual é o objetivo deste link?</h2>
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
                Em uma frase, o que você quer alcançar?
              </p>
              <textarea
                placeholder="Ex.: captar pessoas interessadas em perder peso"
                value={interpretText}
                onChange={(e) => setInterpretText(e.target.value)}
                className="min-h-[80px] w-full rounded-md border border-gray-300 px-3 py-2 text-sm mb-2"
                rows={3}
              />
              <p className="text-xs text-gray-500 mb-3">
                Você não precisa escolher o tipo de quiz. A YLADA sugere a melhor estratégia.
              </p>
              <button
                type="button"
                onClick={() => handleInterpret()}
                disabled={interpreting || !interpretText.trim()}
                className="rounded-lg bg-gray-700 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
              >
                {interpreting ? 'Avançando...' : 'Avançar'}
              </button>
            </>
          ) : strategyView === 'preview' && selectedFlowId ? (
            <>
              {/* Tela 4: Preview antes de gerar */}
              <div ref={suggestionBoxRef}>
                <p className="text-sm font-semibold text-gray-900 mb-3">Prévia do seu link</p>
                {(() => {
                  const flow = getFlowById(selectedFlowId)
                  const tema = interpretResult.safe_theme ?? interpretResult.interpretacao?.tema ?? interpretResult.o_que_captar ?? 'seu tema'
                  if (!flow) return null
                  return (
                    <div className="space-y-4 text-sm text-gray-700">
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-0.5">Título</p>
                        <p className="font-medium text-gray-900">{flow.display_name} — {tema}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-0.5">Subtítulo</p>
                        <p>{flow.impact_line}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-0.5">Perguntas que serão feitas</p>
                        <ul className="list-disc list-inside space-y-0.5">{flow.question_labels.map((l, i) => <li key={i}>{l}</li>)}</ul>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-0.5">O que a pessoa recebe</p>
                        <p>{flow.result_preview}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-0.5">Como isso vira conversa (CTA)</p>
                        <p>{flow.cta_default}</p>
                      </div>
                      <div className="flex flex-wrap gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setStrategyView('detail')}
                          className="text-sm text-gray-600 underline hover:text-gray-800"
                        >
                          Voltar
                        </button>
                        <button
                          type="button"
                          onClick={handleConfirmAndGenerate}
                          disabled={creating}
                          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                          {creating ? 'Gerando...' : 'Confirmar e gerar link'}
                        </button>
                      </div>
                    </div>
                  )
                })()}
              </div>
            </>
          ) : strategyView === 'detail' && selectedFlowId ? (
            <>
              {/* Tela 3: Detalhe do fluxo escolhido */}
              <div ref={suggestionBoxRef}>
                {(() => {
                  const flow = getFlowById(selectedFlowId)
                  if (!flow) return null
                  const isQuality = flow.type === 'qualidade'
                  return (
                    <>
                      <div className="flex items-center gap-2 mb-3">
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                            isQuality ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {isQuality ? 'Qualidade' : 'Volume'}
                        </span>
                        <h2 className="text-sm font-semibold text-gray-900">{flow.display_name}</h2>
                      </div>
                      <div className="space-y-3 text-sm text-gray-700 mb-4">
                        <div>
                          <p className="text-xs font-medium text-gray-500 mb-0.5">O que este link faz</p>
                          <p>{flow.description}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500 mb-0.5">Perguntas que serão feitas</p>
                          <ul className="list-disc list-inside space-y-0.5">{flow.question_labels.map((l, i) => <li key={i}>{l}</li>)}</ul>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500 mb-0.5">O que a pessoa recebe</p>
                          <p>{flow.result_preview}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500 mb-0.5">Como isso vira conversa (CTA)</p>
                          <p>{flow.cta_default}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => setStrategyView('preview')}
                          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                        >
                          Gerar esse link
                        </button>
                        <button
                          type="button"
                          onClick={handleBackToCards}
                          className="text-sm text-gray-600 underline hover:text-gray-800"
                        >
                          Ver outra estratégia
                        </button>
                      </div>
                    </>
                  )
                })()}
              </div>
            </>
          ) : (
            <>
              {/* Tela 2: Entendemos seu objetivo + 1 ou 2 cards (strategyCards) */}
              <div ref={suggestionBoxRef}>
                <p className="text-sm font-semibold text-gray-900 mb-1">Entendemos seu objetivo.</p>
                <p className="text-sm text-gray-700 mb-2">
                  Você quer <strong>{OBJETIVO_PHRASE[interpretResult.interpretacao?.objetivo ?? 'captar']}</strong> pessoas sobre <strong>{interpretResult.interpretacao?.tema ?? interpretResult.o_que_captar ?? 'seu tema'}</strong>.
                </p>
                {(() => {
                  const cards = interpretResult.strategyCards?.length
                    ? interpretResult.strategyCards
                    : (interpretResult.strategies ?? []).map((flowId) => {
                        const flow = getFlowById(flowId)
                        return {
                          slot: flow?.type === 'qualidade' ? 'qualidade' : 'volume',
                          flow_id: flowId,
                          title: flow?.display_name ?? '',
                          subtitle: flow?.type === 'qualidade' ? 'Qualidade' : 'Volume',
                          description: flow?.impact_line,
                        }
                      })
                  const singleCard = cards.length === 1
                  return (
                    <>
                      {singleCard ? (
                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-900 mb-1">
                            Para o seu objetivo, esta é a estratégia mais eficaz.
                          </p>
                          <p className="text-sm text-gray-600 mb-1">
                            Ela foca em agenda, processo e conversão — sem transformar o link em avaliação clínica.
                          </p>
                          <p className="text-xs text-gray-500">
                            Recomendação automática baseada no seu objetivo e no tema informado.
                          </p>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-700 mb-4">
                          Identificamos duas estratégias. Escolha uma:
                        </p>
                      )}
                      <div className={`grid gap-4 mb-4 ${singleCard ? 'grid-cols-1 max-w-md' : 'grid-cols-1 sm:grid-cols-2'}`}>
                        {cards.map((card) => {
                          const isSingle = card.slot === 'single'
                          return (
                            <div
                              key={card.flow_id}
                              className="rounded-lg border border-gray-200 p-4 bg-gray-50/50 hover:border-gray-300 transition-colors"
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <span
                                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                    isSingle ? 'bg-emerald-100 text-emerald-800' : card.slot === 'qualidade' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                                  }`}
                                >
                                  {card.subtitle ?? (isSingle ? 'Recomendado' : '')}
                                </span>
                              </div>
                              <h3 className="text-sm font-semibold text-gray-900 mb-1">{card.title}</h3>
                              {(card.description ?? (getFlowById(card.flow_id)?.impact_line)) && (
                                <p className="text-xs text-gray-600 mb-3">{card.description ?? getFlowById(card.flow_id)?.impact_line}</p>
                              )}
                              <button
                                type="button"
                                onClick={() => { setSelectedFlowId(card.flow_id); setStrategyView('detail') }}
                                className="rounded-lg bg-gray-700 px-3 py-2 text-xs font-medium text-white hover:bg-gray-800"
                              >
                                {isSingle ? 'Usar esta estratégia' : 'Ver como funciona'}
                              </button>
                            </div>
                          )
                        })}
                      </div>
                    </>
                  )
                })()}
                <button
                  type="button"
                  onClick={handleBackToIntention}
                  className="text-sm text-gray-600 underline hover:text-gray-800"
                >
                  Alterar objetivo/tema
                </button>
              </div>
            </>
          )}
        </section>

        <section ref={linksListRef} className="bg-white rounded-lg border border-gray-200 p-4">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Seus links</h2>
          {links.length === 0 ? (
            <p className="text-gray-500 text-sm">Você ainda não criou nenhum link. Defina o objetivo acima, escolha uma estratégia e confirme para gerar o link.</p>
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
