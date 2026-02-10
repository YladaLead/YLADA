import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { syncPaymentByIdFromMercadoPago } from '@/app/api/webhooks/mercado-pago/route'

/**
 * POST /api/admin/mercado-pago/sync-payment
 * Sincroniza um pagamento pelo ID do Mercado Pago quando o webhook não notificou.
 * Apenas admin. Body: { payment_id: string | number, is_test?: boolean }
 */
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const body = await request.json()
    const paymentId = body.payment_id ?? body.paymentId
    const isTest = body.is_test ?? body.isTest ?? false

    if (paymentId === undefined || paymentId === null || paymentId === '') {
      return NextResponse.json(
        { error: 'Envie payment_id (ID da transação no Mercado Pago)' },
        { status: 400 }
      )
    }

    const result = await syncPaymentByIdFromMercadoPago(
      String(paymentId).trim(),
      Boolean(isTest)
    )

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: result.message ?? 'Pagamento sincronizado. Assinatura e usuário atualizados.',
    })
  } catch (err: any) {
    console.error('Erro em POST /api/admin/mercado-pago/sync-payment:', err)
    return NextResponse.json(
      { error: err?.message ?? 'Erro ao sincronizar pagamento' },
      { status: 500 }
    )
  }
}
