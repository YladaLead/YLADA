import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    console.log('Mercado Pago Webhook received:', body)
    
    // Verify webhook signature (implement later)
    // const signature = request.headers.get('x-signature')
    
    // Handle different notification types
    if (body.type === 'payment') {
      const paymentId = body.data.id
      
      // Fetch payment details from Mercado Pago
      const paymentResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: {
          'Authorization': `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (!paymentResponse.ok) {
        throw new Error('Failed to fetch payment details')
      }
      
      const paymentData = await paymentResponse.json()
      
      console.log('Payment details:', {
        id: paymentData.id,
        status: paymentData.status,
        external_reference: paymentData.external_reference,
        metadata: paymentData.metadata
      })
      
      // Process approved payments
      if (paymentData.status === 'approved') {
        // Extract plan information from metadata
        const { plan, plan_name, plan_price } = paymentData.metadata || {}
        
        // TODO: Activate user subscription
        // TODO: Send confirmation email
        // TODO: Save payment to database
        
        console.log('Payment approved:', {
          plan,
          plan_name,
          plan_price,
          payment_id: paymentData.id,
          external_reference: paymentData.external_reference
        })
        
        // Here you would:
        // 1. Find user by external_reference
        // 2. Activate their subscription
        // 3. Send confirmation email
        // 4. Log the transaction
      }
      
      // Handle other payment statuses
      else if (paymentData.status === 'pending') {
        console.log('Payment pending:', paymentData.id)
        // Handle pending payments (PIX, Boleto)
      }
      
      else if (paymentData.status === 'rejected') {
        console.log('Payment rejected:', paymentData.id)
        // Handle rejected payments
      }
    }
    
    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ 
      error: 'Webhook processing failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
