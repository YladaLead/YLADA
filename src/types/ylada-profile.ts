/**
 * Tipos do perfil empresarial YLADA (ylada_noel_profile).
 * @see docs/PERFIL-EMPRESARIAL-YLADA-MODELO.md
 */
export const DOR_PRINCIPAL_OPTIONS = [
  { value: 'agenda_vazia', label: 'Agenda vazia' },
  { value: 'agenda_instavel', label: 'Agenda instável' },
  { value: 'sem_indicacao', label: 'Sem indicação' },
  { value: 'nao_converte', label: 'Não converte consultas' },
  { value: 'nao_postar', label: 'Não consigo postar / divulgar' },
  { value: 'followup_fraco', label: 'Follow-up fraco' },
  { value: 'outra', label: 'Outra' },
] as const

export const FASE_NEGOCIO_OPTIONS = [
  { value: 'iniciante', label: 'Iniciante' },
  { value: 'em_crescimento', label: 'Em crescimento' },
  { value: 'estabilizado', label: 'Estabilizado' },
  { value: 'escalando', label: 'Escalando' },
] as const

export const MODELO_PAGAMENTO_OPTIONS = [
  { value: 'particular', label: 'Particular' },
  { value: 'convenio', label: 'Convênio' },
  { value: 'plano', label: 'Plano' },
  { value: 'recorrencia', label: 'Recorrência' },
  { value: 'avulso', label: 'Avulso' },
  { value: 'comissao', label: 'Comissão' },
  { value: 'outro', label: 'Outro' },
] as const

export const MODELO_ATUACAO_OPTIONS = [
  { value: 'consultorio', label: 'Consultório' },
  { value: 'online', label: 'Online' },
  { value: 'domicilio', label: 'Domicílio' },
  { value: 'delivery', label: 'Delivery' },
  { value: 'clinica', label: 'Clínica' },
] as const

export const CANAIS_OPTIONS = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'indicacao', label: 'Indicação' },
  { value: 'trafego_pago', label: 'Tráfego pago' },
] as const

export const ESPECIALIDADES_MED = [
  { value: 'clinica_geral', label: 'Clínica geral' },
  { value: 'psiquiatria', label: 'Psiquiatria' },
  { value: 'ortopedia', label: 'Ortopedia' },
  { value: 'pediatria', label: 'Pediatria' },
  { value: 'gineco', label: 'Ginecologia' },
  { value: 'cardio', label: 'Cardiologia' },
  { value: 'dermatologia', label: 'Dermatologia' },
  { value: 'outra', label: 'Outra' },
] as const

export interface YladaProfileFormData {
  segment: string
  profile_type: string
  profession: string
  category: string
  sub_category: string
  tempo_atuacao_anos: number | ''
  dor_principal: string
  prioridade_atual: string
  fase_negocio: string
  metas_principais: string
  objetivos_curto_prazo: string
  modelo_atuacao: string[]
  capacidade_semana: number | ''
  ticket_medio: number | ''
  modelo_pagamento: string
  canais_principais: string[]
  rotina_atual_resumo: string
  frequencia_postagem: string
  observacoes: string
  area_specific: Record<string, unknown>
}

export function emptyFormData(segment: string): YladaProfileFormData {
  return {
    segment,
    profile_type: '',
    profession: '',
    category: '',
    sub_category: '',
    tempo_atuacao_anos: '',
    dor_principal: '',
    prioridade_atual: '',
    fase_negocio: '',
    metas_principais: '',
    objetivos_curto_prazo: '',
    modelo_atuacao: [],
    capacidade_semana: '',
    ticket_medio: '',
    modelo_pagamento: '',
    canais_principais: [],
    rotina_atual_resumo: '',
    frequencia_postagem: '',
    observacoes: '',
    area_specific: {},
  }
}

/** Converte perfil da API para dados do formulário. */
export function profileToFormData(segment: string, profile: Record<string, unknown> | null): YladaProfileFormData {
  const empty = emptyFormData(segment)
  if (!profile) return empty
  return {
    ...empty,
    profile_type: typeof profile.profile_type === 'string' ? profile.profile_type : '',
    profession: typeof profile.profession === 'string' ? profile.profession : '',
    category: typeof profile.category === 'string' ? profile.category : '',
    sub_category: typeof profile.sub_category === 'string' ? profile.sub_category : '',
    tempo_atuacao_anos: typeof profile.tempo_atuacao_anos === 'number' ? profile.tempo_atuacao_anos : '',
    dor_principal: typeof profile.dor_principal === 'string' ? profile.dor_principal : '',
    prioridade_atual: typeof profile.prioridade_atual === 'string' ? profile.prioridade_atual : '',
    fase_negocio: typeof profile.fase_negocio === 'string' ? profile.fase_negocio : '',
    metas_principais: typeof profile.metas_principais === 'string' ? profile.metas_principais : '',
    objetivos_curto_prazo: typeof profile.objetivos_curto_prazo === 'string' ? profile.objetivos_curto_prazo : '',
    modelo_atuacao: Array.isArray(profile.modelo_atuacao) ? profile.modelo_atuacao.map(String) : [],
    capacidade_semana: typeof profile.capacidade_semana === 'number' ? profile.capacidade_semana : '',
    ticket_medio: typeof profile.ticket_medio === 'number' ? profile.ticket_medio : typeof profile.ticket_medio === 'string' ? Number(profile.ticket_medio) || '' : '',
    modelo_pagamento: typeof profile.modelo_pagamento === 'string' ? profile.modelo_pagamento : '',
    canais_principais: Array.isArray(profile.canais_principais) ? profile.canais_principais.map(String) : [],
    rotina_atual_resumo: typeof profile.rotina_atual_resumo === 'string' ? profile.rotina_atual_resumo : '',
    frequencia_postagem: typeof profile.frequencia_postagem === 'string' ? profile.frequencia_postagem : '',
    observacoes: typeof profile.observacoes === 'string' ? profile.observacoes : '',
    area_specific: typeof profile.area_specific === 'object' && profile.area_specific !== null ? (profile.area_specific as Record<string, unknown>) : {},
  }
}

/** Converte dados do formulário para payload da API PUT. */
export function formDataToPayload(form: YladaProfileFormData): Record<string, unknown> {
  const areaSpec = { ...form.area_specific }
  const payload: Record<string, unknown> = {
    segment: form.segment,
    profile_type: form.profile_type || null,
    profession: form.profession || null,
    category: form.category || null,
    sub_category: form.sub_category || null,
    tempo_atuacao_anos: form.tempo_atuacao_anos === '' ? null : form.tempo_atuacao_anos,
    dor_principal: form.dor_principal || null,
    prioridade_atual: form.prioridade_atual || null,
    fase_negocio: form.fase_negocio || null,
    metas_principais: form.metas_principais || null,
    objetivos_curto_prazo: form.objetivos_curto_prazo || null,
    modelo_atuacao: form.modelo_atuacao.length ? form.modelo_atuacao : null,
    capacidade_semana: form.capacidade_semana === '' ? null : form.capacidade_semana,
    ticket_medio: form.ticket_medio === '' ? null : form.ticket_medio,
    modelo_pagamento: form.modelo_pagamento || null,
    canais_principais: form.canais_principais.length ? form.canais_principais : null,
    rotina_atual_resumo: form.rotina_atual_resumo || null,
    frequencia_postagem: form.frequencia_postagem || null,
    observacoes: form.observacoes || null,
    area_specific: Object.keys(areaSpec).length ? areaSpec : {},
  }
  return payload
}
