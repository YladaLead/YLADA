/**
 * Enriquecimento de conversas WhatsApp com nome e telefone
 * extraídos do Supabase: workshop_inscricoes, contact_submissions, leads, nutri_leads.
 * Usado pela lista do admin e pela Carol v2 — nome e telefone vêm sempre do Supabase quando existir cadastro.
 *
 * Por que às vezes aparece nome e às vezes só o número (oscilação):
 * - O nome só aparece quando conseguimos DAR MATCH da conversa com um cadastro no Supabase.
 * - O match é feito por: (1) telefone — sufixo do número da conversa bate com o telefone do cadastro;
 *   (2) email — quando a conversa tem lead_email/email no context.
 * - Se o número que a Z-API envia for diferente do que está no cadastro (formato, prefixo, etc.),
 *   o match falha e a lista mostra só o número. Por isso: cadastro antes (ou com o mesmo número/email)
 *   ajuda; e expandimos phoneCandidates para aceitar mais formatos (números longos com prefixo).
 */

import { supabaseAdmin } from '@/lib/supabase'

export type InscricaoData = { nome: string; telefone: string }

function digits(s: string): string {
  return (s || '').replace(/\D/g, '')
}

function lastN(s: string, n: number): string {
  return digits(s).slice(-n)
}

function normalizePhoneForDisplay(t: string): string {
  const d = digits(t)
  if (d.length >= 10 && !d.startsWith('55')) return '55' + d
  return d
}

export type InscricoesMaps = {
  byPhoneSuffix: Map<string, InscricaoData>
  byEmail: Map<string, InscricaoData>
  byName: Map<string, InscricaoData>
}

/** Adiciona um cadastro aos mapas (telefone, email, nome). Só preenche se tiver nome e telefone. */
function addToMaps(
  maps: { byPhoneSuffix: Map<string, InscricaoData>; byEmail: Map<string, InscricaoData>; byName: Map<string, InscricaoData> },
  nome: string,
  telefone: string,
  email: string,
  onlyIfNotExists: boolean
) {
  const nomeTrim = (nome || '').trim()
  const telTrim = (telefone || '').trim()
  const em = (email || '').trim().toLowerCase()
  if (!nomeTrim || !telTrim) return
  const data: InscricaoData = { nome: nomeTrim, telefone: normalizePhoneForDisplay(telTrim) }
  const setByPhone = (key: string) => {
    if (key.length >= 6 && (!onlyIfNotExists || !maps.byPhoneSuffix.has(key))) maps.byPhoneSuffix.set(key, data)
  }
  for (const len of [11, 10, 9, 8, 7, 6]) {
    const k = lastN(telTrim, len)
    if (k.length >= len) setByPhone(k)
  }
  if (em && em.includes('@') && (!onlyIfNotExists || !maps.byEmail.has(em))) maps.byEmail.set(em, data)
  const nameKey = nomeTrim.toLowerCase()
  if (!onlyIfNotExists || !maps.byName.has(nameKey)) maps.byName.set(nameKey, data)
}

/**
 * Monta mapas para enriquecimento a partir do Supabase:
 * - workshop_inscricoes (inscrições workshop)
 * - contact_submissions (formulário de contato; aceita nome/name e telefone/phone)
 * - leads (leads de templates; name, phone, whatsapp)
 * - nutri_leads (leads de formulários nutri; name, phone)
 * Nome e telefone exibidos na lista do admin vêm daqui quando houver match.
 */
export async function buildInscricoesMaps(): Promise<InscricoesMaps> {
  const byPhoneSuffix = new Map<string, InscricaoData>()
  const byEmail = new Map<string, InscricaoData>()
  const byName = new Map<string, InscricaoData>()
  const maps: InscricoesMaps = { byPhoneSuffix, byEmail, byName }
  try {
    if (!supabaseAdmin) return maps

    // 1) Workshop inscrições
    const { data: workshop } = await supabaseAdmin
      .from('workshop_inscricoes')
      .select('nome, telefone, email')
      .limit(3000)
    for (const row of workshop || []) {
      const nome = (row.nome || '').trim()
      const tel = (row.telefone || '').trim()
      const em = (row.email || '').trim()
      addToMaps(maps, nome, tel, em, false)
    }

    // 2) Formulário de contato (Supabase: nome/name, telefone/phone)
    const { data: contact } = await supabaseAdmin
      .from('contact_submissions')
      .select('nome, name, telefone, phone, email')
      .limit(3000)
    for (const row of contact || []) {
      const r = row as { nome?: string; name?: string; telefone?: string; phone?: string; email?: string }
      const nome = (r.nome || r.name || '').trim()
      const tel = (r.telefone || r.phone || '').trim()
      const em = (r.email || '').trim()
      addToMaps(maps, nome, tel, em, true)
    }

    // 3) Leads (templates) — name, phone ou whatsapp
    const { data: leads } = await supabaseAdmin
      .from('leads')
      .select('name, email, phone, whatsapp')
      .limit(3000)
    for (const row of leads || []) {
      const nome = (row.name || '').trim()
      const tel = (row.phone || row.whatsapp || '').trim()
      const em = (row.email || '').trim()
      addToMaps(maps, nome, tel, em, true)
    }

    // 4) Nutri leads (formulários nutri)
    try {
      const { data: nutriLeads } = await supabaseAdmin
        .from('nutri_leads')
        .select('name, email, phone')
        .limit(3000)
      for (const row of nutriLeads || []) {
        const nome = (row.name || '').trim()
        const tel = (row.phone || '').trim()
        const em = (row.email || '').trim()
        addToMaps(maps, nome, tel, em, true)
      }
    } catch (_) {
      // tabela pode não existir
    }
  } catch (e) {
    console.warn('[whatsapp-conversation-enrichment] Erro ao buscar cadastros do Supabase:', e)
  }
  return maps
}

