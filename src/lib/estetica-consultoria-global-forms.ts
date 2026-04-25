import type { SupabaseClient } from '@supabase/supabase-js'
import {
  buildDiagnosticoCapilarV1Fields,
  buildDiagnosticoCorporalV1Fields,
  buildPreAvaliacaoCapilarClienteV1Fields,
  buildPreDiagnosticoCapilarV1Fields,
  buildPreDiagnosticoCorporalV1Fields,
  getDiagnosticoCapilarV1Description,
  getDiagnosticoCorporalV1Description,
  getPreAvaliacaoCapilarClienteV1Description,
  getPreDiagnosticoCapilarV1Description,
  getPreDiagnosticoCorporalV1Description,
  TEMPLATE_DIAGNOSTICO_CAPILAR_ID,
  TEMPLATE_DIAGNOSTICO_CAPILAR_TITLE,
  TEMPLATE_DIAGNOSTICO_CORPORAL_ID,
  TEMPLATE_DIAGNOSTICO_CORPORAL_TITLE,
  TEMPLATE_PRE_AVALIACAO_CAPILAR_CLIENTE_ID,
  TEMPLATE_PRE_AVALIACAO_CAPILAR_CLIENTE_TITLE,
  TEMPLATE_PRE_DIAGNOSTICO_CAPILAR_ID,
  TEMPLATE_PRE_DIAGNOSTICO_CAPILAR_TITLE,
  TEMPLATE_PRE_DIAGNOSTICO_CORPORAL_ID,
  TEMPLATE_PRE_DIAGNOSTICO_CORPORAL_TITLE,
} from '@/lib/estetica-consultoria-form-templates'
import { generateEsteticaConsultoriaShareToken } from '@/lib/estetica-consultoria'
import {
  getConsultoriaFormFields,
  normalizeConsultoriaContent,
} from '@/lib/pro-lideres-consultoria'

/** Um link por material global de pré, sem clínica (entrada pública). */
async function ensureOpenPreEntryShareLink(sb: SupabaseClient, materialId: string): Promise<void> {
  const { data: ex, error: sel } = await sb
    .from('ylada_estetica_consultancy_share_links')
    .select('id')
    .eq('material_id', materialId)
    .is('estetica_consult_client_id', null)
    .maybeSingle()
  if (sel) {
    throw new Error(sel.message)
  }
  if (ex?.id) {
    return
  }
  const token = generateEsteticaConsultoriaShareToken()
  const { error: ins } = await sb.from('ylada_estetica_consultancy_share_links').insert({
    material_id: materialId,
    estetica_consult_client_id: null,
    token,
    label: 'entrada_publica_pre',
  })
  if (ins) {
    throw new Error(ins.message)
  }
}

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

/** Garante material global publicado para o diagnóstico capilar (fixo YLADA). */
export async function ensureDiagnosticoCapilarGlobalMaterialId(sb: SupabaseClient): Promise<string> {
  const { data: existing, error: selErr } = await sb
    .from('ylada_estetica_consultancy_materials')
    .select('id')
    .eq('template_key', TEMPLATE_DIAGNOSTICO_CAPILAR_ID)
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
    const targetIds = buildDiagnosticoCapilarV1Fields()
      .map((f) => f.id)
      .join('\0')
    if (currentIds !== targetIds) {
      const rawContent = { fields: buildDiagnosticoCapilarV1Fields() }
      const content = normalizeConsultoriaContent('formulario', rawContent)
      const { error: upErr } = await sb
        .from('ylada_estetica_consultancy_materials')
        .update({
          title: TEMPLATE_DIAGNOSTICO_CAPILAR_TITLE,
          description: getDiagnosticoCapilarV1Description(),
          content,
          material_kind: 'formulario',
        })
        .eq('id', existing.id as string)
        .eq('template_key', TEMPLATE_DIAGNOSTICO_CAPILAR_ID)
      if (upErr) {
        throw new Error(upErr.message)
      }
    }
    return existing.id as string
  }

  const rawContent = { fields: buildDiagnosticoCapilarV1Fields() }
  const content = normalizeConsultoriaContent('formulario', rawContent)
  if (getConsultoriaFormFields(content).length === 0) {
    throw new Error('Modelo capilar sem campos')
  }

  const { data: created, error: insErr } = await sb
    .from('ylada_estetica_consultancy_materials')
    .insert({
      client_id: null,
      template_key: TEMPLATE_DIAGNOSTICO_CAPILAR_ID,
      title: TEMPLATE_DIAGNOSTICO_CAPILAR_TITLE,
      material_kind: 'formulario',
      description: getDiagnosticoCapilarV1Description(),
      content,
      sort_order: 0,
      is_published: true,
      created_by_user_id: null,
    })
    .select('id')
    .single()

  if (insErr || !created?.id) {
    throw new Error(insErr?.message ?? 'Falha ao criar formulário global capilar')
  }

  return created.id as string
}

