/**
 * Tipos do perfil empresarial YLADA (ylada_noel_profile).
 * @see docs/PERFIL-EMPRESARIAL-YLADA-MODELO.md
 */
/**
 * Foco da área YLADA: geração e captação de contatos (leads), não atendimento pós-consulta.
 * "Follow-up" aqui = reconexão de leads para conversão/agendamento, não acompanhamento após o atendimento.
 */

/** Opções genéricas (fallback quando profile_type não está definido). */
export const DOR_PRINCIPAL_OPTIONS = [
  { value: 'agenda_vazia', label: 'Agenda vazia' },
  { value: 'agenda_instavel', label: 'Agenda instável' },
  { value: 'sem_indicacao', label: 'Sem indicação' },
  { value: 'nao_converte', label: 'Não converte consultas' },
  { value: 'nao_postar', label: 'Não consigo postar / divulgar' },
  { value: 'followup_fraco', label: 'Leads que não retornam / não reconecto para agendar' },
  { value: 'outra', label: 'Outra' },
] as const

/** Dor principal para profissional liberal (foco em geração/captação de contatos). */
export const DOR_PRINCIPAL_OPTIONS_LIBERAL = [
  { value: 'agenda_vazia', label: 'Agenda vazia' },
  { value: 'agenda_instavel', label: 'Agenda instável' },
  { value: 'sem_indicacao', label: 'Sem indicação' },
  { value: 'nao_converte', label: 'Não converte contatos em consultas' },
  { value: 'nao_postar', label: 'Não consigo postar / divulgar' },
  { value: 'followup_fraco', label: 'Leads que não retornam (não reconecto para agendar ou fechar)' },
  { value: 'autoridade', label: 'Falta de autoridade / visibilidade' },
  { value: 'retorno', label: 'Poucos remarcam ou retornam (captação/recorrência)' },
  { value: 'precificacao', label: 'Dificuldade de precificação' },
  { value: 'organizacao', label: 'Organização da rotina' },
  { value: 'outra', label: 'Outra' },
] as const

/** Dor principal para vendas (funil, conversão, reconexão de leads). */
export const DOR_PRINCIPAL_OPTIONS_VENDAS = [
  { value: 'sem_leads', label: 'Sem leads / poucos leads' },
  { value: 'nao_converte', label: 'Não converte leads' },
  { value: 'followup_fraco', label: 'Não reconecto leads após o primeiro contato (perco conversões)' },
  { value: 'ticket_baixo', label: 'Ticket médio baixo' },
  { value: 'nao_postar', label: 'Não consigo postar / divulgar' },
  { value: 'recorrencia', label: 'Falta de recorrência' },
  { value: 'outra', label: 'Outra' },
] as const

/** Retorna opções de dor principal conforme o tipo de perfil (liberal | vendas). */
export function getDorPrincipalOptions(profileType?: string | null): typeof DOR_PRINCIPAL_OPTIONS {
  if (profileType === 'liberal') return DOR_PRINCIPAL_OPTIONS_LIBERAL
  if (profileType === 'vendas') return DOR_PRINCIPAL_OPTIONS_VENDAS
  return DOR_PRINCIPAL_OPTIONS
}

/** Retorna opções para um campo do flow (select/multiselect) por key e opcionalmente profissão. */
export function getOptionsForProfileField(
  fieldKey: string,
  profileType?: string | null,
  profession?: string | null
): { value: string; label: string }[] {
  switch (fieldKey) {
    case 'dor_principal':
      return [...getDorPrincipalOptions(profileType)]
    case 'fase_negocio':
      return [...FASE_NEGOCIO_OPTIONS]
    case 'modelo_pagamento':
      return [...MODELO_PAGAMENTO_OPTIONS]
    case 'modelo_atuacao':
      return [...MODELO_ATUACAO_OPTIONS]
    case 'canais_principais':
      return profession === 'medico' ? [...CANAIS_OPTIONS_MEDICO] : [...CANAIS_OPTIONS]
    case 'especialidades':
      return [...ESPECIALIDADES_MED]
    case 'oferta':
      return profession === 'vendedor_suplementos' ? [...OFERTA_VENDEDOR_SUPLEMENTOS_OPTIONS] : [...OFERTA_OPTIONS]
    case 'canal_principal_vendas':
      return [...CANAL_PRINCIPAL_VENDAS_OPTIONS]
    case 'publico_principal':
      return [...PUBLICO_PRINCIPAL_OPTIONS]
    case 'foco_principal':
      return [...FOCO_PRINCIPAL_MED_OPTIONS]
    case 'desperdicio_principal':
      return [...DESPERDICIO_PRINCIPAL_OPTIONS]
    case 'modelo_receita':
      return [...MODELO_RECEITA_OPTIONS]
    case 'equipe_operacional':
      return [...EQUIPE_OPERACIONAL_OPTIONS]
    case 'area_estetica':
      return [...AREA_ESTETICA_OPTIONS]
    case 'estetica_tipo_atuacao':
      return [...ESTETICA_TIPO_ATUACAO_OPTIONS]
    case 'odonto_voce_atende':
      return [...ODONTO_VOCE_ATENDE_OPTIONS]
    case 'publico_psi':
      return [...PSI_PUBLICO_OPTIONS]
    case 'modalidade_atendimento':
      return [...MODALIDADE_ATENDIMENTO_OPTIONS]
    case 'area_nutri':
      return [...AREA_NUTRI_OPTIONS]
    case 'modelo_entrega_coach':
      return [...COACH_MODELO_ENTREGA_OPTIONS]
    default:
      return []
  }
}

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

