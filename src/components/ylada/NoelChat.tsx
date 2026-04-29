'use client'

import { useState, useRef, useEffect, useCallback, useMemo, type ReactNode } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'
import { useAuthenticatedFetch } from '@/hooks/useAuthenticatedFetch'
import { getYladaAreaPathPrefix, getYladaLeadsPath } from '@/config/ylada-areas'
import { getNoelUxContent, type NoelArea } from '@/config/noel-ux-content'
import { buildNoelContextualWelcome, type NoelContextualAction } from '@/config/noel-contextual-welcome'
import { getLocaleFromPathname, type Language } from '@/lib/i18n'
import { YLADA_FREEMIUM_NOEL_MONTHLY_LIMIT_MESSAGE } from '@/config/freemium-limits'
import { copyTextToClipboard } from '@/lib/clipboard'
import { trackFreemiumConversionEvent } from '@/lib/ylada-freemium-client'
import {
  sanitizeProLideresQuizMarkdownToCanonicalUrl,
  stripMarkdownProLideresProximoPassoSection,
} from '@/lib/ylada-quiz-markdown-url-canonicalize'
import { assistantContentIsProLideresQuizDraftNoOfficialLink } from '@/lib/pro-lideres-noel-quiz-draft-detect'

/** Texto plano dos nós do markdown (para detectar parágrafos que são perguntas). */
function markdownPlainText(children: ReactNode): string {
  if (children == null) return ''
  if (typeof children === 'string' || typeof children === 'number') return String(children)
  if (Array.isArray(children)) return children.map(markdownPlainText).join('')
  if (typeof children === 'object' && children !== null && 'props' in children) {
    const ch = (children as { props?: { children?: ReactNode } }).props?.children
    return markdownPlainText(ch)
  }
  return ''
}

/**
 * O modelo às vezes devolve quizzes em um bloco só. Separa opções A–D em linhas/blocos
 * e aplica negrito, para o ReactMarkdown renderizar hierarquia legível.
 */
function normalizeNoelAssistantMarkdown(raw: string): string {
  let t = raw.replace(/\r\n/g, '\n').trim()
  if (!t) return t

  // Quebra antes de "2. 3. ..." quando vier colado ao parágrafo anterior
  t = t.replace(/([^\n])\s+(\d+)\.\s+(?=[^\d\s])/g, '$1\n\n$2. ')

  // Uma opção por vez: "…? A) x B) y" → parágrafos separados com **A)** **B)** …
  let prev = ''
  while (prev !== t) {
    prev = t
    t = t.replace(/\s+([A-D])\)\s+/, '\n\n**$1)** ')
  }

  // "A) texto" no início de linha (sem espaço antes)
  t = t.replace(/^([A-D])\)\s+/gm, '**$1)** ')

  // "**Pergunta N:**" / "**Pergunta N**" / "Pergunta N:" → ### (margem prose + separadores)
  t = t.replace(/\*\*Pergunta\s+(\d+)\*\*\s*:?\s*/gi, '\n\n### Pergunta $1\n\n')
  t = t.replace(/(^|\n)Pergunta\s+(\d+)\s*:\s*/gi, '$1\n\n### Pergunta $2\n\n')

  // Respiração entre perguntas quando o modelo omitir `---` antes da 2ª em diante
  t = t.replace(/\n(###\s+Pergunta\s+([2-9]|\d{2,})\b)/gi, '\n\n---\n\n$1')

  t = t.replace(/(?:\n---\s*){2,}/g, '\n\n---\n\n')
  t = t.replace(/\n{3,}/g, '\n\n')
  return t
}

function clampNoelFeedbackExcerpt(raw: string, max: number): string {
  const t = raw.replace(/\s+/g, ' ').trim()
  if (t.length <= max) return t
  return `${t.slice(0, max - 1)}…`
}

function normalizeHrefForCompare(h: string): string {
  const s = h.trim()
  try {
    const u = new URL(s)
    u.hash = ''
    const path = u.pathname.replace(/\/$/, '') || '/'
    return `${u.origin}${path}${u.search}`
  } catch {
    return s.replace(/\/$/, '')
  }
}

/** Qualquer href que aponte a um link público YLADA /l/[slug] (absoluto ou relativo). */
function looksLikeYladaPublicLinkPath(href: string | undefined): boolean {
  if (!href || !href.trim()) return false
  const t = href.trim()
  if (t.startsWith('/l/')) return true
  try {
    const u = new URL(t)
    return u.pathname.startsWith('/l/')
  } catch {
    return /\/l\/[a-z0-9_-]+/i.test(t)
  }
}

/**
 * O modelo às vezes inventa um slug estilo preset (`pl-…-r-tema`) que não existe na BD.
 * No Pro Líderes, links públicos na mensagem devem abrir o mesmo URL que o backend gravou.
 */
function proLideresEffectivePublicHref(
  href: string | undefined,
  canonicalQuizUrl: string | null | undefined
): string | undefined {
  if (!href || !canonicalQuizUrl) return href
  if (!looksLikeYladaPublicLinkPath(href)) return href
  if (normalizeHrefForCompare(href) === normalizeHrefForCompare(canonicalQuizUrl)) return href
  return canonicalQuizUrl
}

/** `/l/…` relativo no chat do painel resolve mal; força origem canónica do deploy. */
function absolutizeYladaPublicLinkHref(href: string | undefined): string | undefined {
  if (!href) return href
  const t = href.trim()
  if (!t.startsWith('/l/')) return href
  const fromEnv = process.env.NEXT_PUBLIC_APP_URL?.trim().replace(/\/$/, '')
  const base =
    fromEnv ||
    (typeof window !== 'undefined' ? window.location.origin.replace(/\/$/, '') : '') ||
    ''
  if (!base) return href
  try {
    return new URL(t, `${base}/`).href
  } catch {
    return href
  }
}

/** Remove blocos ``` só com o URL do quiz (o chat Pro Líderes já tem um botão de copiar). */
function stripRedundantUrlCodeFence(text: string, url: string | null): string {
  if (!url || !text) return text
  const esc = url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return text
    .replace(new RegExp(`\\n?\`\`\`(?:[\\w-]*)\\n${esc}\\s*\\n\`\`\``, 'gi'), '')
    .replace(new RegExp(`^\`\`\`(?:[\\w-]*)\\n${esc}\\s*\\n\`\`\`\\n?`, 'gi'), '')
}

function readProLideresLibraryPublishedFlag(linkId: string): boolean {
  if (typeof window === 'undefined') return false
  try {
    return sessionStorage.getItem(`pl_lib_pub_${linkId}`) === '1'
  } catch {
    return false
  }
}

/** Extrai apenas o script da mensagem do Noel (para copiar sem o resto). */
function extractScriptFromMessage(content: string): string {
  const trimmed = content.trim()
  if (!trimmed) return trimmed

  const codeBlockMatch = trimmed.match(/```(?:[\w-]*)\n?([\s\S]*?)```/)
  if (codeBlockMatch) {
    const inner = codeBlockMatch[1].trim()
    if (inner.length > 20) return inner
  }

  const scriptHeaderMatch = trimmed.match(
    /(?:📝|💬)?\s*(?:Script\s*(?:sugerido|pronto)?\s*:?\s*|Chamada para Ação\s*:?\s*)\n+([\s\S]*?)(?=\n###|\n---|\n📝|\n💬|\n🔗|\n💡|$)/i
  )
  if (scriptHeaderMatch) {
    const extracted = scriptHeaderMatch[1].trim()
    if (extracted.length > 15) return extracted
  }

  const ctaMatch = trimmed.match(/###\s*Chamada para Ação\s*\n+([\s\S]*?)(?=\n###|$)/i)
  if (ctaMatch) {
    const extracted = ctaMatch[1].trim()
    if (extracted.length > 15) return extracted
  }

  const msgBlockMatch = trimmed.match(/(?:^|\n)((?:Oi|Olá|Olá\s+\[?nome\]?)[\s\S]*?)(?=\n\n(?:###|📝|🔗|💡|$)|\n---|$)/i)
  if (msgBlockMatch) {
    const extracted = msgBlockMatch[1].trim()
    if (extracted.length > 30) return extracted
  }

  return trimmed
}

function isExtractedScriptOnlyUrl(content: string): boolean {
  const s = extractScriptFromMessage(content).trim()
  return /^https?:\/\/\S+$/i.test(s)
}

function LinkWithCopy({ href, children }: { href?: string; children: React.ReactNode }) {
  const [copied, setCopied] = useState(false)
  const onAnchorClick = useCallback(() => {
    if (href && /precos/i.test(href)) {
      trackFreemiumConversionEvent('freemium_upgrade_cta_click', { surface: 'noel_chat', kind: 'noel' })
    }
  }, [href])
  const copy = useCallback(async () => {
    if (!href) return
    const ok = await copyTextToClipboard(href)
    if (ok) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [href])
  if (!href) return <>{children}</>
  return (
    <span className="flex flex-col gap-2 mt-2 mb-4 pb-4 border-b border-sky-200">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onAnchorClick}
        className="flex items-center gap-1.5 w-fit px-3 py-2 rounded-lg bg-sky-50 text-sky-700 font-medium hover:bg-sky-100 transition-colors border border-sky-200"
      >
        <span className="truncate">{children}</span>
        <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </a>
      <button
        type="button"
        onClick={copy}
        className="flex items-center gap-1.5 w-fit px-3 py-2 rounded-lg bg-sky-100/80 text-sky-700 text-sm font-medium hover:bg-sky-200/80 transition-colors border border-sky-200"
      >
        {copied ? (
          <>
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Copiado!
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h2m8 0h2a2 2 0 012 2v2m0 8a2 2 0 01-2 2h-2m-4-4V6" />
            </svg>
            Copiar link
          </>
        )}
      </button>
    </span>
  )
}

function extractFirstHttpUrl(text: string): string | null {
  if (!text) return null
  const mdMatch = text.match(/\[[^\]]+\]\((https?:\/\/[^)\s]+)\)/i)
  if (mdMatch?.[1]) return mdMatch[1]
  const rawMatch = text.match(/https?:\/\/[^\s)]+/i)
  if (rawMatch?.[0]) return rawMatch[0]
  return null
}

export type { NoelArea }

type LastLinkContext = {
  flow_id: string
  interpretacao: Record<string, unknown>
  questions: Array<{ id: string; label: string; type?: string }>
  url?: string
  title?: string
  link_id?: string
  /** Pro Líderes: false = equipe não vê no Catálogo até partilhar. */
  visible_to_team_in_catalog?: boolean
}

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  /** Contexto do link gerado nesta mensagem — alinha Editar / Abrir com o mesmo `link_id` e URL do backend. */
  linkContext?: LastLinkContext
}

const STORAGE_KEY_PREFIX = 'noel_ylada_'
const LAST_LINK_KEY_PREFIX = 'noel_ylada_last_link_'

function loadLastLinkContext(area: NoelArea): LastLinkContext | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(`${LAST_LINK_KEY_PREFIX}${area}`)
    if (!raw) return null
    return JSON.parse(raw) as LastLinkContext
  } catch {
    return null
  }
}

