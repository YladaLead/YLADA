/**
 * Validação de Segurança para Functions do NOEL
 * 
 * Garante que functions retornam apenas dados autorizados
 * e limitam exposição de informações
 */

import { supabaseAdmin } from '@/lib/supabase'

/**
 * Valida se um usuário pode acessar um recurso específico
 */
export async function validateUserAccess(
  userId: string,
  resourceType: 'fluxo' | 'ferramenta' | 'quiz' | 'link',
  resourceId: string
): Promise<boolean> {
  try {
    // Por enquanto, todos os usuários wellness podem acessar todos os recursos
    // Futuramente, pode adicionar validações mais específicas (ex: recursos premium)
    
    // Verificar se usuário é wellness
    const { data: profile } = await supabaseAdmin
      .from('user_profiles')
      .select('profile')
      .eq('user_id', userId)
      .maybeSingle()

    if (!profile || profile.profile !== 'wellness') {
      return false
    }

    // Verificar se recurso existe e está ativo
    switch (resourceType) {
      case 'fluxo':
        const { data: fluxo } = await supabaseAdmin
          .from('wellness_fluxos')
          .select('id')
          .eq('id', resourceId)
          .eq('ativo', true)
          .maybeSingle()
        return !!fluxo

      case 'ferramenta':
        const { data: ferramenta } = await supabaseAdmin
          .from('templates_nutrition')
          .select('id')
          .eq('slug', resourceId)
          .eq('is_active', true)
          .maybeSingle()
        return !!ferramenta

      case 'quiz':
        // Quizzes são templates com type='quiz'
        const { data: quiz } = await supabaseAdmin
          .from('templates_nutrition')
          .select('id')
          .eq('slug', resourceId)
          .eq('type', 'quiz')
          .eq('is_active', true)
          .maybeSingle()
        return !!quiz

      case 'link':
        const { data: link } = await supabaseAdmin
          .from('wellness_links')
          .select('id')
          .eq('codigo', resourceId)
          .eq('ativo', true)
          .maybeSingle()
        return !!link

      default:
        return false
    }
  } catch (error) {
    console.error('❌ Erro ao validar acesso:', error)
    return false // Fail closed
  }
}

/**
 * Limita quantidade de itens retornados
 * Garante que functions nunca retornam listas completas
 */
export function limitResponseItems<T>(items: T[], maxItems: number = 1): T[] {
  return items.slice(0, maxItems)
}

/**
 * Remove campos sensíveis de respostas
 */
export function sanitizeResponse(data: any): any {
  if (!data || typeof data !== 'object') {
    return data
  }

  const sensitiveFields = [
    'id',
    'created_at',
    'updated_at',
    'user_id',
    'internal_id',
    'database_id',
    'table_name',
    'api_key',
    'secret',
  ]

  const sanitized = { ...data }

  for (const field of sensitiveFields) {
    if (field in sanitized) {
      delete sanitized[field]
    }
  }

  // Recursivamente sanitizar objetos aninhados
  for (const key in sanitized) {
    if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
      sanitized[key] = sanitizeResponse(sanitized[key])
    }
  }

  return sanitized
}

/**
 * Valida se uma requisição de function não está tentando bypass
 */
export function validateFunctionRequest(
  functionName: string,
  arguments_: any
): { valid: boolean; error?: string } {
  // Verificar se está tentando buscar múltiplos itens
  if (arguments_.limit && arguments_.limit > 1) {
    return {
      valid: false,
      error: 'Functions não podem retornar mais de 1 item por vez',
    }
  }

  // Verificar se está tentando buscar listas
  if (arguments_.get_all || arguments_.list_all || arguments_.all) {
    return {
      valid: false,
      error: 'Functions não podem retornar listas completas',
    }
  }

  // Verificar se está tentando bypass
  if (arguments_.bypass || arguments_.skip_validation) {
    return {
      valid: false,
      error: 'Bypass não permitido',
    }
  }

  return { valid: true }
}
