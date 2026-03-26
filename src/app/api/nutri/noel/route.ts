/**
 * POST /api/nutri/noel — chat mentor: encaminha para `/api/ylada/noel` (segmento nutri).
 *
 * Rota irmã: `GET /api/nutri/noel/links` (links contextuais para o mentor).
 */
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>
    const origin = request.nextUrl.origin
    const cookie = request.headers.get('cookie') ?? ''

    const res = await fetch(`${origin}/api/ylada/noel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(cookie ? { Cookie: cookie } : {}),
      },
      body: JSON.stringify({
        ...body,
        area: 'nutri',
        segment: 'nutri',
      }),
    })

    const text = await res.text()
    return new NextResponse(text, {
      status: res.status,
      headers: { 'Content-Type': res.headers.get('Content-Type') || 'application/json' },
    })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Erro ao encaminhar para o Noel YLADA.'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
