/**
 * Open Graph para presets Pro Líderes (`/l/…`).
 * Todas as prévias vêm de `public/images/og/pro-lideres/` — um ficheiro por fluxo (`{stem}.png`).
 * Placebo inicial: cópia do cartão logo YLADA (gerar com `node scripts/seed-pro-lideres-og-placeholders.mjs`).
 */
import {
  PRO_LIDERES_OG_IMAGE_DIR,
  PRO_LIDERES_OG_PLACEHOLDER_LOGO_FILE,
  proLideresOgImageRelativeFile,
} from '@/config/ylada-link-og-image-bank'

export function getProLideresPresetOpenGraphImageUrl(fluxoId: string, baseUrl: string): string {
  const base = baseUrl.replace(/\/$/, '')
  const trimmed = fluxoId.trim()
  if (!trimmed) {
    return `${base}${PRO_LIDERES_OG_IMAGE_DIR}/${PRO_LIDERES_OG_PLACEHOLDER_LOGO_FILE}`
  }
  return `${base}${PRO_LIDERES_OG_IMAGE_DIR}/${proLideresOgImageRelativeFile(trimmed)}`
}
