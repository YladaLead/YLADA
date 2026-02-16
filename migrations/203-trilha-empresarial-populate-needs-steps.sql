-- =====================================================
-- Trilha Empresarial YLADA — Popular conteúdo (needs + steps)
-- @see docs/TRILHA-EMPRESARIAL-ESTRUTURA-NECESSIDADES-PLAYBOOKS.md
-- Linguagem neutra (profissional, sua prática).
-- =====================================================

-- 1) Fundamentos (F1–F5)
INSERT INTO trilha_needs (code, type, title, description_short, order_index) VALUES
  ('F1', 'fundamento', 'Identidade', 'Quem você é como profissional que atua como empresário(a)', 1),
  ('F2', 'fundamento', 'Postura & Comunicação', 'Autoridade sem agressividade; tom e linguagem', 2),
  ('F3', 'fundamento', 'Ambiente & Organização', 'Espaço físico e digital; pastas, CRM simples', 3),
  ('F4', 'fundamento', 'Rotina Mínima', '15–30 min/dia de blocos fixos', 4),
  ('F5', 'fundamento', 'Metas e Painel', 'Metas 30/60/90 dias; 3 indicadores', 5)
ON CONFLICT (code) DO UPDATE SET
  type = EXCLUDED.type, title = EXCLUDED.title, description_short = EXCLUDED.description_short, order_index = EXCLUDED.order_index, updated_at = NOW();

-- 2) Necessidades (N1–N7)
INSERT INTO trilha_needs (code, type, title, description_short, order_index) VALUES
  ('N1', 'necessidade', 'Agenda vazia / instável', 'Poucos ou nenhum agendamento; busca preencher agenda', 6),
  ('N2', 'necessidade', 'Posto e ninguém chama', 'Conteúdo publicado mas pouca resposta ou contato', 7),
  ('N3', 'necessidade', 'Conversas não viram agendamento', 'Interesse existe mas não converte em consulta/compra', 8),
  ('N4', 'necessidade', 'Não consigo indicação', 'Dificuldade de pedir ou receber indicações', 9),
  ('N5', 'necessidade', 'Não uso links direito', 'Ferramentas/links de captação pouco usados ou mal encaixados', 10),
  ('N6', 'necessidade', 'Follow-up fraco', 'Abandono após primeiro contato; sem sequência de retorno', 11),
  ('N7', 'necessidade', 'Quero escalar', 'Já funciona; quer crescer de forma estruturada', 12)
ON CONFLICT (code) DO UPDATE SET
  type = EXCLUDED.type, title = EXCLUDED.title, description_short = EXCLUDED.description_short, order_index = EXCLUDED.order_index, updated_at = NOW();

-- 3) Steps dos Fundamentos (F1)
INSERT INTO trilha_steps (need_id, code, title, objective, guidance, checklist_items, motivational_phrase, order_index)
SELECT n.id, 'F1.1', 'Filosofia YLADA (método e mentalidade)',
  'Clareza do método e do porquê',
  'Conheça a base do Método YLADA e como ele transforma sua prática em negócio. Reserve um momento para absorver este conteúdo.',
  '["Ler a introdução completa do Método YLADA", "Anotar os 3 principais aprendizados", "Refletir sobre como aplicar na sua prática"]'::jsonb,
  'Todo grande negócio começa com uma base sólida. Você está construindo a sua agora.',
  1
FROM trilha_needs n WHERE n.code = 'F1'
ON CONFLICT (need_id, code) DO UPDATE SET title = EXCLUDED.title, objective = EXCLUDED.objective, guidance = EXCLUDED.guidance, checklist_items = EXCLUDED.checklist_items, motivational_phrase = EXCLUDED.motivational_phrase, order_index = EXCLUDED.order_index, updated_at = NOW();

INSERT INTO trilha_steps (need_id, code, title, objective, guidance, checklist_items, motivational_phrase, order_index)
SELECT n.id, 'F1.2', 'Identidade do profissional-empreendedor',
  'Frase de posicionamento + postura',
  'A transformação começa na identidade. Trabalhe em como se vê e como quer ser visto. Isso impacta diretamente na forma como você atende, precifica e se posiciona.',
  '["Definir sua identidade como profissional-empreendedor", "Escrever 3 características que você quer desenvolver", "Criar uma frase de posicionamento pessoal", "Aplicar essa postura em uma interação hoje"]'::jsonb,
  'Sua identidade define seus resultados.',
  2
