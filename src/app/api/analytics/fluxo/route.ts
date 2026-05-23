import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Supabase service-role client — bypasses RLS for inserts from anon visitors
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export interface FluxoAnalyticsEvent {
  fluxo_id: string
  fluxo_nome?: string
  session_id: string
  evento: 'iniciou' | 'respondeu' | 'voltou' | 'resultado_visto' | 'cta_clicado'
  pergunta_idx?: number
  pergunta_id?: string
  resposta?: string
  perfil?: string
  tempo_s?: number
  dispositivo?: 'mobile' | 'tablet' | 'desktop'
  hora_local?: number
}

export async function POST(req: NextRequest) {
  try {
    const body: FluxoAnalyticsEvent | FluxoAnalyticsEvent[] = await req.json()

    // Aceita evento único ou batch de eventos
    const events = Array.isArray(body) ? body : [body]

    // Validação mínima
    const valid = events.every(
      (e) => e.fluxo_id && e.session_id && e.evento
    )
    if (!valid) {
      return NextResponse.json({ error: 'Payload inválido' }, { status: 400 })
    }

    // Sanitizar: garantir que não há dados pessoais nos campos livres
    const rows = events.map((e) => ({
      fluxo_id:    e.fluxo_id,
      fluxo_nome:  e.fluxo_nome ?? null,
      session_id:  e.session_id,
      evento:      e.evento,
      pergunta_idx: e.pergunta_idx ?? null,
      pergunta_id:  e.pergunta_id ?? null,
      // Truncar resposta para evitar texto livre longo (e potencialmente identificável)
      resposta:    e.resposta != null ? String(e.resposta).slice(0, 200) : null,
      perfil:      e.perfil ?? null,
      tempo_s:     e.tempo_s ?? null,
      dispositivo: e.dispositivo ?? null,
      hora_local:  e.hora_local ?? null,
    }))

    const { error } = await supabase.from('fluxo_analytics').insert(rows)

    if (error) {
      console.error('[analytics/fluxo] Supabase error:', error.message)
      // Não retornar 500 — analytics nunca deve quebrar o fluxo do usuário
      return NextResponse.json({ ok: false, detail: error.message }, { status: 200 })
    }

    return NextResponse.json({ ok: true, count: rows.length })
  } catch (err) {
    console.error('[analytics/fluxo] Unexpected error:', err)
    return NextResponse.json({ ok: false }, { status: 200 }) // silencioso para o cliente
  }
}
