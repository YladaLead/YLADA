/** href permitido em leader_tenant_flow_entries: caminho relativo ou http(s). */
export function isProLideresFlowHrefAllowed(href: string): boolean {
  const t = href.trim()
  if (!t) return false
  if (t.startsWith('/')) return true
  try {
    const u = new URL(t)
    return u.protocol === 'https:' || u.protocol === 'http:'
  } catch {
    return false
  }
}

export const PRO_LIDERES_FLOW_NOTES_MAX = 4000
export const PRO_LIDERES_FLOW_LABEL_MAX = 200
export const PRO_LIDERES_FLOW_HREF_MAX = 2000
