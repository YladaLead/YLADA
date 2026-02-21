/**
 * Fluxos de preenchimento do perfil empresarial por tipo (liberal vs vendas) e por profissão.
 * Regra: profession sempre pertence a um segment (whitelist). Campos com source/path (mapTo) para persistência explícita.
 * @see docs/PERFIL-POR-TOPICO-PROFISSAO-FLUXOS.md
 */

export type ProfileType = 'liberal' | 'vendas'

/** Tópico operacional (o que muda flow e linguagem). Sempre validado contra o segment. */
export type ProfessionCode =
  | 'medico'
  | 'estetica'
  | 'odonto'
  | 'psi'
  | 'psicanalise'
  | 'coach'
  | 'nutricionista'
  | 'vendedor_suplementos'
  | 'vendedor_cosmeticos'
  | 'vendedor_servicos'
  | 'vendedor_produtos'
  | 'vendedor'
  | 'outro'

/** Definição de um campo no flow: onde salva (mapTo) e metadados para o wizard. */
export interface ProfileFieldDef {
  /** Identificador do campo (ex.: dor_principal, especialidades). */
  key: string
  /** Onde persistir: coluna da tabela ou area_specific. */
  source: 'column' | 'area_specific'
  /** Para source=area_specific: chave dentro do JSON (path). Para column: igual a key. */
  path?: string
  required?: boolean
  type?: 'text' | 'number' | 'select' | 'multiselect' | 'textarea'
  options?: { value: string; label: string }[]
  /** Campos dos quais este depende (ex.: mostrar "outra" só se selecionou "outra"). */
  dependsOn?: string[]
}

export interface ProfileFlowStep {
  id: string
  title: string
  description?: string
  fields: ProfileFieldDef[]
}

export interface ProfileFlowConfig {
  flow_id: string
  flow_version: number
  profile_type: ProfileType
  profession?: ProfessionCode
  steps: ProfileFlowStep[]
}

/** Whitelist: profession sempre pertence a um segment. Evita profissão solta e combinações estranhas. */
export const PROFESSION_BY_SEGMENT: Record<string, ProfessionCode[]> = {
  ylada: [
    'medico',
    'estetica',
    'odonto',
    'psi',
    'nutricionista',
    'coach',
    'outro',
    'vendedor_suplementos',
    'vendedor_cosmeticos',
    'vendedor_servicos',
    'vendedor_produtos',
  ],
  med: ['medico'],
  odonto: ['odonto'],
  nutra: ['nutricionista', 'vendedor_suplementos'],
  psi: ['psi'],
  psicanalise: ['psicanalise'],
  coach: ['coach'],
  seller: ['vendedor'],
}

/** Valida se a profissão é permitida para o segment. */
export function validateProfessionForSegment(segment: string, profession: string | null | undefined): boolean {
  if (!profession || !segment) return true
  const allowed = PROFESSION_BY_SEGMENT[segment]
  if (!allowed) return false
  return allowed.includes(profession as ProfessionCode)
}

/** Profile_type por profissão (inferir fluxo a partir da escolha do usuário). */
export const PROFILE_TYPE_BY_PROFESSION: Record<ProfessionCode, ProfileType> = {
  medico: 'liberal',
  estetica: 'liberal',
  odonto: 'liberal',
  psi: 'liberal',
  psicanalise: 'liberal',
  coach: 'liberal',
  nutricionista: 'liberal',
  vendedor_suplementos: 'vendas',
  vendedor_cosmeticos: 'vendas',
  vendedor_servicos: 'vendas',
  vendedor_produtos: 'vendas',
  vendedor: 'vendas',
  outro: 'liberal',
}

export const PROFILE_TYPE_LABELS: Record<ProfileType, string> = {
  liberal: 'Atendo clientes diretamente (consultório, clínica, atendimento individual)',
  vendas: 'Trabalho com vendas de produtos ou serviços (suplementos, cosméticos, etc.)',
}

/** Rótulo da pergunta do segundo campo (área principal vs o que vende) conforme tipo. */
export const PROFESSION_FIELD_LABEL_BY_TYPE: Record<ProfileType, string> = {
  liberal: 'Qual é sua área principal?',
  vendas: 'O que você vende principalmente?',
}

export const PROFESSION_LABELS: Record<ProfessionCode, string> = {
  medico: 'Médico',
  estetica: 'Estética',
  odonto: 'Odontologia',
  psi: 'Psicologia',
  psicanalise: 'Psicanalista',
  coach: 'Coaching',
  nutricionista: 'Nutrição',
  vendedor_suplementos: 'Suplementos / Nutra',
  vendedor_cosmeticos: 'Cosméticos / Estética',
  vendedor_servicos: 'Serviços',
  vendedor_produtos: 'Produtos físicos',
  vendedor: 'Vendedor(a)',
  outro: 'Outro',
}

/** Resolve onde persistir o valor: coluna ou area_specific.path. */
export function getFieldPersistTarget(field: ProfileFieldDef): { source: 'column' | 'area_specific'; path: string } {
  if (field.source === 'column') return { source: 'column', path: field.key }
  return { source: 'area_specific', path: field.path ?? field.key }
}

// ========== Copy dinâmico por profissão (títulos, descrições, labels, placeholders) ==========

export interface ProfessionHeaderCopy {
  title: string
  subtitle?: string
}

export interface ProfessionIdentityCopy {
  youAre: string
  objective: string
}

