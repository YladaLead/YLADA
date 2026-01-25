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

export interface ZApiSendImageParams {
  phone: string
  image: string // URL pública ou base64 (com prefixo data:)
  caption?: string
  delayMessage?: number
}

export interface ZApiSendVideoParams {
  phone: string
  video: string // URL pública ou base64 (com prefixo data:)
  caption?: string
  delayMessage?: number
}

export interface ZApiSendAudioParams {
  phone: string
  audio: string // URL pública ou base64 (com prefixo data:)
  delayMessage?: number
}

export interface ZApiSendDocumentParams {
  phone: string
  document: string // URL pública ou base64 (com prefixo data:)
  fileName?: string
  extension: string // ex: pdf, docx, png, etc. (usado na rota send-document/{extension})
  delayMessage?: number
}

export interface ZApiSendButtonParams {
  phone: string
  message: string // Texto da mensagem
  buttons: Array<{ id: string; text: string }> // Máximo 3 botões
  delayMessage?: number
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

  private formatInternationalPhone(phone: string) {
    let cleanPhone = phone.replace(/\D/g, '')
    const countryCodes = ['1', '55', '52', '54', '56', '57', '58', '591', '592', '593', '594', '595', '596', '597', '598', '599']
    const hasCountryCode = countryCodes.some(code => cleanPhone.startsWith(code))
    if (!hasCountryCode) {
      if (cleanPhone.startsWith('0')) cleanPhone = cleanPhone.substring(1)
      cleanPhone = `55${cleanPhone}`
    }
    return cleanPhone
  }

