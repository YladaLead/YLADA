import { NextResponse } from 'next/server'

/**
 * Endpoint temporário para debug - verificar se variáveis do Stripe estão carregadas
 * REMOVER DEPOIS DE DEBUGAR
 */
export async function GET() {
  const isTest = process.env.NODE_ENV !== 'production'
  const prefix = isTest ? 'TEST' : 'LIVE'
  
  const brSecretKeyTest = process.env[`STRIPE_SECRET_KEY_BR_${prefix}`]
  const brSecretKey = process.env.STRIPE_SECRET_KEY_BR
  const brPublishableKeyTest = process.env[`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_BR_${prefix}`]
  const brPublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_BR
  
  return NextResponse.json({
    debug: {
      nodeEnv: process.env.NODE_ENV || 'undefined',
      isTest,
      prefix,
      variables: {
        [`STRIPE_SECRET_KEY_BR_${prefix}`]: brSecretKeyTest ? `${brSecretKeyTest.substring(0, 20)}...` : 'NÃO ENCONTRADA',
        'STRIPE_SECRET_KEY_BR': brSecretKey ? `${brSecretKey.substring(0, 20)}...` : 'NÃO ENCONTRADA',
        [`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_BR_${prefix}`]: brPublishableKeyTest ? `${brPublishableKeyTest.substring(0, 20)}...` : 'NÃO ENCONTRADA',
        'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_BR': brPublishableKey ? `${brPublishableKey.substring(0, 20)}...` : 'NÃO ENCONTRADA',
      },
      found: {
        secretKey: !!(brSecretKeyTest || brSecretKey),
        publishableKey: !!(brPublishableKeyTest || brPublishableKey),
      }
    }
  })
}

