/**
 * Decisão PURA da costura Fase 2: quando o pós-cadastro deve cair direto no Noel
 * servindo (porta única) em vez do onboarding por área (legado). É a costura que
 * "aposenta a seleção de área": vale quando a flag está ON E a pessoa veio da
 * porta (tem `ylada_desafio`). Sem I/O — testável em `destino-pos-cadastro.casos.ts`.
 * @see blueprint-plataforma/Noel_Completo_Metodo_e_Conducao.md §9.3 (Fase 2, r88)
 */

/** Destino pós-cadastro quando o Noel direto está ativo: a casca que lê o desafio.
 *  NÃO usar `/pt/comecar` (rota viva que redireciona pro cadastro). */
export const NOEL_DIRETO_DESTINO = '/pt/noel-direto'

/** Destino legado (onboarding por área), preservado com a flag OFF ou sem desafio. */
export const DESTINO_LEGADO_ONBOARDING = '/pt/onboarding'

/**
 * Ativa o Noel direto? Só com a flag ON e um desafio capturado pela porta.
 * Sem desafio (entrada por outra via) segue o legado, mesmo com a flag ON.
 */
export function noelDiretoAtivo(flagOn: boolean, temDesafio: boolean): boolean {
  return flagOn && temDesafio
}

/** O `redirectPath` do cadastro: Noel direto quando ativo, senão o onboarding legado. */
export function redirectPathPosCadastro(flagOn: boolean, temDesafio: boolean): string {
  return noelDiretoAtivo(flagOn, temDesafio) ? NOEL_DIRETO_DESTINO : DESTINO_LEGADO_ONBOARDING
}

/**
 * No fluxo novo, a casa do Noel (`/pt/home`, matriz `ylada`) deixa de FORÇAR a
 * onboarding/perfil-empresarial de perfil incompleto — o Noel coleta o que falta
 * conversando (§9.3 r49). Só vale pra `area === 'ylada'` com a flag do fluxo novo ON;
 * NÃO afeta sessão nem perfil, NÃO afeta outras áreas, e com a flag OFF é inerte.
 * Puro — testável em `destino-pos-cadastro.casos.ts`.
 */
export function relaxarGateMatrizParaNoelDireto(area: string, flagOn: boolean): boolean {
  return area === 'ylada' && flagOn
}
