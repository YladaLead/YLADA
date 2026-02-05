/**
 * Converte o progresso real do vídeo (0–1) em um valor de barra (0–1)
 * que avança mais rápido no começo e bem devagar no final.
 * Estratégia: a pessoa vê a barra subir rápido no início (sensação de progresso)
 * e desacelerar perto do fim (reduz vontade de sair "falta pouco").
 *
 * Usa curva ease-out: display = 1 - (1 - real)^exponent
 * exponent > 1 → mais acentuado (ex.: 2 = quadrático)
 */
const RETENTION_EXPONENT = 2

export function videoProgressForRetention(realProgress01: number): number {
  if (realProgress01 <= 0) return 0
  if (realProgress01 >= 1) return 1
  return 1 - Math.pow(1 - realProgress01, RETENTION_EXPONENT)
}

/**
 * Recebe progresso em 0–100 e retorna 0–100 para exibição na barra.
 */
export function videoProgressPercentForRetention(realProgressPercent: number): number {
  const p = Math.min(100, Math.max(0, realProgressPercent)) / 100
  return videoProgressForRetention(p) * 100
}
