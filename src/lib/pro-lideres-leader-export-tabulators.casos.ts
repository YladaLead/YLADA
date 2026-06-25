import {
  memberTabMatchesExportFilter,
  parseProLideresLeaderExportTabulatorFilter,
  resolveCanonicalTabulatorLabelsForExport,
} from '@/lib/pro-lideres-leader-export-tabulators'

function assert(cond: boolean, msg: string): void {
  if (!cond) throw new Error(msg)
}

const empty = parseProLideresLeaderExportTabulatorFilter([])
assert(empty.ok && empty.filter.labels === null, 'vazio → todos')

const multi = parseProLideresLeaderExportTabulatorFilter(['Ana', 'Bruno,Carlos'])
assert(multi.ok && multi.filter.labels?.length === 3, 'vários tab')

const resolved = resolveCanonicalTabulatorLabelsForExport(['ana'], ['Ana', 'Bruno'])
assert(resolved.ok && resolved.labels[0] === 'Ana', 'canónico case-insensitive')

const miss = resolveCanonicalTabulatorLabelsForExport(['X'], ['Ana'])
assert(!miss.ok, 'inválido rejeitado')

assert(memberTabMatchesExportFilter('Ana', { labels: ['Ana'] }), 'match')
assert(!memberTabMatchesExportFilter('Bruno', { labels: ['Ana'] }), 'sem match')
assert(memberTabMatchesExportFilter('Bruno', { labels: null }), 'sem filtro')

console.log('pro-lideres-leader-export-tabulators.casos: ok')
