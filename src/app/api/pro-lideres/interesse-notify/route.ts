import { NextRequest, NextResponse } from 'next/server'
import { notifyProLideresInteresseClick } from '@/lib/pro-lideres-interesse-notify'

export async function POST(request: NextRequest) {
  let source: string | null = null
  try {
    const body = (await request.json()) as { source?: unknown }
    if (typeof body.source === 'string') source = body.source.slice(0, 120)
  } catch {
    /* corpo vazio ok */
  }

  const result = await notifyProLideresInteresseClick({ source })
  return NextResponse.json({ ok: result.ok })
}
