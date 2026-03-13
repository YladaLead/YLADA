'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import YladaAreaShell from '@/components/ylada/YladaAreaShell'
import { getYladaAreaPathPrefix } from '@/config/ylada-areas'
import { getFlowById } from '@/config/ylada-flow-catalog'
import { getTemasForProfession, getTemaLabel, TEMA_OUTRO_VALUE, TEMA_ICONS } from '@/config/ylada-temas'
import { getFerramentasForTema, type FerramentaConcreta } from '@/config/ylada-temas-ferramentas'
import { getSugestoesDiagnostico, getLabelSegmentoSugestoes } from '@/config/ylada-links-sugestoes'
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
type LinkStats = {
  view: number
  start: number
  complete: number
  cta_click: number
  diagnosis_count?: number
  conversion_rate?: number | null
}
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

interface LinksPageContentProps {
  areaCodigo?: string
  areaLabel?: string
}

function LinksPageContent({ areaCodigo = 'ylada', areaLabel = 'YLADA' }: LinksPageContentProps) {
  const prefix = getYladaAreaPathPrefix(areaCodigo)
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
  const [profile, setProfile] = useState<{ profile_type?: string | null; profession?: string | null; area_specific?: Record<string, unknown> | null } | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [linkObjective, setLinkObjective] = useState<LinkObjectiveValue>('captar')
  /** Fluxo escolhido nos cards; null = ainda nos 2 cards. */
  const [selectedFlowId, setSelectedFlowId] = useState<string | null>(null)
  /** Fluxo por texto: 'cards' = 2 cards (simplificado: sem detail/preview). */
  const [strategyView, setStrategyView] = useState<'cards'>('cards')
  /** Direção Estratégica (profile-first): carregada ao abrir a página. */
  const [strategyData, setStrategyData] = useState<{
    professional_diagnosis: { blocker: string; focus: string; summary_lines: string[] }
    strategic_focus: string
    profile_incomplete?: boolean
    simulated_profile_key?: string
    simulated_profile_label?: string
    strategies: Array<{ type: string; flow_id: string; title: string; reason: string; theme: string; questions: Array<{ key: string; label: string; type: string }>; cta_suggestion: string }>
  } | null>(null)
  const [strategyLoading, setStrategyLoading] = useState(true)
  /** true = usuário quer definir objetivo por texto (fluxo antigo). */
  const [showTextFlow, setShowTextFlow] = useState(false)
  /** URL do último link criado (para destaque no feedback). */
  const [lastCreatedUrl, setLastCreatedUrl] = useState<string | null>(null)
  /** Tema escolhido (tema primeiro): value ou TEMA_OUTRO_VALUE. null = ainda não escolheu. */
  const [selectedTema, setSelectedTema] = useState<string | null>(null)
  /** Texto livre quando tema = "Outro". */
  const [temaOutroText, setTemaOutroText] = useState('')
  const linksListRef = useRef<HTMLDivElement>(null)
  const suggestionBoxRef = useRef<HTMLDivElement>(null)
  const criadorRef = useRef<HTMLDivElement>(null)

  const segment = areaCodigo && areaCodigo !== 'ylada' ? areaCodigo : 'ylada'

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
          area_specific: typeof p.area_specific === 'object' && p.area_specific !== null ? (p.area_specific as Record<string, unknown>) : null,
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

  const fetchStrategy = useCallback(() => {
    setStrategyLoading(true)
    fetch('/api/ylada/strategy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ segment }),
    })
      .then((r) => r.json())
      .then((json) => {
        if (json?.success && json?.data) {
          setStrategyData(json.data)
        } else {
          setStrategyData(null)
        }
      })
      .catch(() => setStrategyData(null))
      .finally(() => setStrategyLoading(false))
  }, [segment])

  useEffect(() => {
    fetchStrategy()
  }, [fetchStrategy])

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
              area_specific: typeof p.area_specific === 'object' && p.area_specific !== null ? (p.area_specific as Record<string, unknown>) : null,
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

  /** Volta para Direção Estratégica (sai do fluxo por texto). */
  const handleBackToStrategy = () => {
    setInterpretResult(null)
    setSelectedFlowId(null)
    setStrategyView('cards')
    setShowTextFlow(false)
    setSelectedTema(null)
    setTemaOutroText('')
    setMessage(null)
  }

  /** Criar link a partir de um card do fluxo por texto (com questions + cta do flow). */
  const handleCreateFromInterpretCard = async (card: { flow_id: string; title?: string; subtitle?: string; description?: string }) => {
    if (!interpretResult?.interpretacao) return
    setCreating(true)
    setMessage(null)
    try {
      const flow = getFlowById(card.flow_id)
      const tema = interpretResult.safe_theme ?? interpretResult.interpretacao?.tema ?? interpretResult.o_que_captar ?? 'seu tema'
      const questions = (flow?.question_labels ?? []).map((label, i) => ({
        id: `q${i + 1}`,
        label,
        type: 'text' as const,
      }))
      const body = {
        flow_id: card.flow_id,
        interpretacao: {
          objetivo: (interpretResult.interpretacao?.objetivo ?? linkObjective) as 'captar' | 'educar' | 'reter' | 'propagar' | 'indicar',
          tema,
          tipo_publico: interpretResult.interpretacao?.tipo_publico ?? 'pacientes',
          area_profissional: interpretResult.interpretacao?.area_profissional ?? 'geral',
        },
        questions,
        cta_suggestion: flow?.cta_default ?? 'Quero analisar meu caso',
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
          { ...json.data, url, template_name: null, template_type: null, stats: { view: 0, start: 0, complete: 0, cta_click: 0, diagnosis_count: 0 } },
          ...prev,
        ])
        setLastCreatedUrl(url)
        setMessage({ type: 'success', text: 'Seu diagnóstico foi criado.' })
        setInterpretResult(null)
        setShowTextFlow(false)
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

  /** Criar link a partir de uma ferramenta concreta (tema + catálogo). */
  const handleCreateFromFerramenta = async (ferramenta: FerramentaConcreta, temaLabel: string) => {
    setCreating(true)
    setMessage(null)
    try {
      const flow = getFlowById(ferramenta.flow_id)
      const questions = (ferramenta.question_labels ?? flow?.question_labels ?? []).map((label, i) => ({
        id: `q${i + 1}`,
        label,
        type: 'text' as const,
      }))
      const body = {
        flow_id: ferramenta.flow_id,
        title: `${ferramenta.name} — ${temaLabel}`,
        interpretacao: {
          objetivo: 'captar' as const,
          tema: temaLabel,
          tipo_publico: 'pacientes',
          area_profissional: 'geral',
        },
        questions,
        cta_suggestion: ferramenta.cta_default ?? flow?.cta_default ?? 'Quero analisar meu caso',
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
          { ...json.data, url, template_name: null, template_type: null, stats: { view: 0, start: 0, complete: 0, cta_click: 0, diagnosis_count: 0 } },
          ...prev,
        ])
        setLastCreatedUrl(url)
        setMessage({ type: 'success', text: 'Seu diagnóstico foi criado.' })
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

  const sugestoes = getSugestoesDiagnostico(areaCodigo)
  const labelSegmento = getLabelSegmentoSugestoes(areaCodigo)

  /** Criar link a partir de sugestão pronta. */
  const handleCreateFromSuggested = async (sug: { title: string; flow_id: string; tema: string }) => {
    setCreating(true)
    setMessage(null)
    try {
      const flow = getFlowById(sug.flow_id)
      const questions = (flow?.question_labels ?? []).map((label, i) => ({
        id: `q${i + 1}`,
        label,
        type: 'text' as const,
      }))
      const body = {
        flow_id: sug.flow_id,
        title: sug.title,
        segment: areaCodigo && areaCodigo !== 'ylada' ? areaCodigo : 'ylada',
        interpretacao: {
          objetivo: 'captar' as const,
          tema: sug.tema,
          tipo_publico: 'pacientes',
          area_profissional: 'geral',
        },
        questions,
        cta_suggestion: flow?.cta_default ?? 'Quero analisar meu caso',
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
          { ...json.data, url, template_name: null, template_type: null, stats: { view: 0, start: 0, complete: 0, cta_click: 0, diagnosis_count: 0 } },
          ...prev,
        ])
        setLastCreatedUrl(url)
        setMessage({ type: 'success', text: 'Seu diagnóstico foi criado.' })
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
    <YladaAreaShell areaCodigo={areaCodigo} areaLabel={areaLabel}>
      <div className="max-w-2xl space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
            Diagnósticos que iniciam conversas com clientes
          </h1>
          <p className="text-gray-600 text-sm mb-4">
            Crie links que despertam curiosidade, atraem pessoas interessadas e iniciam conversas no WhatsApp.
          </p>
          {/* Fluxo visual do Método YLADA */}
          <div className="rounded-lg border border-sky-100 bg-sky-50/50 p-4 mb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 gap-1 text-sm text-gray-700">
              <span className="flex items-center gap-1.5 shrink-0">
                <span aria-hidden>🧪</span>
                <span>Criar diagnóstico</span>
              </span>
              <span className="hidden sm:inline text-sky-400" aria-hidden>→</span>
              <span className="sm:hidden text-sky-400 self-center" aria-hidden>↓</span>
              <span className="flex items-center gap-1.5 shrink-0">
                <span aria-hidden>👩</span>
                <span>Pessoa responde</span>
              </span>
              <span className="hidden sm:inline text-sky-400" aria-hidden>→</span>
              <span className="sm:hidden text-sky-400 self-center" aria-hidden>↓</span>
              <span className="flex items-center gap-1.5 shrink-0">
                <span aria-hidden>💡</span>
                <span>Curiosidade</span>
              </span>
              <span className="hidden sm:inline text-sky-400" aria-hidden>→</span>
              <span className="sm:hidden text-sky-400 self-center" aria-hidden>↓</span>
              <span className="flex items-center gap-1.5 shrink-0">
                <span aria-hidden>💬</span>
                <span>Conversa com você</span>
              </span>
              <span className="hidden sm:inline text-sky-400" aria-hidden>→</span>
              <span className="sm:hidden text-sky-400 self-center" aria-hidden>↓</span>
              <span className="flex items-center gap-1.5 shrink-0">
                <span aria-hidden>👥</span>
                <span>Novo cliente</span>
              </span>
            </div>
          </div>
        </div>

        {/* Primeira vitória imediata — CTA central */}
        <div className="rounded-xl border-2 border-amber-200 bg-amber-50/80 p-5">
          <p className="text-sm font-semibold text-gray-900 mb-2">Crie seu primeiro diagnóstico agora</p>
          <button
            type="button"
            onClick={() => {
              setInterpretResult(null)
              setInterpretText('')
              setShowTextFlow(true)
              setTimeout(() => criadorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-6 py-4 text-base font-bold text-white hover:bg-amber-600 transition-colors shadow-md hover:shadow-lg"
          >
            <span aria-hidden>⚡</span>
            Criar diagnóstico em 30 segundos
          </button>
          <p className="text-xs text-gray-600 mt-3">
            O Noel cria as perguntas automaticamente.
          </p>
        </div>

        {/* Contador de impacto — progresso e motivação */}
        {(() => {
          const totalRespostas = links.reduce((s, l) => s + (l.stats?.diagnosis_count ?? l.stats?.complete ?? 0), 0)
          const totalConversas = links.reduce((s, l) => s + (l.stats?.cta_click ?? 0), 0)
          return (
            <div className="rounded-lg border border-emerald-100 bg-emerald-50/60 px-4 py-4">
              <p className="text-sm font-semibold text-gray-900 mb-3">📊 Impacto dos seus diagnósticos</p>
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2">
                  <span aria-hidden>👩</span>
                  <span className="text-lg font-bold text-gray-900">
                    {totalRespostas} {totalRespostas === 1 ? 'resposta recebida' : 'respostas recebidas'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span aria-hidden>💬</span>
                  <span className="text-lg font-bold text-gray-900">
                    {totalConversas} {totalConversas === 1 ? 'conversa iniciada' : 'conversas iniciadas'}
                  </span>
                </div>
              </div>
            </div>
          )
        })()}

        {/* Diagnósticos sugeridos */}
        {sugestoes.length > 0 && (
          <section className="rounded-lg border border-blue-100 bg-blue-50/50 p-4">
            <h2 className="text-sm font-semibold text-gray-800 mb-3">
              Diagnósticos sugeridos para {labelSegmento}
            </h2>
            <div className="space-y-2">
              {sugestoes.map((sug, i) => (
                <div
                  key={i}
                  className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-3 rounded-lg bg-white border border-gray-100 hover:border-blue-200 transition-colors"
                >
                  <p className="text-sm text-gray-800 flex-1">{sug.title}</p>
                  <button
                    type="button"
                    onClick={() => handleCreateFromSuggested(sug)}
                    disabled={creating}
                    className="shrink-0 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    {creating ? 'Gerando...' : 'Criar diagnóstico'}
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Dica do método YLADA */}
        <p className="text-xs text-gray-500 italic">
          Dica do método YLADA: Diagnósticos que despertam curiosidade geram mais respostas. Evite perguntas muito óbvias.
        </p>

        {message && (
          <div
            className={`p-4 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}
          >
            <p className="font-medium">{message.text}</p>
            {message.type === 'success' && lastCreatedUrl && (
              <>
                <p className="mt-2 text-green-700">
                  Agora compartilhe com seus clientes ou nas redes sociais para começar conversas.
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(lastCreatedUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#25D366] px-4 py-2 text-sm font-medium text-white hover:bg-[#20BD5A] transition-colors"
                  >
                    <span aria-hidden>📲</span>
                    Compartilhar no WhatsApp
                  </a>
                  <button
                    type="button"
                    onClick={() => { copyUrl(lastCreatedUrl); setLastCreatedUrl(null) }}
                    className="rounded-lg border border-green-600 bg-white px-4 py-2 text-sm font-medium text-green-800 hover:bg-green-50 transition-colors"
                  >
                    Copiar URL
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Criar novo diagnóstico */}
        <section ref={criadorRef} className="bg-white rounded-lg border border-gray-200 p-4">
          <h2 className="text-base font-semibold text-gray-900 mb-1">Criar novo diagnóstico</h2>
          <p className="text-xs text-gray-500 mb-4">Escolha o tema que você quer trabalhar.</p>
          {!showTextFlow ? (
            /* --- Tema primeiro: Qual tema? → 2 cards --- */
            strategyLoading ? (
              <p className="text-sm text-gray-500">Carregando sua direção estratégica...</p>
            ) : strategyData ? (
              <div ref={suggestionBoxRef}>
                {strategyData.profile_incomplete && (
                  <div className="mb-4 p-3 rounded-lg bg-amber-50/80 border border-amber-200/80 text-sm text-amber-800 flex items-start gap-2">
                    <span className="text-amber-600" aria-hidden>💡</span>
                    <div>
                      <p className="font-medium">Complete seu perfil</p>
                      <p className="text-xs text-amber-700 mt-0.5">Recomendações personalizadas em <a href={`${prefix}/perfil-empresarial`} className="underline hover:no-underline">Perfil empresarial</a></p>
                    </div>
                  </div>
                )}
                {!selectedTema ? (
                  /* Step 1: Qual tema você quer trabalhar agora? */
                  <>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {(() => {
                        const temasFromProfile = profile?.area_specific?.temas_atuacao
                        const useTemasFromProfile = Array.isArray(temasFromProfile) && temasFromProfile.length > 0
                        const temasPerfil = useTemasFromProfile
                          ? (temasFromProfile as string[]).map((v) => ({ value: v, label: getTemaLabel(v) }))
                          : getTemasForProfession(profile?.profession ?? null)
                        return (
                          <>
                            {temasPerfil.map((t) => (
                              <button
                                key={t.value}
                                type="button"
                                onClick={() => setSelectedTema(t.value)}
                                className="rounded-full px-4 py-2.5 text-sm font-medium bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200 hover:border-gray-300 transition-colors flex items-center gap-1.5"
                              >
                                {TEMA_ICONS[t.value] && <span aria-hidden>{TEMA_ICONS[t.value]}</span>}
                                {t.label}
                              </button>
                            ))}
                            <button
                              type="button"
                              onClick={() => setSelectedTema(TEMA_OUTRO_VALUE)}
                              className="rounded-full px-4 py-2.5 text-sm font-medium bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200 hover:border-gray-300 transition-colors"
                            >
                              Outro tema
                            </button>
                          </>
                        )
                      })()}
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowTextFlow(true)}
                      className="text-sm text-blue-600 hover:text-blue-800 underline"
                    >
                      Descrever o objetivo em uma frase
                    </button>
                  </>
                ) : selectedTema === TEMA_OUTRO_VALUE ? (
                  /* Step 1b: Outro — digite o tema */
                  <>
                    <h2 className="text-sm font-semibold text-gray-800 mb-2">Qual tema?</h2>
                    <input
                      type="text"
                      placeholder="Ex.: emagrecimento, vitamina B12, ansiedade..."
                      value={temaOutroText}
                      onChange={(e) => setTemaOutroText(e.target.value)}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm mb-3"
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => { setSelectedTema(null); setTemaOutroText('') }}
                        className="text-sm text-gray-600 underline hover:text-gray-800"
                      >
                        Voltar
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (temaOutroText.trim()) {
                            setSelectedTema(temaOutroText.trim())
                            setTemaOutroText('')
                          }
                        }}
                        disabled={!temaOutroText.trim()}
                        className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-900 disabled:opacity-50"
                      >
                        Avançar
                      </button>
                    </div>
                  </>
                ) : (
                  /* Step 2: Para [tema], listagem de ferramentas concretas */
                  <>
                    <div className="rounded-lg bg-slate-50 border border-slate-200 p-4 mb-4">
                      <h2 className="text-sm font-semibold text-slate-800 mb-2">Direção Estratégica</h2>
                      <div className="space-y-1.5 mb-2">
                        {strategyData.professional_diagnosis.summary_lines.map((line, i) => (
                          <p key={i} className="text-sm text-slate-700">{line}</p>
                        ))}
                      </div>
                      <p className="text-sm font-medium text-slate-800">
                        Foco desta semana: {strategyData.strategic_focus}
                      </p>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">
                      Para <strong>{selectedTema === '_outro' ? 'Outro tema' : getTemaLabel(selectedTema)}</strong>, escolha uma ferramenta para criar:
                    </p>
                    <div className="grid gap-3 mb-4 grid-cols-1 sm:grid-cols-2">
                      {getFerramentasForTema(selectedTema).map((f) => (
                        <div key={f.id} className="rounded-xl border border-gray-200 p-4 bg-white shadow-sm hover:shadow-md hover:border-gray-300 transition-all">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg" aria-hidden>{f.tipo === 'quiz' ? '📋' : '🧮'}</span>
                            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${f.tipo === 'quiz' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'}`}>
                              {f.tipo === 'quiz' ? 'Quiz' : 'Calculadora'}
                            </span>
                          </div>
                          <h3 className="text-sm font-semibold text-gray-900 mb-1">{f.name}</h3>
                          <p className="text-xs text-gray-600 mb-3">{f.description}</p>
                          <button
                            type="button"
                            onClick={() => handleCreateFromFerramenta(f, selectedTema === '_outro' ? 'Outro tema' : getTemaLabel(selectedTema))}
                            disabled={creating}
                            className="w-full rounded-lg bg-slate-800 px-3 py-2.5 text-sm font-medium text-white hover:bg-slate-900 disabled:opacity-50 transition-colors"
                          >
                            {creating ? 'Gerando...' : 'Criar essa ferramenta'}
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => setSelectedTema(null)}
                        className="text-sm text-gray-600 underline hover:text-gray-800"
                      >
                        Escolher outro tema
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowTextFlow(true)}
                        className="text-sm text-gray-500 hover:text-gray-700 underline"
                      >
                        Definir por texto
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-500 mb-2">Não foi possível carregar a direção estratégica.</p>
                <button
                  type="button"
                  onClick={() => setShowTextFlow(true)}
                  className="text-sm text-blue-600 underline hover:text-blue-800"
                >
                  Definir objetivo manualmente
                </button>
              </div>
            )
          ) : !interpretResult?.strategies ? (
            <>
              {/* Tela 1: Qual é o objetivo deste link? (fluxo por texto) */}
              <button
                type="button"
                onClick={() => setShowTextFlow(false)}
                className="text-sm text-gray-600 underline hover:text-gray-800 mb-2"
              >
                ← Voltar para Direção Estratégica
              </button>
              <h2 className="text-sm font-semibold text-gray-700 mb-2">Qual resultado você quer gerar com esse diagnóstico?</h2>
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
                placeholder="Ex.: Quero atrair clientes para limpeza de pele"
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
          ) : (
            <>
              {/* Tela 2: Entendemos seu objetivo + 1 ou 2 cards (gerar direto) */}
              <div ref={suggestionBoxRef}>
                <p className="text-sm font-semibold text-gray-900 mb-1">Entendemos seu objetivo.</p>
                <p className="text-sm text-gray-700 mb-3">
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
                        <p className="text-sm text-gray-600 mb-4">Para o seu objetivo, esta é a estratégia mais eficaz.</p>
                      ) : (
                        <p className="text-sm text-gray-700 mb-4">Escolha uma ferramenta:</p>
                      )}
                      <div className={`grid gap-4 mb-4 ${singleCard ? 'grid-cols-1 max-w-md' : 'grid-cols-1 sm:grid-cols-2'}`}>
                        {cards.map((card) => {
                          const isSingle = card.slot === 'single'
                          const flow = getFlowById(card.flow_id)
                          return (
                            <div
                              key={card.flow_id}
                              className="rounded-xl border border-gray-200 p-4 bg-white shadow-sm hover:shadow-md hover:border-gray-300 transition-all"
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-lg" aria-hidden>{flow?.type === 'qualidade' ? '💬' : '📊'}</span>
                                <span
                                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                    isSingle ? 'bg-emerald-100 text-emerald-800' : card.slot === 'qualidade' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                                  }`}
                                >
                                  {card.subtitle ?? (isSingle ? 'Recomendado' : '')}
                                </span>
                              </div>
                              <h3 className="text-sm font-semibold text-gray-900 mb-1">{card.title}</h3>
                              {(card.description ?? flow?.impact_line) && (
                                <p className="text-xs text-gray-600 mb-3">{card.description ?? flow?.impact_line}</p>
                              )}
                              <button
                                type="button"
                                onClick={() => handleCreateFromInterpretCard(card)}
                                disabled={creating}
                                className="w-full rounded-lg bg-slate-800 px-3 py-2.5 text-sm font-medium text-white hover:bg-slate-900 disabled:opacity-50 transition-colors"
                              >
                                {creating ? 'Gerando...' : 'Criar essa ferramenta'}
                              </button>
                            </div>
                          )
                        })}
                      </div>
                    </>
                  )
                })()}
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleBackToIntention}
                    className="text-sm text-gray-600 underline hover:text-gray-800"
                  >
                    Alterar objetivo/tema
                  </button>
                  <button
                    type="button"
                    onClick={handleBackToStrategy}
                    className="text-sm text-gray-600 underline hover:text-gray-800"
                  >
                    Voltar para Direção Estratégica
                  </button>
                </div>
              </div>
            </>
          )}
        </section>

        <section ref={linksListRef} className="bg-white rounded-lg border border-gray-200 p-4">
          <h2 className="text-base font-semibold text-gray-900 mb-1">Seus diagnósticos criados</h2>
          <p className="text-xs text-gray-500 mb-3">Todos os diagnósticos que você criar aparecerão aqui. Copie a URL e compartilhe com seus clientes.</p>
          {(() => {
            const linkMaisAtivo = links.length > 0
              ? [...links].sort((a, b) => {
                  const sa = a.stats?.diagnosis_count ?? a.stats?.complete ?? 0
                  const sb = b.stats?.diagnosis_count ?? b.stats?.complete ?? 0
                  return sb - sa
                })[0]
              : null
            const respostasMaisAtivo = linkMaisAtivo ? (linkMaisAtivo.stats?.diagnosis_count ?? linkMaisAtivo.stats?.complete ?? 0) : 0
            const conversasMaisAtivo = linkMaisAtivo ? (linkMaisAtivo.stats?.cta_click ?? 0) : 0
            if (!linkMaisAtivo || (respostasMaisAtivo === 0 && conversasMaisAtivo === 0)) return null
            return (
              <div className="mb-4 p-4 rounded-lg border border-amber-100 bg-amber-50/80">
                <p className="text-xs font-semibold text-amber-800 uppercase tracking-wide mb-2">Diagnóstico mais respondido</p>
                <p className="text-sm font-medium text-gray-900 mb-1 truncate">{linkMaisAtivo.title || linkMaisAtivo.slug}</p>
                <p className="text-xs text-gray-600">
                  <span aria-hidden>👩</span> {respostasMaisAtivo} {respostasMaisAtivo === 1 ? 'resposta' : 'respostas'}
                  <span className="mx-2 text-gray-300">·</span>
                  <span aria-hidden>💬</span> {conversasMaisAtivo} {conversasMaisAtivo === 1 ? 'conversa' : 'conversas'}
                </p>
              </div>
            )
          })()}
          {links.length === 0 ? (
            <div className="rounded-xl border border-amber-100 bg-amber-50/60 p-6">
              <h3 className="text-base font-semibold text-gray-900 mb-2">Crie seu primeiro diagnóstico</h3>
              <p className="text-gray-700 text-sm mb-4">
                Diagnósticos despertam curiosidade e iniciam conversas com possíveis clientes. Use um dos sugeridos acima ou escolha um tema para criar o seu.
              </p>
              <button
                type="button"
                onClick={() => {
                  setInterpretResult(null)
                  setInterpretText('')
                  setShowTextFlow(true)
                  setTimeout(() => criadorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-amber-700 transition-colors"
              >
                ⚡ Criar diagnóstico agora
              </button>
            </div>
          ) : (
            <ul className="space-y-4">
              {links.map((link) => {
                const stats = link.stats ?? { view: 0, start: 0, complete: 0, cta_click: 0, diagnosis_count: 0 }
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
                          {(stats.diagnosis_count ?? 0) > 0 && (
                            <span title="Diagnósticos realizados">{stats.diagnosis_count} diagnósticos</span>
                          )}
                          <span title="Conclusões">{stats.complete} conclusões</span>
                          <span title="Cliques no WhatsApp">{stats.cta_click} cliques WhatsApp</span>
                          {typeof stats.conversion_rate === 'number' && (
                            <span
                              title="Taxa de conversão"
                              className={
                                stats.conversion_rate < 10 ? 'text-amber-600 font-medium' : undefined
                              }
                            >
                              {stats.conversion_rate}% conversão
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-1 shrink-0">
                        <Link
                          href={`${prefix}/links/editar/${link.id}`}
                          className="rounded px-2 py-1.5 text-xs font-medium text-sky-600 hover:bg-sky-50"
                        >
                          Editar quiz
                        </Link>
                        {(stats.diagnosis_count ?? 0) >= 3 && (
                          <Link
                            href={`${prefix}/home?msg=${encodeURIComponent(
                              `Quero melhorar o diagnóstico do link "${link.title || link.slug}". Ele está com ${stats.conversion_rate ?? 0}% de conversão.`
                            )}`}
                            className="rounded px-2 py-1.5 text-xs font-medium text-amber-700 hover:bg-amber-50"
                            title="Pedir ao Noel sugestões para melhorar a conversão"
                          >
                            Melhorar diagnóstico
                          </Link>
                        )}
                        <button
                          type="button"
                          onClick={() => openEditModal(link)}
                          className="rounded px-2 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100"
                        >
                          Título/WhatsApp
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

export { LinksPageContent }
export default function MatrixLinksPage() {
  return <LinksPageContent areaCodigo="ylada" areaLabel="YLADA" />
}
