/** Valores persistidos em leader_tenant_flow_entries.catalog_kind */
export const PRO_LIDERES_FLOW_CATALOG_KINDS = ['external_link', 'ylada_diagnosis'] as const
export type ProLideresFlowCatalogKind = (typeof PRO_LIDERES_FLOW_CATALOG_KINDS)[number]

export const DEFAULT_PRO_LIDERES_FLOW_CATALOG_KIND: ProLideresFlowCatalogKind = 'external_link'

/** Caminho público YLADA (/l/slug…), não URL externa. */
export function isProLideresYladaLinkPathHref(href: string): boolean {
  const t = href.trim().toLowerCase()
  return t.startsWith('/l/') && t.length > 3
}

/** Define catalog_kind automaticamente: caminho público YLADA vs atalho externo (sem escolha do líder). */
export function inferProLideresFlowCatalogKindFromHref(href: string): ProLideresFlowCatalogKind {
  return isProLideresYladaLinkPathHref(href) ? 'ylada_diagnosis' : 'external_link'
}
