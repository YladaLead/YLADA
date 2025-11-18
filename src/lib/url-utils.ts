/**
 * Utilitários para gerenciar URLs da aplicação
 */

/**
 * Obtém a URL base da aplicação
 * Usa NEXT_PUBLIC_APP_URL se disponível, senão usa o domínio atual
 */
export function getAppUrl(): string {
  if (typeof window !== 'undefined') {
    // Client-side: usar variável de ambiente ou URL atual
    const envUrl = process.env.NEXT_PUBLIC_APP_URL
    if (envUrl) {
      return envUrl.replace(/\/$/, '') // Remove trailing slash
    }
    // Fallback: usar URL atual sem path
    const protocol = window.location.protocol
    const host = window.location.host
    return `${protocol}//${host}`
  }
  
  // Server-side: usar variável de ambiente ou fallback
  return process.env.NEXT_PUBLIC_APP_URL || 'https://ylada.app'
}

/**
 * Constrói URL completa para uma ferramenta wellness
 */
export function buildWellnessToolUrl(userSlug: string, toolSlug: string): string {
  const baseUrl = getAppUrl()
  return `${baseUrl}/pt/wellness/${userSlug}/${toolSlug}`
}

/**
 * Constrói URL completa para uma ferramenta alternativa (sem user_slug)
 */
export function buildWellnessToolUrlFallback(toolId: string): string {
  const baseUrl = getAppUrl()
  return `${baseUrl}/pt/wellness/ferramenta/${toolId}`
}

/**
 * Constrói URL completa para uma ferramenta nutri
 */
export function buildNutriToolUrl(userSlug: string, toolSlug: string): string {
  const baseUrl = getAppUrl()
  return `${baseUrl}/pt/nutri/${userSlug}/${toolSlug}`
}

/**
 * Constrói URL completa para uma ferramenta nutri alternativa (sem user_slug)
 */
export function buildNutriToolUrlFallback(toolId: string): string {
  const baseUrl = getAppUrl()
  return `${baseUrl}/pt/nutri/ferramenta/${toolId}`
}

/**
 * Constrói URL curta (encurtada)
 */
export function buildShortUrl(shortCode: string): string {
  const baseUrl = getAppUrl()
  return `${baseUrl}/p/${shortCode}`
}

