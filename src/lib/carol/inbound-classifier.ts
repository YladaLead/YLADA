import OpenAI from 'openai'
import { getClassifierModel } from './carol-reply-profile'
import { isCarolInteractiveReply } from './parse-interactive'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

/** Classificação da mensagem inbound antes da Carol responder */
export type InboundKind =
  | 'auto_resposta'
  | 'humano'
  | 'lead_anuncio'
  | 'possivel_nao_icp'

const OUTBOUND_PREFIX = '[TEMPLATE OUTBOUND:'

function historyHasOutbound(
  history: { role: string; content: string }[]
): boolean {
  return history.some(
    (m) => m.role === 'assistant' && m.content.includes(OUTBOUND_PREFIX)
  )
}

function looksAmbiguousForRules(text: string): boolean {
  const t = text.toLowerCase()
  return (
    text.length > 100 ||
    t.includes('http') ||
    t.includes('www.') ||
    t.includes('.com.br')
  )
}

function historyHasIgnoredAutoReply(
  history: { role: string; content: string }[]
): boolean {
  return history.some(
    (m) => m.role === 'user' && m.content.startsWith('[auto-resposta ignorada]')
  )
}

function carolAlreadySpoke(
  history: { role: string; content: string }[]
): boolean {
  return history.some((m) => m.role === 'assistant')
}

/** Evita custo de IA em conversas inbound simples sem outbound */
export function shouldClassifyWithAi(
  text: string,
  history: { role: string; content: string }[]
): boolean {
  if (isCarolInteractiveReply(text)) return false
  // Outbound ou mensagem longa/link — sempre classificar
  if (historyHasOutbound(history) || looksAmbiguousForRules(text)) return true
  // Carol já falou (template ou resposta) — próxima msg pode ser bot curto do WhatsApp Business
  if (carolAlreadySpoke(history)) return true
  // Clínica mandou auto-resposta antes — segunda/terceira tentativa do mesmo bot
  if (historyHasIgnoredAutoReply(history)) return true
  return false
}

function buildClassifierContext(
  history: { role: string; content: string }[]
): string {
  const tail = history.slice(-8)
  if (!tail.length) return '(primeira mensagem da conversa)'
  return tail
    .map((m) => {
      const who = m.role === 'assistant' ? 'Carol/sistema' : 'Lead'
      const body = m.content.slice(0, 400).replace(/\n/g, ' ')
      return `${who}: ${body}`
    })
    .join('\n')
}

const CLASSIFIER_PROMPT = `Você classifica mensagens recebidas no WhatsApp da Carol (consultora que fala com DONAS de clínicas de estética com espaço próprio).

A Carol pode ter enviado antes um template de pesquisa de mercado (outbound). Muitas clínicas respondem com BOT automático de boas-vindas, outro negócio no mesmo número, ou link genérico — isso NÃO é a dona falando.

Classifique a ÚLTIMA mensagem do lead em exatamente uma categoria:

- auto_resposta: mensagem automática de WhatsApp Business, bot de boas-vindas, fora de horário, "aguarde um momento", link de site + pedido de nome/horário sem contexto de agenda, mensagem de OUTRO negócio (nutrição, curso, spa genérico) que não responde à pesquisa de agenda.
- humano: pessoa real respondendo (pergunta, interesse, "oi" curto, dúvida, fala de agenda/clínica/negócio próprio). SEMPRE humano se a mensagem for escolha de botão da Carol: "[botão: Agenda oscila]", "[botão: Faço tudo sozinha]", "[botão: Lucro não cresce]" ou "[lista: ...]" — isso é clique da dona, nunca bot.
- lead_anuncio: CTA típico de anúncio Meta ("tenho interesse", "quero mais informações", etc.).
- possivel_nao_icp: parece humano mas claramente busca tratamento para si, emprego, vendedor, ou negócio que não é clínica/espaço de estética — ainda assim não é auto_resposta.

Responda SOMENTE JSON válido: {"kind":"auto_resposta"} (sem markdown).`

export async function classifyInboundMessage(
  text: string,
  history: { role: string; content: string }[]
): Promise<InboundKind> {
  if (isCarolInteractiveReply(text)) {
    console.log(`[Carol Classifier] humano (botão/lista) — ${text.slice(0, 60)}…`)
    return 'humano'
  }

  if (!process.env.OPENAI_API_KEY) {
    console.warn('[Carol Classifier] OPENAI_API_KEY ausente — tratando como humano')
    return 'humano'
  }

  try {
    const res = await openai.chat.completions.create({
      model: getClassifierModel(),
      temperature: 0,
      max_tokens: 40,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: CLASSIFIER_PROMPT },
        {
          role: 'user',
          content: `Histórico recente:\n${buildClassifierContext(history)}\n\nÚLTIMA mensagem do lead:\n${text.slice(0, 2000)}`,
        },
      ],
    })

    const raw = res.choices[0]?.message?.content?.trim() || '{}'
    const parsed = JSON.parse(raw) as { kind?: string }
    const kind = parsed.kind

    if (
      kind === 'auto_resposta' ||
      kind === 'humano' ||
      kind === 'lead_anuncio' ||
      kind === 'possivel_nao_icp'
    ) {
      console.log(`[Carol Classifier] ${kind} — ${text.slice(0, 60)}…`)
      return kind
    }

    console.warn('[Carol Classifier] kind inválido:', raw)
    return 'humano'
  } catch (err) {
    console.error('[Carol Classifier] Erro:', err)
    return 'humano'
  }
}

export function inboundKindContextNote(kind: InboundKind | undefined): string {
  if (!kind || kind === 'humano' || kind === 'lead_anuncio') return ''
  if (kind === 'auto_resposta') return ''
  return `\n\nCLASSIFICAÇÃO IA: possivel_nao_icp — mensagem pode ser de quem não tem clínica própria ou contexto confuso. NÃO descarte na primeira linha. Pergunte de forma neutra se tem espaço próprio de atendimento em estética antes de encerrar.\n`
}