/** Cabeçalho da página do perfil por profissão. */
export const PROFESSION_HEADER: Partial<Record<ProfessionCode, ProfessionHeaderCopy>> = {
  medico: {
    title: 'Perfil estratégico para médicos',
    subtitle: 'Contexto da sua prática e modelo de atuação.',
  },
  estetica: {
    title: 'Perfil estratégico para profissionais de estética',
    subtitle: 'Estrutura do seu atendimento.',
  },
  odonto: {
    title: 'Perfil estratégico para dentistas',
    subtitle: 'Estrutura do consultório.',
  },
  psi: {
    title: 'Perfil estratégico para psicólogos',
    subtitle: 'Modelo de atendimento.',
  },
  coach: {
    title: 'Perfil estratégico para coaches',
    subtitle: 'Modelo de atuação.',
  },
  nutricionista: {
    title: 'Perfil estratégico para nutricionistas',
    subtitle: 'Estrutura do atendimento.',
  },
  vendedor_suplementos: {
    title: 'Perfil estratégico para vendas de suplementos',
    subtitle: 'Estrutura comercial.',
  },
  vendedor_cosmeticos: {
    title: 'Perfil estratégico para vendas (cosméticos)',
    subtitle: 'Vamos entender seu modelo de vendas.',
  },
  vendedor_servicos: {
    title: 'Perfil estratégico para vendas (serviços)',
    subtitle: 'Vamos entender seu modelo de atuação.',
  },
  vendedor_produtos: {
    title: 'Perfil estratégico para vendas',
    subtitle: 'Vamos entender seu modelo de vendas.',
  },
  vendedor: {
    title: 'Perfil estratégico para vendas',
    subtitle: 'Vamos entender seu modelo de atuação.',
  },
  outro: {
    title: 'Perfil estratégico',
    subtitle: 'Sua área de atuação.',
  },
}

/** Linha de identidade: "Você é: X" / "Objetivo: Y". */
export const PROFESSION_IDENTITY: Partial<Record<ProfessionCode, ProfessionIdentityCopy>> = {
  medico: { youAre: 'Médico', objective: 'Estruturar sua prática com estratégia.' },
  estetica: { youAre: 'Estética', objective: 'Estruturar seu atendimento com estratégia.' },
  odonto: { youAre: 'Odontologia', objective: 'Estruturar sua prática com estratégia.' },
  psi: { youAre: 'Psicologia', objective: 'Estruturar sua prática clínica.' },
  coach: { youAre: 'Coaching', objective: 'Estruturar sua atuação com estratégia.' },
  nutricionista: { youAre: 'Nutrição', objective: 'Estruturar sua prática profissional.' },
  vendedor_suplementos: { youAre: 'Vendas (Nutra)', objective: 'Estruturar seu funil e suas vendas.' },
  vendedor_cosmeticos: { youAre: 'Vendas (cosméticos)', objective: 'Estruturar seu modelo de vendas.' },
  vendedor_servicos: { youAre: 'Vendas (serviços)', objective: 'Estruturar seu modelo de atuação.' },
  vendedor_produtos: { youAre: 'Vendas', objective: 'Estruturar seu modelo de vendas.' },
  vendedor: { youAre: 'Vendedor(a)', objective: 'Estruturar seu modelo de atuação.' },
}

/** Parte do cabeçalho por step: "Etapa X de Y — {stepHeaderPart}". */
export type StepCopyEntry = {
  title: string
  description?: string
  microcopy?: string
  /** Frase de reforço (opcional) no fim da etapa. */
  reinforcement?: string
  /** Texto após "Etapa X de Y — " no topo. */
  stepHeaderPart?: string
}

