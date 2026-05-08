/**
 * Open Graph genéricas Pro Líderes (sem `pro_lideres_fluxo_id` no link).
 *
 * Ficheiros finais em `public/images/og/pro-lideres/`:
 * - `og-default-saude.jpg` — vendas / saúde (`meta.pro_lideres_kind` ≠ recruitment)
 * - `og-default-recrutamento.jpg` — recrutamento (`kind === 'recruitment'`)
 *
 * Originais editáveis: `public/images/og/pro-lideres/_sources/*.source.png`
 * Regenerar JPEG 1200×630: `npm run og:build-pro-lideres-defaults`
 */
export const PRO_LIDERES_OG_DEFAULT_SAUDE_FILENAME = 'og-default-saude.jpg'

export const PRO_LIDERES_OG_DEFAULT_RECRUTAMENTO_FILENAME = 'og-default-recrutamento.jpg'

/** `pro_lideres_kind` em `config_json.meta`: `sales` ou ausente → saúde; `recruitment` → recrutamento. */
export function proLideresOgDefaultFileForKind(kind: string | null | undefined): string {
  const k = (kind ?? '').trim().toLowerCase()
  if (k === 'recruitment') return PRO_LIDERES_OG_DEFAULT_RECRUTAMENTO_FILENAME
  return PRO_LIDERES_OG_DEFAULT_SAUDE_FILENAME
}
