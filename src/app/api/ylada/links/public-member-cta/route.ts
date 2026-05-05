/**
 * GET /api/ylada/links/public-member-cta?slug=&member_segment=
 * Público — devolve o WhatsApp atribuído ao membro (Pro Líderes) para o par slug + segmento.
 * Reforça o CTA no cliente quando o path inclui /l/.../[membro] mas o HTML veio com número do líder.
 */
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { resolveProLideresPublicMemberCtaForSlug } from '@/lib/ylada-public-link-member-cta'

export async function GET(request: NextRequest) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Servidor indisponível' }, { status: 503 })
  }

  const slug = request.nextUrl.searchParams.get('slug')?.trim() || ''
  const memberSegment = request.nextUrl.searchParams.get('member_segment')?.trim() || ''
  if (!slug || !memberSegment) {
    return NextResponse.json({ error: 'slug e member_segment são obrigatórios' }, { status: 400 })
  }

  const resolved = await resolveProLideresPublicMemberCtaForSlug(supabaseAdmin, slug, memberSegment)
  if (!resolved) {
    return NextResponse.json({ error: 'Não encontrado' }, { status: 404 })
  }

  return NextResponse.json({
    whatsapp: resolved.whatsapp,
    token: resolved.token,
  })
}
