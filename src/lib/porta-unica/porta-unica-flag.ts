/**
 * Flag da porta única de entrada `/descubra` (telas 1-2: paradoxo → pergunta).
 * Com OFF a rota dá notFound() = inerte (adição pura, AGENTS.md).
 * @see blueprint-plataforma/Porta_Unica_Entrada_Regua.md
 */
export function isPortaUnicaEnabled(): boolean {
  return process.env.PORTA_UNICA_ENABLED === 'true' || process.env.PORTA_UNICA_ENABLED === '1'
}
