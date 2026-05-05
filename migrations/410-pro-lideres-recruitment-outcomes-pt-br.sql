-- PT-BR: corrige copy em português europeu nos outcomes de recrutamento Pro Líderes (lote 3).
-- Idempotente: mesmo DELETE + INSERT da migração 399; aplicar depois da 399 em ambientes que já rodaram.

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
      'profile_title', 'Já vive bem-estar ativo — você pode explorar negócio alinhado ao seu estilo',
      'profile_summary', 'Pelas respostas, há consistência com hábitos e produtos de energia. Quem te enviou o link pode mostrar como outras pessoas nesse perfil abriram conversa sobre oportunidade.',
      'frase_identificacao', 'Se você se identifica, naturalmente você inspira outras pessoas no dia a dia sem forçar.',
      'main_blocker', 'Falta só estrutura para canalizar essa credibilidade em projeto com suporte — não obrigatoriedade.',
      'consequence', 'Sem explorar, você pode deixar de lado um caminho que combina com o que você já faz.',
      'growth_potential', 'Peça exemplos de rotina comercial leve para quem já tem vida ativa cheia.',
      'dica_rapida', 'Anote três perguntas que te fazem sempre sobre energia ou nutrição — são ganchos naturais.',
      'cta_text', 'Quero conhecer novas oportunidades',
      'whatsapp_prefill', 'Oi! Fiz o quiz já uso energia e rotina ativa. Quero conversar com quem me enviou este link sobre explorar oportunidade alinhada ao meu estilo de vida.'
    )
  ),
  (
    'ja-usa-energia-acelera',
    'RISK_DIAGNOSIS',
    'moderado',
    NULL,
    jsonb_build_object(
      'profile_title', 'Embaixador natural de estilo de vida — perfil forte para equipe',
      'profile_summary', 'As respostas mostram que já você integrou hábitos e produto no seu dia. Esse tipo de prova social autêntica sustenta negócio em rede quando há método por trás.',
      'frase_identificacao', 'Se isso descreve você, você quer que qualquer convite soe genuíno — e está certo.',
      'main_blocker', 'Você precisa clarificar limites de tempo para não prometer além da conta.',
      'consequence', 'Sem alinhamento com a liderança, você pode sentir culpa quando faz pausas em períodos intensos.',
      'growth_potential', 'Converse com quem te convidou sobre blocos de atividade compatíveis com treinos e vida prática.',
      'dica_rapida', 'Marque “janelas comerciais” curtas — funciona melhor que estar sempre em modo venda.',
      'cta_text', 'Quero conhecer novas oportunidades',
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
      'profile_summary', 'Pelas respostas, você tem tração de hábitos e influência local; falta só decisão informada com a equipe para ver se você escala com propósito.',
      'frase_identificacao', 'Se você se vê aqui, pode estar com a sensação de deixar oportunidade na mesa.',
      'main_blocker', 'O risco é tentar carregar tudo sozinho sem usar o processo da equipe como alavanca.',
      'consequence', 'Adiar uma conversa estruturada faz você ficar só “consumidor exemplar” em vez de construtor.',
      'growth_potential', 'Combine já com quem te enviou o link: defina objetivo de 60 dias e suporte esperado.',
      'dica_rapida', 'Proteja tempo de recuperação física — sustentabilidade também é liderança.',
      'cta_text', 'Quero conhecer novas oportunidades',
      'whatsapp_prefill', 'Oi! Fiz o quiz energia-acelera e quero potencializar já com método. Quero falar com quem me enviou este link para plano de 60 dias e suporte.'
    )
  ),

  (
    'cansadas-trabalho-atual',
    'RISK_DIAGNOSIS',
    'leve',
    NULL,
    jsonb_build_object(
      'profile_title', 'Cansaço com a rotina atual — vale explorar flexibilidade sem romper nada ainda',
      'profile_summary', 'Pelas respostas, há desejo de mais controle de tempo ou significado; ainda em modo reflexão. Quem te enviou o convite pode contar casos reais sem empurrar decisão.',
      'frase_identificacao', 'Se você se identifica, quer respirar melhor antes de largar o que tem.',
      'main_blocker', 'Falta um mapa de transição: o que mudaria no seu mês se você explorasse o modelo?',
      'consequence', 'Adiar uma conversa que esclarece as coisas costuma manter aquela sensação de esforço alto com retorno que parece pequeno.',
      'growth_potential', 'Peça à equipe como outras pessoas começaram em paralelo ao emprego antes de mudar de vida.',
      'dica_rapida', 'Escreva duas coisas que mais te cansam hoje e leve isso para o WhatsApp.',
      'cta_text', 'Quero conhecer novas oportunidades',
      'whatsapp_prefill', 'Oi! Fiz o quiz cansaço com trabalho atual. Quero conversar com quem me enviou este link para perceber se há caminho flexível que encaixe com cautela.'
    )
  ),
  (
    'cansadas-trabalho-atual',
    'RISK_DIAGNOSIS',
    'moderado',
    NULL,
    jsonb_build_object(
      'profile_title', 'Busca ativa por mudança de ritmo — alinhe expectativas com a equipe',
      'profile_summary', 'As respostas mostram desgaste recorrente e abertura para alternativa estruturada. Transparência com quem convidou evita trocar uma pressa por outra.',
      'frase_identificacao', 'Se isso faz sentido pra você, você quer mudar mas com pé em terra sobre esforço inicial.',
      'main_blocker', 'Ponto crítico: compatibilizar transição com rendimento atual — falta um calendário claro.',
      'consequence', 'Sem plano, você pode idealizar flexibilidade ou subestimar aprendizado inicial.',
      'growth_potential', 'Converse com quem te enviou o link sobre modelos de construção paralela ao emprego.',
      'dica_rapida', 'Defina “linha vermelha” de horas semanais disponíveis para teste inicial.',
      'cta_text', 'Quero conhecer novas oportunidades',
      'whatsapp_prefill', 'Oi! Fiz o quiz cansaço no trabalho e o perfil saiu com vontade de mudar ritmo com pé em terra. Quero alinhar com quem me enviou este link um plano paralelo realista.'
    )
  ),
  (
    'cansadas-trabalho-atual',
    'RISK_DIAGNOSIS',
    'urgente',
    NULL,
    jsonb_build_object(
      'profile_title', 'Exaustão com o cenário atual — priorize uma conversa estruturada com quem te convidou',
      'profile_summary', 'Pelas respostas, o custo emocional e tempo do seu emprego/rotina atual é alto. O próximo passo pragmático é informação franca com a equipe — não decisão impulsiva.',
      'frase_identificacao', 'Se você se vê aqui, cada mês igual pesa demais.',
      'main_blocker', 'Risco de decisão por impulso sem números e sem rede de suporte do modelo.',
      'consequence', 'Prolongar o silêncio com quem pode ajudar deixa você sem opções claras.',
      'growth_potential', 'Peça já uma call ou um roteiro com quem compartilhou o link — leve perguntas sobre tempo, treino e rendimento típico no início.',
      'dica_rapida', 'Procure apoio emocional fora do negócio também — decisão grande pede clareza de cabeça.',
      'cta_text', 'Quero conhecer novas oportunidades',
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
      'profile_summary', 'Pelas respostas, você já tentou outros caminhos e chega com olhar crítico — bom sinal. Quem te enviou o link pode explicar suporte, duplicação e o que ajuda a não repetir erros comuns.',
      'frase_identificacao', 'Se você se identifica, você quer comparar sem hype.',
      'main_blocker', 'É comum ficar com medo de repetir frustração — isso se resolve com dados e exemplos, não com pressão.',
      'consequence', 'Fechar-se totalmente sem uma conversa nova pode deixar você preso ao passado.',
      'growth_potential', 'Pergunte com objetividade: que sistemas existem hoje que você não tinha nos projetos anteriores?',
      'dica_rapida', 'Liste três lições que você carrega — conte com honestidade isso no WhatsApp.',
      'cta_text', 'Quero conhecer novas oportunidades',
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
      'frase_identificacao', 'Se isso descreve você, você quer números e processo, não discurso de vitrine.',
      'main_blocker', 'O desafio é não projetar falhas antigas neste modelo sem ouvir como funciona hoje aqui.',
      'consequence', 'Sem diálogo franco, você pode descartar algo por associação injusta ou aceitar sem critério.',
      'growth_potential', 'Peça cases de pessoas com histórico parecido ao seu e que prazo usaram.',
      'dica_rapida', 'Mantenha a mente de “teste” — combine 30 dias de esclarecimento antes de se comprometer.',
      'cta_text', 'Quero conhecer novas oportunidades',
      'whatsapp_prefill', 'Oi! Fiz o quiz outros negócios e trago experiência prévia. Quero conversa franca com quem me enviou este link sobre sistema, números e ritmo real.'
    )
  ),
  (
    'ja-tentaram-outros-negocios',
    'RISK_DIAGNOSIS',
    'urgente',
    NULL,
    jsonb_build_object(
      'profile_title', 'Quer resultado desta vez — peça clareza máxima da equipe',
      'profile_summary', 'Pelas respostas, há determinação mas também feridas de tentativas anteriores. Passo inteligente: levar para a conversa com quem te convidou critérios claros de suporte e acompanhamento.',
      'frase_identificacao', 'Se você se vê aqui, você não aceita mais projeto sem contrato social interno de mentoria.',
      'main_blocker', 'O risco é aceitar promessas vagas por vontade forte — troque por uma checklist de perguntas.',
      'consequence', 'Adiar confronto saudável de dúvidas pode repetir ciclo de desilusão.',
      'growth_potential', 'Marque já: leva perguntas sobre churn, treino obrigatório e como a equipe trata quem começa “cansado de MLMs”.',
      'dica_rapida', 'Se algo soa perfeito demais, peça o lado difícil — negócio sério tem aresta.',
      'cta_text', 'Quero conhecer novas oportunidades',
      'whatsapp_prefill', 'Oi! Fiz o quiz outros negócios e quero desta vez critérios claros. Quero falar com quem me enviou este link com lista de dúvidas sobre suporte e realidade do modelo.'
    )
  ),

  (
    'querem-trabalhar-digital',
    'RISK_DIAGNOSIS',
    'leve',
    NULL,
    jsonb_build_object(
      'profile_title', 'Curiosidade sobre trabalho digital — esclareça o desenho com quem te convidou',
      'profile_summary', 'Pelas respostas, você quer liberdade de lugar e ferramentas online mas ainda está juntando informação. Converse com quem enviou o link para ver stack real (WhatsApp, conteúdo, CRM simples).',
      'frase_identificacao', 'Se você se identifica, você quer “trabalhar de onde for” mas com noção de trabalho mesmo.',
      'main_blocker', 'Romantizar digital sem tarefas definidas gera frustração — precisa de rotina.',
      'consequence', 'Só consumir conteúdo genérico atrasa sua decisão informada.',
      'growth_potential', 'Peça visão semanal tipo de quem já opera assim na equipe.',
      'dica_rapida', 'Escolha uma plataforma principal para começar — dispersão mata.',
      'cta_text', 'Quero conhecer novas oportunidades',
      'whatsapp_prefill', 'Oi! Fiz o quiz trabalhar digital. Quero conversar com quem me enviou este link para ver rotina real e ferramentas que a equipe usa.'
    )
  ),
  (
    'querem-trabalhar-digital',
    'RISK_DIAGNOSIS',
    'moderado',
    NULL,
    jsonb_build_object(
      'profile_title', 'Perfil remote-first com disciplina — explore com método',
      'profile_summary', 'As respostas mostram confiança com tecnologia e interesse em escalar conversas online. Modelo em equipe costuma oferecer playbooks que poupam tempo.',
      'frase_identificacao', 'Se isso faz sentido pra você, você valoriza métricas simples e consistência.',
      'main_blocker', 'Distrações em casa/redes — precisa de limites claros e blocos de foco.',
      'consequence', 'Sem ritmo de cobrança com a equipe, produtividade oscila demais.',
      'growth_potential', 'Converse com quem te enviou o link sobre rituais de acompanhamento e relatórios leves.',
      'dica_rapida', 'Time blocking: 45 min contato / 15 min notas. Repita.',
      'cta_text', 'Quero conhecer novas oportunidades',
      'whatsapp_prefill', 'Oi! Fiz o quiz digital e o perfil saiu alinhado a remoto com disciplina. Quero playbook e acompanhamento com quem me enviou este link.'
    )
  ),
  (
    'querem-trabalhar-digital',
    'RISK_DIAGNOSIS',
    'urgente',
    NULL,
    jsonb_build_object(
      'profile_title', 'Pressa para montar operação digital — alinhe já com a liderança',
      'profile_summary', 'Pelas respostas, você tem combinação de motivação e noções técnicas para ir rápido. O melhor “atalho” saudável é herdar processo da equipe em vez de criar tudo do zero.',
      'frase_identificacao', 'Se você se vê aqui, você quer lançar semanas, não meses de teoria.',
      'main_blocker', 'O risco é dispersar em muitas frentes digitais ao mesmo tempo.',
      'consequence', 'Sem norte, você esgota energia antes de ver tração.',
      'growth_potential', 'Combine com quem compartilhou o link um sprint de 2 semanas com entregáveis claros.',
      'dica_rapida', 'Escolha um nicho de mensagem esta semana (ex.: mães, corredores) — foco acelera.',
      'cta_text', 'Quero conhecer novas oportunidades',
      'whatsapp_prefill', 'Oi! Fiz o quiz trabalhar digital e quero montar já operação com foco. Quero combinar sprint e entregáveis com quem me enviou este link.'
    )
  ),

  (
    'ja-empreendem',
    'RISK_DIAGNOSIS',
    'leve',
    NULL,
    jsonb_build_object(
      'profile_title', 'Você já empreende — avalie sinergia com novo braço na equipe',
      'profile_summary', 'Pelas respostas, você já tem experiência de negócio. Quem te enviou o convite pode mostrar como este modelo se integra ou diverge do que você já faz — complementaridade importa.',
      'frase_identificacao', 'Se você se identifica, você quer ver se isso pesa ou alivia a sua operação atual.',
      'main_blocker', 'Gestão de atenção entre projetos — precisa regra clara de tempo.',
      'consequence', 'Sem conversa, você pode subestimar overlap de esforço ou superestimar sinergia.',
      'growth_potential', 'Peça mapa de integração: canais, clientes, fornecimento, compliance.',
      'dica_rapida', 'Defina se isto é core ou adjacente no seu portfólio pessoal — honestidade ajuda.',
      'cta_text', 'Quero conhecer novas oportunidades',
      'whatsapp_prefill', 'Oi! Fiz o quiz já empreendo. Quero conversar com quem me enviou este link sobre sinergia ou overlap com os meus projetos atuais.'
    )
  ),
  (
    'ja-empreendem',
    'RISK_DIAGNOSIS',
    'moderado',
    NULL,
    jsonb_build_object(
      'profile_title', 'Empreendedor experiente — converse sobre números e sistemas com a equipe',
      'profile_summary', 'As respostas revelam mentalidade de P&L e processo. Esse perfil acelera quando a liderança entra em detalhe operacional — sem discurso iniciante.',
      'frase_identificacao', 'Se isso descreve você, tolerância baixa para vagueza.',
      'main_blocker', 'Risco de microgestão demais do seu lado antes de confiar nos playbooks da equipe.',
      'consequence', 'Não delegar partes padronizadas te cansa sem necessidade.',
      'growth_potential', 'Alinhe com quem te enviou o link quais partes são “seguir roteiro” e quais são o seu diferencial.',
      'dica_rapida', 'Use OKR pessoal de 90 dias para este braço — mesmo exploratório.',
      'cta_text', 'Quero conhecer novas oportunidades',
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
      'profile_summary', 'Pelas respostas, há energia para decisão com prazo. Conversa prioritária com quem te convidou para não adiar sinergia ou descartar sem dados.',
      'frase_identificacao', 'Se você se vê aqui, você odeia deixar oportunidade estratégica em standby.',
      'main_blocker', 'Decisão sem análise com calma interna na equipe pode gerar arrependimento — evite.',
      'consequence', 'Atrasar pode perder timing de mercado ou momentum pessoal.',
      'growth_potential', 'Marque reunião estruturada: traga perguntas sobre capilaridade (logística, marca, cliente alvo).',
      'dica_rapida', 'Documente hipótese antes da call — clarifique sua mente e respeite o tempo de todos.',
      'cta_text', 'Quero conhecer novas oportunidades',
      'whatsapp_prefill', 'Oi! Fiz o quiz já empreendo e preciso decidir integração estratégica. Quero marcar conversa prioritária com quem me enviou este link com perguntas objetivas.'
    )
  );
