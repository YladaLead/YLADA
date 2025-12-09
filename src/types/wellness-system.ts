// =====================================================
// WELLNESS SYSTEM - TIPOS TYPESCRIPT
// =====================================================

// =====================================================
// PERFIL COMPLETO DO CONSULTOR
// =====================================================

export type ObjetivoPrincipal =
  | 'usar_recomendar'
  | 'renda_extra'
  | 'carteira'
  | 'plano_presidente'
  | 'fechado'
  | 'funcional'
  // Valores antigos (compatibilidade)
  | 'vender_mais'
  | 'construir_carteira'
  | 'melhorar_rotina'
  | 'voltar_ritmo'
  | 'aprender_divulgar'

export type TempoDisponivel =
  | '5min'
  | '15min'
  | '30min'
  | '1h'
  | '1h_plus'
  // Valores antigos (compatibilidade)
  | '15_minutos'
  | '30_minutos'
  | '1_hora'
  | 'mais_1_hora'

export type ExperienciaHerbalife =
  | 'nenhuma'
  | 'ja_vendi'
  | 'supervisor'
  | 'get_plus'
  // Valores antigos (compatibilidade)
  | 'sim_regularmente'
  | 'ja_vendi_tempo'
  | 'nunca_vendi'

export type CanalPrincipal =
  | 'whatsapp'
  | 'instagram'
  | 'trafego_pago'
  | 'presencial'

export type PreparaBebidas =
  | 'sim'
  | 'nao'
  | 'aprender'
  | 'nunca'

export type TrabalhaCom =
  | 'funcional'
  | 'fechado'
  | 'ambos'

export type AberturaRecrutar =
  | 'sim'
  | 'nao'
  | 'aprender'

export type PublicoPreferido =
  | 'saude'
  | 'estetica'
  | 'fitness'
  | 'maes'
  | 'jovens'
  | 'cansados'
  | 'renda_extra'
  | 'saudaveis'

export type TomComunicacao =
  | 'neutro'
  | 'extrovertido'
  | 'tecnico'
  | 'simples'

export type RitmoTrabalho =
  | 'lento'
  | 'medio'
  | 'rapido'

// =====================================================
// NOVOS TIPOS - PERFIL ESTRATÉGICO (Versão 2.0)
// =====================================================

export type TipoTrabalho =
  | 'bebidas_funcionais'
  | 'produtos_fechados'
  | 'cliente_que_indica'

export type FocoTrabalho =
  | 'renda_extra'
  | 'plano_carreira'
  | 'ambos'

export type GanhosPrioritarios =
  | 'vendas'
  | 'equipe'
  | 'ambos'

export type NivelHerbalife =
  | 'novo_distribuidor'
  | 'supervisor'
  | 'equipe_mundial'
  | 'equipe_expansao_global'
  | 'equipe_milionarios'
  | 'equipe_presidentes'

export type CargaHorariaDiaria =
  | '1_hora'
  | '1_a_2_horas'
  | '2_a_4_horas'
  | 'mais_4_horas'

export type DiasPorSemana =
  | '1_a_2_dias'
  | '3_a_4_dias'
  | '5_a_6_dias'
  | 'todos_dias'

export interface EstoqueItem {
  produto_id: string
  produto_nome: string
  quantidade: number
  categoria: 'bebida_funcional' | 'produto_fechado' | 'kit'
}

export interface WellnessConsultantProfile {
  id: string
  user_id: string
  
  // Dados do Perfil do Consultor
  nome?: string // Pode vir de user_profiles
  idade?: number
  cidade?: string
  tempo_disponivel?: TempoDisponivel
  experiencia_herbalife?: ExperienciaHerbalife
  objetivo_principal?: ObjetivoPrincipal
  canal_principal?: CanalPrincipal
  canal_preferido?: string[] // Array (compatibilidade com versão antiga)
  
  // Dados Operacionais
  prepara_bebidas?: PreparaBebidas
  trabalha_com?: TrabalhaCom
  estoque_atual?: EstoqueItem[] // JSONB
  meta_pv?: number // 100-10000
  meta_financeira?: number // 500-20000
  
  // Dados Sociais
  contatos_whatsapp?: number
  seguidores_instagram?: number
  abertura_recrutar?: AberturaRecrutar
  publico_preferido?: PublicoPreferido[] // Array
  
  // Preferências
  tom?: TomComunicacao
  ritmo?: RitmoTrabalho
  lembretes?: boolean
  
