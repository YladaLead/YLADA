import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { AULA_PAGA_ZOOM_LINK } from '@/lib/aula-paga-config'

/**
 * POST /api/nutri/aula-paga/verificar-acesso
 * Verifica se o e-mail está inscrito e confirmado na aula paga; retorna o link do Zoom só se OK.
 * Rate limit simples por IP para evitar abuso.
 */
const RATE_LIMIT_REQUESTS = 15
const RATE_LIMIT_WINDOW_MS = 60 * 1000 // 1 minuto
const ipCounts = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = ipCounts.get(ip)
  if (!entry) {
    ipCounts.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return true
  }
  if (now >= entry.resetAt) {
    ipCounts.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return true
  }
  if (entry.count >= RATE_LIMIT_REQUESTS) return false
  entry.count++
  return true
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown'
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { ok: false, error: 'Muitas tentativas. Tente novamente em alguns minutos.' },
        { status: 429 }
      )
    }

    const body = await request.json().catch(() => ({}))
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { ok: false, error: 'Informe um e-mail válido.' },
        { status: 400 }
      )
    }

    const { data: row, error } = await supabaseAdmin
      .from('workshop_inscricoes')
      .select('id, email, status')
      .eq('email', email)
      .eq('workshop_type', 'aula_paga')
      .maybeSingle()

    if (error) {
      console.error('[aula-paga verificar-acesso] Erro:', error)
      return NextResponse.json(
        { ok: false, error: 'Erro ao verificar. Tente novamente.' },
        { status: 500 }
      )
    }

    if (!row || row.status !== 'confirmado') {
      return NextResponse.json({
        ok: false,
        error: 'E-mail não encontrado ou inscrição ainda não confirmada (pagamento em processamento). Use o e-mail da compra.',
      })
    }

    return NextResponse.json({
      ok: true,
      zoomLink: AULA_PAGA_ZOOM_LINK,
    })
  } catch (e) {
    console.error('[aula-paga verificar-acesso]', e)
    return NextResponse.json(
      { ok: false, error: 'Erro ao verificar. Tente novamente.' },
      { status: 500 }
    )
  }
}
