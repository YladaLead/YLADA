-- =====================================================
-- YLADA - Jornada de 30 Dias - Dados Iniciais
-- =====================================================
-- Baseado na lousa fornecida: Dias 1 a 7 completos
-- Este script usa ON CONFLICT para evitar erros de duplicação

-- SEMANA 1 - BASE E FILOSOFIA YLADA
-- Dia 1
INSERT INTO journey_days (id, day_number, week_number, title, objective, guidance, action_type, action_id, action_title, checklist_items, motivational_phrase, order_index)
VALUES (
  gen_random_uuid(),
  1,
  1,
  'Introdução à Filosofia YLADA',
  'Entender os fundamentos do Método YLADA e como ele transforma a prática nutricional em negócio.',
  'Hoje você vai conhecer a base de tudo. A Filosofia YLADA não é apenas um método, é uma forma de pensar e agir como Nutri-Empresária. Reserve 30 minutos para absorver este conteúdo fundamental.',
  'pilar',
  NULL, -- Será preenchido com o ID do Pilar 1 quando existir
  'Acessar Pilar 1: Filosofia YLADA',
  '["Ler a introdução completa do Método YLADA", "Assistir/ler o conteúdo do Pilar 1", "Anotar os 3 principais aprendizados", "Refletir sobre como aplicar na sua prática"]'::jsonb,
  'Todo grande negócio começa com uma base sólida. Você está construindo a sua agora.',
  1
)
ON CONFLICT (day_number) DO UPDATE SET
  week_number = EXCLUDED.week_number,
  title = EXCLUDED.title,
  objective = EXCLUDED.objective,
  guidance = EXCLUDED.guidance,
  action_type = EXCLUDED.action_type,
  action_id = EXCLUDED.action_id,
  action_title = EXCLUDED.action_title,
  checklist_items = EXCLUDED.checklist_items,
  motivational_phrase = EXCLUDED.motivational_phrase,
  order_index = EXCLUDED.order_index,
  updated_at = NOW();

-- Dia 2
INSERT INTO journey_days (id, day_number, week_number, title, objective, guidance, action_type, action_id, action_title, checklist_items, motivational_phrase, order_index)
VALUES (
  gen_random_uuid(),
  2,
  1,
  'Identidade & Postura de Nutri-Empresária',
  'Definir sua identidade profissional e postura como Nutri-Empresária, não apenas como profissional técnica.',
  'A transformação começa na identidade. Hoje você vai trabalhar em como se vê e como quer ser vista. Isso impacta diretamente na forma como você atende, precifica e se posiciona.',
  'pilar',
  NULL,
  'Acessar Pilar 1 - Seção: Identidade & Postura',
  '["Definir sua identidade como Nutri-Empresária", "Escrever 3 características que você quer desenvolver", "Criar uma frase de posicionamento pessoal", "Aplicar essa postura em uma interação hoje"]'::jsonb,
  'Sua identidade define seus resultados. Você está escolhendo ser uma Nutri-Empresária.',
  2
)
ON CONFLICT (day_number) DO UPDATE SET
  week_number = EXCLUDED.week_number,
  title = EXCLUDED.title,
  objective = EXCLUDED.objective,
  guidance = EXCLUDED.guidance,
  action_type = EXCLUDED.action_type,
  action_id = EXCLUDED.action_id,
  action_title = EXCLUDED.action_title,
  checklist_items = EXCLUDED.checklist_items,
  motivational_phrase = EXCLUDED.motivational_phrase,
  order_index = EXCLUDED.order_index,
  updated_at = NOW();

-- Dia 3
INSERT INTO journey_days (id, day_number, week_number, title, objective, guidance, action_type, action_id, action_title, checklist_items, motivational_phrase, order_index)
VALUES (
  gen_random_uuid(),
  3,
  1,
  'Criar sua Rotina Mínima YLADA',
  'Estabelecer uma rotina mínima e organizada que suporte seu negócio sem sobrecarregar.',
  'Rotina não é sobre trabalhar mais, é sobre trabalhar melhor. Hoje você vai criar sua rotina mínima YLADA - a estrutura básica que vai sustentar seu crescimento.',
  'pilar',
  NULL,
  'Acessar Pilar 2: Rotina Mínima YLADA',
  '["Baixar o checklist da Rotina Mínima", "Definir seus horários de trabalho", "Organizar suas tarefas diárias", "Aplicar a rotina hoje mesmo"]'::jsonb,
  'Rotina é liberdade. Quando você organiza, você ganha tempo e clareza.',
  3
)
ON CONFLICT (day_number) DO UPDATE SET
  week_number = EXCLUDED.week_number,
  title = EXCLUDED.title,
  objective = EXCLUDED.objective,
  guidance = EXCLUDED.guidance,
  action_type = EXCLUDED.action_type,
  action_id = EXCLUDED.action_id,
  action_title = EXCLUDED.action_title,
  checklist_items = EXCLUDED.checklist_items,
  motivational_phrase = EXCLUDED.motivational_phrase,
  order_index = EXCLUDED.order_index,
  updated_at = NOW();

