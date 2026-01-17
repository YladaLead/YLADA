/**
 * Sistema de Automação WhatsApp
 * 
 * Funcionalidades:
 * - Envio automático de mensagens
 * - Regras de notificação inteligentes
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

export interface AutomationRule {
  id: string
  name: string
  area: string | null
  trigger_type: 'keyword' | 'first_message' | 'time_based' | 'ai_based'
  trigger_conditions: any
  action_type: 'send_message' | 'forward' | 'tag' | 'assign'
  action_data: any
  is_active: boolean
  priority: number
  cooldown_seconds: number
}

export interface NotificationRule {
  id: string
  name: string
  area: string | null
  conditions: {
    hours?: number[] // Horários permitidos (0-23)
    keywords?: string[] // Palavras-chave que exigem notificação
    min_importance?: number // Nível mínimo de importância
    exclude_keywords?: string[] // Palavras-chave que não devem notificar
  }
  notification_method: 'whatsapp' | 'email' | 'push' | 'all'
  notification_phone?: string
  notification_email?: string
  is_active: boolean
  priority: number
}

/**
 * Processa automações para uma mensagem recebida
 */
export async function processAutomations(
  conversationId: string,
  phone: string,
  message: string,
  area: string,
  instanceId: string,
  isFirstMessage: boolean = false
): Promise<{
  messagesSent: number
  rulesExecuted: string[]
}> {
  const rulesExecuted: string[] = []
  let messagesSent = 0

  try {
    // Buscar regras ativas para a área
    const { data: rules, error } = await supabaseAdmin
      .from('whatsapp_automation_rules')
      .select('*')
      .eq('is_active', true)
      .or(`area.eq.${area},area.is.null`)
      .order('priority', { ascending: false })

    if (error) {
      console.error('[Automation] Erro ao buscar regras:', error)
      return { messagesSent: 0, rulesExecuted: [] }
    }

    if (!rules || rules.length === 0) {
      console.log('[Automation] Nenhuma regra ativa encontrada')
      return { messagesSent: 0, rulesExecuted: [] }
    }

    // Processar cada regra
    for (const rule of rules) {
      try {
        const shouldExecute = await checkRuleConditions(rule, message, isFirstMessage)
        
        if (shouldExecute) {
          // Verificar cooldown
          const canExecute = await checkCooldown(rule.id, conversationId, rule.cooldown_seconds)
          
          if (canExecute) {
            const result = await executeRule(rule, conversationId, phone, message, area, instanceId)
            
            if (result.success) {
              rulesExecuted.push(rule.name)
              if (result.messageSent) messagesSent++
              
              // Log da execução
              await logAutomationExecution(rule.id, conversationId, 'executed', result)
            }
          } else {
            await logAutomationExecution(rule.id, conversationId, 'skipped', { reason: 'cooldown' })
          }
        }
      } catch (ruleError: any) {
        console.error(`[Automation] Erro ao processar regra ${rule.name}:`, ruleError)
        await logAutomationExecution(rule.id, conversationId, 'failed', { error: ruleError.message })
      }
    }

    return { messagesSent, rulesExecuted }
  } catch (error: any) {
    console.error('[Automation] Erro ao processar automações:', error)
    return { messagesSent: 0, rulesExecuted: [] }
  }
}

/**
 * Verifica se uma regra deve ser executada baseado nas condições
 */
async function checkRuleConditions(
  rule: AutomationRule,
  message: string,
  isFirstMessage: boolean
): Promise<boolean> {
  const { trigger_type, trigger_conditions } = rule

  switch (trigger_type) {
    case 'first_message':
      return isFirstMessage

    case 'keyword':
      if (!trigger_conditions?.keywords) return false
      const keywords = trigger_conditions.keywords as string[]
      const messageLower = message.toLowerCase()
      return keywords.some(keyword => messageLower.includes(keyword.toLowerCase()))

    case 'time_based':
      // Implementar lógica de horário
      const now = new Date()
      const currentHour = now.getHours()
      if (trigger_conditions?.hours) {
        return trigger_conditions.hours.includes(currentHour)
      }
      return true

    case 'ai_based':
      // Implementar lógica de IA depois
      return false

    default:
      return false
  }
}

/**
 * Verifica se a regra pode ser executada (cooldown)
 */
async function checkCooldown(
  ruleId: string,
  conversationId: string,
  cooldownSeconds: number
): Promise<boolean> {
  if (cooldownSeconds === 0) return true

  const { data: lastExecution } = await supabaseAdmin
    .from('whatsapp_automation_logs')
    .select('executed_at')
    .eq('rule_id', ruleId)
    .eq('conversation_id', conversationId)
    .eq('status', 'executed')
    .order('executed_at', { ascending: false })
    .limit(1)
    .single()

  if (!lastExecution) return true

  const lastExecTime = new Date(lastExecution.executed_at).getTime()
  const now = Date.now()
  const timeSinceLastExec = (now - lastExecTime) / 1000

  return timeSinceLastExec >= cooldownSeconds
}

/**
 * Executa uma regra de automação
 */
async function executeRule(
  rule: AutomationRule,
  conversationId: string,
  phone: string,
  message: string,
  area: string,
  instanceId: string
): Promise<{ success: boolean; messageSent: boolean; error?: string }> {
  const { action_type, action_data } = rule

  switch (action_type) {
    case 'send_message':
      return await executeSendMessage(action_data, phone, instanceId, conversationId)

    case 'tag':
      // Implementar depois
      return { success: true, messageSent: false }

    case 'assign':
      // Implementar depois
      return { success: true, messageSent: false }

    case 'forward':
      // Implementar depois
      return { success: true, messageSent: false }

    default:
      return { success: false, messageSent: false, error: 'Ação não implementada' }
  }
}

