// Função para validar status de pagamento antes de enviar mensagens
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function validatePaymentStatus(userEmail: string) {
  try {
    console.log('🔍 Validando status de pagamento para:', userEmail)
    
    // 1. Buscar usuário
    const { data: professional, error: profError } = await supabase
      .from('professionals')
      .select('id, subscription_status, stripe_customer_id')
      .eq('email', userEmail)
      .single()
    
    if (profError || !professional) {
      console.log('❌ Usuário não encontrado:', userEmail)
      return { isValid: false, reason: 'Usuário não encontrado' }
    }
    
    // 2. Verificar status na tabela professionals
    if (professional.subscription_status === 'active') {
      console.log('✅ Usuário já está ativo na tabela professionals')
      return { isValid: false, reason: 'Usuário já ativo' }
    }
    
    // 3. Verificar assinaturas ativas
    const { data: subscriptions, error: subError } = await supabase
      .from('subscriptions')
      .select('status, current_period_end')
      .eq('user_id', professional.id)
      .eq('status', 'active')
    
    if (!subError && subscriptions && subscriptions.length > 0) {
      console.log('✅ Assinatura ativa encontrada')
      return { isValid: false, reason: 'Assinatura ativa existe' }
    }
    
    // 4. Verificar pagamentos recentes (últimas 24h)
    const { data: recentPayments, error: payError } = await supabase
      .from('payments')
      .select('status, created_at')
      .eq('subscription_id', subscriptions?.[0]?.id || '')
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .eq('status', 'succeeded')
    
    if (!payError && recentPayments && recentPayments.length > 0) {
      console.log('✅ Pagamento recente encontrado')
      return { isValid: false, reason: 'Pagamento recente existe' }
    }
    
    console.log('✅ Validação passou - pode enviar mensagem de não pago')
    return { isValid: true, reason: 'Nenhum pagamento encontrado' }
    
  } catch (error) {
    console.error('❌ Erro na validação:', error)
    return { isValid: false, reason: 'Erro na validação' }
  }
}

// Função para enviar email de confirmação de pagamento
export async function sendPaymentConfirmationEmail(userEmail: string, amount: number, currency: string) {
  try {
    console.log('📧 Enviando confirmação de pagamento para:', userEmail)
    
    // Aqui você pode integrar com seu serviço de email
    // Por exemplo: SendGrid, Resend, etc.
    
    const emailData = {
      to: userEmail,
      subject: 'Pagamento Confirmado - HerbaLead',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #10b981;">✅ Pagamento Confirmado!</h2>
          <p>Olá!</p>
          <p>Seu pagamento foi processado com sucesso:</p>
          <ul>
            <li><strong>Valor:</strong> ${currency.toUpperCase()} ${(amount / 100).toFixed(2)}</li>
            <li><strong>Data:</strong> ${new Date().toLocaleDateString('pt-BR')}</li>
            <li><strong>Status:</strong> Pago</li>
          </ul>
          <p>Seu acesso ao HerbaLead está ativo!</p>
          <p>Atenciosamente,<br>Equipe HerbaLead</p>
        </div>
      `
    }
    
    console.log('✅ Email de confirmação preparado:', emailData)
    return { success: true, data: emailData }
    
  } catch (error) {
    console.error('❌ Erro ao enviar email:', error)
    return { success: false, error }
  }
}
