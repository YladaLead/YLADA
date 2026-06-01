/**
 * Gate do Noel: nome, WhatsApp e perfil empresarial.
 * Coach de bem-estar e migrados Wellness costumam ter contato em user_profiles
 * e perfil em ylada_noel_profile (segmento ylada) — mesclamos fontes antes de bloquear.
 */
import type { SupabaseClient } from '@supabase/supabase-js'
import { getYladaAreaPathPrefix } from '@/config/ylada-areas'
import type { YladaNoelProfileRow } from '@/lib/ylada-profile-resumo'

export type NoelProfileGateMissing = 'nome' | 'whatsapp' | 'perfil_empresarial'

export type NoelProfileGateResult = {
  ok: boolean
  missing: NoelProfileGateMissing[]
  profileUrl: string
  effectiveProfile: YladaNoelProfileRow | null
  /** Persistir contato em area_specific quando veio só de user_profiles */
  syncContact?: { segment: string; nome: string; whatsapp: string }
}

export function parseNoelAreaSpecific(raw: unknown): Record<string, unknown> {
  if (raw == null) return {}
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw) as Record<string, unknown>
      return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {}
    } catch {
      return {}
    }
  }
  if (typeof raw === 'object' && !Array.isArray(raw)) {
    return raw as Record<string, unknown>
  }
  return {}
}

export function normalizeWhatsappDigits(value: unknown): string {
  if (value == null) return ''
  return String(value).replace(/\D/g, '')
}

export function normalizeNome(value: unknown): string {
  if (value == null) return ''
  return String(value).trim()
}

export function getPerfilEmpresarialUrlForSegment(segment: string): string {
  const seg = segment.trim() || 'ylada'
  if (seg === 'ylada') return '/pt/perfil-empresarial'
  const prefix = getYladaAreaPathPrefix(seg)
  return prefix === '/pt' ? '/pt/perfil-empresarial' : `${prefix}/perfil-empresarial`
}

type UserProfileContact = {
  nome_completo?: string | null
  whatsapp?: string | null
  perfil?: string | null
}

function pickContact(...sources: Array<Record<string, unknown> | UserProfileContact | null | undefined>): {
  nome: string
  whatsapp: string
} {
  let nome = ''
  let whatsapp = ''
  for (const src of sources) {
    if (!src) continue
    if ('nome_completo' in src && !nome) {
      const n = normalizeNome(src.nome_completo)
      if (n.length >= 2) nome = n
    }
    if ('whatsapp' in src && !whatsapp) {
      const w = normalizeWhatsappDigits(src.whatsapp)
      if (w.length >= 10) whatsapp = w
    }
    const as = 'area_specific' in src ? parseNoelAreaSpecific(src.area_specific) : src
    if (!nome) {
      const n = normalizeNome(as.nome)
      if (n.length >= 2) nome = n
    }
    if (!whatsapp) {
      const w = normalizeWhatsappDigits(as.whatsapp)
      if (w.length >= 10) whatsapp = w
    }
  }
  return { nome, whatsapp }
}

function hasPerfilEmpresarial(row: YladaNoelProfileRow | null | undefined): boolean {
  return !!(row?.profile_type?.trim() && row?.profession?.trim())
}

function mergeProfiles(
  primary: YladaNoelProfileRow | null,
  secondary: YladaNoelProfileRow | null,
  contact: { nome: string; whatsapp: string },
  segment: string
): YladaNoelProfileRow | null {
  const base = primary ?? secondary
  if (!base && !contact.nome && !contact.whatsapp) return null
  const asPrimary = parseNoelAreaSpecific(primary?.area_specific)
  const asSecondary = parseNoelAreaSpecific(secondary?.area_specific)
  const area_specific: Record<string, unknown> = { ...asSecondary, ...asPrimary }
  if (contact.nome) area_specific.nome = contact.nome
  if (contact.whatsapp) area_specific.whatsapp = contact.whatsapp

  return {
    segment: primary?.segment ?? secondary?.segment ?? segment,
    profile_type: primary?.profile_type ?? secondary?.profile_type ?? null,
    profession: primary?.profession ?? secondary?.profession ?? null,
    flow_id: primary?.flow_id ?? secondary?.flow_id ?? null,
    flow_version: primary?.flow_version ?? secondary?.flow_version ?? null,
    category: primary?.category ?? secondary?.category ?? null,
    sub_category: primary?.sub_category ?? secondary?.sub_category ?? null,
    tempo_atuacao_anos: primary?.tempo_atuacao_anos ?? secondary?.tempo_atuacao_anos ?? null,
    dor_principal: primary?.dor_principal ?? secondary?.dor_principal ?? null,
    prioridade_atual: primary?.prioridade_atual ?? secondary?.prioridade_atual ?? null,
    fase_negocio: primary?.fase_negocio ?? secondary?.fase_negocio ?? null,
    metas_principais: primary?.metas_principais ?? secondary?.metas_principais ?? null,
    objetivos_curto_prazo: primary?.objetivos_curto_prazo ?? secondary?.objetivos_curto_prazo ?? null,
    modelo_atuacao: primary?.modelo_atuacao ?? secondary?.modelo_atuacao ?? null,
    capacidade_semana: primary?.capacidade_semana ?? secondary?.capacidade_semana ?? null,
    ticket_medio: primary?.ticket_medio ?? secondary?.ticket_medio ?? null,
    modelo_pagamento: primary?.modelo_pagamento ?? secondary?.modelo_pagamento ?? null,
    canais_principais: primary?.canais_principais ?? secondary?.canais_principais ?? null,
    rotina_atual_resumo: primary?.rotina_atual_resumo ?? secondary?.rotina_atual_resumo ?? null,
    frequencia_postagem: primary?.frequencia_postagem ?? secondary?.frequencia_postagem ?? null,
    observacoes: primary?.observacoes ?? secondary?.observacoes ?? null,
    area_specific,
  }
}