/** Título e descrição do step por profissão (stepId -> profession -> copy). Fallback: step.title/description. */
export const STEP_COPY_BY_PROFESSION: Record<string, Partial<Record<ProfessionCode, StepCopyEntry>>> = {
  contexto: {
    medico: {
      stepHeaderPart: 'Contexto da sua prática',
      title: 'Como você atua na sua prática médica?',
      description: 'Quanto mais específico for seu perfil, mais estratégicas serão as orientações do Noel para sua clínica ou consultório.',
      reinforcement: 'Isso ajudará o Noel a orientar você com foco real em posicionamento e agenda.',
    },
    estetica: {
      stepHeaderPart: 'Estrutura do seu atendimento',
      title: 'Como está estruturado seu atendimento estético hoje?',
      description: 'Vamos entender seu foco principal para que as estratégias sejam direcionadas ao seu tipo de serviço.',
      reinforcement: 'Isso ajuda o Noel a trabalhar estratégias de agenda e recorrência específicas para o seu nicho.',
    },
    odonto: {
      stepHeaderPart: 'Estrutura do consultório',
      title: 'Como está estruturada sua prática odontológica?',
      description: 'Queremos entender sua especialidade e modelo de atuação para direcionar melhor suas estratégias.',
    },
    psi: {
      stepHeaderPart: 'Modelo de atendimento',
      title: 'Como você estrutura seus atendimentos?',
      description: 'Isso ajuda o Noel a orientar você com foco em posicionamento e captação ética.',
    },
    coach: {
      stepHeaderPart: 'Modelo de atuação',
      title: 'Como você estrutura seu trabalho como coach?',
      description: 'Isso ajuda o Noel a orientar você em posicionamento, oferta e autoridade.',
    },
    nutricionista: {
      stepHeaderPart: 'Estrutura do atendimento',
      title: 'Como você atua hoje como nutricionista?',
      description: 'Vamos entender seu posicionamento para que as estratégias sejam adaptadas ao seu perfil profissional.',
    },
    outro: {
      stepHeaderPart: 'Contexto da sua atuação',
      title: 'Como você atua na sua área?',
      description: 'Quanto mais específico for seu perfil, mais estratégicas serão as orientações do Noel.',
    },
  },
  especialidade: {
    medico: {
      stepHeaderPart: 'Especialidade e aprofundamento',
      title: 'Especialidade e aprofundamento',
      description: 'Detalhe sua atuação para orientações mais precisas.',
    },
    estetica: {
      stepHeaderPart: 'Sua área na estética',
      title: 'Sua área na estética',
      description: 'Isso ajuda o Noel a falar a sua linguagem.',
    },
    odonto: { stepHeaderPart: 'Especialidade' },
    psi: { stepHeaderPart: 'Abordagem e público' },
    coach: { stepHeaderPart: 'Nicho e modelo' },
    nutricionista: { stepHeaderPart: 'Área e modalidade' },
    outro: { stepHeaderPart: 'Detalhes da atuação' },
  },
  diagnostico: {
    medico: {
      stepHeaderPart: 'Diagnóstico',
      title: 'Diagnóstico',
      description: 'O que está travando agora na sua prática?',
    },
    estetica: { stepHeaderPart: 'Diagnóstico' },
    odonto: { stepHeaderPart: 'Diagnóstico' },
    psi: { stepHeaderPart: 'Diagnóstico' },
    coach: { stepHeaderPart: 'Diagnóstico' },
    nutricionista: { stepHeaderPart: 'Diagnóstico' },
    outro: { stepHeaderPart: 'Diagnóstico' },
  },
  metas_modelo: {
    medico: { stepHeaderPart: 'Metas e modelo' },
    estetica: { stepHeaderPart: 'Metas e modelo' },
    odonto: { stepHeaderPart: 'Metas e modelo' },
    psi: { stepHeaderPart: 'Metas e modelo' },
    coach: { stepHeaderPart: 'Metas e modelo' },
    nutricionista: { stepHeaderPart: 'Metas e modelo' },
    outro: { stepHeaderPart: 'Metas e modelo' },
  },
  canais_rotina: {
    medico: { stepHeaderPart: 'Canais e rotina' },
    estetica: { stepHeaderPart: 'Canais e rotina' },
    odonto: { stepHeaderPart: 'Canais e rotina' },
    psi: { stepHeaderPart: 'Canais e rotina' },
    coach: { stepHeaderPart: 'Canais e rotina' },
    nutricionista: { stepHeaderPart: 'Canais e rotina' },
    outro: { stepHeaderPart: 'Canais e rotina' },
  },
  observacoes: {
    medico: { stepHeaderPart: 'Observações' },
    estetica: { stepHeaderPart: 'Observações' },
    odonto: { stepHeaderPart: 'Observações' },
    psi: { stepHeaderPart: 'Observações' },
    coach: { stepHeaderPart: 'Observações' },
    nutricionista: { stepHeaderPart: 'Observações' },
    outro: { stepHeaderPart: 'Observações' },
  },
  tipo_atuacao: {
    vendedor_suplementos: {
      stepHeaderPart: 'Estrutura comercial',
      title: 'Como funciona seu modelo de vendas hoje?',
      description: 'Vamos entender seu funil atual para que o Noel possa ajudar a aumentar conversão e ticket.',
    },
    vendedor_cosmeticos: {
      title: 'Como funciona seu modelo de vendas?',
      description: 'O que você vende ou oferece.',
    },
    vendedor_servicos: {
      title: 'Como funciona seu modelo de atuação?',
      description: 'O que você oferece.',
    },
    vendedor_produtos: {
      title: 'Como funciona seu modelo de vendas?',
      description: 'O que você vende ou oferece.',
    },
    vendedor: {
      title: 'Como funciona seu modelo de vendas?',
      description: 'O que você vende ou oferece.',
    },
  },
  funil_ticket: {
    vendedor_suplementos: {
      title: 'Funil e ticket',
      description: 'Capacidade, ticket médio e como você cobra.',
    },
  },
}

