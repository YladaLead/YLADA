import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import type { YladaEsteticaConsultClientRow } from '@/lib/estetica-consultoria'
import {
  buildAllFichaPipelineItems,
  buildAllFichaPipelineItemsMerged,
  clientsMatchingLinha,
  isEsteticaConsultFunilVista,
  type EsteticaConsultFunilVista,
} from '@/lib/estetica-consultoria-fichas-pipeline'
import {
  ESTETICA_CONSULT_FUNNEL_COLUMNS,
  normalizeEsteticaConsultFunnelStage,
} from '@/lib/estetica-consultoria-funnel'
import {
  TEMPLATE_DIAGNOSTICO_CAPILAR_ID,
  TEMPLATE_DIAGNOSTICO_CORPORAL_ID,
  TEMPLATE_PRE_AVALIACAO_CAPILAR_CLIENTE_ID,
  TEMPLATE_PRE_DIAGNOSTICO_CAPILAR_ID,
  TEMPLATE_PRE_DIAGNOSTICO_CORPORAL_ID,
} from '@/lib/estetica-consultoria-form-templates'

const ALL_TEMPLATE_KEYS = [
  TEMPLATE_PRE_DIAGNOSTICO_CAPILAR_ID,
  TEMPLATE_PRE_AVALIACAO_CAPILAR_CLIENTE_ID,
  TEMPLATE_PRE_DIAGNOSTICO_CORPORAL_ID,
  TEMPLATE_DIAGNOSTICO_CAPILAR_ID,
  TEMPLATE_DIAGNOSTICO_CORPORAL_ID,
]

function resolveVista(request: NextRequest): EsteticaConsultFunilVista {
  const rawVista = request.nextUrl.searchParams.get('vista')?.trim().toLowerCase() ?? ''
  if (isEsteticaConsultFunilVista(rawVista)) return rawVista

  const legacyLinha = request.nextUrl.searchParams.get('linha')?.trim().toLowerCase() ?? ''
  if (legacyLinha === 'capilar') return 'capilar'
  if (legacyLinha === 'corporal') return 'corporal'

  const legacySeg = request.nextUrl.searchParams.get('segmento')?.trim().toLowerCase() ?? ''
  if (legacySeg === 'capilar') return 'capilar'
  if (legacySeg === 'corporal') return 'corporal'

  return 'corporal'
}

function clientsForVista(clients: YladaEsteticaConsultClientRow[], vista: EsteticaConsultFunilVista) {
  if (vista === 'todos') return clients
  if (vista === 'lider') {
    return clients.filter((c) => c.leader_tenant_id != null && String(c.leader_tenant_id).trim() !== '')
  }
  if (vista === 'capilar') return clientsMatchingLinha(clients, 'capilar')
  return clientsMatchingLinha(clients, 'corporal')
}

/**
 * GET ?vista=todos|corporal|capilar|lider
 * Compat: ?linha= ou ?segmento= (capilar|corporal) mapeiam para a vista equivalente.
 */
export async function GET(request: NextRequest) {
  const auth = await requireApiAuth(request, ['admin'])
  if (auth instanceof NextResponse) return auth

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })
  }

  const vista = resolveVista(request)

  const { data: materials, error: mErr } = await supabaseAdmin
    .from('ylada_estetica_consultancy_materials')
    .select('id, template_key')
    .in('template_key', ALL_TEMPLATE_KEYS)
    .not('template_key', 'is', null)

  if (mErr) {
    return NextResponse.json({ error: 'Erro ao carregar materiais fixos' }, { status: 500 })
  }

  const matRows = (materials ?? []) as { id: string; template_key: string }[]
  if (matRows.length === 0) {
    return NextResponse.json({
      vista,
      columns: ESTETICA_CONSULT_FUNNEL_COLUMNS.map((c) => ({ ...c, items: [] })),
    })
  }

  const materialIds = matRows.map((m) => m.id)
  const templateByMaterialId = new Map(matRows.map((m) => [m.id, m.template_key] as const))

  const { data: allClients, error: cErr } = await supabaseAdmin
    .from('ylada_estetica_consult_clients')
    .select('*')
    .order('updated_at', { ascending: false })

  if (cErr) {
    return NextResponse.json({ error: 'Erro ao listar clientes' }, { status: 500 })
  }

  const clients = (allClients ?? []) as YladaEsteticaConsultClientRow[]
  const clientsInVista = clientsForVista(clients, vista)
  const idSet = new Set(clientsInVista.map((c) => c.id))
  if (idSet.size === 0) {
    return NextResponse.json({
      vista,
      columns: ESTETICA_CONSULT_FUNNEL_COLUMNS.map((c) => ({ ...c, items: [] })),
    })
  }

  const clientIds = [...idSet]

  const { data: frRows, error: rErr } = await supabaseAdmin
    .from('ylada_estetica_consultancy_form_responses')
    .select('estetica_consult_client_id, submitted_at, material_id')
    .in('estetica_consult_client_id', clientIds)
    .in('material_id', materialIds)
    .order('submitted_at', { ascending: false })
    .limit(20000)

  if (rErr) {
    return NextResponse.json({ error: 'Erro ao listar respostas' }, { status: 500 })
  }

  const responses = ((frRows ?? []) as { estetica_consult_client_id: string; submitted_at: string; material_id: string }[])
    .map((row) => {
      const template_key = templateByMaterialId.get(row.material_id)
      if (!template_key) return null
      return {
        estetica_consult_client_id: row.estetica_consult_client_id,
        submitted_at: row.submitted_at,
        template_key,
      }
    })
    .filter((x): x is NonNullable<typeof x> => x != null)

  let allItems: ReturnType<typeof buildAllFichaPipelineItems>
  if (vista === 'corporal') {
    allItems = buildAllFichaPipelineItems(clientsInVista, responses, 'corporal')
  } else if (vista === 'capilar') {
    allItems = buildAllFichaPipelineItems(clientsInVista, responses, 'capilar')
  } else {
    allItems = buildAllFichaPipelineItemsMerged(clientsInVista, responses)
  }

  const byStage = new Map<string, typeof allItems>()
  for (const col of ESTETICA_CONSULT_FUNNEL_COLUMNS) {
    byStage.set(col.key, [])
  }
  for (const item of allItems) {
    const stage = normalizeEsteticaConsultFunnelStage(item.client.funnel_stage)
    byStage.get(stage)?.push(item)
  }

  const sortByUpdated = (a: (typeof allItems)[0], b: (typeof allItems)[0]) =>
    b.client.updated_at.localeCompare(a.client.updated_at)

  const columns = ESTETICA_CONSULT_FUNNEL_COLUMNS.map((c) => ({
    key: c.key,
    label: c.label,
    description: c.description,
    border: c.border,
    headerBg: c.headerBg,
    items: [...(byStage.get(c.key) ?? [])].sort(sortByUpdated),
  }))

  return NextResponse.json({ vista, columns })
}