FROM trilha_needs n WHERE n.code = 'F1'
ON CONFLICT (need_id, code) DO UPDATE SET title = EXCLUDED.title, objective = EXCLUDED.objective, guidance = EXCLUDED.guidance, checklist_items = EXCLUDED.checklist_items, motivational_phrase = EXCLUDED.motivational_phrase, order_index = EXCLUDED.order_index, updated_at = NOW();

-- F2
INSERT INTO trilha_steps (need_id, code, title, objective, guidance, checklist_items, motivational_phrase, order_index)
SELECT n.id, 'F2.1', 'Postura e linguagem (autoridade sem agressividade)',
  '3 ajustes de linguagem (antes/depois)',
  'Como você se comunica define como você é percebido. Trabalhe em sua postura profissional e comunicação: autoridade que convence sem pressionar.',
  '["Revisar sua comunicação atual", "Definir tom de voz profissional", "Criar templates de comunicação", "Aplicar em uma interação real"]'::jsonb,
  'Comunicação clara gera confiança.',
  1
FROM trilha_needs n WHERE n.code = 'F2'
ON CONFLICT (need_id, code) DO UPDATE SET title = EXCLUDED.title, objective = EXCLUDED.objective, guidance = EXCLUDED.guidance, checklist_items = EXCLUDED.checklist_items, motivational_phrase = EXCLUDED.motivational_phrase, order_index = EXCLUDED.order_index, updated_at = NOW();

-- F3
INSERT INTO trilha_steps (need_id, code, title, objective, guidance, checklist_items, motivational_phrase, order_index)
SELECT n.id, 'F3.1', 'Ambiente e organização (físico + digital)',
  'Setup mínimo para constância',
  'Ambiente organizado, mente organizada. Estruture seu espaço de trabalho (físico e digital) para maximizar sua eficiência.',
  '["Organizar espaço físico de trabalho", "Organizar arquivos digitais", "Configurar ferramentas essenciais", "Criar sistema de arquivamento"]'::jsonb,
  'Seu ambiente reflete sua mentalidade.',
  1
FROM trilha_needs n WHERE n.code = 'F3'
ON CONFLICT (need_id, code) DO UPDATE SET title = EXCLUDED.title, objective = EXCLUDED.objective, guidance = EXCLUDED.guidance, checklist_items = EXCLUDED.checklist_items, motivational_phrase = EXCLUDED.motivational_phrase, order_index = EXCLUDED.order_index, updated_at = NOW();

-- F4
INSERT INTO trilha_steps (need_id, code, title, objective, guidance, checklist_items, motivational_phrase, order_index)
SELECT n.id, 'F4.1', 'Rotina mínima (15–30 min/dia)',
  'Rotina salva (blocos definidos)',
  'Rotina não é sobre trabalhar mais, é sobre trabalhar melhor. Crie sua rotina mínima: a estrutura básica que sustenta seu crescimento.',
  '["Baixar o checklist da Rotina Mínima", "Definir seus horários de trabalho", "Organizar suas tarefas diárias", "Aplicar a rotina hoje mesmo"]'::jsonb,
  'Rotina é liberdade. Quando você organiza, ganha tempo e clareza.',
  1
FROM trilha_needs n WHERE n.code = 'F4'
ON CONFLICT (need_id, code) DO UPDATE SET title = EXCLUDED.title, objective = EXCLUDED.objective, guidance = EXCLUDED.guidance, checklist_items = EXCLUDED.checklist_items, motivational_phrase = EXCLUDED.motivational_phrase, order_index = EXCLUDED.order_index, updated_at = NOW();

-- F5
INSERT INTO trilha_steps (need_id, code, title, objective, guidance, checklist_items, motivational_phrase, order_index)
SELECT n.id, 'F5.1', 'Metas e painel (3 indicadores)',
  'Metas + painel de acompanhamento',
  'Metas claras geram resultados claros. Defina onde quer chegar e como vai medir seu progresso.',
  '["Definir 3 metas para os próximos 30 dias", "Definir 2 metas para os próximos 60 dias", "Definir 1 meta para os próximos 90 dias", "Criar um sistema de acompanhamento"]'::jsonb,
  'Metas sem ação são sonhos. Você está transformando sonhos em realidade.',
  1