/** Material global: pré-diagnóstico corporal (curto, sem confirmação por e-mail). */
export async function ensurePreDiagnosticoCorporalGlobalMaterialId(sb: SupabaseClient): Promise<string> {
  const { data: existing, error: selErr } = await sb
    .from('ylada_estetica_consultancy_materials')
    .select('id')
    .eq('template_key', TEMPLATE_PRE_DIAGNOSTICO_CORPORAL_ID)
    .maybeSingle()

  if (selErr) {
    throw new Error(selErr.message)
  }

  let materialId: string

  if (existing?.id) {
    materialId = existing.id as string
    const { data: matRow, error: matErr } = await sb
      .from('ylada_estetica_consultancy_materials')
      .select('content')
      .eq('id', materialId)
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
    const targetIds = buildPreDiagnosticoCorporalV1Fields()
      .map((f) => f.id)
      .join('\0')
    if (currentIds !== targetIds) {
      const rawContent = { fields: buildPreDiagnosticoCorporalV1Fields() }
      const content = normalizeConsultoriaContent('formulario', rawContent)
      const { error: upErr } = await sb
        .from('ylada_estetica_consultancy_materials')
        .update({
          title: TEMPLATE_PRE_DIAGNOSTICO_CORPORAL_TITLE,
          description: getPreDiagnosticoCorporalV1Description(),
          content,
          material_kind: 'formulario',
        })
        .eq('id', materialId)
        .eq('template_key', TEMPLATE_PRE_DIAGNOSTICO_CORPORAL_ID)
      if (upErr) {
        throw new Error(upErr.message)
      }
    }
  } else {
    const rawContent = { fields: buildPreDiagnosticoCorporalV1Fields() }
    const content = normalizeConsultoriaContent('formulario', rawContent)
    if (getConsultoriaFormFields(content).length === 0) {
      throw new Error('Pré corporal sem campos')
    }

    const { data: created, error: insErr } = await sb
      .from('ylada_estetica_consultancy_materials')
      .insert({
        client_id: null,
        template_key: TEMPLATE_PRE_DIAGNOSTICO_CORPORAL_ID,
        title: TEMPLATE_PRE_DIAGNOSTICO_CORPORAL_TITLE,
        material_kind: 'formulario',
        description: getPreDiagnosticoCorporalV1Description(),
        content,
        sort_order: 0,
        is_published: true,
        created_by_user_id: null,
      })
      .select('id')
      .single()

    if (insErr || !created?.id) {
      throw new Error(insErr?.message ?? 'Falha ao criar pré-diagnóstico corporal global')
    }
    materialId = created.id as string
  }

  await ensureOpenPreEntryShareLink(sb, materialId)
  return materialId
}

