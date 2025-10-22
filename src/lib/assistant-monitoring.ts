import { supabaseAdmin } from '@/lib/supabase'

export interface AssistantMetrics {
  user_id?: string
  assistant_used: 'chat' | 'creator' | 'expert'
  tokens_in: number
  tokens_out: number
  latency_ms: number
  intent: string
  escalated: boolean
  message_length: number
  timestamp: Date
}

export class AssistantMonitoring {
  // Salvar métricas de uso do assistente
  static async saveMetrics(metrics: AssistantMetrics): Promise<void> {
    try {
      const { error } = await supabaseAdmin
        .from('assistant_metrics')
        .insert({
          user_id: metrics.user_id,
          assistant_used: metrics.assistant_used,
          tokens_in: metrics.tokens_in,
          tokens_out: metrics.tokens_out,
          latency_ms: metrics.latency_ms,
          intent: metrics.intent,
          escalated: metrics.escalated,
          message_length: metrics.message_length,
          created_at: metrics.timestamp.toISOString()
        })

      if (error) {
        console.error('Erro ao salvar métricas:', error)
      } else {
        console.log(`📊 Métricas salvas: ${metrics.assistant_used} (${metrics.latency_ms}ms)`)
      }
    } catch (error) {
      console.error('Erro ao salvar métricas do assistente:', error)
    }
  }

  // Obter estatísticas de uso
  static async getUsageStats(days: number = 7): Promise<{
    totalRequests: number
    chatPercentage: number
    creatorPercentage: number
    expertPercentage: number
    averageLatency: number
    escalationRate: number
    averageCostPerRequest: number
  }> {
    try {
      const { data, error } = await supabaseAdmin
        .from('assistant_metrics')
        .select('*')
        .gte('created_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())

      if (error) throw error

      const totalRequests = data?.length || 0
      const chatRequests = data?.filter(m => m.assistant_used === 'chat').length || 0
      const creatorRequests = data?.filter(m => m.assistant_used === 'creator').length || 0
      const expertRequests = data?.filter(m => m.assistant_used === 'expert').length || 0
      const escalatedRequests = data?.filter(m => m.escalated).length || 0

      const averageLatency = data?.reduce((sum, m) => sum + m.latency_ms, 0) / totalRequests || 0

      // Calcular custo médio por request (aproximado)
      const averageCostPerRequest = (
        (chatRequests * 0.15) + 
        (creatorRequests * 5.00) + 
        (expertRequests * 30.00)
      ) / totalRequests / 1000000 // Convertendo para custo por 1M tokens

      return {
        totalRequests,
        chatPercentage: (chatRequests / totalRequests) * 100,
        creatorPercentage: (creatorRequests / totalRequests) * 100,
        expertPercentage: (expertRequests / totalRequests) * 100,
        averageLatency,
        escalationRate: (escalatedRequests / totalRequests) * 100,
        averageCostPerRequest
      }
    } catch (error) {
      console.error('Erro ao obter estatísticas:', error)
      return {
        totalRequests: 0,
        chatPercentage: 0,
        creatorPercentage: 0,
        expertPercentage: 0,
        averageLatency: 0,
        escalationRate: 0,
        averageCostPerRequest: 0
      }
    }
  }

  // Detectar intenção da mensagem
  static detectIntent(message: string, userProfile?: any): string {
    const messageLower = message.toLowerCase()
    
    if (messageLower.includes('profissão') || messageLower.includes('sou') || messageLower.includes('trabalho')) {
      return 'profile_discovery'
    } else if (messageLower.includes('criar') || messageLower.includes('gerar') || messageLower.includes('quiz')) {
      return 'template_generation'
    } else if (messageLower.includes('objetivo') || messageLower.includes('meta') || messageLower.includes('foco')) {
      return 'objective_clarification'
    } else if (messageLower.includes('público') || messageLower.includes('cliente') || messageLower.includes('alvo')) {
      return 'audience_definition'
    } else if (messageLower.includes('ferramenta') || messageLower.includes('tipo') || messageLower.includes('criar')) {
      return 'tool_selection'
    } else if (messageLower.includes('tom') || messageLower.includes('estilo') || messageLower.includes('preferência')) {
      return 'style_preference'
    } else if (messageLower.includes('sugestão') || messageLower.includes('opção') || messageLower.includes('recomendação')) {
      return 'suggestion_request'
    } else if (messageLower.includes('enterprise') || messageLower.includes('empresa') || messageLower.includes('b2b')) {
      return 'enterprise_case'
    } else {
      return 'general_chat'
    }
  }

  // Calcular tokens aproximados
  static estimateTokens(text: string): number {
    // Aproximação: 1 token ≈ 4 caracteres em português
    return Math.ceil(text.length / 4)
  }
}

// Função utilitária para medir latência
export function measureLatency<T>(fn: () => Promise<T>): Promise<{ result: T; latency: number }> {
  const start = Date.now()
  return fn().then(result => ({
    result,
    latency: Date.now() - start
  }))
}
