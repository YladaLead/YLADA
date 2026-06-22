/**
 * Aplica config nativa YladaFlow no payload do link público (piloto).
 */
import type { SupabaseClient } from '@supabase/supabase-js'
import { getProLideresWellnessCalculadorasBasicasPresetFluxos } from '@/lib/pro-lideres/pro-lideres-wellness-calculadoras-basicas-preset-fluxos'
import { resolveNativePilotYladaFlow } from '@/lib/ylada-flow/resolve-native-pilot-ylada-flow'
import { yladaFlowToPublicLinkConfig } from '@/lib/ylada-flow/ylada-flow-to-public-link-config'
import { isYladaFlowNativePilotForMeta } from '@/lib/ylada-flow/ylada-flow-native-pilot'

function findPilotFluxoCliente(fluxoId: string) {
  return getProLideresWellnessCalculadorasBasicasPresetFluxos().find((f) => f.id === fluxoId) ?? null
}

/**
 * Se o piloto estiver ativo para este link, reconstrói `config_json` a partir do YladaFlow.
 * Preserva `meta` da instância (atribuição Pro Líderes, segmento, etc.) por cima do nativo.
 */
export async function maybeApplyYladaFlowNativeConfig(
  _admin: SupabaseClient,
  config: Record<string, unknown>,
  link: { user_id?: string | null }
): Promise<Record<string, unknown>> {
  const meta = (config.meta as Record<string, unknown> | undefined) ?? {}
  if (!isYladaFlowNativePilotForMeta(meta)) return config

  const fluxoId =
    typeof meta.pro_lideres_fluxo_id === 'string'
      ? meta.pro_lideres_fluxo_id.trim()
      : typeof meta.flow_id === 'string'
        ? meta.flow_id.trim()
        : ''
  if (!fluxoId) return config

  const legacyFluxo = findPilotFluxoCliente(fluxoId)
  if (!legacyFluxo) return config

  const ownerId = (link.user_id as string | null) ?? ''
  if (!ownerId) return config

  const kind: 'sales' | 'recruitment' =
    meta.pro_lideres_kind === 'recruitment' ? 'recruitment' : 'sales'

  const yladaFlow = resolveNativePilotYladaFlow(legacyFluxo, {
    ownerId,
    tenantId: ownerId,
    kind,
    handle: typeof meta.handle === 'string' ? meta.handle : fluxoId,
  })

  const nativeConfig = yladaFlowToPublicLinkConfig(yladaFlow, kind, legacyFluxo)
  const nativeMeta = (nativeConfig.meta as Record<string, unknown>) ?? {}

  return {
    ...nativeConfig,
    meta: {
      ...nativeMeta,
      ...meta,
      use_ylada_flow_native: true,
      ylada_flow_handoff: yladaFlow.handoff,
    },
  }
}