-- Dia 4
INSERT INTO journey_days (id, day_number, week_number, title, objective, guidance, action_type, action_id, action_title, checklist_items, motivational_phrase, order_index)
VALUES (
  gen_random_uuid(),
  4,
  1,
  'Definir Metas e Objetivos Claros',
  'Estabelecer metas claras, mensuráveis e alcançáveis para os próximos 30, 60 e 90 dias.',
  'Metas claras geram resultados claros. Hoje você vai definir exatamente onde quer chegar e como vai medir seu progresso.',
  'pilar',
  NULL,
  'Acessar Pilar 1 - Seção: Metas e Objetivos',
  '["Definir 3 metas para os próximos 30 dias", "Definir 2 metas para os próximos 60 dias", "Definir 1 meta para os próximos 90 dias", "Criar um sistema de acompanhamento"]'::jsonb,
  'Metas sem ação são sonhos. Você está transformando sonhos em realidade.',
  4
)
ON CONFLICT (day_number) DO UPDATE SET
  week_number = EXCLUDED.week_number,
  title = EXCLUDED.title,
  objective = EXCLUDED.objective,
  guidance = EXCLUDED.guidance,
  action_type = EXCLUDED.action_type,
  action_id = EXCLUDED.action_id,
  action_title = EXCLUDED.action_title,
  checklist_items = EXCLUDED.checklist_items,
  motivational_phrase = EXCLUDED.motivational_phrase,
  order_index = EXCLUDED.order_index,
  updated_at = NOW();

-- Dia 5
INSERT INTO journey_days (id, day_number, week_number, title, objective, guidance, action_type, action_id, action_title, checklist_items, motivational_phrase, order_index)
VALUES (
  gen_random_uuid(),
  5,
  1,
  'Organizar seu Ambiente de Trabalho',
  'Criar um ambiente físico e digital organizado que suporte sua produtividade e profissionalismo.',
  'Ambiente organizado, mente organizada. Hoje você vai estruturar seu espaço de trabalho para maximizar sua eficiência.',
  'pilar',
  NULL,
  'Acessar Pilar 2 - Seção: Organização do Ambiente',
  '["Organizar espaço físico de trabalho", "Organizar arquivos digitais", "Configurar ferramentas essenciais", "Criar sistema de arquivamento"]'::jsonb,
  'Seu ambiente reflete sua mentalidade. Você está criando um ambiente de sucesso.',
  5
)
ON CONFLICT (day_number) DO UPDATE SET
  week_number = EXCLUDED.week_number,
  title = EXCLUDED.title,
  objective = EXCLUDED.objective,
  guidance = EXCLUDED.guidance,
  action_type = EXCLUDED.action_type,
  action_id = EXCLUDED.action_id,
  action_title = EXCLUDED.action_title,
  checklist_items = EXCLUDED.checklist_items,
  motivational_phrase = EXCLUDED.motivational_phrase,
  order_index = EXCLUDED.order_index,
  updated_at = NOW();

-- Dia 6
INSERT INTO journey_days (id, day_number, week_number, title, objective, guidance, action_type, action_id, action_title, checklist_items, motivational_phrase, order_index)
VALUES (
  gen_random_uuid(),
  6,
  1,
  'Postura Profissional e Comunicação',
  'Desenvolver uma postura profissional consistente e comunicação clara com clientes.',
  'Como você se comunica define como você é percebida. Hoje você vai trabalhar em sua postura profissional e comunicação.',
  'pilar',
  NULL,
  'Acessar Pilar 1 - Seção: Postura Profissional',
  '["Revisar sua comunicação atual", "Definir tom de voz profissional", "Criar templates de comunicação", "Aplicar em uma interação real"]'::jsonb,
  'Comunicação clara gera confiança. Você está construindo sua autoridade.',
  6
)
ON CONFLICT (day_number) DO UPDATE SET
  week_number = EXCLUDED.week_number,
  title = EXCLUDED.title,
  objective = EXCLUDED.objective,
  guidance = EXCLUDED.guidance,
  action_type = EXCLUDED.action_type,
  action_id = EXCLUDED.action_id,
  action_title = EXCLUDED.action_title,
  checklist_items = EXCLUDED.checklist_items,
  motivational_phrase = EXCLUDED.motivational_phrase,
  order_index = EXCLUDED.order_index,
  updated_at = NOW();

-- Dia 7
INSERT INTO journey_days (id, day_number, week_number, title, objective, guidance, action_type, action_id, action_title, checklist_items, motivational_phrase, order_index)
VALUES (
  gen_random_uuid(),
  7,
  1,
  'Revisão Semanal e Ajustes',
  'Revisar o progresso da primeira semana, celebrar conquistas e ajustar o que for necessário.',
  'Refletir é evoluir. Hoje você vai revisar tudo que aprendeu e aplicou nesta primeira semana, celebrar suas conquistas e fazer os ajustes necessários.',
  'exercicio',
  NULL,
  'Acessar Exercício: Revisão Semanal',
  '["Revisar todos os dias da semana", "Listar 3 conquistas da semana", "Identificar 1 ponto de melhoria", "Ajustar rotina para a próxima semana", "Celebrar seu progresso"]'::jsonb,
  'Primeira semana concluída! Você está no caminho certo. Continue assim!',
  7
)
ON CONFLICT (day_number) DO UPDATE SET
  week_number = EXCLUDED.week_number,
  title = EXCLUDED.title,
  objective = EXCLUDED.objective,
  guidance = EXCLUDED.guidance,
  action_type = EXCLUDED.action_type,
  action_id = EXCLUDED.action_id,
  action_title = EXCLUDED.action_title,
  checklist_items = EXCLUDED.checklist_items,
  motivational_phrase = EXCLUDED.motivational_phrase,
  order_index = EXCLUDED.order_index,
  updated_at = NOW();

