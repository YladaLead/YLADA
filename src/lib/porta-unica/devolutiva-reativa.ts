/**
 * Devolutiva reativa PRÉ-cadastro (toque "a" da Fase 2): reage à escolha do
 * desafio com 1-2 linhas, paga o "Descubra como", planta o "não é o que você
 * acha" e fecha no CTA de cadastro. NÃO é o diagnóstico pesado (esse é o toque
 * "b", pós-cadastro, no Noel/Espelho). Copy TRAVADA pelo método (r91) — lookup
 * determinístico, sem IA. Sem I/O: testável em `devolutiva-reativa.casos.ts`.
 * @see blueprint-plataforma/Noel_Completo_Metodo_e_Conducao.md §9.3 (r89→r90→r91)
 */
import type { DesafioKey } from './desafio'

/**
 * Copy exata da r91 (uma por chave). Não editar sem o chat do método.
 * r91 ENXUGA a r90 (Andre achou "tumultuada", 4 frases): mantém só o REFRAME
 * ("não é aparecer/empurrar mais…") + o fecho colaborativo "Vamos começar?".
 * Corta a frase do meio ("a gente monta isso junto") — esse convite vira o
 * botão/sub-linha, não o texto. Nunca "cadastra que eu te mostro".
 */
const DEVOLUTIVA_REATIVA: Readonly<Record<DesafioKey, string>> = {
  atrair:
    'Atrair mais gente quase nunca é aparecer mais. É fazer a pergunta certa pra a pessoa certa te procurar. Vamos começar?',
  vender:
    'Vender mais não é empurrar mais. É a pessoa chegar já querendo. Vamos começar?',
  equipe:
    'Equipe que ouve muito e age pouco quase nunca é falta de vontade. É falta de um caminho claro. Vamos começar?',
  outro:
    'Você já deu o primeiro passo dizendo o que te incomoda. Quase sempre a causa é mais simples do que parece. Vamos começar?',
}

/** A devolutiva reativa para a chave escolhida na tela 2 da porta. */
export function devolutivaReativaPara(key: DesafioKey): string {
  return DEVOLUTIVA_REATIVA[key]
}
