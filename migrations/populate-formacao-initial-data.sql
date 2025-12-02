-- =====================================================
-- YLADA - Formação Empresarial - Dados Iniciais
-- =====================================================
-- Script para popular dados iniciais das trilhas, microcursos, biblioteca e tutoriais

-- 1. TRILHA 1 - Empreendedora Nutri 2.0
INSERT INTO courses_trails (id, title, description, short_description, estimated_hours, level, is_recommended, badge, order_index)
VALUES (
  gen_random_uuid(),
  'Empreendedora Nutri 2.0',
  'Trilha completa para transformar sua prática nutricional em um negócio de sucesso. Aprenda mindset empresarial, posicionamento, filosofia YLADA aplicada, rotina empresarial mínima, prioridades e organização, e como pensar em crescimento.',
  'Transforme sua prática nutricional em um negócio de sucesso',
  8,
  'iniciante',
  true,
  'Recomendado',
  1
);

-- Módulos e Aulas da Trilha 1 (usando subquery para pegar o ID)
-- Módulo 1: Mindset Empresarial
INSERT INTO trails_modules (id, trail_id, title, description, order_index)
SELECT gen_random_uuid(), id, 'Mindset Empresarial', 'Fundamentos do pensamento empresarial para nutricionistas', 1
FROM courses_trails WHERE title = 'Empreendedora Nutri 2.0' LIMIT 1;

-- Aulas do Módulo 1
INSERT INTO trails_lessons (id, trail_id, module_id, title, description, video_duration_minutes, order_index)
SELECT 
  gen_random_uuid(),
  t.id,
  m.id,
  'Introdução ao Mindset Empresarial',
  'Entenda os princípios fundamentais do mindset empresarial aplicado à nutrição',
  15,
  1
FROM courses_trails t
CROSS JOIN trails_modules m
WHERE t.title = 'Empreendedora Nutri 2.0' AND m.title = 'Mindset Empresarial' AND m.order_index = 1
LIMIT 1;

INSERT INTO trails_lessons (id, trail_id, module_id, title, description, video_duration_minutes, order_index)
SELECT 
  gen_random_uuid(),
  t.id,
  m.id,
  'Mudança de Mentalidade',
  'Como transformar sua mentalidade de profissional para empreendedora',
  20,
  2
FROM courses_trails t
CROSS JOIN trails_modules m
WHERE t.title = 'Empreendedora Nutri 2.0' AND m.title = 'Mindset Empresarial' AND m.order_index = 1
LIMIT 1;

-- Módulo 2: Postura e Posicionamento
INSERT INTO trails_modules (id, trail_id, title, description, order_index)
SELECT gen_random_uuid(), id, 'Postura e Posicionamento', 'Como se posicionar no mercado como nutricionista', 2
FROM courses_trails WHERE title = 'Empreendedora Nutri 2.0' LIMIT 1;

INSERT INTO trails_lessons (id, trail_id, module_id, title, description, video_duration_minutes, order_index)
SELECT 
  gen_random_uuid(),
  t.id,
  m.id,
  'Definindo seu Posicionamento',
  'Aprenda a definir e comunicar seu posicionamento único no mercado',
  18,
  1
FROM courses_trails t
CROSS JOIN trails_modules m
WHERE t.title = 'Empreendedora Nutri 2.0' AND m.title = 'Postura e Posicionamento' AND m.order_index = 2
LIMIT 1;

-- Módulo 3: Filosofia YLADA Aplicada
INSERT INTO trails_modules (id, trail_id, title, description, order_index)
SELECT gen_random_uuid(), id, 'Filosofia YLADA Aplicada', 'Como aplicar a filosofia YLADA no seu negócio', 3
FROM courses_trails WHERE title = 'Empreendedora Nutri 2.0' LIMIT 1;

INSERT INTO trails_lessons (id, trail_id, module_id, title, description, video_duration_minutes, order_index)
SELECT 
  gen_random_uuid(),
  t.id,
  m.id,
  'Princípios da Filosofia YLADA',
  'Conheça os princípios fundamentais da filosofia YLADA',
  25,
  1
FROM courses_trails t
CROSS JOIN trails_modules m
WHERE t.title = 'Empreendedora Nutri 2.0' AND m.title = 'Filosofia YLADA Aplicada' AND m.order_index = 3
LIMIT 1;

