-- SEED — Pacote 1 da Biblioteca do Noel
-- 20 estratégias + 20 conversas + 10 insights
-- Rodar após migrations 260 e 263 (tabelas diagnosis_insights, noel_strategy_library, noel_conversation_library).
-- Ver: docs/NOEL-ESTADO-ATUAL-E-PONTOS-INTEGRACAO-BIBLIOTECA.md

-- =============================================================================
-- 1) noel_strategy_library (20 estratégias)
-- =============================================================================

INSERT INTO noel_strategy_library (topic, problem, strategy, example, next_action) VALUES
('gerar_clientes', 'profissional posta conteúdo mas quase ninguém entra em contato', 'usar diagnósticos curtos para despertar curiosidade e iniciar conversas', 'compartilhar um diagnóstico como "descubra o que pode estar travando seus resultados"', 'criar_link_diagnostico'),
('gerar_clientes', 'seguidores acompanham mas não interagem', 'usar perguntas diagnósticas que fazem a pessoa refletir sobre a própria situação', 'perguntar "qual desses bloqueios parece mais com o que você vive hoje?"', 'enviar_diagnostico'),
('filtrar_curiosos', 'muitas pessoas perguntam preço sem entender o serviço', 'usar diagnóstico antes de falar sobre valores', 'dizer "antes de falar de valores posso entender sua situação?"', 'iniciar_diagnostico'),
('autoridade', 'profissional parece apenas mais um no mercado', 'mostrar análise da situação do cliente baseada em respostas', 'explicar "com base nas suas respostas parece que..."', 'explicar_resultado'),
('iniciar_conversa', 'profissional não sabe como iniciar conversas', 'usar diagnóstico como ponto de partida da conversa', 'oferecer um diagnóstico rápido antes de explicar o serviço', 'enviar_link'),
('engajamento', 'conteúdo gera visualizações mas poucas respostas', 'inserir perguntas diagnósticas nos conteúdos', 'postar perguntas como "qual dessas situações você vive hoje?"', 'gerar_interacao'),
('gerar_indicacoes', 'clientes satisfeitos não indicam novas pessoas', 'pedir indicação logo após mostrar um resultado ou insight', 'perguntar "você conhece alguém que também poderia se beneficiar disso?"', 'pedir_indicacao'),
('agenda_vazia', 'profissional tem poucos atendimentos', 'compartilhar diagnósticos que despertam consciência de problema', 'diagnósticos que mostram bloqueios invisíveis', 'divulgar_diagnostico'),
('conversao', 'clientes interessados demoram para decidir', 'mostrar claramente o bloqueio identificado no diagnóstico', 'explicar o impacto de não resolver o problema', 'mostrar_caminho'),
('educacao_cliente', 'cliente não entende o valor do serviço', 'explicar o problema antes de oferecer solução', 'perguntar sobre situação antes de explicar preço', 'iniciar_diagnostico'),
('autoridade_profissional', 'profissional é visto apenas como vendedor', 'fazer perguntas estratégicas antes de oferecer solução', 'perguntar "o que você já tentou fazer para resolver isso?"', 'aprofundar_conversa'),
('engajar_seguidores', 'seguidores passivos', 'usar diagnósticos interativos', 'diagnóstico rápido de 3 ou 4 perguntas', 'compartilhar_link'),
('posicionamento', 'profissional não consegue se diferenciar', 'mostrar que cada pessoa tem um bloqueio diferente', 'explicar diagnóstico personalizado', 'explicar_diagnostico'),
('recuperar_cliente', 'cliente parou de responder', 'retomar contato com diagnóstico ou insight', 'enviar diagnóstico relevante', 'reenviar_link'),
('qualificar_cliente', 'muitas conversas com pessoas sem interesse real', 'usar diagnóstico antes da conversa longa', 'explicar que o diagnóstico ajuda a entender se faz sentido avançar', 'qualificar'),
('gerar_interesse', 'pessoas não percebem que têm um problema', 'diagnóstico que revela bloqueio invisível', 'usar títulos como "descubra o que pode estar travando seus resultados"', 'divulgar'),
('educacao', 'cliente busca solução rápida', 'explicar causas do problema antes da solução', 'explicar bloqueio identificado', 'orientar'),
('gerar_confianca', 'cliente desconfia do profissional', 'mostrar análise baseada nas respostas da pessoa', 'interpretar diagnóstico com cuidado', 'interpretar'),
('crescimento_profissional', 'profissional depende apenas de indicação', 'usar diagnósticos como portas de entrada para novos contatos', 'divulgar diagnósticos em conteúdos', 'criar_link'),
('diagnostico_como_marketing', 'profissional tenta vender diretamente', 'servir antes de oferecer', 'usar diagnóstico para iniciar relacionamento', 'oferecer_diagnostico');

-- =============================================================================
-- 2) noel_conversation_library (20 conversas)
-- =============================================================================