/**
 * Gera candidatos de telefone para matching (inclui normalizações para BR e IDs atípicos).
 * Números longos vindos da Z-API (ex.: 101820873605244, 54657971953893) podem ter prefixo;
 * geramos vários candidatos para aumentar a chance de match com o cadastro no Supabase.
 */
function phoneCandidates(d: string): string[] {
  const out = new Set<string>()
  out.add(d)
  // BR: 55 + DDD(2) + 9 + 8 = 13
  if (d.length === 14 && d.startsWith('9')) {
    out.add(d.slice(1))
    out.add('55' + d.slice(3))
  }
  if (d.length === 15 && d.startsWith('55')) {
    out.add(d.slice(0, 13))
  }
  if (d.length >= 12 && d.startsWith('55')) {
    out.add(d.slice(0, 13))
  }
  // 15 dígitos com prefixo (ex.: 101820873605244 = "10" + algo): extrair possíveis BR 11/13 dígitos
  if (d.length === 15) {
    out.add(d.slice(2, 13))   // após "10" -> 11 dígitos (sufixo BR)
    out.add(d.slice(2, 15))   // após "10" -> 13 dígitos
    out.add(d.slice(1, 12))   // após "1" -> 11 dígitos
    out.add(d.slice(1, 14))   // após "1" -> 13 dígitos
  }
  // 14 dígitos (ex.: 54657971953893): pode ser 54 + 12 dígitos ou prefixo + BR
  if (d.length === 14) {
    out.add(d.slice(2, 13))   // 11 dígitos
    out.add(d.slice(0, 11))
    out.add(d.slice(0, 13))
  }
  return Array.from(out)
}

/**
 * Encontra inscrição por nome (ex.: quando o admin edita o nome e queremos o telefone do cadastro).
 * Usado no PATCH da conversa para preencher display_phone.
 */
export function findInscricaoByName(
  nome: string,
  maps: InscricoesMaps
): InscricaoData | null {
  const key = (nome || '').trim().toLowerCase()
  if (!key) return null
  return maps.byName.get(key) ?? null
}

/**
 * Encontra nome e telefone de inscrição por phone + context (email).
 */
export function findInscricao(
  phone: string,
  context: Record<string, unknown> | null,
  maps: InscricoesMaps
): InscricaoData | null {
  const leadEmail = (context?.lead_email as string) || (context?.email as string) || ''
  const em = leadEmail.trim().toLowerCase()
  if (em && em.includes('@')) {
    const found = maps.byEmail.get(em)
    if (found) return found
  }
  const d = digits(phone)
  const candidates = phoneCandidates(d)
  for (const cand of candidates) {
    for (const len of [11, 10, 9, 8, 7, 6]) {
      if (cand.length < len) continue
      const key = lastN(cand, len)
      const found = maps.byPhoneSuffix.get(key)
      if (found) return found
    }
  }
  return null
}

/**
 * Na primeira conexão (eles nos chamam ou nós chamamos), grava o nome e telefone
 * do cadastro no Supabase (workshop_inscricoes, contact_submissions, leads, nutri_leads) na conversa.
 * Assim a lista do admin já mostra nome + telefone desde o início.
 */
export async function syncConversationFromCadastro(
  conversationId: string,
  phone: string,
  existingContext?: Record<string, unknown> | null
): Promise<boolean> {
  try {
    if (!supabaseAdmin) return false
    const maps = await buildInscricoesMaps()
    let ctx = existingContext ?? null
    if (ctx === undefined) {
      const { data: conv } = await supabaseAdmin
        .from('whatsapp_conversations')
        .select('context')
        .eq('id', conversationId)
        .single()
      ctx = (conv?.context as Record<string, unknown>) ?? null
    }
    const data = findInscricao(phone, ctx, maps)
    if (!data?.nome) return false
    const prev = (ctx && typeof ctx === 'object' && !Array.isArray(ctx)) ? (ctx as Record<string, unknown>) : {}
    const { error } = await supabaseAdmin
      .from('whatsapp_conversations')
      .update({
        name: data.nome,
        customer_name: data.nome,
        context: { ...prev, display_name: data.nome, display_phone: data.telefone },
      })
      .eq('id', conversationId)
    if (error) {
      console.warn('[whatsapp-conversation-enrichment] Erro ao gravar nome do cadastro:', error.message)
      return false
    }
    return true
  } catch (e) {
    console.warn('[whatsapp-conversation-enrichment] syncConversationFromCadastro:', e)
    return false
  }
}
