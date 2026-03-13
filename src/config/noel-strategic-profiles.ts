/**
 * Biblioteca de Perfis Estratégicos de Profissionais do Noel.
 * Permite que o Noel reconheça em que fase o profissional está e personalize a orientação.
 *
 * Uso: interpretar diagnósticos, orientar estratégia, personalizar respostas.
 * Ver: docs/NOEL-ESTADO-ATUAL-E-PONTOS-INTEGRACAO-BIBLIOTECA.md
 */

export interface NoelStrategicProfile {
  profile_code: string
  profile_title: string
  description: string
  main_blocker: string
  strategic_focus: string
  recommended_action: string
}

export const NOEL_STRATEGIC_PROFILES: NoelStrategicProfile[] = [
  {
    profile_code: 'agenda_vazia',
    profile_title: 'Profissional com agenda vazia',
    description: 'Profissional tem poucas conversas com potenciais clientes e dificuldade para gerar novos contatos.',
    main_blocker: 'falta de geração consistente de contatos',
    strategic_focus: 'criar fluxo constante de conversas',
    recommended_action: 'utilizar diagnósticos como ferramenta para iniciar conversas com novos clientes',
  },
  {
    profile_code: 'muitos_curiosos',
    profile_title: 'Profissional atrai curiosos mas poucos clientes',
    description: 'Profissional gera interesse inicial, mas muitas conversas não avançam para atendimento.',
    main_blocker: 'conversas começam sem clareza de problema',
    strategic_focus: 'qualificar melhor os contatos',
    recommended_action: 'usar diagnóstico antes da conversa para identificar quem realmente precisa da solução',
  },
  {
    profile_code: 'dificuldade_conversa',
    profile_title: 'Profissional evita iniciar conversas',
    description: 'Profissional sente dificuldade ou insegurança para iniciar conversas com potenciais clientes.',
    main_blocker: 'medo de parecer vendedor',
    strategic_focus: 'iniciar conversas de forma natural',
    recommended_action: 'usar perguntas diagnósticas como forma de iniciar diálogo',
  },
  {
    profile_code: 'sem_posicionamento',
    profile_title: 'Profissional com posicionamento confuso',
    description: 'Profissional oferece vários serviços ou não comunica claramente o valor do que faz.',
    main_blocker: 'falta de clareza de posicionamento',
    strategic_focus: 'explicar problema antes da solução',
    recommended_action: 'usar diagnósticos que mostram o bloqueio específico do cliente',
  },
  {
    profile_code: 'dependente_indicacao',
    profile_title: 'Profissional dependente de indicações',
    description: 'A maior parte dos clientes chega por indicação e o profissional tem dificuldade em gerar novos contatos.',
    main_blocker: 'ausência de estratégia ativa de geração de clientes',
    strategic_focus: 'criar novas fontes de contatos',
    recommended_action: 'compartilhar diagnósticos nas redes e em conversas',
  },
  {
    profile_code: 'seguidores_passivos',
    profile_title: 'Profissional com seguidores que não interagem',
    description: 'O profissional publica conteúdo, mas poucos seguidores comentam ou entram em contato.',
    main_blocker: 'conteúdo informativo sem interação',
    strategic_focus: 'gerar interação',
    recommended_action: 'publicar diagnósticos interativos',
  },
  {
    profile_code: 'explica_demais',
    profile_title: 'Profissional que explica demais antes de entender o cliente',
    description: 'Profissional responde perguntas e dá muitas explicações antes de entender o problema do cliente.',
    main_blocker: 'conversa começa na solução e não no problema',
    strategic_focus: 'analisar antes de orientar',
    recommended_action: 'usar diagnóstico para entender a situação antes de explicar o serviço',
  },
  {
    profile_code: 'em_crescimento',
    profile_title: 'Profissional em fase de crescimento',
    description: 'Profissional já tem alguns clientes e quer aumentar a consistência da agenda.',
    main_blocker: 'crescimento irregular',
    strategic_focus: 'sistema de geração de contatos',
    recommended_action: 'usar diagnósticos regularmente para gerar novas conversas',
  },
  {
    profile_code: 'baixa_conversao',
    profile_title: 'Profissional com baixa conversão',
    description: 'Profissional conversa com pessoas interessadas, mas poucos avançam para atendimento.',
    main_blocker: 'falta de clareza sobre o problema do cliente',
    strategic_focus: 'aprofundar diagnóstico',
    recommended_action: 'mostrar claramente o bloqueio identificado no diagnóstico',
  },
  {
    profile_code: 'sem_estrategia',
    profile_title: 'Profissional sem estratégia clara',
    description: 'Profissional trabalha muito, mas sem um método claro para gerar clientes ou crescer.',
    main_blocker: 'ausência de método estruturado',
    strategic_focus: 'organizar ações estratégicas',
    recommended_action: 'usar diagnósticos como ferramenta central de geração de contatos',
  },
]