FROM trilha_needs n WHERE n.code = 'F5'
ON CONFLICT (need_id, code) DO UPDATE SET title = EXCLUDED.title, objective = EXCLUDED.objective, guidance = EXCLUDED.guidance, checklist_items = EXCLUDED.checklist_items, motivational_phrase = EXCLUDED.motivational_phrase, order_index = EXCLUDED.order_index, updated_at = NOW();

INSERT INTO trilha_steps (need_id, code, title, objective, guidance, checklist_items, motivational_phrase, order_index)
SELECT n.id, 'F5.2', 'Revisão e ajustes',
  'Celebrar conquistas e ajustar o que for necessário',
  'Refletir é evoluir. Revise o que aprendeu e aplicou, celebre suas conquistas e faça os ajustes necessários.',
  '["Revisar todos os passos da semana", "Listar 3 conquistas", "Identificar 1 ponto de melhoria", "Ajustar rotina para a próxima semana", "Celebrar seu progresso"]'::jsonb,
  'Primeira etapa concluída! Você está no caminho certo.',
  2
FROM trilha_needs n WHERE n.code = 'F5'
ON CONFLICT (need_id, code) DO UPDATE SET title = EXCLUDED.title, objective = EXCLUDED.objective, guidance = EXCLUDED.guidance, checklist_items = EXCLUDED.checklist_items, motivational_phrase = EXCLUDED.motivational_phrase, order_index = EXCLUDED.order_index, updated_at = NOW();

-- 4) Steps das Necessidades (N1–N7)
-- N1
INSERT INTO trilha_steps (need_id, code, title, objective, guidance, checklist_items, motivational_phrase, order_index)
SELECT n.id, 'N1.1', 'Primeira ferramenta de captação', '1 ferramenta pronta + onde usar',
  'A captação começa simples. Uma única ferramenta bem escolhida já pode gerar seus primeiros contatos.',
  '["Escolher sua primeira ferramenta", "Personalizar com sua identidade", "Publicar hoje em 1 canal"]'::jsonb, 'Quem entrega valor todos os dias recebe oportunidades todos os dias.', 1
FROM trilha_needs n WHERE n.code = 'N1' ON CONFLICT (need_id, code) DO UPDATE SET title = EXCLUDED.title, objective = EXCLUDED.objective, guidance = EXCLUDED.guidance, checklist_items = EXCLUDED.checklist_items, motivational_phrase = EXCLUDED.motivational_phrase, order_index = EXCLUDED.order_index, updated_at = NOW();

INSERT INTO trilha_steps (need_id, code, title, objective, guidance, checklist_items, motivational_phrase, order_index)
SELECT n.id, 'N1.2', 'CTA oficial', 'CTA + 2 variações',
  'Uma boa CTA é clara, objetiva e convida a pessoa a agir.',
  '["Criar 1 CTA oficial", "Criar 1 variação da CTA", "Publicar junto com sua ferramenta"]'::jsonb, 'Uma boa CTA não convence — ela convida.', 2
FROM trilha_needs n WHERE n.code = 'N1' ON CONFLICT (need_id, code) DO UPDATE SET title = EXCLUDED.title, objective = EXCLUDED.objective, guidance = EXCLUDED.guidance, checklist_items = EXCLUDED.checklist_items, motivational_phrase = EXCLUDED.motivational_phrase, order_index = EXCLUDED.order_index, updated_at = NOW();

INSERT INTO trilha_steps (need_id, code, title, objective, guidance, checklist_items, motivational_phrase, order_index)
SELECT n.id, 'N1.3', 'Distribuição (10–10–10)', 'Rotina de alcance + registro',
  'Distribuição é o que transforma ferramentas estagnadas em movimento.',
  '["Enviar sua ferramenta a 10 contatos estratégicos", "Compartilhar em 10 grupos permitidos", "Interagir em 10 perfis novos"]'::jsonb, 'Você não cresce no silêncio — cresce aparecendo.', 3
FROM trilha_needs n WHERE n.code = 'N1' ON CONFLICT (need_id, code) DO UPDATE SET title = EXCLUDED.title, objective = EXCLUDED.objective, guidance = EXCLUDED.guidance, checklist_items = EXCLUDED.checklist_items, motivational_phrase = EXCLUDED.motivational_phrase, order_index = EXCLUDED.order_index, updated_at = NOW();

