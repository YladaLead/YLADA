import { NextResponse } from 'next/server'

/**
 * Health check endpoint para verificar conectividade
 * Usado pelo Service Worker e hook useOffline
 */
export async function GET() {
  return NextResponse.json({ 
    status: 'ok',
    timestamp: new Date().toISOString()
  })
}

export async function HEAD() {
  return new NextResponse(null, { status: 200 })
}
