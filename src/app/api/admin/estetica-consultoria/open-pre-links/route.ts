import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { buildEsteticaConsultoriaResponderUrl } from '@/lib/estetica-consultoria'
import {
  ensurePreDiagnosticoCapilarGlobalMaterialId,
  ensurePreDiagnosticoCorporalGlobalMaterialId,
} from '@/lib/estetica-consultoria-global-forms'

/**
 * Links públicos fixos do pré-diagnóstico (sem criar clínica antes).
 * Garante materiais globais + linha de share_link com estetica_consult_client_id NULL.
 */
export async function GET(request: NextRequest) {
  const auth = await requireApiAuth(request, ['admin'])
  if (auth instanceof NextResponse) return auth

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })
  }

  try {
    const corpMid = await ensurePreDiagnosticoCorporalGlobalMaterialId(supabaseAdmin)
    const capMid = await ensurePreDiagnosticoCapilarGlobalMaterialId(supabaseAdmin)

    const { data: corpLink, error: cErr } = await supabaseAdmin
      .from('ylada_estetica_consultancy_share_links')
      .select('token')
      .eq('material_id', corpMid)
      .is('estetica_consult_client_id', null)
      .maybeSingle()

    const { data: capLink, error: kErr } = await supabaseAdmin
      .from('ylada_estetica_consultancy_share_links')
      .select('token')
      .eq('material_id', capMid)
      .is('estetica_consult_client_id', null)
      .maybeSingle()

    if (cErr || kErr) {
      return NextResponse.json({ error: cErr?.message ?? kErr?.message ?? 'Erro ao ler links' }, { status: 500 })
    }

    const origin = request.nextUrl.origin
    const pack = (token: string | undefined) =>
      token
        ? {
            token,
            responder_url: buildEsteticaConsultoriaResponderUrl(origin, token),
          }
        : null

    return NextResponse.json({
      corporal: pack(corpLink?.token as string | undefined),
      capilar: pack(capLink?.token as string | undefined),
    })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Erro'
    return NextResponse.json(
      {
        error: msg,
        hint:
          'Se o erro citar NOT NULL em estetica_consult_client_id, aplique a migração 336-estetica-pre-share-link-client-null.sql no Supabase.',
      },
      { status: 500 }
    )
  }
}