/** Labels de campos por profissão (fieldKey -> label). Fallback: PROFILE_FIELD_LABELS em ylada-profile. */
export const FIELD_LABELS_BY_PROFESSION: Partial<Record<ProfessionCode, Record<string, string>>> = {
  medico: {
    category: 'Especialidade principal',
    sub_category: 'Subespecialidade (se houver)',
    publico_principal: 'Você atende principalmente',
    tempo_atuacao_anos: 'Há quantos anos você atua como médico?',
    especialidades: 'Especialidades',
    especialidade_outra: 'Outra especialidade',
    foco_principal: 'Seu foco principal hoje é',
    dor_principal: 'O que mais está travando na sua prática agora?',
    desperdicio_principal: 'Onde você sente maior desperdício hoje?',
    prioridade_atual: 'O que você quer destravar primeiro?',
    fase_negocio: 'Fase da sua prática',
    metas_principais: 'Metas principais',
    objetivos_curto_prazo: 'Objetivos curto e médio prazo',
    modelo_atuacao: 'Como você atende (consultório, online, etc.)',
    modelo_receita: 'Você trabalha com',
    capacidade_semana: 'Quantos atendimentos por semana você consegue fazer?',
    ticket_medio: 'Valor médio da consulta (R$)',
    modelo_pagamento: 'Forma de pagamento',
    canais_principais: 'De onde vêm a maioria dos seus pacientes hoje?',
    equipe_operacional: 'Você tem secretária ou faz tudo sozinho?',
    rotina_atual_resumo: 'Como está sua rotina hoje?',
    frequencia_postagem: 'Com que frequência você posta ou divulga?',
    observacoes: 'Algo mais que o Noel deve saber?',
  },
  estetica: {
    area_estetica: 'Qual é sua área principal na estética?',
    estetica_tipo_atuacao: 'Você atua como',
    category: 'Qual é sua área principal na estética?',
    sub_category: 'Subárea ou nicho (opcional)',
    tempo_atuacao_anos: 'Há quantos anos você atua na área?',
    dor_principal: 'O que mais está travando agora?',
    prioridade_atual: 'O que você quer destravar primeiro?',
    fase_negocio: 'Fase do seu negócio',
    metas_principais: 'Metas principais',
    objetivos_curto_prazo: 'Objetivos curto e médio prazo',
    modelo_atuacao: 'Você atua como',
    capacidade_semana: 'Quantos atendimentos por semana?',
    ticket_medio: 'Ticket médio (R$)',
    canais_principais: 'Onde seus clientes te encontram?',
    rotina_atual_resumo: 'Como está sua rotina hoje?',
    observacoes: 'Algo mais que o Noel deve saber?',
  },
  odonto: {
    category: 'Especialidade principal',
    sub_category: 'Subespecialidade (opcional)',
    odonto_voce_atende: 'Você atende',
    tempo_atuacao_anos: 'Há quantos anos atua como dentista?',
    modelo_pagamento: 'Forma de pagamento',
    dor_principal: 'O que mais está travando?',
    prioridade_atual: 'O que você quer destravar primeiro?',
    fase_negocio: 'Fase do consultório',
    metas_principais: 'Metas principais',
    objetivos_curto_prazo: 'Objetivos curto e médio prazo',
    capacidade_semana: 'Quantos atendimentos por semana?',
    ticket_medio: 'Ticket médio (R$)',
    canais_principais: 'Onde seus pacientes te encontram?',
    rotina_atual_resumo: 'Como está sua rotina hoje?',
    observacoes: 'Algo mais que o Noel deve saber?',
  },
  psi: {
    category: 'Abordagem principal',
    sub_category: 'Subárea ou abordagem (opcional)',
    publico_psi: 'Atende qual público?',
    modalidade_atendimento: 'Atendimento',
    tempo_atuacao_anos: 'Há quantos anos você atua na psicologia?',
    modelo_atuacao: 'Atendimento',
    dor_principal: 'O que mais está travando?',
    prioridade_atual: 'O que você quer destravar primeiro?',
    fase_negocio: 'Fase da sua prática',
    metas_principais: 'Metas principais',
    objetivos_curto_prazo: 'Objetivos curto e médio prazo',
    capacidade_semana: 'Quantos atendimentos por semana?',
    ticket_medio: 'Valor médio da sessão (R$)',
    canais_principais: 'Onde seus clientes te encontram?',
    rotina_atual_resumo: 'Como está sua rotina hoje?',
    observacoes: 'Algo mais que o Noel deve saber?',
  },
  coach: {
    category: 'Nicho principal',
    sub_category: 'Subárea (opcional)',
    modelo_entrega_coach: 'Modelo de entrega',
    tempo_atuacao_anos: 'Tempo de atuação',
    modelo_atuacao: 'Modelo de entrega',
    dor_principal: 'O que mais está travando?',
    prioridade_atual: 'O que você quer destravar primeiro?',
    fase_negocio: 'Fase do seu negócio',
    metas_principais: 'Metas principais',
    objetivos_curto_prazo: 'Objetivos curto e médio prazo',
    capacidade_semana: 'Quantas sessões ou entregas por semana?',
    ticket_medio: 'Ticket médio (R$)',
    canais_principais: 'Onde seus clientes te encontram?',
    rotina_atual_resumo: 'Como está sua rotina hoje?',
    observacoes: 'Algo mais que o Noel deve saber?',
  },
  nutricionista: {
    area_nutri: 'Área principal de atuação',
    modalidade_atendimento: 'Atendimento',
    category: 'Área principal de atuação',
    sub_category: 'Subárea (opcional)',
    tempo_atuacao_anos: 'Tempo de atuação',
    modelo_atuacao: 'Atendimento',
    dor_principal: 'O que mais está travando?',
    prioridade_atual: 'O que você quer destravar primeiro?',
    fase_negocio: 'Fase do seu negócio',
    metas_principais: 'Metas principais',
    objetivos_curto_prazo: 'Objetivos curto e médio prazo',
    capacidade_semana: 'Quantos atendimentos por semana?',
    ticket_medio: 'Ticket médio (R$)',
    canais_principais: 'Onde seus clientes te encontram?',
    rotina_atual_resumo: 'Como está sua rotina hoje?',
    observacoes: 'Algo mais que o Noel deve saber?',
  },
  vendedor_suplementos: {
    categoria: 'Categoria do produto (ex.: vitamínico, proteína)',
    oferta: 'Você vende principalmente',
    canal_principal_vendas: 'Canal principal de vendas',
    capacidade_semana: 'Quantos atendimentos ou vendas por semana?',
    ticket_medio: 'Ticket médio (R$)',
    dor_principal: 'O que mais está travando nas vendas?',
    prioridade_atual: 'O que você quer destravar primeiro?',
  },
  vendedor_cosmeticos: {
    categoria: 'Tipo de produto ou serviço',
    oferta: 'Você vende produto, serviço ou os dois?',
    canal_principal_vendas: 'Seu principal canal de vendas',
  },
  vendedor_servicos: {
    categoria: 'Tipo de serviço que você oferece',
    oferta: 'O que você oferece?',
    canal_principal_vendas: 'Seu principal canal de captação',
  },
  vendedor_produtos: {
    categoria: 'Categoria do produto',
    oferta: 'Você vende produto, serviço ou os dois?',
    canal_principal_vendas: 'Seu principal canal de vendas',
  },
  vendedor: {
    categoria: 'O que você vende ou oferece?',
    oferta: 'Produto, serviço ou ambos?',
    canal_principal_vendas: 'Seu principal canal de vendas',
  },
  outro: {
    category: 'Sua área ou especialidade',
    sub_category: 'Subárea (opcional)',
    tempo_atuacao_anos: 'Há quantos anos você atua na área?',
    dor_principal: 'O que mais está travando?',
    prioridade_atual: 'O que você quer destravar primeiro?',
    fase_negocio: 'Fase do seu negócio',
    metas_principais: 'Metas principais',
    objetivos_curto_prazo: 'Objetivos curto e médio prazo',
    modelo_atuacao: 'Como você atende',
    capacidade_semana: 'Capacidade por semana',
    ticket_medio: 'Ticket médio (R$)',
    canais_principais: 'Onde seus clientes te encontram?',
    rotina_atual_resumo: 'Como está sua rotina hoje?',
    observacoes: 'Algo mais que o Noel deve saber?',
  },
}

/** Placeholders por profissão (fieldKey -> placeholder). */
export const FIELD_PLACEHOLDERS_BY_PROFESSION: Partial<Record<ProfessionCode, Record<string, string>>> = {
  medico: {
    category: 'Ex.: clínica geral, dermatologia, ortopedia',
    sub_category: 'Ex.: pediatria, geriatria',
    prioridade_atual: 'Ex.: preencher agenda nos próximos 30 dias',
  },
  estetica: {
    category: 'Ex.: facial, corporal, capilar',
    sub_category: 'Ex.: preenchimento, limpeza de pele',
    prioridade_atual: 'Ex.: aumentar agenda, divulgar mais',
  },
  vendedor_suplementos: {
    categoria: 'Ex.: vitamínicos, proteína, termogênicos',
    prioridade_atual: 'Ex.: fechar mais vendas, aumentar ticket',
  },
}

