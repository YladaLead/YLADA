/**
 * Noel Pro Líderes unificado na matriz (`POST /api/ylada/noel`).
 * Flag OFF = hook inerte (byte-idêntico). Spec: blueprint Noel_Completo §9.3 r20.
 */
import type { LeaderTenantRow } from '@/types/leader-tenant'
import type { ProLideresTenantRole } from '@/types/leader-tenant'

/** Modelo padrão do Noel (matriz + ramos PL unificados). */
export const NOEL_CHAT_MODEL = 'gpt-4o-mini'

/** Liga injeção do bloco `[CONTEXTO PRO LÍDERES]` na rota da matriz (todos os tenants). OFF por padrão. */
export function isNoelProLideresUnifiedEnabled(): boolean {
  return (
    process.env.NOEL_PRO_LIDERES_UNIFIED_ENABLED === 'true' ||
    process.env.NOEL_PRO_LIDERES_UNIFIED_ENABLED === '1'
  )
}

/** E-mails de donos de tenant no piloto (vírgula). Ex.: deisefaula@gmail.com */
export function isNoelProLideresUnifiedPilotOwnerEmail(email: string | null | undefined): boolean {
  if (!email?.trim()) return false
  const normalized = email.trim().toLowerCase()
  const fromEnv =
    process.env.NOEL_PRO_LIDERES_UNIFIED_PILOT_EMAILS?.split(',')
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean) ?? []
  return fromEnv.includes(normalized)
}

/**
 * Membro roda o motor puro da matriz (não a stack rígida) — mesmo Noel, só com o
 * bloco de contexto de campo. OFF = comportamento legado (motor membro dedicado).
 * Só tem efeito quando já existe sessão de membro (tenant no piloto de unificação).
 */
export function isNoelProLideresMemberMatrizPureEnabled(): boolean {
  // Variável pública (NEXT_PUBLIC_) para ligar motor + renderer juntos numa só chave;
  // aceita a variante server-only antiga como fallback.
  const v =
    process.env.NEXT_PUBLIC_NOEL_PL_MEMBER_MATRIZ_PURE_ENABLED ??
    process.env.NOEL_PL_MEMBER_MATRIZ_PURE_ENABLED
  return v === 'true' || v === '1'
}

/**
 * Unificação ativa para este tenant.
 * Global env OU coluna `noel_unified_pilot_enabled` OU e-mail do dono na lista piloto.
 */
export function isNoelProLideresUnifiedForTenant(
  tenant: Pick<LeaderTenantRow, 'noel_unified_pilot_enabled'>,
  opts?: { ownerEmail?: string | null; role?: ProLideresTenantRole }
): boolean {
  if (isNoelProLideresUnifiedEnabled()) return true
  if (tenant.noel_unified_pilot_enabled === true) return true
  if (opts?.role === 'leader' && isNoelProLideresUnifiedPilotOwnerEmail(opts.ownerEmail)) return true
  return false
}
