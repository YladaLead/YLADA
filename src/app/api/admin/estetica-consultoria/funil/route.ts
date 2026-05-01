import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import type { YladaEsteticaConsultClientRow } from '@/lib/estetica-consultoria'
import {
  buildAllFichaPipelineItems,
  buildAllFichaPipelineItemsMerged,
  clientsMatchingLinha,
  funnelColumnsForVista,
  isEsteticaConsultFunilVista,
  type EsteticaConsultFunilVista,
} from '@/lib/estetica-consultoria-fichas-pipeline'
import { normalizeEsteticaConsultFunnelStage } from '@/lib/estetica-consultoria-funnel'
import {
  proLideresConsultoriaResponseToFichaPipelineItem,
  type ProLideresConsultancyResponseFunilRow,
} from '@/lib/pro-lideres-consultoria-funil'
import {
  leaderOnboardingRowToFichaPipelineItem,
  type ProLideresLeaderOnboardingFunilRow,
} from '@/lib/pro-lideres-onboarding-funil'
import { PRO_LIDERES_PRE_DIAGNOSTICO_MATERIAL_ID } from '@/lib/pro-lideres-pre-diagnostico'
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

type FichaItem = ReturnType<typeof buildAllFichaPipelineItems>[number]

function groupItemsIntoColumns(allItems: FichaItem[], vista: EsteticaConsultFunilVista) {
  const colDefs = funnelColumnsForVista(vista)
  const byStage = new Map<string, FichaItem[]>()
  for (const col of colDefs) {
    byStage.set(col.key, [])
  }
  for (const item of allItems) {
    const stage = normalizeEsteticaConsultFunnelStage(item.client.funnel_stage)
    byStage.get(stage)?.push(item)
  }
  const sortByUpdated = (a: FichaItem, b: FichaItem) => b.client.updated_at.localeCompare(a.client.updated_at)
  return colDefs.map((c) => ({
    key: c.key,
    label: c.label,
    description: c.description,
    border: c.border,
    headerBg: c.headerBg,
    items: [...(byStage.get(c.key) ?? [])].sort(sortByUpdated),
  }))
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

  if (vista === 'lider') {
    const { data: onbRows, error: onbErr } = await supabaseAdmin
      .from('pro_lideres_leader_onboarding_links')
      .select('*')
      .in('status', ['pending', 'completed'])
      .order('updated_at', { ascending: false })
      .limit(500)

    if (onbErr) {
      return NextResponse.json({ error: 'Erro ao listar onboarding Pro Líderes.' }, { status: 500 })
    }

    const onboardingItems = (onbRows ?? []).map((r) =>
      leaderOnboardingRowToFichaPipelineItem(r as ProLideresLeaderOnboardingFunilRow)
    )

    const { data: plConsultRows, error: plConsultErr } = await supabaseAdmin
      .from('pro_lideres_consultancy_form_responses')
      .select('*')
      .eq('material_id', PRO_LIDERES_PRE_DIAGNOSTICO_MATERIAL_ID)
      .order('submitted_at', { ascending: false })
      .limit(500)

    if (plConsultErr) {
      return NextResponse.json({ error: 'Erro ao listar respostas da consultoria Pro Líderes.' }, { status: 500 })
    }

    const consultoriaPreItems = (plConsultRows ?? []).map((r) =>
      proLideresConsultoriaResponseToFichaPipelineItem(r as ProLideresConsultancyResponseFunilRow)
    )

    const { data: allClients, error: cErr } = await supabaseAdmin
      .from('ylada_estetica_consult_clients')
      .select('*')
      .order('updated_at', { ascending: false })

    if (cErr) {
      return NextResponse.json({ error: 'Erro ao listar clientes' }, { status: 500 })
    }

    const clients = (allClients ?? []) as YladaEsteticaConsultClientRow[]
    const esteticaLiderClients = clientsForVista(clients, 'lider')

    const { data: materials, error: mErr } = await supabaseAdmin
      .from('ylada_estetica_consultancy_materials')
      .select('id, template_key')
      .in('template_key', ALL_TEMPLATE_KEYS)
      .not('template_key', 'is', null)

    if (mErr) {
      return NextResponse.json({ error: 'Erro ao carregar materiais fixos' }, { status: 500 })
    }

    const matRows = (materials ?? []) as { id: string; template_key: string }[]
    const materialIds = matRows.map((m) => m.id)
    const templateByMaterialId = new Map(matRows.map((m) => [m.id, m.template_key] as const))

    const clientIds = esteticaLiderClients.map((c) => c.id)
    let responses: {
      estetica_consult_client_id: string
      submitted_at: string
      template_key: string
    }[] = []

    if (clientIds.length > 0 && materialIds.length > 0) {
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

      responses = ((frRows ?? []) as { estetica_consult_client_id: string; submitted_at: string; material_id: string }[])
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
    }

    const esteticaItems = buildAllFichaPipelineItemsMerged(esteticaLiderClients, responses).map((it) => ({
      ...it,
      funilCardSource: 'estetica' as const,
    }))

    const allItems: FichaItem[] = [...onboardingItems, ...consultoriaPreItems, ...esteticaItems]

    return NextResponse.json({
      vista,
      columns: groupItemsIntoColumns(allItems, vista),
    })
  }

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
      columns: funnelColumnsForVista(vista).map((c) => ({ ...c, items: [] })),
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
      columns: funnelColumnsForVista(vista).map((c) => ({ ...c, items: [] })),
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

  let allItems: FichaItem[]
  if (vista === 'corporal') {
    allItems = buildAllFichaPipelineItems(clientsInVista, responses, 'corporal')
  } else if (vista === 'capilar') {
    allItems = buildAllFichaPipelineItems(clientsInVista, responses, 'capilar')
  } else {
    allItems = buildAllFichaPipelineItemsMerged(clientsInVista, responses)
  }

  return NextResponse.json({
    vista,
    columns: groupItemsIntoColumns(allItems, vista),
  })
}
