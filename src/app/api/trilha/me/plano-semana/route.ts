/**
 * GET /api/trilha/me/plano-semana
 * Mini-MVP Noel: busca snapshot + progresso, monta contexto e gera "plano da semana"
 * com gpt-4o-mini. Valida se trilha + dados estão bem modelados para o Noel.
 * @see docs/PASSO-A-PASSO-TRILHA-E-PERFIL.md (etapa 1.7)
 */
import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function GET(request: NextRequest) {
  try {
    const auth = await requireApiAuth(request)
    if (auth instanceof NextResponse) return auth
    const { user } = auth

    if (!supabaseAdmin) {
      return NextResponse.json({ success: false, error: 'Backend não configurado' }, { status: 503 })
    }

    const [snapshotRes, progressRes] = await Promise.all([
      supabaseAdmin
        .from('user_strategy_snapshot')
        .select('snapshot_text, snapshot_json')
        .eq('user_id', user.id)
        .single(),
      supabaseAdmin
        .from('trilha_user_progress')
        .select('step_id, status')
        .eq('user_id', user.id)
        .in('status', ['in_progress', 'stuck'])
        .order('updated_at', { ascending: false })
        .limit(1)
    ])

    const snapshotText = snapshotRes.data?.snapshot_text ?? null
    const snapshotJson = (snapshotRes.data?.snapshot_json as Record<string, unknown>) ?? {}
    const progressRow = Array.isArray(progressRes.data) ? progressRes.data[0] : progressRes.data
    let stepInfo = ''
    if (progressRow?.step_id) {
      const { data: step } = await supabaseAdmin
        .from('trilha_steps')
        .select('code, title')
        .eq('id', progressRow.step_id)
        .single()
      if (step) stepInfo = `Etapa atual na trilha: ${step.code} – ${step.title}.`
    }

    const contextParts: string[] = []
    if (snapshotText) contextParts.push(snapshotText)
    if (stepInfo) contextParts.push(stepInfo)
    if (Object.keys(snapshotJson).length > 0) {
      contextParts.push('Dados estruturados: ' + JSON.stringify(snapshotJson))
    }
    const context = contextParts.length > 0 ? contextParts.join('\n\n') : 'Nenhuma reflexão ou etapa preenchida ainda. Profissional ainda não começou a trilha ou não salvou reflexões.'

    const systemPrompt = `Você é o Noel, mentor da YLADA. Com base no resumo estratégico do profissional abaixo, gere um "plano da semana" curto e prático: 2 a 4 tópicos objetivos ou um parágrafo direto. Foque no próximo passo, sem enrolação. Se não houver dados suficientes, sugira que ele preencha a reflexão na trilha para personalizar. Resposta em português, tom de mentor direto.`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Contexto do profissional:\n\n${context}\n\nGere o plano da semana:` }
      ],
      max_tokens: 400,
      temperature: 0.5
    })

    const plano_semana =
      completion.choices[0]?.message?.content?.trim() ||
      'Preencha suas reflexões na trilha para eu poder sugerir um plano da semana personalizado.'

    return NextResponse.json({
      success: true,
      data: { plano_semana }
    })
  } catch (e) {
    console.error('[trilha/me/plano-semana]', e)
    return NextResponse.json(
      {
        success: false,
        error: e instanceof Error ? e.message : 'Erro ao gerar plano da semana'
      },
      { status: 500 }
    )
  }
}
