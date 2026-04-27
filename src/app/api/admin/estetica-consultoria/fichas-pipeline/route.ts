import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import type { YladaEsteticaConsultClientRow } from '@/lib/estetica-consultoria'
import {
  buildFichasBuckets,
  clientsMatchingLinha,
  type FichasPipelineLinha,
} from '@/lib/estetica-consultoria-fichas-pipeline'
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

function isLinha(v: string | null): v is FichasPipelineLinha {
  return v === 'capilar' || v === 'corporal'
}

/**
 * GET ?linha=capilar|corporal
 * Devolve fichas (clientes) separadas: pré-reunião (só pré, sem diagnóstico), diagnóstico completo, novas.
 */
export async function GET(request: NextRequest) {
  const auth = await requireApiAuth(request, ['admin'])
  if (auth instanceof NextResponse) return auth

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })
  }

  const raw = request.nextUrl.searchParams.get('linha')?.trim().toLowerCase() ?? ''
  if (!isLinha(raw)) {
    return NextResponse.json({ error: 'Parâmetro linha=capilar ou linha=corporal é obrigatório.' }, { status: 400 })
  }
  const linha = raw

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
      linha,
      preReuniao: [],
      diagnostico: [],
      novas: [],
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
  const clientsInLinha = clientsMatchingLinha(clients, linha)
  const idSet = new Set(clientsInLinha.map((c) => c.id))
  if (idSet.size === 0) {
    return NextResponse.json({ linha, preReuniao: [], diagnostico: [], novas: [] })
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

  const { preReuniao, diagnostico, novas } = buildFichasBuckets(clientsInLinha, responses, linha)

  return NextResponse.json({
    linha,
    preReuniao,
    diagnostico,
    novas,
  })
}
