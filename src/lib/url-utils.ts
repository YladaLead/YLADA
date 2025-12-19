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
 * Constrói URL completa para uma ferramenta coach
 */
export function buildCoachToolUrl(userSlug: string, toolSlug: string): string {
  const baseUrl = getAppUrl()
  return `${baseUrl}/pt/c/${userSlug}/${toolSlug}`
}

/**
 * Constrói URL completa para uma ferramenta coach alternativa (sem user_slug)
 */
export function buildCoachToolUrlFallback(toolId: string): string {
  const baseUrl = getAppUrl()
  return `${baseUrl}/pt/c/ferramenta/${toolId}`
}

/**
 * Constrói URL completa para um formulário nutri
 */
export function buildNutriFormUrl(userSlug: string, formSlug: string): string {
  const baseUrl = getAppUrl()
  return `${baseUrl}/pt/nutri/${userSlug}/formulario/${formSlug}`
}

/**
 * Constrói URL completa para um formulário nutri alternativa (sem user_slug)
 */
export function buildNutriFormUrlFallback(formId: string): string {
  const baseUrl = getAppUrl()
  return `${baseUrl}/f/${formId}`
}

/**
 * Constrói URL curta (encurtada)
 */
export function buildShortUrl(shortCode: string): string {
  const baseUrl = getAppUrl()
  return `${baseUrl}/p/${shortCode}`
}

/**
 * Constrói URLs comuns para a LYA usar em respostas
 * Retorna links clicáveis formatados em Markdown
 */
export function buildLyaLinks(profile: 'nutri' | 'coach' = 'nutri'): {
  formularios: string
  jornada: (dia?: number) => string
  home: string
  clientes: string
  leads: string
} {
  const baseUrl = getAppUrl()
  const prefix = profile === 'nutri' ? '/pt/nutri' : '/pt/coach'
  
  return {
    formularios: `${baseUrl}${prefix}/formularios`,
    jornada: (dia?: number) => {
      if (dia) {
        return `${baseUrl}${prefix}/metodo/jornada/dia/${dia}`
      }
      return `${baseUrl}${prefix}/metodo/jornada`
    },
    home: `${baseUrl}${prefix}/home`,
    clientes: `${baseUrl}${prefix}/clientes`,
    leads: `${baseUrl}${prefix}/leads`
  }
}