-- Módulo 4: Rotina Empresarial Mínima
INSERT INTO trails_modules (id, trail_id, title, description, order_index)
SELECT gen_random_uuid(), id, 'Rotina Empresarial Mínima', 'Como estabelecer uma rotina empresarial eficiente', 4
FROM courses_trails WHERE title = 'Empreendedora Nutri 2.0' LIMIT 1;

INSERT INTO trails_lessons (id, trail_id, module_id, title, description, video_duration_minutes, order_index)
SELECT 
  gen_random_uuid(),
  t.id,
  m.id,
  'Criando sua Rotina Mínima',
  'Aprenda a criar uma rotina empresarial mínima e eficaz',
  20,
  1
FROM courses_trails t
CROSS JOIN trails_modules m
WHERE t.title = 'Empreendedora Nutri 2.0' AND m.title = 'Rotina Empresarial Mínima' AND m.order_index = 4
LIMIT 1;

-- Módulo 5: Prioridades e Organização
INSERT INTO trails_modules (id, trail_id, title, description, order_index)
SELECT gen_random_uuid(), id, 'Prioridades e Organização', 'Como definir prioridades e se organizar como empreendedora', 5
FROM courses_trails WHERE title = 'Empreendedora Nutri 2.0' LIMIT 1;

INSERT INTO trails_lessons (id, trail_id, module_id, title, description, video_duration_minutes, order_index)
SELECT 
  gen_random_uuid(),
  t.id,
  m.id,
  'Definindo Prioridades',
  'Aprenda a definir e manter suas prioridades como empreendedora',
  15,
  1
FROM courses_trails t
CROSS JOIN trails_modules m
WHERE t.title = 'Empreendedora Nutri 2.0' AND m.title = 'Prioridades e Organização' AND m.order_index = 5
LIMIT 1;

-- Módulo 6: Como Pensar em Crescimento
INSERT INTO trails_modules (id, trail_id, title, description, order_index)
SELECT gen_random_uuid(), id, 'Como Pensar em Crescimento', 'Estratégias para pensar e planejar o crescimento do seu negócio', 6
FROM courses_trails WHERE title = 'Empreendedora Nutri 2.0' LIMIT 1;

INSERT INTO trails_lessons (id, trail_id, module_id, title, description, video_duration_minutes, order_index)
SELECT 
  gen_random_uuid(),
  t.id,
  m.id,
  'Planejamento de Crescimento',
  'Como planejar e executar o crescimento do seu negócio',
  22,
  1
FROM courses_trails t
CROSS JOIN trails_modules m
WHERE t.title = 'Empreendedora Nutri 2.0' AND m.title = 'Como Pensar em Crescimento' AND m.order_index = 6
LIMIT 1;

-- 2. TRILHA 2 - Atendimento que Encanta
INSERT INTO courses_trails (id, title, description, short_description, estimated_hours, level, is_recommended, badge, order_index)
VALUES (
  gen_random_uuid(),
  'Atendimento que Encanta',
  'Aprenda técnicas avançadas de atendimento para criar experiências memoráveis e transformar clientes em fãs da sua marca.',
  'Crie experiências memoráveis e transforme clientes em fãs',
  6,
  'intermediario',
  false,
  'Essencial',
  2
);

-- 3. TRILHA 3 - Captação com Ferramentas YLADA
INSERT INTO courses_trails (id, title, description, short_description, estimated_hours, level, is_recommended, badge, order_index)
VALUES (
  gen_random_uuid(),
  'Captação com Ferramentas YLADA',
  'Domine as ferramentas YLADA para captar clientes de forma eficiente e escalável.',
  'Domine as ferramentas YLADA para captação eficiente',
  5,
  'intermediario',
  false,
  'Novo',
  3
);

-- 4. TRILHA 4 - Gestão Simplificada da Nutri (GSAL)
INSERT INTO courses_trails (id, title, description, short_description, estimated_hours, level, is_recommended, badge, order_index)
VALUES (
  gen_random_uuid(),
  'Gestão Simplificada da Nutri (GSAL)',
  'Aprenda a gerenciar seu negócio de forma simples e eficaz com a metodologia GSAL.',
  'Gerencie seu negócio de forma simples e eficaz',
  7,
  'intermediario',
  false,
  'Essencial',
  4
);

