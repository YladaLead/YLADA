import { isCarolInteractiveReply } from './parse-interactive'

export const PAIN_BUTTONS_MARKER = '[botões enviados:'

/** Carol já mandou os 3 botões de dor nesta conversa */
export function hasSentPainButtons(
  history: Array<{ role: string; content: string }>
): boolean {
  return history.some(
    (m) => m.role === 'assistant' && m.content.includes(PAIN_BUTTONS_MARKER)
  )
}

export function historyHasButtonClick(
  history: Array<{ role: string; content: string }>
): boolean {
  return history.some(
    (m) =>
      m.role === 'user' &&
      (m.content.startsWith('[botão:') || m.content.includes('[botão:'))
  )
}

/** CTA genérico do anúncio — prioriza envio de botões */
export function isGenericAdCta(text: string): boolean {
  const t = String(text || '').toLowerCase()
  return (
    /tenho interesse/.test(t) ||
    /queria mais inform/.test(t) ||
    /quero mais inform/.test(t) ||
    /gostaria de mais inform/.test(t) ||
    /mais informa[cç][õo]es/.test(t) ||
    /quero saber mais/.test(t)
  )
}

/** Texto do chip FAQ do Meta que já indica uma dor (ainda enviamos botões para confirmar) */
export function isAdFaqPainChip(text: string): boolean {
  const t = String(text || '').toLowerCase()
  if (isGenericAdCta(text)) return false
  return (
    /agenda oscila/.test(t) ||
    /faço tudo sozinha|faz tudo sozinha/.test(t) ||
    /cansa demais/.test(t) ||
    /n[aã]o sobra dinheiro/.test(t) ||
    /trabalho muito e n[aã]o sobra/.test(t) ||
    /faturamento n[aã]o cresce/.test(t)
  )
}

export function getPainButtonsIntro(firstUserText: string): string {
  const t = String(firstUserText || '').toLowerCase()
  if (isGenericAdCta(firstUserText)) {
    return 'Oi! 😊 Pra eu te direcionar melhor, qual dessas mais parece o seu caso hoje?'
  }
  if (/agenda oscila/.test(t)) {
    return 'Oi! 😊 Vi que a agenda oscila... qual dessas três bate mais com você agora?'
  }
  if (/sozinha|cansa demais/.test(t)) {
    return 'Oi! 😊 Entendi o cansaço de fazer tudo sozinha... confirma qual dessas é a sua principal agora?'
  }
  if (/sobra dinheiro|faturamento/.test(t)) {
    return 'Oi! 😊 Vi sua mensagem sobre faturamento... qual dessas três representa melhor o seu momento?'
  }
  return 'Oi! 😊 Qual dessas mais te representa hoje?'
}

export const POST_BUTTON_CLICK_PROMPT = `
PÓS-CLIQUE NOS BOTÕES (PRIORIDADE MÁXIMA):
A lead já escolheu uma dor. NÃO reenvie os botões.

Leia o histórico inteiro antes de responder. Aprofunde naquela dor específica de forma genuína — mostre que você leu o que ela escolheu, faça perguntas que façam sentido para o caso dela. Não siga um roteiro numerado, leia a conversa.

Quando tiver contexto suficiente da dor (não necessariamente muitas trocas — às vezes 1 pergunta basta), convide ao diagnóstico:
"[Nome se souber], pelo que você me contou faz sentido o Andre olhar seu caso em 30 min, sem pitch. Quer que eu agende?"

Só avance para coleta (turno → dia → nome completo) após SIM explícito. Uma pergunta por vez.

PROIBIDO: "Quando você teria uma manhã livre?" antes do sim.
PROIBIDO: repetir qualquer pergunta que já foi respondida (nome, horário, dor, contexto).

Se já tiver nome completo E horário/dia nas mensagens anteriores: vá direto para a confirmação final com o link do Andre — não pergunte de novo.
`

/** Extrai [botão: ...] de mensagem misturada com lixo de auto-resposta da clínica */
export function extractButtonReply(text: string): string | null {
  const match = String(text || '').match(/\[botão:[^\]]+\]/i)
  return match ? match[0] : null
}

