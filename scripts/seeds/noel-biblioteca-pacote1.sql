-- Pacote 1 da Biblioteca do Noel
-- 20 estratégias + 20 conversas + 10 insights
-- Rodar após migrations 260 e 263.
-- Ver: docs/NOEL-ESTADO-ATUAL-E-PONTOS-INTEGRACAO-BIBLIOTECA.md

-- diagnosis_insights: diagnostic_id = UUID fixo (diagnósticos no código são por slug em config;
-- não há tabela de diagnósticos com UUID; depois pode-se criar diagnosis_profiles).

-- =============================================================================
-- 1) noel_strategy_library (20 estratégias)
-- =============================================================================

INSERT INTO noel_strategy_library (topic, problem, strategy, example, next_action) VALUES
('gerar_clientes', 'profissional posta conteúdo mas quase ninguém entra em contato', 'usar diagnósticos curtos para despertar curiosidade e iniciar conversas naturais', 'em vez de postar apenas dicas, compartilhar um diagnóstico como "descubra o que pode estar travando seus resultados"', 'criar_link_diagnostico'),
('gerar_clientes', 'seguidores acompanham mas não interagem', 'utilizar perguntas diagnósticas que fazem a pessoa refletir sobre a própria situação', 'você acha que seu maior bloqueio hoje está na rotina ou na estratégia?', 'enviar_diagnostico'),
('filtrar_curiosos', 'muitas pessoas perguntam preço sem entender o serviço', 'usar diagnóstico antes de falar sobre valores', 'antes de falar de valores, posso entender um pouco da sua situação?', 'iniciar_diagnostico'),
('autoridade', 'profissional parece apenas mais um no mercado', 'utilizar diagnósticos que mostram análise da situação do cliente', 'com base nas suas respostas parece que seu principal bloqueio está em…', 'explicar_resultado'),
('iniciar_conversa', 'profissional não sabe como começar conversa com potenciais clientes', 'usar diagnósticos como ponto de partida da conversa', 'posso te mostrar um diagnóstico rápido que ajuda a entender melhor isso?', 'enviar_link'),
('engajamento', 'conteúdo gera visualizações mas poucas respostas', 'usar perguntas diagnósticas nos conteúdos', 'qual dessas situações parece mais com a sua hoje?', 'gerar_interacao'),
('gerar_indicacoes', 'clientes satisfeitos não indicam novas pessoas', 'pedir indicação logo após mostrar resultado ou evolução', 'você conhece alguém que também poderia se beneficiar disso?', 'pedir_indicacao'),
('agenda_vazia', 'profissional tem poucos atendimentos', 'compartilhar diagnósticos que despertam consciência de problema', 'muitas pessoas não percebem que estão enfrentando esse bloqueio', 'divulgar_diagnostico'),
('conversao', 'clientes interessados demoram para decidir', 'mostrar claramente o bloqueio identificado no diagnóstico', 'se nada mudar nessa área, esse resultado tende a continuar acontecendo', 'mostrar_caminho'),
('educacao_cliente', 'cliente não entende o valor do serviço', 'usar diagnóstico para explicar o problema antes da solução', 'vamos entender primeiro o que está acontecendo', 'iniciar_diagnostico'),
('autoridade_profissional', 'profissional é visto apenas como vendedor', 'fazer perguntas estratégicas antes de oferecer solução', 'o que você já tentou fazer para resolver isso?', 'aprofundar_conversa'),
('engajar_seguidores', 'seguidores passivos', 'diagnósticos interativos', 'responda 4 perguntas rápidas para descobrir…', 'compartilhar_link'),
('posicionamento', 'profissional não consegue se diferenciar', 'mostrar capacidade de análise da situação do cliente', 'cada pessoa tem um bloqueio diferente', 'explicar_diagnostico'),
('recuperar_cliente', 'cliente parou de responder', 'retomar contato com diagnóstico', 'vi algo que pode te ajudar a entender melhor sua situação', 'reenviar_link'),
('qualificar_cliente', 'muitas conversas com pessoas sem interesse real', 'diagnóstico antes da conversa longa', 'isso ajuda a entender se faz sentido avançarmos', 'qualificar'),
('gerar_interesse', 'pessoas não percebem que têm um problema', 'diagnóstico que revela bloqueio', 'descubra o que pode estar travando seus resultados', 'divulgar'),
('educacao', 'cliente busca solução rápida sem entender causa', 'explicar o bloqueio identificado', 'isso acontece com muitas pessoas por causa de…', 'orientar'),
('gerar_confianca', 'cliente desconfia do profissional', 'mostrar análise baseada em respostas', 'com base no que você respondeu…', 'interpretar'),
('crescimento_profissional', 'profissional depende apenas de indicação', 'usar diagnósticos para gerar novos contatos', 'diagnósticos funcionam como portas de entrada', 'criar_link'),
('diagnostico_como_marketing', 'profissional tenta vender diretamente', 'servir antes de oferecer', 'primeiro ajudamos a entender o problema', 'oferecer_diagnostico');

-- =============================================================================
-- 2) noel_conversation_library (20 conversas)
-- =============================================================================