-- SEMANA 2 - ATRAÇÃO YLADA (Leads Diários)
-- SEMANA 2 - CAPTAÇÃO: FERRAMENTAS, CTAs, DISTRIBUIÇÃO E LEADS
-- Dia 8
INSERT INTO journey_days (id, day_number, week_number, title, objective, guidance, action_type, action_id, action_title, checklist_items, motivational_phrase, order_index)
VALUES (
  gen_random_uuid(),
  8,
  2,
  'Ativando Sua Primeira Ferramenta de Captação',
  'Criar sua primeira ferramenta de captação e iniciar o fluxo de atração de leads.',
  'A captação começa simples. Uma única ferramenta bem escolhida já pode gerar seus primeiros contatos.',
  'pilar',
  NULL, -- Pilar 3 - Seção "Ferramentas de Captação"
  'Acessar Pilar 3 – Ferramentas de Captação',
  '["Escolher sua primeira ferramenta", "Personalizar com sua identidade", "Publicar hoje em 1 canal"]'::jsonb,
  'Quem entrega valor todos os dias recebe oportunidades todos os dias.',
  8
)
ON CONFLICT (day_number) DO UPDATE SET
  week_number = EXCLUDED.week_number,
  title = EXCLUDED.title,
  objective = EXCLUDED.objective,
  guidance = EXCLUDED.guidance,
  action_type = EXCLUDED.action_type,
  action_id = EXCLUDED.action_id,
  action_title = EXCLUDED.action_title,
  checklist_items = EXCLUDED.checklist_items,
  motivational_phrase = EXCLUDED.motivational_phrase,
  order_index = EXCLUDED.order_index,
  updated_at = NOW();

-- Dia 9
INSERT INTO journey_days (id, day_number, week_number, title, objective, guidance, action_type, action_id, action_title, checklist_items, motivational_phrase, order_index)
VALUES (
  gen_random_uuid(),
  9,
  2,
  'Criando Sua CTA Oficial da Semana',
  'Criar a CTA que irá acompanhar sua ferramenta.',
  'Uma boa CTA é clara, objetiva e convida a pessoa a agir.',
  'pilar',
  NULL, -- Pilar 3 - Seção "Criação de CTAs"
  'Acessar Pilar 3 – Criação de CTAs',
  '["Criar 1 CTA oficial", "Criar 1 variação da CTA", "Publicar junto com sua ferramenta"]'::jsonb,
  'Uma boa CTA não convence — ela convida.',
  9
)
ON CONFLICT (day_number) DO UPDATE SET
  week_number = EXCLUDED.week_number,
  title = EXCLUDED.title,
  objective = EXCLUDED.objective,
  guidance = EXCLUDED.guidance,
  action_type = EXCLUDED.action_type,
  action_id = EXCLUDED.action_id,
  action_title = EXCLUDED.action_title,
  checklist_items = EXCLUDED.checklist_items,
  motivational_phrase = EXCLUDED.motivational_phrase,
  order_index = EXCLUDED.order_index,
  updated_at = NOW();

-- Dia 10
INSERT INTO journey_days (id, day_number, week_number, title, objective, guidance, action_type, action_id, action_title, checklist_items, motivational_phrase, order_index)
VALUES (
  gen_random_uuid(),
  10,
  2,
  'Distribuição 10–10–10 (Método de Alcance Diário)',
  'Aumentar seu alcance diário usando a metodologia 10–10–10.',
  'Distribuição é o que transforma ferramentas estagnadas em movimento.',
  'exercicio',
  NULL, -- Exercício YLADA – Distribuição 10–10–10
  'Acessar Exercício YLADA – Distribuição 10–10–10',
  '["Enviar sua ferramenta a 10 contatos estratégicos", "Compartilhar em 10 grupos permitidos", "Interagir em 10 perfis novos"]'::jsonb,
  'Você não cresce no silêncio — cresce aparecendo.',
  10
)
ON CONFLICT (day_number) DO UPDATE SET
  week_number = EXCLUDED.week_number,
  title = EXCLUDED.title,
  objective = EXCLUDED.objective,
  guidance = EXCLUDED.guidance,
  action_type = EXCLUDED.action_type,
  action_id = EXCLUDED.action_id,
  action_title = EXCLUDED.action_title,
  checklist_items = EXCLUDED.checklist_items,
  motivational_phrase = EXCLUDED.motivational_phrase,
  order_index = EXCLUDED.order_index,
  updated_at = NOW();

-- Dia 11
INSERT INTO journey_days (id, day_number, week_number, title, objective, guidance, action_type, action_id, action_title, checklist_items, motivational_phrase, order_index)
VALUES (
  gen_random_uuid(),
  11,
  2,
  'Story de Captação YLADA',
  'Criar um story simples e leve que gera cliques.',
  'Os stories que convertem são naturais, simples e diretos.',
  'pilar',
  NULL, -- Pilar 3 - Seção "Story de Captação"
  'Acessar Pilar 3 – Story de Captação',
  '["Criar um story seguindo o roteiro YLADA", "Publicar 1 story hoje", "Adicionar sua CTA oficial"]'::jsonb,
  'Quando você mostra como ajuda, as pessoas clicam.',
  11
)
ON CONFLICT (day_number) DO UPDATE SET
  week_number = EXCLUDED.week_number,
  title = EXCLUDED.title,
  objective = EXCLUDED.objective,
  guidance = EXCLUDED.guidance,
  action_type = EXCLUDED.action_type,
  action_id = EXCLUDED.action_id,
  action_title = EXCLUDED.action_title,
  checklist_items = EXCLUDED.checklist_items,
  motivational_phrase = EXCLUDED.motivational_phrase,
  order_index = EXCLUDED.order_index,
  updated_at = NOW();

