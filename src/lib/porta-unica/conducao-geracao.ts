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
 * Texto enriquecido pro `/api/ylada/interpret`: objetivo declarado na porta + tudo que a
 * pessoa contou na condução (nicho, foco/carro-chefe, público). Deixa o interpret extrair
 * tema/área da fala REAL dela, em vez do "pode gerar" cru — diagnóstico sob medida.
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
  return corpo
    ? `Quero ${objetivo}. Sobre o que eu faço e quem eu quero atingir: ${corpo}`
    : `Quero ${objetivo}.`
}
