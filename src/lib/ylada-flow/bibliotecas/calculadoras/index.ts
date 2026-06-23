// =====================================================
// BIBLIOTECA — CALCULADORAS (serviço) no contrato YladaFlow
// =====================================================
//
// As 4 calculadoras migradas (Chat 5). Cada arquivo já exporta um YladaFlow pronto;
// este index só AGREGA (mesmo papel do index de vendas/recrutamento), pra o Recomendador
// (Chat 7) e futuros consumidores importarem de um lugar só.
//
// Finalidade: 'diagnostico-servico' (servir/educar). Leitura por FAIXA de resultado
// (devolutiva.porFaixa), não por prontidão. Copy 100% lookup do molde (Spec §7).
//
// STATUS: adição pura. Agregação de exports já existentes — risco zero.
// =====================================================

import type { YladaFlow } from '@/types/ylada-flow'
import { FLUXO_CALCULADORA_IMC } from './imc'
import { FLUXO_CALCULADORA_CALORIAS } from './calorias'
import { FLUXO_CALCULADORA_PROTEINA } from './proteina'
import { FLUXO_CALCULADORA_HIDRATACAO } from './hidratacao'

export { FLUXO_CALCULADORA_IMC } from './imc'
export { FLUXO_CALCULADORA_CALORIAS } from './calorias'
export { FLUXO_CALCULADORA_PROTEINA } from './proteina'
export { FLUXO_CALCULADORA_HIDRATACAO } from './hidratacao'

/** Todas as calculadoras migradas. */
export const FLUXOS_CALCULADORAS: YladaFlow[] = [
  FLUXO_CALCULADORA_IMC,
  FLUXO_CALCULADORA_CALORIAS,
  FLUXO_CALCULADORA_PROTEINA,
  FLUXO_CALCULADORA_HIDRATACAO,
]

/** Lookup por flow_id. */
export const FLUXOS_CALCULADORAS_POR_ID: Record<string, YladaFlow> = Object.fromEntries(
  FLUXOS_CALCULADORAS.map((f) => [f.id, f]),
)
