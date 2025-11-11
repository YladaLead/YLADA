import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/webhooks/mercado-pago/test
 * Endpoint de teste para verificar se o webhook está acessível
 */
export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: true,
    message: 'Webhook está acessível!',
    url: request.url,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  })
}

/**
 * POST /api/webhooks/mercado-pago/test
 * Endpoint de teste para simular um webhook do Mercado Pago
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    console.log('🧪 TESTE DE WEBHOOK - Dados recebidos:', {
      body,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      message: 'Webhook de teste recebido com sucesso!',
      receivedData: body,
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}

