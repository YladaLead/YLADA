// =====================================================
// BIBLIOTECA — VENDAS Pró-Líderes (Lote 3)
// =====================================================
//
// Vendas organizado por BLOCO de leitura (não por produto/kit; "hype" foi aposentado).
// Cada bloco compartilha um questionário afiado + uma devolutiva afiada (modelo Caminho 2).
//
// Blocos:
//   - corpo-metabolismo ✅ PILOTO (5 fluxos)
//   - energia-foco       ⏳ próximo (absorve os 4 ex-hype + fluxos de energia do fluxosClientes)
//
// STATUS: adição pura. Nada importa este arquivo ainda — risco zero.
// =====================================================

import type { YladaFlow } from '@/types/ylada-flow'
import { FLUXOS_VENDAS_CORPO } from './blocos/corpo-metabolismo'

export { criarFluxoVendas, type VendasBloco, type VendasVariacao } from './fabrica-vendas'
export {
  BLOCO_CORPO_METABOLISMO,
  FLUXOS_VENDAS_CORPO,
  FLUXOS_VENDAS_CORPO_POR_ID,
} from './blocos/corpo-metabolismo'

/** Todos os fluxos de vendas migrados até aqui (cresce a cada bloco). */
export const FLUXOS_VENDAS: YladaFlow[] = [...FLUXOS_VENDAS_CORPO]

/** Lookup por flow_id (todos os blocos). */
export const FLUXOS_VENDAS_POR_ID: Record<string, YladaFlow> = Object.fromEntries(
  FLUXOS_VENDAS.map((f) => [f.id, f]),
)
