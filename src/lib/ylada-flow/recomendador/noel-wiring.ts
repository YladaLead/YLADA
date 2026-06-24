// =====================================================
// WIRING DO RECOMENDADOR NA ROTA DO NOEL — advisory (Chat 8, pré-passo)
// =====================================================
//
// O QUE É: a ponte fina entre o Recomendador da Biblioteca (Chat 7, lookup
// determinístico) e a rota do Noel (`/api/ylada/noel/route.ts`). Realiza a regra
// de ouro da Spec §7.1 ("Biblioteca > geração") no modo ADVISORY: no modo_link,
// ANTES da geração por LLM (/api/ylada/interpret), consulta a biblioteca curada;
// quando há um fluxo que casa, injeta um bloco de contexto para o Noel CITAR a
// recomendação. A geração de hoje SEGUE entregando o link clicável — o advisory
// não substitui nem mina a entrega (decisão A do Chat 8).
//
// POR QUE ADVISORY PRIMEIRO (não substituir a geração ainda):
//  - O Recomendador devolve um `YladaFlow` curado (id tipo `barriga-pesada`), NÃO
//    uma URL. Mintar a URL de um fluxo curado exige o /api/ylada/links/generate
//    aceitar flow_ids curados (território do render-nativo) — passo MAIOR (fase 2).
//  - Régua: nunca inventar URL. O advisory cita o fluxo curado sem fabricar link.
//  - Inerte com a flag OFF: comportamento da rota é byte-idêntico ao de hoje.
//
// PRESERVA (regra do route.ts): "conteúdo > link, exceto ferramenta explícita e
// ajuste de link". Este wiring NÃO decide modo — `classifyNoelResponseMode` não é
// tocado. Só é consultado DENTRO do modo_link, na geração de link novo.
//
// CUSTO: determinístico (o Recomendador é pontuação em código) — zero LLM, zero DB.
//
// STATUS: adição pura. A rota só o consulta atrás da flag NOEL_RECOMENDADOR_ENABLED
// (OFF por padrão). Com a flag OFF, nada deste módulo roda.
// =====================================================

import {
  recomendarMelhorFluxo,
  explicarRecomendacao,
  type CriterioRecomendacao,
  type RecomendacaoFluxo,
  type PapelProfissional,
} from '@/lib/ylada-flow/recomendador'

// -----------------------------------------------------
// 1. Flag (mesmo padrão de ylada-flow-native-pilot.ts: env === 'true' | '1').
// -----------------------------------------------------

/** Liga o advisory do Recomendador na rota do Noel. OFF por padrão (inerte). */
export function isNoelRecomendadorEnabled(): boolean {
  return (
    process.env.NOEL_RECOMENDADOR_ENABLED === 'true' ||
    process.env.NOEL_RECOMENDADOR_ENABLED === '1'
  )
}

// -----------------------------------------------------
// 2. Mapa segment → nicho da biblioteca (conservador, sob-disparo de propósito).
// -----------------------------------------------------
//
// A biblioteca MIGRADA hoje é MONONICHO: todos os 45 fluxos curados têm
// `nicho: 'pro-lideres'` (vendas/recrutamento/calculadoras). O Recomendador FILTRA
// FORA qualquer nicho explícito diferente. Logo, só faz sentido recomendar quando
// o segmento mapeia para um nicho que a biblioteca cobre.
//
// Decisão de risco: quando o segmento NÃO mapeia para um nicho curado, devolvemos
// `null` → a rota cai na geração de hoje (Spec §7.1: "[] → gera"). É melhor
// SUB-DISPARAR (não recomendar quando não há fluxo curado) do que vazar um fluxo
// pro-lideres para um nicho que não é o dele.
//
// ⚠️ EXTENSÃO (Andre): assim que a biblioteca ganhar outros nichos (estética, nutri…),
// adicione o(s) segmento(s) correspondente(s) aqui. E confirme qual `segment` a área
// Pró-Líderes envia para `/api/ylada/noel` — se não for um dos abaixo, o advisory não
// dispara para ela (sub-disparo seguro) até o segmento ser incluído.
const SEGMENT_PARA_NICHO_CURADO: Record<string, string> = {
  'pro-lideres': 'pro-lideres',
  prolideres: 'pro-lideres',
  // candidatos da família Pró-Líderes/bem-estar — CONFIRMAR o segment real antes de
  // confiar (ver aviso acima). Deixados comentados para não vazar por engano:
  // 'coach-bem-estar': 'pro-lideres',
  // 'nutra': 'pro-lideres',
}

function mapSegmentToNichoCurado(segment: string): string | null {
  return SEGMENT_PARA_NICHO_CURADO[segment.trim().toLowerCase()] ?? null
}

// -----------------------------------------------------
// 3. Construir o critério a partir do contexto do Noel.
// -----------------------------------------------------

export interface ContextoNoelParaRecomendacao {
  message: string
  segment: string
  /** do perfil empresarial (ylada_noel_profile). */
  profileType?: string
  profession?: string
}

/** Papel do profissional a partir do perfil. Conservador: default 'liberal'. */
function mapPapel(profileType?: string, profession?: string): PapelProfissional {
  const t = `${profileType ?? ''} ${profession ?? ''}`.toLowerCase()
  if (/(l[ií]der|lider|gestor|equipe|rede|distribu)/.test(t)) return 'lider'
  return 'liberal'
}

/**
 * Monta o critério do Recomendador. Devolve `null` quando o segmento não casa um
 * nicho curado — sinal pra rota NÃO recomendar e cair na geração de hoje.
 */
export function construirCriterioNoel(
  ctx: ContextoNoelParaRecomendacao,
): CriterioRecomendacao | null {
  const nicho = mapSegmentToNichoCurado(ctx.segment)
  if (!nicho) return null
  return {
    nicho,
    papel: mapPapel(ctx.profileType, ctx.profession),
    intencao: ctx.message,
    limite: 1,
  }
}

// -----------------------------------------------------
// 4. Recomendar (lookup) + montar o bloco advisory pro system prompt.
// -----------------------------------------------------

/** A melhor recomendação curada, ou null (→ rota gera como hoje). */
export function recomendarParaNoel(
  criterio: CriterioRecomendacao | null,
): RecomendacaoFluxo | null {
  if (!criterio) return null
  return recomendarMelhorFluxo(criterio)
}

/**
 * Bloco de contexto (advisory) para o system prompt. CITA o fluxo curado que casa;
 * NÃO fabrica URL nem manda substituir a geração. Linguagem alinhada à régua: o Noel
 * menciona a recomendação como opção pronta da biblioteca, sem inventar link.
 */
export function buildRecomendacaoCuradaBlock(rec: RecomendacaoFluxo): string {
  const f = rec.fluxo
  return (
    '\n[RECOMENDAÇÃO DA BIBLIOTECA — ADVISORY (lookup, não substitui a geração)]\n' +
    `A biblioteca curada do Ylada já tem um fluxo pronto que casa com o pedido: "${f.nome}".\n` +
    `Por quê: ${explicarRecomendacao(rec)}\n` +
    'Como usar: ao responder, você PODE mencionar de forma natural que existe esse fluxo pronto na ' +
    'biblioteca (mais afiado que um gerado na hora) como opção. NÃO invente URL nem diga "clique aqui" — ' +
    'o link só vem do bloco oficial do sistema. Se o sistema já gerou um link nesta resposta, entregue-o ' +
    'normalmente; a recomendação é só uma opção a mais, nunca um link fabricado.'
  )
}