INSERT INTO trilha_steps (need_id, code, title, objective, guidance, checklist_items, motivational_phrase, order_index)
SELECT n.id, 'N1.4', 'Story/conteúdo que gera clique', 'Roteiro de story + texto pronto',
  'Os conteúdos que convertem são naturais, simples e diretos.',
  '["Criar um story seguindo o roteiro YLADA", "Publicar 1 story hoje", "Adicionar sua CTA oficial"]'::jsonb, 'Quando você mostra como ajuda, as pessoas clicam.', 4
FROM trilha_needs n WHERE n.code = 'N1' ON CONFLICT (need_id, code) DO UPDATE SET title = EXCLUDED.title, objective = EXCLUDED.objective, guidance = EXCLUDED.guidance, checklist_items = EXCLUDED.checklist_items, motivational_phrase = EXCLUDED.motivational_phrase, order_index = EXCLUDED.order_index, updated_at = NOW();

-- N2
INSERT INTO trilha_steps (need_id, code, title, objective, guidance, checklist_items, motivational_phrase, order_index)
SELECT n.id, 'N2.1', 'Onde está seu público', 'Canal e horário certos', 'Identifique onde sua audiência está e quando está disponível.', '["Mapear canais que usa", "Definir horários de maior alcance", "Ajustar publicação"]'::jsonb, 'Público certo, no momento certo.', 1
FROM trilha_needs n WHERE n.code = 'N2' ON CONFLICT (need_id, code) DO UPDATE SET title = EXCLUDED.title, objective = EXCLUDED.objective, guidance = EXCLUDED.guidance, checklist_items = EXCLUDED.checklist_items, motivational_phrase = EXCLUDED.motivational_phrase, order_index = EXCLUDED.order_index, updated_at = NOW();

INSERT INTO trilha_steps (need_id, code, title, objective, guidance, checklist_items, motivational_phrase, order_index)
SELECT n.id, 'N2.2', 'CTA e oferta clara', 'Mensagem que convida a agir', 'Uma oferta clara remove dúvidas e convida ao próximo passo.', '["Escrever 1 oferta em uma frase", "Criar CTA para essa oferta", "Testar em 1 publicação"]'::jsonb, 'Clareza convence.', 2
FROM trilha_needs n WHERE n.code = 'N2' ON CONFLICT (need_id, code) DO UPDATE SET title = EXCLUDED.title, objective = EXCLUDED.objective, guidance = EXCLUDED.guidance, checklist_items = EXCLUDED.checklist_items, motivational_phrase = EXCLUDED.motivational_phrase, order_index = EXCLUDED.order_index, updated_at = NOW();

INSERT INTO trilha_steps (need_id, code, title, objective, guidance, checklist_items, motivational_phrase, order_index)
SELECT n.id, 'N2.3', 'Distribuição 10–10–10', 'Alcance diário com método', 'Alcance diário consistente traz resultados.', '["Aplicar 10–10–10 hoje", "Registrar onde publicou", "Repetir por 3 dias"]'::jsonb, 'Consistência vence.', 3
FROM trilha_needs n WHERE n.code = 'N2' ON CONFLICT (need_id, code) DO UPDATE SET title = EXCLUDED.title, objective = EXCLUDED.objective, guidance = EXCLUDED.guidance, checklist_items = EXCLUDED.checklist_items, motivational_phrase = EXCLUDED.motivational_phrase, order_index = EXCLUDED.order_index, updated_at = NOW();

-- N3
INSERT INTO trilha_steps (need_id, code, title, objective, guidance, checklist_items, motivational_phrase, order_index)
SELECT n.id, 'N3.1', 'Objeções (reframing)', '3 respostas-curinga', 'Objeções não são barreiras — são portas. Aprenda a transformar objeções em conexão.', '["Ler objeções mais comuns", "Escolher 3 respostas-curinga", "Aplicar hoje em conversas reais"]'::jsonb, 'Quem sabe responder, vende sem pressionar.', 1
FROM trilha_needs n WHERE n.code = 'N3' ON CONFLICT (need_id, code) DO UPDATE SET title = EXCLUDED.title, objective = EXCLUDED.objective, guidance = EXCLUDED.guidance, checklist_items = EXCLUDED.checklist_items, motivational_phrase = EXCLUDED.motivational_phrase, order_index = EXCLUDED.order_index, updated_at = NOW();

