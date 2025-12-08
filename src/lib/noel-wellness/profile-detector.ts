/**
 * NOEL WELLNESS - Detector de Perfil do Usuário
 * 
 * Detecta automaticamente o perfil do distribuidor:
 * - beverage_distributor (vende bebidas funcionais)
 * - product_distributor (vende produtos fechados)
 * - wellness_activator (vende programa + acompanhamento)
 * 
 * Usa 3 camadas de detecção:
 * 1. Banco de dados (prioritária)
 * 2. Palavras-chave (fallback)
 * 3. Pergunta inteligente (último recurso)
 */

import { supabaseAdmin } from '@/lib/supabase'

export type ProfileType = 'beverage_distributor' | 'product_distributor' | 'wellness_activator' | null

/**
 * Detecta o perfil do usuário usando múltiplas camadas
 */
export async function detectUserProfile(
  userId: string,
  message?: string
): Promise<ProfileType> {
  console.log('🔍 [Profile Detector] Detectando perfil para user:', userId)
  
  // Camada 1: Buscar no banco de dados (prioritária)
  try {
    const { data: profile, error } = await supabaseAdmin
      .from('user_profiles')
      .select('profile_type')
      .eq('user_id', userId)
      .single()
    
    if (!error && profile?.profile_type) {
      const profileType = profile.profile_type as ProfileType
      console.log('✅ [Profile Detector] Perfil encontrado no BD:', profileType)
      return profileType
    }
    
    console.log('ℹ️ [Profile Detector] Perfil não encontrado no BD, tentando palavras-chave...')
  } catch (error: any) {
    console.warn('⚠️ [Profile Detector] Erro ao buscar perfil no BD:', error.message)
  }
  
  // Camada 2: Detectar por palavras-chave (se tiver mensagem)
  if (message) {
    const detectedProfile = detectProfileByKeywords(message)
    if (detectedProfile) {
      console.log('✅ [Profile Detector] Perfil detectado por palavras-chave:', detectedProfile)
      
      // Salvar no BD para próxima vez
      try {
        await supabaseAdmin
          .from('user_profiles')
          .update({ profile_type: detectedProfile })
          .eq('user_id', userId)
        console.log('💾 [Profile Detector] Perfil salvo no BD')
      } catch (saveError: any) {
        console.warn('⚠️ [Profile Detector] Erro ao salvar perfil:', saveError.message)
      }
      
      return detectedProfile
    }
  }
  
  // Camada 3: Retornar null para perguntar ao usuário
  console.log('❓ [Profile Detector] Perfil não detectado, será necessário perguntar')
  return null
}

/**
 * Detecta o perfil baseado em palavras-chave na mensagem
 */
export function detectProfileByKeywords(message: string): ProfileType | null {
  const lowerMessage = message.toLowerCase().trim()
  
  // Palavras-chave para Distribuidor de Bebidas
  const beverageKeywords = [
    'kit', 'energia', 'acelera', 'turbo detox', 'bebida', 'bebidas',
    '39,90', '49,90', 'litrão', 'pronto para beber', 'delivery',
    'energia matinal', 'energia tarde', 'acelera foco'
  ]
  
  // Palavras-chave para Distribuidor de Produto Fechado
  const productKeywords = [
    'shake', 'chá', 'aloe', 'embalado', 'refil', 'produto fechado',
    'pacote semanal', 'programa shake', 'shake herbalife'
  ]
  
  // Palavras-chave para Ativador Wellness
  const activatorKeywords = [
    'avaliação', 'cliente', 'programa', 'acompanhamento',
    'plano de 90 dias', 'portal fit', 'transformação',
    'consultoria', 'mentoria', 'protocolo', 'avaliar cliente'
  ]
  
  // Verificar palavras-chave de bebidas
  const beverageMatches = beverageKeywords.filter(kw => 
    lowerMessage.includes(kw.toLowerCase())
  ).length
  
  // Verificar palavras-chave de produtos
  const productMatches = productKeywords.filter(kw => 
    lowerMessage.includes(kw.toLowerCase())
  ).length
  
  // Verificar palavras-chave de ativador
  const activatorMatches = activatorKeywords.filter(kw => 
    lowerMessage.includes(kw.toLowerCase())
  ).length
  
  // Retornar o perfil com mais matches
  if (beverageMatches > productMatches && beverageMatches > activatorMatches) {
    return 'beverage_distributor'
  }
  
  if (productMatches > beverageMatches && productMatches > activatorMatches) {
    return 'product_distributor'
  }
  
  if (activatorMatches > beverageMatches && activatorMatches > productMatches) {
    return 'wellness_activator'
  }
  
  // Se houver empate ou nenhuma palavra-chave, retornar null
  return null
}

/**
 * Retorna a mensagem de pergunta para clarificar o perfil
 */
export function getProfileClarificationMessage(): string {
  return "Para te ajudar melhor: você trabalha mais com bebidas, produtos fechados ou acompanhamento?"
}

/**
 * Mapeia resposta do usuário para ProfileType
 */
export function mapResponseToProfile(response: string): ProfileType | null {
  const lowerResponse = response.toLowerCase().trim()
  
  if (lowerResponse.includes('bebida') || lowerResponse.includes('bebidas')) {
    return 'beverage_distributor'
  }
  
  if (lowerResponse.includes('produto') || lowerResponse.includes('shake') || lowerResponse.includes('chá')) {
    return 'product_distributor'
  }
  
  if (lowerResponse.includes('acompanhamento') || lowerResponse.includes('programa') || lowerResponse.includes('avaliação')) {
    return 'wellness_activator'
  }
  
  return null
}
