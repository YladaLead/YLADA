import { MercadoPagoConfig, Preference } from 'mercadopago'

// Configure Mercado Pago client
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
  options: {
    timeout: 5000,
    idempotencyKey: 'herbalead'
  }
})

// Create preference instance
export const preference = new Preference(client)

// Payment configuration
export const paymentConfig = {
  currency: 'BRL',
  maxInstallments: 12,
  paymentMethods: {
    creditCard: true,
    debitCard: true,
    pix: true,
    boleto: true
  }
}

// Plan configurations
export const plans = {
  monthly: {
    id: 'monthly',
    name: 'Plano Mensal',
    price: 97,
    description: 'Acesso completo por 30 dias'
  },
  yearly: {
    id: 'yearly', 
    name: 'Plano Anual',
    price: 804,
    description: 'Economize 30% pagando anualmente'
  }
}
