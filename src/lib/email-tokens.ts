import { supabaseAdmin } from '@/lib/supabase'
import crypto from 'crypto'

/**
 * Gera um token único e seguro para acesso temporário
 */
export function generateAccessToken(): string {
  // Gerar token aleatório de 32 bytes (256 bits) em base64
  return crypto.randomBytes(32).toString('base64url')
}

/**
 * Cria um token de acesso para um usuário
 * @param userId ID do usuário
 * @param expiresInDays Número de dias até expirar (padrão: 30)
 * @returns Token gerado
 */
export async function createAccessToken(
  userId: string,
  expiresInDays: number = 30
): Promise<string> {
  const token = generateAccessToken()
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + expiresInDays)

  const { error } = await supabaseAdmin
    .from('access_tokens')
    .insert({
      user_id: userId,
      token,
      expires_at: expiresAt.toISOString(),
    })

  if (error) {
    console.error('❌ Erro ao criar token de acesso:', error)
    throw new Error('Erro ao criar token de acesso')
  }

  console.log('✅ Token de acesso criado:', {
    userId,
    expiresAt: expiresAt.toISOString(),
  })

  return token
}

/**
 * Valida e usa um token de acesso
 * @param token Token a ser validado
 * @returns Dados do usuário se válido, null se inválido
 */
export async function validateAndUseAccessToken(
  token: string
): Promise<{ userId: string } | null> {
  const { data, error } = await supabaseAdmin
    .from('access_tokens')
    .select('user_id, expires_at, used_at')
    .eq('token', token)
    .single()

  if (error || !data) {
    console.warn('⚠️ Token não encontrado:', token)
    return null
  }

  // Verificar se já foi usado
  if (data.used_at) {
    console.warn('⚠️ Token já foi usado:', token)
    return null
  }

  // Verificar se expirou
  const expiresAt = new Date(data.expires_at)
  if (expiresAt < new Date()) {
    console.warn('⚠️ Token expirado:', token)
    return null
  }

  // Marcar como usado
  const { error: updateError } = await supabaseAdmin
    .from('access_tokens')
    .update({ used_at: new Date().toISOString() })
    .eq('token', token)

  if (updateError) {
    console.error('❌ Erro ao marcar token como usado:', updateError)
    // Continuar mesmo assim, mas logar o erro
  }

  console.log('✅ Token validado e usado:', {
    userId: data.user_id,
    token,
  })

  return {
    userId: data.user_id,
  }
}

/**
 * Limpa tokens expirados (executar periodicamente)
 */
export async function cleanupExpiredTokens(): Promise<number> {
  const { data, error } = await supabaseAdmin
    .from('access_tokens')
    .delete()
    .lt('expires_at', new Date().toISOString())
    .is('used_at', null)

  if (error) {
    console.error('❌ Erro ao limpar tokens expirados:', error)
    return 0
  }

  const deletedCount = data?.length || 0
  console.log(`✅ ${deletedCount} tokens expirados removidos`)
  return deletedCount
}

