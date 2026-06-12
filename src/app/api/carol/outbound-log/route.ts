import { NextRequest, NextResponse } from 'next/server'
import { registerOutboundSend } from '@/lib/carol/register-outbound'

function unauthorized() {
  return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
}

function checkSecret(request: NextRequest): boolean {
  const secret = process.env.YLADA_OUTBOUND_SYNC_SECRET
  if (!secret) return false
  const auth = request.headers.get('authorization')
  if (!auth?.startsWith('Bearer ')) return false
  return auth.slice(7) === secret
}

/** Registra envio de template (Ylada Outbound ou integrações) no painel Carol */
export async function POST(request: NextRequest) {
  if (!process.env.YLADA_OUTBOUND_SYNC_SECRET) {
    return NextResponse.json(
      { error: 'YLADA_OUTBOUND_SYNC_SECRET não configurado no servidor' },
      { status: 503 }
    )
  }
  if (!checkSecret(request)) return unauthorized()

  let body: {
    phone?: string
    template?: string
    nome?: string
    cidade?: string
    source?: 'ylada_outbound' | 'admin'
    items?: Array<{ phone: string; template: string; nome?: string; cidade?: string }>
  }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  // Sincronização em lote (ex.: disparos já feitos antes da ponte)
  if (Array.isArray(body.items) && body.items.length > 0) {
    const results: { phone: string; ok: boolean; error?: string }[] = []
    for (const item of body.items) {
      if (!item.phone || !item.template) {
        results.push({ phone: item.phone || '?', ok: false, error: 'phone/template obrigatórios' })
        continue
      }
      try {
        await registerOutboundSend({
          phone: item.phone,
          template: item.template,
          nome: item.nome,
          cidade: item.cidade,
          source: body.source ?? 'ylada_outbound',
        })
        results.push({ phone: item.phone, ok: true })
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Erro'
        results.push({ phone: item.phone, ok: false, error: msg })
      }
    }
    const ok = results.filter((r) => r.ok).length
    return NextResponse.json({ success: true, synced: ok, failed: results.length - ok, results })
  }

  const { phone, template, nome, cidade, source } = body
  if (!phone || !template) {
    return NextResponse.json(
      { error: 'Campos obrigatórios: phone, template' },
      { status: 400 }
    )
  }

  try {
    const result = await registerOutboundSend({
      phone,
      template,
      nome,
      cidade,
      source: source ?? 'ylada_outbound',
    })
    return NextResponse.json({ success: true, ...result })
  } catch (error) {
    console.error('[outbound-log] Erro:', error)
    const msg = error instanceof Error ? error.message : 'Erro desconhecido'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
