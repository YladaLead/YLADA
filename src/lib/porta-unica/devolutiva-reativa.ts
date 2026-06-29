/**
 * Devolutiva reativa PRÉ-cadastro (toque "a" da Fase 2): reage à escolha do
 * desafio com 1-2 linhas, paga o "Descubra como", planta o "não é o que você
 * acha" e fecha no CTA de cadastro. NÃO é o diagnóstico pesado (esse é o toque
 * "b", pós-cadastro, no Noel/Espelho). Copy TRAVADA pelo método (r90) — lookup
 * determinístico, sem IA. Sem I/O: testável em `devolutiva-reativa.casos.ts`.
 * @see blueprint-plataforma/Noel_Completo_Metodo_e_Conducao.md §9.3 (r89, refinada r90)
 */
import type { DesafioKey } from './desafio'

/**
 * Copy exata da r90 (uma por chave). Não editar sem o chat do método.
 * r90 refina a r89: fecha num convite COLABORATIVO ("a gente faz junto / Vamos
 * começar?"), NÃO "cadastra que eu te mostro" — evita cara de gate/desconfiança;
 * quem cadastra é o botão embaixo, não o texto.
 */
const DEVOLUTIVA_REATIVA: Readonly<Record<DesafioKey, string>> = {
  atrair:
    'Atrair mais gente quase nunca é aparecer mais. É fazer a pergunta certa pra a pessoa certa te procurar. A gente monta isso junto, do jeito que funciona. Vamos começar?',
  vender:
    'Vender mais não é empurrar mais. É a pessoa chegar já querendo. Eu te ajudo a virar essa chave. Vamos começar?',
  equipe:
    'Equipe que ouve muito e age pouco quase nunca é falta de vontade. É falta de um caminho claro. A gente monta esse caminho junto. Vamos começar?',
  outro:
    'Você já deu o primeiro passo dizendo o que te incomoda. Quase sempre a causa é mais simples do que parece. A gente acha e resolve junto. Vamos começar?',
}

/** A devolutiva reativa para a chave escolhida na tela 2 da porta. */
export function devolutivaReativaPara(key: DesafioKey): string {
  return DEVOLUTIVA_REATIVA[key]
}
