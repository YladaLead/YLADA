/**
 * Toque "b" da Fase 2: o Noel da home LÊ o `ylada_desafio` capturado pela porta e
 * CONDUZ a partir dele — reconhece o que a pessoa já disse (NÃO re-pergunta) e
 * começa a leitura do dono (diagnóstico do dono §5 / base Espelho, Chat 7). Duas
 * peças puras (sem I/O, sem IA — lookup determinístico, testável em
 * `abertura-noel-desafio.casos.ts`):
 *   1. `aberturaNoelDoDesafio` — a 1ª mensagem do Noel na home (cliente).
 *   2. `construirBlocoDesafioParaPrompt` — o bloco [DESAFIO DECLARADO] que condiciona
 *      o system prompt do `/api/ylada/noel` (servidor) a conduzir a partir do desafio.
 *
 * ⚠️ Copy do MÉTODO (1º corte, lane do Noel) — ajustar pela voz/condução §9.3, não pela casca.
 * Sem travessão de aparte (GUIA_DE_VOZ). Voz simples, "você", reconhece + convida.
 * @see blueprint-plataforma/Noel_Completo_Metodo_e_Conducao.md §9.3 (Fase 2 toque "b", r88)
 */
import { isDesafioKey, type DesafioKey, type DesafioResposta } from './desafio'

/**
 * RECEPÇÃO de 1º acesso (iniciante TOTAL), por chave do desafio. Estrutura igual nas
 * 4 chaves: acolhe + diz quem é o Noel + 1 frase do que vai rolar + convite a começar
 * pelo primeiro passo ("eu te guio"). NÃO joga chips secos nem re-pergunta o desafio.
 * A leitura do dono (o "primeiro passo") vem na PRÓXIMA troca, conduzida pelo bloco
 * `[DESAFIO DECLARADO]` do prompt. O 'outro' costura o texto da pessoa.
 */
const ABERTURA_POR_KEY: Readonly<Record<DesafioKey, string>> = {
  atrair:
    'Oi, eu sou o Noel. Vou te ajudar a atrair mais gente que precisa de você. A gente faz isso montando juntos uma ferramenta simples que faz a pessoa certa te procurar. Pode ser do seu jeito, no seu tempo. Bora começar pelo primeiro passo? Eu te guio.',
  vender:
    'Oi, eu sou o Noel. Vou te ajudar a vender mais, sem empurrar. A gente vai montar juntos um jeito da pessoa chegar já querendo. Eu te mostro cada passo, é tranquilo. Começamos?',
  equipe:
    'Oi, eu sou o Noel. Vou te ajudar a fazer sua equipe agir mais. A gente vai montar juntos um caminho claro pra cada um saber o que fazer. Eu te guio passo a passo. Bora começar?',
  outro:
    'Oi, eu sou o Noel. Você me contou que tem algo pra melhorar. A gente vai achar a raiz disso juntos e montar um primeiro passo simples. Eu te guio, sem pressa. Começamos?',
}

/**
 * Normaliza o `desafio` que chega do body do request (JSON não-confiável) numa
 * `DesafioResposta` válida ou null. Mesmo contrato do `readDesafio()` do cliente,
 * mas pra o servidor — não confia no formato cru.
 */
export function normalizarDesafioRecebido(input: unknown): DesafioResposta | null {
  if (!input || typeof input !== 'object') return null
  const obj = input as { key?: unknown; texto?: unknown }
  if (!isDesafioKey(obj.key)) return null
  return { key: obj.key, texto: typeof obj.texto === 'string' ? obj.texto : null }
}

/** A abertura do Noel pra essa resposta. Sem resposta válida devolve string vazia. */
export function aberturaNoelDoDesafio(resposta: DesafioResposta | null): string {
  if (!resposta || !isDesafioKey(resposta.key)) return ''
  if (resposta.key === 'outro' && resposta.texto) {
    return `Oi, eu sou o Noel. Você me disse que quer melhorar “${resposta.texto}”. A gente vai achar a raiz disso juntos e montar um primeiro passo simples. Eu te guio, sem pressa. Começamos?`
  }
  return ABERTURA_POR_KEY[resposta.key]
}

/** Rótulo curto do desafio pra o bloco do prompt (3ª pessoa, descreve o que a pessoa quer). */
const ROTULO_POR_KEY: Readonly<Record<DesafioKey, string>> = {
  atrair: 'atrair mais gente que precisa dele',
  vender: 'vender mais (produtos ou serviços)',
  equipe: 'deixar a equipe mais produtiva',
  outro: 'algo que ele quer melhorar',
}

function rotuloDoDesafio(resposta: DesafioResposta): string {
  if (resposta.key === 'outro' && resposta.texto) return resposta.texto
  return ROTULO_POR_KEY[resposta.key]
}

/**
 * Bloco [DESAFIO DECLARADO] pro system prompt do Noel: faz o Noel conduzir a partir
 * do desafio (reconhece, não re-pergunta, aprofunda a CAUSA/o GAP, serve antes de
 * oferecer). Base no diagnóstico do dono (§5) / Espelho (Chat 7). String vazia se
 * a resposta for inválida (chamador não injeta nada).
 */
export function construirBlocoDesafioParaPrompt(resposta: DesafioResposta | null): string {
  if (!resposta || !isDesafioKey(resposta.key)) return ''
  const rotulo = rotuloDoDesafio(resposta)
  return (
    '\n[DESAFIO DECLARADO PELO PROFISSIONAL — porta de entrada]\n' +
    `Logo antes de entrar, o profissional disse o que quer melhorar: "${rotulo}".\n` +
    'Conduza A PARTIR disso: reconheça (NÃO re-pergunte o desafio), aprofunde o caso concreto e a CAUSA dele (o GAP), servindo antes de oferecer. ' +
    'Comece lendo a situação dele (diagnóstico do dono), uma pergunta por vez, linguagem simples e sem travessão. Não despeje solução nem link na abertura.'
  )
}
