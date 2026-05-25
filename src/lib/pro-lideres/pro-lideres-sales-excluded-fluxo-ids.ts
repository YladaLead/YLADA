/**
 * Fluxos de `fluxosClientes` descontinuados na biblioteca Vendas do Pro Líderes.
 * - Não entram em `getProLideresSalesPresetFluxos()`.
 * - Links preset existentes são arquivados em `archiveProLideresExcludedPresetLinks`.
 * `metabolismo-lento` compete com `avaliacao-perfil-metabolico` (questionário e entrega diferentes).
 */
export const PRO_LIDERES_SALES_EXCLUDED_FLUXO_IDS: readonly string[] = ['metabolismo-lento']

export function isProLideresSalesExcludedFluxoId(fluxoId: string): boolean {
  return PRO_LIDERES_SALES_EXCLUDED_FLUXO_IDS.includes(fluxoId)
}
