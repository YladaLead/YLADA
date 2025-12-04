/**
 * Types para o sistema NOEL Wellness
 * Prefixo: ylada_wellness_
 */

// ============================================
// NÍVEL 1 - CONSULTOR
// ============================================

export type TempoDisponivelDiario = '15-30 min' | '30-60 min' | '1-2h' | '2-3h' | '3-5h' | '5h+'
export type TempoDisponivelSemanal = '5-10h' | '10-15h' | '15-20h' | '20-30h' | '30h+'
export type Experiencia = 'iniciante' | '6 meses' | '1 ano' | '2-3 anos' | '3+ anos'
export type EstiloTrabalho = 'presencial' | 'online' | 'híbrido' | 'indefinido'
export type EstagioNegocio = 'iniciante' | 'ativo' | 'produtivo' | 'multiplicador' | 'lider'

export interface Consultor {
  id: string
  user_id: string
  nome: string
  email: string
  telefone?: string
  tempo_disponivel_diario?: TempoDisponivelDiario
  tempo_disponivel_semanal?: TempoDisponivelSemanal
  experiencia?: Experiencia
  objetivo_financeiro?: number
  objetivo_pv?: number
  deseja_recrutar?: boolean
  estilo_trabalho?: EstiloTrabalho
  opera_com_bebidas_prontas?: boolean
  estagio_negocio: EstagioNegocio
  created_at: string
  updated_at: string
}

// ============================================
// NÍVEL 2 - DIAGNÓSTICO
// ============================================

export interface Diagnostico {
  id: string
  consultor_id: string
  tempo_disponivel?: string
  experiencia_herbalife?: string
  objetivo_principal?: string
  maior_dificuldade?: string
  estilo_preferido?: string
  trabalha_com_bebidas_prontas?: boolean
  deseja_montar_equipe?: boolean
  nivel_atual_vendas?: string
  nivel_atual_recrutamento?: string
  maior_desafio?: string
  como_quer_crescer?: string
  perfil_identificado?: string
  pontos_fortes?: string[]
  pontos_melhoria?: string[]
  recomendacoes?: string[]
  created_at: string
  updated_at: string
}

// ============================================
// NÍVEL 2 - PROGRESSO
// ============================================

export interface Progresso {
  id: string
  consultor_id: string
  data: string // DATE
  ritual_2_executado: boolean
  ritual_5_executado: boolean
  ritual_10_executado: boolean
  microtarefas_completadas: number
  microtarefas_total: number
  pv_dia?: number
  vendas_dia?: number
  contatos_dia?: number
  recrutamentos_dia?: number
  observacoes?: string
  created_at: string
  updated_at: string
}

// ============================================
// NÍVEL 3 - PLANOS
// ============================================

export type TipoPlano = '7d' | '14d' | '30d' | '90d'
export type StatusPlano = 'ativo' | 'pausado' | 'concluido'

export interface PlanoDia {
  dia: number
  microtarefas: string[]
  foco: string
  meta_dia: string
  frase_motivacional: string
}

export interface PlanoEstrutura {
  tipo: TipoPlano
  objetivo: string
  dias: PlanoDia[]
  ajustes_automaticos?: {
    baseado_em: string[]
    regras: string[]
  }
}

export interface Plano {
  id: string
  consultor_id: string
  tipo_plano: TipoPlano
  plano_json: PlanoEstrutura
  status: StatusPlano
  data_inicio: string // DATE
  data_fim?: string // DATE
  created_at: string
  updated_at: string
}

// ============================================
// NÍVEL 4 - BASE DE CONHECIMENTO
// ============================================

export type CategoriaConhecimento = 
  | 'script_vendas' 
  | 'script_bebidas' 
  | 'script_indicacao' 
  | 'script_recrutamento' 
  | 'script_followup' 
  | 'frase_motivacional' 
  | 'fluxo_padrao' 
  | 'instrucao'

export interface BaseConhecimento {
  id: string
  categoria: CategoriaConhecimento
  subcategoria?: string
  titulo: string
  conteudo: string
  estagio_negocio?: EstagioNegocio[]
  tempo_disponivel?: TempoDisponivelDiario[]
  tags?: string[]
  prioridade: number
  ativo: boolean
  created_at: string
  updated_at: string
}

// ============================================
// INTERAÇÕES (MEMÓRIA DO NOEL)
// ============================================

export interface Interacao {
  id: string
  consultor_id: string
  mensagem_usuario: string
  resposta_noel: string
  diagnostico_usado: boolean
  plano_usado: boolean
  progresso_usado: boolean
  scripts_usados?: string[]
  usado_ia: boolean
  topico_detectado?: string
  intencao_detectada?: string
  created_at: string
}

// ============================================
// NOTIFICAÇÕES
// ============================================

export type TipoNotificacao = 'ritual' | 'microtarefa' | 'lembrete' | 'motivacional' | 'alerta' | 'conquista'

export interface Notificacao {
  id: string
  consultor_id: string
  tipo: TipoNotificacao
  titulo: string
  mensagem: string
  acao_url?: string
  acao_texto?: string
  lida: boolean
  data_envio: string
  data_leitura?: string
  created_at: string
}

// ============================================
// RITUAL 2-5-10
// ============================================

export interface RitualDia {
  id: string
  consultor_id: string
  dia: string // DATE
  ritual_2_completado: boolean
  ritual_2_horario?: string // TIME
  ritual_2_observacoes?: string
  ritual_5_completado: boolean
  ritual_5_horario?: string // TIME
  ritual_5_observacoes?: string
  ritual_10_completado: boolean
  ritual_10_horario?: string // TIME
  ritual_10_observacoes?: string
  created_at: string
  updated_at: string
}

// ============================================
// REQUESTS/RESPONSES
// ============================================

export interface CreateConsultorRequest {
  nome: string
  email: string
  telefone?: string
  tempo_disponivel_diario?: TempoDisponivelDiario
  tempo_disponivel_semanal?: TempoDisponivelSemanal
  experiencia?: Experiencia
  objetivo_financeiro?: number
  objetivo_pv?: number
  deseja_recrutar?: boolean
  estilo_trabalho?: EstiloTrabalho
  opera_com_bebidas_prontas?: boolean
  // Dados do diagnóstico inicial
  diagnostico?: Partial<Diagnostico>
}

export interface GenerateDiagnosticoRequest {
  consultor_id: string
  respostas: Partial<Diagnostico>
}

export interface GeneratePlanoRequest {
  consultor_id: string
  tipo_plano: TipoPlano
}

export interface RegistrarProgressoRequest {
  consultor_id: string
  data: string
  ritual_2_executado?: boolean
  ritual_5_executado?: boolean
  ritual_10_executado?: boolean
  microtarefas_completadas?: number
  pv_dia?: number
  vendas_dia?: number
  contatos_dia?: number
  recrutamentos_dia?: number
  observacoes?: string
}

export interface NoelResponderRequest {
  consultor_id: string
  mensagem: string
  conversation_history?: Array<{ role: 'user' | 'assistant'; content: string }>
}

export interface NoelResponderResponse {
  resposta: string
  diagnostico_usado: boolean
  plano_usado: boolean
  progresso_usado: boolean
  scripts_usados: string[]
  usado_ia: boolean
  topico_detectado?: string
}

