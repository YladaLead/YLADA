import type { YladaEsteticaConsultClientRow } from '@/lib/estetica-consultoria'
import {
  TEMPLATE_DIAGNOSTICO_CAPILAR_ID,
  TEMPLATE_DIAGNOSTICO_CORPORAL_ID,
  TEMPLATE_PRE_AVALIACAO_CAPILAR_CLIENTE_ID,
  TEMPLATE_PRE_DIAGNOSTICO_CAPILAR_ID,
  TEMPLATE_PRE_DIAGNOSTICO_CORPORAL_ID,
} from '@/lib/estetica-consultoria-form-templates'

export type FichasPipelineLinha = 'capilar' | 'corporal'

const PRE_CAPILAR = new Set<string>([
  TEMPLATE_PRE_DIAGNOSTICO_CAPILAR_ID,
  TEMPLATE_PRE_AVALIACAO_CAPILAR_CLIENTE_ID,
])
const PRE_CORPORAL = new Set<string>([TEMPLATE_PRE_DIAGNOSTICO_CORPORAL_ID])
const DIAG_CAPILAR = new Set<string>([TEMPLATE_DIAGNOSTICO_CAPILAR_ID])
const DIAG_CORPORAL = new Set<string>([TEMPLATE_DIAGNOSTICO_CORPORAL_ID])

export function isPreTemplateForLinha(templateKey: string, linha: FichasPipelineLinha): boolean {
  if (linha === 'capilar') return PRE_CAPILAR.has(templateKey)
  return PRE_CORPORAL.has(templateKey)
}

export function isDiagnosticoTemplateForLinha(templateKey: string, linha: FichasPipelineLinha): boolean {
  if (linha === 'capilar') return DIAG_CAPILAR.has(templateKey)
  return DIAG_CORPORAL.has(templateKey)
}

export function clientsMatchingLinha(
  clients: YladaEsteticaConsultClientRow[],
  linha: FichasPipelineLinha
): YladaEsteticaConsultClientRow[] {
  return clients.filter((c) => {
    if (linha === 'capilar') return c.segment === 'capilar' || c.segment === 'ambos'
    return c.segment === 'corporal' || c.segment === 'ambos'
  })
}

type ResponseRow = {
  estetica_consult_client_id: string
  submitted_at: string
  template_key: string
}

export type FichaPipelineItem = {
  client: YladaEsteticaConsultClientRow
  ultimoPreAt: string | null
  ultimoDiagnosticoAt: string | null
}

/**
 * `preReuniao`: tem pré (pré-diagnóstico e/ou pré-avaliação cliente) e ainda não fechou diagnóstico completo nesta linha.
 * `diagnostico`: envio do diagnóstico YLADA (completo) nesta linha.
 * `novas`: ficha sem nenhum destes envios.
 */
export function buildFichasBuckets(
  clientsInLinha: YladaEsteticaConsultClientRow[],
  responses: ResponseRow[],
  linha: FichasPipelineLinha
): { preReuniao: FichaPipelineItem[]; diagnostico: FichaPipelineItem[]; novas: FichaPipelineItem[] } {
  const byId = new Map<string, YladaEsteticaConsultClientRow>()
  for (const c of clientsInLinha) byId.set(c.id, c)

  const preLatest = new Map<string, string>()
  const diagLatest = new Map<string, string>()

  for (const r of responses) {
    const cid = r.estetica_consult_client_id
    if (!byId.has(cid)) continue
    const t = r.template_key
    const at = r.submitted_at
    if (isPreTemplateForLinha(t, linha)) {
      const ex = preLatest.get(cid)
      if (!ex || at > ex) preLatest.set(cid, at)
    }
    if (isDiagnosticoTemplateForLinha(t, linha)) {
      const ex = diagLatest.get(cid)
      if (!ex || at > ex) diagLatest.set(cid, at)
    }
  }

  const preReuniao: FichaPipelineItem[] = []
  const diagnostico: FichaPipelineItem[] = []
  const novas: FichaPipelineItem[] = []

  for (const c of clientsInLinha) {
    const up = preLatest.get(c.id) ?? null
    const ud = diagLatest.get(c.id) ?? null
    const item: FichaPipelineItem = { client: c, ultimoPreAt: up, ultimoDiagnosticoAt: ud }
    if (ud) {
      diagnostico.push(item)
    } else if (up) {
      preReuniao.push(item)
    } else {
      novas.push(item)
    }
  }

  const sortByDateDesc = (get: (i: FichaPipelineItem) => string | null) => (a: FichaPipelineItem, b: FichaPipelineItem) => {
    const va = get(a) ?? ''
    const vb = get(b) ?? ''
    return vb.localeCompare(va)
  }

  preReuniao.sort(sortByDateDesc((i) => i.ultimoPreAt))
  diagnostico.sort(sortByDateDesc((i) => i.ultimoDiagnosticoAt))
  novas.sort((a, b) => b.client.updated_at.localeCompare(a.client.updated_at))

  return { preReuniao, diagnostico, novas }
}
