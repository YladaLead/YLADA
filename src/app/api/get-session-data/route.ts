import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '../../../../lib/stripe-subscriptions'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('session_id')

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 })
    }

    // Retrieve session data from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    return NextResponse.json({
      id: session.id,
      customer_email: session.customer_email,
      subscription_id: session.subscription,
      payment_status: session.payment_status,
      status: session.status
    })

  } catch (error) {
    console.error('Error retrieving session data:', error)
    return NextResponse.json({ error: 'Failed to retrieve session data' }, { status: 500 })
  }
}