/** Canais / origem dos pacientes (médico): de onde vêm a maioria. */
export const CANAIS_OPTIONS_MEDICO = [
  { value: 'indicacao', label: 'Indicação' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'google', label: 'Google' },
  { value: 'convenio', label: 'Convênio' },
  { value: 'trafego_pago', label: 'Tráfego pago' },
  { value: 'parcerias_medicas', label: 'Parcerias médicas' },
] as const

/** Público principal (médico): você atende principalmente. */
export const PUBLICO_PRINCIPAL_OPTIONS = [
  { value: 'adultos', label: 'Adultos' },
  { value: 'criancas', label: 'Crianças' },
  { value: 'idosos', label: 'Idosos' },
  { value: 'feminino', label: 'Público feminino' },
  { value: 'masculino', label: 'Público masculino' },
  { value: 'alta_renda', label: 'Alta renda' },
  { value: 'convenio', label: 'Convênio' },
  { value: 'particular', label: 'Particular' },
] as const

/** Foco principal (médico): seu foco hoje. */
export const FOCO_PRINCIPAL_MED_OPTIONS = [
  { value: 'consulta_rotina', label: 'Consulta de rotina' },
  { value: 'tratamento_continuo', label: 'Tratamento contínuo' },
  { value: 'procedimentos', label: 'Procedimentos' },
  { value: 'cirurgia', label: 'Cirurgia' },
  { value: 'acompanhamento_cronico', label: 'Acompanhamento crônico' },
] as const

/** Onde sente maior desperdício (médico). */
export const DESPERDICIO_PRINCIPAL_OPTIONS = [
  { value: 'falta_retorno', label: 'Falta de retorno do paciente' },
  { value: 'faltas_cancelamentos', label: 'Faltas / cancelamentos' },
  { value: 'baixa_conversao_indicacao', label: 'Baixa conversão de indicação' },
  { value: 'falta_posicionamento_digital', label: 'Falta de posicionamento digital' },
  { value: 'tempo_mal_distribuido', label: 'Tempo mal distribuído' },
  { value: 'preco_abaixo_ideal', label: 'Preço abaixo do ideal' },
] as const

/** Modelo de receita (médico): você trabalha com. */
export const MODELO_RECEITA_OPTIONS = [
  { value: 'avulsa', label: 'Apenas consulta avulsa' },
  { value: 'pacotes', label: 'Pacotes' },
  { value: 'acompanhamento_mensal', label: 'Acompanhamento mensal' },
  { value: 'procedimentos_alto_ticket', label: 'Procedimentos de alto ticket' },
  { value: 'hibrido', label: 'Modelo híbrido' },
] as const

/** Equipe operacional (médico): secretária ou faz tudo. */
export const EQUIPE_OPERACIONAL_OPTIONS = [
  { value: 'faco_tudo', label: 'Faço tudo' },
  { value: 'secretaria', label: 'Tenho secretária' },
  { value: 'equipe', label: 'Tenho equipe' },
] as const

/** Estética: área principal. */
export const AREA_ESTETICA_OPTIONS = [
  { value: 'facial', label: 'Facial' },
  { value: 'corporal', label: 'Corporal' },
  { value: 'capilar', label: 'Capilar' },
  { value: 'harmonizacao', label: 'Harmonização' },
  { value: 'depilacao_laser', label: 'Depilação/Laser' },
  { value: 'outro', label: 'Outro' },
] as const

/** Estética: você atua como. */
export const ESTETICA_TIPO_ATUACAO_OPTIONS = [
  { value: 'autonoma', label: 'Autônoma' },
  { value: 'clinica_propria', label: 'Clínica própria' },
  { value: 'dentro_salao', label: 'Dentro de salão' },
  { value: 'equipe_colaboradora', label: 'Equipe/colaboradora' },
] as const