INSERT INTO noel_conversation_library (scenario, user_question, good_answer, why_it_works) VALUES
('cliente pergunta preço', 'quanto custa?', 'antes de falar de valores posso entender melhor sua situação? existe um diagnóstico rápido que ajuda a identificar isso', 'leva a conversa para diagnóstico em vez de negociação de preço'),
('cliente curioso', 'como funciona?', 'funciona através de um diagnóstico inicial que ajuda a entender o que está acontecendo na sua situação', 'desperta curiosidade'),
('cliente indeciso', 'vou pensar', 'claro, enquanto isso posso te mostrar um diagnóstico que ajuda a clarear essa decisão', 'mantém a conversa ativa'),
('cliente pede desconto', 'tem desconto?', 'antes de falar de valores, posso entender melhor o que você precisa resolver?', 'muda foco da negociação'),
('cliente diz que não tem tempo', 'estou sem tempo agora', 'sem problema, o diagnóstico leva menos de dois minutos e já ajuda a entender sua situação', 'reduz objeção'),
('cliente não entende o serviço', 'o que exatamente você faz?', 'eu ajudo as pessoas primeiro a entender o que pode estar travando seus resultados', 'posiciona como especialista'),
('cliente quer resolver rápido', 'qual é a solução?', 'a solução depende muito do que está acontecendo na sua situação', 'leva à análise'),
('cliente pede conselho', 'o que você acha que devo fazer?', 'antes de te orientar, posso entender melhor o que está acontecendo?', 'mostra responsabilidade profissional'),
('cliente chega por indicação', 'me indicaram você', 'que bom, posso entender um pouco da sua situação primeiro?', 'qualifica cliente'),
('cliente relata problema', 'estou enfrentando dificuldade com isso', 'isso é mais comum do que parece, posso te mostrar um diagnóstico que ajuda a entender melhor?', 'gera conexão'),
('cliente pergunta se resolve', 'isso realmente funciona?', 'funciona quando a gente entende primeiro o que está acontecendo na sua situação', 'leva ao diagnóstico'),
('cliente compara com outro profissional', 'fulano cobra mais barato', 'cada profissional trabalha de um jeito; o que faz diferença é entender sua situação', 'evita guerra de preço'),
('cliente some e volta', 'sumi, mas quero retomar', 'sem problema, posso te enviar de novo o diagnóstico para a gente retomar de onde parou?', 'reengaja'),
('cliente pede resultado rápido', 'em quanto tempo vejo resultado?', 'depende do que o diagnóstico mostrar; às vezes um ajuste já muda bastante', 'mantém expectativa realista'),
('cliente não sabe se precisa', 'não sei se é pra mim', 'por isso o diagnóstico ajuda: em poucos minutos você vê se faz sentido', 'reduz insegurança'),
('cliente quer falar com outra pessoa', 'prefiro falar com minha esposa primeiro', 'tranquilo; posso te mandar o link do diagnóstico para vocês dois olharem?', 'inclui decisor'),
('cliente acha que já sabe tudo', 'já sei o que tenho', 'que bom; o diagnóstico às vezes mostra um ângulo que a gente não tinha visto', 'abre porta'),
('cliente reclama de preço', 'está caro', 'o que está caro é continuar com o que não está funcionando; o diagnóstico mostra onde está o bloqueio', 'reframe'),
('cliente pede garantia', 'vocês garantem resultado?', 'garantimos que vamos entender sua situação; o diagnóstico é o primeiro passo', 'foca no processo'),
('cliente quer só informação', 'quero só saber mais', 'o diagnóstico é justamente isso: você responde umas perguntas e descobre onde está', 'converte curiosidade em ação');

-- =============================================================================
-- 3) diagnosis_insights (10 insights)
-- diagnostic_id = UUID fixo (slug no código é comunicacao, agenda, etc.; sem tabela ainda)
-- =============================================================================

INSERT INTO diagnosis_insights (diagnostic_id, answers_count, most_common_answer, conversion_rate, insight_text) VALUES
('00000000-0000-0000-0000-000000000001', 124, 'curiosos', 0.18, 'muitos profissionais conseguem gerar interesse inicial mas têm dificuldade em transformar conversas em clientes'),
('00000000-0000-0000-0000-000000000001', 96, 'baixa_consistencia', 0.22, 'a falta de consistência nas ações de divulgação aparece como um dos principais fatores para agenda vazia'),
('00000000-0000-0000-0000-000000000001', 87, 'preco_primeiro', 0.15, 'quando a conversa começa pelo preço, a taxa de conversão cai; diagnóstico antes de valores melhora o resultado'),
('00000000-0000-0000-0000-000000000001', 102, 'dificuldade_iniciar', 0.20, 'a maioria dos profissionais relata dificuldade em iniciar conversas com potenciais clientes'),
('00000000-0000-0000-0000-000000000001', 76, 'poucas_indicacoes', 0.12, 'clientes satisfeitos ainda indicam pouco; pedir indicação após o resultado do diagnóstico aumenta indicações'),
('00000000-0000-0000-0000-000000000001', 91, 'conteudo_sem_resposta', 0.14, 'conteúdo que só informa gera visualização mas pouca interação; perguntas diagnósticas aumentam engajamento'),
('00000000-0000-0000-0000-000000000001', 68, 'cliente_indeciso', 0.19, 'quando o profissional mostra o bloqueio identificado no diagnóstico, a decisão tende a ser mais rápida'),
('00000000-0000-0000-0000-000000000001', 110, 'valor_nao_entendido', 0.16, 'quem não entende o valor do serviço pede desconto; diagnóstico que explica o problema reduz essa objeção'),
('00000000-0000-0000-0000-000000000001', 83, 'retomada_contato', 0.21, 'reenviar um diagnóstico é uma forma eficaz de reengajar quem parou de responder'),
('00000000-0000-0000-0000-000000000001', 95, 'diferenciação', 0.17, 'profissionais que usam diagnóstico antes da oferta são percebidos mais como especialistas do que como vendedores');
