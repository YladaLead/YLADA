import Stripe from 'stripe'

// Use production keys in production, test keys in development
const stripeSecretKey = process.env.NODE_ENV === 'production' 
  ? process.env.STRIPE_SECRET_KEY!
  : process.env.STRIPE_SECRET_KEY_TEST || process.env.STRIPE_SECRET_KEY!

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2024-06-20',
})

export const stripePlans = {
  monthly: {
    priceId: process.env.NODE_ENV === 'production' ? 'price_live_monthly' : 'price_test_monthly',
    name: 'Plano Mensal Herbalead',
    unit_amount: 6000, // R$ 60.00
    interval: 'month',
    currency: 'brl',
  },
  yearly: {
    priceId: process.env.NODE_ENV === 'production' ? 'price_live_yearly' : 'price_test_yearly',
    name: 'Plano Anual Herbalead',
    unit_amount: 57000, // R$ 570.00
    interval: 'year',
    currency: 'brl',
  },
}