/** Odonto: você atende. */
export const ODONTO_VOCE_ATENDE_OPTIONS = [
  { value: 'particular', label: 'Particular' },
  { value: 'convenio', label: 'Convênio' },
  { value: 'misto', label: 'Misto' },
] as const

/** Psi: atende qual público. */
export const PSI_PUBLICO_OPTIONS = [
  { value: 'adultos', label: 'Adultos' },
  { value: 'criancas', label: 'Crianças' },
  { value: 'casais', label: 'Casais' },
  { value: 'empresas', label: 'Empresas' },
] as const

/** Psi / Nutri: atendimento (modalidade). */
export const MODALIDADE_ATENDIMENTO_OPTIONS = [
  { value: 'presencial', label: 'Presencial' },
  { value: 'online', label: 'Online' },
  { value: 'ambos', label: 'Ambos' },
] as const

/** Nutri: área principal de atuação. */
export const AREA_NUTRI_OPTIONS = [
  { value: 'emagrecimento', label: 'Emagrecimento' },
  { value: 'esportiva', label: 'Esportiva' },
  { value: 'clinica', label: 'Clínica' },
  { value: 'infantil', label: 'Infantil' },
  { value: 'outro', label: 'Outro' },
] as const

/** Coach: modelo de entrega. */
export const COACH_MODELO_ENTREGA_OPTIONS = [
  { value: 'sessoes_individuais', label: 'Sessões individuais' },
  { value: 'grupo', label: 'Grupo' },
  { value: 'programa_estruturado', label: 'Programa estruturado' },
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

/** Oferta (vendas): serviço, produto ou ambos. */
export const OFERTA_OPTIONS = [
  { value: 'servico', label: 'Serviço' },
  { value: 'produto', label: 'Produto' },
  { value: 'ambos', label: 'Ambos' },
] as const

/** Você vende principalmente (Nutra). */
export const OFERTA_VENDEDOR_SUPLEMENTOS_OPTIONS = [
  { value: 'direto_consumidor', label: 'Direto ao consumidor' },
  { value: 'equipe_rede', label: 'Por equipe/rede' },
  { value: 'ambos', label: 'Ambos' },
] as const

/** Canal principal de vendas. */
export const CANAL_PRINCIPAL_VENDAS_OPTIONS = [
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'presencial', label: 'Presencial' },
  { value: 'marketplace', label: 'Marketplace' },
] as const

/** Labels para campos do perfil (wizard). */
export const PROFILE_FIELD_LABELS: Record<string, string> = {
  category: 'Categoria (mercado)',
  sub_category: 'Subcategoria',
  tempo_atuacao_anos: 'Anos de atuação na área',
  dor_principal: 'Dor principal',
  prioridade_atual: 'Prioridade atual (o que você quer destravar primeiro)',
  fase_negocio: 'Fase do negócio',
  metas_principais: 'Metas principais',
  objetivos_curto_prazo: 'Objetivos curto/médio prazo',
  modelo_atuacao: 'Modelo de atuação',
  capacidade_semana: 'Capacidade/semana (atendimentos ou fechamentos)',
  ticket_medio: 'Ticket médio (R$)',
  modelo_pagamento: 'Modelo de pagamento',
  canais_principais: 'Canais principais',
  rotina_atual_resumo: 'Resumo da rotina atual',
  frequencia_postagem: 'Frequência de postagem',
  observacoes: 'Observações para o Noel',
  especialidades: 'Especialidades',
  especialidade_outra: 'Outra especialidade',
  oferta: 'Oferta',
  categoria: 'Categoria do produto/serviço',
  canal_principal_vendas: 'Canal principal de vendas',
  area_estetica: 'Área principal (estética)',
  estetica_tipo_atuacao: 'Você atua como',
  odonto_voce_atende: 'Você atende',
  publico_psi: 'Atende qual público?',
  modalidade_atendimento: 'Atendimento (presencial/online)',
  area_nutri: 'Área principal de atuação',
  modelo_entrega_coach: 'Modelo de entrega',
}

export interface YladaProfileFormData {
  segment: string
  profile_type: string
  profession: string
  flow_id: string
  flow_version: number | ''
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
    flow_id: '',
    flow_version: '',
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
    flow_id: typeof profile.flow_id === 'string' ? profile.flow_id : '',
    flow_version: typeof profile.flow_version === 'number' ? profile.flow_version : '',
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
    flow_id: form.flow_id || null,
    flow_version: form.flow_version === '' ? null : form.flow_version,
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
