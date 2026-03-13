/**
 * Objetivos Estratégicos do Profissional — camada que orienta o foco da resposta.
 * Distinto de situação e perfil: aqui identificamos O QUE o profissional quer alcançar.
 *
 * Fluxo: Mensagem → SITUAÇÃO → PERFIL → OBJETIVO → biblioteca → segmento.
 * O objetivo muda o foco: gerar_contatos vs melhorar_conversão vs criar_posicionamento.
 *
 * Ex.: "Quero aumentar minha agenda" → situação: agenda_vazia, objetivo: gerar_contatos ou vender_mais
 */

export interface NoelStrategicObjective {
  objective_code: string
  objective_title: string
  description: string
  /** Tópicos para filtrar estratégias na biblioteca (noel_strategy_library.topic). */
  library_topics: string[]
}

/** Objetivos estratégicos: o que o profissional quer alcançar. */
export const NOEL_STRATEGIC_OBJECTIVES: NoelStrategicObjective[] = [
  {
    objective_code: 'gerar_contatos',
    objective_title: 'Gerar mais contatos',
    description: 'Profissional quer aumentar o volume de conversas e leads.',
    library_topics: ['gerar_clientes', 'iniciar_conversa', 'agenda_vazia', 'gerar_interesse', 'engajamento', 'engajar_seguidores'],
  },
  {
    objective_code: 'vender_mais',
    objective_title: 'Vender mais / Fechar mais',
    description: 'Profissional quer converter mais conversas em clientes.',
    library_topics: ['conversao', 'qualificar_cliente', 'autoridade', 'autoridade_profissional', 'educacao_cliente'],
  },
  {
    objective_code: 'melhorar_conversao',
    objective_title: 'Melhorar conversão',
    description: 'Profissional tem interessados mas poucos fecham; quer qualificar e converter melhor.',
    library_topics: ['filtrar_curiosos', 'qualificar_cliente', 'conversao', 'gerar_confianca'],
  },
  {
    objective_code: 'criar_posicionamento',
    objective_title: 'Criar posicionamento / Se diferenciar',
    description: 'Profissional quer ser visto como especialista e se destacar no mercado.',
    library_topics: ['posicionamento', 'autoridade', 'autoridade_profissional', 'educacao_cliente'],
  },
  {
    objective_code: 'iniciar_conversas',
    objective_title: 'Iniciar conversas',
    description: 'Profissional tem dificuldade em começar diálogos com potenciais clientes.',
    library_topics: ['iniciar_conversa', 'dificuldade_conversa', 'gerar_clientes', 'diagnostico_como_marketing'],
  },
  {
    objective_code: 'gerar_indicacoes',
    objective_title: 'Gerar indicações',
    description: 'Profissional quer que clientes satisfeitos indiquem novas pessoas.',
    library_topics: ['gerar_indicacoes', 'crescimento_profissional', 'diagnostico_como_marketing'],
  },
]

/** Palavras-chave para detectar objetivo na mensagem (peso implícito: primeira match ganha). */
export const OBJECTIVE_KEYWORDS: Record<string, string[]> = {
  gerar_contatos: [
    'aumentar agenda', 'preencher agenda', 'mais clientes', 'mais pacientes', 'gerar contatos',
    'conseguir clientes', 'atrair clientes', 'atrair pacientes', 'mais conversas', 'poucos contatos',
    'agenda vazia', 'não tenho clientes', 'preciso de clientes', 'como conseguir clientes',
  ],
  vender_mais: [
    'vender mais', 'fechar mais', 'aumentar faturamento', 'mais vendas', 'converter',
    'fechar clientes', 'aumentar receita', 'faturar mais',
  ],
  melhorar_conversao: [
    'melhorar conversão', 'conversão baixa', 'não fecham', 'interessados não fecham',
    'muitos curiosos', 'curiosos não viram cliente', 'qualificar', 'filtrar',
  ],
  criar_posicionamento: [
    'posicionamento', 'me diferenciar', 'ser visto como', 'autoridade', 'especialista',
    'não me levam a sério', 'parecer vendedor', 'comunicar valor',
  ],
  iniciar_conversas: [
    'iniciar conversa', 'começar conversa', 'não sei como abordar', 'medo de vender',
    'iniciar diálogo', 'primeira mensagem', 'como começar',
  ],
  gerar_indicacoes: [
    'indicações', 'indicados', 'clientes indicarem', 'rede de indicação',
    'dependo de indicação', 'como gerar indicações',
  ],
}
