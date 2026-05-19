-- Lote 3 (5 fluxos × RISK_DIAGNOSIS × leve|moderado|urgente): recrutamento Pro Líderes.
-- v2: reescrita completa para PT-BR (eliminados europeísmos de v1).

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
      'profile_title', 'Já vive bem-estar ativo — pode explorar negócio alinhado ao seu estilo',
      'profile_summary', 'Pelas respostas, há consistência com hábitos e produtos de energia. Quem te enviou o link pode mostrar como outras pessoas nesse perfil abriram conversa sobre oportunidade.',
      'frase_identificacao', 'Se você se identifica, naturalmente inspira outras pessoas no dia a dia sem forçar.',
      'main_blocker', 'Falta só estrutura para canalizar essa credibilidade em projeto com suporte — sem obrigatoriedade.',
      'consequence', 'Sem explorar, você pode deixar de lado uma via que combina com o que já faz.',
      'growth_potential', 'Peça exemplos de rotina comercial leve para quem já tem uma vida ativa cheia.',
      'dica_rapida', 'Anote três perguntas que as pessoas sempre te fazem sobre energia ou nutrição — são ganchos naturais.',
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
      'profile_title', 'Embaixador natural de estilo de vida — perfil forte para a equipe',
      'profile_summary', 'As respostas mostram que você já integrou hábitos e produto no seu dia. Esse tipo de prova social autêntica sustenta um negócio em rede quando há método por trás.',
      'frase_identificacao', 'Se isso te descreve, quer que qualquer convite soe genuíno — e está certo.',
      'main_blocker', 'Você precisa deixar claro os seus limites de tempo para não prometer além do que consegue.',
      'consequence', 'Sem alinhamento com a liderança, você pode sentir culpa quando pausa em períodos intensos.',
      'growth_potential', 'Fale com quem te convidou sobre blocos de atividade compatíveis com treinos e vida prática.',
      'dica_rapida', 'Agende "janelas comerciais" curtas — funciona melhor do que estar sempre em modo venda.',
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
      'profile_summary', 'Pelas respostas, você tem tração de hábitos e influência local; falta só uma decisão informada com a equipe para ver se escala com propósito.',
      'frase_identificacao', 'Se você se vê aqui, sente que está deixando oportunidade na mesa.',
      'main_blocker', 'O risco é tentar carregar tudo sozinho sem aproveitar o processo da equipe.',
      'consequence', 'Atrasar a conversa estruturada te mantém só como "consumidor exemplar" em vez de construtor.',
      'growth_potential', 'Agende já com quem te enviou o link: combine objetivo de 60 dias e suporte esperado.',
      'dica_rapida', 'Proteja tempo de recuperação física — sustentabilidade também é liderança.',
      'cta_text', 'Quero 60 dias de plano com a equipe',
      'whatsapp_prefill', 'Oi! Fiz o quiz energia-acelera e quero potencializar já com método. Quero falar com quem me enviou este link para plano de 60 dias e suporte.'
    )
  ),

  (
    'cansadas-trabalho-atual',
    'RISK_DIAGNOSIS',
    'leve',
    NULL,
    jsonb_build_object(
      'profile_title', 'Cansaço com rotina atual — explore flexibilidade sem romper nada ainda',
      'profile_summary', 'Pelas respostas, há desejo de mais controle de tempo ou significado; ainda em modo reflexão. Quem te enviou o convite pode contar casos reais sem empurrar decisão.',
      'frase_identificacao', 'Se você se identifica, quer respirar mais antes de largar o que tem.',
      'main_blocker', 'Falta um mapa de transição — o que mudaria no seu mês se você explorasse o modelo?',
      'consequence', 'Adiar uma conversa útil prolonga a sensação de "trabalhar muito para pouco ar".',
      'growth_potential', 'Peça à equipe como outras pessoas começaram em paralelo ao emprego antes de mudar de vida.',
      'dica_rapida', 'Escreva duas coisas que mais te esgotam hoje — leve para o WhatsApp.',
      'cta_text', 'Quero falar sobre flexibilidade sem pressão',
      'whatsapp_prefill', 'Oi! Fiz o quiz cansaço com trabalho atual. Quero conversar com quem me enviou este link para entender se há caminho flexível que encaixe com cautela.'
    )
  ),
  (
    'cansadas-trabalho-atual',
    'RISK_DIAGNOSIS',
    'moderado',
    NULL,
    jsonb_build_object(
      'profile_title', 'Busca ativa de mudança de ritmo — alinhe expectativas com a equipe',
      'profile_summary', 'As respostas mostram desgaste recorrente e abertura para alternativa estruturada. Transparência com quem convidou evita trocar uma pressão por outra.',
      'frase_identificacao', 'Se isso combina com você, quer mudar mas com pé no chão sobre o esforço inicial.',
      'main_blocker', 'Ponto crítico: compatibilizar a transição com a renda atual — precisa de calendário.',
      'consequence', 'Sem plano, você pode idealizar flexibilidade ou subestimar a aprendizagem inicial.',
      'growth_potential', 'Fale com quem te enviou o link sobre modelos de construção em paralelo ao emprego.',
      'dica_rapida', 'Defina a sua "linha vermelha" de horas semanais disponíveis para o teste inicial.',
      'cta_text', 'Quero plano paralelo realista',
      'whatsapp_prefill', 'Oi! Fiz o quiz cansaço no trabalho e o perfil saiu com vontade de mudar ritmo com pé no chão. Quero alinhar com quem me enviou este link um plano paralelo realista.'
    )
  ),
  (
    'cansadas-trabalho-atual',
    'RISK_DIAGNOSIS',
    'urgente',
    NULL,
    jsonb_build_object(
      'profile_title', 'Exaustão com cenário atual — priorize conversa estruturada com quem te convidou',
      'profile_summary', 'Pelas respostas, o custo emocional e de tempo do seu emprego ou rotina atual é alto. O próximo passo pragmático é informação franca com a equipe — não decisão impulsiva.',
      'frase_identificacao', 'Se você se vê aqui, cada mês igual pesa demais.',
      'main_blocker', 'Risco de decisão por impulso sem números e sem a rede de suporte do modelo.',
      'consequence', 'Prolongar o silêncio com quem pode ajudar te mantém sem opções claras.',
      'growth_potential', 'Peça já uma call ou roteiro com quem compartilhou o link — leve perguntas sobre tempo, treino e renda típica no início.',
      'dica_rapida', 'Busque apoio emocional fora do negócio também — decisão grande pede clareza integral.',
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
      'profile_summary', 'Pelas respostas, você já tentou caminhos antes e traz um olhar crítico — bom sinal. Quem te enviou o link pode explicar suporte, duplicação e o que evita repetir erros comuns.',
      'frase_identificacao', 'Se você se identifica, quer comparar sem hype.',
      'main_blocker', 'Sobra o medo de repetir frustração — resolve-se com dados e exemplos, não com pressão.',
      'consequence', 'Se fechar totalmente sem uma nova conversa pode te manter preso ao passado.',
      'growth_potential', 'Pergunte de forma objetiva: que sistemas existem hoje que você não tinha nos projetos anteriores?',
      'dica_rapida', 'Liste três lições que você carrega — parte desse ponto honesto no WhatsApp.',
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
      'profile_summary', 'As respostas mostram que você sabe o custo real de empreender. Esse nível de maturidade ajuda quando você fala com a liderança sobre expectativas e ritmo.',
      'frase_identificacao', 'Se isso te descreve, quer números e processo, não discurso de vitrine.',
      'main_blocker', 'O desafio é não projetar falhas antigas neste modelo sem ouvir como funciona hoje aqui.',
      'consequence', 'Sem diálogo franco, você pode descartar algo por associação injusta ou aceitar sem critério.',
      'growth_potential', 'Peça cases de pessoas com histórico parecido com o seu e que prazo usaram.',
      'dica_rapida', 'Mantenha a mente de "teste" — combine 30 dias de esclarecimento antes de se comprometer.',
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
      'profile_title', 'Quer resultado desta vez — exige clareza máxima da equipe',
      'profile_summary', 'Pelas respostas, há determinação mas também marcas de tentativas anteriores. Passo inteligente: impor à conversa com quem te convidou critérios claros de suporte e acompanhamento.',
      'frase_identificacao', 'Se você se vê aqui, não aceita mais um projeto sem um compromisso real de mentoria.',
      'main_blocker', 'O risco é aceitar promessas vagas pela vontade forte — substitua por um checklist de perguntas.',
      'consequence', 'Adiar o confronto saudável de dúvidas pode repetir o ciclo de desilusão.',
      'growth_potential', 'Agende já: leve perguntas sobre churn, treino obrigatório e como a equipe trata quem começa "cansado de MLMs".',
      'dica_rapida', 'Se algo soa perfeito demais, peça o lado difícil — negócio sério tem arestas.',
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
      'profile_title', 'Curiosidade sobre trabalho digital — esclareça a arquitetura com quem te convidou',
      'profile_summary', 'Pelas respostas, você se interessa por liberdade de lugar e ferramentas online mas ainda está reunindo informação. Converse com quem enviou o link para ver o stack real (WhatsApp, conteúdo, CRM simples).',
      'frase_identificacao', 'Se você se identifica, quer "trabalhar de onde for" mas com noção de que é trabalho de verdade.',
      'main_blocker', 'Romantizar o digital sem tarefas definidas gera frustração — precisa de rotina.',
      'consequence', 'Só consumir conteúdo genérico atrasa a sua decisão informada.',
      'growth_potential', 'Peça uma visão semanal típica de quem já opera assim na equipe.',
      'dica_rapida', 'Escolha uma plataforma principal para começar — dispersão trava.',
      'cta_text', 'Quero ver rotina digital real',
      'whatsapp_prefill', 'Oi! Fiz o quiz trabalhar digital. Quero conversar com quem me enviou este link para ver rotina real e ferramentas que a equipe usa.'
    )
  ),
  (
    'querem-trabalhar-digital',
    'RISK_DIAGNOSIS',
    'moderado',
    NULL,
    jsonb_build_object(
      'profile_title', 'Perfil para remote-first com disciplina — explore com método',
      'profile_summary', 'As respostas mostram confiança com tecnologia e interesse em escalar conversas online. O modelo em equipe costuma oferecer playbooks que poupam tempo.',
      'frase_identificacao', 'Se isso combina com você, valoriza métricas simples e consistência.',
      'main_blocker', 'Distrações em casa e redes — precisa de fronteiras e blocos de foco.',
      'consequence', 'Sem accountability da equipe, a produtividade oscila demais.',
      'growth_potential', 'Fale com quem te enviou o link sobre rituais de accountability e relatórios leves.',
      'dica_rapida', 'Time blocking: 45 min contato / 15 min notas. Repita.',
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
      'profile_title', 'Pressa para montar operação digital — alinhe já com a liderança',
      'profile_summary', 'Pelas respostas, você tem combinação de motivação e noções técnicas para ir rápido. O melhor "atalho" saudável é herdar o processo da equipe em vez de criar tudo do zero.',
      'frase_identificacao', 'Se você se vê aqui, quer lançar em semanas, não meses de teoria.',
      'main_blocker', 'O risco é se dispersar em muitas frentes digitais ao mesmo tempo.',
      'consequence', 'Sem norte, você gasta energia antes de ver tração.',
      'growth_potential', 'Agende com quem compartilhou o link um sprint de 2 semanas com entregáveis claros.',
      'dica_rapida', 'Escolha um nicho de mensagem esta semana (ex.: mães, corredores) — foco acelera.',
      'cta_text', 'Quero sprint de 2 semanas com a equipe',
      'whatsapp_prefill', 'Oi! Fiz o quiz trabalhar digital e quero montar já operação com foco. Quero combinar sprint e entregáveis com quem me enviou este link.'
    )
  ),

  (
    'ja-empreendem',
    'RISK_DIAGNOSIS',
    'leve',
    NULL,
    jsonb_build_object(
      'profile_title', 'Já empreende — avalie sinergia com um novo braço em equipe',
      'profile_summary', 'Pelas respostas, você já tem experiência de negócio. Quem te enviou o convite pode mostrar como este modelo se integra ou diverge do que você já faz — complementaridade importa.',
      'frase_identificacao', 'Se você se identifica, quer ver se isso pesa ou alivia a sua operação atual.',
      'main_blocker', 'Gestão de atenção entre projetos — precisa de uma regra clara de tempo.',
      'consequence', 'Sem conversar, você pode subestimar o esforço adicional ou superestimar a sinergia.',
      'growth_potential', 'Peça um mapa de integração: canais, clientes, fornecimento, compliance.',
      'dica_rapida', 'Defina se isso é core ou adjacente no seu portfólio pessoal — honestidade ajuda.',
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
      'profile_title', 'Empreendedor experiente — fale números e sistemas com a equipe',
      'profile_summary', 'As respostas revelam mentalidade de P&L e processo. Esse perfil acelera quando a liderança entra em detalhe operacional — sem discurso de iniciante.',
      'frase_identificacao', 'Se isso te descreve, tolerância baixa para vagueza.',
      'main_blocker', 'Risco de microgestão excessiva do seu lado antes de confiar nos playbooks da equipe.',
      'consequence', 'Não delegar as partes padronizadas te cansa sem necessidade.',
      'growth_potential', 'Alinhe com quem te enviou o link que partes são "seguir script" e que partes são o seu diferencial.',
      'dica_rapida', 'Use OKR pessoal de 90 dias para este braço — mesmo que exploratório.',
      'cta_text', 'Quero detalhe operacional com a liderança',
      'whatsapp_prefill', 'Oi! Fiz o quiz já empreendo e quero detalhe operacional. Quero falar com quem me enviou este link sobre sistema, números e papéis claros.'
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
      'frase_identificacao', 'Se você se vê aqui, odeia deixar oportunidade estratégica em standby.',
      'main_blocker', 'Decisão sem due diligence interna na equipe pode gerar arrependimento — evite.',
      'consequence', 'Atrasar pode perder o timing de mercado ou o momentum pessoal.',
      'growth_potential', 'Agende uma reunião estruturada: traga perguntas de capilaridade (logística, marca, cliente-alvo).',
      'dica_rapida', 'Documente a hipótese antes da call — clarifica a sua mente e respeita o tempo de todos.',
      'cta_text', 'Quero reunião estratégica com quem me enviou',
      'whatsapp_prefill', 'Oi! Fiz o quiz já empreendo e preciso decidir integração estratégica. Quero marcar conversa prioritária com quem me enviou este link com perguntas objetivas.'
    )
  );