/** Palavra-chave com peso (peso maior = match mais forte). */
export interface ProfileKeywordWeight {
  keyword: string
  weight: number
}

/** Palavras-chave por perfil com peso para matching (mensagem → perfil). */
export const PROFILE_KEYWORDS_WEIGHTED: Record<string, ProfileKeywordWeight[]> = {
  agenda_vazia: [
    { keyword: 'agenda vazia', weight: 3 },
    { keyword: 'poucos clientes', weight: 2 },
    { keyword: 'poucas conversas', weight: 2 },
    { keyword: 'sem atendimento', weight: 2 },
    { keyword: 'não consigo preencher agenda', weight: 3 },
    { keyword: 'poucos contatos', weight: 2 },
  ],
  muitos_curiosos: [
    { keyword: 'curiosos', weight: 3 },
    { keyword: 'perguntam preço', weight: 2 },
    { keyword: 'não fecham', weight: 2 },
    { keyword: 'não avançam', weight: 2 },
    { keyword: 'muitas perguntas', weight: 2 },
    { keyword: 'não viram cliente', weight: 2 },
  ],
  dificuldade_conversa: [
    { keyword: 'iniciar conversa', weight: 3 },
    { keyword: 'medo de vender', weight: 3 },
    { keyword: 'parecer vendedor', weight: 2 },
    { keyword: 'insegurança', weight: 2 },
    { keyword: 'não sei como abordar', weight: 2 },
    { keyword: 'evito falar', weight: 2 },
  ],
  sem_posicionamento: [
    { keyword: 'posicionamento', weight: 3 },
    { keyword: 'não sei me diferenciar', weight: 2 },
    { keyword: 'vários serviços', weight: 2 },
    { keyword: 'valor do que faço', weight: 2 },
    { keyword: 'comunicar valor', weight: 2 },
  ],
  dependente_indicacao: [
    { keyword: 'só indicação', weight: 3 },
    { keyword: 'indicados', weight: 2 },
    { keyword: 'não gero contatos', weight: 2 },
    { keyword: 'dependo de indicação', weight: 3 },
    { keyword: 'como conseguir mais clientes', weight: 2 },
  ],
  seguidores_passivos: [
    { keyword: 'seguidores não interagem', weight: 3 },
    { keyword: 'ninguém comenta', weight: 2 },
    { keyword: 'pouca interação', weight: 2 },
    { keyword: 'conteúdo não gera', weight: 2 },
    { keyword: 'passivos', weight: 2 },
  ],
  explica_demais: [
    { keyword: 'explico demais', weight: 3 },
    { keyword: 'explicar antes', weight: 2 },
    { keyword: 'entender o cliente', weight: 2 },
    { keyword: 'perguntas do cliente', weight: 2 },
    { keyword: 'respondo direto', weight: 2 },
  ],
  em_crescimento: [
    { keyword: 'aumentar agenda', weight: 2 },
    { keyword: 'mais clientes', weight: 2 },
    { keyword: 'crescer', weight: 2 },
    { keyword: 'consistência', weight: 2 },
    { keyword: 'crescimento', weight: 3 },
  ],
  baixa_conversao: [
    { keyword: 'conversão', weight: 3 },
    { keyword: 'não fecham', weight: 2 },
    { keyword: 'interessados não fecham', weight: 2 },
    { keyword: 'não avançam', weight: 2 },
    { keyword: 'demoram para decidir', weight: 2 },
  ],
  sem_estrategia: [
    { keyword: 'sem método', weight: 3 },
    { keyword: 'sem estratégia', weight: 3 },
    { keyword: 'trabalho muito', weight: 2 },
    { keyword: 'não sei como gerar', weight: 2 },
    { keyword: 'organizar', weight: 2 },
  ],
}

/** Tópicos de estratégia (noel_strategy_library.topic) recomendados por perfil. Usado para filtrar estratégias quando o perfil é detectado primeiro. */
export const PROFILE_STRATEGY_TOPICS: Record<string, string[]> = {
  agenda_vazia: ['gerar_clientes', 'agenda_vazia', 'iniciar_conversa'],
  muitos_curiosos: ['filtrar_curiosos', 'qualificar_cliente', 'gerar_clientes'],
  dificuldade_conversa: ['iniciar_conversa', 'engajamento', 'gerar_confianca'],
  sem_posicionamento: ['posicionamento', 'autoridade', 'autoridade_profissional'],
  dependente_indicacao: ['gerar_clientes', 'crescimento_profissional', 'diagnostico_como_marketing'],
  seguidores_passivos: ['engajar_seguidores', 'engajamento', 'gerar_interesse'],
  explica_demais: ['educacao_cliente', 'educacao', 'qualificar_cliente'],
  em_crescimento: ['crescimento_profissional', 'gerar_clientes', 'engajamento'],
  baixa_conversao: ['conversao', 'qualificar_cliente', 'gerar_confianca'],
  sem_estrategia: ['diagnostico_como_marketing', 'gerar_clientes', 'qualificar_cliente'],
}
