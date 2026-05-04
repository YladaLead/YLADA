-- Lote 3 (5 fluxos × RISK_DIAGNOSIS × leve|moderado|urgente): recrutamento Pro Líderes.

DELETE FROM public.ylada_flow_diagnosis_outcomes
WHERE architecture = 'RISK_DIAGNOSIS'
  AND diagnosis_vertical IS NULL
  AND flow_id IN (
    'ja-usa-energia-acelera',
    'cansadas-trabalho-atual',
    'ja-tentaram-outros-negocios',
    'querem-trabalhar-digital',
    'ja-empreendem'
  );

INSERT INTO public.ylada_flow_diagnosis_outcomes
  (flow_id, architecture, archetype_code, diagnosis_vertical, content_json)
VALUES
  (
    'ja-usa-energia-acelera',
    'RISK_DIAGNOSIS',
    'leve',
    NULL,
    jsonb_build_object(
      'profile_title', 'Já vive bem-estar ativo — podes explorar negócio alinhado ao teu estilo',
      'profile_summary', 'Pelas respostas, há consistência com hábitos e produtos de energia. Quem te enviou o link pode mostrar como outras pessoas nesse perfil abriram conversa sobre oportunidade.',
      'frase_identificacao', 'Se te identificas, naturalmente inspiras outras pessoas no dia a dia sem forçar.',
      'main_blocker', 'Falta só estrutura para canalizar essa credibilidade em projeto com suporte — não obrigatoriedade.',
      'consequence', 'Sem explorar, podes deixar de lado uma via que combina com o que já fazes.',
      'growth_potential', 'Pede exemplos de rotina comercial leve para quem já tem vida ativa cheia.',
      'dica_rapida', 'Anota três perguntas que te fazem sempre sobre energia ou nutrição — são ganchos naturais.',
      'cta_text', 'Quero ver encaixe com quem me enviou o link',
      'whatsapp_prefill', 'Oi! Fiz o quiz já uso energia e rotina ativa. Quero conversar com quem me enviou este link sobre explorar oportunidade alinhada ao meu estilo de vida.'
    )
  ),
  (
    'ja-usa-energia-acelera',
    'RISK_DIAGNOSIS',
    'moderado',
    NULL,
    jsonb_build_object(
      'profile_title', 'Embaixador natural de estilo de vida — perfil forte para equipa',
      'profile_summary', 'As respostas mostram que já integraste hábitos e produto no teu dia. Esse tipo de prova social autêntica sustenta negócio em rede quando há método por trás.',
      'frase_identificacao', 'Se isto descreve-te, queres que qualquer convite soe genuíno — e está certo.',
      'main_blocker', 'Precisas de clarificar limites de tempo para não promises além da conta.',
      'consequence', 'Sem alinhamento com a liderança, podes sentir culpa quando pausas períodos intensos.',
      'growth_potential', 'Fala com quem te convidou sobre blocos de atividade compatíveis com treinos e vida prática.',
      'dica_rapida', 'Agenda “janelas comerciais” curtas — funciona melhor que estar sempre em modo venda.',
      'cta_text', 'Quero plano de atividade compatível com treino/vida',
      'whatsapp_prefill', 'Oi! Fiz o quiz energia e estilo ativo e o perfil saiu forte para embaixador. Quero alinhar com quem me enviou este link um plano realista de atividade.'
    )
  ),
  (
    'ja-usa-energia-acelera',
    'RISK_DIAGNOSIS',
    'urgente',
    NULL,
    jsonb_build_object(
      'profile_title', 'Momento de potencializar credibilidade com projeto estruturado',
      'profile_summary', 'Pelas respostas, tens tração de hábitos e influência local; falta só decisão informada com a equipa para ver se escalas com propósito.',
      'frase_identificacao', 'Se te revês aqui, sentes que estás a deixar oportunidade em cima da mesa.',
      'main_blocker', 'O risco é tentar carregar tudo sozinho sem alavancar processo da equipa.',
      'consequence', 'Atrasar conversa estruturada mantém-te só “consumidor exemplar” em vez de construtor.',
      'growth_potential', 'Marca já com quem te enviou o link: combina objetivo de 60 dias e suporte esperado.',
      'dica_rapida', 'Protege tempo de recuperação física — sustentabilidade também é liderança.',
      'cta_text', 'Quero 60 dias de plano com a equipa',
      'whatsapp_prefill', 'Oi! Fiz o quiz energia-acelera e quero potencializar já com método. Quero falar com quem me enviou este link para plano de 60 dias e suporte.'
    )
  ),

  (
    'cansadas-trabalho-atual',
    'RISK_DIAGNOSIS',
    'leve',
    NULL,
    jsonb_build_object(
      'profile_title', 'Cansaço com rotina atual — explora flexibilidade sem romper nada ainda',
      'profile_summary', 'Pelas respostas, há desejo de mais controlo de tempo ou significado; ainda em modo reflexão. Quem te enviou o convite pode contar casos reais sem empurrar decisão.',
      'frase_identificacao', 'Se te identificas, queres ar mais antes de largar o que tens.',
      'main_blocker', 'Falta mapa de transição — o que mudaria no teu mês se explorasses o modelo?',
      'consequence', 'Adiar conversa útil prolonga sensação de “trabalhar muito para pouco ar”.',
      'growth_potential', 'Pede à equipa como outras pessoas começaram paralelamente ao emprego antes de mudar de figura.',
      'dica_rapida', 'Escreve duas coisas que mais te esgotam hoje — leva para o WhatsApp.',
      'cta_text', 'Quero falar sobre flexibilidade sem pressão',
      'whatsapp_prefill', 'Oi! Fiz o quiz cansaço com trabalho atual. Quero conversar com quem me enviou este link para perceber se há caminho flexível que encaixe com cautela.'
    )
  ),
  (
    'cansadas-trabalho-atual',
    'RISK_DIAGNOSIS',
    'moderado',
    NULL,
    jsonb_build_object(
      'profile_title', 'Procura ativa de mudança de ritmo — alinha expectativas com a equipa',
      'profile_summary', 'As respostas mostram desgaste recorrente e abertura para alternativa estruturada. Transparência com quem convidou evita trocar uma pressa por outra.',
      'frase_identificacao', 'Se isto é contigo, queres mudar mas com pé em terra sobre esforço inicial.',
      'main_blocker', 'Ponto crítico: compatibilizar transição com rendimento atual — precisa calendário.',
      'consequence', 'Sem plano, podes idealizar flexibilidade ou subestimar aprendizagem inicial.',
      'growth_potential', 'Fala com quem te enviou o link sobre modelos de construção paralela ao emprego.',
      'dica_rapida', 'Define “linha vermelha” de horas semanais disponíveis para teste inicial.',
      'cta_text', 'Quero plano paralelo realista',
      'whatsapp_prefill', 'Oi! Fiz o quiz cansaço no trabalho e o perfil saiu com vontade de mudar ritmo com pé em terra. Quero alinhar com quem me enviou este link um plano paralelo realista.'
    )
  ),
  (
    'cansadas-trabalho-atual',
    'RISK_DIAGNOSIS',
    'urgente',
    NULL,
    jsonb_build_object(
      'profile_title', 'Exaustão com cenário atual — prioriza conversa estruturada com quem te convidou',
      'profile_summary', 'Pelas respostas, o custo emocional e tempo do teu emprego/rotina atual é alto. O próximo passo pragmático é informação franca com a equipa — não decisão impulsiva.',
      'frase_identificacao', 'Se te revês aqui, cada mês igual pesa demais.',
      'main_blocker', 'Risco de decisão por impulso sem números e sem rede de suporte do modelo.',
      'consequence', 'Prolongar silêncio com quem pode ajudar mantém-te sem opções claras.',
      'growth_potential', 'Pede já call ou roteiro com quem partilhou o link — leva perguntas sobre tempo, treino e rendimento típico no início.',
      'dica_rapida', 'Procura apoio emocional fora do negócio também — decisão grande pede clareza integral.',
      'cta_text', 'Preciso falar logo sobre mudança de ritmo',
      'whatsapp_prefill', 'Oi! Fiz o quiz cansaço com trabalho atual e estou com urgência em ver opções sérias. Quero falar com quem me enviou este link o mais breve possível.'
    )
  ),

  (
    'ja-tentaram-outros-negocios',
    'RISK_DIAGNOSIS',
    'leve',
    NULL,
    jsonb_build_object(
      'profile_title', 'Histórico com outros negócios — faz sentido perguntar o que é diferente aqui',
      'profile_summary', 'Pelas respostas, já tentaste caminhos antes e traz olhar crítico — bom sinal. Quem te enviou o link pode explicar suporte, duplicação e o que evita repetir erros comuns.',
      'frase_identificacao', 'Se te identificas, queres comparar sem hype.',
      'main_blocker', 'Sobras com medo de repetir frustração — resolve-se com dados e exemplos, não com pressão.',
      'consequence', 'Fechar-te totalmente sem conversa nova pode deixar-te preso ao passado.',
      'growth_potential', 'Pergunta objetivamente: que sistemas existem hoje que não tinhas nos projetos anteriores?',
      'dica_rapida', 'Lista três lições que carregas — parte honesto disso no WhatsApp.',
      'cta_text', 'Quero comparar com experiências anteriores',
      'whatsapp_prefill', 'Oi! Fiz o quiz já tentei outros negócios e quero entender com olhar crítico. Quero conversar com quem me enviou este link sobre o que aqui é diferente com suporte real.'
    )
  ),
  (
    'ja-tentaram-outros-negocios',
    'RISK_DIAGNOSIS',
    'moderado',
    NULL,
    jsonb_build_object(
      'profile_title', 'Experiência prévia exige transparência — perfil maduro para conversa',
      'profile_summary', 'As respostas mostram que sabes o custo real de empreender. Esse nível de maturidade ajuda quando falas com a liderança sobre expectativas e ritmo.',
      'frase_identificacao', 'Se isto descreve-te, queres números e processo, não discurso de vitrine.',
      'main_blocker', 'O desafio é não projetar falhas antigas neste modelo sem ouvir como funciona hoje aqui.',
      'consequence', 'Sem diálogo franco, podes descartar algo por associação injusta ou aceitar sem critério.',
      'growth_potential', 'Pede cases de pessoas com histórico parecido ao teu e que timeframe usaram.',
      'dica_rapida', 'Mantém mente de “teste” — combina 30 dias de esclarecimento antes de te comprometeres.',
      'cta_text', 'Quero conversa franca com quem me enviou',
      'whatsapp_prefill', 'Oi! Fiz o quiz outros negócios e trago experiência prévia. Quero conversa franca com quem me enviou este link sobre sistema, números e ritmo real.'
    )
  ),
  (
    'ja-tentaram-outros-negocios',
    'RISK_DIAGNOSIS',
    'urgente',
    NULL,
    jsonb_build_object(
      'profile_title', 'Queres resultado desta vez — exige clareza máxima da equipa',
      'profile_summary', 'Pelas respostas, há determinação mas também feridas de tentativas anteriores. Passo inteligente: impor à conversa com quem te convidou critérios claros de suporte e acompanhamento.',
      'frase_identificacao', 'Se te revês aqui, não admits mais projeto sem contrato social interno de mentoria.',
      'main_blocker', 'O risco é aceitar promessas vagas por vontade forte — substitui por checklist de perguntas.',
      'consequence', 'Adiar confronto saudável de dúvidas pode repetir ciclo de desilusão.',
      'growth_potential', 'Agenda já: leva perguntas sobre churn, treino obrigatório e como a equipa trata quem começa “cansado de MLMs”.',
      'dica_rapida', 'Se algo soa demasiado perfeito, pede o lado difícil — negócio sério tem aresta.',
      'cta_text', 'Quero esclarecer tudo antes de avançar',
      'whatsapp_prefill', 'Oi! Fiz o quiz outros negócios e quero desta vez critérios claros. Quero falar com quem me enviou este link com lista de dúvidas sobre suporte e realidade do modelo.'
    )
  ),

  (
    'querem-trabalhar-digital',
    'RISK_DIAGNOSIS',
    'leve',
    NULL,
    jsonb_build_object(
      'profile_title', 'Curiosidade sobre trabalho digital — esclarece arquitetura com quem te convidou',
      'profile_summary', 'Pelas respostas, interessa-te liberdade de lugar e ferramentas online mas ainda estás a recolher informação. Conversa com quem enviou o link para ver stack real (WhatsApp, conteúdo, CRM simples).',
      'frase_identificacao', 'Se te identificas, queres “trabalhar de onde for” mas com noção de trabalho mesmo.',
      'main_blocker', 'Romantizar digital sem tarefas definidas gera frustração — precisa de rotina.',
      'consequence', 'Só consumir conteúdo genérico atrasa tua decisão informada.',
      'growth_potential', 'Pede visão semanal tipo de quem já opera assim na equipa.',
      'dica_rapida', 'Escolhe uma plataforma principal para começar — dispersão mata.',
      'cta_text', 'Quero ver rotina digital real',
      'whatsapp_prefill', 'Oi! Fiz o quiz trabalhar digital. Quero conversar com quem me enviou este link para ver rotina real e ferramentas que a equipa usa.'
    )
  ),
  (
    'querem-trabalhar-digital',
    'RISK_DIAGNOSIS',
    'moderado',
    NULL,
    jsonb_build_object(
      'profile_title', 'Perfil para remote-first com disciplina — explora com método',
      'profile_summary', 'As respostas mostram confiança com tecnologia e interesse em escalar conversas online. Modelo em equipa costuma oferecer playbooks que poupam tempo.',
      'frase_identificacao', 'Se isto é contigo, valorizas métricas simples e consistência.',
      'main_blocker', 'Distrações em casa/redes — precisa fronteiras e blocos de foco.',
      'consequence', 'Sem accountability da equipa, produtividade oscila demais.',
      'growth_potential', 'Fala com quem te enviou o link sobre rituais de accountability e relatórios leves.',
      'dica_rapida', 'Time blocking: 45 min contato / 15 min notas. Repete.',
      'cta_text', 'Quero playbook e accountability',
      'whatsapp_prefill', 'Oi! Fiz o quiz digital e o perfil saiu alinhado a remoto com disciplina. Quero playbook e accountability com quem me enviou este link.'
    )
  ),
  (
    'querem-trabalhar-digital',
    'RISK_DIAGNOSIS',
    'urgente',
    NULL,
    jsonb_build_object(
      'profile_title', 'Pressa para montar operação digital — alinha já com a liderança',
      'profile_summary', 'Pelas respostas, tens combinação de motivação e noções técnicas para ir rápido. O melhor “atalho” saudável é herdar processo da equipa em vez de criar tudo do zero.',
      'frase_identificacao', 'Se te revês aqui, queres lançar semanas, não meses de teoria.',
      'main_blocker', 'Risco é dispersar em demasiadas frentes digitais ao mesmo tempo.',
      'consequence', 'Sem norte, esgotas energia antes de ver tração.',
      'growth_potential', 'Marca com quem partilhou o link sprint de 2 semanas com entregáveis claros.',
      'dica_rapida', 'Escolhe um nicho de mensagem esta semana (ex.: mães, corredores) — foco acelera.',
      'cta_text', 'Quero sprint de 2 semanas com a equipa',
      'whatsapp_prefill', 'Oi! Fiz o quiz trabalhar digital e quero montar já operação com foco. Quero combinar sprint e entregáveis com quem me enviou este link.'
    )
  ),

  (
    'ja-empreendem',
    'RISK_DIAGNOSIS',
    'leve',
    NULL,
    jsonb_build_object(
      'profile_title', 'Já empreendes — avalia sinergia com novo braço em equipa',
      'profile_summary', 'Pelas respostas, já tens experiência de negócio. Quem te enviou o convite pode mostrar como este modelo se integra ou diverge do que já fazes — complementaridade importa.',
      'frase_identificacao', 'Se te identificas, queres ver se isto pesa ou alivia a tua operação atual.',
      'main_blocker', 'Gestão de atenção entre projetos — precisa regra clara de tempo.',
      'consequence', 'Sem conversa, podes subestimar overlap de esforço ou superestimar sinergia.',
      'growth_potential', 'Pede mapa de integração: canais, clientes, fornecimento, compliance.',
      'dica_rapida', 'Define se isto é core ou adjacente no teu portfólio pessoal — honestidade ajuda.',
      'cta_text', 'Quero avaliar sinergia com o que já faço',
      'whatsapp_prefill', 'Oi! Fiz o quiz já empreendo. Quero conversar com quem me enviou este link sobre sinergia ou overlap com os meus projetos atuais.'
    )
  ),
  (
    'ja-empreendem',
    'RISK_DIAGNOSIS',
    'moderado',
    NULL,
    jsonb_build_object(
      'profile_title', 'Empreendedor experiente — fala números e sistemas com a equipa',
      'profile_summary', 'As respostas revelam mentalidade de P&L e processo. Esse perfil acelera quando a liderança entra em detalhe operacional — sem discurso iniciante.',
      'frase_identificacao', 'Se isto descreve-te, tolerância baixa para vagueza.',
      'main_blocker', 'Risco de microgestão excessiva no teu lado antes de confiar no playbooks da equipa.',
      'consequence', 'Não delegar partes padronizadas cansa-te sem necessidade.',
      'growth_potential', 'Alinha com quem te enviou o link que partes são “seguir script” e que partes são teu diferencial.',
      'dica_rapida', 'Usa OKR pessoal de 90 dias para este braço — mesmo exploratório.',
      'cta_text', 'Quero detalhe operacional com a liderança',
      'whatsapp_prefill', 'Oi! Fiz o quiz já empreendo e quero detalhe operacional. Quero falar com quem me enviou este link a nível de sistema, números e papéis claros.'
    )
  ),
  (
    'ja-empreendem',
    'RISK_DIAGNOSIS',
    'urgente',
    NULL,
    jsonb_build_object(
      'profile_title', 'Momento de decidir integração estratégica com novo modelo',
      'profile_summary', 'Pelas respostas, há energia para decisão com prazo. Conversa prioritária com quem convidou para não adiar sinergia ou descartar sem dados.',
      'frase_identificacao', 'Se te revês aqui, odeias deixar oportunidade estratégica em standby.',
      'main_blocker', 'Decisão sem due diligence interna na equipa pode gerar arrependimento — evita.',
      'consequence', 'Atrasar pode perder timing de mercado ou momentum pessoal.',
      'growth_potential', 'Agenda reunião estruturada: traz perguntas de capilaridade (logística, marca, cliente alvo).',
      'dica_rapida', 'Documenta hipótese antes da call — clarifica tua mente e respeita tempo de todos.',
      'cta_text', 'Quero reunião estratégica com quem me enviou',
      'whatsapp_prefill', 'Oi! Fiz o quiz já empreendo e preciso decidir integração estratégica. Quero marcar conversa prioritária com quem me enviou este link com perguntas objetivas.'
    )
  );