/** Retorna título, descrição e opcionais (microcopy, reinforcement, stepHeaderPart) do step para a profissão. */
export function getStepCopyForProfession(
  stepId: string,
  profession: ProfessionCode | undefined,
  fallback: { title: string; description?: string }
): StepCopyEntry {
  const byProfession = profession && STEP_COPY_BY_PROFESSION[stepId]?.[profession]
  if (byProfession) {
    return { ...fallback, ...byProfession }
  }
  return { ...fallback }
}

/** Retorna label do campo para a profissão (com fallback). */
export function getFieldLabelForProfession(
  fieldKey: string,
  profession: ProfessionCode | undefined,
  fallbackLabel: string
): string {
  if (!profession) return fallbackLabel
  const byProfession = FIELD_LABELS_BY_PROFESSION[profession]?.[fieldKey]
  return byProfession ?? fallbackLabel
}

/** Retorna placeholder do campo para a profissão (com fallback). */
export function getFieldPlaceholderForProfession(
  fieldKey: string,
  profession: ProfessionCode | undefined,
  fallbackPlaceholder?: string
): string | undefined {
  if (!profession) return fallbackPlaceholder
  const byProfession = FIELD_PLACEHOLDERS_BY_PROFESSION[profession]?.[fieldKey]
  return byProfession ?? fallbackPlaceholder
}

// ----- Fluxo liberal.medico (exemplo completo com mapTo) -----

/** Fluxo liberal completo para médico (com campos estratégicos). */
const LIBERAL_MEDICO_STEPS: ProfileFlowStep[] = [
  {
    id: 'contexto',
    title: 'Contexto',
    description: 'Mercado e tempo de atuação.',
    fields: [
      { key: 'category', source: 'column', required: false, type: 'text' },
      { key: 'sub_category', source: 'column', required: false, type: 'text' },
      { key: 'publico_principal', source: 'area_specific', path: 'publico_principal', required: false, type: 'multiselect' },
      { key: 'tempo_atuacao_anos', source: 'column', required: false, type: 'number' },
    ],
  },
  {
    id: 'especialidade',
    title: 'Especialidade / Aprofundamento',
    description: 'Detalhe sua atuação para orientações mais precisas.',
    fields: [
      { key: 'especialidades', source: 'area_specific', path: 'especialidades', required: false, type: 'multiselect' },
      { key: 'especialidade_outra', source: 'area_specific', path: 'especialidade_outra', required: false, type: 'text', dependsOn: ['especialidades'] },
      { key: 'foco_principal', source: 'area_specific', path: 'foco_principal', required: false, type: 'select' },
    ],
  },
  {
    id: 'diagnostico',
    title: 'Diagnóstico',
    description: 'O que está travando agora.',
    fields: [
      { key: 'dor_principal', source: 'column', required: false, type: 'select' },
      { key: 'desperdicio_principal', source: 'area_specific', path: 'desperdicio_principal', required: false, type: 'multiselect' },
      { key: 'prioridade_atual', source: 'column', required: false, type: 'text' },
      { key: 'fase_negocio', source: 'column', required: false, type: 'select' },
    ],
  },
  {
    id: 'metas_modelo',
    title: 'Metas e modelo de atuação',
    fields: [
      { key: 'modelo_receita', source: 'area_specific', path: 'modelo_receita', required: false, type: 'select' },
      { key: 'metas_principais', source: 'column', required: false, type: 'text' },
      { key: 'objetivos_curto_prazo', source: 'column', required: false, type: 'text' },
      { key: 'modelo_atuacao', source: 'column', required: false, type: 'multiselect' },
      { key: 'capacidade_semana', source: 'column', required: false, type: 'number' },
      { key: 'ticket_medio', source: 'column', required: false, type: 'number' },
      { key: 'modelo_pagamento', source: 'column', required: false, type: 'select' },
    ],
  },
  {
    id: 'canais_rotina',
    title: 'Canais e rotina',
    fields: [
      { key: 'canais_principais', source: 'column', required: false, type: 'multiselect' },
      { key: 'equipe_operacional', source: 'area_specific', path: 'equipe_operacional', required: false, type: 'select' },
      { key: 'rotina_atual_resumo', source: 'column', required: false, type: 'textarea' },
      { key: 'frequencia_postagem', source: 'column', required: false, type: 'text' },
    ],
  },
  {
    id: 'observacoes',
    title: 'Observações',
    fields: [{ key: 'observacoes', source: 'column', required: false, type: 'textarea' }],
  },
]

