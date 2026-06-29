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
import type { Finalidade } from '@/types/ylada-flow'

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
// adicione o(s) segmento(s) correspondente(s) aqui.
//
// ⭐ ACHADO (24/06/2026): a ÁREA Pró-Líderes NÃO envia para `/api/ylada/noel` — ela usa
// rotas próprias (`/api/pro-lideres/noel` líder e `/api/pro-lideres/membro/noel` campo),
// que não passam por este wiring. Logo as chaves 'pro-lideres'/'prolideres' aqui são
// inertes nesta rota (nenhum request a `/api/ylada/noel` carrega esse segment —
// `validSegment` é restrito a YLADA_SEGMENT_CODES). Mantidas por segurança/documentação.
// Os segmentos VIVOS nesta rota que casam com a biblioteca curada (conteúdo de bem-estar:
// energia, corpo/metabolismo, hidratação, recrutamento) são `coach-bem-estar` (Coach de
// bem-estar) e `nutra` (Nutra). Decisão do Andre (24/06): ligar `coach-bem-estar`.
// A audiência REAL Pró-Líderes (membro de campo) recebe o advisory pela rota dela —
// ver `construirCriterioMembro` / `buildRecomendacaoCuradaBlockMembro` abaixo.
const SEGMENT_PARA_NICHO_CURADO: Record<string, string> = {
  'pro-lideres': 'pro-lideres',
  prolideres: 'pro-lideres',
  'coach-bem-estar': 'pro-lideres', // Coach de bem-estar — segmento vivo em /api/ylada/noel (Andre 24/06)
  // 'nutra': 'pro-lideres', // candidato (Nutra); ligar quando quiser estender o piloto
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

// =====================================================
// 5. WIRING DO MEMBRO (Noel de campo) — advisory na rota /api/pro-lideres/membro/noel
// =====================================================
//
// POR QUE SEPARADO do bloco geral acima: o Noel do membro vive numa rota PRÓPRIA
// (`/api/pro-lideres/membro/noel`), não em `/api/ylada/noel`. Diferenças que mudam o
// critério e o texto do advisory:
//  - O membro é SEMPRE da audiência Pró-Líderes → nicho fixo 'pro-lideres' (não há
//    mapa de segmento; o membro não escolhe nicho).
//  - O que ele faz no turno vem de `route.audience` (cliente / oportunidade / captação),
//    e isso afia a finalidade melhor do que o viés por papel.
//  - REGRA DURA da rota do membro: "indica só links de Meus links; nunca inventa URL".
//    Então o advisory do membro NÃO cita o fluxo como "link pronto" — cita o TIPO de
//    diagnóstico que cabe e manda procurar o correspondente em Meus links.

/** Audiência detectada pelo roteador do Noel do membro (pro-lideres-member-noel-router). */
export type AudienciaMembro = 'cliente' | 'captacao' | 'oportunidade' | 'ambiguo'

export interface ContextoMembroParaRecomendacao {
  message: string
  audience: AudienciaMembro
}

/**
 * Finalidade preferida pelo que o membro está fazendo AGORA. Só fixa quando há sinal
 * forte (oportunidade = convite = recrutamento); cliente/captação/ambíguo deixam a
 * intenção (palavras da mensagem) rankear entre vendas/serviço/recrutamento.
 */
function finalidadePorAudienciaMembro(a: AudienciaMembro): Finalidade | undefined {
  return a === 'oportunidade' ? 'recrutamento' : undefined
}

/** Monta o critério do membro — nicho fixo 'pro-lideres', finalidade pela audiência. */
export function construirCriterioMembro(
  ctx: ContextoMembroParaRecomendacao,
): CriterioRecomendacao {
  return {
    nicho: 'pro-lideres',
    finalidade: finalidadePorAudienciaMembro(ctx.audience),
    intencao: ctx.message,
    limite: 1,
  }
}

/**
 * Bloco advisory para o system prompt do Noel do MEMBRO. Cita o TIPO de fluxo que cabe
 * (referência/inspiração), defere o link a "Meus links" e NUNCA fabrica URL — respeita a
 * regra dura da rota do membro.
 */
export function buildRecomendacaoCuradaBlockMembro(rec: RecomendacaoFluxo): string {
  const f = rec.fluxo
  return (
    '\n[BIBLIOTECA CURADA — REFERÊNCIA (advisory, não é link)]\n' +
    `Para este pedido, o tipo de diagnóstico pronto que melhor cabe é "${f.nome}".\n` +
    `Por quê: ${explicarRecomendacao(rec)}\n` +
    'Como usar: você PODE sugerir esse TIPO de fluxo como caminho. Mas o link de verdade ' +
    'vem só de **Meus links** (seus links no painel, cada um com URL sua) — aponte o membro para o link ' +
    'correspondente lá. NÃO invente URL, NÃO diga "clique aqui", NÃO cite um link que não ' +
    'esteja em Meus links. A referência é só para orientar a escolha.'
  )
}