function saveLastLinkContext(area: NoelArea, ctx: LastLinkContext | null) {
  if (typeof window === 'undefined') return
  try {
    if (ctx) localStorage.setItem(`${LAST_LINK_KEY_PREFIX}${area}`, JSON.stringify(ctx))
    else localStorage.removeItem(`${LAST_LINK_KEY_PREFIX}${area}`)
  } catch {
    // ignore
  }
}

function loadMessages(area: NoelArea): Message[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}${area}`)
    if (!raw) return []
    const parsed = JSON.parse(raw) as (Omit<Message, 'timestamp'> & { timestamp: string })[]
    return parsed.map((m) => ({ ...m, timestamp: new Date(m.timestamp) }))
  } catch {
    return []
  }
}

function saveMessages(area: NoelArea, messages: Message[]) {
  if (typeof window === 'undefined') return
  try {
    const toSave = messages.map((m) => ({ ...m, timestamp: m.timestamp.toISOString() }))
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${area}`, JSON.stringify(toSave))
  } catch {
    // ignore
  }
}

function getWelcomeMessage(area: NoelArea): Message {
  const ux = getNoelUxContent(area)
  return {
    id: 'welcome',
    role: 'assistant',
    content: ux.welcomeMessage,
    timestamp: new Date(),
  }
}

/** Sem mensagem inicial: se só existia o welcome antigo no storage, começa vazio. */
function normalizeSavedMessagesForSkipWelcome(saved: Message[], skipWelcomeMessage: boolean): Message[] {
  if (!skipWelcomeMessage) return saved
  if (saved.length === 1 && saved[0]?.id === 'welcome' && saved[0]?.role === 'assistant') return []
  return saved
}

interface NoelChatProps {
  area?: NoelArea
  className?: string
  /** Mensagem inicial (ex.: de link ?msg=... para "Melhorar diagnóstico") */
  initialMessage?: string
  /** Idioma da resposta do Noel (default: detectado da URL) */
  locale?: Language
  /** POST do chat; default `/api/ylada/noel` */
  chatApiPath?: string
  /** Não buscar dashboard/links da matriz YLADA para substituir o welcome (ex.: Pro Líderes). */
  skipYladaContextualWelcome?: boolean
  /** Título no cabeçalho do cartão (ex.: «Noel»). */
  headerTitle?: string
  /** Frase curta ao lado do título (ex.: disponibilidade para o líder). */
  headerTagline?: string
  /** Mostrar emoji 🧠 na barra do chat (default: true). */
  showHeaderEmoji?: boolean
  /** Esconder ações "Editar quiz" / "Meus links" que dependem da área YLADA (embed Pro Líderes). */
  disableYladaLinkEditor?: boolean
  /** Sem mensagem inicial do Noel; conversa nova começa vazia (ex.: Pro Líderes). */
  skipWelcomeMessage?: boolean
  /** Não mostrar chips de sugestões abaixo da primeira mensagem. */
  hideSuggestions?: boolean
  /** Mostrar título à esquerda na barra do chat (ex. "Noel"). Se false, só o botão Limpar. */
  showChatHeaderTitle?: boolean
  /** Ocultar a linha de exemplo abaixo do campo de texto. */
  hideInputHint?: boolean
  /** Texto do botão de envio (default: «Perguntar ao Noel»). */
  sendButtonLabel?: string
  /** Se true, não mostra o rótulo "Sugestões:" acima dos chips. */
  hideSuggestionsHeading?: boolean
}

function isProLideresNoelApiPath(path: string | undefined): boolean {
  return Boolean(
    path?.includes('/pro-lideres/noel') ||
      path?.includes('/pro-estetica-corporal/noel') ||
      path?.includes('/pro-estetica-capilar/noel')
  )
}

