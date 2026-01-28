/**
 * Carol responde enxuta — uma responsabilidade: contexto + fase → OpenAI → Z-API.
 * Lei do sistema: fase vem de getFaseFromTagsAndContext (fase.ts).
 * Reaproveita: getZApiInstance, getRegistrationName, getFirstName, sendWhatsAppMessage (whatsapp-carol-ai).
 */

import OpenAI from 'openai'
import { supabaseAdmin } from '@/lib/supabase'
import {
  getZApiInstance,
  getRegistrationName,
  getFirstName,
  sendWhatsAppMessage,
} from '@/lib/whatsapp-carol-ai'
import { getFaseFromTagsAndContext, type Fase } from './fase'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

function instrucaoPorFase(fase: Fase, leadName: string): string {
  const nome = leadName ? getFirstName(leadName) : ''
  const trata = nome ? `Trate a pessoa pelo primeiro nome: ${nome}.` : ''
  switch (fase) {
    case 'participou':
      return `Fase: PARTICIPOU DA AULA. Modo decisão: fechamento, âncora emocional, pergunta reflexiva. Link de cadastro: https://www.ylada.com/pt/nutri#oferta. ${trata} Não use "não conseguiu participar".`
    case 'nao_participou':
      return `Fase: NÃO PARTICIPOU DA AULA. Modo reengajamento: reagendar, uma âncora emocional, pergunta reflexiva. Ofereça novas opções de data/hora. ${trata} Não use copy pesada na abertura; pergunte se ainda tem interesse.`
    case 'agendou':
      return `Fase: AGENDOU AULA. Modo secretária: logística, confirmar horário, lembrar do Zoom. ${trata} Não persuada vendas; foque em tirar dúvidas e reforçar data/hora/link.`
    case 'chamou_nao_fechou':
      return `Fase: CHAMOU NO WHATSAPP, ainda não fechou aula. Modo secretária: logística, confirmar horário, não persuadir. Se pedir horários/opções, envie as duas próximas opções de aula (dias e horários, sem link até ela escolher). ${trata} Em "Ok"/"Entendi" responda em UMA frase curta; não repita boas-vindas nem opções.`
    case 'inscrito_nao_chamou':
    default:
      return `Fase: INSCRITO, ainda não chamou ou sem tags de workshop. Seja breve e acolhedora. ${trata}`
  }
}

export interface ReplyAsCarolParams {
  conversationId: string
  phone: string
  message: string
  area?: string
  instanceId?: string
}

export interface ReplyAsCarolResult {
  success: boolean
  response?: string
  error?: string
}

/**
 * Processa a mensagem do cliente e responde como Carol.
 * Busca conversa → deriva fase → monta prompt → OpenAI → envia via Z-API → salva no banco.
 */
export async function replyAsCarol(params: ReplyAsCarolParams): Promise<ReplyAsCarolResult> {
  const { conversationId, phone, message, area = 'nutri', instanceId: instanceIdParam } = params

  if (!process.env.OPENAI_API_KEY) {
    return { success: false, error: 'OpenAI API Key não configurada' }
  }

  const instance = instanceIdParam
    ? await supabaseAdmin
        .from('z_api_instances')
        .select('id, instance_id, token')
        .or(`id.eq.${instanceIdParam},instance_id.eq.${instanceIdParam}`)
        .limit(1)
        .maybeSingle()
        .then(({ data }) => data)
    : await getZApiInstance(area)

  if (!instance?.instance_id || !instance?.token) {
    return { success: false, error: 'Instância Z-API não encontrada' }
  }

  const { data: conv } = await supabaseAdmin
    .from('whatsapp_conversations')
    .select('context, name, customer_name')
    .eq('id', conversationId)
    .maybeSingle()

  if (!conv) {
    return { success: false, error: 'Conversa não encontrada' }
  }

  const context = (conv.context || {}) as Record<string, unknown>
  const tags = Array.isArray(context.tags) ? (context.tags as string[]) : []
  const workshopSessionId = context.workshop_session_id as string | null | undefined
  const fase = getFaseFromTagsAndContext(tags, {
    workshop_session_id: workshopSessionId ?? null,
  })

  const leadName =
    (conv.customer_name as string) ||
    (context.lead_name as string) ||
    (conv.name as string) ||
    (await getRegistrationName(phone, area)) ||
    ''

  const { data: msgs } = await supabaseAdmin
    .from('whatsapp_messages')
    .select('sender_type, message')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })
    .limit(20)

  const history: Array<{ role: 'user' | 'assistant'; content: string }> = (msgs || []).map(
    (m: { sender_type: string; message: string | null }) => ({
      role: m.sender_type === 'customer' ? 'user' : 'assistant',
      content: (m.message || '').trim(),
    })
  )

  const systemInstruction = instrucaoPorFase(fase, leadName)
  const systemContent = `Você é a Carol, secretária da YLADA Nutri. Responda em português, de forma acolhedora e objetiva.

${systemInstruction}

Regras: use apenas o primeiro nome da pessoa; não invente links; não repita longos blocos se a pessoa já viu (ex.: "Ok" → uma frase curta).`

  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: 'system', content: systemContent },
    ...history.slice(-16).map((m) => ({ role: m.role, content: m.content })),
    { role: 'user', content: message.trim() },
  ]

  let responseText: string
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      temperature: 0.6,
      max_tokens: 500,
    })
    responseText =
      completion.choices[0]?.message?.content?.trim() ||
      'Desculpe, não consegui processar. Pode repetir?'
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    return { success: false, error: `OpenAI: ${msg}` }
  }

  const sendResult = await sendWhatsAppMessage(
    phone,
    responseText,
    instance.instance_id,
    instance.token
  )
  if (!sendResult.success) {
    return { success: false, error: sendResult.error, response: responseText }
  }

  await supabaseAdmin.from('whatsapp_messages').insert({
    conversation_id: conversationId,
    instance_id: instance.id,
    z_api_message_id: sendResult.messageId || null,
    sender_type: 'bot',
    sender_name: 'Carol - Secretária',
    message: responseText,
    message_type: 'text',
    status: 'sent',
    is_bot_response: true,
  })

  return { success: true, response: responseText }
}
