/**
 * Piloto: PublicLinkView lê YladaFlow nativo (atrás de flag).
 * Fluxo inicial: calc-hidratacao (Pro Líderes vendas).
 *
 * Link de teste: slug terminando em {@link YLADA_FLOW_NATIVE_PILOT_TEST_LINK_SLUG_SUFFIX}
 * com `meta.use_ylada_flow_native: true` (ver migration 427).
 */
export const YLADA_FLOW_NATIVE_PILOT_FLUXO_ID = 'calc-hidratacao' as const

/** Sufixo do slug do único link de teste do piloto nativo (calc-hidratacao). */
export const YLADA_FLOW_NATIVE_PILOT_TEST_LINK_SLUG_SUFFIX = '-ylada-native-pilot-calc-hidratacao' as const

export function isYladaFlowNativePilotTestLinkSlug(slug: string): boolean {
  return slug.trim().toLowerCase().endsWith(YLADA_FLOW_NATIVE_PILOT_TEST_LINK_SLUG_SUFFIX)
}

export function isYladaFlowNativePilotGloballyEnabled(): boolean {
  return process.env.YLADA_FLOW_NATIVE_PILOT === 'true' || process.env.YLADA_FLOW_NATIVE_PILOT === '1'
}

export function isYladaFlowNativePilotForMeta(meta: Record<string, unknown> | undefined): boolean {
  if (!meta) return false
  if (meta.use_ylada_flow_native === true) return true
  if (!isYladaFlowNativePilotGloballyEnabled()) return false
  const fluxoId =
    typeof meta.pro_lideres_fluxo_id === 'string'
      ? meta.pro_lideres_fluxo_id.trim()
      : typeof meta.flow_id === 'string'
        ? meta.flow_id.trim()
        : ''
  return fluxoId === YLADA_FLOW_NATIVE_PILOT_FLUXO_ID
}