INSERT INTO trilha_steps (need_id, code, title, objective, guidance, checklist_items, motivational_phrase, order_index)
SELECT n.id, 'N3.2', 'Padrão de atendimento', 'Roteiro + pergunta poderosa', 'Um atendimento intencional gera mais conversões.', '["Definir roteiro do primeiro contato", "Escrever 1 pergunta poderosa", "Usar no próximo atendimento"]'::jsonb, 'Estrutura gera confiança.', 2
FROM trilha_needs n WHERE n.code = 'N3' ON CONFLICT (need_id, code) DO UPDATE SET title = EXCLUDED.title, objective = EXCLUDED.objective, guidance = EXCLUDED.guidance, checklist_items = EXCLUDED.checklist_items, motivational_phrase = EXCLUDED.motivational_phrase, order_index = EXCLUDED.order_index, updated_at = NOW();

INSERT INTO trilha_steps (need_id, code, title, objective, guidance, checklist_items, motivational_phrase, order_index)
SELECT n.id, 'N3.3', 'Fechamento com link', 'Convite claro + próximo passo', 'Feche com um próximo passo claro: link, agendamento ou mensagem de acompanhamento.', '["Escrever 1 mensagem de fechamento", "Incluir link ou CTA", "Aplicar em 3 conversas"]'::jsonb, 'Próximo passo claro reduz abandono.', 3
FROM trilha_needs n WHERE n.code = 'N3' ON CONFLICT (need_id, code) DO UPDATE SET title = EXCLUDED.title, objective = EXCLUDED.objective, guidance = EXCLUDED.guidance, checklist_items = EXCLUDED.checklist_items, motivational_phrase = EXCLUDED.motivational_phrase, order_index = EXCLUDED.order_index, updated_at = NOW();

-- N4
INSERT INTO trilha_steps (need_id, code, title, objective, guidance, checklist_items, motivational_phrase, order_index)
SELECT n.id, 'N4.1', 'Indicação no atendimento (natural e curta)', '3 scripts + "momento certo"', 'Indicação pode ser natural e curta. Prepare scripts e o momento certo.', '["Escrever 3 scripts curtos de pedido de indicação", "Definir em que momento do atendimento pedir", "Treinar em voz alta"]'::jsonb, 'Indicação é serviço: você está ajudando mais pessoas.', 1
FROM trilha_needs n WHERE n.code = 'N4' ON CONFLICT (need_id, code) DO UPDATE SET title = EXCLUDED.title, objective = EXCLUDED.objective, guidance = EXCLUDED.guidance, checklist_items = EXCLUDED.checklist_items, motivational_phrase = EXCLUDED.motivational_phrase, order_index = EXCLUDED.order_index, updated_at = NOW();

INSERT INTO trilha_steps (need_id, code, title, objective, guidance, checklist_items, motivational_phrase, order_index)
SELECT n.id, 'N4.2', 'Pedir indicação como serviço', 'Normalizar o pedido; 1 script aplicado', 'Normalize o pedido de indicação: é parte do seu serviço.', '["Escolher 1 script", "Aplicar com 3 pessoas esta semana", "Anotar o que funcionou"]'::jsonb, 'Pedir indicação é profissional.', 2
FROM trilha_needs n WHERE n.code = 'N4' ON CONFLICT (need_id, code) DO UPDATE SET title = EXCLUDED.title, objective = EXCLUDED.objective, guidance = EXCLUDED.guidance, checklist_items = EXCLUDED.checklist_items, motivational_phrase = EXCLUDED.motivational_phrase, order_index = EXCLUDED.order_index, updated_at = NOW();

-- N5
INSERT INTO trilha_steps (need_id, code, title, objective, guidance, checklist_items, motivational_phrase, order_index)
SELECT n.id, 'N5.1', 'Primeiro link de valor', '1 link pronto + onde usar', 'Um link de valor guia a conversa e gera continuidade.', '["Escolher 1 ferramenta/link", "Definir onde usar (story, mensagem, bio)", "Publicar ou enviar hoje"]'::jsonb, 'Link = continuação da conversa.', 1
FROM trilha_needs n WHERE n.code = 'N5' ON CONFLICT (need_id, code) DO UPDATE SET title = EXCLUDED.title, objective = EXCLUDED.objective, guidance = EXCLUDED.guidance, checklist_items = EXCLUDED.checklist_items, motivational_phrase = EXCLUDED.motivational_phrase, order_index = EXCLUDED.order_index, updated_at = NOW();

