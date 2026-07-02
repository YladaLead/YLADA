/** Margem após `current_period_end` enquanto o MP processa cobrança recorrente + webhook. */
export const PRO_LIDERES_TEAM_MP_RENEWAL_GRACE_MS = 48 * 60 * 60 * 1000

/** Horas extras no fim do período mensal MP (evita vencer minutos antes da cobrança). */
export const PRO_LIDERES_TEAM_MP_PERIOD_BUFFER_HOURS = 36

export type ProLideresTeamSubscriptionRow = {
  status?: string | null
  current_period_end?: string | null
  stripe_subscription_id?: string | null
  plan_type?: string | null
}

export function isMercadoPagoRecurringProLideresTeamSub(
  stripeSubscriptionId: string | null | undefined
): boolean {
  return Boolean(stripeSubscriptionId?.startsWith('mp_sub_'))
}

/**
 * Assinatura equipe vigente: período futuro OU dentro da margem pós-vencimento (só MP recorrente).
 */
export function isProLideresTeamSubscriptionEffectivelyActive(
  sub: ProLideresTeamSubscriptionRow | null | undefined,
  nowMs: number = Date.now()
): boolean {
  if (!sub || sub.status !== 'active') return false
  const endRaw = sub.current_period_end
  if (!endRaw) return false
  const endMs = new Date(endRaw).getTime()
  if (Number.isNaN(endMs)) return false
  if (endMs > nowMs) return true
  if (!isMercadoPagoRecurringProLideresTeamSub(sub.stripe_subscription_id)) return false
  return nowMs - endMs <= PRO_LIDERES_TEAM_MP_RENEWAL_GRACE_MS
}

/**
 * Fim do período alinhado ao `next_payment_date` do MP (+ buffer) ou now + 1 mês + buffer.
 */
export function computeProLideresTeamPeriodEnd(input: {
  planType: string
  now?: Date
  nextPaymentDateIso?: string | null
}): Date {
  const now = input.now ?? new Date()
  const plan = input.planType === 'annual' ? 'annual' : 'monthly'

  if (input.nextPaymentDateIso) {
    const next = new Date(input.nextPaymentDateIso)
    if (!Number.isNaN(next.getTime())) {
      const end = new Date(next.getTime())
      if (plan === 'monthly') {
        end.setHours(end.getHours() + PRO_LIDERES_TEAM_MP_PERIOD_BUFFER_HOURS)
      } else {
        end.setMonth(end.getMonth() + 12)
      }
      return end
    }
  }

  const end = new Date(now.getTime())
  if (plan === 'annual') {
    end.setMonth(end.getMonth() + 12)
  } else {
    end.setMonth(end.getMonth() + 1)
    end.setHours(end.getHours() + PRO_LIDERES_TEAM_MP_PERIOD_BUFFER_HOURS)
  }
  return end
}

/** Estende renovação mensal MP: +1 mês a partir do maior entre agora e vencimento atual + buffer. */
export function extendProLideresTeamMonthlyPeriodEnd(
  currentPeriodEndIso: string | null | undefined,
  now: Date = new Date()
): Date {
  const baseMs = Math.max(
    now.getTime(),
    currentPeriodEndIso ? new Date(currentPeriodEndIso).getTime() : now.getTime()
  )
  const end = new Date(baseMs)
  end.setMonth(end.getMonth() + 1)
  end.setHours(end.getHours() + PRO_LIDERES_TEAM_MP_PERIOD_BUFFER_HOURS)
  return end
}
