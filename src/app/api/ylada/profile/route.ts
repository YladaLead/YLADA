/**
 * GET /api/ylada/profile — perfil do usuário logado para um segmento.
 *   Query: segment (obrigatório). Retorna { profile, resumo } (resumo = texto para o Noel).
 * PUT /api/ylada/profile — upsert perfil (body: segment + campos). Retorna o perfil salvo.
 * @see docs/PERFIL-EMPRESARIAL-YLADA-MODELO.md
 */
import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { buildProfileResumo, type YladaNoelProfileRow } from '@/lib/ylada-profile-resumo'
import { validateProfessionForSegment } from '@/config/ylada-profile-flows'
import { getPerfilSimuladoByKey, SIMULATE_COOKIE_NAME } from '@/data/perfis-simulados'
import { yladaApiRejectWellnessProductUser } from '@/lib/ylada-api-guard'

const VALID_SEGMENTS = [
  'ylada',
  'med',
  'psi',
  'psicanalise',
  'odonto',
  'nutra',
  'coach',
  'seller',
  'perfumaria',
  'estetica',
  'fitness',
  'joias',
] as const

type ProfilePayload = {
  segment: string
  profile_type?: string | null
  profession?: string | null
  flow_id?: string | null
  flow_version?: number | null
  category?: string | null
  sub_category?: string | null
  tempo_atuacao_anos?: number | null
  dor_principal?: string | null
  prioridade_atual?: string | null
  fase_negocio?: string | null
  metas_principais?: string | null
  objetivos_curto_prazo?: string | null
  modelo_atuacao?: unknown
  capacidade_semana?: number | null
  ticket_medio?: number | null
  modelo_pagamento?: string | null
  canais_principais?: unknown
  rotina_atual_resumo?: string | null
  frequencia_postagem?: string | null
  observacoes?: string | null
  area_specific?: Record<string, unknown> | null
}

function sanitizePayload(body: Record<string, unknown>, userId: string): { segment: string; row: Record<string, unknown> } | null {
  let segment = typeof body.segment === 'string' ? body.segment.trim().toLowerCase() : ''
  // Garantir segmento válido (evita constraint ylada_noel_profile_segment_check)
  if (!segment || !VALID_SEGMENTS.includes(segment as (typeof VALID_SEGMENTS)[number])) {
    if (segment === 'vendas' || segment === 'liberal') segment = 'ylada'
    else return null
  }
  if (!segment) return null
  const allowed: (keyof ProfilePayload)[] = [
    'segment', 'profile_type', 'profession', 'flow_id', 'flow_version', 'category', 'sub_category', 'tempo_atuacao_anos', 'dor_principal', 'prioridade_atual', 'fase_negocio',
    'metas_principais', 'objetivos_curto_prazo', 'modelo_atuacao', 'capacidade_semana', 'ticket_medio',
    'modelo_pagamento', 'canais_principais', 'rotina_atual_resumo', 'frequencia_postagem',
    'observacoes', 'area_specific',
  ]
  const row: Record<string, unknown> = { user_id: userId, segment }
  for (const key of allowed) {
    if (key === 'segment' || key === 'user_id') continue
    if (!(key in body)) continue
    const v = body[key]
    if (v === undefined) continue
    if (v === null || v === '') {
      row[key] = null
      continue
    }
    if (key === 'tempo_atuacao_anos' || key === 'capacidade_semana') {
      row[key] = typeof v === 'number' ? v : parseInt(String(v), 10)
      if (Number.isNaN(row[key])) row[key] = null
      continue
    }
    if (key === 'ticket_medio') {
      row[key] = typeof v === 'number' ? v : parseFloat(String(v))
      if (Number.isNaN(row[key])) row[key] = null
      continue
    }
    if (key === 'modelo_atuacao' || key === 'canais_principais') {
      row[key] = Array.isArray(v) ? v : typeof v === 'object' && v !== null ? v : null
      continue
    }
    if (key === 'area_specific') {
      row[key] = typeof v === 'object' && v !== null ? v : {}
      continue
    }
    if (key === 'profile_type' || key === 'profession' || key === 'flow_id') {
      row[key] = typeof v === 'string' && v.trim() ? v.trim() : null
      continue
    }
    if (key === 'flow_version') {
      row[key] = typeof v === 'number' ? v : v != null ? parseInt(String(v), 10) : null
      if (row[key] != null && Number.isNaN(row[key])) row[key] = null
      continue
    }
    if (typeof v === 'string') row[key] = v
  }
  return { segment, row }
}

