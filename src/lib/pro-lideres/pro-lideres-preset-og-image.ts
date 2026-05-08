/**
 * Open Graph para presets Pro Líderes (`/l/…`).
 * Todas as prévias vêm de `public/images/og/pro-lideres/` — um ficheiro por fluxo (`{stem}.jpg`).
 * Sem fluxo: defaults em `pro-lideres-og-default-assets.ts` (`og-default-saude.jpg` / `og-default-recrutamento.jpg`).
 * Regenerar a partir das artes em `_sources/`: `npm run og:build-pro-lideres-defaults`
 */
import { PRO_LIDERES_OG_IMAGE_DIR, proLideresOgImageRelativeFile } from '@/config/ylada-link-og-image-bank'
import { proLideresOgDefaultFileForKind } from '@/lib/pro-lideres/pro-lideres-og-default-assets'

/** Invalida cache WhatsApp/Meta após trocar PNGs (ex.: `2` na Vercel: `NEXT_PUBLIC_PRO_LIDERES_OG_ASSET_VERSION`). */
function proLideresOgAssetCacheQuery(): string {
  const v = process.env.NEXT_PUBLIC_PRO_LIDERES_OG_ASSET_VERSION?.trim()
  return v ? `?v=${encodeURIComponent(v)}` : ''
}

export function getProLideresPresetOpenGraphImageUrl(
  fluxoId: string,
  baseUrl: string,
  proLideresKind?: string | null
): string {
  const base = baseUrl.replace(/\/$/, '')
  const q = proLideresOgAssetCacheQuery()
  const trimmed = fluxoId.trim()
  if (!trimmed) {
    const fallback = proLideresOgDefaultFileForKind(proLideresKind)
    return `${base}${PRO_LIDERES_OG_IMAGE_DIR}/${fallback}${q}`
  }
  return `${base}${PRO_LIDERES_OG_IMAGE_DIR}/${proLideresOgImageRelativeFile(trimmed)}${q}`
}
