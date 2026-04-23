import type { SupabaseClient } from '@supabase/supabase-js'
import {
  buildDiagnosticoCorporalV1Fields,
  getDiagnosticoCorporalV1Description,
  TEMPLATE_DIAGNOSTICO_CORPORAL_ID,
  TEMPLATE_DIAGNOSTICO_CORPORAL_TITLE,
} from '@/lib/estetica-consultoria-form-templates'
import {
  getConsultoriaFormFields,
  normalizeConsultoriaContent,
} from '@/lib/pro-lideres-consultoria'

/** Garante uma única linha de material global para o diagnóstico corporal (publicado). Devolve o id. */
export async function ensureDiagnosticoCorporalGlobalMaterialId(sb: SupabaseClient): Promise<string> {
  const { data: existing, error: selErr } = await sb
    .from('ylada_estetica_consultancy_materials')
    .select('id')
    .eq('template_key', TEMPLATE_DIAGNOSTICO_CORPORAL_ID)
    .maybeSingle()

  if (selErr) {
    throw new Error(selErr.message)
  }
  if (existing?.id) {
    const { data: matRow, error: matErr } = await sb
      .from('ylada_estetica_consultancy_materials')
      .select('content')
      .eq('id', existing.id as string)
      .maybeSingle()
    if (matErr) {
      throw new Error(matErr.message)
    }
    const contentObj = (matRow?.content && typeof matRow.content === 'object' ? matRow.content : {}) as Record<
      string,
      unknown
    >
    const currentIds = getConsultoriaFormFields(contentObj)
      .map((f) => f.id)
      .join('\0')
    const targetIds = buildDiagnosticoCorporalV1Fields()
      .map((f) => f.id)
      .join('\0')
    if (currentIds !== targetIds) {
      const rawContent = { fields: buildDiagnosticoCorporalV1Fields() }
      const content = normalizeConsultoriaContent('formulario', rawContent)
      const { error: upErr } = await sb
        .from('ylada_estetica_consultancy_materials')
        .update({
          title: TEMPLATE_DIAGNOSTICO_CORPORAL_TITLE,
          description: getDiagnosticoCorporalV1Description(),
          content,
          material_kind: 'formulario',
        })
        .eq('id', existing.id as string)
        .eq('template_key', TEMPLATE_DIAGNOSTICO_CORPORAL_ID)
      if (upErr) {
        throw new Error(upErr.message)
      }
    }
    return existing.id as string
  }

  const rawContent = { fields: buildDiagnosticoCorporalV1Fields() }
  const content = normalizeConsultoriaContent('formulario', rawContent)
  if (getConsultoriaFormFields(content).length === 0) {
    throw new Error('Modelo corporal sem campos')
  }

  const { data: created, error: insErr } = await sb
    .from('ylada_estetica_consultancy_materials')
    .insert({
      client_id: null,
      template_key: TEMPLATE_DIAGNOSTICO_CORPORAL_ID,
      title: TEMPLATE_DIAGNOSTICO_CORPORAL_TITLE,
      material_kind: 'formulario',
      description: getDiagnosticoCorporalV1Description(),
      content,
      sort_order: 0,
      is_published: true,
      created_by_user_id: null,
    })
    .select('id')
    .single()

  if (insErr || !created?.id) {
    throw new Error(insErr?.message ?? 'Falha ao criar formulário global')
  }

  return created.id as string
}
