/**
 * Gera e persiste conteúdo de diagnóstico para um link.
 * Usado por: POST /api/ylada/links/[id]/generate-diagnosis e bulk-generate-diagnosis.
 * Consulta diagnosis_blocks (biblioteca inteligente) para enriquecer o prompt quando disponível.
 */
import type { SupabaseClient } from '@supabase/supabase-js'
import OpenAI from 'openai'
import { generateLinkDiagnosisContent } from './generate-link-diagnosis'
import {
  getDiagnosisBlocksForSegment,
  getDiagnosisBlocksByTags,
  type DiagnosisBlocksByType,
} from './diagnosis-blocks'

const ARCHETYPES_RISK = ['leve', 'moderado', 'urgente'] as const
const ARCHETYPES_BLOCKER = ['bloqueio_pratico', 'bloqueio_emocional'] as const

export type GenerateForLinkInput = {
  linkId: string
  config: Record<string, unknown>
  force?: boolean
}

export type GenerateForLinkResult =
  | { ok: true; archetypesCount: number }
  | { ok: false; error: string }

export async function generateDiagnosisForLink(
  input: GenerateForLinkInput,
  supabase: NonNullable<SupabaseClient>,
  openai: OpenAI
): Promise<GenerateForLinkResult> {
  const { linkId, config, force = false } = input
  const meta = config.meta as Record<string, unknown> | undefined
  const architecture = meta?.architecture as string | undefined

  if (!architecture || !['RISK_DIAGNOSIS', 'BLOCKER_DIAGNOSIS'].includes(architecture)) {
    return { ok: false, error: 'Arquitetura não suportada' }
  }

  if (!force) {
    const { data: existing } = await supabase
      .from('ylada_link_diagnosis_content')
      .select('id')
      .eq('link_id', linkId)
      .limit(1)
    if (existing?.length) {
      return { ok: true, archetypesCount: 0 }
    }
  }

  const themeRaw =
    (typeof meta?.theme_raw === 'string' ? meta.theme_raw : null) ??
    ((meta?.theme as Record<string, unknown>)?.raw as string | undefined) ??
    (config.title as string) ??
    'seu objetivo'
  const theme = themeRaw.replace(/^diagnóstico\s+de\s+/i, '').trim() || themeRaw

  const form = config.form as Record<string, unknown> | undefined
  const fields = (form?.fields as Array<{ id?: string; label?: string; options?: string[] }>) ?? []
  const questions = fields.map((f) => ({
    id: f.id ?? '',
    label: (f.label as string) ?? '',
    options: f.options,
  }))

  // Buscar blocos da biblioteca inteligente (por segmento e/ou por tags do tema)
  let blocks: DiagnosisBlocksByType | undefined
  try {
    const segmentCode =
      (typeof meta?.segment_code === 'string' ? meta.segment_code : null) ?? 'ylada'
    const [bySegment, byTags] = await Promise.all([
      getDiagnosisBlocksForSegment(segmentCode),
      getDiagnosisBlocksByTags(
        theme
          .toLowerCase()
          .replace(/[^\p{L}\p{N}\s]/gu, ' ')
          .split(/\s+/)
          .filter((w) => w.length >= 2)
      ),
    ])
    // Mesclar: preferir blocos de tags (mais específicos), completar com segmento
    blocks = {
      theme: [...new Set([...byTags.theme, ...bySegment.theme])],
      problem: [...new Set([...byTags.problem, ...bySegment.problem])],
      audience: [...new Set([...byTags.audience, ...bySegment.audience])],
      promise: [...new Set([...byTags.promise, ...bySegment.promise])],
    }
    if (
      blocks.theme.length === 0 &&
      blocks.problem.length === 0 &&
      blocks.promise.length === 0
    ) {
      blocks = undefined
    }
  } catch (e) {
    console.warn('[generate-diagnosis] diagnosis_blocks:', e)
  }

  const { archetypes } = await generateLinkDiagnosisContent(
    {
      theme,
      architecture: architecture as 'RISK_DIAGNOSIS' | 'BLOCKER_DIAGNOSIS',
      questions,
      blocks,
    },
    openai
  )

  const codes = architecture === 'RISK_DIAGNOSIS' ? ARCHETYPES_RISK : ARCHETYPES_BLOCKER

  if (force) {
    await supabase.from('ylada_link_diagnosis_content').delete().eq('link_id', linkId)
  }

  await supabase
    .from('ylada_diagnosis_cache')
    .delete()
    .eq('link_id', linkId)
    .then(() => {})
    .catch((err) => console.warn('[generate-diagnosis] cache invalidation:', err))

  for (const code of codes) {
    const content = archetypes[code]
    if (content) {
      await supabase.from('ylada_link_diagnosis_content').upsert(
        {
          link_id: linkId,
          architecture,
          archetype_code: code,
          content_json: content,
        },
        { onConflict: 'link_id,architecture,archetype_code' }
      )
    }
  }

  return { ok: true, archetypesCount: codes.length }
}
