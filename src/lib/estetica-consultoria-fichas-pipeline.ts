import type { YladaEsteticaConsultClientRow } from '@/lib/estetica-consultoria'
import { ESTETICA_CONSULT_FUNNEL_COLUMNS } from '@/lib/estetica-consultoria-funnel'
import {
  TEMPLATE_DIAGNOSTICO_CAPILAR_ID,
  TEMPLATE_DIAGNOSTICO_CORPORAL_ID,
  TEMPLATE_PRE_AVALIACAO_CAPILAR_CLIENTE_ID,
  TEMPLATE_PRE_DIAGNOSTICO_CAPILAR_ID,
  TEMPLATE_PRE_DIAGNOSTICO_CORPORAL_ID,
} from '@/lib/estetica-consultoria-form-templates'

export type FichasPipelineLinha = 'capilar' | 'corporal'

/** Vista do funil admin: linha única, todas as fichas, ou só com tenant Pro líder. */
export type EsteticaConsultFunilVista = 'todos' | 'corporal' | 'capilar' | 'lider'

export function isEsteticaConsultFunilVista(v: string): v is EsteticaConsultFunilVista {
  return v === 'todos' || v === 'corporal' || v === 'capilar' || v === 'lider'
}

/** Rótulos do quadro quando a vista é só Pro líder (onboarding + fichas com tenant). */
export function funnelColumnsForVista(vista: EsteticaConsultFunilVista) {
  if (vista !== 'lider') return ESTETICA_CONSULT_FUNNEL_COLUMNS
  return ESTETICA_CONSULT_FUNNEL_COLUMNS.map((c) => {
    if (c.key === 'entrada') {
      return {
        ...c,
        label: 'Convite / diagnóstico pendente',
        description: 'Link enviado; ainda não preencheu o formulário inicial Pro Líderes.',
      }
    }
    if (c.key === 'pendente_pagamento') {
      return {
        ...c,
        label: 'Pré-reunião feita · ficou de pagar',
        description:
          'Já enviou o formulário (proposta / pré); conta como pré-reunião feita — falta fechar pagamento ou confirmar o valor com o líder.',
      }
    }
    if (c.key === 'em_andamento') {
      return {
        ...c,
        label: 'Consultoria em curso',
        description: 'Consultoria ou acompanhamento com o líder já em execução.',
      }
    }
    return c
  })
}

function linhasForSegment(segment: YladaEsteticaConsultClientRow['segment']): FichasPipelineLinha[] {
  if (segment === 'ambos') return ['capilar', 'corporal']
  if (segment === 'capilar') return ['capilar']
  return ['corporal']
}

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
  /** No funil vista «Pro líder»: cartão vindo do onboarding (não da ficha estética). */
  funilCardSource?: 'estetica' | 'leader_onboarding'
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

/** Todas as fichas da linha com metadados de pré/diagnóstico (uma entrada por cliente). */
export function buildAllFichaPipelineItems(
  clientsInLinha: YladaEsteticaConsultClientRow[],
  responses: ResponseRow[],
  linha: FichasPipelineLinha
): FichaPipelineItem[] {
  const { preReuniao, diagnostico, novas } = buildFichasBuckets(clientsInLinha, responses, linha)
  return [...diagnostico, ...preReuniao, ...novas]
}

/**
 * Uma ficha por cliente: junta pré/diagnóstico nas linhas que fazem sentido para o segmento (ex.: «ambos» = capilar + corporal).
 * Usado nas vistas «todos» e «lider» do funil.
 */
export function buildAllFichaPipelineItemsMerged(
  clientsSubset: YladaEsteticaConsultClientRow[],
  responses: ResponseRow[]
): FichaPipelineItem[] {
  const items: FichaPipelineItem[] = []
  for (const c of clientsSubset) {
    const linhas = linhasForSegment(c.segment)
    let ultimoPre: string | null = null
    let ultimoDiag: string | null = null
    for (const r of responses) {
      if (r.estetica_consult_client_id !== c.id) continue
      const t = r.template_key
      const at = r.submitted_at
      for (const L of linhas) {
        if (isPreTemplateForLinha(t, L)) {
          if (!ultimoPre || at > ultimoPre) ultimoPre = at
        }
        if (isDiagnosticoTemplateForLinha(t, L)) {
          if (!ultimoDiag || at > ultimoDiag) ultimoDiag = at
        }
      }
    }
    items.push({ client: c, ultimoPreAt: ultimoPre, ultimoDiagnosticoAt: ultimoDiag })
  }
  items.sort((a, b) => b.client.updated_at.localeCompare(a.client.updated_at))
  return items
}

/** Segmento na URL da consultoria ao abrir a ficha (vista «todos» / «lider» com «ambos»). */
export function segmentoParamForConsultoriaLink(
  client: YladaEsteticaConsultClientRow,
  vista: EsteticaConsultFunilVista
): FichasPipelineLinha {
  if (vista === 'capilar') return 'capilar'
  if (vista === 'corporal') return 'corporal'
  if (client.segment === 'capilar') return 'capilar'
  if (client.segment === 'corporal') return 'corporal'
  return 'corporal'
}
