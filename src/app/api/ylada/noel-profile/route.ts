/**
 * GET  /api/ylada/noel-profile  — lê ylada_noel_profile do usuário autenticado (segment=ylada)
 * PATCH /api/ylada/noel-profile  — atualiza campos individuais (UPSERT)
 *
 * Usado pela página espelho "Meu negócio" para leitura e edição inline.
 * O extrator automático (profile-updater-from-chat.ts) grava diretamente via supabaseAdmin.
 */
import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'

const ALLOWED_PROFILES = [
  'psi', 'psicanalise', 'odonto', 'fitness', 'estetica', 'med', 'ylada',
  'nutra', 'nutri', 'coach', 'coach-bem-estar', 'perfumaria', 'seller', 'admin',
] as const

/** Campos editáveis pelo usuário na página espelho. */
const EDITABLE_FIELDS = new Set([
  'dor_principal',
  'prioridade_atual',
  'fase_negocio',
  'ticket_medio',
  'canais_principais',
  'metas_principais',
])

const FASE_VALIDAS = new Set(['iniciante', 'em_crescimento', 'estabilizado', 'escalando'])

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, [...ALLOWED_PROFILES])
    if (authResult instanceof NextResponse) return authResult
    const { user } = authResult

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Configuração do servidor incompleta' }, { status: 500 })
    }

    const { data, error } = await supabaseAdmin
      .from('ylada_noel_profile')
      .select('dor_principal, prioridade_atual, fase_negocio, ticket_medio, canais_principais, metas_principais')
      .eq('user_id', user.id)
      .eq('segment', 'ylada')
      .maybeSingle()

    if (error) throw error

    // Retorna objeto com todos os campos (null quando não existir linha)
    return NextResponse.json({
      success: true,
      profile: {
        dor_principal: data?.dor_principal ?? null,
        prioridade_atual: data?.prioridade_atual ?? null,
        fase_negocio: data?.fase_negocio ?? null,
        ticket_medio: data?.ticket_medio ?? null,
        // canais_principais pode ser JSONB (array) ou null
        canais_principais: Array.isArray(data?.canais_principais)
          ? data.canais_principais
          : data?.canais_principais
            ? JSON.parse(data.canais_principais as unknown as string)
            : [],
        metas_principais: data?.metas_principais ?? null,
      },
    })
  } catch (error: unknown) {
    console.error('[noel-profile] GET', error)
    return NextResponse.json({ error: 'Erro ao carregar perfil' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, [...ALLOWED_PROFILES])
    if (authResult instanceof NextResponse) return authResult
    const { user } = authResult

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Configuração do servidor incompleta' }, { status: 500 })
    }

    const body = await request.json() as Record<string, unknown>

    // Aceita apenas campos editáveis — ignora o resto silenciosamente
    const payload: Record<string, unknown> = {
      user_id: user.id,
      segment: 'ylada',
      updated_at: new Date().toISOString(),
    }

    for (const key of Object.keys(body)) {
      if (!EDITABLE_FIELDS.has(key)) continue

      if (key === 'fase_negocio') {
        const v = body[key]
        if (v === null || v === '' || (typeof v === 'string' && FASE_VALIDAS.has(v))) {
          payload[key] = v || null
        }
        continue
      }

      if (key === 'ticket_medio') {
        const n = Number(body[key])
        payload[key] = n > 0 ? n : null
        continue
      }

      if (key === 'canais_principais') {
        const arr = body[key]
        payload[key] = Array.isArray(arr) ? arr : null
        continue
      }

      // Campos de texto livre
      const v = body[key]
      payload[key] = typeof v === 'string' && v.trim().length > 0 ? v.trim() : null
    }

    const { error } = await supabaseAdmin
      .from('ylada_noel_profile')
      .upsert(payload, { onConflict: 'user_id,segment', ignoreDuplicates: false })

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    console.error('[noel-profile] PATCH', error)
    return NextResponse.json({ error: 'Erro ao salvar perfil' }, { status: 500 })
  }
}
