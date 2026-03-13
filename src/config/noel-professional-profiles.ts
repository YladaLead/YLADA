/**
 * Perfis do Profissional — camada que orienta estratégia e próximo movimento.
 * Distinto de "perfis estratégicos" (situação): aqui identificamos o TIPO/ARQUÉTIPO do profissional.
 *
 * Fluxo: Mensagem → SITUAÇÃO (perfis estratégicos) → PERFIL do profissional → estratégia (biblioteca) → adaptação por segmento.
 * Ver: docs/NOEL-ESTADO-ATUAL-E-PONTOS-INTEGRACAO-BIBLIOTECA.md
 */

export interface NoelProfessionalProfile {
  profile_code: string
  profile_title: string
  description: string
  /** Situação dominante associada (código do perfil estratégico). Usado para mapear situação → perfil. */
  dominant_situation: string
  /** Próximo movimento recomendado para orientar o Noel. */
  next_move: string
  /** Tópicos para filtrar estratégias na biblioteca (noel_strategy_library.topic). */
  library_topics: string[]
}

/** Perfis do profissional: arquetipos que orientam estratégia e próximo passo. */
export const NOEL_PROFESSIONAL_PROFILES: NoelProfessionalProfile[] = [
  {
    profile_code: 'iniciante',
    profile_title: 'Profissional iniciante',
    description: 'Profissional em fase inicial: poucos clientes, ainda construindo base e aprendendo a gerar conversas.',
    dominant_situation: 'agenda_vazia',
    next_move: 'criar primeiro diagnóstico e compartilhar para iniciar conversas',
    library_topics: ['gerar_clientes', 'iniciar_conversa', 'agenda_vazia'],
  },
  {
    profile_code: 'autoridade',
    profile_title: 'Profissional com autoridade',
    description: 'Profissional experiente que precisa demonstrar método e expertise para converter interessados.',
    dominant_situation: 'baixa_conversao',
    next_move: 'usar diagnóstico para mostrar análise e assumir autoridade na conversa',
    library_topics: ['autoridade', 'autoridade_profissional', 'conversao', 'qualificar_cliente'],
  },
  {
    profile_code: 'agenda_vazia',
    profile_title: 'Profissional com agenda vazia',
    description: 'Profissional com poucas conversas e dificuldade para gerar novos contatos.',
    dominant_situation: 'agenda_vazia',
    next_move: 'utilizar diagnósticos como ferramenta para iniciar conversas com novos clientes',
    library_topics: ['gerar_clientes', 'agenda_vazia', 'iniciar_conversa', 'gerar_interesse'],
  },
  {
    profile_code: 'muitos_curiosos',
    profile_title: 'Profissional que atrai curiosos',
    description: 'Profissional gera interesse inicial, mas muitas conversas não avançam para atendimento.',
    dominant_situation: 'muitos_curiosos',
    next_move: 'usar diagnóstico antes da conversa para qualificar quem realmente precisa',
    library_topics: ['filtrar_curiosos', 'qualificar_cliente', 'gerar_clientes'],
  },
  {
    profile_code: 'sobrecarregado',
    profile_title: 'Profissional sobrecarregado',
    description: 'Profissional com agenda cheia ou muitas demandas; precisa otimizar e qualificar melhor.',
    dominant_situation: 'em_crescimento',
    next_move: 'qualificar leads com diagnóstico para focar em quem está pronto',
    library_topics: ['qualificar_cliente', 'conversao', 'educacao_cliente'],
  },
  {
    profile_code: 'dependente_indicacao',
    profile_title: 'Profissional dependente de indicações',
    description: 'Maior parte dos clientes chega por indicação; dificuldade em gerar novos contatos ativamente.',
    dominant_situation: 'dependente_indicacao',
    next_move: 'compartilhar diagnósticos nas redes e em conversas para criar novas fontes',
    library_topics: ['gerar_clientes', 'crescimento_profissional', 'diagnostico_como_marketing', 'gerar_indicacoes'],
  },
  {
    profile_code: 'sem_posicionamento',
    profile_title: 'Profissional com posicionamento confuso',
    description: 'Profissional oferece vários serviços ou não comunica claramente o valor do que faz.',
    dominant_situation: 'sem_posicionamento',
    next_move: 'usar diagnósticos que mostram o bloqueio específico do cliente',
    library_topics: ['posicionamento', 'autoridade_profissional', 'educacao_cliente'],
  },
  {
    profile_code: 'em_crescimento',
    profile_title: 'Profissional em fase de crescimento',
    description: 'Profissional já tem alguns clientes e quer aumentar a consistência da agenda.',
    dominant_situation: 'em_crescimento',
    next_move: 'usar diagnósticos regularmente para gerar novas conversas',
    library_topics: ['crescimento_profissional', 'gerar_clientes', 'engajamento'],
  },
]

/** Mapeamento: situação (perfil estratégico) → perfil do profissional. Usado quando não há match direto por keywords. */
export const SITUATION_TO_PROFESSIONAL_PROFILE: Record<string, string> = {
  agenda_vazia: 'agenda_vazia',
  muitos_curiosos: 'muitos_curiosos',
  dificuldade_conversa: 'iniciante',
  sem_posicionamento: 'sem_posicionamento',
  dependente_indicacao: 'dependente_indicacao',
  seguidores_passivos: 'agenda_vazia',
  explica_demais: 'autoridade',
  em_crescimento: 'em_crescimento',
  baixa_conversao: 'autoridade',
  sem_estrategia: 'iniciante',
}

/** Palavras-chave para detectar perfil do profissional diretamente na mensagem (complementa situação). */
export const PROFESSIONAL_PROFILE_KEYWORDS: Record<string, string[]> = {
  iniciante: [
    'começando', 'iniciante', 'novo na área', 'primeiros clientes', 'não sei por onde começar',
    'acabei de formar', 'estou começando', 'primeira vez', 'ainda aprendendo',
  ],
  autoridade: [
    'demonstrar autoridade', 'mostrar expertise', 'parecer especialista', 'não me levam a sério',
    'já tenho experiência', 'anos de experiência', 'converter interessados', 'assumir autoridade',
  ],
  sobrecarregado: [
    'agenda cheia', 'muitos clientes', 'não tenho tempo', 'sobrecarregado', 'muitas demandas',
    'preciso qualificar', 'focar melhor', 'otimizar', 'priorizar',
  ],
}
