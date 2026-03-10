/**
 * POST /api/admin/ylada/links/bulk-generate-diagnosis
 * Gera diagnóstico via IA para todos os links elegíveis, em blocos.
 * Apenas admin.
 *
 * Query:
 *   force=true  — regenerar mesmo os que já têm conteúdo
 *   limit=50    — máximo de links a processar (default 50)
 *   batch=1     — processar 1 por vez (delay entre cada para evitar rate limit)
 */
import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import OpenAI from 'openai'
import { generateDiagnosisForLink } from '@/lib/ylada/generate-diagnosis-for-link'

const DELAY_MS = 3000

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms))
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireApiAuth(request, ['admin'])
    if (auth instanceof NextResponse) return auth

    if (!supabaseAdmin) {
      return NextResponse.json({ success: false, error: 'Backend não configurado' }, { status: 503 })
    }

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ success: false, error: 'OPENAI_API_KEY não configurada' }, { status: 503 })
    }

    const { searchParams } = new URL(request.url)
    const force = searchParams.get('force') === 'true'
    const limit = Math.min(parseInt(searchParams.get('limit') || '50', 10) || 50, 200)
    const batch = Math.max(1, parseInt(searchParams.get('batch') || '1', 10))

    const { data: allLinks, error: linksErr } = await supabaseAdmin
      .from('ylada_links')
      .select('id, config_json')
      .eq('status', 'active')

    if (linksErr) {
      return NextResponse.json({ success: false, error: linksErr.message }, { status: 500 })
    }

    const eligible: { id: string; config_json: Record<string, unknown> }[] = []
    for (const row of allLinks ?? []) {
      const config = (row.config_json as Record<string, unknown>) ?? {}
      const arch = (config.meta as Record<string, unknown>)?.architecture as string | undefined
      if (!['RISK_DIAGNOSIS', 'BLOCKER_DIAGNOSIS'].includes(arch ?? '')) continue
      eligible.push({ id: row.id, config_json: config })
    }

    if (!force) {
      const idsWithContent = new Set<string>()
      const { data: existing } = await supabaseAdmin
        .from('ylada_link_diagnosis_content')
        .select('link_id')
      for (const r of existing ?? []) idsWithContent.add(r.link_id)
      const filtered = eligible.filter((e) => !idsWithContent.has(e.id))
      eligible.length = 0
      eligible.push(...filtered)
    }

    const toProcess = eligible.slice(0, limit)
    const openai = new OpenAI({ apiKey })

    const results: { linkId: string; ok: boolean; error?: string }[] = []
    let processed = 0
    let failed = 0

    for (let i = 0; i < toProcess.length; i++) {
      const link = toProcess[i]
      try {
        const result = await generateDiagnosisForLink(
          { linkId: link.id, config: link.config_json, force },
          supabaseAdmin,
          openai
        )
        if (result.ok && result.archetypesCount > 0) {
          processed++
        }
        results.push({ linkId: link.id, ok: result.ok, error: result.ok ? undefined : result.error })
        if (!result.ok) failed++
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Erro desconhecido'
        results.push({ linkId: link.id, ok: false, error: msg })
        failed++
      }

      if (i < toProcess.length - 1 && batch >= 1) {
        await sleep(DELAY_MS)
      }
    }

    return NextResponse.json({
      success: true,
      total: toProcess.length,
      processed,
      failed,
      results: results.slice(-20),
    })
  } catch (e) {
    console.error('[admin/ylada/links/bulk-generate-diagnosis]', e)
    return NextResponse.json({
      success: false,
      error: e instanceof Error ? e.message : 'Erro ao processar',
    }, { status: 500 })
  }
}
