/**
 * Flag da porta única de entrada `/descubra` (telas 1-2: paradoxo → pergunta).
 * Com OFF a rota dá notFound() = inerte (adição pura, AGENTS.md).
 * @see blueprint-plataforma/Porta_Unica_Entrada_Regua.md
 */
export function isPortaUnicaEnabled(): boolean {
  return process.env.PORTA_UNICA_ENABLED === 'true' || process.env.PORTA_UNICA_ENABLED === '1'
}

/**
 * Flag da COSTURA da Fase 2 (`ONBOARDING_NOEL_DIRETO_ENABLED` no brief): pós-cadastro
 * lê o `ylada_desafio` e cai direto no Noel servindo (sem seleção de área). A env var
 * leva o prefixo `NEXT_PUBLIC_` porque o gate roda no CLIENTE (`/pt/cadastro` é
 * 'use client' e lê o localStorage) — sem o prefixo o valor não chega ao browser.
 * Com OFF o fluxo legado é byte-idêntico.
 * @see blueprint-plataforma/Noel_Completo_Metodo_e_Conducao.md §9.3 (Fase 2, r88)
 * @see blueprint-plataforma/Porta_Unica_Fase2_Brief_Codigo.md (flag ONBOARDING_NOEL_DIRETO_ENABLED)
 */
export function isNoelDiretoEnabled(): boolean {
  const v = process.env.NEXT_PUBLIC_ONBOARDING_NOEL_DIRETO_ENABLED
  return v === 'true' || v === '1'
}