INSERT INTO trilha_steps (need_id, code, title, objective, guidance, checklist_items, motivational_phrase, order_index)
SELECT n.id, 'N5.2', 'CTA para o link', 'CTA + 2 variações', 'CTA que convida a clicar no link.', '["Criar 1 CTA para o link", "Criar 2 variações", "Usar em 2 canais"]'::jsonb, 'CTA clara aumenta cliques.', 2
FROM trilha_needs n WHERE n.code = 'N5' ON CONFLICT (need_id, code) DO UPDATE SET title = EXCLUDED.title, objective = EXCLUDED.objective, guidance = EXCLUDED.guidance, checklist_items = EXCLUDED.checklist_items, motivational_phrase = EXCLUDED.motivational_phrase, order_index = EXCLUDED.order_index, updated_at = NOW();

INSERT INTO trilha_steps (need_id, code, title, objective, guidance, checklist_items, motivational_phrase, order_index)
SELECT n.id, 'N5.3', 'Pós-atendimento com link', '2 mensagens prontas + link correto', 'Acompanhe após o atendimento com mensagens e link certos.', '["Escrever 2 mensagens de pós-atendimento", "Incluir link correto em cada uma", "Enviar para 1 cliente"]'::jsonb, 'Acompanhamento gera retorno.', 3
FROM trilha_needs n WHERE n.code = 'N5' ON CONFLICT (need_id, code) DO UPDATE SET title = EXCLUDED.title, objective = EXCLUDED.objective, guidance = EXCLUDED.guidance, checklist_items = EXCLUDED.checklist_items, motivational_phrase = EXCLUDED.motivational_phrase, order_index = EXCLUDED.order_index, updated_at = NOW();

-- N6
INSERT INTO trilha_steps (need_id, code, title, objective, guidance, checklist_items, motivational_phrase, order_index)
SELECT n.id, 'N6.1', 'Lista de leads + prioridade', 'Lista/etiquetas (quente/morno/frio)', 'Organize seus contatos por prioridade para não perder ninguém.', '["Listar leads em andamento", "Classificar em quente/morno/frio", "Definir próximo contato para cada um"]'::jsonb, 'Lista organizada vira resultado.', 1
FROM trilha_needs n WHERE n.code = 'N6' ON CONFLICT (need_id, code) DO UPDATE SET title = EXCLUDED.title, objective = EXCLUDED.objective, guidance = EXCLUDED.guidance, checklist_items = EXCLUDED.checklist_items, motivational_phrase = EXCLUDED.motivational_phrase, order_index = EXCLUDED.order_index, updated_at = NOW();

INSERT INTO trilha_steps (need_id, code, title, objective, guidance, checklist_items, motivational_phrase, order_index)
SELECT n.id, 'N6.2', 'Follow-up inteligente (1–3–7)', 'Sequência pronta', 'Sequência 1–3–7: retorno no 1º, 3º e 7º dia após o contato.', '["Escrever 3 mensagens de follow-up (dia 1, 3, 7)", "Agendar lembretes para 3 leads", "Aplicar esta semana"]'::jsonb, 'Follow-up persistente converte.', 2
FROM trilha_needs n WHERE n.code = 'N6' ON CONFLICT (need_id, code) DO UPDATE SET title = EXCLUDED.title, objective = EXCLUDED.objective, guidance = EXCLUDED.guidance, checklist_items = EXCLUDED.checklist_items, motivational_phrase = EXCLUDED.motivational_phrase, order_index = EXCLUDED.order_index, updated_at = NOW();

INSERT INTO trilha_steps (need_id, code, title, objective, guidance, checklist_items, motivational_phrase, order_index)
SELECT n.id, 'N6.3', 'Pipeline e lembretes', 'Organização de conversas + lembretes', 'Pipeline simples e lembretes evitam esquecer de voltar.', '["Definir etapas do seu pipeline", "Configurar 1 lembrete para follow-up", "Revisar pipeline 1x por semana"]'::jsonb, 'Sistema evita vazamento.', 3
FROM trilha_needs n WHERE n.code = 'N6' ON CONFLICT (need_id, code) DO UPDATE SET title = EXCLUDED.title, objective = EXCLUDED.objective, guidance = EXCLUDED.guidance, checklist_items = EXCLUDED.checklist_items, motivational_phrase = EXCLUDED.motivational_phrase, order_index = EXCLUDED.order_index, updated_at = NOW();

