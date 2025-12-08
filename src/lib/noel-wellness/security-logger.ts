/**
 * Logger de Segurança do NOEL
 * 
 * Registra tentativas suspeitas, padrões de abuso e eventos de segurança
 */

import { supabaseAdmin } from '@/lib/supabase'
import type { SecurityFlags } from './security-detector'

interface SecurityLogData {
  userId: string | null
  message: string
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
  detectedPatterns: string[]
  wasBlocked: boolean
  responseSent?: string
  ipAddress?: string
  userAgent?: string
}

/**
 * Registra um evento de segurança
 */
export async function logSecurityEvent(data: SecurityLogData): Promise<void> {
  try {
    await supabaseAdmin
      .from('noel_security_logs')
      .insert({
        user_id: data.userId || null,
        message: data.message,
        risk_level: data.riskLevel,
        detected_patterns: data.detectedPatterns,
        was_blocked: data.wasBlocked,
        response_sent: data.responseSent || null,
        ip_address: data.ipAddress || null,
        user_agent: data.userAgent || null,
      })
  } catch (error) {
    console.error('❌ Erro ao registrar evento de segurança:', error)
    // Não lançar erro - logging não deve quebrar o fluxo
  }
}

/**
 * Registra evento de segurança a partir de SecurityFlags
 */
export async function logSecurityFromFlags(
  flags: SecurityFlags,
  userId: string | null,
  message: string,
  responseSent?: string,
  request?: { ip?: string; userAgent?: string }
): Promise<void> {
  if (!flags.isSuspicious) {
    return // Não logar se não for suspeito
  }

  await logSecurityEvent({
    userId,
    message,
    riskLevel: flags.riskLevel,
    detectedPatterns: flags.detectedPatterns,
    wasBlocked: flags.shouldBlock,
    responseSent,
    ipAddress: request?.ip,
    userAgent: request?.userAgent,
  })
}

/**
 * Busca eventos de segurança recentes para um usuário
 */
export async function getRecentSecurityEvents(
  userId: string,
  limit: number = 10
): Promise<any[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('noel_security_logs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('❌ Erro ao buscar eventos de segurança:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('❌ Erro ao buscar eventos de segurança:', error)
    return []
  }
}

/**
 * Verifica se um usuário tem histórico suspeito
 */
export async function hasSuspiciousHistory(
  userId: string,
  hours: number = 24
): Promise<boolean> {
  try {
    const since = new Date(Date.now() - hours * 60 * 60 * 1000)

    const { data, error } = await supabaseAdmin
      .from('noel_security_logs')
      .select('id')
      .eq('user_id', userId)
      .in('risk_level', ['high', 'critical'])
      .gte('created_at', since.toISOString())
      .limit(5)

    if (error) {
      console.error('❌ Erro ao verificar histórico suspeito:', error)
      return false
    }

    // Se tiver 3 ou mais eventos de alto risco nas últimas 24h, considerar suspeito
    return (data?.length || 0) >= 3
  } catch (error) {
    console.error('❌ Erro ao verificar histórico suspeito:', error)
    return false
  }
}
