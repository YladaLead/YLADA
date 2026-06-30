/**
 * Passo 4 da Fase 2 (porta → Noel direto): fechar o GAP do link de mentira.
 *
 * A condução (`abertura-noel-desafio.ts`) deixa a CONVERSA sob medida, mas o LINK
 * final hoje é alucinado pela IA (URL inventada → 404), porque o gatilho de geração
 * do route (`isIntencaoCriarLink`) NÃO casa com as frases de aprovação ("ficou ótimo",
 * "pode gerar") nem com o WhatsApp que a pessoa passa. Estas duas funções puras
 * (sem I/O, sem IA — testáveis em `conducao-geracao.casos.ts`) dão ao route:
 *   1. `deveGerarNaConducao` — detecta o MOMENTO de gerar (aprovação + WhatsApp, na
 *      ordem do few-shot: rascunho → aprova → WhatsApp → gera). Não gera cedo demais.
 *   2. `construirTextoInterpretConducao` — costura o `text` do `/api/ylada/interpret`
 *      com o desafio + as respostas de nicho/foco/objetivo da conversa, pra o
 *      diagnóstico sair SOB MEDIDA (o interpret é cego à conversa: só recebe `text`).
 *
 * ⚠️ Tudo consumido pelo route SÓ atrás da flag `NEXT_PUBLIC_NOEL_DESAFIO_CONDUCAO_ENABLED`
 * e quando há um `desafio` válido em jogo (fluxo da porta). Flag OFF = byte-idêntico.
 * @see blueprint-plataforma/Porta_Unica_Fase2_Piloto_Ajustes_Checklist.md (Passo 4)
 */
import type { DesafioResposta } from './desafio'

type Turno = { role: string; content: string }

/** Conta dígitos de um texto — heurística honesta de "veio um número de WhatsApp". */
function contarDigitos(texto: string): number {
  return (texto.match(/\d/g) ?? []).length
}

/** A mensagem traz um número de telefone (>=10 dígitos = DDD + número, com ou sem DDI). */
function pareceNumeroDeContato(mensagem: string): boolean {
  return contarDigitos(mensagem) >= 10
}

/** Última fala do assistente (Noel), em minúsculas. Vazio se não houver. */
function ultimaFalaDoNoel(historico: readonly Turno[]): string {
  for (let i = historico.length - 1; i >= 0; i -= 1) {
    if (historico[i]?.role === 'assistant') return (historico[i].content ?? '').toLowerCase()
  }
  return ''
}

/** O Noel pediu o WhatsApp na última fala (item 3 / few-shot: WhatsApp na ação). */
function noelPediuWhatsapp(falaDoNoel: string): boolean {
  return /whats|\bddd\b|pra onde caem|onde caem os contatos|seu n[úu]mero|me passa.*(n[úu]mero|contato)/i.test(
    falaDoNoel
  )
}

/** O Noel mostrou o rascunho do diagnóstico OU pediu aprovação na última fala. */
function noelMostrouRascunhoOuPediuAprovacao(falaDoNoel: string): boolean {
  const temAlternativas = /(^|\n)\s*[a-d]\)\s/i.test(falaDoNoel) || /\*\*\d+\.\s/.test(falaDoNoel)
  const pediuAprovacao =
    /ficou bom assim|quer ajustar|ajustar alguma pergunta|ficou bom\b|posso gerar|gero (o |seu )?link|aprova\b/i.test(
      falaDoNoel
    )
  return temAlternativas || pediuAprovacao
}

/** A pessoa deu um "pode seguir" / aprovou o rascunho. */
export function mensagemEhAprovacao(mensagem: string): boolean {
  const m = (mensagem ?? '').toLowerCase().trim()
  if (!m) return false
  return /^(sim\b|isso\b|perfeito|[óo]timo|show\b|fechou|aprovad|adorei|gostei|exato|isso mesmo|pode (gerar|ser|mandar|criar|sim)|gera\b|gerar\b|manda\b|bora\b|t[áa] (bom|[óo]timo)|ok\b|ficou (bom|[óo]timo|perfeito))/.test(
    m
  )
}

/**
 * É o momento de o SISTEMA gerar o link real, dentro do fluxo de condução? (Decisão do
 * Andre: "na aprovação + WhatsApp".) Exige que o Noel TENHA chegado ao fim da condução
 * (mostrou rascunho / pediu aprovação ou WhatsApp) E que a pessoa esteja avançando
 * (aprovou ou passou o número). Evita gerar cedo demais (antes de ler nicho/foco).
 */
