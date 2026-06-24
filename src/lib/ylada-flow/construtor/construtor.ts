// =====================================================
// CONSTRUTOR DE FLUXOS — VALIDAÇÃO (Chat 8, tijolo 3)
// =====================================================
//
// Fonte: Spec_Fundacao_Ylada_Grau1.md §3/§6/§12.2 + Regua_Qualidade_Diagnosticos.md.
//
// O QUE É: o miolo do Construtor — pega um RASCUNHO de YladaFlow e diz se ele PODE
// virar fluxo, juntando os três portões da fundação:
//   1. PERMISSÃO (matriz §6) — quem pede tem direito de criar?
//   2. FÓRMULA VALIDADA (§12.2) — calculadora só com formulaId da base; a IA NÃO
//      inventa fórmula. Puxa de `bibliotecas/formulas` (YLADA_FLOW_FORMULAS).
//   3. QUALIDADE (a Régua, tijolos 1-2) — roda o revisor; fluxo que REPROVA não entra;
//      MORNO entra como rascunho que precisa afiar antes de publicar (curadoria, §8).
//
// O QUE NÃO FAZ (de propósito): não persiste em banco, não chama LLM. É validação pura
// e determinística. A criação real (gravar + publicar) é passo posterior, atrás de flag,
// com curadoria humana. Inerte: nada importa este módulo ainda.
// =====================================================

import type { YladaFlow } from '@/types/ylada-flow'
import { avaliarFluxo, type LaudoFluxo } from '@/lib/ylada-flow/revisor'
import { YLADA_FLOW_FORMULAS } from '@/lib/ylada-flow/bibliotecas/formulas'
import { podeCriarFluxo, type ContextoPermissao } from './permissoes'

/** IDs de fórmula que o Construtor aceita (a base validada — nunca inventar). */
export function formulaIdsDisponiveis(): string[] {
  return Object.keys(YLADA_FLOW_FORMULAS)
}

export interface ResultadoConstrucao {
  /** pode virar fluxo agora? (permissão ok + fórmula ok + não reprova). */
  ok: boolean
  /** precisa de afiar/curadoria antes de publicar? (ok porém morno). */
  precisaAfiar: boolean
  /** o que impede (permissão, fórmula inválida, reprova da régua). */
  bloqueios: string[]
  /** laudo da régua (tijolos 1-2). */
  laudo: LaudoFluxo
}

/**
 * Valida um rascunho de fluxo nos três portões. Determinístico, sem DB, sem LLM.
 */
export function validarConstrucao(
  rascunho: YladaFlow,
  ctx: ContextoPermissao,
): ResultadoConstrucao {
  const bloqueios: string[] = []

  // Portão 1 — permissão (matriz §6).
  const perm = podeCriarFluxo(ctx)
  if (!perm.pode) bloqueios.push(`permissão: ${perm.motivo}`)

  // Portão 2 — fórmula validada (§12.2): calculadora só com formulaId da base.
  if (rascunho.dimensoes.tipo === 'calculadora') {
    const formulaId = rascunho.calculadora?.formulaId
    if (!formulaId) {
      bloqueios.push('fórmula: calculadora sem formulaId (a IA não inventa fórmula — §12.2).')
    } else if (!(formulaId in YLADA_FLOW_FORMULAS)) {
      bloqueios.push(
        `fórmula: "${formulaId}" não está na base validada (${formulaIdsDisponiveis().join(', ')}) — §12.2.`,
      )
    }
  }

  // Portão 3 — qualidade (a Régua). Reprova bloqueia; morno é rascunho a afiar.
  const laudo = avaliarFluxo(rascunho)
  if (laudo.veredito === 'reprova') {
    const partes = laudo.porParte
      .filter((p) => p.veredito === 'reprova')
      .map((p) => p.parte)
      .join(', ')
    bloqueios.push(`qualidade: a régua REPROVA (${partes}) — corrigir antes de criar.`)
  }

  const ok = bloqueios.length === 0
  return {
    ok,
    precisaAfiar: ok && laudo.veredito === 'morno',
    bloqueios,
    laudo,
  }
}
