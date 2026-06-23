/**
 * Aplica config nativa YladaFlow no payload do link público (calculadoras + quizzes com molde).
 */
import type { SupabaseClient } from '@supabase/supabase-js'
import type { FluxoCliente } from '@/types/ylada-flow-legacy'
import { fluxosClientes } from '@/lib/ylada-flow/fluxos-clientes'
import { getProLideresWellnessCalculadorasBasicasPresetFluxos } from '@/lib/pro-lideres/pro-lideres-wellness-calculadoras-basicas-preset-fluxos'
import {
  hasCalculadoraMoldForFluxoId,
  hasQuizMoldForFluxoId,
  resolveNativePilotYladaFlow,
} from '@/lib/ylada-flow/resolve-native-pilot-ylada-flow'
import { yladaFlowToPublicLinkConfig } from '@/lib/ylada-flow/ylada-flow-to-public-link-config'
import {
  YLADA_TEMPLATE_CALC_AGUA_ID,
  YLADA_TEMPLATE_CALC_CALORIAS_ID,
  YLADA_TEMPLATE_CALC_IMC_ID,
  YLADA_TEMPLATE_CALC_PROTEINA_ID,
} from '@/lib/ylada-canonical-flow-config'
import {
  isYladaFlowNativePilotGloballyEnabled,
  YLADA_FLOW_NATIVE_PILOT_FLUXO_ID,
} from '@/lib/ylada-flow/ylada-flow-native-pilot'

const YLADA_CALC_TEMPLATE_TO_FLUXO_ID: Record<string, string> = {
  [YLADA_TEMPLATE_CALC_AGUA_ID]: 'agua',
  [YLADA_TEMPLATE_CALC_IMC_ID]: 'calc-imc',
  [YLADA_TEMPLATE_CALC_CALORIAS_ID]: 'calc-calorias',
  [YLADA_TEMPLATE_CALC_PROTEINA_ID]: 'calc-proteina',
}

function minimalLegacyFluxoStub(fluxoId: string): FluxoCliente {
  return {
    id: fluxoId,
    nome: fluxoId,
    objetivo: '',
    perguntas: [],
    diagnostico: {
      titulo: '',
      descricao: '',
      sintomas: [],
      beneficios: [],
      mensagemPositiva: '',
    },
    kitRecomendado: 'energia',
    cta: 'Quero falar no WhatsApp',
    tags: [],
  }
}

function resolveNativeMoldFluxoId(
  meta: Record<string, unknown>,
  templateId?: string | null
): string {
  const fromMeta =
    typeof meta.pro_lideres_fluxo_id === 'string'
      ? meta.pro_lideres_fluxo_id.trim()
      : typeof meta.flow_id === 'string'
        ? meta.flow_id.trim()
        : typeof meta.handle === 'string'
          ? meta.handle.trim()
          : ''
  if (fromMeta) return fromMeta
  if (templateId && YLADA_CALC_TEMPLATE_TO_FLUXO_ID[templateId]) {
    return YLADA_CALC_TEMPLATE_TO_FLUXO_ID[templateId]
  }
  return ''
}

function findLegacyFluxoForMold(fluxoId: string): FluxoCliente | null {
  const fromPreset = getProLideresWellnessCalculadorasBasicasPresetFluxos().find((f) => f.id === fluxoId)
  if (fromPreset) return fromPreset
  const fromClientes = fluxosClientes.find((f) => f.id === fluxoId)
  if (fromClientes) return fromClientes
  if (hasCalculadoraMoldForFluxoId(fluxoId) || hasQuizMoldForFluxoId(fluxoId)) {
    return minimalLegacyFluxoStub(fluxoId)
  }
  return null
}

function shouldApplyNativeMold(meta: Record<string, unknown>, fluxoId: string): boolean {
  const hasCalc = hasCalculadoraMoldForFluxoId(fluxoId)
  const hasQuiz = hasQuizMoldForFluxoId(fluxoId)
  if (!fluxoId || (!hasCalc && !hasQuiz)) return false
  if (meta.pro_lideres_kind === 'recruitment') return false

  /** Quiz molds (ex.: bloco Corpo): só atrás de flag explícita — nunca auto-ligar em preset. */
  if (hasQuiz && !hasCalc) {
    return meta.use_ylada_flow_native === true
  }

  if (meta.use_ylada_flow_native === true) return true
  if (
    isYladaFlowNativePilotGloballyEnabled() &&
    fluxoId === YLADA_FLOW_NATIVE_PILOT_FLUXO_ID
  ) {
    return true
  }
  if (meta.pro_lideres_preset === true) return true
  return true
}

/**
 * Reconstrói `config_json` a partir do molde YladaFlow quando aplicável.
 * Preserva `meta` da instância (atribuição Pro Líderes, segmento, etc.) por cima do nativo.
 */
export async function maybeApplyYladaFlowNativeConfig(
  _admin: SupabaseClient,
  config: Record<string, unknown>,
  link: { user_id?: string | null; template_id?: string | null }
): Promise<Record<string, unknown>> {
  const meta = (config.meta as Record<string, unknown> | undefined) ?? {}
  const fluxoId = resolveNativeMoldFluxoId(meta, link.template_id)
  if (!shouldApplyNativeMold(meta, fluxoId)) return config

  const legacyFluxo = findLegacyFluxoForMold(fluxoId)
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
      pro_lideres_fluxo_id: fluxoId,
    },
  }
}
