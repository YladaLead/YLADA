/**
 * POST /api/link-events — registra evento unificado por link (view, whatsapp_click, lead_capture).
 * Pública; usada por Nutri, Wellness, Coach e (futuro) YLADA.
 * Resolve user_id a partir do link (user_templates, quizzes, ylada_links).
 * @see docs/PASSO-A-PASSO-CONTAGEM-LINKS.md
 */
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { withRateLimit } from '@/lib/rate-limit'

const EVENT_TYPES = ['view', 'whatsapp_click', 'lead_capture'] as const
const LINK_SOURCES = ['user_template', 'quiz', 'form', 'ylada_link', 'generated_link'] as const
const AREAS = ['nutri', 'wellness', 'coach', 'ylada'] as const

export async function POST(request: NextRequest) {
  return withRateLimit(request, 'link-events-post', async () => {
    try {
      if (!supabaseAdmin) {
        return NextResponse.json({ success: false, error: 'Backend não configurado' }, { status: 503 })
      }

      const body = await request.json().catch(() => ({}))
      const eventType = (body.event_type || '').trim().toLowerCase()
      const linkSource = (body.link_source || '').trim().toLowerCase()
      const linkId = body.link_id
      const area = (body.area || '').trim().toLowerCase()

      if (!EVENT_TYPES.includes(eventType as (typeof EVENT_TYPES)[number])) {
        return NextResponse.json(
          { success: false, error: 'event_type inválido. Use: view, whatsapp_click, lead_capture' },
          { status: 400 }
        )
      }
      if (!LINK_SOURCES.includes(linkSource as (typeof LINK_SOURCES)[number])) {
        return NextResponse.json(
          { success: false, error: 'link_source inválido' },
          { status: 400 }
        )
      }
      if (!AREA.includes(area as (typeof AREAS)[number])) {
        return NextResponse.json(
          { success: false, error: 'area inválida. Use: nutri, wellness, coach, ylada' },
          { status: 400 }
        )
      }
      if (!linkId || typeof linkId !== 'string') {
        return NextResponse.json({ success: false, error: 'link_id é obrigatório (UUID)' }, { status: 400 })
      }

      let userId: string | null = null

      if (linkSource === 'user_template') {
        const { data } = await supabaseAdmin
          .from('user_templates')
          .select('user_id')
          .eq('id', linkId)
          .maybeSingle()
        userId = data?.user_id ?? null
      } else if (linkSource === 'quiz') {
        const { data } = await supabaseAdmin
          .from('quizzes')
          .select('user_id')
          .eq('id', linkId)
          .maybeSingle()
        userId = data?.user_id ?? null
      } else if (linkSource === 'ylada_link') {
        const { data } = await supabaseAdmin
          .from('ylada_links')
          .select('user_id')
          .eq('id', linkId)
          .maybeSingle()
        userId = data?.user_id ?? null
      } else if (linkSource === 'generated_link') {
        const { data } = await supabaseAdmin
          .from('generated_links')
          .select('user_id')
          .eq('id', linkId)
          .maybeSingle()
        userId = data?.user_id ?? null
      }
      // form: pode ser custom_forms ou outro; adicionar quando houver fluxo

      if (!userId) {
        return NextResponse.json(
          { success: false, error: 'Link não encontrado ou inativo' },
          { status: 404 }
        )
      }

      const { error } = await supabaseAdmin.from('link_events').insert({
        event_type: eventType,
        link_source: linkSource,
        link_id: linkId,
        user_id: userId,
        area,
        lead_id: body.lead_id || null,
      })

      if (error) {
        if (error.code === '42P01') {
          return NextResponse.json(
            { success: false, error: 'Tabela link_events não existe. Execute a migration 215.' },
            { status: 501 }
          )
        }
        console.error('[link-events] insert error:', error)
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
      }

      return NextResponse.json({ success: true })
    } catch (e: any) {
      console.error('[link-events]', e)
      return NextResponse.json(
        { success: false, error: e?.message || 'Erro ao registrar evento' },
        { status: 500 }
      )
    }
  }, { limit: 120, window: 60 })
}
