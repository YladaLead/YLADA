/**
 * Presets do catálogo Pro Estética Capilar — `leader_tenant_flow_entries` (category sales).
 * Atalhos dentro do produto Pro Estética Capilar (como no corporal: sem Wellness genérico).
 */

export type EsteticaCapilarPresetFlowEntry = {
  category: 'sales'
  label: string
  href: string
  sort_order: number
}

export const ESTETICA_CAPILAR_PRESET_FLOW_ENTRIES: EsteticaCapilarPresetFlowEntry[] = [
  {
    category: 'sales',
    label: 'Biblioteca e links inteligentes (conta própria)',
    href: '/pro-estetica-capilar/painel/biblioteca-links',
    sort_order: 0,
  },
]
