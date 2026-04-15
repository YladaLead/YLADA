'use client'

import { useState, useRef, useEffect, useCallback, type ReactNode } from 'react'
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

  t = t.replace(/\n{3,}/g, '\n\n')
  return t
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
  return Boolean(path?.includes('/pro-lideres/noel') || path?.includes('/pro-estetica-corporal/noel'))
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
  /** Links da matriz YLADA para esteticista ficam em /pt/estetica, não na rota do painel embed. */
  const yladaMatrixPathPrefix =
    area === 'pro_estetica_corporal' || resolvedChatApi?.includes('/pro-estetica-corporal/noel')
      ? getYladaAreaPathPrefix('estetica')
      : getYladaAreaPathPrefix(area)
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

  const sendMessage = useCallback(async () => {
    const text = input.trim()
    if (!text || loading) return

    setInput('')
    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMsg])
    setLoading(true)

    try {
      const conversationHistory = messages
        .filter((m) => m.role === 'user' || m.role === 'assistant')
        .slice(-12)
        .map((m) => ({ role: m.role, content: m.content }))

      const res = await authenticatedFetch(resolvedChatApi, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          proLideresPayload
            ? { message: text, conversationHistory, locale }
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

  /** Extrai apenas o script da última mensagem do Noel (para copiar sem o resto). */
  function extractScriptFromMessage(content: string): string {
    const trimmed = content.trim()
    if (!trimmed) return trimmed

    // 1. Bloco de código (```...```) — scripts costumam vir em code block
    const codeBlockMatch = trimmed.match(/```(?:[\w]*)\n?([\s\S]*?)```/)
    if (codeBlockMatch) {
      const inner = codeBlockMatch[1].trim()
      if (inner.length > 20) return inner
    }

    // 2. Após "Script:" ou "📝 Script:" ou "💬 Script:" ou "Script sugerido:" ou "Script pronto:"
    const scriptHeaderMatch = trimmed.match(
      /(?:📝|💬)?\s*(?:Script\s*(?:sugerido|pronto)?\s*:?\s*|Chamada para Ação\s*:?\s*)\n+([\s\S]*?)(?=\n###|\n---|\n📝|\n💬|\n🔗|\n💡|$)/i
    )
    if (scriptHeaderMatch) {
      const extracted = scriptHeaderMatch[1].trim()
      if (extracted.length > 15) return extracted
    }

    // 3. Seção ### Chamada para Ação
    const ctaMatch = trimmed.match(/###\s*Chamada para Ação\s*\n+([\s\S]*?)(?=\n###|$)/i)
    if (ctaMatch) {
      const extracted = ctaMatch[1].trim()
      if (extracted.length > 15) return extracted
    }

    // 4. Bloco que parece mensagem para enviar (começa com Oi/Olá, várias linhas)
    const msgBlockMatch = trimmed.match(/(?:^|\n)((?:Oi|Olá|Olá\s+\[?nome\]?)[\s\S]*?)(?=\n\n(?:###|📝|🔗|💡|$)|\n---|$)/i)
    if (msgBlockMatch) {
      const extracted = msgBlockMatch[1].trim()
      if (extracted.length > 30) return extracted
    }

    // 5. Fallback: retorna a mensagem inteira
    return trimmed
  }

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
    const t = content.trim()
    if (!t) return false
    const hasLink = /\[.*?\]\(https?:\/\/[^)]+\)/.test(t) || /https?:\/\/[^\s)]+/.test(t)
    if (!hasLink) return false
    // Aceita: seção ###, estrutura de quiz (perguntas + A) B) C) D)), ou só link (formato natural)
    const hasSecaoPerguntas = /###\s*(?:AQUI ESTÃO AS PERGUNTAS|Chamada para Ação|Link Inteligente)/i.test(t)
    const hasEstruturaQuiz = (/\d+\.\s+/.test(t) || /\*\*\d+\.\s+/.test(t)) && /[A-D]\)\s+/.test(t)
    const hasFormatoNatural = /aqui está o link|acesse seu quiz|preparei um diagnóstico/i.test(t)
    return hasSecaoPerguntas || hasEstruturaQuiz || hasFormatoNatural
  }

  const ctxForLinkActions = lastAssistantMsg?.linkContext ?? null
  const lastAssistantHasLinkContext = Boolean(lastAssistantMsg?.linkContext?.link_id)
  const showEditarConcordoButtons =
    !disableYladaLinkEditor &&
    lastAssistantHasLinkContext &&
    !loading &&
    lastAssistantMsg &&
    messageContainsQuizContent(lastAssistantMsg.content, ctxForLinkActions)

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
              ? { message: text, conversationHistory, locale }
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
                  <div className="prose prose-sm max-w-none prose-p:my-4 prose-p:leading-relaxed prose-ul:my-5 prose-li:my-2 prose-li:leading-relaxed prose-strong:text-gray-900 prose-a:no-underline hover:prose-a:underline [&_h3]:border-l-4 [&_h3]:border-sky-400 [&_h3]:pl-3 [&_h3]:-ml-1 [&_h3]:border-b [&_h3]:border-sky-100 [&_h3]:pb-2 [&_h3]:mb-4 [&_h3]:mt-8 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-sky-600">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm, remarkBreaks]}
                      components={{
                        a: ({ href, children }) => <LinkWithCopy key={href ?? undefined} href={href}>{children}</LinkWithCopy>,
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
                      {normalizeNoelAssistantMarkdown(msg.content)}
                    </ReactMarkdown>
                  </div>
                  {lastAssistantMsg?.id === msg.id && msg.id !== 'welcome' && messageHasScript(msg.content) && (
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
                    const quizUrl = ctxForMessage?.url ?? extractFirstHttpUrl(msg.content)
                    return (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {ctxForMessage?.link_id && (
                          <Link
                            href={`${yladaMatrixPathPrefix}/links/editar/${ctxForMessage.link_id}`}
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-sky-600 text-white text-sm font-medium hover:bg-sky-700 transition-colors touch-manipulation"
                          >
                            Editar quiz
                          </Link>
                        )}
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
                            {copiedQuizLinkMsgId === msg.id ? 'Copiado!' : 'Copiar link do quiz'}
                          </button>
                        )}
                      </div>
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
          <div className="flex flex-wrap gap-2 pt-2">
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
            onClick={sendMessage}
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
