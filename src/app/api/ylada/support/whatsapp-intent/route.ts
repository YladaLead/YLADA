/**
 * POST /api/ylada/support/whatsapp-intent
 * Notifica a equipe (mesmo fluxo da primeira mensagem na Nina) e devolve URL do WhatsApp com texto inicial.
 */
import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { YLADA_SEGMENT_CODES, getYladaAreaConfig } from '@/config/ylada-areas'
import { supabaseAdmin } from '@/lib/supabase'
import { notifyNinaSupportInquiry } from '@/lib/support-notifications'
import { getCarolWhatsAppUrl, buildYladaSupportWhatsappPrefill } from '@/config/ylada-support'

const ALLOWED = [
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
  'nutri',
  'admin',
  'wellness',
  'coach-bem-estar',
] as const

const NOTIFY_MESSAGE =
  'O usuário clicou em “Falar por WhatsApp” na página de Suporte e foi redirecionado para o atendimento humano.'

export async function POST(request: NextRequest) {
  try {
    const auth = await requireApiAuth(request, [...ALLOWED])
    if (auth instanceof NextResponse) return auth
    const { user } = auth

    const body = await request.json().catch(() => ({}))
    const supportUi = body?.supportUi === 'wellness' ? 'wellness' : 'matrix'
    const rawSeg = typeof body?.segment === 'string' ? body.segment.trim() : 'ylada'
    const validSegment = YLADA_SEGMENT_CODES.includes(rawSeg as (typeof YLADA_SEGMENT_CODES)[number])
      ? rawSeg
      : 'ylada'

    const meta = user.user_metadata as Record<string, unknown> | undefined
    const displayName =
      (typeof meta?.full_name === 'string' && meta.full_name.trim()) ||
      (typeof meta?.name === 'string' && meta.name.trim()) ||
      null

    let nomeCompleto: string | null = displayName
    let perfilConta: string | null = null
    let emailPref: string | null = user.email ?? null

    if (supabaseAdmin) {
      const { data: row } = await supabaseAdmin
        .from('user_profiles')
        .select('nome_completo, email, perfil')
        .eq('user_id', user.id)
        .maybeSingle()
      if (row?.nome_completo && String(row.nome_completo).trim().length >= 2) {
        nomeCompleto = String(row.nome_completo).trim()
      }
      if (row?.email && String(row.email).trim()) emailPref = String(row.email).trim()
      if (row?.perfil && String(row.perfil).trim()) perfilConta = String(row.perfil).trim()
    }

    void notifyNinaSupportInquiry({
      userId: user.id,
      userEmail: emailPref,
      displayName: nomeCompleto ?? displayName,
      message: NOTIFY_MESSAGE,
      segment: validSegment,
      supportUi,
    }).catch((err) => console.error('[/api/ylada/support/whatsapp-intent] notify:', err))

    const areaLabel =
      supportUi === 'wellness'
        ? 'Wellness System'
        : getYladaAreaConfig(validSegment)?.label ?? validSegment

    const prefill = buildYladaSupportWhatsappPrefill({
      email: emailPref,
      nomeCompleto,
      areaLabel,
      areaCodigo: validSegment,
      perfilConta,
      userId: user.id,
    })

    const whatsappUrl = getCarolWhatsAppUrl(prefill)

    return NextResponse.json({ ok: true, whatsappUrl })
  } catch (e) {
    console.error('[api/ylada/support/whatsapp-intent]', e)
    return NextResponse.json({ error: 'Não foi possível preparar o WhatsApp.' }, { status: 500 })
  }
}