/**
 * Executa ação de enviar mensagem
 */
async function executeSendMessage(
  actionData: any,
  phone: string,
  instanceId: string,
  conversationId: string
): Promise<{ success: boolean; messageSent: boolean; error?: string }> {
  try {
    // Buscar template de mensagem ou usar texto direto
    let messageText = actionData.message_text || actionData.message

    if (actionData.message_template_id) {
      const { data: template } = await supabaseAdmin
        .from('whatsapp_automation_messages')
        .select('message_text, variables')
        .eq('id', actionData.message_template_id)
        .eq('is_active', true)
        .single()

      if (template) {
        messageText = template.message_text
        // Substituir variáveis (implementar depois)
      }
    }

    if (!messageText) {
      return { success: false, messageSent: false, error: 'Mensagem não encontrada' }
    }

    // Buscar instância Z-API
    const { data: instance } = await supabaseAdmin
      .from('z_api_instances')
      .select('instance_id, token')
      .eq('id', instanceId)
      .single()

    if (!instance) {
      return { success: false, messageSent: false, error: 'Instância não encontrada' }
    }

    // Enviar mensagem via Z-API
    const { sendWhatsAppMessage } = await import('@/lib/z-api')
    const result = await sendWhatsAppMessage(
      phone,
      messageText,
      instance.instance_id,
      instance.token
    )

    if (result.success) {
      // Salvar mensagem no banco
      await supabaseAdmin
        .from('whatsapp_messages')
        .insert({
          conversation_id: conversationId,
          instance_id: instanceId,
          z_api_message_id: result.id,
          sender_type: 'bot',
          sender_name: 'Automação',
          message: messageText,
          message_type: 'text',
          status: 'sent',
          is_bot_response: true,
        })

      return { success: true, messageSent: true }
    } else {
      return { success: false, messageSent: false, error: result.error }
    }
  } catch (error: any) {
    return { success: false, messageSent: false, error: error.message }
  }
}

/**
 * Registra execução de automação
 */
async function logAutomationExecution(
  ruleId: string,
  conversationId: string,
  status: 'pending' | 'executed' | 'failed' | 'skipped',
  result: any
): Promise<void> {
  await supabaseAdmin
    .from('whatsapp_automation_logs')
    .insert({
      rule_id: ruleId,
      conversation_id: conversationId,
      trigger_type: 'keyword', // TODO: pegar do rule
      action_type: 'send_message', // TODO: pegar do rule
      action_result: result,
      status,
      execution_time_ms: result.executionTime || 0,
    })
}

/**
 * Verifica se deve notificar baseado nas regras de notificação
 */
export async function shouldNotify(
  phone: string,
  message: string,
  area: string,
  conversationId: string
): Promise<{ shouldNotify: boolean; reason?: string; rule?: NotificationRule }> {
  try {
    // Buscar regras de notificação ativas
    const { data: rules, error } = await supabaseAdmin
      .from('whatsapp_notification_rules')
      .select('*')
      .eq('is_active', true)
      .or(`area.eq.${area},area.is.null`)
      .order('priority', { ascending: false })

    if (error || !rules || rules.length === 0) {
      // Sem regras = notificar sempre (comportamento padrão)
      return { shouldNotify: true, reason: 'Nenhuma regra configurada, notificando por padrão' }
    }

    // Verificar cada regra
    for (const rule of rules) {
      const matches = await checkNotificationConditions(rule, message)
      
      if (matches) {
        return { shouldNotify: true, reason: `Regra: ${rule.name}`, rule }
      }
    }

    // Nenhuma regra correspondeu = não notificar
    return { shouldNotify: false, reason: 'Nenhuma regra de notificação correspondeu' }
  } catch (error: any) {
    console.error('[Automation] Erro ao verificar regras de notificação:', error)
    // Em caso de erro, notificar por segurança
    return { shouldNotify: true, reason: 'Erro ao verificar regras, notificando por segurança' }
  }
}

/**
 * Verifica se as condições de notificação são atendidas
 */
async function checkNotificationConditions(
  rule: NotificationRule,
  message: string
): Promise<boolean> {
  const { conditions } = rule

  // Verificar horário
  if (conditions.hours && conditions.hours.length > 0) {
    const now = new Date()
    const currentHour = now.getHours()
    if (!conditions.hours.includes(currentHour)) {
      return false // Fora do horário permitido
    }
  }

  // Verificar palavras-chave de exclusão
  if (conditions.exclude_keywords && conditions.exclude_keywords.length > 0) {
    const messageLower = message.toLowerCase()
    const hasExcludedKeyword = conditions.exclude_keywords.some(keyword =>
      messageLower.includes(keyword.toLowerCase())
    )
    if (hasExcludedKeyword) {
      return false // Contém palavra-chave excluída
    }
  }

  // Verificar palavras-chave obrigatórias
  if (conditions.keywords && conditions.keywords.length > 0) {
    const messageLower = message.toLowerCase()
    const hasRequiredKeyword = conditions.keywords.some(keyword =>
      messageLower.includes(keyword.toLowerCase())
    )
    if (!hasRequiredKeyword) {
      return false // Não contém palavra-chave obrigatória
    }
  }

  // Todas as condições atendidas
  return true
}
