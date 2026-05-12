/** Slug enviado pelo checkout da landing `/promo/bem-estar` (API valida antes de aplicar preço). */
export const PROMO_BEM_ESTAR_SLUG = 'bem-estar' as const

/** Preços BRL da campanha (coach + nutra) quando `promoSlug === PROMO_BEM_ESTAR_SLUG`. */
export const PROMO_BEM_ESTAR_BR = {
  monthly: 100,
  annualTotal: 720,
  annualMonthlyLabel: 60,
} as const
