/**
 * Estágios do funil de comunicação — em que fase o cliente/lead está.
 * Permite que o Noel escolha a estratégia certa (ex.: curiosidade → diagnóstico antes de preço).
 *
 * Ex.: "As pessoas perguntam preço" pode ser:
 * - curiosidade: pessoa ainda não entende o serviço → usar diagnóstico antes de falar preço
 * - decisão: pessoa está quase comprando → explicar valor e tratamento
 */

export interface NoelFunnelStage {
  stage_code: string
  stage_title: string
  description: string
  /** Tópicos para filtrar estratégias na biblioteca. */
  library_topics: string[]
}

/** Estágios do funil: descoberta → curiosidade → diagnóstico → conversa → decisão → fidelização. */
export const NOEL_FUNNEL_STAGES: NoelFunnelStage[] = [
  {
    stage_code: 'descoberta',
    stage_title: 'Descoberta',
    description: 'Pessoa ainda não conhece o profissional ou o serviço.',
    library_topics: ['gerar_clientes', 'gerar_interesse', 'iniciar_conversa', 'diagnostico_como_marketing'],
  },
  {
    stage_code: 'curiosidade',
    stage_title: 'Curiosidade',
    description: 'Pessoa demonstra interesse mas ainda não entende o valor; pergunta preço ou como funciona antes de entender o problema.',
    library_topics: ['filtrar_curiosos', 'educacao_cliente', 'qualificar_cliente', 'iniciar_conversa'],
  },
  {
    stage_code: 'diagnostico',
    stage_title: 'Diagnóstico',
    description: 'Pessoa já respondeu diagnóstico/quiz; profissional tem informações para qualificar.',
    library_topics: ['qualificar_cliente', 'autoridade', 'conversao', 'educacao_cliente'],
  },
  {
    stage_code: 'conversa',
    stage_title: 'Conversa',
    description: 'Pessoa está em conversa ativa; profissional conduz o diálogo.',
    library_topics: ['autoridade_profissional', 'educacao_cliente', 'gerar_confianca', 'conversao'],
  },
  {
    stage_code: 'decisao',
    stage_title: 'Decisão',
    description: 'Pessoa está quase comprando ou agendando; precisa de clareza e valor.',
    library_topics: ['conversao', 'autoridade', 'qualificar_cliente', 'educacao_cliente'],
  },
  {
    stage_code: 'fidelizacao',
    stage_title: 'Fidelização',
    description: 'Cliente já atendeu; foco em indicações e recompra.',
    library_topics: ['gerar_indicacoes', 'recuperar_cliente', 'crescimento_profissional'],
  },
]

/** Palavras-chave para detectar estágio na mensagem do profissional. */
export const FUNNEL_STAGE_KEYWORDS: Record<string, string[]> = {
  descoberta: [
    'não me conhecem', 'não sabem quem sou', 'primeiro contato', 'desconhecidos',
    'não conhecem o serviço', 'chegam sem saber',
  ],
  curiosidade: [
    'perguntam preço', 'perguntam quanto custa', 'só perguntam preço', 'primeira coisa que perguntam',
    'não entendem o serviço', 'perguntam como funciona', 'curiosos', 'muitos curiosos',
    'perguntam valor', 'querem saber o preço', 'falam de preço',
  ],
  diagnostico: [
    'responderam o diagnóstico', 'preencheram o quiz', 'já fiz diagnóstico',
    'resultado do diagnóstico', 'respostas do quiz', 'diagnóstico deu',
  ],
  conversa: [
    'em conversa', 'conversando com', 'falei com', 'estou falando',
    'conduzir a conversa', 'conduzir conversa', 'durante a conversa',
  ],
  decisao: [
    'quase fechando', 'querem agendar', 'prontos para decidir', 'demoram para decidir',
    'interessados não fecham', 'não avançam', 'na hora de fechar',
    'quase comprando', 'prontos para comprar',
  ],
  fidelizacao: [
    'clientes antigos', 'recomprar', 'indicar', 'indicações',
    'clientes satisfeitos', 'já atenderam', 'depois do atendimento',
  ],
}