export default function NoelChat({
  area = 'med',
  className = '',
  initialMessage,
  locale: localeProp,
  chatApiPath,
  skipYladaContextualWelcome = false,
  headerTitle,
  headerTagline,
  showHeaderEmoji = true,
  disableYladaLinkEditor = false,
  skipWelcomeMessage = false,
  hideSuggestions = false,
  showChatHeaderTitle = true,
  hideInputHint = false,
  sendButtonLabel,
  hideSuggestionsHeading = false,
}: NoelChatProps) {
  const router = useRouter()
  const pathname = usePathname()
  const locale = localeProp ?? getLocaleFromPathname(pathname ?? '')
  const uxContent = getNoelUxContent(area)
  const resolvedChatApi = chatApiPath ?? '/api/ylada/noel'
  const proLideresPayload = isProLideresNoelApiPath(resolvedChatApi)
  const proLideresPainelCatalogHref =
    area === 'pro_estetica_corporal'
      ? '/pro-estetica-corporal/painel/catalogo'
      : area === 'pro_estetica_capilar'
        ? '/pro-estetica-capilar/painel/biblioteca-links'
        : '/pro-lideres/painel/catalogo'
  /** Guia «publicar na biblioteca» + PATCH link-meta: só o Noel do painel Pro Líderes clássico. */
  const proLideresLeaderLibraryFlow = Boolean(resolvedChatApi?.includes('/pro-lideres/noel'))
  /** Noel embed Pro Estética: mesmos atalhos de testar link / catálogo que o líder, sem modal Vendas/Recrutamento. */
  const proEsteticaNoelLinkToolbar =
    Boolean(resolvedChatApi?.includes('/pro-estetica-corporal/noel')) ||
    Boolean(resolvedChatApi?.includes('/pro-estetica-capilar/noel'))
  /** Links da matriz YLADA para esteticista ficam em /pt/estetica, não na rota do painel embed. */
  /** Pro Líderes: links do dono ficam na matriz central `/pt/links`, não em `/pt/pro_lideres/...`. */
  const yladaMatrixPathPrefix =
    area === 'pro_estetica_corporal' ||
    area === 'pro_estetica_capilar' ||
    resolvedChatApi?.includes('/pro-estetica-corporal/noel') ||
    resolvedChatApi?.includes('/pro-estetica-capilar/noel')
      ? getYladaAreaPathPrefix('estetica')
      : area === 'pro_lideres' || resolvedChatApi?.includes('/pro-lideres/noel')
        ? getYladaAreaPathPrefix('ylada')
        : getYladaAreaPathPrefix(area)

  const flowsVisibilityApiBase = useMemo(() => {
    if (resolvedChatApi?.includes('/pro-estetica-corporal/noel')) return '/api/pro-estetica-corporal/flows/visibility'
    if (resolvedChatApi?.includes('/pro-estetica-capilar/noel')) return '/api/pro-estetica-capilar/flows/visibility'
    return '/api/pro-lideres/flows/visibility'
  }, [resolvedChatApi])

  const noelPainelSecondaryToolsHref =
    area === 'pro_estetica_corporal'
      ? '/pro-estetica-corporal/painel/biblioteca-links'
      : area === 'pro_estetica_capilar'
        ? '/pro-estetica-capilar/painel/biblioteca-links'
        : '/pro-lideres/painel/links'

  const noelPainelSecondaryToolsLabel =
    area === 'pro_estetica_corporal' || area === 'pro_estetica_capilar' ? 'Links' : 'Convites equipe'
  const capilarFeedbackEnabled = area === 'pro_estetica_capilar'
  const [capilarFeedbackByMsgId, setCapilarFeedbackByMsgId] = useState<Record<string, 'up' | 'down'>>({})
  const capilarFeedbackSubmittedRef = useRef<Set<string>>(new Set())

  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = normalizeSavedMessagesForSkipWelcome(loadMessages(area), skipWelcomeMessage)
    if (saved.length > 0) return saved
    if (skipWelcomeMessage) return []
    return [getWelcomeMessage(area)]
  })
  const [lastLinkContext, setLastLinkContext] = useState<LastLinkContext | null>(() => loadLastLinkContext(area))
  const [input, setInput] = useState(initialMessage ?? '')
  const [loading, setLoading] = useState(false)
  const [contextualActions, setContextualActions] = useState<NoelContextualAction[] | null>(null)
  const [copiedActionLabel, setCopiedActionLabel] = useState<string | null>(null)
  const authenticatedFetch = useAuthenticatedFetch()
  const scrollEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const initializedRef = useRef(false)
  const contextualLoadedRef = useRef(false)
  const noelPaywallSessionRef = useRef(false)
  const trackNoelPaywallOnceIfNeeded = useCallback(() => {
    try {
      if (sessionStorage.getItem('ylada_paywall_view_noel_chat_v1')) return
      sessionStorage.setItem('ylada_paywall_view_noel_chat_v1', '1')
    } catch {
      if (noelPaywallSessionRef.current) return
      noelPaywallSessionRef.current = true
    }
    trackFreemiumConversionEvent('freemium_paywall_view', { surface: 'noel_chat', kind: 'noel' })
  }, [])

  const submitCapilarNoelFeedback = useCallback(
    async (msgId: string, rating: 'up' | 'down', excerptSource: string) => {
      if (!capilarFeedbackEnabled) return
      if (capilarFeedbackSubmittedRef.current.has(msgId)) return
      capilarFeedbackSubmittedRef.current.add(msgId)
      setCapilarFeedbackByMsgId((prev) => ({ ...prev, [msgId]: rating }))
      try {
        const res = await fetch('/api/pro-estetica-capilar/noel-feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            messageId: msgId,
            rating,
            excerpt: excerptSource.trim() ? clampNoelFeedbackExcerpt(excerptSource, 600) : undefined,
          }),
        })
        if (!res.ok) throw new Error('feedback_failed')
      } catch {
        capilarFeedbackSubmittedRef.current.delete(msgId)
        setCapilarFeedbackByMsgId((prev) => {
          const next = { ...prev }
          delete next[msgId]
          return next
        })
      }
    },
    [capilarFeedbackEnabled]
  )

  useEffect(() => {
    if (initializedRef.current) return
    initializedRef.current = true
    const saved = normalizeSavedMessagesForSkipWelcome(loadMessages(area), skipWelcomeMessage)
    if (saved.length > 0) setMessages(saved)
    else setMessages(skipWelcomeMessage ? [] : [getWelcomeMessage(area)])
    setLastLinkContext(loadLastLinkContext(area))
  }, [area, skipWelcomeMessage])

  // Mensagem contextual ao abrir (mentor ativo): busca dashboard + links e substitui o welcome
  useEffect(() => {
    if (skipYladaContextualWelcome || skipWelcomeMessage) return
    const saved = loadMessages(area)
    if (saved.length > 0 || contextualLoadedRef.current) return
    let cancelled = false
    Promise.all([
      fetch('/api/ylada/dashboard', { credentials: 'include' }),
      fetch('/api/ylada/links', { credentials: 'include' }),
    ])
      .then(async ([dRes, lRes]) => {
        if (cancelled) return
        const dJson = await dRes.json()
        const lJson = await lRes.json()
        const dashboard = dJson?.success ? dJson.data : null
        const links = lJson?.success ? lJson.data ?? [] : []
        const prefix = getYladaAreaPathPrefix(area)
        const leadsPath = getYladaLeadsPath(area)
        const ctx = buildNoelContextualWelcome(dashboard, links, prefix, leadsPath)
        if (cancelled || contextualLoadedRef.current) return
        contextualLoadedRef.current = true
        setMessages([{ id: 'welcome', role: 'assistant', content: ctx.message, timestamp: new Date() }])
        setContextualActions(ctx.actions)
      })
      .catch(() => {
        if (!cancelled) setContextualActions([])
      })
    return () => { cancelled = true }
  }, [area, skipYladaContextualWelcome, skipWelcomeMessage])

  useEffect(() => {
    if (initialMessage?.trim()) setInput(initialMessage.trim())
  }, [initialMessage])

  useEffect(() => {
    saveLastLinkContext(area, lastLinkContext)
  }, [area, lastLinkContext])

  useEffect(() => {
    saveMessages(area, messages)
  }, [area, messages])

  useEffect(() => {
    scrollEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  /** Sincroniza visibilidade no catálogo quando o contexto veio do storage sem o campo. */
  useEffect(() => {
    if (!proLideresPayload || !lastLinkContext?.link_id || lastLinkContext.visible_to_team_in_catalog !== undefined) {
      return
    }
    let cancelled = false
    ;(async () => {
      try {
        const res = await authenticatedFetch(
          `/api/pro-lideres/flows/visibility?yladaLinkId=${encodeURIComponent(lastLinkContext.link_id!)}`
        )
        if (!res.ok || cancelled) return
        const data = (await res.json()) as { visibleToTeam?: boolean }
        if (typeof data.visibleToTeam !== 'boolean' || cancelled) return
        const vis = data.visibleToTeam
        const lid = lastLinkContext.link_id!
        setLastLinkContext((prev) => (prev?.link_id === lid ? { ...prev, visible_to_team_in_catalog: vis } : prev))
        setMessages((prev) =>
          prev.map((m) =>
            m.role === 'assistant' && m.linkContext?.link_id === lid
              ? { ...m, linkContext: { ...m.linkContext!, visible_to_team_in_catalog: vis } }
              : m
          )
        )
      } catch {
        /* ignore */
      }
    })()
    return () => {
      cancelled = true
    }
  }, [
    proLideresPayload,
    flowsVisibilityApiBase,
    lastLinkContext?.link_id,
    lastLinkContext?.visible_to_team_in_catalog,
    authenticatedFetch,
  ])

  const sendMessage = useCallback(async (forcedText?: string) => {
    const textSource = forcedText !== undefined ? forcedText : input
    const text = textSource.trim()
    if (!text || loading) return

    if (forcedText === undefined) setInput('')
    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMsg])
    setLoading(true)

    try {
      const conversationHistory = [...messages, userMsg]
        .filter((m) => m.role === 'user' || m.role === 'assistant')
        .slice(-12)
        .map((m) => ({ role: m.role, content: m.content }))

      const res = await authenticatedFetch(resolvedChatApi, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          proLideresPayload
            ? { message: text, conversationHistory, locale, lastLinkContext: lastLinkContext ?? undefined }
            : {
                message: text,
                conversationHistory,
                area,
                lastLinkContext: lastLinkContext ?? undefined,
                locale,
              }
        ),
      })

      if (!res.ok) {
        const err = (await res.json().catch(() => ({}))) as {
          error?: string
          message?: string
          limit_type?: string
          upgrade_url?: string
          profile_url?: string
        }
        if (err.error === 'profile_required' && !proLideresPayload) {
          const profileMsg = err.message || 'Complete seu perfil empresarial para usar o Noel.'
          const profileUrl = err.profile_url || '/pt/perfil-empresarial'
          setMessages((prev) => [
            ...prev,
            {
              id: `e-${Date.now()}`,
              role: 'assistant',
              content: `${profileMsg}\n\n[Completar perfil empresarial](${profileUrl})`,
              timestamp: new Date(),
            },
          ])
          setLoading(false)
          inputRef.current?.focus()
          return
        }
        if (!proLideresPayload && (err.limit_type === 'noel_advanced' || err.error === 'limit_reached')) {
          trackNoelPaywallOnceIfNeeded()
          const upgradeMsg =
            err.message ||
            YLADA_FREEMIUM_NOEL_MONTHLY_LIMIT_MESSAGE
          const upgradeUrl = err.upgrade_url || '/pt/precos'
          setMessages((prev) => [
            ...prev,
            {
              id: `e-${Date.now()}`,
              role: 'assistant',
              content: `${upgradeMsg}\n\n[Quero o plano Pro](${upgradeUrl})`,
              timestamp: new Date(),
            },
          ])
          setLoading(false)
          inputRef.current?.focus()
          return
        }
        throw new Error(err.error || err.message || 'Erro ao processar mensagem.')
      }

      const data = (await res.json()) as { response?: string; lastLinkContext?: LastLinkContext | null }
      if (data.lastLinkContext) {
        setLastLinkContext(data.lastLinkContext)
        saveLastLinkContext(area, data.lastLinkContext) // persistir imediatamente (evita perda se componente desmontar)
      }
      const assistantMsg: Message = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        content: data.response?.trim() || 'Desculpe, não consegui processar. Tente novamente.',
        timestamp: new Date(),
        linkContext: data.lastLinkContext ?? undefined,
      }
      setMessages((prev) => [...prev, assistantMsg])
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Erro de conexão. Tente novamente.'
      setMessages((prev) => [
        ...prev,
        {
          id: `e-${Date.now()}`,
          role: 'assistant',
          content: `❌ ${msg}`,
          timestamp: new Date(),
        },
      ])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }, [
    input,
    loading,
    messages,
    area,
    authenticatedFetch,
    lastLinkContext,
    locale,
    trackNoelPaywallOnceIfNeeded,
    resolvedChatApi,
    proLideresPayload,
  ])

  const clearChat = () => {
    contextualLoadedRef.current = false
    setContextualActions(null)
    setMessages(skipWelcomeMessage ? [] : [getWelcomeMessage(area)])
    setLastLinkContext(null)
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(`${STORAGE_KEY_PREFIX}${area}`)
        localStorage.removeItem(`${LAST_LINK_KEY_PREFIX}${area}`)
      } catch {
        // ignore
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const hasLink = (text: string) => /\[([^\]]+)\]\(([^)]+)\)/.test(text)

  /** Retorna true apenas quando a mensagem contém um script identificável (não perguntas genéricas). */
  function messageHasScript(content: string): boolean {
    const trimmed = content.trim()
    if (!trimmed) return false

    // Exclui mensagem de boas-vindas e apresentação do Noel (ex: "Olá! Sou o Noel, seu mentor. Como posso te ajudar?")
    if (/Sou o Noel|Como posso te ajudar|seu mentor/i.test(trimmed) && trimmed.length < 120) return false

    // 1. Bloco de código
    const codeBlockMatch = trimmed.match(/```(?:[\w]*)\n?([\s\S]*?)```/)
    if (codeBlockMatch && codeBlockMatch[1].trim().length > 20) return true

    // 2. Após "Script:" ou "Chamada para Ação"
    const scriptHeaderMatch = trimmed.match(
      /(?:📝|💬)?\s*(?:Script\s*(?:sugerido|pronto)?\s*:?\s*|Chamada para Ação\s*:?\s*)\n+([\s\S]*?)(?=\n###|\n---|\n📝|\n💬|\n🔗|\n💡|$)/i
    )
    if (scriptHeaderMatch && scriptHeaderMatch[1].trim().length > 15) return true

    // 3. Seção ### Chamada para Ação
    const ctaMatch = trimmed.match(/###\s*Chamada para Ação\s*\n+([\s\S]*?)(?=\n###|$)/i)
    if (ctaMatch && ctaMatch[1].trim().length > 15) return true

    // 4. Bloco de mensagem (Oi/Olá...)
    const msgBlockMatch = trimmed.match(/(?:^|\n)((?:Oi|Olá|Olá\s+\[?nome\]?)[\s\S]*?)(?=\n\n(?:###|📝|🔗|💡|$)|\n---|$)/i)
    if (msgBlockMatch && msgBlockMatch[1].trim().length > 30) return true

    return false
  }

  const [copiedScriptId, setCopiedScriptId] = useState<string | null>(null)
  const [copiedQuizLinkMsgId, setCopiedQuizLinkMsgId] = useState<string | null>(null)
  const [shareCatalogBusy, setShareCatalogBusy] = useState(false)
  const [shareCatalogError, setShareCatalogError] = useState<string | null>(null)
  /** Publicar fluxo na biblioteca do líder (Vendas/Recrutamento) após testar o link no chat. */
  const [publishKindModal, setPublishKindModal] = useState<{ linkId: string; publicUrl: string } | null>(null)
  const [linkMetaBusy, setLinkMetaBusy] = useState(false)
  const [linkMetaError, setLinkMetaError] = useState<string | null>(null)
  const [libraryPublishedIds, setLibraryPublishedIds] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (typeof window === 'undefined' || !lastLinkContext?.link_id) return
    try {
      if (sessionStorage.getItem(`pl_lib_pub_${lastLinkContext.link_id}`) === '1') {
        setLibraryPublishedIds((m) => ({ ...m, [lastLinkContext.link_id!]: true }))
      }
    } catch {
      /* ignore */
    }
  }, [lastLinkContext?.link_id])
  const copyScript = useCallback(async (msg: Message) => {
    const script = extractScriptFromMessage(msg.content)
    const ok = await copyTextToClipboard(script)
    if (ok) {
      setCopiedScriptId(msg.id)
      setTimeout(() => setCopiedScriptId(null), 2000)
    }
  }, [])

  const lastAssistantMsg = [...messages].reverse().find((m) => m.role === 'assistant')

  /** A mensagem contém quiz e/ou link? Mostramos Editar/Gerar quando o profissional recebeu o diagnóstico. */
  function messageContainsQuizContent(content: string, linkCtx?: LastLinkContext | null): boolean {
    if (linkCtx?.url) return true
    if (linkCtx?.link_id) return true
    const t = content.trim()
    if (!t) return false
    const hasLink = /\[.*?\]\(https?:\/\/[^)]+\)/.test(t) || /https?:\/\/[^\s)]+/.test(t)
    if (!hasLink) return false
    // Aceita: seção ###, estrutura de quiz (perguntas + A) B) C) D)), ou só link (formato natural)
    const hasSecaoPerguntas = /###\s*(?:AQUI ESTÃO AS PERGUNTAS|Chamada para Ação|Link Inteligente)/i.test(t)
    const hasQuizOficialProLideres = /###\s*Quiz\s+e\s+link\s*\(oficial/i.test(t)
    const hasEstruturaQuiz = (/\d+\.\s+/.test(t) || /\*\*\d+\.\s+/.test(t)) && /[A-D]\)\s+/.test(t)
    const hasFormatoNatural =
      /aqui está o link|acesse seu quiz|preparei um diagnóstico|diagnóstico\/link\s*\*\*já\s*foi\s*gravado/i.test(t)
    return hasSecaoPerguntas || hasQuizOficialProLideres || hasEstruturaQuiz || hasFormatoNatural
  }

  const ctxForLinkActions = lastAssistantMsg?.linkContext ?? null
  const lastAssistantHasLinkContext = Boolean(lastAssistantMsg?.linkContext?.link_id)
  const showEditarConcordoButtons =
    !disableYladaLinkEditor &&
    lastAssistantHasLinkContext &&
    !loading &&
    lastAssistantMsg &&
    messageContainsQuizContent(lastAssistantMsg.content, ctxForLinkActions)

  const showShareWithTeamButton =
    proLideresPayload &&
    Boolean(lastLinkContext?.link_id) &&
    lastLinkContext?.visible_to_team_in_catalog === false

  const showAlreadySharedInCatalog =
    proLideresPayload &&
    Boolean(lastLinkContext?.link_id) &&
    lastLinkContext?.visible_to_team_in_catalog === true

  const shareToolWithTeam = useCallback(async () => {
    const linkId = lastLinkContext?.link_id
    if (!proLideresPayload || !linkId || shareCatalogBusy) return
    setShareCatalogBusy(true)
    setShareCatalogError(null)
    try {
      const res = await authenticatedFetch(flowsVisibilityApiBase, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ yladaLinkId: linkId, visibleToTeam: true }),
      })
      const errJson = (await res.json().catch(() => ({}))) as { error?: string }
      if (!res.ok) {
        setShareCatalogError(errJson.error || 'Não foi possível compartilhar com a equipe.')
        return
      }
      setLastLinkContext((prev) => (prev?.link_id === linkId ? { ...prev, visible_to_team_in_catalog: true } : prev))
      setMessages((prev) =>
        prev.map((m) =>
          m.linkContext?.link_id === linkId
            ? { ...m, linkContext: { ...m.linkContext!, visible_to_team_in_catalog: true } }
            : m
        )
      )
    } catch {
      setShareCatalogError('Erro de rede. Tente novamente.')
    } finally {
      setShareCatalogBusy(false)
    }
  }, [proLideresPayload, flowsVisibilityApiBase, lastLinkContext?.link_id, shareCatalogBusy, authenticatedFetch])

  const confirmPublishCatalogKind = useCallback(
    async (kind: 'sales' | 'recruitment') => {
      if (!publishKindModal) return
      setLinkMetaBusy(true)
      setLinkMetaError(null)
      try {
        const res = await authenticatedFetch('/api/pro-lideres/flows/link-meta', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ yladaLinkId: publishKindModal.linkId, proLideresKind: kind }),
        })
        const data = (await res.json().catch(() => ({}))) as { error?: string }
        if (!res.ok) {
          setLinkMetaError(data.error || 'Não foi possível guardar.')
          return
        }
        try {
          sessionStorage.setItem(`pl_lib_pub_${publishKindModal.linkId}`, '1')
        } catch {
          /* ignore */
        }
        setLibraryPublishedIds((m) => ({ ...m, [publishKindModal.linkId]: true }))
        const id = publishKindModal.linkId
        setPublishKindModal(null)
        const qs = new URLSearchParams({
          highlightYladaLink: id,
          section: 'mine',
          tab: kind,
        })
        router.push(`${proLideresPainelCatalogHref}?${qs.toString()}`)
      } catch {
        setLinkMetaError('Erro de rede.')
      } finally {
        setLinkMetaBusy(false)
      }
    },
    [publishKindModal, authenticatedFetch, router, proLideresPainelCatalogHref]
  )

  const handleSuggestionClick = useCallback(
    async (prompt: string) => {
      const text = prompt.trim()
      if (!text || loading) return
      const userMsg: Message = {
        id: `u-${Date.now()}`,
        role: 'user',
        content: text,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, userMsg])
      setLoading(true)
      try {
        const conversationHistory = [...messages, userMsg]
          .filter((m) => m.role === 'user' || m.role === 'assistant')
          .slice(-12)
          .map((m) => ({ role: m.role, content: m.content }))
        const res = await authenticatedFetch(resolvedChatApi, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(
            proLideresPayload
              ? { message: text, conversationHistory, locale, lastLinkContext: lastLinkContext ?? undefined }
              : {
                  message: text,
                  conversationHistory,
                  area,
                  lastLinkContext: lastLinkContext ?? undefined,
                  locale,
                }
          ),
        })
        if (!res.ok) {
          const err = (await res.json().catch(() => ({}))) as {
            error?: string
            message?: string
            limit_type?: string
            upgrade_url?: string
          }
          if (!proLideresPayload && (err.limit_type === 'noel_advanced' || err.error === 'limit_reached')) {
            trackNoelPaywallOnceIfNeeded()
            const upgradeMsg =
              err.message ||
              YLADA_FREEMIUM_NOEL_MONTHLY_LIMIT_MESSAGE
            const upgradeUrl = err.upgrade_url || '/pt/precos'
            setMessages((prev) => [
              ...prev,
              {
                id: `e-${Date.now()}`,
                role: 'assistant',
                content: `${upgradeMsg}\n\n[Quero o plano Pro](${upgradeUrl})`,
                timestamp: new Date(),
              },
            ])
            setLoading(false)
            inputRef.current?.focus()
            return
          }
          throw new Error(err.error || err.message || 'Erro ao processar mensagem.')
        }
        const data = (await res.json()) as { response?: string; lastLinkContext?: LastLinkContext | null }
        if (data.lastLinkContext) {
          setLastLinkContext(data.lastLinkContext)
          saveLastLinkContext(area, data.lastLinkContext)
        }
        const assistantMsg: Message = {
          id: `a-${Date.now()}`,
          role: 'assistant',
          content: data.response?.trim() || 'Desculpe, não consegui processar. Tente novamente.',
          timestamp: new Date(),
          linkContext: data.lastLinkContext ?? undefined,
        }
        setMessages((prev) => [...prev, assistantMsg])
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Erro de conexão. Tente novamente.'
        setMessages((prev) => [
          ...prev,
          { id: `e-${Date.now()}`, role: 'assistant', content: `❌ ${msg}`, timestamp: new Date() },
        ])
      } finally {
        setLoading(false)
        inputRef.current?.focus()
      }
    },
    [
      area,
      authenticatedFetch,
      lastLinkContext,
      loading,
      messages,
      locale,
      trackNoelPaywallOnceIfNeeded,
      resolvedChatApi,
      proLideresPayload,
    ]
  )

  const showSuggestions =
    !hideSuggestions && messages.length === 1 && messages[0]?.role === 'assistant'

  return (
    <div className={`flex flex-col rounded-2xl border border-sky-100 bg-white shadow-lg overflow-hidden ${className}`}>
      <div
        className={`flex items-center gap-3 border-b border-sky-200 bg-sky-100/80 px-4 py-2.5 ${
          showChatHeaderTitle ? 'justify-between' : 'justify-end'
        }`}
      >
        {showChatHeaderTitle && (
          <div className="min-w-0 flex flex-1 items-center gap-2 sm:gap-3">
            {showHeaderEmoji && (
              <span className="text-lg shrink-0" aria-hidden>
                🧠
              </span>
            )}
            <div className="min-w-0 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <span className="text-sm font-bold text-sky-800">{headerTitle ?? 'Noel — Mentor estratégico'}</span>
              {headerTagline?.trim() ? (
                <span className="text-xs font-medium leading-snug text-sky-800/85">{headerTagline.trim()}</span>
              ) : null}
            </div>
          </div>
        )}
        <button
          type="button"
          onClick={clearChat}
          className="flex shrink-0 items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-sky-600 hover:text-sky-800 hover:bg-sky-100/80 rounded-lg transition-colors opacity-80 hover:opacity-100"
          title="Limpar conversa e começar do zero"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Limpar
        </button>
      </div>
      <div className="flex-1 overflow-y-auto min-h-[380px] max-h-[70vh] p-4 sm:p-5 space-y-5 bg-gradient-to-b from-sky-50/50 to-white">
        {messages.map((msg) => {
          if (msg.role === 'assistant' && msg.id === 'welcome' && !String(msg.content ?? '').trim()) {
            return null
          }
          const isLastAssistantMessage = lastAssistantMsg?.id === msg.id
          const ctxForMarkdown =
            msg.role === 'assistant'
              ? msg.linkContext ?? (isLastAssistantMessage ? lastLinkContext : null)
              : null
          const quizSlimHref =
            msg.role === 'assistant' && proLideresPayload
              ? ctxForMarkdown?.url ?? null
              : msg.role === 'assistant'
                ? ctxForMarkdown?.url ?? extractFirstHttpUrl(msg.content)
                : null
          const assistantMarkdownSource =
            msg.role === 'assistant' && quizSlimHref
              ? stripMarkdownProLideresProximoPassoSection(
                  sanitizeProLideresQuizMarkdownToCanonicalUrl(
                    stripRedundantUrlCodeFence(msg.content, quizSlimHref),
                    quizSlimHref
                  )
                )
              : msg.content
          const assistantMarkdownNormalized =
            msg.role === 'assistant' ? normalizeNoelAssistantMarkdown(assistantMarkdownSource) : ''

          return (
          <div
            key={msg.id}
            data-noel-role={msg.role}
            data-noel-msg={msg.role === 'user' ? msg.content : undefined}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[92%] sm:max-w-[88%] rounded-xl px-4 py-3.5 ${
                msg.role === 'user'
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-500/20'
                  : hasLink(msg.content)
                    ? 'bg-white text-gray-800 border-2 border-sky-100 shadow-md'
                    : 'bg-white text-gray-800 border border-gray-100 shadow-sm'
              }`}
            >
              {msg.role === 'user' ? (
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              ) : (
                <div>
                  <div className="prose prose-sm max-w-none prose-p:my-4 prose-p:leading-relaxed prose-ul:my-5 prose-li:my-2 prose-li:leading-relaxed prose-strong:text-gray-900 prose-a:no-underline hover:prose-a:underline prose-hr:my-8 prose-hr:border-sky-100 [&_h3]:border-l-4 [&_h3]:border-sky-400 [&_h3]:pl-3 [&_h3]:-ml-1 [&_h3]:border-b [&_h3]:border-sky-100 [&_h3]:pb-2 [&_h3]:mb-4 [&_h3]:mt-8 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-sky-600">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm, remarkBreaks]}
                      components={{
                        a: ({ href, children }) => {
                          const hrefAbsolutized =
                            proLideresPayload && href ? absolutizeYladaPublicLinkHref(href) ?? href : href
                          const effectiveHref =
                            proLideresPayload && quizSlimHref && hrefAbsolutized
                              ? proLideresEffectivePublicHref(hrefAbsolutized, quizSlimHref)
                              : hrefAbsolutized
                          /** Um só chip «abrir» no texto: sem segundo «Copiar link» (há «Copiar link público» abaixo). */
                          const proLideresPublicQuizChip =
                            proLideresPayload &&
                            quizSlimHref &&
                            effectiveHref &&
                            looksLikeYladaPublicLinkPath(hrefAbsolutized ?? '')
                          if (proLideresPublicQuizChip) {
                            return (
                              <a
                                key={effectiveHref}
                                href={effectiveHref}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 w-fit max-w-full px-3 py-2 rounded-lg bg-sky-50 text-sky-700 font-medium hover:bg-sky-100 transition-colors border border-sky-200 mt-2 mb-1 no-underline hover:underline break-all"
                              >
                                <span className="truncate">{children}</span>
                                <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                  />
                                </svg>
                              </a>
                            )
                          }
                          return (
                            <LinkWithCopy key={effectiveHref ?? href ?? undefined} href={effectiveHref}>
                              {children}
                            </LinkWithCopy>
                          )
                        },
                        p: ({ children, className, ...props }) => {
                          const plain = markdownPlainText(children).trim()
                          const looksLikeQuestion = plain.endsWith('?') && plain.length > 3
                          return (
                            <p
                              {...props}
                              className={[className, looksLikeQuestion ? 'font-semibold text-gray-900' : '']
                                .filter(Boolean)
                                .join(' ')}
                            >
                              {children}
                            </p>
                          )
                        },
                      }}
                    >
                      {assistantMarkdownNormalized}
                    </ReactMarkdown>
                  </div>
                  {capilarFeedbackEnabled &&
                  msg.role === 'assistant' &&
                  msg.id !== 'welcome' &&
                  String((assistantMarkdownNormalized || msg.content) ?? '').trim().length >= 20 ? (
                    <div className="mt-2 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-2">
                      <span className="text-[11px] font-medium text-gray-500">Esta resposta ajudou?</span>
                      {capilarFeedbackByMsgId[msg.id] ? (
                        <span className="text-[11px] font-medium text-emerald-700">Obrigado pelo feedback.</span>
                      ) : (
                        <>
                          <button
                            type="button"
                            className="touch-manipulation rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs font-semibold text-gray-700 hover:border-emerald-300 hover:bg-emerald-50/80"
                            aria-label="Marcar como útil"
                            onClick={() => void submitCapilarNoelFeedback(msg.id, 'up', msg.content)}
                          >
                            Útil
                          </button>
                          <button
                            type="button"
                            className="touch-manipulation rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs font-semibold text-gray-700 hover:border-rose-200 hover:bg-rose-50/80"
                            aria-label="Marcar como não útil"
                            onClick={() => void submitCapilarNoelFeedback(msg.id, 'down', msg.content)}
                          >
                            Não ajudou
                          </button>
                        </>
                      )}
                    </div>
                  ) : null}
                  {proLideresPayload &&
                    !disableYladaLinkEditor &&
                    msg.role === 'assistant' &&
                    msg.id !== 'welcome' &&
                    lastAssistantMsg?.id === msg.id &&
                    !loading &&
                    !msg.linkContext?.link_id &&
                    assistantContentIsProLideresQuizDraftNoOfficialLink(msg.content) ? (
                    <div className="mt-3 flex flex-col gap-2 border-t border-sky-100 pt-3">
                      <p className="text-xs font-medium text-sky-900/90">
                        Quando estiver satisfeito com o rascunho, gere o link — ou peça ajustes no chat.
                      </p>
                      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                        <button
                          type="button"
                          disabled={loading}
                          onClick={() =>
                            void sendMessage(
                              'Aprovo o rascunho. Gera o link oficial na minha conta YLADA agora.'
                            )
                          }
                          className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-sky-500/20 hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50 touch-manipulation transition-colors"
                        >
                          Gostei — gerar o link
                        </button>
                        <button
                          type="button"
                          disabled={loading}
                          onClick={() => {
                            setInput('Quero ajustar o fluxo: ')
                            queueMicrotask(() => inputRef.current?.focus())
                          }}
                          className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-sky-300 bg-white px-4 py-2.5 text-sm font-semibold text-sky-900 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50 touch-manipulation"
                        >
                          Pedir ajustes antes do link
                        </button>
                      </div>
                    </div>
                  ) : null}
                  {lastAssistantMsg?.id === msg.id &&
                    msg.id !== 'welcome' &&
                    messageHasScript(msg.content) &&
                    !(proLideresPayload && isExtractedScriptOnlyUrl(msg.content)) && (
                    <button
                      type="button"
                      onClick={() => copyScript(msg)}
                      className="mt-3 flex items-center gap-1.5 px-3 py-2 rounded-lg bg-sky-50 text-sky-700 text-sm font-medium hover:bg-sky-100 transition-colors border border-sky-200"
                    >
                      {copiedScriptId === msg.id ? (
                        <>
                          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Copiado!
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h2m8 0h2a2 2 0 012 2v2m0 8a2 2 0 01-2 2h-2m-4-4V6" />
                          </svg>
                          Copiar
                        </>
                      )}
                    </button>
                  )}
                  {msg.id !== 'welcome' && msg.role === 'assistant' && !disableYladaLinkEditor && (() => {
                    const isLastAssistantMessage = lastAssistantMsg?.id === msg.id
                    const ctxForMessage = msg.linkContext ?? (isLastAssistantMessage ? lastLinkContext : null)
                    const hasQuizContent = messageContainsQuizContent(msg.content, ctxForMessage)
                    if (!hasQuizContent) return null
                    const quizUrl =
                      proLideresPayload && ctxForMessage?.url
                        ? ctxForMessage.url
                        : ctxForMessage?.url ?? extractFirstHttpUrl(msg.content)
                    const isSessionQuizLink =
                      Boolean(ctxForMessage?.link_id && lastLinkContext?.link_id === ctxForMessage.link_id)
                    const sessionCatalogVis = isSessionQuizLink ? lastLinkContext?.visible_to_team_in_catalog : undefined
                    const showDisponibilizarCatalog =
                      proLideresPayload &&
                      Boolean(quizUrl && ctxForMessage?.link_id) &&
                      isSessionQuizLink &&
                      sessionCatalogVis !== true
                    const showVerCatalogoAposDisponibilizar =
                      proLideresPayload &&
                      Boolean(quizUrl && ctxForMessage?.link_id) &&
                      isSessionQuizLink &&
                      sessionCatalogVis === true
                    const lid = ctxForMessage?.link_id
                    const alreadyInLibrary =
                      Boolean(lid) &&
                      (Boolean(libraryPublishedIds[lid!]) || readProLideresLibraryPublishedFlag(lid!))
                    return (
                      <>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {ctxForMessage?.link_id && (
                            <Link
                              href={`${yladaMatrixPathPrefix}/links/editar/${ctxForMessage.link_id}`}
                              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-sky-600 text-white text-sm font-medium hover:bg-sky-700 transition-colors touch-manipulation"
                            >
                              {proLideresPayload ? 'Editar na Ylada' : 'Editar quiz'}
                            </Link>
                          )}
                          {proLideresPayload && (proLideresLeaderLibraryFlow || proEsteticaNoelLinkToolbar) && quizUrl ? (
                            <a
                              href={quizUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex min-h-[40px] items-center gap-2 px-3 py-2 rounded-lg bg-indigo-600 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors touch-manipulation"
                            >
                              Abrir e testar
                            </a>
                          ) : null}
                          {proLideresPayload && proLideresLeaderLibraryFlow && lid && quizUrl && !alreadyInLibrary ? (
                            <button
                              type="button"
                              disabled={loading || linkMetaBusy}
                              onClick={() => {
                                setLinkMetaError(null)
                                setPublishKindModal({ linkId: lid!, publicUrl: quizUrl })
                              }}
                              className="inline-flex min-h-[40px] items-center gap-2 rounded-lg border-2 border-indigo-500 bg-white px-3 py-2 text-sm font-semibold text-indigo-900 hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-50 touch-manipulation"
                            >
                              Publicar na minha biblioteca…
                            </button>
                          ) : null}
                          {proLideresPayload && proLideresLeaderLibraryFlow && lid && alreadyInLibrary ? (
                            <Link
                              href={`${proLideresPainelCatalogHref}?highlightYladaLink=${lid}&section=mine`}
                              className="inline-flex min-h-[40px] items-center gap-2 rounded-lg border border-indigo-300 bg-white px-3 py-2 text-sm font-semibold text-indigo-800 hover:bg-indigo-50 touch-manipulation"
                            >
                              Abrir o meu catálogo
                            </Link>
                          ) : null}
                          {quizUrl && (
                            <button
                              type="button"
                              onClick={async () => {
                                const ok = await copyTextToClipboard(quizUrl)
                                if (!ok) return
                                setCopiedQuizLinkMsgId(msg.id)
                                setTimeout(() => setCopiedQuizLinkMsgId((prev) => (prev === msg.id ? null : prev)), 2000)
                              }}
                              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-sky-50 text-sky-700 text-sm font-medium border border-sky-200 hover:bg-sky-100 transition-colors touch-manipulation"
                            >
                              {copiedQuizLinkMsgId === msg.id
                                ? 'Copiado!'
                                : proLideresPayload
                                  ? 'Copiar link público'
                                  : 'Copiar link do quiz'}
                            </button>
                          )}
                          {proLideresPayload && ctxForMessage?.link_id ? (
                            <Link
                              href={`${proLideresPainelCatalogHref}?highlightYladaLink=${ctxForMessage.link_id}&section=mine`}
                              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-violet-50 text-violet-900 text-sm font-medium border border-violet-200 hover:bg-violet-100 transition-colors touch-manipulation"
                            >
                              Catálogo (Minhas ferramentas)
                            </Link>
                          ) : null}
                          {showDisponibilizarCatalog ? (
                            <button
                              type="button"
                              disabled={shareCatalogBusy}
                              onClick={() => void shareToolWithTeam()}
                              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-50 text-emerald-900 text-sm font-medium border border-emerald-200 hover:bg-emerald-100 transition-colors touch-manipulation disabled:opacity-50"
                            >
                              {shareCatalogBusy ? 'Disponibilizando…' : 'Disponibilizar à equipe'}
                            </button>
                          ) : null}
                          {showVerCatalogoAposDisponibilizar ? (
                            <Link
                              href={proLideresPainelCatalogHref}
                              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-50 text-emerald-900 text-sm font-medium border border-emerald-200 hover:bg-emerald-100 transition-colors touch-manipulation"
                            >
                              Ver no catálogo
                            </Link>
                          ) : null}
                        </div>
                      </>
                    )
                  })()}
                </div>
              )}
            </div>
          </div>
          )
        })}
        {showSuggestions && (contextualActions?.length ? contextualActions : uxContent.suggestions).length > 0 && (
          <div className="pt-2 pb-1">
            {!hideSuggestionsHeading ? (
              <p className="text-xs font-medium text-gray-500 mb-2">Sugestões:</p>
            ) : null}
            <div className="flex flex-wrap gap-2">
              {(contextualActions?.length ? contextualActions : uxContent.suggestions).map((s, i) => {
                const action = contextualActions?.length ? (contextualActions[i] as NoelContextualAction) : null
                if (action?.href) {
                  return (
                    <Link
                      key={action.label}
                      href={action.href}
                      className="px-4 py-2.5 rounded-xl bg-sky-50 text-sky-700 text-sm font-medium hover:bg-sky-100 border border-sky-200 transition-colors inline-flex items-center"
                    >
                      {action.label}
                    </Link>
                  )
                }
                if (action?.whatsappShareUrl) {
                  const waUrl = `https://wa.me/?text=${encodeURIComponent(action.whatsappShareUrl)}`
                  return (
                    <a
                      key={action.label}
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 rounded-xl bg-[#25D366]/10 text-[#128C7E] text-sm font-medium hover:bg-[#25D366]/20 border border-[#25D366]/30 transition-colors inline-flex items-center"
                    >
                      {action.label}
                    </a>
                  )
                }
                if (action?.copyUrl) {
                  return (
                    <button
                      key={action.label}
                      type="button"
                      onClick={async () => {
                        const ok = await copyTextToClipboard(action.copyUrl!)
                        if (ok) {
                          setCopiedActionLabel(action.label)
                          setTimeout(() => setCopiedActionLabel(null), 2000)
                        }
                      }}
                      className="px-4 py-2.5 rounded-xl bg-sky-50 text-sky-700 text-sm font-medium hover:bg-sky-100 border border-sky-200 transition-colors inline-flex items-center"
                    >
                      {copiedActionLabel === action.label ? '✅ Copiado!' : action.label}
                    </button>
                  )
                }
                const prompt = action?.prompt ?? (s as { label: string; prompt: string }).prompt
                return (
                  <button
                    key={action?.label ?? (s as { label: string }).label}
                    type="button"
                    onClick={() => handleSuggestionClick(prompt)}
                    disabled={loading}
                    className="px-4 py-2.5 rounded-xl bg-sky-50 text-sky-700 text-sm font-medium hover:bg-sky-100 border border-sky-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {action?.label ?? (s as { label: string }).label}
                  </button>
                )
              })}
            </div>
          </div>
        )}
        {publishKindModal ? (
          <div
            className="fixed inset-0 z-[100] flex items-end justify-center bg-black/45 p-4 sm:items-center"
            role="dialog"
            aria-modal="true"
            aria-labelledby="pl-publish-lib-title"
          >
            <div className="w-full max-w-md rounded-2xl border border-indigo-200 bg-white p-5 shadow-2xl">
              <h2 id="pl-publish-lib-title" className="text-lg font-bold text-slate-900">
                Publicar na tua biblioteca
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Escolhe o separador do catálogo onde esta ferramenta deve aparecer em{' '}
                <strong>Minhas ferramentas</strong> (podes mudar depois no catálogo).
              </p>
              {linkMetaError ? (
                <p className="mt-2 text-sm text-red-600" role="alert">
                  {linkMetaError}
                </p>
              ) : null}
              <div className="mt-4 flex flex-col gap-2">
                <button
                  type="button"
                  disabled={linkMetaBusy}
                  onClick={() => void confirmPublishCatalogKind('sales')}
                  className="min-h-[48px] rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 touch-manipulation"
                >
                  {linkMetaBusy ? 'A guardar…' : 'Vendas'}
                </button>
                <button
                  type="button"
                  disabled={linkMetaBusy}
                  onClick={() => void confirmPublishCatalogKind('recruitment')}
                  className="min-h-[48px] rounded-xl border-2 border-violet-600 bg-violet-50 px-4 py-3 text-sm font-semibold text-violet-950 hover:bg-violet-100 disabled:opacity-50 touch-manipulation"
                >
                  {linkMetaBusy ? 'A guardar…' : 'Recrutamento'}
                </button>
                <button
                  type="button"
                  disabled={linkMetaBusy}
                  onClick={() => {
                    setPublishKindModal(null)
                    setLinkMetaError(null)
                  }}
                  className="min-h-[44px] rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        ) : null}
        {loading && (
          <div className="flex justify-start">
            <div className="rounded-xl px-4 py-3 bg-white border border-sky-100 shadow-sm">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 bg-sky-400 rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                <span className="w-2 h-2 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
              </div>
            </div>
          </div>
        )}
        {showEditarConcordoButtons && (
          <div className="flex flex-col gap-2 pt-2">
            {proLideresPayload ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/90 px-3 py-2.5 text-xs text-emerald-950">
                <p className="font-semibold text-emerald-900">Próximos passos</p>
                <ul className="mt-1.5 list-disc space-y-1 pl-4 text-emerald-900/95">
                  <li>
                    O link <strong>já está salvo</strong> na sua conta YLADA — não precisa guardar de novo neste chat.
                  </li>
                  <li>
                    Use <strong>Editar perguntas</strong> (matriz Ylada) ou veja a lista em{' '}
                    <strong>Links na Ylada</strong> / <strong>Links no painel</strong> abaixo; <strong>Concordo</strong>{' '}
                    se esta versão já serve, ou <strong>Pedir ajuste ao Noel</strong> para continuar no chat.
                  </li>
                  <li>
                    A equipe <strong>só vê no Catálogo</strong> depois de <strong>Disponibilizar à equipe</strong> (botão
                    na mensagem do quiz ou abaixo) ou ao ativar a visibilidade em{' '}
                    <Link
                      href={proLideresPainelCatalogHref}
                      className="font-semibold text-emerald-950 underline decoration-emerald-600/60 hover:no-underline"
                    >
                      Catálogo de ferramentas
                    </Link>{' '}
                    → <strong>Minhas ferramentas</strong>.
                  </li>
                </ul>
              </div>
            ) : null}
            {shareCatalogError ? (
              <p className="text-xs text-red-600 px-1" role="alert">
                {shareCatalogError}
              </p>
            ) : null}
            {showShareWithTeamButton ? (
              <div className="flex flex-col gap-1.5">
                <button
                  type="button"
                  disabled={shareCatalogBusy}
                  onClick={() => void shareToolWithTeam()}
                  className="inline-flex w-full sm:w-auto items-center justify-center gap-2 px-4 py-3 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition-colors disabled:opacity-50 touch-manipulation shadow-md"
                >
                  {shareCatalogBusy ? 'Disponibilizando…' : 'Disponibilizar à equipe (catálogo)'}
                </button>
                <p className="text-xs text-slate-600 max-w-xl">
                  Passa a aparecer para cada pessoa em <strong>Catálogo → Minhas ferramentas</strong> no painel da
                  equipa. O número de WhatsApp no resultado do fluxo é o que estiver definido na <strong>matriz YLADA</strong>{' '}
                  (editar o link); cada membro trabalha a partir da <strong>sua sessão</strong> no painel.
                </p>
              </div>
            ) : null}
            {showAlreadySharedInCatalog ? (
              <p className="text-xs text-emerald-800 bg-emerald-50/80 border border-emerald-200 rounded-lg px-3 py-2">
                Esta ferramenta já está <strong>disponível para a equipe</strong> no catálogo. Você pode ajustar a
                visibilidade em{' '}
                <Link href={proLideresPainelCatalogHref} className="font-semibold underline hover:no-underline">
                  Catálogo → Minhas ferramentas
                </Link>
                .
              </p>
            ) : null}
            <div className="flex flex-wrap gap-2">
              <Link
                href={`${yladaMatrixPathPrefix}/links/editar/${ctxForLinkActions!.link_id}`}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 text-white text-sm font-medium hover:bg-sky-700 transition-colors touch-manipulation"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Editar perguntas
              </Link>
              {ctxForLinkActions?.url && (
                <a
                  href={ctxForLinkActions.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-50 text-sky-700 text-sm font-medium border border-sky-200 hover:bg-sky-100 transition-colors touch-manipulation"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  Abrir link
                </a>
              )}
              {proLideresPayload ? (
                <>
                  <button
                    type="button"
                    onClick={() => router.push(`${yladaMatrixPathPrefix}/links`)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-50 text-sky-700 text-sm font-medium border border-sky-200 hover:bg-sky-100 transition-colors touch-manipulation"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Links na Ylada
                  </button>
                  <Link
                    href={noelPainelSecondaryToolsHref}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-50 text-violet-900 text-sm font-medium border border-violet-200 hover:bg-violet-100 transition-colors touch-manipulation"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                    {noelPainelSecondaryToolsLabel}
                  </Link>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => router.push(`${yladaMatrixPathPrefix}/links`)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-50 text-sky-700 text-sm font-medium border border-sky-200 hover:bg-sky-100 transition-colors touch-manipulation"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Ver meus links
                </button>
              )}
              {proLideresPayload ? (
                <>
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() =>
                      void sendMessage(
                        'Concordo com as perguntas e com o link como estão. Por agora não quero alterar o texto do quiz neste chat.'
                      )
                    }
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors touch-manipulation disabled:opacity-50"
                  >
                    Concordo
                  </button>
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => {
                      setInput('Noel, ajusta este quiz: ')
                      queueMicrotask(() => inputRef.current?.focus())
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-emerald-600 bg-white text-emerald-900 text-sm font-medium hover:bg-emerald-50 transition-colors touch-manipulation disabled:opacity-50"
                  >
                    Pedir ajuste ao Noel
                  </button>
                </>
              ) : null}
            </div>
          </div>
        )}
        <div ref={scrollEndRef} />
      </div>

      <div className="border-t border-sky-100 p-3 sm:p-4 bg-white">
        <div className="flex gap-3 items-end">
          <div className="flex-1 flex flex-col gap-1">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={uxContent.placeholder}
              rows={1}
              disabled={loading}
              className="min-h-[48px] max-h-32 px-4 py-3 text-sm border border-sky-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-400 resize-none disabled:opacity-60 placeholder:text-gray-400"
            />
            {!hideInputHint && (
              <span className="text-xs text-gray-400">{uxContent.placeholderExample}</span>
            )}
          </div>
          <button
            type="button"
            onClick={() => void sendMessage()}
            disabled={!input.trim() || loading}
            className="h-[48px] px-6 bg-sky-600 text-white rounded-xl hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold shrink-0 shadow-md flex items-center gap-2"
          >
            {loading ? '⏳' : '➤'}
            <span className="hidden sm:inline">{sendButtonLabel ?? 'Perguntar ao Noel'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
