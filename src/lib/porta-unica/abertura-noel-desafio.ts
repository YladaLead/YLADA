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
 * Abertura do Noel na home, por chave do desafio: reconhece (sem re-perguntar) e
 * abre a leitura do dono pedindo o caso concreto. O 'outro' costura o texto da pessoa.
 */
const ABERTURA_POR_KEY: Readonly<Record<DesafioKey, string>> = {
  atrair:
    'Você quer atrair mais gente que precisa de você. Pra eu te ajudar com o que é o seu caso, me conta como é hoje: o que você já faz pra essas pessoas te acharem, e onde costuma travar?',
  vender:
    'Você quer vender mais, produtos ou serviços. Então me conta como é hoje: quando alguém chega interessado, como costuma ser essa conversa até virar (ou não) uma venda? Quero entender o seu caso antes de sugerir qualquer coisa.',
  equipe:
    'Você quer a sua equipe mais produtiva. Pra eu te ajudar de verdade, me conta um pouco dela: hoje, o que o seu time faz bem e onde você sente que empaca? Pode falar do seu jeito.',
  outro:
    'Você me contou que tem algo pra melhorar. Me conta com as suas palavras o que mais te incomoda hoje, que a gente acha a raiz e resolve junto.',
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
    return `Você me disse: “${resposta.texto}”. Boa, é por aí que a gente começa. Me conta um pouco mais de como isso aparece no seu dia a dia, pra eu entender a raiz antes de sugerir um caminho.`
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