  /**
   * Envia mensagem de texto via Z-API
   */
  async sendTextMessage(params: ZApiSendMessageParams): Promise<ZApiMessageResponse> {
    try {
      const { phone, message, delayMessage = 2 } = params

      const cleanPhone = this.formatInternationalPhone(phone)
      
      console.log('[Z-API] 📤 Formatando número:', {
        original: phone,
        cleaned: cleanPhone,
        countryCode: cleanPhone.substring(0, 3)
      })

      // Z-API requer Client-Token no header (Account Security Token)
      const clientToken = process.env.Z_API_CLIENT_TOKEN || ''
      
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      }
      
      // Adicionar Client-Token se configurado
      if (clientToken) {
        headers['Client-Token'] = clientToken
        console.log('[Z-API] 🔑 Client-Token configurado no header')
      } else {
        console.warn('[Z-API] ⚠️ Client-Token não configurado. Configure Z_API_CLIENT_TOKEN nas variáveis de ambiente.')
      }

      const response = await fetch(
        `${this.baseUrl}/instances/${this.config.instanceId}/token/${this.config.token}/send-text`,
        {
          method: 'POST',
          headers,
          body: JSON.stringify({
            phone: cleanPhone,
            message: message,
            delayMessage: delayMessage,
          }),
        }
      )

      if (!response.ok) {
        const errorData = await response.json().catch(async () => {
          // Se não conseguir parsear JSON, tentar ler como texto
          const text = await response.text().catch(() => 'Erro desconhecido')
          return { message: text, raw: text }
        })
        
        console.error('[Z-API] ❌ Erro detalhado:', {
          status: response.status,
          statusText: response.statusText,
          errorData,
          phone: cleanPhone,
          instanceId: this.config.instanceId
        })
        
        // Mensagem de erro mais detalhada
        const errorMessage = errorData.message || errorData.error || errorData.raw || `Erro HTTP ${response.status}`
        throw new Error(errorMessage)
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

  private buildHeaders(): HeadersInit {
    const clientToken = process.env.Z_API_CLIENT_TOKEN || ''
    const headers: HeadersInit = { 'Content-Type': 'application/json' }
    if (clientToken) {
      headers['Client-Token'] = clientToken
    }
    return headers
  }

  /**
   * Envia imagem via Z-API
   * Endpoint: /send-image
   */
  async sendImageMessage(params: ZApiSendImageParams): Promise<ZApiMessageResponse> {
    try {
      const { phone, image, caption, delayMessage = 2 } = params
      const cleanPhone = this.formatInternationalPhone(phone)
      const response = await fetch(
        `${this.baseUrl}/instances/${this.config.instanceId}/token/${this.config.token}/send-image`,
        {
          method: 'POST',
          headers: this.buildHeaders(),
          body: JSON.stringify({
            phone: cleanPhone,
            image,
            caption,
            delayMessage,
          }),
        }
      )
      if (!response.ok) {
        const errorData = await response.json().catch(async () => ({ message: await response.text() }))
        throw new Error(errorData.message || `Erro HTTP ${response.status}`)
      }
      const data = await response.json()
      return { success: true, id: data.id, message: 'Imagem enviada com sucesso' }
    } catch (error: any) {
      return { success: false, error: error.message || 'Erro ao enviar imagem' }
    }
  }

  /**
   * Envia vídeo via Z-API
   * Endpoint: /send-video
   */
  async sendVideoMessage(params: ZApiSendVideoParams): Promise<ZApiMessageResponse> {
    try {
      const { phone, video, caption, delayMessage = 2 } = params
      const cleanPhone = this.formatInternationalPhone(phone)
      const response = await fetch(
        `${this.baseUrl}/instances/${this.config.instanceId}/token/${this.config.token}/send-video`,
        {
          method: 'POST',
          headers: this.buildHeaders(),
          body: JSON.stringify({
            phone: cleanPhone,
            video,
            caption,
            delayMessage,
          }),
        }
      )
      if (!response.ok) {
        const errorData = await response.json().catch(async () => ({ message: await response.text() }))
        throw new Error(errorData.message || `Erro HTTP ${response.status}`)
      }
      const data = await response.json()
      return { success: true, id: data.id, message: 'Vídeo enviado com sucesso' }
    } catch (error: any) {
      return { success: false, error: error.message || 'Erro ao enviar vídeo' }
    }
  }

  /**
   * Envia áudio via Z-API
   * Endpoint: /send-audio
   */
  async sendAudioMessage(params: ZApiSendAudioParams): Promise<ZApiMessageResponse> {
    try {
      const { phone, audio, delayMessage = 2 } = params
      const cleanPhone = this.formatInternationalPhone(phone)
      const response = await fetch(
        `${this.baseUrl}/instances/${this.config.instanceId}/token/${this.config.token}/send-audio`,
        {
          method: 'POST',
          headers: this.buildHeaders(),
          body: JSON.stringify({
            phone: cleanPhone,
            audio,
            delayMessage,
          }),
        }
      )
      if (!response.ok) {
        const errorData = await response.json().catch(async () => ({ message: await response.text() }))
        throw new Error(errorData.message || `Erro HTTP ${response.status}`)
      }
      const data = await response.json()
      return { success: true, id: data.id, message: 'Áudio enviado com sucesso' }
    } catch (error: any) {
      return { success: false, error: error.message || 'Erro ao enviar áudio' }
    }
  }

  /**
   * Envia mensagem com botões interativos via Z-API
   * Endpoint: /send-button
   */
  async sendButtonMessage(params: ZApiSendButtonParams): Promise<ZApiMessageResponse> {
    try {
      const { phone, message, buttons, delayMessage = 2 } = params
      const cleanPhone = this.formatInternationalPhone(phone)
      
      // Validar: máximo 3 botões
      if (buttons.length > 3) {
        return { success: false, error: 'Máximo de 3 botões permitidos' }
      }
      
      // Validar: cada botão precisa de id e text
      for (const button of buttons) {
        if (!button.id || !button.text) {
          return { success: false, error: 'Cada botão precisa de id e text' }
        }
        if (button.text.length > 20) {
          return { success: false, error: 'Texto do botão deve ter no máximo 20 caracteres' }
        }
      }
      
      const response = await fetch(
        `${this.baseUrl}/instances/${this.config.instanceId}/token/${this.config.token}/send-button`,
        {
          method: 'POST',
          headers: this.buildHeaders(),
          body: JSON.stringify({
            phone: cleanPhone,
            message,
            buttons: buttons.map(b => ({ id: b.id, text: b.text })),
            delayMessage,
          }),
        }
      )
      
      if (!response.ok) {
        const errorData = await response.json().catch(async () => ({ message: await response.text() }))
        throw new Error(errorData.message || `Erro HTTP ${response.status}`)
      }
      
      const data = await response.json()
      return { success: true, id: data.id, message: 'Mensagem com botões enviada com sucesso' }
    } catch (error: any) {
      return { success: false, error: error.message || 'Erro ao enviar mensagem com botões' }
    }
  }

  /**
   * Envia documento via Z-API
   * Endpoint: /send-document/{extension}
   */
  async sendDocumentMessage(params: ZApiSendDocumentParams): Promise<ZApiMessageResponse> {
    try {
      const { phone, document, fileName, extension, delayMessage = 2 } = params
      const cleanPhone = this.formatInternationalPhone(phone)
      const ext = (extension || 'pdf').toLowerCase().replace(/[^a-z0-9]/g, '') || 'pdf'
      const response = await fetch(
        `${this.baseUrl}/instances/${this.config.instanceId}/token/${this.config.token}/send-document/${ext}`,
        {
          method: 'POST',
          headers: this.buildHeaders(),
          body: JSON.stringify({
            phone: cleanPhone,
            document,
            fileName,
            delayMessage,
          }),
        }
      )
      if (!response.ok) {
        const errorData = await response.json().catch(async () => ({ message: await response.text() }))
        throw new Error(errorData.message || `Erro HTTP ${response.status}`)
      }
      const data = await response.json()
      return { success: true, id: data.id, message: 'Documento enviado com sucesso' }
    } catch (error: any) {
      return { success: false, error: error.message || 'Erro ao enviar documento' }
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