-- N7
INSERT INTO trilha_steps (need_id, code, title, objective, guidance, checklist_items, motivational_phrase, order_index)
SELECT n.id, 'N7.1', 'Ciclo do negócio no dia a dia', 'Gerar, Servir, Acompanhar e Lucrar mapeados na sua rotina', 'Quatro eixos do seu negócio: Gerar oportunidades, Servir com valor, Acompanhar evolução, Lucrar de forma organizada. Mapeie onde cada um está no seu dia a dia.', '["Mapear onde está cada eixo (Gerar, Servir, Acompanhar, Lucrar) hoje", "Definir 1 ação por eixo nesta semana", "Revisar no fim da semana"]'::jsonb, 'Ciclo organizado gera escala.', 1
FROM trilha_needs n WHERE n.code = 'N7' ON CONFLICT (need_id, code) DO UPDATE SET title = EXCLUDED.title, objective = EXCLUDED.objective, guidance = EXCLUDED.guidance, checklist_items = EXCLUDED.checklist_items, motivational_phrase = EXCLUDED.motivational_phrase, order_index = EXCLUDED.order_index, updated_at = NOW();

INSERT INTO trilha_steps (need_id, code, title, objective, guidance, checklist_items, motivational_phrase, order_index)
SELECT n.id, 'N7.2', 'Agenda em blocos', 'Agenda semanal (captação + atendimento + follow-up)', 'Agenda em blocos: horários fixos para captação, atendimento e follow-up.', '["Definir blocos da semana", "Reservar horários para cada tipo de atividade", "Salvar na agenda"]'::jsonb, 'Agenda em blocos gera previsibilidade.', 2
FROM trilha_needs n WHERE n.code = 'N7' ON CONFLICT (need_id, code) DO UPDATE SET title = EXCLUDED.title, objective = EXCLUDED.objective, guidance = EXCLUDED.guidance, checklist_items = EXCLUDED.checklist_items, motivational_phrase = EXCLUDED.motivational_phrase, order_index = EXCLUDED.order_index, updated_at = NOW();

INSERT INTO trilha_steps (need_id, code, title, objective, guidance, checklist_items, motivational_phrase, order_index)
SELECT n.id, 'N7.3', 'Checklist de crescimento', 'Checklist preenchido', 'Checklist de crescimento: o que manter, o que melhorar.', '["Preencher checklist de crescimento", "Escolher 2 itens para melhorar", "Definir 1 ação por item"]'::jsonb, 'Crescimento é escolha consciente.', 3
FROM trilha_needs n WHERE n.code = 'N7' ON CONFLICT (need_id, code) DO UPDATE SET title = EXCLUDED.title, objective = EXCLUDED.objective, guidance = EXCLUDED.guidance, checklist_items = EXCLUDED.checklist_items, motivational_phrase = EXCLUDED.motivational_phrase, order_index = EXCLUDED.order_index, updated_at = NOW();

INSERT INTO trilha_steps (need_id, code, title, objective, guidance, checklist_items, motivational_phrase, order_index)
SELECT n.id, 'N7.4', 'Plano próximos 30 dias', 'Plano semanal recorrente', 'Plano dos próximos 30 dias com foco semanal.', '["Definir 3 metas para 30 dias", "Quebrar em 4 semanas", "Definir 1 prioridade por semana"]'::jsonb, 'Plano claro vira execução.', 4
FROM trilha_needs n WHERE n.code = 'N7' ON CONFLICT (need_id, code) DO UPDATE SET title = EXCLUDED.title, objective = EXCLUDED.objective, guidance = EXCLUDED.guidance, checklist_items = EXCLUDED.checklist_items, motivational_phrase = EXCLUDED.motivational_phrase, order_index = EXCLUDED.order_index, updated_at = NOW();

INSERT INTO trilha_steps (need_id, code, title, objective, guidance, checklist_items, motivational_phrase, order_index)
SELECT n.id, 'N7.5', 'Ritual de integração', 'Declaração final + próxima fase', 'Ritual de integração: declare o que conquistou e defina a próxima fase.', '["Escrever declaração do que conquistou", "Definir próxima fase (objetivo)", "Compartilhar com alguém ou salvar"]'::jsonb, 'Ritual reforça identidade e compromisso.', 5
FROM trilha_needs n WHERE n.code = 'N7' ON CONFLICT (need_id, code) DO UPDATE SET title = EXCLUDED.title, objective = EXCLUDED.objective, guidance = EXCLUDED.guidance, checklist_items = EXCLUDED.checklist_items, motivational_phrase = EXCLUDED.motivational_phrase, order_index = EXCLUDED.order_index, updated_at = NOW();
