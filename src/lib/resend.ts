import { Resend } from 'resend'

const RESEND_API_KEY = process.env.RESEND_API_KEY

if (!RESEND_API_KEY) {
  console.error('❌ RESEND_API_KEY não configurada. O envio de e-mails não funcionará.')
  // Em ambiente de desenvolvimento, pode-se usar um mock ou lançar erro
  // Em produção, é crítico que esteja configurada
  // throw new Error('RESEND_API_KEY não configurada. Adicione no .env.local')
}

export const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null

export const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'noreply@ylada.com'
export const FROM_NAME = process.env.RESEND_FROM_NAME || 'YLADA'

// Função auxiliar para verificar se Resend está configurado
export function isResendConfigured(): boolean {
  return !!RESEND_API_KEY && !!resend
}