export type NoelProfileGateContext = {
  segment: string
  segmentRow: YladaNoelProfileRow | null
  yladaRow: YladaNoelProfileRow | null
  userProfile: UserProfileContact | null
  authNome?: string | null
}

export function evaluateNoelProfileGate(ctx: NoelProfileGateContext): NoelProfileGateResult {
  const { segment, segmentRow, yladaRow, userProfile, authNome } = ctx
  const profileUrl = getPerfilEmpresarialUrlForSegment(segment)

  const segmentAs = parseNoelAreaSpecific(segmentRow?.area_specific)
  const contact = pickContact(
    segmentAs,
    parseNoelAreaSpecific(yladaRow?.area_specific),
    userProfile,
    authNome ? { nome_completo: authNome } : null
  )

  const temNome = contact.nome.length >= 2
  const temWhatsapp = contact.whatsapp.length >= 10
  const temPerfilEmpresarial = hasPerfilEmpresarial(segmentRow) || hasPerfilEmpresarial(yladaRow)

  const missing: NoelProfileGateMissing[] = []
  if (!temNome) missing.push('nome')
  if (!temWhatsapp) missing.push('whatsapp')
  if (!temPerfilEmpresarial) missing.push('perfil_empresarial')

  const effectiveProfile = mergeProfiles(segmentRow, yladaRow, contact, segment)

  let syncContact: NoelProfileGateResult['syncContact']
  if (segmentRow && temNome && temWhatsapp) {
    const hadNomeInRow = normalizeNome(segmentAs.nome).length >= 2
    const hadWaInRow = normalizeWhatsappDigits(segmentAs.whatsapp).length >= 10
    if (!hadNomeInRow || !hadWaInRow) {
      syncContact = {
        segment: segmentRow.segment ?? segment,
        nome: contact.nome,
        whatsapp: contact.whatsapp,
      }
    }
  }

  return {
    ok: missing.length === 0,
    missing,
    profileUrl,
    effectiveProfile,
    syncContact,
  }
}

export async function loadNoelProfileGateContext(
  supabase: SupabaseClient,
  userId: string,
  segment: string,
  authMeta?: Record<string, unknown> | null
): Promise<NoelProfileGateContext> {
  const [segmentRes, yladaRes, userRes] = await Promise.all([
    supabase.from('ylada_noel_profile').select('*').eq('user_id', userId).eq('segment', segment).maybeSingle(),
    segment === 'ylada'
      ? Promise.resolve({ data: null })
      : supabase.from('ylada_noel_profile').select('*').eq('user_id', userId).eq('segment', 'ylada').maybeSingle(),
    supabase
      .from('user_profiles')
      .select('nome_completo, whatsapp, perfil')
      .eq('user_id', userId)
      .maybeSingle(),
  ])

  const authNome =
    (typeof authMeta?.full_name === 'string' && authMeta.full_name.trim()) ||
    (typeof authMeta?.name === 'string' && authMeta.name.trim()) ||
    null

  return {
    segment,
    segmentRow: (segmentRes.data as YladaNoelProfileRow | null) ?? null,
    yladaRow: (yladaRes.data as YladaNoelProfileRow | null) ?? null,
    userProfile: userRes.data as UserProfileContact | null,
    authNome,
  }
}

/** Grava nome/WhatsApp em area_specific quando vieram de user_profiles (corrige contas migradas). */
export async function syncNoelProfileContactIfNeeded(
  supabase: SupabaseClient,
  userId: string,
  sync: { segment: string; nome: string; whatsapp: string }
): Promise<void> {
  const { data: row, error } = await supabase
    .from('ylada_noel_profile')
    .select('area_specific')
    .eq('user_id', userId)
    .eq('segment', sync.segment)
    .maybeSingle()

  if (error || !row) return

  const as = parseNoelAreaSpecific(row.area_specific)
  const next = {
    ...as,
    nome: sync.nome,
    whatsapp: sync.whatsapp,
  }

  await supabase
    .from('ylada_noel_profile')
    .update({ area_specific: next, updated_at: new Date().toISOString() })
    .eq('user_id', userId)
    .eq('segment', sync.segment)
}

/** Mescla contato de user_profiles em area_specific antes do PUT (Perfil empresarial). */
export function mergeUserProfileContactIntoAreaSpecific(
  areaSpecific: Record<string, unknown> | null | undefined,
  userProfile: UserProfileContact | null | undefined
): Record<string, unknown> {
  const base = { ...parseNoelAreaSpecific(areaSpecific) }
  const contact = pickContact(base, userProfile)
  if (contact.nome) base.nome = contact.nome
  if (contact.whatsapp) base.whatsapp = contact.whatsapp
  return base
}
