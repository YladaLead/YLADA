import { NextRequest, NextResponse } from 'next/server'
import { preference, paymentConfig, plans } from '../../../../lib/mercadopago'

export async function POST(request: NextRequest) {
  try {
    const { planType } = await request.json()
    
    // Get plan configuration
    const plan = plans[planType as keyof typeof plans]
    if (!plan) {
      return NextResponse.json({ error: 'Plano inválido' }, { status: 400 })
    }

    // Create payment preference
    const paymentData = {
      items: [
        {
          title: `Herbalead - ${plan.name}`,
          quantity: 1,
          unit_price: plan.price,
          currency_id: paymentConfig.currency,
          description: plan.description
        }
      ],
      payment_methods: {
        installments: paymentConfig.maxInstallments,
        excluded_payment_methods: [],
        excluded_payment_types: [],
        default_installments: 1
      },
      back_urls: {
        success: `${request.headers.get('origin')}/success`,
        failure: `${request.headers.get('origin')}/failure`,
        pending: `${request.headers.get('origin')}/pending`
      },
      auto_return: 'approved',
      notification_url: `${request.headers.get('origin')}/api/webhook/mercadopago`,
      external_reference: `herbalead_${planType}_${Date.now()}`,
      metadata: {
        plan: planType,
        plan_name: plan.name,
        plan_price: plan.price.toString()
      }
    }

    const response = await preference.create({ body: paymentData })
    
    return NextResponse.json({ 
      id: response.id,
      init_point: response.init_point,
      sandbox_init_point: response.sandbox_init_point
    })
  } catch (error) {
    console.error('Error creating Mercado Pago payment:', error)
    return NextResponse.json({ 
      error: 'Erro ao criar pagamento',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}
