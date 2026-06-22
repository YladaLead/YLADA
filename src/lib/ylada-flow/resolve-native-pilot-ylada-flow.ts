/**
 * Resolve YladaFlow completo para o piloto nativo (molde da biblioteca quando existir).
 */
import type { FluxoCliente } from '@/types/ylada-flow-legacy'
import type { YladaFlow } from '@/types/ylada-flow'
import { FLUXO_CALCULADORA_HIDRATACAO } from '@/lib/ylada-flow/bibliotecas/calculadoras/hidratacao'
import {
  fluxoClienteToYladaFlow,
  type FluxoClienteToYladaFlowOptions,
} from '@/lib/ylada-flow/fluxo-cliente-to-ylada-flow'

export function resolveNativePilotYladaFlow(
  legacyFluxo: FluxoCliente,
  opts: FluxoClienteToYladaFlowOptions
): YladaFlow {
  if (legacyFluxo.id === 'calc-hidratacao') {
    const tenantId = opts.tenantId?.trim() || opts.ownerId
    const handle = (opts.handle ?? FLUXO_CALCULADORA_HIDRATACAO.handle ?? legacyFluxo.id).trim()
    return {
      ...FLUXO_CALCULADORA_HIDRATACAO,
      id: legacyFluxo.id,
      nome: legacyFluxo.nome,
      handle,
      tenantId,
      ownerId: opts.ownerId,
      objetivo: legacyFluxo.objetivo.trim() || FLUXO_CALCULADORA_HIDRATACAO.objetivo,
      devolutiva: {
        ...FLUXO_CALCULADORA_HIDRATACAO.devolutiva,
        porPerfil: {
          pronto: {
            ...FLUXO_CALCULADORA_HIDRATACAO.devolutiva.porPerfil.pronto,
            ctaWhatsApp: legacyFluxo.cta,
          },
          curioso: {
            ...FLUXO_CALCULADORA_HIDRATACAO.devolutiva.porPerfil.curioso,
            ctaWhatsApp: legacyFluxo.cta,
          },
        },
      },
    }
  }

  return fluxoClienteToYladaFlow(legacyFluxo, opts)
}