-- Dia 12
INSERT INTO journey_days (id, day_number, week_number, title, objective, guidance, action_type, action_id, action_title, checklist_items, motivational_phrase, order_index)
VALUES (
  gen_random_uuid(),
  12,
  2,
  'Respondendo Objeções com Segurança',
  'Aprender a transformar objeções em conexão.',
  'Objeções não são barreiras — são portas pedindo para serem abertas.',
  'exercicio',
  NULL, -- Exercício YLADA – Objeções Inteligentes
  'Acessar Exercício YLADA – Objeções Inteligentes',
  '["Ler objeções mais comuns", "Escolher 3 respostas-curinga", "Aplicar hoje em conversas reais"]'::jsonb,
  'Quem sabe responder, vende sem pressionar.',
  12
)
ON CONFLICT (day_number) DO UPDATE SET
  week_number = EXCLUDED.week_number,
  title = EXCLUDED.title,
  objective = EXCLUDED.objective,
  guidance = EXCLUDED.guidance,
  action_type = EXCLUDED.action_type,
  action_id = EXCLUDED.action_id,
  action_title = EXCLUDED.action_title,
  checklist_items = EXCLUDED.checklist_items,
  motivational_phrase = EXCLUDED.motivational_phrase,
  order_index = EXCLUDED.order_index,
  updated_at = NOW();

-- Dia 13
INSERT INTO journey_days (id, day_number, week_number, title, objective, guidance, action_type, action_id, action_title, checklist_items, motivational_phrase, order_index)
VALUES (
  gen_random_uuid(),
  13,
  2,
  'Criando Sua Lista de Leads Quentes',
  'Organizar seus leads para priorizar os mais preparados.',
  'Leads quentes respondem mais rápido e fecham mais rápido — basta identificá-los.',
  'pilar',
  NULL, -- Pilar 3 - Seção "Gestão de Leads YLADA"
  'Acessar Pilar 3 – Gestão de Leads YLADA',
  '["Criar lista com nome + contato + interesse", "Marcar leads quentes das últimas 48h", "Definir quem será atendido primeiro"]'::jsonb,
  'Organização transforma intenção em resultado.',
  13
)
ON CONFLICT (day_number) DO UPDATE SET
  week_number = EXCLUDED.week_number,
  title = EXCLUDED.title,
  objective = EXCLUDED.objective,
  guidance = EXCLUDED.guidance,
  action_type = EXCLUDED.action_type,
  action_id = EXCLUDED.action_id,
  action_title = EXCLUDED.action_title,
  checklist_items = EXCLUDED.checklist_items,
  motivational_phrase = EXCLUDED.motivational_phrase,
  order_index = EXCLUDED.order_index,
  updated_at = NOW();

-- Dia 14
INSERT INTO journey_days (id, day_number, week_number, title, objective, guidance, action_type, action_id, action_title, checklist_items, motivational_phrase, order_index)
VALUES (
  gen_random_uuid(),
  14,
  2,
  'Revisão da Semana de Captação',
  'Consolidar aprendizados e reforçar o que funcionou.',
  'Agora você já está captando. Revisar te mostra como crescer ainda mais.',
  'exercicio',
  NULL, -- Exercício YLADA – Revisão da Captação
  'Acessar Exercício YLADA – Revisão da Captação',
  '["Revisar dados da semana (cliques, respostas, conversas)", "Identificar o que funcionou melhor", "Anotar o que melhorar na próxima semana", "Marcar Semana 2 como concluída"]'::jsonb,
  'Leads chegam para quem age — e você agiu todos os dias.',
  14
)
ON CONFLICT (day_number) DO UPDATE SET
  week_number = EXCLUDED.week_number,
  title = EXCLUDED.title,
  objective = EXCLUDED.objective,
  guidance = EXCLUDED.guidance,
  action_type = EXCLUDED.action_type,
  action_id = EXCLUDED.action_id,
  action_title = EXCLUDED.action_title,
  checklist_items = EXCLUDED.checklist_items,
  motivational_phrase = EXCLUDED.motivational_phrase,
  order_index = EXCLUDED.order_index,
  updated_at = NOW();

-- SEMANA 3 - DOMÍNIO DA ROTINA YLADA (ESTRUTURA & CONSISTÊNCIA)
-- Dia 15
INSERT INTO journey_days (id, day_number, week_number, title, objective, guidance, action_type, action_id, action_title, checklist_items, motivational_phrase, order_index)
VALUES (
  gen_random_uuid(),
  15,
  3,
  'Montando Sua Rotina Mínima YLADA (Parte 1)',
  'Construir a primeira parte da sua Rotina Mínima YLADA.',
  'A rotina mínima é o que mantém seu crescimento nos dias bons e nos dias difíceis. Hoje você começa a estruturar o essencial.',
  'pilar',
  NULL, -- Pilar 2 – Rotina Mínima YLADA (Parte 1)
  'Acessar Pilar 2 – Rotina Mínima YLADA (Parte 1)',
  '["Definir horários fixos para 3 blocos essenciais do dia", "Escolher 1 ação obrigatória para manter todos os dias", "Registrar sua rotina mínima no app"]'::jsonb,
  'Constância cria autoridade. Autoridade cria resultados.',
  15
)
ON CONFLICT (day_number) DO UPDATE SET
  week_number = EXCLUDED.week_number,
  title = EXCLUDED.title,
  objective = EXCLUDED.objective,
  guidance = EXCLUDED.guidance,
  action_type = EXCLUDED.action_type,
  action_id = EXCLUDED.action_id,
  action_title = EXCLUDED.action_title,
  checklist_items = EXCLUDED.checklist_items,
  motivational_phrase = EXCLUDED.motivational_phrase,
  order_index = EXCLUDED.order_index,
  updated_at = NOW();