export function deveGerarNaConducao(args: {
  message: string
  conversationHistory?: readonly Turno[]
}): boolean {
  const historico = Array.isArray(args.conversationHistory) ? args.conversationHistory : []
  if (historico.length === 0) return false
  const falaDoNoel = ultimaFalaDoNoel(historico)
  if (!falaDoNoel) return false
  const passouNumero = pareceNumeroDeContato(args.message)
  const aprovou = mensagemEhAprovacao(args.message)

  // Caminho principal: o Noel pediu o WhatsApp e a pessoa mandou o número.
  if (noelPediuWhatsapp(falaDoNoel) && passouNumero) return true
  // Caminho do usuário com WhatsApp já no perfil: aprovou o rascunho que o Noel mostrou.
  if (noelMostrouRascunhoOuPediuAprovacao(falaDoNoel) && (aprovou || passouNumero)) return true
  return false
}

/**
 * Na condução o link é COMPARTILHADO com o cliente. O `checklist_prontidao` gera uma NOTA
 * (ex.: "100/100") + texto-template genérico, que não faz sentido pra quem recebe (Spec §12:
 * em share link, evitar checklist). Força um diagnóstico de bloqueio de verdade (sem score,
 * conteúdo específico). Os outros flows passam intactos.
 */
export function corrigirFlowDaConducao(flowId: string): string {
  return flowId === 'checklist_prontidao' ? 'diagnostico_bloqueio' : flowId
}

/** Objetivo declarado em 1ª pessoa, pra costurar no texto do interpret (não o rótulo 3ª pessoa). */
const OBJETIVO_PRIMEIRA_PESSOA: Readonly<Record<DesafioResposta['key'], string>> = {
  atrair: 'atrair mais clientes que precisam do meu trabalho',
  vender: 'vender mais (produtos ou serviços)',
  equipe: 'deixar minha equipe mais produtiva',
  outro: 'resolver o que me trouxe aqui',
}

const STARTERS_GENERICOS: ReadonlySet<string> = new Set([
  'oi', 'olá', 'ola', 'vamos', 'vamos la', 'vamos lá', 'bora', 'sim', 'ok', 'quero',
  'começar', 'comecar', 'pode ser', 'pode', 'faz', 'show',
])

/** Resposta da pessoa que CARREGA sinal de nicho/foco/público (não é aprovação, número, nem starter). */
function ehRespostaSubstantiva(conteudo: string): boolean {
  const c = conteudo.trim()
  if (c.length < 3) return false
  if (pareceNumeroDeContato(c)) return false
  if (STARTERS_GENERICOS.has(c.toLowerCase())) return false
  if (mensagemEhAprovacao(c) && c.length <= 24) return false
  return true
}

/**
 * Texto enriquecido pro `/api/ylada/interpret`: nicho/foco da condução + a MOLDURA DE AUDIÊNCIA.
 * Crítico: o link gerado é COMPARTILHADO, então as perguntas têm que falar do ponto de vista de
 * QUEM RESPONDE (o cliente; ou, no desafio equipe, o membro do time), NUNCA do negócio/vendas do
 * dono. Sem isto, "vender mais"/"colher indicações" gera um autodiagnóstico do dono (a cliente
 * recebia "minhas vendas estão baixas?"). O objetivo do dono entra só como nota interna, fora das
 * perguntas. Deixa o interpret montar o diagnóstico sob medida, virado pro cliente.
 */
export function construirTextoInterpretConducao(args: {
  desafio: DesafioResposta
  conversationHistory?: readonly Turno[]
}): string {
  const objetivo =
    args.desafio.key === 'outro' && args.desafio.texto
      ? args.desafio.texto.trim()
      : OBJETIVO_PRIMEIRA_PESSOA[args.desafio.key]
  const historico = Array.isArray(args.conversationHistory) ? args.conversationHistory : []
  const respostas = historico
    .filter((t) => t.role === 'user')
    .map((t) => (t.content ?? '').trim())
    .filter(ehRespostaSubstantiva)
  const corpo = respostas.join('. ')
  const sobre = corpo ? ` Meu nicho e o que eu faço: ${corpo}.` : ''
  const notaObjetivo = ` (Objetivo interno meu, que NÃO deve aparecer nas perguntas: ${objetivo}.)`

  if (args.desafio.key === 'equipe') {
    return (
      'Quero um diagnóstico para COMPARTILHAR com a minha equipe (cada vendedor ou membro do time), ' +
      'pra cada um refletir sobre as PRÓPRIAS dificuldades e voltar a agir. ' +
      'As perguntas devem ser do ponto de vista de QUEM RESPONDE (o vendedor/membro: o que trava ELE), ' +
      'NUNCA do ponto de vista do líder nem sobre "a minha equipe".' +
      sobre +
      notaObjetivo
    )
  }
  return (
    'Quero um diagnóstico para COMPARTILHAR com os meus clientes e atrair quem precisa do que eu ofereço. ' +
    'As perguntas devem ser do ponto de vista do CLIENTE (a dor, o incômodo e o desejo DELE), ' +
    'NUNCA sobre o meu negócio, as minhas vendas ou a minha estratégia.' +
    sobre +
    notaObjetivo
  )
}

