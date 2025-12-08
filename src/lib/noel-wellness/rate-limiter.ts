/**
 * Rate Limiter para API do NOEL
 * 
 * Implementa rate limiting por usuário para prevenir abuso
 */

import { supabaseAdmin } from '@/lib/supabase'

interface RateLimitConfig {
  maxRequests: number
  windowMs: number
  blockDurationMs: number
}

const DEFAULT_CONFIG: RateLimitConfig = {
  maxRequests: 30, // 30 requisições
  windowMs: 60 * 1000, // por minuto (60 segundos)
  blockDurationMs: 5 * 60 * 1000, // bloquear por 5 minutos se exceder
}

interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetAt: Date
  blocked: boolean
  blockUntil?: Date
}

/**
 * Verifica rate limit para um usuário
 */
export async function checkRateLimit(
  userId: string,
  config: RateLimitConfig = DEFAULT_CONFIG
): Promise<RateLimitResult> {
  const now = new Date()
  const windowStart = new Date(now.getTime() - config.windowMs)

  try {
    // Buscar requisições recentes do usuário
    const { data: recentRequests, error } = await supabaseAdmin
      .from('noel_rate_limits')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', windowStart.toISOString())
      .order('created_at', { ascending: false })

    if (error) {
      console.error('❌ Erro ao verificar rate limit:', error)
      // Em caso de erro, permitir (fail open para não bloquear usuários legítimos)
      return {
        allowed: true,
        remaining: config.maxRequests,
        resetAt: new Date(now.getTime() + config.windowMs),
        blocked: false,
      }
    }

    const requestCount = recentRequests?.length || 0

    // Verificar se está bloqueado
    const { data: blocks } = await supabaseAdmin
      .from('noel_rate_limits')
      .select('blocked_until')
      .eq('user_id', userId)
      .eq('is_blocked', true)
      .gt('blocked_until', now.toISOString())
      .order('blocked_until', { ascending: false })
      .limit(1)
      .single()

    if (blocks?.blocked_until) {
      const blockUntil = new Date(blocks.blocked_until)
      if (blockUntil > now) {
        return {
          allowed: false,
          remaining: 0,
          resetAt: blockUntil,
          blocked: true,
          blockUntil,
        }
      }
    }

    // Verificar se excedeu o limite
    if (requestCount >= config.maxRequests) {
      // Bloquear usuário
      const blockUntil = new Date(now.getTime() + config.blockDurationMs)
      
      await supabaseAdmin
        .from('noel_rate_limits')
        .insert({
          user_id: userId,
          is_blocked: true,
          blocked_until: blockUntil.toISOString(),
          request_count: requestCount + 1,
        })

      return {
        allowed: false,
        remaining: 0,
        resetAt: blockUntil,
        blocked: true,
        blockUntil,
      }
    }

    // Registrar requisição atual
    await supabaseAdmin
      .from('noel_rate_limits')
      .insert({
        user_id: userId,
        is_blocked: false,
        request_count: requestCount + 1,
      })

    const remaining = config.maxRequests - (requestCount + 1)
    const resetAt = new Date(now.getTime() + config.windowMs)

    return {
      allowed: true,
      remaining,
      resetAt,
      blocked: false,
    }
  } catch (error: any) {
    console.error('❌ Erro ao verificar rate limit:', error)
    // Fail open
    return {
      allowed: true,
      remaining: config.maxRequests,
      resetAt: new Date(now.getTime() + config.windowMs),
      blocked: false,
    }
  }
}

/**
 * Limpa registros antigos de rate limit (manutenção)
 */
export async function cleanupRateLimitRecords(): Promise<void> {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)

  try {
    await supabaseAdmin
      .from('noel_rate_limits')
      .delete()
      .lt('created_at', oneDayAgo.toISOString())
  } catch (error) {
    console.error('❌ Erro ao limpar registros de rate limit:', error)
  }
}
