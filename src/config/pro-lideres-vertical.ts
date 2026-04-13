/**
 * Vertical / operador do Pro Líderes (nomenclatura e futuros white-labels).
 * O produto continua a chamar-se "Pro Líderes"; estes códigos servem para
 * personalizar copy, segmento e integrações sem renomear o módulo.
 *
 * Ex.: Herbalife → código `h-lider`. Outra empresa → novo código via env.
 */
export const PRO_LIDERES_VERTICAL_CODE =
  process.env.NEXT_PUBLIC_PRO_LIDERES_VERTICAL_CODE?.trim() || 'h-lider'

/** Nome amigável do operador (ex.: parceria). */
export const PRO_LIDERES_VERTICAL_BRAND_LABEL =
  process.env.NEXT_PUBLIC_PRO_LIDERES_VERTICAL_BRAND_LABEL?.trim() || 'Herbalife'

/**
 * Rótulo de segmento no catálogo (estilo ylada.com — ex.: pill "Nutrição").
 * Ajustável quando o vertical não for nutrição/bem-estar.
 */
export const PRO_LIDERES_VERTICAL_SEGMENT_LABEL =
  process.env.NEXT_PUBLIC_PRO_LIDERES_VERTICAL_SEGMENT_LABEL?.trim() || 'Nutrição'
