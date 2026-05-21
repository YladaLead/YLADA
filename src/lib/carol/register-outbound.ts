import {
  getOrCreateConversation,
  saveMessage,
  updateConversationStatus,
} from './conversation'
import { outboundTemplateLabel } from './outbound-templates'

export function normalizeCarolPhone(phone: string): string {
  return phone.replace(/\D/g, '')
}

export async function registerOutboundSend(params: {
  phone: string
  template: string
  nome?: string
  source?: 'ylada_outbound' | 'admin'
  isFollowUp?: boolean
}): Promise<{ conversationId: string; phone: string }> {
  const phoneClean = normalizeCarolPhone(params.phone)
  if (phoneClean.length < 10) {
    throw new Error('Número de telefone inválido')
  }

  const conversation = await getOrCreateConversation(phoneClean)
  const label = outboundTemplateLabel(params.template)
  const nome = params.nome?.trim() || null
  const sourceTag =
    params.source === 'ylada_outbound' ? 'Ylada Outbound' : 'Admin'

  const followTag = params.isFollowUp ? ' (Follow-up)' : ''
  await saveMessage(
    conversation.id,
    'assistant',
    `[TEMPLATE OUTBOUND: ${label}]${followTag} Enviado para ${nome ?? 'lead'} · ${sourceTag}`
  )

  if (nome && !conversation.nome) {
    await updateConversationStatus(conversation.id, conversation.status, {
      nome,
    })
  }

  await updateConversationStatus(conversation.id, conversation.status)

  return { conversationId: conversation.id, phone: phoneClean }
}
