/** Filtro opcional de tabuladores na exportação Excel do painel do líder. */

export type ProLideresLeaderExportTabulatorFilter = {
  /** `null` = todos os tabuladores (sem filtro). */
  labels: string[] | null
}

/**
 * Interpreta parâmetros `tab` da query (vários valores ou lista separada por vírgula).
 * Array vazio ou ausente → exporta todos (`labels: null`).
 */
export function parseProLideresLeaderExportTabulatorFilter(
  rawValues: string[]
): { ok: true; filter: ProLideresLeaderExportTabulatorFilter } | { ok: false; error: string } {
  const labels: string[] = []
  for (const raw of rawValues) {
    for (const part of raw.split(',')) {
      const trimmed = part.trim()
      if (trimmed) labels.push(trimmed)
    }
  }
  if (labels.length === 0) {
    return { ok: true, filter: { labels: null } }
  }
  const seen = new Set<string>()
  const unique: string[] = []
  for (const label of labels) {
    const key = label.toLocaleLowerCase('pt')
    if (seen.has(key)) continue
    seen.add(key)
    unique.push(label)
  }
  if (unique.length > 50) {
    return { ok: false, error: 'Selecione no máximo 50 tabuladores por exportação.' }
  }
  return { ok: true, filter: { labels: unique } }
}

/**
 * Resolve rótulos pedidos para os canónicos cadastrados no tenant (comparação pt, sem maiúsculas).
 */
export function resolveCanonicalTabulatorLabelsForExport(
  requested: string[],
  registeredLabels: string[]
): { ok: true; labels: string[] } | { ok: false; error: string } {
  const canonical: string[] = []
  const missing: string[] = []
  for (const req of requested) {
    const hit = registeredLabels.find((r) => r.localeCompare(req, 'pt', { sensitivity: 'base' }) === 0)
    if (hit) canonical.push(hit)
    else missing.push(req)
  }
  if (missing.length) {
    return {
      ok: false,
      error: `Tabulador(es) inválido(s): ${missing.join(', ')}.`,
    }
  }
  return { ok: true, labels: canonical }
}

/** Verifica se o nome do tabulador do membro entra no filtro (ou se não há filtro). */
export function memberTabMatchesExportFilter(
  memberTabName: string,
  filter: ProLideresLeaderExportTabulatorFilter
): boolean {
  if (!filter.labels || filter.labels.length === 0) return true
  const tab = memberTabName.trim() || '—'
  return filter.labels.some((label) => label.localeCompare(tab, 'pt', { sensitivity: 'base' }) === 0)
}