  // Situações Particulares
  situacoes_particulares?: string // Situações pessoais importantes para o NOEL (máx 500 caracteres)
  
  // =====================================================
  // NOVOS CAMPOS ESTRATÉGICOS (Versão 2.0)
  // =====================================================
  
  // 1. Tipo de Trabalho
  tipo_trabalho?: TipoTrabalho // Como pretende trabalhar
  
  // 2. Foco de Trabalho
  foco_trabalho?: FocoTrabalho // Renda extra, carreira ou ambos
  
  // 3. Ganhos Prioritários
  ganhos_prioritarios?: GanhosPrioritarios // Vendas, equipe ou ambos
  
  // 4. Nível Herbalife
  nivel_herbalife?: NivelHerbalife // Hierarquia oficial Herbalife
  
  // 5. Carga Horária Diária
  carga_horaria_diaria?: CargaHorariaDiaria // Tempo disponível por dia
  
  // 6. Dias por Semana
  dias_por_semana?: DiasPorSemana // Quantos dias por semana trabalha
  
  // 7. Meta 3 Meses
  meta_3_meses?: string // Plano tático imediato
  
  // 8. Meta 1 Ano
  meta_1_ano?: string // Plano estratégico (ligado ao Plano Presidente)
  
  // 9. Observações Adicionais
  observacoes_adicionais?: string // Informações extras importantes para o NOEL (máx 500 caracteres)
  
  // Dados antigos (compatibilidade)
  experiencia_vendas?: string
  tem_lista_contatos?: string
  
  // Status
  onboarding_completo?: boolean
  onboarding_iniciado_at?: string
  onboarding_completado_at?: string
  
  // Timestamps
  created_at: string
  updated_at: string
}

// =====================================================
// SCRIPTS
// =====================================================

export type ScriptCategoria =
  | 'tipo_pessoa'
  | 'objetivo'
  | 'etapa'
  | 'acompanhamento'
  | 'reativacao'
  | 'recrutamento'
  | 'interno'

export type ScriptSubcategoria =
  | 'pessoas_proximas'
  | 'indicacoes'
  | 'instagram'
  | 'mercado_frio'
  | 'clientes_ativos'
  | 'clientes_sumidos'
  | 'leads_ferramentas'
  | 'interessados_negocio'
  | 'energia'
  | 'metabolismo'
  | 'retencao'
  | 'foco'
  | 'emagrecimento'
  | 'rotina'
  | 'abertura'
  | 'curiosidade'
  | 'diagnostico'
  | 'proposta'
  | 'fechamento'
  | 'acompanhamento'
  | 'conclusao'
  | '7_dias'
  | '14_dias'
  | '30_dias'
  | 'semente'
  | 'pre_diagnostico'
  | 'hom'
  | 'pos_hom'
  | 'respostas_base'
  | 'apoio_emocional'
  | 'orientacoes_tecnicas'
  | 'correcao'
  | 'direcionamentos'
  | 'ativacao'

export type ScriptVersao =
  | 'curta'
  | 'media'
  | 'longa'
  | 'gatilho'
  | 'se_some'
  | 'se_negativa'
  | 'upgrade'

export interface WellnessScript {
  id: string
  categoria: ScriptCategoria
  subcategoria?: string
  nome: string
  versao: ScriptVersao
  conteudo: string
  tags?: string[]
  ordem: number
  ativo: boolean
  created_at: string
  updated_at: string
}

// =====================================================
// OBJEÇÕES
// =====================================================

export type ObjeçãoCategoria =
  | 'clientes'
  | 'clientes_recorrentes'
  | 'recrutamento'
  | 'distribuidores'
  | 'avancadas'

export interface WellnessObjeção {
  id: string
  categoria: ObjeçãoCategoria
  codigo: string // 'A.1', 'B.2', etc.
  objeção: string
  versao_curta?: string
  versao_media?: string
  versao_longa?: string
  gatilho_retomada?: string
  resposta_se_some?: string
  resposta_se_negativa?: string
  upgrade?: string
  tags?: string[]
  ordem: number
  ativo: boolean
  created_at: string
  updated_at: string
}

// =====================================================
// CONFIGURAÇÕES NOEL
// =====================================================

export interface WellnessNoelConfig {
  id: string
  chave: string
  valor: Record<string, any>
  descricao?: string
  updated_at: string
}

// =====================================================
// INTERAÇÕES
// =====================================================