-- Dia 16
INSERT INTO journey_days (id, day_number, week_number, title, objective, guidance, action_type, action_id, action_title, checklist_items, motivational_phrase, order_index)
VALUES (
  gen_random_uuid(),
  16,
  3,
  'Montando Sua Rotina Mínima YLADA (Parte 2)',
  'Finalizar a construção da Rotina Mínima YLADA.',
  'Hoje você ajusta, simplifica e deixa sua rotina pronta para funcionar mesmo nos dias mais cheios.',
  'pilar',
  NULL, -- Pilar 2 – Rotina Mínima YLADA (Parte 2)
  'Acessar Pilar 2 – Rotina Mínima YLADA (Parte 2)',
  '["Revisar sua rotina mínima criada ontem", "Reduzir excessos e deixar somente o essencial", "Salvar e confirmar como rotina oficial da semana"]'::jsonb,
  'Rotina boa não é a que impressiona. É a que funciona todos os dias.',
  16
)
ON CONFLICT (day_number) DO UPDATE SET
  week_number = EXCLUDED.week_number,
  title = EXCLUDED.title,
  objective = EXCLUDED.objective,
  guidance = EXCLUDED.guidance,
  action_type = EXCLUDED.action_type,
  action_id = EXCLUDED.action_id,
  action_title = EXCLUDED.action_title,
  checklist_items = EXCLUDED.checklist_items,
  motivational_phrase = EXCLUDED.motivational_phrase,
  order_index = EXCLUDED.order_index,
  updated_at = NOW();

-- Dia 17
INSERT INTO journey_days (id, day_number, week_number, title, objective, guidance, action_type, action_id, action_title, checklist_items, motivational_phrase, order_index)
VALUES (
  gen_random_uuid(),
  17,
  3,
  'Organização de Conversas & Leads no Método YLADA',
  'Organizar conversas e leads para não perder oportunidades.',
  'Leads não se perdem por falta de capacidade — e sim por falta de organização.',
  'ferramenta',
  NULL, -- Ferramenta de Organização YLADA – Leads & Conversas
  'Acessar Ferramenta de Organização YLADA – Leads & Conversas',
  '["Classificar conversas iniciadas nos últimos 3 dias", "Marcar leads quentes com prioridade", "Criar lembretes automáticos de acompanhamento"]'::jsonb,
  'Nutri que se organiza, cresce. Nutri que acompanha, fecha.',
  17
)
ON CONFLICT (day_number) DO UPDATE SET
  week_number = EXCLUDED.week_number,
  title = EXCLUDED.title,
  objective = EXCLUDED.objective,
  guidance = EXCLUDED.guidance,
  action_type = EXCLUDED.action_type,
  action_id = EXCLUDED.action_id,
  action_title = EXCLUDED.action_title,
  checklist_items = EXCLUDED.checklist_items,
  motivational_phrase = EXCLUDED.motivational_phrase,
  order_index = EXCLUDED.order_index,
  updated_at = NOW();

-- Dia 18
INSERT INTO journey_days (id, day_number, week_number, title, objective, guidance, action_type, action_id, action_title, checklist_items, motivational_phrase, order_index)
VALUES (
  gen_random_uuid(),
  18,
  3,
  'A Rotina de Nutri-Empresária nos Atendimentos',
  'Criar consistência e profissionalismo nos atendimentos.',
  'O atendimento é o momento mais importante da sua carreira. Ele precisa ser previsível, leve e estratégico.',
  'pilar',
  NULL, -- Pilar 4 – Padrão de Atendimentos YLADA
  'Acessar Pilar 4 – Padrão de Atendimentos YLADA',
  '["Definir seu roteiro de atendimento", "Criar 1 pergunta poderosa para cada etapa", "Criar seu modelo de pós-atendimento"]'::jsonb,
  'Atendimento profissional não é formal. É intencional.',
  18
)
ON CONFLICT (day_number) DO UPDATE SET
  week_number = EXCLUDED.week_number,
  title = EXCLUDED.title,
  objective = EXCLUDED.objective,
  guidance = EXCLUDED.guidance,
  action_type = EXCLUDED.action_type,
  action_id = EXCLUDED.action_id,
  action_title = EXCLUDED.action_title,
  checklist_items = EXCLUDED.checklist_items,
  motivational_phrase = EXCLUDED.motivational_phrase,
  order_index = EXCLUDED.order_index,
  updated_at = NOW();