/** Fluxo liberal genérico (estética, odonto, psi, coach, nutricionista, outro) — mesmas etapas, sem campos só de médico. */
const LIBERAL_GENERIC_STEPS: ProfileFlowStep[] = [
  {
    id: 'contexto',
    title: 'Contexto',
    description: 'Mercado e tempo de atuação.',
    fields: [
      { key: 'category', source: 'column', required: false, type: 'text' },
      { key: 'sub_category', source: 'column', required: false, type: 'text' },
      { key: 'tempo_atuacao_anos', source: 'column', required: false, type: 'number' },
    ],
  },
  {
    id: 'especialidade',
    title: 'Especialidade / Aprofundamento',
    description: 'Detalhe sua atuação para orientações mais precisas.',
    fields: [
      { key: 'especialidades', source: 'area_specific', path: 'especialidades', required: false, type: 'multiselect' },
      { key: 'especialidade_outra', source: 'area_specific', path: 'especialidade_outra', required: false, type: 'text', dependsOn: ['especialidades'] },
    ],
  },
  {
    id: 'diagnostico',
    title: 'Diagnóstico',
    description: 'O que está travando agora.',
    fields: [
      { key: 'dor_principal', source: 'column', required: false, type: 'select' },
      { key: 'prioridade_atual', source: 'column', required: false, type: 'text' },
      { key: 'fase_negocio', source: 'column', required: false, type: 'select' },
    ],
  },
  {
    id: 'metas_modelo',
    title: 'Metas e modelo de atuação',
    fields: [
      { key: 'metas_principais', source: 'column', required: false, type: 'text' },
      { key: 'objetivos_curto_prazo', source: 'column', required: false, type: 'text' },
      { key: 'modelo_atuacao', source: 'column', required: false, type: 'multiselect' },
      { key: 'capacidade_semana', source: 'column', required: false, type: 'number' },
      { key: 'ticket_medio', source: 'column', required: false, type: 'number' },
      { key: 'modelo_pagamento', source: 'column', required: false, type: 'select' },
    ],
  },
  {
    id: 'canais_rotina',
    title: 'Canais e rotina',
    fields: [
      { key: 'canais_principais', source: 'column', required: false, type: 'multiselect' },
      { key: 'rotina_atual_resumo', source: 'column', required: false, type: 'textarea' },
      { key: 'frequencia_postagem', source: 'column', required: false, type: 'text' },
    ],
  },
  {
    id: 'observacoes',
    title: 'Observações',
    fields: [{ key: 'observacoes', source: 'column', required: false, type: 'textarea' }],
  },
]

// ----- Fluxo vendas.vendedor_suplementos (exemplo completo) -----

const VENDAS_VENDEDOR_SUPLEMENTOS_STEPS: ProfileFlowStep[] = [
  {
    id: 'tipo_atuacao',
    title: 'Tipo de atuação',
    description: 'O que você vende ou oferece.',
    fields: [
      { key: 'oferta', source: 'area_specific', path: 'oferta', required: false, type: 'select' },
      { key: 'categoria', source: 'area_specific', path: 'categoria', required: false, type: 'text' },
      { key: 'canal_principal_vendas', source: 'area_specific', path: 'canal_principal_vendas', required: false, type: 'select' },
    ],
  },
  {
    id: 'funil_ticket',
    title: 'Funil e ticket',
    description: 'Capacidade, ticket médio e modelo de pagamento.',
    fields: [
      { key: 'capacidade_semana', source: 'column', required: false, type: 'number' },
      { key: 'ticket_medio', source: 'column', required: false, type: 'number' },
      { key: 'modelo_pagamento', source: 'column', required: false, type: 'select' },
      { key: 'fase_negocio', source: 'column', required: false, type: 'select' },
    ],
  },
  {
    id: 'dor_prioridade',
    title: 'Dor e prioridade',
    fields: [
      { key: 'dor_principal', source: 'column', required: false, type: 'select' },
      { key: 'prioridade_atual', source: 'column', required: false, type: 'text' },
    ],
  },
  {
    id: 'metas_canais',
    title: 'Metas e canais',
    fields: [
      { key: 'metas_principais', source: 'column', required: false, type: 'text' },
      { key: 'objetivos_curto_prazo', source: 'column', required: false, type: 'text' },
      { key: 'canais_principais', source: 'column', required: false, type: 'multiselect' },
      { key: 'rotina_atual_resumo', source: 'column', required: false, type: 'textarea' },
    ],
  },
  {
    id: 'observacoes',
    title: 'Observações',
    fields: [{ key: 'observacoes', source: 'column', required: false, type: 'textarea' }],
  },
]

// ----- Fluxos liberal por profissão (campos estratégicos por área) -----

/** Estética: área principal (select), tipo de atuação, tempo. */
const LIBERAL_ESTETICA_STEPS: ProfileFlowStep[] = [
  {
    id: 'contexto',
    title: 'Contexto',
    description: 'Estrutura do seu atendimento.',
    fields: [
      { key: 'area_estetica', source: 'area_specific', path: 'area_estetica', required: false, type: 'select' },
      { key: 'estetica_tipo_atuacao', source: 'area_specific', path: 'estetica_tipo_atuacao', required: false, type: 'select' },
      { key: 'tempo_atuacao_anos', source: 'column', required: false, type: 'number' },
    ],
  },
  {
    id: 'especialidade',
    title: 'Sua área na estética',
    description: 'Subárea ou nicho (opcional).',
    fields: [{ key: 'sub_category', source: 'column', required: false, type: 'text' }],
  },
  {
    id: 'diagnostico',
    title: 'Diagnóstico',
    description: 'O que está travando agora.',
    fields: [
      { key: 'dor_principal', source: 'column', required: false, type: 'select' },
      { key: 'prioridade_atual', source: 'column', required: false, type: 'text' },
      { key: 'fase_negocio', source: 'column', required: false, type: 'select' },
    ],
  },
  {
    id: 'metas_modelo',
    title: 'Metas e modelo',
    fields: [
      { key: 'metas_principais', source: 'column', required: false, type: 'text' },
      { key: 'objetivos_curto_prazo', source: 'column', required: false, type: 'text' },
      { key: 'capacidade_semana', source: 'column', required: false, type: 'number' },
      { key: 'ticket_medio', source: 'column', required: false, type: 'number' },
      { key: 'modelo_pagamento', source: 'column', required: false, type: 'select' },
    ],
  },
  {
    id: 'canais_rotina',
    title: 'Canais e rotina',
    fields: [
      { key: 'canais_principais', source: 'column', required: false, type: 'multiselect' },
      { key: 'rotina_atual_resumo', source: 'column', required: false, type: 'textarea' },
      { key: 'frequencia_postagem', source: 'column', required: false, type: 'text' },
    ],
  },
  {
    id: 'observacoes',
    title: 'Observações',
    fields: [{ key: 'observacoes', source: 'column', required: false, type: 'textarea' }],
  },
]

