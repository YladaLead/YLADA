import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { ensureDiagnosticoCorporalGlobalMaterialId } from '@/lib/estetica-consultoria-global-forms'

export async function GET(request: NextRequest) {
  const auth = await requireApiAuth(request, ['admin'])
  if (auth instanceof NextResponse) return auth

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })
  }

  try {
    const id = await ensureDiagnosticoCorporalGlobalMaterialId(supabaseAdmin)
    const { data: mat, error } = await supabaseAdmin
      .from('ylada_estetica_consultancy_materials')
      .select('*')
      .eq('id', id)
      .maybeSingle()

    if (error || !mat) {
      return NextResponse.json({ error: 'Erro ao carregar formulário global' }, { status: 500 })
    }

    return NextResponse.json({ item: mat })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Erro'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
