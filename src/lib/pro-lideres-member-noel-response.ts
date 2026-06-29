import type {
  ProLideresMemberNoelMode,
  ProLideresMemberNoelRoute,
} from '@/lib/pro-lideres-member-noel-router'
import {
  isMemberNoelConversationalQuery,
} from '@/lib/pro-lideres-member-noel-router'
import { sanitizeNoelAssistantOutput } from '@/lib/noel-output-sanitize'

const SECTION_LABELS = [
  'Na prática',
  'Mensagem pronta',
  'Legenda curta',
  'Link para enviar',
  'Próximo passo',
] as const

/** Fallback genérico — não injetar; só remover duplicatas. */
export const MEMBER_NOEL_GENERIC_READY_MSG =
  'Oi, [nome]! Posso te ajudar com calma — me conta o que está pesando mais pra você? 😊'

const GENERIC_LINK_HINT =
  'Veja **Meus links** no seu painel YLADA e use o que o líder liberou para este momento.'

const PLAIN_SECTION_LABELS = [
  'Na prática',
  'Mensagem pronta',
  'Legenda curta',
  'Link para enviar',
  'Próximo passo',
  'Amanhã',
] as const

/** Linha só com o título da seção (sem negrito) → markdown bold. */
export function normalizePlainSectionHeadings(text: string): string {
  let t = text.replace(/\r\n/g, '\n')
  for (const label of PLAIN_SECTION_LABELS) {
    const out = label === 'Amanhã' ? 'Próximo passo' : label
    const esc = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    t = t.replace(new RegExp(`^${esc}\\s*$`, 'gim'), `**${out}**`)
  }
  return t
}

/** Remove títulos de seção repetidos em sequência. */
export function collapseDuplicateSectionHeadings(text: string): string {
  let t = text
  for (const label of PLAIN_SECTION_LABELS) {
    const out = label === 'Amanhã' ? 'Próximo passo' : label
    const esc = out.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    t = t.replace(new RegExp(`(\\*\\*${esc}\\*\\*\\s*\\n+){2,}`, 'gi'), `**${out}**\n\n`)
  }
  return t
}

function hasMemberNoelSection(text: string, label: string): boolean {
  const esc = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return (
    new RegExp(`\\*\\*${esc}\\*\\*`, 'i').test(text) || new RegExp(`(^|\\n)${esc}\\s*$`, 'im').test(text)
  )
}

function textHasCatalogUrl(text: string): boolean {
  return /https?:\/\//i.test(text)
}

/** Troca “Wellness” como marca da plataforma por YLADA / Pro Líderes. */
export function sanitizeProLideresMemberNoelBrand(text: string): string {
  return text
    .replace(/\bno\s+Wellness\b/gi, 'na YLADA')
    .replace(/\bNo\s+Wellness\b/g, 'Na YLADA')
    .replace(/\bem\s+Wellness\b/gi, 'na YLADA')
    .replace(/\bWellness\b/g, 'YLADA')
}