-- Dia 19
INSERT INTO journey_days (id, day_number, week_number, title, objective, guidance, action_type, action_id, action_title, checklist_items, motivational_phrase, order_index)
VALUES (
  gen_random_uuid(),
  19,
  3,
  'Criando Seu Painel Diário de Ações',
  'Construir um painel simples para acompanhar sua execução diária.',
  'Visualização traz clareza. Clareza traz direção. Direção traz resultado.',
  'ferramenta',
  NULL, -- Painel Diário – Configuração Inicial
  'Acessar Painel Diário – Configuração Inicial',
  '["Escolher os 3 indicadores essenciais", "Definir horários de atualização", "Configurar alertas automáticos"]'::jsonb,
  'O que você mede, você melhora.',
  19
)
ON CONFLICT (day_number) DO UPDATE SET
  week_number = EXCLUDED.week_number,
  title = EXCLUDED.title,
  objective = EXCLUDED.objective,
  guidance = EXCLUDED.guidance,
  action_type = EXCLUDED.action_type,
  action_id = EXCLUDED.action_id,
  action_title = EXCLUDED.action_title,
  checklist_items = EXCLUDED.checklist_items,
  motivational_phrase = EXCLUDED.motivational_phrase,
  order_index = EXCLUDED.order_index,
  updated_at = NOW();

-- Dia 20
INSERT INTO journey_days (id, day_number, week_number, title, objective, guidance, action_type, action_id, action_title, checklist_items, motivational_phrase, order_index)
VALUES (
  gen_random_uuid(),
  20,
  3,
  'Revisão Estratégica da Semana',
  'Avaliar sua rotina e identificar ajustes necessários.',
  'Crescimento não acontece fazendo mais — acontece fazendo melhor.',
  'exercicio',
  NULL, -- Exercício de Revisão Semanal YLADA
  'Acessar Exercício de Revisão Semanal YLADA',
  '["Marcar tarefas que funcionaram", "Marcar o que não funcionou", "Ajustar sua rotina mínima"]'::jsonb,
  'Ajustar não é voltar atrás. É avançar com inteligência.',
  20
)
ON CONFLICT (day_number) DO UPDATE SET
  week_number = EXCLUDED.week_number,
  title = EXCLUDED.title,
  objective = EXCLUDED.objective,
  guidance = EXCLUDED.guidance,
  action_type = EXCLUDED.action_type,
  action_id = EXCLUDED.action_id,
  action_title = EXCLUDED.action_title,
  checklist_items = EXCLUDED.checklist_items,
  motivational_phrase = EXCLUDED.motivational_phrase,
  order_index = EXCLUDED.order_index,
  updated_at = NOW();

-- Dia 21
INSERT INTO journey_days (id, day_number, week_number, title, objective, guidance, action_type, action_id, action_title, checklist_items, motivational_phrase, order_index)
VALUES (
  gen_random_uuid(),
  21,
  3,
  'Ritual de Fechamento da Semana 3',
  'Consolidar aprendizados e preparar terreno para a Semana 4.',
  'Fechar ciclos é essencial para reforçar identidade e progresso.',
  'exercicio',
  NULL, -- Ritual de Fechamento – Semana 3
  'Acessar Ritual de Fechamento – Semana 3',
  '["Revisar aprendizados", "Identificar seu maior avanço", "Registrar o que ainda está difícil", "Marcar Semana 3 como concluída"]'::jsonb,
  'A consistência que você construiu esta semana será a base da sua virada.',
  21
)
ON CONFLICT (day_number) DO UPDATE SET
  week_number = EXCLUDED.week_number,
  title = EXCLUDED.title,
  objective = EXCLUDED.objective,
  guidance = EXCLUDED.guidance,
  action_type = EXCLUDED.action_type,
  action_id = EXCLUDED.action_id,
  action_title = EXCLUDED.action_title,
  checklist_items = EXCLUDED.checklist_items,
  motivational_phrase = EXCLUDED.motivational_phrase,
  order_index = EXCLUDED.order_index,
  updated_at = NOW();

-- SEMANA 4 - CRESCIMENTO & GSAL (DOMÍNIO DA PROFISSÃO)
-- Dia 22
INSERT INTO journey_days (id, day_number, week_number, title, objective, guidance, action_type, action_id, action_title, checklist_items, motivational_phrase, order_index)
VALUES (
  gen_random_uuid(),
  22,
  4,
  'Introdução ao GSAL (Gerar, Servir, Acompanhar, Lucrar)',
  'Introduzir o modelo GSAL que será a base do crescimento contínuo da Nutri.',
  'GSAL é a estrutura que transforma seu trabalho em algo previsível. Quando você domina GSAL, sua agenda começa a encher naturalmente.',
  'pilar',
  NULL, -- Pilar 5 – Introdução ao GSAL
  'Acessar Pilar 5 – Introdução ao GSAL',
  '["Ler as 4 etapas do GSAL", "Identificar em qual etapa você é mais forte hoje", "Identificar onde existe mais dificuldade", "Registrar suas percepções no app"]'::jsonb,
  'Crescimento não é sorte — é estrutura.',
  22
)
ON CONFLICT (day_number) DO UPDATE SET
  week_number = EXCLUDED.week_number,
  title = EXCLUDED.title,
  objective = EXCLUDED.objective,
  guidance = EXCLUDED.guidance,
  action_type = EXCLUDED.action_type,
  action_id = EXCLUDED.action_id,
  action_title = EXCLUDED.action_title,
  checklist_items = EXCLUDED.checklist_items,
  motivational_phrase = EXCLUDED.motivational_phrase,
  order_index = EXCLUDED.order_index,
  updated_at = NOW();

