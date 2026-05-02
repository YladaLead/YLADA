/**
 * Nomes do tabulador no convite Pro Líderes (lista fixa no código).
 * Acrescente ou altere entradas conforme a operação.
 */
export const PRO_LIDERES_TABULATOR_NAME_OPTIONS = ['Lilian', 'Alexandre'] as const

export type ProLideresTabulatorNameOption = (typeof PRO_LIDERES_TABULATOR_NAME_OPTIONS)[number]

export function isProLideresTabulatorNameOption(value: string): boolean {
  return (PRO_LIDERES_TABULATOR_NAME_OPTIONS as readonly string[]).includes(value)
}
