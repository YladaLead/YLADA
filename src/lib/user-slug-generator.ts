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
 * Nome usado para montar o slug: prioriza nome completo; senão parte local do e-mail (ex.: paulo.eribe → paulo eribe).
 */
export function nameHintForUserSlug(nomeCompleto: string, email?: string): string {
  const nome = (nomeCompleto || '').trim()
  if (nome.length >= 3) return nome

  const local = (email || '').split('@')[0]?.trim() ?? ''
  if (!local) return nome

  const fromEmail = local.replace(/[._+-]+/g, ' ').trim()
  const hint = fromEmail.length >= 3 ? fromEmail : nome || local
  return hint.trim()
}

/**
 * Gera um user_slug disponível baseado no nome completo (ou e-mail como fallback).
 * Tenta várias variações até encontrar uma disponível.
 */
export async function generateAvailableUserSlug(
  nomeCompleto: string,
  email?: string
): Promise<string | null> {
  const hint = nameHintForUserSlug(nomeCompleto, email)
  if (!hint || hint.length < 3) {
    return null
  }

  // Extrair primeiro nome
  const partesNome = hint.split(/\s+/)
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
  console.warn(`⚠️ Não foi possível gerar um slug disponível para: ${hint}`)
  return null
}

/**
 * Garante user_slug no perfil (lê o existente ou gera, persiste e retorna).
 */
export async function ensureUserSlugSaved(
  userId: string,
  nomeCompleto: string,
  email?: string
): Promise<string | null> {
  if (!supabaseAdmin) return null

  const { data: row } = await supabaseAdmin
    .from('user_profiles')
    .select('user_slug, nome_completo')
    .eq('user_id', userId)
    .maybeSingle()

  const atual = row?.user_slug?.trim()
  if (atual) return atual

  const slugGerado = await generateAvailableUserSlug(
    nomeCompleto || row?.nome_completo || '',
    email
  )
  if (!slugGerado) return null

  const { error } = await supabaseAdmin
    .from('user_profiles')
    .update({ user_slug: slugGerado, updated_at: new Date().toISOString() })
    .eq('user_id', userId)

  if (error) {
    console.error('Erro ao salvar user_slug automático:', error)
    return null
  }

  console.log(`✅ user_slug automático salvo: ${slugGerado} (user_id=${userId})`)
  return slugGerado
}
