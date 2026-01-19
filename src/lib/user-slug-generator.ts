/**
 * Gerador automático de user_slug baseado no nome
 * Tenta gerar um slug disponível usando variações do nome
 */

import { supabaseAdmin } from './supabase'

/**
 * Normaliza um nome para slug (remove acentos, espaços, etc)
 */
function normalizeToSlug(text: string): string {
  if (!text || typeof text !== 'string') {
    return ''
  }

  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
    .trim()
    .replace(/\s+/g, '-') // Substitui espaços por hífens
    .replace(/-+/g, '-') // Remove hífens duplicados
    .replace(/^-|-$/g, '') // Remove hífens do início e fim
    .substring(0, 50) // Limitar a 50 caracteres
}

/**
 * Verifica se um user_slug está disponível
 */
async function isSlugAvailable(slug: string): Promise<boolean> {
  if (!slug || slug.length < 3) {
    return false
  }

  // Lista de palavras reservadas
  const palavrasReservadas = [
    'portal', 'ferramenta', 'ferramentas', 'home', 'configuracao', 
    'configuracoes', 'perfil', 'admin', 'api', 'pt', 'c', 'coach', 
    'nutri', 'wellness', 'nutra', 'hom', 'workshop', 'trial', 'login'
  ]
  
  if (palavrasReservadas.includes(slug.toLowerCase())) {
    return false
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('user_profiles')
      .select('user_id')
      .eq('user_slug', slug)
      .maybeSingle()

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = no rows returned (é o que queremos)
      console.error('Erro ao verificar slug:', error)
      return false
    }

    // Se não encontrou dados, slug está disponível
    return !data
  } catch (error) {
    console.error('Erro ao verificar disponibilidade do slug:', error)
    return false
  }
}

/**
 * Gera um user_slug disponível baseado no nome completo
 * Tenta várias variações até encontrar uma disponível
 */
export async function generateAvailableUserSlug(nomeCompleto: string): Promise<string | null> {
  if (!nomeCompleto || nomeCompleto.trim().length < 3) {
    return null
  }

  // Extrair primeiro nome
  const partesNome = nomeCompleto.trim().split(/\s+/)
  const primeiroNome = partesNome[0]
  
  if (!primeiroNome || primeiroNome.length < 2) {
    return null
  }

  // Tentar variações do slug
  const tentativas: string[] = []

  // 1. Apenas primeiro nome
  tentativas.push(normalizeToSlug(primeiroNome))

  // 2. Primeiro nome + primeira letra do segundo nome (se existir)
  if (partesNome.length >= 2 && partesNome[1].length > 0) {
    const segundoNome = partesNome[1]
    tentativas.push(normalizeToSlug(`${primeiroNome} ${segundoNome.charAt(0)}`))
  }

  // 3. Primeiro nome + segundo nome (se existir)
  if (partesNome.length >= 2) {
    tentativas.push(normalizeToSlug(`${primeiroNome} ${partesNome[1]}`))
  }

  // 4. Primeiro nome + números (1-99)
  for (let i = 1; i <= 99; i++) {
    tentativas.push(`${normalizeToSlug(primeiroNome)}${i}`)
  }

  // 5. Primeiro nome + letras (a-z)
  for (let i = 0; i < 26; i++) {
    const letra = String.fromCharCode(97 + i) // a-z
    tentativas.push(`${normalizeToSlug(primeiroNome)}${letra}`)
  }

  // Tentar cada variação até encontrar uma disponível
  for (const tentativa of tentativas) {
    if (tentativa && tentativa.length >= 3) {
      const disponivel = await isSlugAvailable(tentativa)
      if (disponivel) {
        console.log(`✅ Slug disponível encontrado: ${tentativa}`)
        return tentativa
      }
    }
  }

  // Se nenhuma tentativa funcionou, retornar null
  console.warn(`⚠️ Não foi possível gerar um slug disponível para: ${nomeCompleto}`)
  return null
}
