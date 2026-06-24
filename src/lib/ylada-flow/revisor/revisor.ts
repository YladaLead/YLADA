// =====================================================
// REVISOR EM ESCALA + PROPOR AFIADO (Chat 8, tijolo 2)
// =====================================================
//
// Fonte: Regua_Qualidade_Diagnosticos.md §7/§9 + Spec_Fundacao_Ylada_Grau1.md §8.
//
// O QUE É: roda a Régua (`avaliarFluxo`, tijolo 1) sobre MUITOS fluxos de uma vez,
// agrupa por veredito, e — pros que ficaram MORNO — monta o PROMPT que pede a versão
// afiada. É o "revisor que aplica a régua em escala" (Spec §9, Chats 8/9).
//
// DUAS CAMADAS, HONESTAS:
//  1. Triagem (DETERMINÍSTICA, barata): `revisarFluxos` pontua tudo, sem LLM. Diz O QUE
//     está morno e POR QUÊ (os motivos do laudo). Zero custo de modelo.
//  2. Afiar (LLM, CARO, OPCIONAL): `montarPromptAfiar` devolve só o TEXTO do prompt —
//     NÃO chama OpenAI aqui. Quem liga o modelo (mini) é um passo posterior, atrás de
//     flag, e a versão proposta SEMPRE passa por curadoria humana antes de virar
//     biblioteca (Spec §8). Assim o revisor não reescreve nada sozinho.
//
// STATUS: adição pura. Nada importa este módulo ainda — risco zero, inerte.
// =====================================================

import type { YladaFlow, BlocoDevolutiva } from '@/types/ylada-flow'
import { avaliarFluxo, type LaudoFluxo, type NotaParte, type Veredito } from './regua'

// -----------------------------------------------------
// 1. Triagem determinística sobre uma lista.
// -----------------------------------------------------

export interface RelatorioRevisao {
  total: number
  contagem: Record<Veredito, number>
  laudos: LaudoFluxo[]
  /** atalho: os que precisam ser afiados antes de migrar (Régua §7). */
  mornos: LaudoFluxo[]
  /** atalho: os que têm bloqueio (anti-vício/estrutura) — corrigir antes de tudo. */
  reprovados: LaudoFluxo[]
  /** os que migram como estão. */
  migraveis: LaudoFluxo[]
}

export function revisarFluxos(fluxos: YladaFlow[]): RelatorioRevisao {
  const laudos = fluxos.map(avaliarFluxo)
  const contagem: Record<Veredito, number> = { passa: 0, morno: 0, reprova: 0 }
  for (const l of laudos) contagem[l.veredito]++
  return {
    total: laudos.length,
    contagem,
    laudos,
    mornos: laudos.filter((l) => l.veredito === 'morno'),
    reprovados: laudos.filter((l) => l.veredito === 'reprova'),
    migraveis: laudos.filter((l) => l.migravel),
  }
}

/** As partes que não passaram (com motivos) — o "por quê" pro humano/curadoria. */
export function partesQueFalharam(laudo: LaudoFluxo): NotaParte[] {
  return laudo.porParte.filter((p) => p.veredito !== 'passa')
}

/** Resumo de uma linha por fluxo problemático (pra log/painel de curadoria). */
export function resumirPendencias(rel: RelatorioRevisao): string[] {
  return [...rel.reprovados, ...rel.mornos].map((l) => {
    const partes = partesQueFalharam(l)
      .map((p) => `${p.parte}:${p.veredito}`)
      .join(', ')
    return `${l.fluxoId} [${l.veredito}] → ${partes}`
  })
}

// -----------------------------------------------------
// 2. Propor afiado — SCAFFOLD do prompt (NÃO chama LLM).
// -----------------------------------------------------
//
// Devolve o texto do prompt que um LLM mini usaria pra reescrever SÓ as partes mornas,
// seguindo a Régua. A geração real (chamar o modelo) é um passo posterior, atrás de
// flag, com curadoria humana no fim. Aqui é determinístico: só monta a instrução.

const REGUA_RESUMO_AFIAR = `Você reescreve diagnósticos seguindo a Régua de Qualidade Ylada:
- Linguagem popular, frase curta, "você", concreto (cena, não conceito). Sem jargão (otimizar, jornada, mindset), sem travessão de aparte, sem cara de relatório.
- Devolutiva = espelho (a cena dela) → causa (que alivia a culpa) → consequência de ficar parado → 1º passo pequeno → CTA que puxa pra conversa com a pergunta na boca.
- Abertura: gancho sobre a PESSOA (o que ela descobre), fricção visível (sem cadastro · X perguntas · 2 min), uma autoridade sutil, 1 CTA.
- NUNCA: promessa de renda/resultado, diagnóstico médico, pressão, número inventado.
- Mantenha o sentido e a medição; afie só o TOM e a clareza. Não invente fatos.`

function blocoParaTexto(perfil: string, b: BlocoDevolutiva): string {
  return [
    `  [${perfil}]`,
    `   espelho: ${b.espelho}`,
    `   causa: ${b.causa}`,
    `   1º passo: ${b.primeiroPasso}`,
    `   CTA: ${b.ctaWhatsApp}`,
  ].join('\n')
}

/**
 * Monta o prompt pra um LLM propor a versão afiada das partes mornas de UM fluxo.
 * Não chama modelo — devolve o texto. O afiado proposto vai pra curadoria humana.
 */
export function montarPromptAfiar(fluxo: YladaFlow, laudo: LaudoFluxo): string {
  const partes = partesQueFalharam(laudo)
  if (partes.length === 0) return '' // nada a afiar

  const diagnostico = partes
    .map((p) => {
      const motivos = p.motivos.length ? p.motivos.join(' ') : '(tom — ver pontos abaixo)'
      const revisar = p.precisaRevisaoHumana.length ? `\n   a conferir: ${p.precisaRevisaoHumana.join(' ')}` : ''
      return `- ${p.parte} (${p.veredito}): ${motivos}${revisar}`
    })
    .join('\n')

  const aberturaAtual = [
    `  gancho: ${fluxo.abertura.gancho}`,
    `  fricção: ${fluxo.abertura.baixaFriccao}`,
    `  autoridade: ${fluxo.abertura.autoridadeSutil ?? '(vazio)'}`,
    `  CTA: ${fluxo.abertura.ctaUnico}`,
  ].join('\n')

  const devolutivaAtual = Object.entries(fluxo.devolutiva.porPerfil)
    .map(([perfil, b]) => blocoParaTexto(perfil, b))
    .join('\n')

  return [
    REGUA_RESUMO_AFIAR,
    '',
    `FLUXO: ${fluxo.nome} (id: ${fluxo.id}, finalidade: ${fluxo.dimensoes.finalidade}, nicho: ${fluxo.dimensoes.nicho}).`,
    '',
    'ONDE A RÉGUA APONTOU MORNO/REPROVA:',
    diagnostico,
    '',
    'ABERTURA ATUAL:',
    aberturaAtual,
    '',
    'DEVOLUTIVA ATUAL (por perfil):',
    devolutivaAtual,
    '',
    'TAREFA: reescreva SÓ as partes apontadas acima, mantendo o sentido e a medição. Devolva os mesmos campos, afiados pela Régua. Não toque no que já está bom.',
  ].join('\n')
}
