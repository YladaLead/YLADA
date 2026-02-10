import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/cron/whatsapp-carol
 *
 * Chamado pelo Vercel Cron a cada 10 min. Valida CRON_SECRET e dispara process-all
 * (lembretes 2h/12h/10min antes da aula + remarketing participou/não participou).
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  const secret = process.env.CRON_SECRET
  if (!secret || authHeader !== `Bearer ${secret}`) {
    return NextResponse.json(
      { ok: false, error: 'Unauthorized', hint: 'Configure CRON_SECRET e use Authorization: Bearer <CRON_SECRET>' },
      { status: 401 }
    )
  }

  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : process.env.NEXT_PUBLIC_BASE_DOMAIN
    ? `https://${process.env.NEXT_PUBLIC_BASE_DOMAIN}`
    : 'https://www.ylada.com'

  try {
    const res = await fetch(`${baseUrl}/api/admin/whatsapp/automation/process-all`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${secret}`,
      },
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      return NextResponse.json({ ok: false, status: res.status, error: data }, { status: 502 })
    }
    return NextResponse.json({ ok: true, ...data })
  } catch (err: any) {
    console.error('[Cron whatsapp-carol] Erro ao chamar process-all:', err)
    return NextResponse.json(
      { ok: false, error: err?.message || 'Erro ao executar process-all' },
      { status: 500 }
    )
  }
}