INSERT INTO noel_conversation_library (scenario, user_question, good_answer, why_it_works) VALUES
('cliente pergunta preço', 'quanto custa?', 'antes de falar de valores posso entender melhor sua situação? existe um diagnóstico rápido que ajuda a identificar isso', 'leva a conversa para diagnóstico em vez de negociação'),
('cliente curioso', 'como funciona?', 'funciona através de um diagnóstico inicial que ajuda a entender o que pode estar acontecendo na sua situação', 'desperta curiosidade'),
('cliente indeciso', 'vou pensar', 'claro, enquanto isso posso te mostrar um diagnóstico que ajuda a clarear essa decisão', 'mantém a conversa ativa'),
('cliente pede desconto', 'tem desconto?', 'antes de falar de valores posso entender melhor o que você precisa resolver?', 'muda foco da negociação'),
('cliente sem tempo', 'estou sem tempo agora', 'sem problema, o diagnóstico leva menos de dois minutos', 'reduz objeção'),
('cliente não entende serviço', 'o que você faz?', 'eu ajudo primeiro a entender o que pode estar travando seus resultados', 'posiciona como especialista'),
('cliente quer solução', 'qual a solução?', 'a solução depende muito do que está acontecendo na sua situação', 'leva à análise'),
('cliente pede conselho', 'o que você acha?', 'posso entender melhor o que está acontecendo antes de te orientar?', 'mostra responsabilidade'),
('cliente por indicação', 'me indicaram você', 'que bom, posso entender um pouco da sua situação primeiro?', 'qualifica cliente'),
('cliente relata problema', 'estou com dificuldade nisso', 'isso é mais comum do que parece, posso te mostrar um diagnóstico?', 'gera conexão'),
('cliente confuso', 'não sei por onde começar', 'podemos começar com um diagnóstico rápido', 'traz clareza'),
('cliente compara', 'estou vendo outros profissionais', 'cada pessoa enfrenta bloqueios diferentes', 'reposiciona'),
('cliente desconfiado', 'isso funciona mesmo?', 'depende muito da situação de cada pessoa', 'evita promessa'),
('cliente cético', 'não acredito muito nisso', 'faz sentido questionar', 'gera empatia'),
('cliente apressado', 'quero resolver rápido', 'entendo, por isso o diagnóstico ajuda a identificar o ponto certo', 'mostra método'),
('cliente cansado', 'já tentei de tudo', 'muitas pessoas passam por isso', 'valida experiência'),
('cliente inseguro', 'não sei se vai funcionar para mim', 'cada pessoa tem um contexto diferente', 'personaliza'),
('cliente tímido', 'não gosto de falar muito', 'o diagnóstico ajuda justamente nisso', 'reduz pressão'),
('cliente curioso', 'isso é teste?', 'é uma forma de entender melhor a situação', 'explica'),
('cliente aberto', 'quero entender melhor', 'ótimo, então vamos começar com algumas perguntas rápidas', 'conduz conversa');

-- =============================================================================
-- 3) diagnosis_insights (10 insights)
-- diagnostic_id = UUID fixo (insights gerais; depois pode-se mapear a diagnosis_profiles por slug)
-- =============================================================================

INSERT INTO diagnosis_insights (diagnostic_id, answers_count, most_common_answer, conversion_rate, insight_text) VALUES
('00000000-0000-0000-0000-000000000001', 120, 'curiosos', 0.18, 'muitos profissionais conseguem gerar interesse inicial mas têm dificuldade em transformar conversas em clientes'),
('00000000-0000-0000-0000-000000000001', 96, 'baixa_consistencia', 0.22, 'a falta de consistência nas ações de divulgação aparece como um dos principais fatores para agenda vazia'),
('00000000-0000-0000-0000-000000000001', 88, 'preco', 0.17, 'uma grande parte das conversas começa discutindo preço antes de entender o problema'),
('00000000-0000-0000-0000-000000000001', 75, 'curiosidade', 0.20, 'diagnósticos interativos aumentam muito o interesse inicial das pessoas'),
('00000000-0000-0000-0000-000000000001', 64, 'confusao', 0.15, 'muitos profissionais não têm clareza sobre o verdadeiro bloqueio que enfrentam'),
('00000000-0000-0000-0000-000000000001', 72, 'falta_estrategia', 0.19, 'a ausência de uma estratégia clara de geração de contatos aparece com frequência'),
('00000000-0000-0000-0000-000000000001', 54, 'falta_posicionamento', 0.16, 'muitos profissionais têm dificuldade em se diferenciar no mercado'),
('00000000-0000-0000-0000-000000000001', 69, 'falta_conversa', 0.21, 'muitos profissionais evitam iniciar conversas por medo de parecer vendedores'),
('00000000-0000-0000-0000-000000000001', 61, 'seguidores_passivos', 0.14, 'grande parte dos seguidores acompanha conteúdo mas raramente interage'),
('00000000-0000-0000-0000-000000000001', 58, 'falta_diagnostico', 0.23, 'diagnósticos ajudam a iniciar conversas mais profundas com clientes');
