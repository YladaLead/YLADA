/**
 * Presets do catálogo Pro Estética Corporal — `leader_tenant_flow_entries` (category sales).
 * Só atalhos **dentro do produto Pro Estética**; não usar `/pt/wellness/templates/...` (evita confusão e “entrega” errada).
 */

export type EsteticaPresetFlowEntry = {
  category: 'sales'
  label: string
  href: string
  sort_order: number
}

/** Atalho único para criar e gerir links próprios (/l/…) no contexto Estética. */
export const ESTETICA_PRESET_FLOW_ENTRIES: EsteticaPresetFlowEntry[] = [
  {
    category: 'sales',
    label: 'Biblioteca e Links inteligentes (conta própria)',
    href: '/pro-estetica-corporal/painel/biblioteca-links',
    sort_order: 0,
  },
]