-- Dia 23
INSERT INTO journey_days (id, day_number, week_number, title, objective, guidance, action_type, action_id, action_title, checklist_items, motivational_phrase, order_index)
VALUES (
  gen_random_uuid(),
  23,
  4,
  'G de Gerar: Criando Fluxo Contínuo de Oportunidades',
  'Aplicar a primeira etapa do GSAL: GERAR.',
  'Gerar é colocar seu trabalho em movimento diário, criando novas oportunidades de contato.',
  'exercicio',
  NULL, -- Exercício – G de Gerar
  'Acessar Exercício – G de Gerar',
  '["Escolher 1 ferramenta para gerar movimento hoje", "Executar 1 ação de distribuição", "Iniciar 5 novas conversas", "Registrar resultados no app"]'::jsonb,
  'Quem gera movimento, cria oportunidades.',
  23
)
ON CONFLICT (day_number) DO UPDATE SET
  week_number = EXCLUDED.week_number,
  title = EXCLUDED.title,
  objective = EXCLUDED.objective,
  guidance = EXCLUDED.guidance,
  action_type = EXCLUDED.action_type,
  action_id = EXCLUDED.action_id,
  action_title = EXCLUDED.action_title,
  checklist_items = EXCLUDED.checklist_items,
  motivational_phrase = EXCLUDED.motivational_phrase,
  order_index = EXCLUDED.order_index,
  updated_at = NOW();

-- Dia 24
INSERT INTO journey_days (id, day_number, week_number, title, objective, guidance, action_type, action_id, action_title, checklist_items, motivational_phrase, order_index)
VALUES (
  gen_random_uuid(),
  24,
  4,
  'S de Servir: Entregando Valor que Conecta',
  'Dominar a etapa SERVIR para criar conexão e confiança.',
  'Servir não é trabalhar de graça — é entregar clareza e ajuda real, aquilo que aproxima as pessoas do seu método.',
  'exercicio',
  NULL, -- Exercício – S de Servir
  'Acessar Exercício – S de Servir',
  '["Escolher 1 microconteúdo de valor", "Enviar para 3 pessoas específicas", "Responder dúvidas com intenção", "Registrar impacto no app"]'::jsonb,
  'Quando você serve, você se torna inesquecível.',
  24
)
ON CONFLICT (day_number) DO UPDATE SET
  week_number = EXCLUDED.week_number,
  title = EXCLUDED.title,
  objective = EXCLUDED.objective,
  guidance = EXCLUDED.guidance,
  action_type = EXCLUDED.action_type,
  action_id = EXCLUDED.action_id,
  action_title = EXCLUDED.action_title,
  checklist_items = EXCLUDED.checklist_items,
  motivational_phrase = EXCLUDED.motivational_phrase,
  order_index = EXCLUDED.order_index,
  updated_at = NOW();

-- Dia 25
INSERT INTO journey_days (id, day_number, week_number, title, objective, guidance, action_type, action_id, action_title, checklist_items, motivational_phrase, order_index)
VALUES (
  gen_random_uuid(),
  25,
  4,
  'A de Acompanhar: Transformando Interesses em Fechamentos',
  'Dominar o acompanhamento que realmente converte.',
  'A maioria das vendas acontece no acompanhamento — não na primeira conversa.',
  'exercicio',
  NULL, -- Exercício – A de Acompanhar
  'Acessar Exercício – A de Acompanhar',
  '["Revisar leads quentes dos últimos 7 dias", "Enviar mensagem de acompanhamento para 5 pessoas", "Registrar quem respondeu", "Marcar quem avançou"]'::jsonb,
  'Acompanhamento é profissionalismo, não insistência.',
  25
)
ON CONFLICT (day_number) DO UPDATE SET
  week_number = EXCLUDED.week_number,
  title = EXCLUDED.title,
  objective = EXCLUDED.objective,
  guidance = EXCLUDED.guidance,
  action_type = EXCLUDED.action_type,
  action_id = EXCLUDED.action_id,
  action_title = EXCLUDED.action_title,
  checklist_items = EXCLUDED.checklist_items,
  motivational_phrase = EXCLUDED.motivational_phrase,
  order_index = EXCLUDED.order_index,
  updated_at = NOW();

-- Dia 26
INSERT INTO journey_days (id, day_number, week_number, title, objective, guidance, action_type, action_id, action_title, checklist_items, motivational_phrase, order_index)
VALUES (
  gen_random_uuid(),
  26,
  4,
  'L de Lucrar: Estruturando Sua Agenda para Crescer',
  'Criar uma estrutura de agenda que apoia seu crescimento.',
  'Lucrar é estruturar o fluxo de trabalho para que tudo leve naturalmente a fechamentos.',
  'exercicio',
  NULL, -- Exercício – L de Lucrar / Agenda Estratégica
  'Acessar Exercício – L de Lucrar / Agenda Estratégica',
  '["Definir horários fixos de atendimento", "Reservar horários de captação", "Ajustar agenda mínima semanal", "Registrar agenda oficial no app"]'::jsonb,
  'Lucrar é consequência de estruturar.',
  26
)
ON CONFLICT (day_number) DO UPDATE SET
  week_number = EXCLUDED.week_number,
  title = EXCLUDED.title,
  objective = EXCLUDED.objective,
  guidance = EXCLUDED.guidance,
  action_type = EXCLUDED.action_type,
  action_id = EXCLUDED.action_id,
  action_title = EXCLUDED.action_title,
  checklist_items = EXCLUDED.checklist_items,
  motivational_phrase = EXCLUDED.motivational_phrase,
  order_index = EXCLUDED.order_index,
  updated_at = NOW();