/** Odonto: especialidade, você atende (Particular/Convênio/Misto), tempo. */
const LIBERAL_ODONTO_STEPS: ProfileFlowStep[] = [
  {
    id: 'contexto',
    title: 'Contexto',
    description: 'Estrutura do consultório.',
    fields: [
      { key: 'category', source: 'column', required: false, type: 'text' },
      { key: 'odonto_voce_atende', source: 'area_specific', path: 'odonto_voce_atende', required: false, type: 'select' },
      { key: 'tempo_atuacao_anos', source: 'column', required: false, type: 'number' },
    ],
  },
  {
    id: 'especialidade',
    title: 'Especialidade',
    description: 'Subespecialidade (opcional).',
    fields: [{ key: 'sub_category', source: 'column', required: false, type: 'text' }],
  },
  {
    id: 'diagnostico',
    title: 'Diagnóstico',
    fields: [
      { key: 'dor_principal', source: 'column', required: false, type: 'select' },
      { key: 'prioridade_atual', source: 'column', required: false, type: 'text' },
      { key: 'fase_negocio', source: 'column', required: false, type: 'select' },
    ],
  },
  {
    id: 'metas_modelo',
    title: 'Metas e modelo',
    fields: [
      { key: 'metas_principais', source: 'column', required: false, type: 'text' },
      { key: 'objetivos_curto_prazo', source: 'column', required: false, type: 'text' },
      { key: 'capacidade_semana', source: 'column', required: false, type: 'number' },
      { key: 'ticket_medio', source: 'column', required: false, type: 'number' },
      { key: 'modelo_pagamento', source: 'column', required: false, type: 'select' },
    ],
  },
  {
    id: 'canais_rotina',
    title: 'Canais e rotina',
    fields: [
      { key: 'canais_principais', source: 'column', required: false, type: 'multiselect' },
      { key: 'rotina_atual_resumo', source: 'column', required: false, type: 'textarea' },
      { key: 'frequencia_postagem', source: 'column', required: false, type: 'text' },
    ],
  },
  {
    id: 'observacoes',
    title: 'Observações',
    fields: [{ key: 'observacoes', source: 'column', required: false, type: 'textarea' }],
  },
]

/** Psi: abordagem, público (Adultos/Crianças/Casais/Empresas), modalidade (Presencial/Online/Ambos), tempo. */
const LIBERAL_PSI_STEPS: ProfileFlowStep[] = [
  {
    id: 'contexto',
    title: 'Contexto',
    description: 'Modelo de atendimento.',
    fields: [
      { key: 'category', source: 'column', required: false, type: 'text' },
      { key: 'publico_psi', source: 'area_specific', path: 'publico_psi', required: false, type: 'multiselect' },
      { key: 'tempo_atuacao_anos', source: 'column', required: false, type: 'number' },
    ],
  },
  {
    id: 'especialidade',
    title: 'Atendimento',
    description: 'Modalidade principal.',
    fields: [{ key: 'modalidade_atendimento', source: 'area_specific', path: 'modalidade_atendimento', required: false, type: 'select' }],
  },
  {
    id: 'diagnostico',
    title: 'Diagnóstico',
    fields: [
      { key: 'dor_principal', source: 'column', required: false, type: 'select' },
      { key: 'prioridade_atual', source: 'column', required: false, type: 'text' },
      { key: 'fase_negocio', source: 'column', required: false, type: 'select' },
    ],
  },
  {
    id: 'metas_modelo',
    title: 'Metas e modelo',
    fields: [
      { key: 'metas_principais', source: 'column', required: false, type: 'text' },
      { key: 'objetivos_curto_prazo', source: 'column', required: false, type: 'text' },
      { key: 'capacidade_semana', source: 'column', required: false, type: 'number' },
      { key: 'ticket_medio', source: 'column', required: false, type: 'number' },
      { key: 'modelo_pagamento', source: 'column', required: false, type: 'select' },
    ],
  },
  {
    id: 'canais_rotina',
    title: 'Canais e rotina',
    fields: [
      { key: 'canais_principais', source: 'column', required: false, type: 'multiselect' },
      { key: 'rotina_atual_resumo', source: 'column', required: false, type: 'textarea' },
      { key: 'frequencia_postagem', source: 'column', required: false, type: 'text' },
    ],
  },
  {
    id: 'observacoes',
    title: 'Observações',
    fields: [{ key: 'observacoes', source: 'column', required: false, type: 'textarea' }],
  },
]

/** Nutricionista: área principal (Emagrecimento/Esportiva/etc.), atendimento (Presencial/Online/Ambos), tempo. */
const LIBERAL_NUTRICIONISTA_STEPS: ProfileFlowStep[] = [
  {
    id: 'contexto',
    title: 'Contexto',
    description: 'Estrutura do atendimento.',
    fields: [
      { key: 'area_nutri', source: 'area_specific', path: 'area_nutri', required: false, type: 'select' },
      { key: 'modalidade_atendimento', source: 'area_specific', path: 'modalidade_atendimento', required: false, type: 'select' },
      { key: 'tempo_atuacao_anos', source: 'column', required: false, type: 'number' },
    ],
  },
  {
    id: 'especialidade',
    title: 'Subárea',
    description: 'Subárea (opcional).',
    fields: [{ key: 'sub_category', source: 'column', required: false, type: 'text' }],
  },
  {
    id: 'diagnostico',
    title: 'Diagnóstico',
    fields: [
      { key: 'dor_principal', source: 'column', required: false, type: 'select' },
      { key: 'prioridade_atual', source: 'column', required: false, type: 'text' },
      { key: 'fase_negocio', source: 'column', required: false, type: 'select' },
    ],
  },
  {
    id: 'metas_modelo',
    title: 'Metas e modelo',
    fields: [
      { key: 'metas_principais', source: 'column', required: false, type: 'text' },
      { key: 'objetivos_curto_prazo', source: 'column', required: false, type: 'text' },
      { key: 'capacidade_semana', source: 'column', required: false, type: 'number' },
      { key: 'ticket_medio', source: 'column', required: false, type: 'number' },
      { key: 'modelo_pagamento', source: 'column', required: false, type: 'select' },
    ],
  },
  {
    id: 'canais_rotina',
    title: 'Canais e rotina',
    fields: [
      { key: 'canais_principais', source: 'column', required: false, type: 'multiselect' },
      { key: 'rotina_atual_resumo', source: 'column', required: false, type: 'textarea' },
      { key: 'frequencia_postagem', source: 'column', required: false, type: 'text' },
    ],
  },
  {
    id: 'observacoes',
    title: 'Observações',
    fields: [{ key: 'observacoes', source: 'column', required: false, type: 'textarea' }],
  },
]