/* ============================================================================
 * #2 — LINK = RASCUNHO APROVADO
 * O Noel mostra um rascunho (numerado + A/B/C/D) e a pessoa aprova; mas a geração
 * monta OUTRO diagnóstico (às vezes pior/fora do tema). Aqui a gente lê o rascunho
 * que ele mostrou e usa ELE como as perguntas do link. Tudo puro, com FALLBACK SEGURO:
 * se não parsear ≥3 perguntas MCQ limpas, devolve null e o route cai no fluxo de hoje.
 * ========================================================================== */

export type PerguntaQuiz = { id: string; label: string; type: 'single'; options: string[] }

/** Início de pergunta: "1. ...", "  * 2. ..." etc. Captura o resto da linha. */
const RE_INICIO_PERGUNTA = /^\s*\*?\s*\d+\.\s+(.+\S)\s*$/
/** Linha que é uma opção: "A) ...", "* B) ...", "   - C) ...". */
const RE_LINHA_OPCAO = /^\s*[*•-]?\s*[A-D]\)\s*\S/

/** Extrai as opções A)/B)/C)/D) de um trecho (inline ou multi-linha já juntado). */
function extrairOpcoesDoTrecho(trecho: string): string[] {
  const limpo = trecho.replace(/[*•]/g, ' ').replace(/\s+/g, ' ').trim()
  const out: string[] = []
  const re = /([A-D])\)\s*(.+?)(?=\s+[A-D]\)|$)/g
  let m: RegExpExecArray | null
  while ((m = re.exec(limpo)) !== null) {
    const txt = m[2].trim()
    if (txt.length >= 1 && txt.length <= 120) out.push(txt)
  }
  return out
}

/**
 * Lê um rascunho de diagnóstico (texto do Noel) e devolve as perguntas MCQ. Aceita os
 * formatos vistos no lab: opções inline na mesma linha da pergunta OU em linhas/bullets
 * abaixo. Linhas que não são pergunta nem opção (título, "Ficou bom assim?") são ignoradas.
 * Devolve null se não achar ≥3 perguntas com ≥3 opções (sinal pra cair no fallback).
 */
export function extrairPerguntasDoRascunho(texto: string): PerguntaQuiz[] | null {
  if (!texto || typeof texto !== 'string') return null
  type Bruta = { resto: string; opcoesLinhas: string[] }
  const brutas: Bruta[] = []
  for (const linha of texto.split('\n')) {
    const mp = RE_INICIO_PERGUNTA.exec(linha)
    if (mp) {
      brutas.push({ resto: mp[1], opcoesLinhas: [] })
      continue
    }
    if (brutas.length > 0 && RE_LINHA_OPCAO.test(linha)) {
      brutas[brutas.length - 1].opcoesLinhas.push(linha)
    }
  }
  const perguntas: PerguntaQuiz[] = []
  for (const b of brutas) {
    const full = [b.resto, ...b.opcoesLinhas].join(' ')
    const idxA = full.search(/\bA\)/)
    const label = (idxA >= 0 ? full.slice(0, idxA) : full)
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/[\s*•\-–]+$/, '') // tira bullet/asterisco que sobra antes do "A)"
      .trim()
    const options = idxA >= 0 ? extrairOpcoesDoTrecho(full.slice(idxA)) : []
    if (label.length < 6 || options.length < 3) continue
    const quatro = options.slice(0, 4)
    while (quatro.length < 4) quatro.push('Outro')
    perguntas.push({ id: `q${perguntas.length + 1}`, label, type: 'single', options: quatro })
  }
  return perguntas.length >= 3 ? perguntas : null
}

/** Acha o rascunho mais recente que o Noel mostrou no histórico e devolve as perguntas (ou null). */
export function perguntasDoUltimoRascunho(history?: readonly Turno[]): PerguntaQuiz[] | null {
  const h = Array.isArray(history) ? history : []
  for (let i = h.length - 1; i >= 0; i -= 1) {
    if (h[i]?.role !== 'assistant') continue
    const p = extrairPerguntasDoRascunho(h[i].content ?? '')
    if (p) return p
  }
  return null
}