export type TipoInteracao =
  | 'pergunta'
  | 'solicitacao_script'
  | 'objeção'
  | 'feedback'
  | 'diagnostico'
  | 'acompanhamento'

export interface WellnessInteractionContext {
  pessoa_tipo?: 'proximo' | 'indicacao' | 'instagram' | 'mercado_frio' | 'cliente_ativo' | 'cliente_sumido'
  objetivo?: 'energia' | 'metabolismo' | 'retencao' | 'foco' | 'emagrecimento' | 'rotina'
  etapa?: 'abertura' | 'curiosidade' | 'diagnostico' | 'proposta' | 'fechamento' | 'acompanhamento'
  modo_operacao?: string
  cliente_id?: string
  prospect_id?: string
}

export interface WellnessConsultantInteraction {
  id: string
  consultant_id: string
  tipo_interacao: TipoInteracao
  contexto?: WellnessInteractionContext
  mensagem_usuario: string
  resposta_noel: string
  script_usado_id?: string
  objeção_tratada_id?: string
  satisfacao?: number // 1-5
  created_at: string
}

// =====================================================
// PERFIS DE CLIENTES
// =====================================================

export type TipoPessoa =
  | 'proximo'
  | 'indicacao'
  | 'instagram'
  | 'mercado_frio'
  | 'cliente_ativo'
  | 'cliente_sumido'

export type ObjetivoCliente =
  | 'energia'
  | 'metabolismo'
  | 'retencao'
  | 'foco'
  | 'emagrecimento'
  | 'rotina'

export type StatusCliente =
  | 'lead'
  | 'cliente_kit'
  | 'cliente_recorrente'
  | 'inativo'
  | 'reativado'

export interface WellnessClientProfile {
  id: string
  consultant_id: string
  cliente_nome?: string
  cliente_contato?: string
  tipo_pessoa?: TipoPessoa
  objetivo_principal?: ObjetivoCliente
  status: StatusCliente
  ultima_interacao?: string
  proxima_acao?: string
  historico: any[] // Array de interações
  created_at: string
  updated_at: string
}

// =====================================================
// PROSPECTS DE RECRUTAMENTO
// =====================================================

export type OrigemProspect =
  | 'cliente'
  | 'indicacao'
  | 'instagram'
  | 'hom'
  | 'mercado_frio'

export type InteresseProspect =
  | 'renda_extra'
  | 'tempo_livre'
  | 'bem_estar'
  | 'proposito'
  | 'crescimento'

export type EtapaRecrutamento =
  | 'semente'
  | 'abertura'
  | 'pre_diagnostico'
  | 'hom'
  | 'pos_hom'
  | 'fechamento'

export type StatusProspect =
  | 'ativo'
  | 'pausado'
  | 'convertido'
  | 'desistiu'

export interface WellnessRecruitmentProspect {
  id: string
  consultant_id: string
  prospect_nome?: string
  prospect_contato?: string
  origem?: OrigemProspect
  interesse?: InteresseProspect
  etapa: EtapaRecrutamento
  status: StatusProspect
  observacoes?: string
  historico: any[]
  created_at: string
  updated_at: string
}

// =====================================================
// MODOS DE OPERAÇÃO NOEL
// =====================================================

export type NoelOperationMode =
  | 'venda'
  | 'upsell'
  | 'reativacao'
  | 'recrutamento'
  | 'acompanhamento'
  | 'treinamento'
  | 'suporte'
  | 'diagnostico'
  | 'personalizacao'
  | 'emergencia'

// =====================================================
// REQUISIÇÕES E RESPOSTAS API
// =====================================================

export interface NoelRequest {
  mensagem: string
  contexto?: WellnessInteractionContext
  modo_operacao?: NoelOperationMode
  cliente_id?: string
  prospect_id?: string
}

export interface NoelResponse {
  resposta: string
  script_sugerido?: WellnessScript
  objeção_tratada?: WellnessObjeção
  modo_operacao: NoelOperationMode
  proxima_acao?: string
  tags?: string[]
}

// =====================================================
// FILTROS E BUSCAS
// =====================================================

export interface ScriptFilter {
  categoria?: ScriptCategoria
  subcategoria?: string
  versao?: ScriptVersao
  tags?: string[]
  ativo?: boolean
}

export interface ObjeçãoFilter {
  categoria?: ObjeçãoCategoria
  codigo?: string
  tags?: string[]
  ativo?: boolean
}