/** Remove metadados técnicos que o modelo às vezes vaza na resposta. */
function stripMemberNoelDebugLines(text: string): string {
  return text
    .split('\n')
    .filter((line) => {
      const t = line.trim()
      if (!t) return true
      if (/^(perfil|link|noelProfileId|modo|router)\s*:/i.test(t)) return false
      if (/noel_pro_lideres_member/i.test(t) && t.length < 120) return false
      return true
    })
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

/** Títulos em negrito em vez de ### (menos “cara de IA estruturada”). */
export function softenProLideresMemberNoelMarkdown(text: string): string {
  let t = text
  t = t.replace(/^###\s*Situação\s*$/gim, '')
  t = t.replace(/^###\s*Princípio\s*$/gim, '')
  t = t.replace(/^###\s*(.+)$/gm, '**$1**')
  return t.replace(/\n{3,}/g, '\n\n').trim()
}

/** Espaço antes/depois de Na prática, Mensagem pronta, Próximo passo, etc. */
export function formatMemberNoelSectionSpacing(text: string): string {
  let t = text.replace(/\r\n/g, '\n')

  for (const label of SECTION_LABELS) {
    const esc = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    t = t.replace(new RegExp(`([^\\n])\\s*\\*\\*${esc}\\*\\*`, 'gi'), `$1\n\n**${label}**`)
    t = t.replace(
      new RegExp(`\\*\\*${esc}\\*\\*\\s*(?!\\n\\n)([^\\n])`, 'gi'),
      `**${label}**\n\n$1`
    )
  }

  t = t.replace(/\*\*Amanhã\*\*/gi, '**Próximo passo**')

  t = t.replace(/\n{3,}/g, '\n\n').trim()
  return t
}

function shouldHaveProximoPasso(route: ProLideresMemberNoelRoute, userMessage: string): boolean {
  if (route.mode === 'conversacional' || isMemberNoelConversationalQuery(userMessage)) return false
  return true
}

function shouldHaveNaPratica(route: ProLideresMemberNoelRoute, userMessage: string): boolean {
  if (route.mode === 'conversacional' || isMemberNoelConversationalQuery(userMessage)) return false
  return true
}

/** Extrai nome + URL do bloco Link para enviar (formato UI). */
export function parseLinkParaEnviarSection(body: string): { label: string; url: string } | null {
  const urlMatch = body.match(/https?:\/\/[^\s)\]>]+/i)
  if (!urlMatch?.[0]) return null
  const url = urlMatch[0].replace(/[.,;]+$/, '')
  let label = body.slice(0, urlMatch.index ?? 0).trim()
  label = label.replace(/\*\*([^*]+)\*\*/g, '$1').replace(/[\[—–,\]]+/g, ' ').trim()
  label = label.replace(/\s*:\s*$/, '').trim()
  if (!label || /^link$/i.test(label)) {
    const parts = body.split(/\s*[—–,-]\s*/).map((p) => p.trim()).filter(Boolean)
    const namePart = parts.find((p) => !/^https?:\/\//i.test(p))
    label = namePart?.replace(/\*\*/g, '').trim() || 'Link'
  }
  return { label, url }
}

/** Formata bloco Link para enviar sem travessão entre nome e URL. */
export function formatLinkParaEnviarBody(body: string): string {
  const parsed = parseLinkParaEnviarSection(body)
  if (!parsed) return body
  const suffix = body.slice(body.indexOf(parsed.url) + parsed.url.length).trim()
  const reason = suffix.replace(/^[\s,—–-]+/, '').trim()
  const base = `${parsed.label}: ${parsed.url}`
  return reason ? `${base}\n\n${reason}` : base
}

function normMsg(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .trim()
}

/** Pedido explícito de copy WhatsApp — só a mensagem do usuário, não o corpo da resposta. */
export function userExplicitlyWantsReadyMessage(userMessage: string): boolean {
  const um = normMsg(userMessage)
  if (/mensagem pronta/.test(um)) return true
  if (/(me d[aá]|me mande|me passa|quero).*(mensagem|texto|script)/.test(um)) return true
  if (/o que (falar|mandar|escrever)|como (falar|mandar|escrever|responder|me comunico)/.test(um)) {
    return true
  }
  if (/(whatsapp|zap)/.test(um) && /(mensagem|texto|falar|mandar|escrever|responder|visualiz)/.test(um)) {
    return true
  }
  if (/(objecao|objeção|caro|vou pensar)/.test(um) && /(mensagem|texto|orienta)/.test(um)) {
    return true
  }
  return false
}

export function isGenericReadyMessage(body: string): boolean {
  const b = normMsg(body)
  return b.includes('posso te ajudar com calma') && b.includes('o que esta pesando')
}

export function isGenericLinkHint(body: string): boolean {
  return /veja\s+\*\*meus links\*\*/i.test(body) && !/https?:\/\//i.test(body)
}

export function isGenericFechamento(body: string): boolean {
  return /me conta como foi\s*[—–-]\s*um passo de cada vez/i.test(body.trim())
}

type ParsedSection = { label: string; body: string }

const SECTION_LABEL_PATTERN =
  'Na prática|Mensagem pronta|Legenda curta|Link para enviar|Próximo passo|Amanhã'

function parseMemberNoelSections(text: string): { preamble: string; sections: ParsedSection[] } {
  const normalized = text.replace(/\*\*Amanhã\*\*/gi, '**Próximo passo**').trim()
  const headerRe = new RegExp(`\\*\\*(${SECTION_LABEL_PATTERN})\\*\\*\\s*\\n+`, 'gi')
  const headers: { label: string; bodyStart: number; start: number }[] = []

  let m: RegExpExecArray | null
  while ((m = headerRe.exec(normalized)) !== null) {
    let label = m[1].trim()
    if (label.toLowerCase() === 'amanhã') label = 'Próximo passo'
    headers.push({
      label,
      start: m.index,
      bodyStart: m.index + m[0].length,
    })
  }

  if (headers.length === 0) {
    return { preamble: normalized, sections: [] }
  }

  const preamble = normalized.slice(0, headers[0].start).trim()
  const sections: ParsedSection[] = headers.map((h, i) => {
    const bodyEnd = i + 1 < headers.length ? headers[i + 1].start : normalized.length
    return { label: h.label, body: normalized.slice(h.bodyStart, bodyEnd).trim() }
  })

  return { preamble, sections }
}

/** Remove blocos duplicados e fallbacks genéricos colados no final. */
export function dedupeMemberNoelSections(text: string): string {
  const { preamble, sections } = parseMemberNoelSections(text)
  const kept: ParsedSection[] = []

  for (const s of sections) {
    const key = s.label.toLowerCase()

    if (key === 'mensagem pronta') {
      const hasSpecific = sections.some(
        (x) => x.label === 'Mensagem pronta' && !isGenericReadyMessage(x.body)
      )
      if (isGenericReadyMessage(s.body) && hasSpecific) continue

      const idx = kept.findIndex((x) => x.label === 'Mensagem pronta')
      if (idx >= 0) {
        if (isGenericReadyMessage(s.body)) continue
        if (isGenericReadyMessage(kept[idx].body)) {
          kept[idx] = s
          continue
        }
        continue
      }
    }

    if (key === 'link para enviar') {
      const hasReal = sections.some(
        (x) => x.label === 'Link para enviar' && !isGenericLinkHint(x.body)
      )
      if (isGenericLinkHint(s.body) && hasReal) continue

      const idx = kept.findIndex((x) => x.label === 'Link para enviar')
      if (idx >= 0) {
        if (isGenericLinkHint(s.body)) continue
        if (isGenericLinkHint(kept[idx].body)) {
          kept[idx] = s
          continue
        }
        continue
      }
    }

    if (key === 'próximo passo') {
      const hasSpecific = sections.some(
        (x) => x.label === 'Próximo passo' && !isGenericFechamento(x.body)
      )
      if (isGenericFechamento(s.body) && hasSpecific) continue

      const idx = kept.findIndex((x) => x.label === 'Próximo passo')
      if (idx >= 0) {
        if (isGenericFechamento(s.body)) continue
        if (isGenericFechamento(kept[idx].body)) {
          kept[idx] = s
          continue
        }
        // Dois fechamentos específicos: fica o primeiro (do modelo).
        continue
      }
    }

    if (key === 'na prática') {
      const idx = kept.findIndex((x) => x.label === 'Na prática')
      if (idx >= 0) continue
    }

    if (kept.some((x) => x.label.toLowerCase() === key)) continue

    kept.push(s)
  }

  let cleanPreamble = preamble
  for (const s of kept) {
    if (s.label === 'Na prática') {
      cleanPreamble = cleanPreamble
        .replace(/^(\*\*)?na prática(\*\*)?\s*$/gim, '')
        .replace(/\n{3,}/g, '\n\n')
        .trim()
    }
    if (s.label === 'Próximo passo') {
      cleanPreamble = cleanPreamble
        .replace(/^(\*\*)?pr[oó]ximo passo(\*\*)?\s*$/gim, '')
        .replace(/\n{3,}/g, '\n\n')
        .trim()
    }
  }

  const parts = [cleanPreamble, ...kept.map((s) => `**${s.label}**\n\n${s.body}`)].filter(Boolean)
  return parts.join('\n\n')
}

function defaultProximoPasso(mode: ProLideresMemberNoelMode, userMessage = ''): string {
  const um = normMsg(userMessage)
  if (/(story|postar|legenda|instagram|o que postar)/.test(um)) {
    return 'Poste o story hoje e responda quem interagir no direct. 💪'
  }
  if (mode === 'objecao') {
    if (/vergonha|vendedor/.test(um)) {
      return 'Tente 1 convite leve hoje — só prática, sem cobrar resposta. 💪'
    }
    if (/caro|preco|pensar/.test(um)) {
      return 'Aguarde a resposta dela antes de insistir no próximo contato.'
    }
  }
  const byMode: Partial<Record<ProLideresMemberNoelMode, string>> = {
    execucao: 'Me conta quantas pessoas você abordou — ajustamos a lista no próximo dia. 💪',
    objecao: 'Aguarde a resposta dela antes de insistir no próximo contato.',
    fechamento:
      'Confirme até amanhã quem aceitou o combinado — anote no painel YLADA. 💪',
    comportamento: 'Sem resposta em 48h, siga para o próximo nome da lista.',
    mentor: 'Faça pelo menos 1 convite leve hoje para manter o ritmo. 💪',
    catalogo: 'Pergunte o que ela achou depois que usar o link.',
    emocional: 'Me conta o que conseguiu fazer, mesmo que pequeno. 💪',
    bloqueio_criar_link: 'Me diga o tema que você quer trabalhar — indico qual link já existe.',
    scripts_painel: 'Gere o pacote em Scripts se precisar escalar para a equipe.',
  }
  return byMode[mode] ?? 'Me conta como foi — um passo de cada vez. 💪'
}

function polishMemberNoelText(text: string): string {
  const base = stripMemberNoelDebugLines(sanitizeProLideresMemberNoelBrand(text.trim()))
  const softened = softenProLideresMemberNoelMarkdown(base)
  const headings = collapseDuplicateSectionHeadings(normalizePlainSectionHeadings(softened))
  return sanitizeNoelAssistantOutput(formatMemberNoelSectionSpacing(headings))
}

function stripConversationalBlocks(text: string): string {
  let t = text
  for (const label of ['Mensagem pronta', 'Link para enviar', 'Próximo passo', 'Na prática', 'Legenda curta']) {
    t = removeSectionsByLabel(t, label)
  }
  return sanitizeNoelAssistantOutput(polishMemberNoelText(t))
}

function formatLinkSectionsInText(text: string): string {
  const { preamble, sections } = parseMemberNoelSections(text)
  const formatted = sections.map((s) =>
    s.label === 'Link para enviar' ? { ...s, body: formatLinkParaEnviarBody(s.body) } : s
  )
  return rebuildMemberNoelSections(preamble, formatted)
}

/** Mesmo tratamento de seções/bullets para exibir no chat (fallback se a resposta vier sem passar de novo na API). */
/** Corrige fechamento copiado de outro modo (ex.: story com texto de “48h na lista”). */
function fixContextualProximoPasso(text: string, userMessage: string): string {
  const um = normMsg(userMessage)
  const { preamble, sections } = parseMemberNoelSections(text)
  const idx = sections.findIndex((s) => s.label === 'Próximo passo')
  if (idx < 0) return text

  const body = sections[idx].body
  const isListFechamento = /48\s*h|pr[oó]ximo nome da lista|insistir no pr[oó]ximo contato/i.test(body)

  if (/(story|postar|legenda|instagram|o que postar)/.test(um) && isListFechamento) {
    sections[idx] = {
      label: 'Próximo passo',
      body: 'Poste o story hoje e responda quem interagir no direct. 💪',
    }
    return rebuildMemberNoelSections(preamble, sections)
  }

  if (/vergonha|vendedor/.test(um) && /incentive ela|insistir no pr[oó]ximo contato/i.test(body)) {
    sections[idx] = {
      label: 'Próximo passo',
      body: 'Tente 1 convite leve com 2 pessoas próximas hoje — só prática. 💪',
    }
    return rebuildMemberNoelSections(preamble, sections)
  }

  return text
}

export function polishProLideresMemberNoelForDisplay(text: string, userMessage = ''): string {
  if (isMemberNoelConversationalQuery(userMessage)) {
    return stripConversationalBlocks(text)
  }
  let t = polishMemberNoelText(text)
  t = dedupeMemberNoelSections(t)
  t = ensureNaPraticaSection(t)
  t = formatLinkSectionsInText(t)
  t = fixContextualProximoPasso(t, userMessage)
  return polishMemberNoelText(t)
}

export function normalizeProLideresMemberNoelResponse(
  raw: string,
  route: ProLideresMemberNoelRoute,
  userMessage = ''
): string {
  if (route.mode === 'conversacional' || isMemberNoelConversationalQuery(userMessage)) {
    return stripConversationalBlocks(raw)
  }

  let t = polishMemberNoelText(raw)
  if (!t) return t

  const hasNaPratica = hasMemberNoelSection(t, 'Na prática')
  const hasFechamento = hasMemberNoelSection(t, 'Próximo passo')

  const shouldHaveMensagem =
    route.includeMensagemPronta || userExplicitlyWantsReadyMessage(userMessage)
  const shouldHaveLink = route.includeLink
  const needsNaPratica = shouldHaveNaPratica(route, userMessage)
  const needsProximoPasso = shouldHaveProximoPasso(route, userMessage)

  if (needsNaPratica && !hasNaPratica && t.length > 40) {
    const blocks = t.split(/\n\n+/)
    if (blocks.length >= 2 && !/^(\*\*|###)/m.test(blocks[0] ?? '')) {
      const intro = blocks.slice(0, Math.min(2, blocks.length)).join('\n\n')
      const rest = blocks.slice(Math.min(2, blocks.length)).join('\n\n')
      t = rest
        ? `${intro}\n\n**Na prática**\n\n${rest}`
        : `${intro}\n\n**Na prática**\n\n- Escolha 1 ação simples e faça ainda hoje.`
    }
  }

  t = polishMemberNoelText(t)

  if (
    shouldHaveLink &&
    !hasMemberNoelSection(t, 'Link para enviar') &&
    !textHasCatalogUrl(t) &&
    route.mode !== 'scripts_painel' &&
    route.mode !== 'emocional'
  ) {
    t += `\n\n**Link para enviar**\n\n${GENERIC_LINK_HINT}`
  }

  if (needsProximoPasso && !hasFechamento) {
    t += `\n\n**Próximo passo**\n\n${defaultProximoPasso(route.mode, userMessage)}`
  }

  t = dedupeMemberNoelSections(polishMemberNoelText(t))

  if (!shouldHaveMensagem) {
    t = removeSectionsByLabel(t, 'Mensagem pronta')
  }

  if (!shouldHaveLink) {
    t = removeSectionsByLabel(t, 'Link para enviar')
  }

  if (!needsProximoPasso) {
    t = removeSectionsByLabel(t, 'Próximo passo')
  }

  if (needsNaPratica) {
    t = polishMemberNoelText(
      formatNaPraticaSectionsInText(ensureNaPraticaSection(dedupeMemberNoelSections(t)))
    )
  } else {
    t = removeSectionsByLabel(polishMemberNoelText(dedupeMemberNoelSections(t)), 'Na prática')
  }

  t = formatLinkSectionsInText(t)
  t = fixContextualProximoPasso(t, userMessage)
  return polishMemberNoelText(t)
}

function removeSectionsByLabel(text: string, label: string): string {
  const { preamble, sections } = parseMemberNoelSections(text)
  const kept = sections.filter((s) => s.label !== label)
  const parts = [preamble, ...kept.map((s) => `**${s.label}**\n\n${s.body}`)].filter(Boolean)
  return parts.join('\n\n')
}

/** Reconstrói markdown a partir de preâmbulo + seções. */
function rebuildMemberNoelSections(preamble: string, sections: ParsedSection[]): string {
  const parts = [preamble.trim(), ...sections.map((s) => `**${s.label}**\n\n${s.body}`)].filter(Boolean)
  return parts.join('\n\n')
}

/** Formata corpo de Na prática: bullets e junta linhas partidas (evita “:” órfão no celular). */
export function formatNaPraticaSectionsInText(text: string): string {
  const { preamble, sections } = parseMemberNoelSections(text)
  if (sections.length === 0) return text

  const formatted = sections.map((s) =>
    s.label === 'Na prática' ? { ...s, body: normalizePracticeBullets(s.body) } : s
  )
  return rebuildMemberNoelSections(preamble, formatted)
}

/** Garante bloco Na prática quando o modelo manda só parágrafos + outras seções. */
export function ensureNaPraticaSection(text: string): string {
  if (hasMemberNoelSection(text, 'Na prática')) {
    return formatNaPraticaSectionsInText(text)
  }

  let { preamble, sections } = parseMemberNoelSections(text)
  const blocks = preamble.split(/\n\n+/).filter((b) => b.trim())
  if (blocks.length === 0) return text

  const introParagraphs = 1
  const intro = blocks.slice(0, introParagraphs).join('\n\n')
  let practiceBody = blocks.slice(introParagraphs).join('\n\n').trim()

  if (!practiceBody.trim()) {
    const firstSpecial = sections.findIndex((s) =>
      ['Legenda curta', 'Mensagem pronta', 'Link para enviar', 'Próximo passo'].includes(s.label)
    )
    if (firstSpecial === -1 && blocks.length > introParagraphs) {
      practiceBody = blocks.slice(introParagraphs).join('\n\n').trim()
    }
    if (!practiceBody.trim() && sections.length === 0 && blocks.length === 1) {
      return text
    }
    if (!practiceBody.trim()) return text
  }

  return rebuildMemberNoelSections(intro.trim(), [
    { label: 'Na prática', body: normalizePracticeBullets(practiceBody) },
    ...sections,
  ])
}

/** Junta linhas partidas pelo negrito no app (ex.: “Priorize” + “3 quentes” + “: texto…”). */
function mergeSplitPracticeLines(lines: string[]): string[] {
  const merged: string[] = []

  for (let i = 0; i < lines.length; i++) {
    let t = lines[i]?.trim() ?? ''
    if (!t) {
      merged.push('')
      continue
    }

    if (/^:\s/.test(t) && merged.length > 0) {
      const prev = merged[merged.length - 1]?.replace(/^- /, '') ?? ''
      merged[merged.length - 1] = `- ${prev}${prev.endsWith(':') ? ' ' : ': '}${t.replace(/^:\s*/, '')}`
      continue
    }

    while (
      i + 1 < lines.length &&
      t.length < 48 &&
      !/[.!?]$/.test(t) &&
      !/^[-*•]/.test(t)
    ) {
      const next = lines[i + 1]?.trim() ?? ''
      if (!next) break
      if (/^:\s/.test(next)) {
        t = `${t}: ${next.replace(/^:\s*/, '')}`
        i += 1
        continue
      }
      if (next.length < 52 && !/^[-*•]/.test(next) && !/^[.!?]$/.test(next)) {
        t = `${t} ${next}`
        i += 1
        continue
      }
      break
    }

    merged.push(t)
  }

  return merged
}

/** Bullets (- ) em cada item; sem **negrito** no meio do item. */
export function normalizePracticeBullets(body: string): string {
  const rawLines = body.split('\n').map((l) => l.trim())
  const merged = mergeSplitPracticeLines(rawLines)

  return merged
    .map((line) => {
      let t = line.trim()
      if (!t) return ''
      t = t.replace(/\*\*([^*]+)\*\*/g, '$1').replace(/\*/g, '')
      t = t.replace(/^:\s*/, '')
      if (/^[-*•]\s/.test(t)) return t.startsWith('-') ? t : `- ${t.replace(/^[*•]\s*/, '')}`
      if (/^\d+[.)]\s/.test(t)) return t
      return `- ${t}`
    })
    .filter((line, i, arr) => {
      if (line !== '') return true
      return i > 0 && arr[i - 1] !== ''
    })
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

export type ProLideresMemberNoelMessageSection = {
  label: string
  body: string
}

/** Blocos da resposta (para UI com copiar mensagem pronta). */
export function getProLideresMemberNoelMessageSections(text: string): ProLideresMemberNoelMessageSection[] {
  const { preamble, sections } = parseMemberNoelSections(text)
  const out: ProLideresMemberNoelMessageSection[] = []
  if (preamble.trim()) {
    out.push({ label: '', body: preamble.trim() })
  }
  for (const s of sections) {
    out.push({ label: s.label, body: s.body.trim() })
  }
  return out
}

/** Texto copiável da mensagem pronta (sem título nem markdown). */
export function extractProLideresMemberNoelMensagemPronta(text: string): string | null {
  const sec = getProLideresMemberNoelMessageSections(text).find(
    (s) => s.label.toLowerCase() === 'mensagem pronta'
  )
  if (!sec?.body.trim()) return null
  return sec.body
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*/g, '')
    .trim()
}
