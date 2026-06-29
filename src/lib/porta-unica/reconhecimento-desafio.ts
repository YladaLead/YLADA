/**
 * Reconhecimento PÓS-cadastro do desafio: a casca lê o `ylada_desafio` e devolve
 * UMA linha de superfície que reconhece o que a pessoa já disse, sem re-perguntar.
 * É só a ponte pro Noel — o diagnóstico de verdade (toque "b", condução §9.3 /
 * Espelho) acontece DENTRO do Noel, não aqui. Sem I/O — testável em
 * `reconhecimento-desafio.casos.ts`.
 * @see blueprint-plataforma/Noel_Completo_Metodo_e_Conducao.md §9.3 (Fase 2, r88)
 */
import type { DesafioKey, DesafioResposta } from './desafio'

/** Aberturas em 2ª pessoa (superfície, não diagnóstico). 'outro' troca pelo texto. */
const RECONHECIMENTO_BASE: Readonly<Record<DesafioKey, string>> = {
  atrair: 'Você quer atrair mais gente que precisa de você.',
  vender: 'Você quer vender mais.',
  equipe: 'Você quer a sua equipe mais produtiva.',
  outro: 'Você me contou o que quer melhorar.',
}

/** Quando a porta não deixou desafio (entrada por outra via): acolhe e segue. */
export const RECONHECIMENTO_SEM_DESAFIO = 'Que bom ter você aqui. Vamos começar.'

/** A linha que o Noel direto mostra reconhecendo o desafio capturado pela porta. */
export function reconhecimentoDoDesafio(resposta: DesafioResposta | null): string {
  if (!resposta) return RECONHECIMENTO_SEM_DESAFIO
  if (resposta.key === 'outro' && resposta.texto) {
    return `Você me disse: “${resposta.texto}”.`
  }
  return RECONHECIMENTO_BASE[resposta.key]
}