-- Dia 27
INSERT INTO journey_days (id, day_number, week_number, title, objective, guidance, action_type, action_id, action_title, checklist_items, motivational_phrase, order_index)
VALUES (
  gen_random_uuid(),
  27,
  4,
  'Checklist Geral de Crescimento YLADA',
  'Consolidar sua estrutura de crescimento.',
  'Hoje você verifica se sua base está pronta para crescer continuamente.',
  'exercicio',
  NULL, -- Checklist de Crescimento YLADA
  'Acessar Checklist de Crescimento YLADA',
  '["GSAL estruturado", "Agenda definida", "Ferramentas de captação prontas", "Rotina mínima funcionando", "Padrão de atendimento definido"]'::jsonb,
  'Crescimento é preparado — nunca improvisado.',
  27
)
ON CONFLICT (day_number) DO UPDATE SET
  week_number = EXCLUDED.week_number,
  title = EXCLUDED.title,
  objective = EXCLUDED.objective,
  guidance = EXCLUDED.guidance,
  action_type = EXCLUDED.action_type,
  action_id = EXCLUDED.action_id,
  action_title = EXCLUDED.action_title,
  checklist_items = EXCLUDED.checklist_items,
  motivational_phrase = EXCLUDED.motivational_phrase,
  order_index = EXCLUDED.order_index,
  updated_at = NOW();

-- Dia 28
INSERT INTO journey_days (id, day_number, week_number, title, objective, guidance, action_type, action_id, action_title, checklist_items, motivational_phrase, order_index)
VALUES (
  gen_random_uuid(),
  28,
  4,
  'O Plano de 30 Dias à Frente',
  'Criar seu plano pessoal para os próximos 30 dias.',
  'Agora você planeja seu próximo ciclo com clareza e direção.',
  'exercicio',
  NULL, -- Exercício – Plano YLADA 30 Dias
  'Acessar Exercício – Plano YLADA 30 Dias',
  '["Definir metas claras", "Escolher 3 ações diárias", "Planejar calendário", "Registrar plano no app"]'::jsonb,
  'Planejamento cria liberdade.',
  28
)
ON CONFLICT (day_number) DO UPDATE SET
  week_number = EXCLUDED.week_number,
  title = EXCLUDED.title,
  objective = EXCLUDED.objective,
  guidance = EXCLUDED.guidance,
  action_type = EXCLUDED.action_type,
  action_id = EXCLUDED.action_id,
  action_title = EXCLUDED.action_title,
  checklist_items = EXCLUDED.checklist_items,
  motivational_phrase = EXCLUDED.motivational_phrase,
  order_index = EXCLUDED.order_index,
  updated_at = NOW();

-- Dia 29
INSERT INTO journey_days (id, day_number, week_number, title, objective, guidance, action_type, action_id, action_title, checklist_items, motivational_phrase, order_index)
VALUES (
  gen_random_uuid(),
  29,
  4,
  'Preparação para o Ritual de Conclusão',
  'Preparar mente e identidade para a conclusão da jornada.',
  'Este é o momento de reconhecer sua evolução e preparar seu encerramento.',
  'exercicio',
  NULL, -- Pré-Ritual de Conclusão
  'Acessar Pré-Ritual de Conclusão',
  '["Revisar seus maiores avanços", "Registrar 3 mudanças internas", "Definir 1 hábito para levar adiante"]'::jsonb,
  'O que muda por dentro, muda tudo por fora.',
  29
)
ON CONFLICT (day_number) DO UPDATE SET
  week_number = EXCLUDED.week_number,
  title = EXCLUDED.title,
  objective = EXCLUDED.objective,
  guidance = EXCLUDED.guidance,
  action_type = EXCLUDED.action_type,
  action_id = EXCLUDED.action_id,
  action_title = EXCLUDED.action_title,
  checklist_items = EXCLUDED.checklist_items,
  motivational_phrase = EXCLUDED.motivational_phrase,
  order_index = EXCLUDED.order_index,
  updated_at = NOW();

-- Dia 30
INSERT INTO journey_days (id, day_number, week_number, title, objective, guidance, action_type, action_id, action_title, checklist_items, motivational_phrase, order_index)
VALUES (
  gen_random_uuid(),
  30,
  4,
  'Ritual de Conclusão do Método YLADA',
  'Encerrar a jornada e integrar totalmente a identidade YLADA.',
  'Hoje você celebra sua transformação e assume sua nova identidade profissional.',
  'exercicio',
  NULL, -- Ritual Final – Conclusão do Método YLADA
  'Acessar Ritual Final – Conclusão do Método YLADA',
  '["Revisar toda a jornada", "Registrar sua transformação", "Definir seu novo posicionamento", "Confirmar conclusão da jornada"]'::jsonb,
  'Hoje, você não conclui um método. Você se torna YLADA.',
  30
)
ON CONFLICT (day_number) DO UPDATE SET
  week_number = EXCLUDED.week_number,
  title = EXCLUDED.title,
  objective = EXCLUDED.objective,
  guidance = EXCLUDED.guidance,
  action_type = EXCLUDED.action_type,
  action_id = EXCLUDED.action_id,
  action_title = EXCLUDED.action_title,
  checklist_items = EXCLUDED.checklist_items,
  motivational_phrase = EXCLUDED.motivational_phrase,
  order_index = EXCLUDED.order_index,
  updated_at = NOW();