/** Coach: nicho, modelo de entrega (Sessões individuais/Grupo/Programa), tempo. */
const LIBERAL_COACH_STEPS: ProfileFlowStep[] = [
  {
    id: 'contexto',
    title: 'Contexto',
    description: 'Modelo de atuação.',
    fields: [
      { key: 'category', source: 'column', required: false, type: 'text' },
      { key: 'modelo_entrega_coach', source: 'area_specific', path: 'modelo_entrega_coach', required: false, type: 'select' },
      { key: 'tempo_atuacao_anos', source: 'column', required: false, type: 'number' },
    ],
  },
  {
    id: 'especialidade',
    title: 'Subárea',
    description: 'Subárea (opcional).',
    fields: [{ key: 'sub_category', source: 'column', required: false, type: 'text' }],
  },
  {
    id: 'diagnostico',
    title: 'Diagnóstico',
    fields: [
      { key: 'dor_principal', source: 'column', required: false, type: 'select' },
      { key: 'prioridade_atual', source: 'column', required: false, type: 'text' },
      { key: 'fase_negocio', source: 'column', required: false, type: 'select' },
    ],
  },
  {
    id: 'metas_modelo',
    title: 'Metas e modelo',
    fields: [
      { key: 'metas_principais', source: 'column', required: false, type: 'text' },
      { key: 'objetivos_curto_prazo', source: 'column', required: false, type: 'text' },
      { key: 'capacidade_semana', source: 'column', required: false, type: 'number' },
      { key: 'ticket_medio', source: 'column', required: false, type: 'number' },
      { key: 'modelo_pagamento', source: 'column', required: false, type: 'select' },
    ],
  },
  {
    id: 'canais_rotina',
    title: 'Canais e rotina',
    fields: [
      { key: 'canais_principais', source: 'column', required: false, type: 'multiselect' },
      { key: 'rotina_atual_resumo', source: 'column', required: false, type: 'textarea' },
      { key: 'frequencia_postagem', source: 'column', required: false, type: 'text' },
    ],
  },
  {
    id: 'observacoes',
    title: 'Observações',
    fields: [{ key: 'observacoes', source: 'column', required: false, type: 'textarea' }],
  },
]

const LIBERAL_FLOW_MEDICO: ProfileFlowConfig = {
  flow_id: 'liberal_v1',
  flow_version: 1,
  profile_type: 'liberal',
  profession: 'medico',
  steps: LIBERAL_MEDICO_STEPS,
}

const LIBERAL_FLOW_ESTETICA: ProfileFlowConfig = {
  flow_id: 'liberal_v1',
  flow_version: 1,
  profile_type: 'liberal',
  profession: 'estetica',
  steps: LIBERAL_ESTETICA_STEPS,
}

const LIBERAL_FLOW_ODONTO: ProfileFlowConfig = {
  flow_id: 'liberal_v1',
  flow_version: 1,
  profile_type: 'liberal',
  profession: 'odonto',
  steps: LIBERAL_ODONTO_STEPS,
}

const LIBERAL_FLOW_PSI: ProfileFlowConfig = {
  flow_id: 'liberal_v1',
  flow_version: 1,
  profile_type: 'liberal',
  profession: 'psi',
  steps: LIBERAL_PSI_STEPS,
}

const LIBERAL_FLOW_NUTRICIONISTA: ProfileFlowConfig = {
  flow_id: 'liberal_v1',
  flow_version: 1,
  profile_type: 'liberal',
  profession: 'nutricionista',
  steps: LIBERAL_NUTRICIONISTA_STEPS,
}

const LIBERAL_FLOW_COACH: ProfileFlowConfig = {
  flow_id: 'liberal_v1',
  flow_version: 1,
  profile_type: 'liberal',
  profession: 'coach',
  steps: LIBERAL_COACH_STEPS,
}

const LIBERAL_FLOW: ProfileFlowConfig = {
  flow_id: 'liberal_v1',
  flow_version: 1,
  profile_type: 'liberal',
  steps: LIBERAL_GENERIC_STEPS,
}

const VENDAS_FLOW: ProfileFlowConfig = {
  flow_id: 'vendas_v1',
  flow_version: 1,
  profile_type: 'vendas',
  steps: VENDAS_VENDEDOR_SUPLEMENTOS_STEPS,
}

const FLOWS: ProfileFlowConfig[] = [
  LIBERAL_FLOW_MEDICO,
  LIBERAL_FLOW_ESTETICA,
  LIBERAL_FLOW_ODONTO,
  LIBERAL_FLOW_PSI,
  LIBERAL_FLOW_NUTRICIONISTA,
  LIBERAL_FLOW_COACH,
  LIBERAL_FLOW,
  VENDAS_FLOW,
]

/**
 * Retorna o fluxo para um profile_type (e opcionalmente profession).
 * Quando houver fluxos por profissão (ex.: liberal.estetica com steps diferentes), buscar por profession primeiro.
 */
export function getProfileFlow(profileType: ProfileType, profession?: ProfessionCode): ProfileFlowConfig | null {
  const byProfession = profession && FLOWS.find((f) => f.profile_type === profileType && f.profession === profession)
  if (byProfession) return byProfession
  const flow = FLOWS.find((f) => f.profile_type === profileType && !f.profession)
  return flow ?? null
}

/**
 * Retorna opções de profissão para um segment (whitelist).
 */
export function getProfessionsForSegment(segment: string): { value: ProfessionCode; label: string }[] {
  const codes = PROFESSION_BY_SEGMENT[segment] ?? []
  return codes.map((value) => ({ value, label: PROFESSION_LABELS[value] }))
}
