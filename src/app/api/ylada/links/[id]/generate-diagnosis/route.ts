/**
 * POST /api/ylada/links/[id]/generate-diagnosis — gera conteúdo de diagnóstico via IA e memoriza.
 * Chamado quando o profissional edita o link (perguntas, tema).
 * Se já existir conteúdo memorizado, pode forçar regeneração com ?force=true.
 */
import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import OpenAI from 'openai'
import { generateDiagnosisForLink } from '@/lib/ylada/generate-diagnosis-for-link'

const ALLOWED_ROLES = ['ylada', 'psi', 'psicanalise', 'odonto', 'nutra', 'coach', 'nutri', 'wellness', 'admin'] as const

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireApiAuth(request, [...ALLOWED_ROLES])
    if (auth instanceof NextResponse) return auth
    const { user } = auth
    const { id: linkId } = await context.params
    if (!linkId) {
      return NextResponse.json({ success: false, error: 'id é obrigatório' }, { status: 400 })
    }

    const force = new URL(request.url).searchParams.get('force') === 'true'

    if (!supabaseAdmin) {
      return NextResponse.json({ success: false, error: 'Backend não configurado' }, { status: 503 })
    }

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ success: false, error: 'OPENAI_API_KEY não configurada' }, { status: 503 })
    }

    const { data: link, error: linkErr } = await supabaseAdmin
      .from('ylada_links')
      .select('id, config_json')
      .eq('id', linkId)
      .eq('user_id', user.id)
      .maybeSingle()

    if (linkErr || !link) {
      return NextResponse.json({ success: false, error: 'Link não encontrado' }, { status: 404 })
    }

    const config = (link.config_json as Record<string, unknown>) ?? {}
    const meta = config.meta as Record<string, unknown> | undefined
    const architecture = meta?.architecture as string | undefined

    if (!architecture || !['RISK_DIAGNOSIS', 'BLOCKER_DIAGNOSIS'].includes(architecture)) {
      return NextResponse.json({
        success: false,
        error: 'Arquitetura não suportada para geração. Use RISK_DIAGNOSIS ou BLOCKER_DIAGNOSIS.',
      }, { status: 400 })
    }

    const result = await generateDiagnosisForLink(
      { linkId, config, force },
      supabaseAdmin,
      new OpenAI({ apiKey })
    )

    if (!result.ok) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 })
    }

    if (result.archetypesCount === 0) {
      return NextResponse.json({
        success: true,
        message: 'Conteúdo já memorizado. Use ?force=true para regenerar.',
      })
    }

    return NextResponse.json({
      success: true,
      message: `Diagnóstico memorizado para ${result.archetypesCount} arquétipo(s).`,
    })
  } catch (e) {
    console.error('[ylada/links/[id]/generate-diagnosis]', e)
    return NextResponse.json({
      success: false,
      error: e instanceof Error ? e.message : 'Erro ao gerar diagnóstico',
    }, { status: 500 })
  }
}
