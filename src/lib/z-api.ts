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

export interface ZApiDeleteMessageParams {
  messageId: string
  fromMe: boolean
  phone: string // Número do destinatário (para mensagens individuais)
  wuid?: string // Para mensagens de grupo (opcional)
  from?: 'me' | 'everyone' // Escopo: 'me' (apenas para mim) ou 'everyone' (para todos)
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
    
    // Remover zeros à esquerda
    if (cleanPhone.startsWith('0')) {
      cleanPhone = cleanPhone.substring(1)
    }
    
    // Lista de códigos de país (Américas)
    const countryCodes = ['1', '55', '52', '54', '56', '57', '58', '591', '592', '593', '594', '595', '596', '597', '598', '599']
    const hasCountryCode = countryCodes.some(code => cleanPhone.startsWith(code))
    
    if (!hasCountryCode) {
      // Se não tem código do país, adicionar 55 (Brasil)
      cleanPhone = `55${cleanPhone}`
    }
    
    // Validação básica: número deve ter entre 10 e 15 dígitos
    if (cleanPhone.length < 10 || cleanPhone.length > 15) {
      console.warn(`[Z-API] ⚠️ Número com tamanho inválido: ${cleanPhone} (${cleanPhone.length} dígitos)`)
    }
    
    // Para números brasileiros: validar formato (55 + DDD (2 dígitos) + número (9 ou 8 dígitos))
    if (cleanPhone.startsWith('55') && cleanPhone.length === 13) {
      // Formato esperado: 55 + DDD (2) + número (9) = 13 dígitos
      const ddd = cleanPhone.substring(2, 4)
      const number = cleanPhone.substring(4)
      
      // Validar DDD (deve ser entre 11 e 99)
      const dddNum = parseInt(ddd)
      if (dddNum < 11 || dddNum > 99) {
        console.warn(`[Z-API] ⚠️ DDD inválido: ${ddd} (número: ${cleanPhone})`)
      }
      
      // Validar número (deve ter 9 dígitos para celular)
      if (number.length !== 9) {
        console.warn(`[Z-API] ⚠️ Número com tamanho inválido: ${number.length} dígitos (esperado: 9 para celular, número: ${cleanPhone})`)
      }
    }
    
