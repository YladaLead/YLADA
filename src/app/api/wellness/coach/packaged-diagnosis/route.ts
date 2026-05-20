import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * GET /api/wellness/coach/packaged-diagnosis?flow_id=xxx&archetype_code=leve|moderado|urgente
 *
 * Retorna o content_json de ylada_flow_diagnosis_outcomes para o fluxo e arquétipo dado.
 * Usado pelo FluxoDiagnosticoCoach para exibir resultado personalizado por usuário.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const flowId = searchParams.get('flow_id')?.trim()
  const archetypeCode = searchParams.get('archetype_code')?.trim()

  // Parâmetros obrigatórios
  if (!flowId || !archetypeCode) {
    return NextResponse.json({ content: null })
  }

  // Arquétipos válidos
  const validArchetypes = ['leve', 'moderado', 'urgente']
  if (!validArchetypes.includes(archetypeCode)) {
    return NextResponse.json({ content: null })
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('ylada_flow_diagnosis_outcomes')
      .select('content_json')
      .eq('flow_id', flowId)
      .eq('architecture', 'RISK_DIAGNOSIS')
      .eq('archetype_code', archetypeCode)
      .eq('active', true)
      .is('diagnosis_vertical', null)
      .maybeSingle()

    if (error && error.code !== 'PGRST116') {
      console.warn('[packaged-diagnosis] DB error:', error.message)
    }

    const content = data?.content_json as Record<string, unknown> | null | undefined
    return NextResponse.json({ content: content ?? null })
  } catch (err) {
    console.error('[packaged-diagnosis] unexpected error:', err)
    return NextResponse.json({ content: null })
  }
}
