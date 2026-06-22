/**
 * Resolve YladaFlow completo para calculadoras nativas (molde da biblioteca).
 */
import type { FluxoCliente } from '@/types/ylada-flow-legacy'
import type { YladaFlow } from '@/types/ylada-flow'
import { FLUXO_CALCULADORA_CALORIAS } from '@/lib/ylada-flow/bibliotecas/calculadoras/calorias'
import { FLUXO_CALCULADORA_HIDRATACAO } from '@/lib/ylada-flow/bibliotecas/calculadoras/hidratacao'
import { FLUXO_CALCULADORA_IMC } from '@/lib/ylada-flow/bibliotecas/calculadoras/imc'
import { FLUXO_CALCULADORA_PROTEINA } from '@/lib/ylada-flow/bibliotecas/calculadoras/proteina'
import {
  fluxoClienteToYladaFlow,
  type FluxoClienteToYladaFlowOptions,
} from '@/lib/ylada-flow/fluxo-cliente-to-ylada-flow'

const CALCULADORA_MOLD_BY_FLUXO_ID: Record<string, YladaFlow> = {
  'calc-hidratacao': FLUXO_CALCULADORA_HIDRATACAO,
  agua: FLUXO_CALCULADORA_HIDRATACAO,
  'calc-proteina': FLUXO_CALCULADORA_PROTEINA,
  'calc-calorias': FLUXO_CALCULADORA_CALORIAS,
  'calc-imc': FLUXO_CALCULADORA_IMC,
}

export const YLADA_FLOW_CALCULADORA_MOLD_FLUXO_IDS = Object.keys(CALCULADORA_MOLD_BY_FLUXO_ID)

export function hasCalculadoraMoldForFluxoId(fluxoId: string): boolean {
  return fluxoId in CALCULADORA_MOLD_BY_FLUXO_ID
}

function mergeMoldWithLegacy(
  mold: YladaFlow,
  legacyFluxo: FluxoCliente,
  opts: FluxoClienteToYladaFlowOptions
): YladaFlow {
  const tenantId = opts.tenantId?.trim() || opts.ownerId
  const handle = (opts.handle ?? mold.handle ?? legacyFluxo.id).trim()
  const cta = legacyFluxo.cta.trim() || mold.devolutiva.porPerfil.pronto.ctaWhatsApp

  return {
    ...mold,
    id: legacyFluxo.id,
    nome:
      legacyFluxo.nome.trim() && legacyFluxo.nome.trim() !== legacyFluxo.id
        ? legacyFluxo.nome
        : mold.nome,
    handle,
    tenantId,
    ownerId: opts.ownerId,
    objetivo: legacyFluxo.objetivo.trim() || mold.objetivo,
    devolutiva: {
      ...mold.devolutiva,
      porPerfil: {
        pronto: { ...mold.devolutiva.porPerfil.pronto, ctaWhatsApp: cta },
        curioso: { ...mold.devolutiva.porPerfil.curioso, ctaWhatsApp: cta },
      },
      ...(mold.devolutiva.porFaixa ? { porFaixa: mold.devolutiva.porFaixa } : {}),
    },
  }
}

export function resolveNativePilotYladaFlow(
  legacyFluxo: FluxoCliente,
  opts: FluxoClienteToYladaFlowOptions
): YladaFlow {
  const mold = CALCULADORA_MOLD_BY_FLUXO_ID[legacyFluxo.id]
  if (mold) return mergeMoldWithLegacy(mold, legacyFluxo, opts)

  return fluxoClienteToYladaFlow(legacyFluxo, opts)
}