export async function GET(request: NextRequest) {
  try {
    const auth = await requireApiAuth(request)
    if (auth instanceof NextResponse) return auth
    const { user } = auth

    const wellnessBlock = await yladaApiRejectWellnessProductUser(user.id)
    if (wellnessBlock) return wellnessBlock

    const { searchParams } = new URL(request.url)
    const segment = searchParams.get('segment')?.trim().toLowerCase()
    if (!segment || !VALID_SEGMENTS.includes(segment as (typeof VALID_SEGMENTS)[number])) {
      return NextResponse.json(
        { success: false, error: 'Query segment é obrigatório e deve ser um de: ' + VALID_SEGMENTS.join(', ') },
        { status: 400 }
      )
    }

    // Perfil simulado para testes: cookie ylada_simulate_profile
    const simulateKey = request.cookies.get(SIMULATE_COOKIE_NAME)?.value?.trim()
    if (simulateKey) {
      const fixture = getPerfilSimuladoByKey(simulateKey)
      if (fixture && fixture.segment === segment) {
        const resumo = buildProfileResumo(fixture)
        return NextResponse.json({
          success: true,
          data: { profile: fixture, resumo, _simulated: true },
        })
      }
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ success: false, error: 'Backend não configurado' }, { status: 503 })
    }

    const { data: profile, error } = await supabaseAdmin
      .from('ylada_noel_profile')
      .select('*')
      .eq('user_id', user.id)
      .eq('segment', segment)
      .maybeSingle()

    if (error) {
      console.error('[ylada/profile] GET', error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    const resumo = buildProfileResumo(profile as YladaNoelProfileRow | null)
    return NextResponse.json({
      success: true,
      data: { profile: profile ?? null, resumo },
    })
  } catch (e) {
    console.error('[ylada/profile] GET', e)
    return NextResponse.json(
      { success: false, error: e instanceof Error ? e.message : 'Erro ao buscar perfil' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const auth = await requireApiAuth(request)
    if (auth instanceof NextResponse) return auth
    const { user } = auth

    const wellnessBlock = await yladaApiRejectWellnessProductUser(user.id)
    if (wellnessBlock) return wellnessBlock

    // Em modo simulação não persiste — evita sobrescrever perfil real
    const simulateKey = request.cookies.get(SIMULATE_COOKIE_NAME)?.value?.trim()
    if (simulateKey) {
      const fixture = getPerfilSimuladoByKey(simulateKey)
      if (fixture) {
        const resumo = buildProfileResumo(fixture)
        return NextResponse.json({ success: true, data: { profile: fixture, resumo, _simulated: true } })
      }
    }

    const body = await request.json().catch(() => ({}))
    const parsed = sanitizePayload(body as Record<string, unknown>, user.id)
    if (!parsed) {
      return NextResponse.json(
        { success: false, error: 'Body deve conter segment válido (ylada, psi, psicanalise, odonto, nutra, coach, seller).' },
        { status: 400 }
      )
    }
    const profession = parsed.row.profession as string | undefined
    if (profession && !validateProfessionForSegment(parsed.segment, profession)) {
      return NextResponse.json(
        { success: false, error: `Profissão "${profession}" não é permitida para o segmento ${parsed.segment}.` },
        { status: 400 }
      )
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ success: false, error: 'Backend não configurado' }, { status: 503 })
    }

    const { data, error } = await supabaseAdmin
      .from('ylada_noel_profile')
      .upsert(parsed.row, { onConflict: 'user_id,segment' })
      .select()
      .single()

    if (error) {
      console.error('[ylada/profile] PUT', error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    // Sincronizar nome e WhatsApp para user_profiles (admin, header, gate de área protegida)
    const savedRow = data as Record<string, unknown> | null
    const areaSpec = (savedRow?.area_specific ?? parsed.row.area_specific) as Record<string, unknown> | null | undefined
    const nome = areaSpec?.nome && String(areaSpec.nome).trim()
    const waRaw = areaSpec?.whatsapp
    const waDigits =
      waRaw !== undefined && waRaw !== null
        ? String(waRaw).replace(/\D/g, '')
        : ''
    const patch: { nome_completo?: string; whatsapp?: string; updated_at: string } = {
      updated_at: new Date().toISOString(),
    }
    if (nome && nome.length >= 2) patch.nome_completo = nome
    if (waDigits.length >= 10) patch.whatsapp = waDigits
    if (patch.nome_completo !== undefined || patch.whatsapp !== undefined) {
      const { data: updatedRows, error: updateErr } = await supabaseAdmin
        .from('user_profiles')
        .update(patch)
        .eq('user_id', user.id)
        .select('user_id')
      if (updateErr) {
        console.error('[ylada/profile] user_profiles update:', updateErr)
      } else if (!updatedRows?.length) {
        const meta = user.user_metadata as Record<string, unknown> | undefined
        const nomeFallback =
          patch.nome_completo ??
          (typeof meta?.full_name === 'string' ? meta.full_name : null) ??
          (typeof meta?.name === 'string' ? meta.name : null) ??
          ''
        const { error: insertErr } = await supabaseAdmin.from('user_profiles').insert({
          user_id: user.id,
          email: user.email ?? '',
          nome_completo: nomeFallback,
          whatsapp: patch.whatsapp ?? null,
          perfil: parsed.segment,
          updated_at: patch.updated_at,
        })
        if (insertErr) {
          if (insertErr.code === '23505') {
            const { error: retryErr } = await supabaseAdmin.from('user_profiles').update(patch).eq('user_id', user.id)
            if (retryErr) console.error('[ylada/profile] user_profiles update after duplicate:', retryErr)
          } else {
            console.error('[ylada/profile] user_profiles insert (sem linha prévia):', insertErr)
          }
        }
      }
    }

    const resumo = buildProfileResumo(data as YladaNoelProfileRow)
    return NextResponse.json({ success: true, data: { profile: data, resumo } })
  } catch (e) {
    console.error('[ylada/profile] PUT', e)
    return NextResponse.json(
      { success: false, error: e instanceof Error ? e.message : 'Erro ao salvar perfil' },
      { status: 500 }
    )
  }
}