/** Material global: pré-diagnóstico capilar. */
export async function ensurePreDiagnosticoCapilarGlobalMaterialId(sb: SupabaseClient): Promise<string> {
  const { data: existing, error: selErr } = await sb
    .from('ylada_estetica_consultancy_materials')
    .select('id')
    .eq('template_key', TEMPLATE_PRE_DIAGNOSTICO_CAPILAR_ID)
    .maybeSingle()

  if (selErr) {
    throw new Error(selErr.message)
  }

  let materialId: string

  if (existing?.id) {
    materialId = existing.id as string
    const { data: matRow, error: matErr } = await sb
      .from('ylada_estetica_consultancy_materials')
      .select('content')
      .eq('id', materialId)
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
    const targetIds = buildPreDiagnosticoCapilarV1Fields()
      .map((f) => f.id)
      .join('\0')
    if (currentIds !== targetIds) {
      const rawContent = { fields: buildPreDiagnosticoCapilarV1Fields() }
      const content = normalizeConsultoriaContent('formulario', rawContent)
      const { error: upErr } = await sb
        .from('ylada_estetica_consultancy_materials')
        .update({
          title: TEMPLATE_PRE_DIAGNOSTICO_CAPILAR_TITLE,
          description: getPreDiagnosticoCapilarV1Description(),
          content,
          material_kind: 'formulario',
        })
        .eq('id', materialId)
        .eq('template_key', TEMPLATE_PRE_DIAGNOSTICO_CAPILAR_ID)
      if (upErr) {
        throw new Error(upErr.message)
      }
    }
  } else {
    const rawContent = { fields: buildPreDiagnosticoCapilarV1Fields() }
    const content = normalizeConsultoriaContent('formulario', rawContent)
    if (getConsultoriaFormFields(content).length === 0) {
      throw new Error('Pré capilar sem campos')
    }

    const { data: created, error: insErr } = await sb
      .from('ylada_estetica_consultancy_materials')
      .insert({
        client_id: null,
        template_key: TEMPLATE_PRE_DIAGNOSTICO_CAPILAR_ID,
        title: TEMPLATE_PRE_DIAGNOSTICO_CAPILAR_TITLE,
        material_kind: 'formulario',
        description: getPreDiagnosticoCapilarV1Description(),
        content,
        sort_order: 0,
        is_published: true,
        created_by_user_id: null,
      })
      .select('id')
      .single()

    if (insErr || !created?.id) {
      throw new Error(insErr?.message ?? 'Falha ao criar pré-diagnóstico capilar global')
    }
    materialId = created.id as string
  }

  await ensureOpenPreEntryShareLink(sb, materialId)
  return materialId
}

/** Material global: pré-avaliação capilar para cliente final (sem link público sem clínica). */
export async function ensurePreAvaliacaoCapilarClienteGlobalMaterialId(sb: SupabaseClient): Promise<string> {
  const { data: existing, error: selErr } = await sb
    .from('ylada_estetica_consultancy_materials')
    .select('id')
    .eq('template_key', TEMPLATE_PRE_AVALIACAO_CAPILAR_CLIENTE_ID)
    .maybeSingle()

  if (selErr) {
    throw new Error(selErr.message)
  }

  let materialId: string

  if (existing?.id) {
    materialId = existing.id as string
    const { data: matRow, error: matErr } = await sb
      .from('ylada_estetica_consultancy_materials')
      .select('content')
      .eq('id', materialId)
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
    const targetIds = buildPreAvaliacaoCapilarClienteV1Fields()
      .map((f) => f.id)
      .join('\0')
    if (currentIds !== targetIds) {
      const rawContent = { fields: buildPreAvaliacaoCapilarClienteV1Fields() }
      const content = normalizeConsultoriaContent('formulario', rawContent)
      const { error: upErr } = await sb
        .from('ylada_estetica_consultancy_materials')
        .update({
          title: TEMPLATE_PRE_AVALIACAO_CAPILAR_CLIENTE_TITLE,
          description: getPreAvaliacaoCapilarClienteV1Description(),
          content,
          material_kind: 'formulario',
        })
        .eq('id', materialId)
        .eq('template_key', TEMPLATE_PRE_AVALIACAO_CAPILAR_CLIENTE_ID)
      if (upErr) {
        throw new Error(upErr.message)
      }
    }
  } else {
    const rawContent = { fields: buildPreAvaliacaoCapilarClienteV1Fields() }
    const content = normalizeConsultoriaContent('formulario', rawContent)
    if (getConsultoriaFormFields(content).length === 0) {
      throw new Error('Pré-avaliação cliente capilar sem campos')
    }

    const { data: created, error: insErr } = await sb
      .from('ylada_estetica_consultancy_materials')
      .insert({
        client_id: null,
        template_key: TEMPLATE_PRE_AVALIACAO_CAPILAR_CLIENTE_ID,
        title: TEMPLATE_PRE_AVALIACAO_CAPILAR_CLIENTE_TITLE,
        material_kind: 'formulario',
        description: getPreAvaliacaoCapilarClienteV1Description(),
        content,
        sort_order: 0,
        is_published: true,
        created_by_user_id: null,
      })
      .select('id')
      .single()

    if (insErr || !created?.id) {
      throw new Error(insErr?.message ?? 'Falha ao criar pré-avaliação cliente capilar global')
    }
    materialId = created.id as string
  }

  return materialId
}
