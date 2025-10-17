import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export const getStripe = () => stripePromise

export const createCheckoutSession = async (priceId: string, protocolName: string) => {
  try {
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId,
        protocolName,
      }),
    })

    const session = await response.json()
    
    if (session.error) {
      throw new Error(session.error)
    }

    return session
  } catch (error) {
    console.error('Error creating checkout session:', error)
    throw error
  }
}

