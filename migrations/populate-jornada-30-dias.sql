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
-- Placeholders para os próximos dias (serão preenchidos conforme necessário)
INSERT INTO journey_days (id, day_number, week_number, title, objective, guidance, action_type, action_id, action_title, checklist_items, motivational_phrase, order_index)
VALUES 
  (gen_random_uuid(), 8, 2, 'Dia 8 - Em breve', 'Objetivo do dia 8', 'Orientação do dia 8', 'pilar', NULL, 'Ação do dia 8', '[]'::jsonb, 'Continue sua jornada!', 8),
  (gen_random_uuid(), 9, 2, 'Dia 9 - Em breve', 'Objetivo do dia 9', 'Orientação do dia 9', 'pilar', NULL, 'Ação do dia 9', '[]'::jsonb, 'Continue sua jornada!', 9),
  (gen_random_uuid(), 10, 2, 'Dia 10 - Em breve', 'Objetivo do dia 10', 'Orientação do dia 10', 'pilar', NULL, 'Ação do dia 10', '[]'::jsonb, 'Continue sua jornada!', 10),
  (gen_random_uuid(), 11, 2, 'Dia 11 - Em breve', 'Objetivo do dia 11', 'Orientação do dia 11', 'pilar', NULL, 'Ação do dia 11', '[]'::jsonb, 'Continue sua jornada!', 11),
  (gen_random_uuid(), 12, 2, 'Dia 12 - Em breve', 'Objetivo do dia 12', 'Orientação do dia 12', 'pilar', NULL, 'Ação do dia 12', '[]'::jsonb, 'Continue sua jornada!', 12),
  (gen_random_uuid(), 13, 2, 'Dia 13 - Em breve', 'Objetivo do dia 13', 'Orientação do dia 13', 'pilar', NULL, 'Ação do dia 13', '[]'::jsonb, 'Continue sua jornada!', 13),
  (gen_random_uuid(), 14, 2, 'Dia 14 - Em breve', 'Objetivo do dia 14', 'Orientação do dia 14', 'exercicio', NULL, 'Ação do dia 14', '[]'::jsonb, 'Continue sua jornada!', 14)
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

-- SEMANA 3 - ENCANTAMENTO YLADA
INSERT INTO journey_days (id, day_number, week_number, title, objective, guidance, action_type, action_id, action_title, checklist_items, motivational_phrase, order_index)
SELECT 
  gen_random_uuid(),
  day_num,
  3,
  format('Dia %s - Em breve', day_num),
  format('Objetivo do dia %s', day_num),
  format('Orientação do dia %s', day_num),
  CASE WHEN day_num = 21 THEN 'exercicio' ELSE 'pilar' END,
  NULL,
  format('Ação do dia %s', day_num),
  '[]'::jsonb,
  'Continue sua jornada!',
  day_num
FROM generate_series(15, 21) AS day_num
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

-- SEMANA 4 - ORGANIZAÇÃO E ESCALA
INSERT INTO journey_days (id, day_number, week_number, title, objective, guidance, action_type, action_id, action_title, checklist_items, motivational_phrase, order_index)
SELECT 
  gen_random_uuid(),
  day_num,
  4,
  format('Dia %s - Em breve', day_num),
  format('Objetivo do dia %s', day_num),
  format('Orientação do dia %s', day_num),
  CASE WHEN day_num = 30 THEN 'exercicio' ELSE 'pilar' END,
  NULL,
  format('Ação do dia %s', day_num),
  '[]'::jsonb,
  'Continue sua jornada!',
  day_num
FROM generate_series(22, 30) AS day_num
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
