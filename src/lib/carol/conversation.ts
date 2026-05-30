import { createClient } from '@supabase/supabase-js'

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

export async function getOrCreateConversation(phone: string): Promise<Conversation> {
  // Tenta buscar conversa existente
  const { data: existing, error: fetchError } = await supabase
    .from('carol_conversations')
    .select('*')
    .eq('phone', phone)
    .single()

  if (existing && !fetchError) {
    return existing as Conversation
  }

  // Cria nova conversa
  const { data: created, error: createError } = await supabase
    .from('carol_conversations')
    .insert({
      phone,
      status: 'novo',
    })
    .select()
    .single()

  if (createError || !created) {
    console.error('[Carol] Erro ao criar conversa:', createError)
    throw new Error('Falha ao criar conversa no Supabase')
  }

  console.log(`[Carol] Nova conversa criada para ${phone}`)
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
