// =====================================================
// BIBLIOTECA — VENDAS Pró-Líderes (Lote 3)
// =====================================================
//
// Vendas organizado por BLOCO de leitura (não por produto/kit; "hype" foi aposentado).
// Cada bloco compartilha um questionário afiado + uma devolutiva afiada (modelo Caminho 2).
//
// Blocos:
//   - corpo-metabolismo ✅ piloto (5 fluxos) — validado no ar
//   - energia-foco       ✅ (17 fluxos: 4 ex-hype + 13 energia do fluxosClientes; neutraliza o hype) — validado no ar
//   - ansiedade-doce     ✅ (1 fluxo: fome emocional — leitura própria, copy acolhedora)
//
// STATUS: adição pura. Nada importa este arquivo ainda — risco zero.
// =====================================================

import type { YladaFlow } from '@/types/ylada-flow'
import { FLUXOS_VENDAS_CORPO } from './blocos/corpo-metabolismo'
import { FLUXOS_VENDAS_ENERGIA } from './blocos/energia-foco'
import { FLUXOS_VENDAS_ANSIEDADE } from './blocos/ansiedade-doce'

export { criarFluxoVendas, type VendasBloco, type VendasVariacao } from './fabrica-vendas'
export {
  BLOCO_CORPO_METABOLISMO,
  FLUXOS_VENDAS_CORPO,
  FLUXOS_VENDAS_CORPO_POR_ID,
} from './blocos/corpo-metabolismo'
export {
  BLOCO_ENERGIA_FOCO,
  FLUXOS_VENDAS_ENERGIA,
  FLUXOS_VENDAS_ENERGIA_POR_ID,
} from './blocos/energia-foco'
export {
  BLOCO_ANSIEDADE_DOCE,
  FLUXOS_VENDAS_ANSIEDADE,
  FLUXOS_VENDAS_ANSIEDADE_POR_ID,
} from './blocos/ansiedade-doce'

/** Todos os fluxos de vendas migrados até aqui (cresce a cada bloco). */
export const FLUXOS_VENDAS: YladaFlow[] = [
  ...FLUXOS_VENDAS_CORPO,
  ...FLUXOS_VENDAS_ENERGIA,
  ...FLUXOS_VENDAS_ANSIEDADE,
]

/** Lookup por flow_id (todos os blocos). */
export const FLUXOS_VENDAS_POR_ID: Record<string, YladaFlow> = Object.fromEntries(
  FLUXOS_VENDAS.map((f) => [f.id, f]),
)
