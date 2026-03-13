-- SEED — Preenche diagnostico nas estratégias existentes (pacote 1).
-- Estrutura: problema → diagnóstico → orientação (strategy) → próximo movimento (next_action).
-- Rodar após 266 (coluna diagnostico).
-- O diagnostico orienta o Noel a investigar antes de responder.

UPDATE noel_strategy_library SET diagnostico = 'perguntar onde divulga, com que frequência, e se já testou diagnósticos ou quizzes' WHERE topic = 'gerar_clientes' AND problem = 'profissional posta conteúdo mas quase ninguém entra em contato';
UPDATE noel_strategy_library SET diagnostico = 'perguntar que tipo de conteúdo posta e se há call to action claro' WHERE topic = 'gerar_clientes' AND problem = 'seguidores acompanham mas não interagem';
UPDATE noel_strategy_library SET diagnostico = 'perguntar em que momento da conversa o preço entra e como ele qualifica antes' WHERE topic = 'filtrar_curiosos' AND problem = 'muitas pessoas perguntam preço sem entender o serviço';
UPDATE noel_strategy_library SET diagnostico = 'perguntar como ele apresenta o serviço hoje e o que costuma dizer primeiro' WHERE topic = 'autoridade' AND problem = 'profissional parece apenas mais um no mercado';
UPDATE noel_strategy_library SET diagnostico = 'perguntar em quais situações ele poderia iniciar conversas (rede, eventos, DM)' WHERE topic = 'iniciar_conversa' AND problem = 'profissional não sabe como iniciar conversas';
UPDATE noel_strategy_library SET diagnostico = 'perguntar que tipo de conteúdo gera mais visualizações e se há pergunta no final' WHERE topic = 'engajamento' AND problem = 'conteúdo gera visualizações mas poucas respostas';
UPDATE noel_strategy_library SET diagnostico = 'perguntar se pede indicação após bons resultados e como faz hoje' WHERE topic = 'gerar_indicacoes' AND problem = 'clientes satisfeitos não indicam novas pessoas';
UPDATE noel_strategy_library SET diagnostico = 'perguntar onde divulga hoje e se usa diagnósticos' WHERE topic = 'agenda_vazia' AND problem = 'profissional tem poucos atendimentos';
UPDATE noel_strategy_library SET diagnostico = 'perguntar o que acontece quando o cliente demonstra interesse e onde trava' WHERE topic = 'conversao' AND problem = 'clientes interessados demoram para decidir';
UPDATE noel_strategy_library SET diagnostico = 'perguntar como explica o valor do serviço hoje e em que momento' WHERE topic = 'educacao_cliente' AND problem = 'cliente não entende o valor do serviço';
UPDATE noel_strategy_library SET diagnostico = 'perguntar como ele inicia conversas e se faz perguntas antes de explicar' WHERE topic = 'autoridade_profissional' AND problem = 'profissional é visto apenas como vendedor';
UPDATE noel_strategy_library SET diagnostico = 'perguntar que tipo de conteúdo posta e se há interação' WHERE topic = 'engajar_seguidores' AND problem = 'seguidores passivos';
UPDATE noel_strategy_library SET diagnostico = 'perguntar como ele se apresenta e o que diferencia hoje' WHERE topic = 'posicionamento' AND problem = 'profissional não consegue se diferenciar';
UPDATE noel_strategy_library SET diagnostico = 'perguntar há quanto tempo o cliente parou e qual foi o último contato' WHERE topic = 'recuperar_cliente' AND problem = 'cliente parou de responder';
UPDATE noel_strategy_library SET diagnostico = 'perguntar como ele qualifica hoje e em que momento da conversa' WHERE topic = 'qualificar_cliente' AND problem = 'muitas conversas com pessoas sem interesse real';
UPDATE noel_strategy_library SET diagnostico = 'perguntar que canais usa e se as pessoas já chegam com problema claro' WHERE topic = 'gerar_interesse' AND problem = 'pessoas não percebem que têm um problema';
UPDATE noel_strategy_library SET diagnostico = 'perguntar o que o cliente já tentou e qual a expectativa' WHERE topic = 'educacao' AND problem = 'cliente busca solução rápida';
UPDATE noel_strategy_library SET diagnostico = 'perguntar como ele apresenta o serviço e se mostra análise baseada em respostas' WHERE topic = 'gerar_confianca' AND problem = 'cliente desconfia do profissional';
UPDATE noel_strategy_library SET diagnostico = 'perguntar onde divulga hoje e se usa diagnósticos em conteúdos' WHERE topic = 'crescimento_profissional' AND problem = 'profissional depende apenas de indicação';
UPDATE noel_strategy_library SET diagnostico = 'perguntar como ele inicia conversas hoje e se oferece valor antes' WHERE topic = 'diagnostico_como_marketing' AND problem = 'profissional tenta vender diretamente';
