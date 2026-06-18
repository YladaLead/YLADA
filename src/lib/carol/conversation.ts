import { createClient } from '@supabase/supabase-js'
import { isLikelyBusinessDisplayName, usableFirstName } from './lead-name'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export interface Conversation {
  id: string
  phone: string
  nome: string | null
  email: string | null
  status: string
  hipotese: string | null
  hubspot_id: string | null
  created_at: string
  updated_at: string
}

/** Salva nome do perfil WhatsApp quando ainda não temos nome de pessoa no cadastro */
export async function syncLeadProfileName(
  conversationId: string,
  currentNome: string | null,
  profileName: string
): Promise<void> {
  const trimmed = profileName.trim()
  if (!trimmed || isLikelyBusinessDisplayName(trimmed)) return
  if (currentNome && usableFirstName(currentNome)) return

  const { error } = await supabase
    .from('carol_conversations')
    .update({
      nome: trimmed,
      updated_at: new Date().toISOString(),
    })
    .eq('id', conversationId)

  if (error) {
    console.error('[Carol] Erro ao salvar nome do perfil:', error)
  } else {
    console.log(`[Carol] 👤 Nome do perfil WhatsApp: ${trimmed}`)
  }
}

function onlyDigits(s: string): string {
  return s.replace(/\D/g, '')
}

/**
 * Variantes de um número brasileiro COM e SEM o 9º dígito de celular.
 * O disparo outbound salva o número com o 9 (ex.: 5549991561807), mas o Meta
 * às vezes entrega o inbound sem o 9 (ex.: 554991561807). Sem casar as duas
 * formas, o mesmo lead virava DUAS conversas: a do disparo (com o
 * [TEMPLATE OUTBOUND:] e o nome do negócio) e a da resposta humana (órfã). Aí a
 * Carol perdia o contexto de outbound e respondia como se fosse inbound.
 */
export function phoneVariants(phone: string): string[] {
  const d = onlyDigits(phone)
  const variants = new Set<string>()
  if (d) variants.add(d)

  if (d.startsWith('55') && d.length >= 12) {
    const ddd = d.slice(2, 4)
    const local = d.slice(4)
    if (local.length === 9 && local.startsWith('9')) {
      variants.add(`55${ddd}${local.slice(1)}`) // versão SEM o 9
    } else if (local.length === 8) {
      variants.add(`55${ddd}9${local}`) // versão COM o 9
    }
  }
  return Array.from(variants)
}

export async function getOrCreateConversation(phone: string): Promise<Conversation> {
  const variants = phoneVariants(phone)

  // Busca por qualquer variante (com/sem 9º dígito). Se houver duplicata já
  // criada pelo bug antigo, prioriza a conversa com mais contexto: a que tem
  // nome (veio do disparo) e, em empate, a mais antiga (o disparo veio antes).
  const { data: matches, error: fetchError } = await supabase
    .from('carol_conversations')
    .select('*')
    .in('phone', variants)
    .order('created_at', { ascending: true })

  if (!fetchError && matches && matches.length > 0) {
    const comNome = matches.find((c) => c.nome)
    return (comNome ?? matches[0]) as Conversation
  }

  // Cria nova conversa (sempre em dígitos limpos, padrão do disparo)
  const { data: created, error: createError } = await supabase
    .from('carol_conversations')
    .insert({
      phone: onlyDigits(phone),
      status: 'novo',
    })
    .select()
    .single()

  if (createError || !created) {
    console.error('[Carol] Erro ao criar conversa:', createError)
    throw new Error('Falha ao criar conversa no Supabase')
  }

  console.log(`[Carol] Nova conversa criada para ${onlyDigits(phone)}`)
  return created as Conversation
}

export async function saveMessage(
  conversationId: string,
  role: 'user' | 'assistant',
  content: string
): Promise<void> {
  const { error } = await supabase
    .from('carol_messages')
    .insert({
      conversation_id: conversationId,
      role,
      content,
    })

  if (error) {
    console.error('[Carol] Erro ao salvar mensagem:', error)
    throw new Error('Falha ao salvar mensagem no Supabase')
  }
}

export async function getConversationHistory(
  conversationId: string,
  limit = 20
): Promise<{ role: 'user' | 'assistant'; content: string }[]> {
  const { data, error } = await supabase
    .from('carol_messages')
    .select('role, content')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('[Carol] Erro ao buscar histórico:', error)
    return []
  }

  return ((data || []) as { role: 'user' | 'assistant'; content: string }[]).reverse()
}

export async function updateConversationStatus(
  conversationId: string,
  status: string,
  extra?: { nome?: string; email?: string; hipotese?: string; hubspot_id?: string }
): Promise<void> {
  const { error } = await supabase
    .from('carol_conversations')
    .update({
      status,
      updated_at: new Date().toISOString(),
      ...extra,
    })
    .eq('id', conversationId)

  if (error) {
    console.error('[Carol] Erro ao atualizar conversa:', error)
  }
}