    return cleanPhone
  }

  /**
   * Envia mensagem de texto via Z-API
   */
  async sendTextMessage(params: ZApiSendMessageParams): Promise<ZApiMessageResponse> {
    try {
      const { phone, message, delayMessage = 2 } = params

      // Validar mensagem
      if (!message || message.trim().length === 0) {
        return {
          success: false,
          error: 'Mensagem não pode estar vazia'
        }
      }

      // Validar tamanho da mensagem (Z-API tem limite)
      if (message.length > 4096) {
        return {
          success: false,
          error: `Mensagem muito longa (${message.length} caracteres). Limite: 4096 caracteres.`
        }
      }

      const cleanPhone = this.formatInternationalPhone(phone)
      
      console.log('[Z-API] 📤 Formatando número:', {
        original: phone,
        cleaned: cleanPhone,
        countryCode: cleanPhone.substring(0, 2),
        ddd: cleanPhone.startsWith('55') ? cleanPhone.substring(2, 4) : 'N/A',
        numberLength: cleanPhone.startsWith('55') ? cleanPhone.substring(4).length : cleanPhone.length
      })

      // Não verificar status antes de enviar - deixar a Z-API retornar erro se não estiver conectada
      // A verificação de status pode falhar mesmo quando a instância está funcionando
      // É melhor tentar enviar e tratar o erro se vier

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

      const requestBody = {
        phone: cleanPhone,
        message: message,
        delayMessage: delayMessage,
      }

      console.log('[Z-API] 📤 Enviando mensagem:', {
        phone: cleanPhone,
        messageLength: message.length,
        delayMessage,
        instanceId: this.config.instanceId,
        hasClientToken: !!clientToken
      })

      const response = await fetch(
        `${this.baseUrl}/instances/${this.config.instanceId}/token/${this.config.token}/send-text`,
        {
          method: 'POST',
          headers,
          body: JSON.stringify(requestBody),
        }
      )

      if (!response.ok) {
        let errorData: any = {}
        let errorText = ''
        
        try {
          // Tentar ler como JSON primeiro
          errorData = await response.json()
        } catch {
          try {
            // Se não for JSON, ler como texto
            errorText = await response.text()
            errorData = { message: errorText, raw: errorText }
          } catch {
            errorData = { message: 'Erro desconhecido', raw: 'Erro desconhecido' }
          }
        }
        
        // Log detalhado do erro
        console.error('[Z-API] ❌ Erro detalhado:', {
          status: response.status,
          statusText: response.statusText,
          errorData,
          phone: cleanPhone,
          phoneLength: cleanPhone.length,
          phoneFormat: {
            countryCode: cleanPhone.substring(0, 2),
            ddd: cleanPhone.substring(2, 4),
            number: cleanPhone.substring(4),
            numberLength: cleanPhone.substring(4).length
          },
          instanceId: {
            instanceId: this.config.instanceId,
            token: this.config.token?.substring(0, 10) + '...' // Mostrar apenas início do token
          },
          hasClientToken: !!process.env.Z_API_CLIENT_TOKEN,
          url: `${this.baseUrl}/instances/${this.config.instanceId}/token/${this.config.token}/send-text`
        })
        
        // Mensagem de erro mais detalhada e útil
        let errorMessage = errorData.message || errorData.error || errorData.raw || `Erro HTTP ${response.status}`
        
        // Adicionar contexto baseado no status code
        if (response.status === 400) {
          // Erro 400 geralmente é formato inválido ou número não encontrado
          if (cleanPhone.length < 10 || cleanPhone.length > 15) {
            errorMessage = `Número de telefone inválido: ${cleanPhone} (tamanho: ${cleanPhone.length}). Formato esperado: código do país + DDD + número (ex: 5522999999999)`
          } else if (!cleanPhone.startsWith('55')) {
            errorMessage = `Número deve começar com código do país 55 (Brasil). Recebido: ${cleanPhone.substring(0, 3)}`
          } else {
            errorMessage = `Erro 400 da Z-API: ${errorMessage}. Verifique se o número ${cleanPhone} está correto e se a instância está conectada.`
          }
        } else if (response.status === 401) {
          errorMessage = `Erro de autenticação Z-API. Verifique se o token e instanceId estão corretos.`
        } else if (response.status === 404) {
          errorMessage = `Instância Z-API não encontrada. Verifique se a instância ${this.config.instanceId} existe e está ativa.`
        }
        
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

  /**
   * Deleta mensagem via Z-API
   * Endpoint: /chat/deleteMessage
   */
  async deleteMessage(params: ZApiDeleteMessageParams): Promise<ZApiMessageResponse> {
    try {
      const { messageId, fromMe, phone, wuid, from = 'everyone' } = params
      const cleanPhone = this.formatInternationalPhone(phone)
      
      const response = await fetch(
        `${this.baseUrl}/instances/${this.config.instanceId}/token/${this.config.token}/chat/deleteMessage?from=${from}`,
        {
          method: 'DELETE',
          headers: this.buildHeaders(),
          body: JSON.stringify({
            messageId,
            fromMe,
            phone: cleanPhone,
            ...(wuid && { wuid }),
          }),
        }
      )
      
      if (!response.ok) {
        const errorData = await response.json().catch(async () => ({ message: await response.text() }))
        throw new Error(errorData.message || `Erro HTTP ${response.status}`)
      }
      
      const data = await response.json()
      return { success: true, message: 'Mensagem deletada com sucesso' }
    } catch (error: any) {
      return { success: false, error: error.message || 'Erro ao deletar mensagem' }
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
