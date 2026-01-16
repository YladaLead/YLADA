/**
 * Biblioteca Z-API para integração com WhatsApp
 * Documentação: https://developer.z-api.io
 */

export interface ZApiConfig {
  instanceId: string
  token: string
  baseUrl?: string
}

export interface ZApiSendMessageParams {
  phone: string // Número com DDD e código do país (ex: 5511999999999)
  message: string
  delayMessage?: number // Delay em segundos (opcional, padrão: 2)
}

export interface ZApiMessageResponse {
  id?: string
  success: boolean
  message?: string
  error?: string
}

export interface ZApiWebhookMessage {
  phone: string
  message: string
  name?: string
  timestamp?: string
  instanceId?: string
  messageId?: string
  type?: 'text' | 'image' | 'audio' | 'video' | 'document'
}

/**
 * Classe para interagir com Z-API
 */
export class ZApiClient {
  private config: ZApiConfig
  private baseUrl: string

  constructor(config: ZApiConfig) {
    this.config = config
    this.baseUrl = config.baseUrl || 'https://api.z-api.io'
  }

  /**
   * Envia mensagem de texto via Z-API
   */
  async sendTextMessage(params: ZApiSendMessageParams): Promise<ZApiMessageResponse> {
    try {
      const { phone, message, delayMessage = 2 } = params

      // Limpar número (remover caracteres não numéricos)
      let cleanPhone = phone.replace(/\D/g, '')
      
      // Verificar se já tem código de país conhecido
      const countryCodes = ['1', '55', '52', '54', '56', '57', '58', '591', '592', '593', '594', '595', '596', '597', '598', '599']
      const hasCountryCode = countryCodes.some(code => cleanPhone.startsWith(code))
      
      // Se não tem código de país, assumir que é brasileiro e adicionar 55
      if (!hasCountryCode) {
        // Se começar com 0, remover o 0 antes de adicionar 55
        if (cleanPhone.startsWith('0')) {
          cleanPhone = cleanPhone.substring(1)
        }
        cleanPhone = `55${cleanPhone}`
      }
      
      console.log('[Z-API] 📤 Formatando número:', {
        original: phone,
        cleaned: cleanPhone,
        hasCountryCode,
        countryCode: hasCountryCode ? cleanPhone.substring(0, 3) : '55 (assumido BR)'
      })

      const response = await fetch(
        `${this.baseUrl}/instances/${this.config.instanceId}/token/${this.config.token}/send-text`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            phone: cleanPhone,
            message: message,
            delayMessage: delayMessage,
          }),
        }
      )

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Erro desconhecido' }))
        throw new Error(error.message || `Erro HTTP ${response.status}`)
      }

      const data = await response.json()

      return {
        success: true,
        id: data.id,
        message: 'Mensagem enviada com sucesso',
      }
    } catch (error: any) {
      console.error('[Z-API] Erro ao enviar mensagem:', error)
      return {
        success: false,
        error: error.message || 'Erro ao enviar mensagem',
      }
    }
  }

  /**
   * Envia mensagem em massa (com delays automáticos)
   */
  async sendBulkMessages(
    contacts: Array<{ phone: string; message: string; name?: string }>,
    options?: {
      delayBetweenMessages?: number // Delay entre mensagens em segundos
      onProgress?: (sent: number, total: number) => void
    }
  ): Promise<{
    success: number
    failed: number
    results: Array<{ phone: string; success: boolean; error?: string }>
  }> {
    const results: Array<{ phone: string; success: boolean; error?: string }> = []
    let success = 0
    let failed = 0

    const delay = options?.delayBetweenMessages || 2

    for (let i = 0; i < contacts.length; i++) {
      const contact = contacts[i]

      try {
        // Personalizar mensagem (substituir {{nome}} se houver)
        let personalizedMessage = contact.message
        if (contact.name) {
          personalizedMessage = personalizedMessage.replace(/\{\{nome\}\}/g, contact.name)
        }

        const result = await this.sendTextMessage({
          phone: contact.phone,
          message: personalizedMessage,
          delayMessage: delay,
        })

        if (result.success) {
          success++
          results.push({ phone: contact.phone, success: true })
        } else {
          failed++
          results.push({ phone: contact.phone, success: false, error: result.error })
        }

        // Callback de progresso
        if (options?.onProgress) {
          options.onProgress(i + 1, contacts.length)
        }

        // Delay entre mensagens (exceto na última)
        if (i < contacts.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, delay * 1000))
        }
      } catch (error: any) {
        failed++
        results.push({ phone: contact.phone, success: false, error: error.message })
      }
    }

    return { success, failed, results }
  }

  /**
   * Verifica status da instância
   */
  async getInstanceStatus(): Promise<{
    connected: boolean
    status?: string
    error?: string
  }> {
    try {
      const response = await fetch(
        `${this.baseUrl}/instances/${this.config.instanceId}/token/${this.config.token}/status`,
        {
          method: 'GET',
        }
      )

      if (!response.ok) {
        throw new Error(`Erro HTTP ${response.status}`)
      }

      const data = await response.json()

      return {
        connected: data.connected || false,
        status: data.status,
      }
    } catch (error: any) {
      return {
        connected: false,
        error: error.message,
      }
    }
  }
}

/**
 * Função helper para criar cliente Z-API a partir de variáveis de ambiente
 */
export function createZApiClient(instanceId?: string, token?: string): ZApiClient {
  const config: ZApiConfig = {
    instanceId: instanceId || process.env.Z_API_INSTANCE_ID || '',
    token: token || process.env.Z_API_TOKEN || '',
    baseUrl: process.env.Z_API_BASE_URL || 'https://api.z-api.io',
  }

  if (!config.instanceId || !config.token) {
    throw new Error(
      'Z-API não configurada. Configure Z_API_INSTANCE_ID e Z_API_TOKEN nas variáveis de ambiente.'
    )
  }

  return new ZApiClient(config)
}

/**
 * Função helper para enviar mensagem rápida
 */
export async function sendWhatsAppMessage(
  phone: string,
  message: string,
  instanceId?: string,
  token?: string
): Promise<ZApiMessageResponse> {
  const client = createZApiClient(instanceId, token)
  return client.sendTextMessage({ phone, message })
}
