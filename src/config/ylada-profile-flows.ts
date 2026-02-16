/**
 * Fluxos de preenchimento do perfil empresarial por tipo (liberal vs vendas) e por profissão.
 * Define etapas e campos por etapa para cada profile_type (e opcionalmente profession).
 * @see docs/PERFIL-POR-TOPICO-PROFISSAO-FLUXOS.md
 */

export type ProfileType = 'liberal' | 'vendas'

export type ProfessionCode =
  | 'medico'
  | 'estetica'
  | 'odonto'
  | 'psi'
  | 'psicanalise'
  | 'coach'
  | 'nutra'
  | 'seller'

/** Campo do perfil: coluna da tabela ou chave de area_specific (prefixo area_specific.) */
export type ProfileFieldKey =
  | 'category'
  | 'sub_category'
  | 'tempo_atuacao_anos'
  | 'dor_principal'
  | 'prioridade_atual'
  | 'fase_negocio'
  | 'metas_principais'
  | 'objetivos_curto_prazo'
  | 'modelo_atuacao'
  | 'capacidade_semana'
  | 'ticket_medio'
  | 'modelo_pagamento'
  | 'canais_principais'
  | 'rotina_atual_resumo'
  | 'frequencia_postagem'
  | 'observacoes'
  | `area_specific.${string}`

export interface ProfileFlowStep {
  id: string
  title: string
  description?: string
  /** Campos nesta etapa (ordem de exibição). */
  fields: ProfileFieldKey[]
}

export interface ProfileFlowConfig {
  profile_type: ProfileType
  profession?: ProfessionCode
  steps: ProfileFlowStep[]
}

/** Profissões por segment (quais opções mostrar ao escolher "quem é você"). */
export const PROFESSION_BY_SEGMENT: Record<string, ProfessionCode[]> = {
  ylada: ['medico', 'estetica', 'odonto', 'psi', 'coach', 'nutra', 'seller'],
  psi: ['psi'],
  psicanalise: ['psicanalise'],
  odonto: ['odonto'],
  nutra: ['nutra', 'seller'],
  coach: ['coach'],
  seller: ['seller'],
}

/** Profile_type por profissão (para inferir fluxo quando o usuário escolhe profissão). */
export const PROFILE_TYPE_BY_PROFESSION: Record<ProfessionCode, ProfileType> = {
  medico: 'liberal',
  estetica: 'liberal',
  odonto: 'liberal',
  psi: 'liberal',
  psicanalise: 'liberal',
  coach: 'liberal',
  nutra: 'vendas',
  seller: 'vendas',
}

/** Labels para UI. */
export const PROFILE_TYPE_LABELS: Record<ProfileType, string> = {
  liberal: 'Profissional liberal (consultório, atendimento)',
  vendas: 'Vendas (produtos, suplementos, funil)',
}

export const PROFESSION_LABELS: Record<ProfessionCode, string> = {
  medico: 'Médico(a)',
  estetica: 'Estética',
  odonto: 'Dentista',
  psi: 'Psicólogo(a)',
  psicanalise: 'Psicanalista',
  coach: 'Coach',
  nutra: 'Nutra / Suplementos',
  seller: 'Vendedor(a)',
}

/** Fluxo liberal: contexto → especialidade/aprofundamento → diagnóstico → metas/modelo → canais → observações. */
const LIBERAL_FLOW: ProfileFlowConfig = {
  profile_type: 'liberal',
  steps: [
    {
      id: 'contexto',
      title: 'Contexto',
      description: 'Mercado e tempo de atuação.',
      fields: ['category', 'sub_category', 'tempo_atuacao_anos'],
    },
    {
      id: 'especialidade',
      title: 'Especialidade / Aprofundamento',
      description: 'Detalhe sua atuação para orientações mais precisas.',
      fields: [
        'area_specific.especialidades',
        'area_specific.especialidade_outra',
        'area_specific.abordagens',
        'area_specific.faixa_etaria',
        'area_specific.nichos',
        'area_specific.nicho_outra',
      ],
    },
    {
      id: 'diagnostico',
      title: 'Diagnóstico',
      description: 'O que está travando agora.',
      fields: ['dor_principal', 'prioridade_atual', 'fase_negocio'],
    },
    {
      id: 'metas_modelo',
      title: 'Metas e modelo de atuação',
      fields: [
        'metas_principais',
        'objetivos_curto_prazo',
        'modelo_atuacao',
        'capacidade_semana',
        'ticket_medio',
        'modelo_pagamento',
      ],
    },
    {
      id: 'canais_rotina',
      title: 'Canais e rotina',
      fields: ['canais_principais', 'rotina_atual_resumo', 'frequencia_postagem'],
    },
    {
      id: 'observacoes',
      title: 'Observações',
      fields: ['observacoes'],
    },
  ],
}

/** Fluxo vendas: tipo de atuação → funil/ticket → dor/prioridade → metas/canais → observações. */
const VENDAS_FLOW: ProfileFlowConfig = {
  profile_type: 'vendas',
  steps: [
    {
      id: 'tipo_atuacao',
      title: 'Tipo de atuação',
      description: 'O que você vende ou oferece.',
      fields: [
        'area_specific.oferta',
        'area_specific.categoria',
        'area_specific.canal_principal_vendas',
      ],
    },
    {
      id: 'funil_ticket',
      title: 'Funil e ticket',
      description: 'Capacidade, ticket médio e modelo de pagamento.',
      fields: ['capacidade_semana', 'ticket_medio', 'modelo_pagamento', 'fase_negocio'],
    },
    {
      id: 'dor_prioridade',
      title: 'Dor e prioridade',
      fields: ['dor_principal', 'prioridade_atual'],
    },
    {
      id: 'metas_canais',
      title: 'Metas e canais',
      fields: [
        'metas_principais',
        'objetivos_curto_prazo',
        'canais_principais',
        'rotina_atual_resumo',
      ],
    },
    {
      id: 'observacoes',
      title: 'Observações',
      fields: ['observacoes'],
    },
  ],
}

const FLOWS: ProfileFlowConfig[] = [LIBERAL_FLOW, VENDAS_FLOW]

/**
 * Retorna o fluxo de etapas para um profile_type (e opcionalmente profession).
 * Se profession for passado, o primeiro fluxo que bater no profile_type é retornado
 * (futuro: fluxos mais específicos por profession).
 */
export function getProfileFlow(profileType: ProfileType, _profession?: ProfessionCode): ProfileFlowConfig | null {
  const flow = FLOWS.find((f) => f.profile_type === profileType)
  return flow ?? null
}

/**
 * Retorna opções de profissão para um segment.
 */
export function getProfessionsForSegment(segment: string): { value: ProfessionCode; label: string }[] {
  const codes = PROFESSION_BY_SEGMENT[segment] ?? ['seller']
  return codes.map((value) => ({ value, label: PROFESSION_LABELS[value] }))
}