export function messageHasButtonReply(text: string): boolean {
  return isCarolInteractiveReply(text) || /\[botão:/i.test(text)
}

const NAME_LINE =
  /\b([A-ZÁÉÍÓÚÂÊÔÃÕÇ][a-záéíóúâêôãõç]+(?:\s+[A-ZÁÉÍÓÚÂÊÔÃÕÇ][a-záéíóúâêôãõç]+)+)\b/

function collectRealUserLines(
  history: Array<{ role: string; content: string }>
): string[] {
  return history
    .filter(
      (m) =>
        m.role === 'user' &&
        !m.content.startsWith('[auto-resposta ignorada]') &&
        !m.content.startsWith('[TEMPLATE')
    )
    .map((m) => {
      const btn = extractButtonReply(m.content)
      if (btn && m.content !== btn) return m.content.replace(btn, '').trim()
      return m.content
    })
    .filter((c) => c && !c.startsWith('[botão:'))
}

export function extractLeadNameFromHistory(
  history: Array<{ role: string; content: string }>
): string | null {
  const lines = collectRealUserLines(history)
  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i]
    if (line.length < 4 || line.length > 80) continue
    const m = line.match(NAME_LINE)
    if (m && m[1].split(/\s+/).length >= 2) return m[1].trim()
  }
  return null
}

export function extractSchedulingHintFromHistory(
  history: Array<{ role: string; content: string }>
): string | null {
  const joined = collectRealUserLines(history).join(' ').toLowerCase()
  const parts: string[] = []
  if (/(manhã|manha|tarde|noite)/.test(joined)) {
    const turno = joined.match(/(manhã|manha|tarde|noite)/)?.[1]
    if (turno) parts.push(turno.replace('manha', 'manhã'))
  }
  if (/(amanhã|amanha|segunda|terça|terca|quarta|quinta|sexta|sábado|sabado|domingo)/.test(joined)) {
    const dia = joined.match(
      /(amanhã|amanha|segunda|terça|terca|quarta|quinta|sexta|sábado|sabado|domingo)/
    )?.[1]
    if (dia) parts.push(dia.replace('amanha', 'amanhã'))
  }
  if (/(\d{1,2})\s*h|após as \d|depois das \d|às \d/.test(joined)) {
    const h = joined.match(/(?:após|depois|às)\s*(?:as\s*)?(\d{1,2})|(\d{1,2})\s*h/) 
    const hour = h?.[1] || h?.[2]
    if (hour) parts.push(`após ${hour}h`)
  }
  return parts.length ? parts.join(', ') : null
}

/** Evita loop de "nome completo / manhã livre" quando a lead já informou */
export function applySchedulingLoopGuard(
  reply: string,
  history: Array<{ role: string; content: string }>
): string {
  const lower = reply.toLowerCase()
  const asksName = /nome completo/.test(lower)
  const asksTime =
    /manhã livre/.test(lower) ||
    /qual dia da semana/.test(lower) ||
    /depois das \d|após as \d/.test(lower)

  if (!asksName && !asksTime) return reply

  const nome = extractLeadNameFromHistory(history)
  const horario = extractSchedulingHintFromHistory(history)

  if (asksName && asksTime && nome && horario) {
    const first = nome.split(/\s+/)[0]
    return (
      `Perfeito, ${first}! 😊\n` +
      `Anotei: ${horario}.\n` +
      `O Andre vai entrar em contato pra confirmar com você.\n\n` +
      `Se quiser ir na frente:\n` +
      `📲 https://wa.me/5519981868000?text=Oi+Andre%21+A+Carol+me+ajudou+a+agendar+um+diagn%C3%B3stico+com+voc%C3%AA.+Pode+me+confirmar+o+hor%C3%A1rio%3F`
    )
  }

  if (asksName && nome && !asksTime) {
    const first = nome.split(/\s+/)[0]
    return `Perfeito, ${first}! 😊 O Andre vai te chamar pra confirmar o horário.`
  }

  if (asksTime && horario && nome) {
    const first = nome.split(/\s+/)[0]
    return `Combinado, ${first}! 😊 Fico no aguardo — o Andre confirma o horário (${horario}) com você.`
  }

  return reply
}