-- 5. TRILHA 5 - Formação Empresarial YLADA
INSERT INTO courses_trails (id, title, description, short_description, estimated_hours, level, is_recommended, badge, order_index)
VALUES (
  gen_random_uuid(),
  'Formação Empresarial YLADA',
  'Formação completa em empreendedorismo para nutricionistas com foco em resultados práticos.',
  'Formação completa em empreendedorismo para nutricionistas',
  10,
  'avancado',
  false,
  'Recomendado',
  5
);

-- MICROCURSOS
INSERT INTO microcourses (id, title, description, duration_minutes, checklist_items, order_index)
VALUES 
  (gen_random_uuid(), 'Como responder objeções em 5 minutos', 'Aprenda técnicas rápidas e eficazes para responder objeções comuns dos clientes', 5, '["Identificar o tipo de objeção", "Preparar respostas objetivas", "Praticar com casos reais"]'::jsonb, 1),
  (gen_random_uuid(), 'Como gerar indicações todos os dias', 'Estratégias práticas para criar um sistema de indicações contínuas', 8, '["Criar sistema de recompensas", "Comunicar valor aos clientes", "Automatizar processo de indicação"]'::jsonb, 2),
  (gen_random_uuid(), 'Como organizar a rotina da Nutri', 'Organize sua rotina diária para máxima produtividade e resultados', 10, '["Definir horários fixos", "Priorizar tarefas importantes", "Criar checklist diário"]'::jsonb, 3),
  (gen_random_uuid(), 'Como transformar avaliações em vendas', 'Aprenda a converter avaliações nutricionais em vendas de pacotes e consultas', 12, '["Estruturar avaliação", "Identificar necessidades", "Apresentar soluções"]'::jsonb, 4),
  (gen_random_uuid(), 'Como fazer fechamento de mês', 'Aprenda a fazer o fechamento financeiro mensal do seu negócio', 15, '["Organizar receitas", "Contabilizar despesas", "Calcular lucro líquido"]'::jsonb, 5);

-- BIBLIOTECA
INSERT INTO library_files (id, title, description, category, file_type, file_url, order_index)
VALUES 
  (gen_random_uuid(), 'Script de Atendimento Inicial', 'Script completo para o primeiro atendimento com novos clientes', 'Scripts de Atendimento', 'script', '/files/scripts/atendimento-inicial.pdf', 1),
  (gen_random_uuid(), 'Checklist de Avaliação Nutricional', 'Checklist completo para realizar avaliações nutricionais completas', 'Checklists', 'script', '/files/checklists/avaliacao-nutricional.pdf', 2),
  (gen_random_uuid(), 'Template de Anamnese', 'Template profissional de anamnese nutricional', 'Templates', 'template', '/files/templates/anamnese.docx', 3),
  (gen_random_uuid(), 'Guia de Macronutrientes', 'PDF educativo sobre macronutrientes e suas funções', 'PDFs educativos', 'pdf', '/files/educativos/macronutrientes.pdf', 4),
  (gen_random_uuid(), 'Planilha de Acompanhamento', 'Planilha para acompanhamento de evolução dos clientes', 'Materiais de apoio', 'planilha', '/files/materiais/acompanhamento.xlsx', 5);

-- TUTORIAIS
INSERT INTO tutorials (id, title, description, tool_name, duration_minutes, level, order_index)
VALUES 
  (gen_random_uuid(), 'Como usar Captação', 'Tutorial rápido mostrando como usar as ferramentas de captação do YLADA', 'Captação', 2, 'basico', 1),
  (gen_random_uuid(), 'Como usar Gestão', 'Aprenda a usar as ferramentas de gestão de clientes e agenda', 'Gestão', 3, 'basico', 2),
  (gen_random_uuid(), 'Como usar Formulários', 'Tutorial completo sobre criação e uso de formulários personalizados', 'Formulários', 4, 'intermediario', 3),
  (gen_random_uuid(), 'Como criar um link YLADA', 'Passo a passo para criar e personalizar seus links YLADA', 'Links YLADA', 3, 'basico', 4),
  (gen_random_uuid(), 'Como divulgar sua ferramenta', 'Estratégias práticas para divulgar suas ferramentas e captar mais clientes', 'Divulgação', 5, 'intermediario', 5);
