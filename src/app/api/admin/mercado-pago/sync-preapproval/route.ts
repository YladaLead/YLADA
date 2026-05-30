import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'

/**
 * POST /api/admin/mercado-pago/sync-preapproval
 * Sincroniza assinatura recorrente (preapproval) quando o webhook não gravou no Supabase.
 * Body: { preapproval_id: string, is_test?: boolean }
 */
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const body = await request.json()
    const preapprovalId = body.preapproval_id ?? body.preapprovalId
    const isTest = body.is_test ?? body.isTest ?? false

    if (preapprovalId === undefined || preapprovalId === null || preapprovalId === '') {
      return NextResponse.json(
        { error: 'Envie preapproval_id (ID da assinatura recorrente no Mercado Pago)' },
        { status: 400 }
      )
    }

    const { syncPreapprovalByIdFromMercadoPago } = await import(
      '@/app/api/webhooks/mercado-pago/route'
    )
    const result = await syncPreapprovalByIdFromMercadoPago(String(preapprovalId).trim(), Boolean(isTest))

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: result.message ?? 'Assinatura sincronizada.',
    })
  } catch (err: unknown) {
    console.error('Erro em POST /api/admin/mercado-pago/sync-preapproval:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erro ao sincronizar assinatura' },
      { status: 500 }
    )
  }
}
