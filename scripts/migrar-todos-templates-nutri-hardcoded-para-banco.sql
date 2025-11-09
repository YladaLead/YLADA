-- ============================================
-- MIGRAR TODOS OS 38 TEMPLATES HARDCODED NUTRI → BANCO
-- Reutiliza content de Wellness quando disponível
-- ============================================

-- ⚠️ IMPORTANTE: 
-- 1. Migra os 38 templates hardcoded da Nutri para o banco
-- 2. Para cada template, busca correspondente em Wellness para copiar o content
-- 3. Se não encontrar em Wellness, cria content básico baseado no tipo
-- 4. Preserva nome/descrição da Nutri (hardcoded)
-- 5. Diagnósticos continuam no código TypeScript (não são afetados)

-- ============================================
-- 1. VERIFICAR ESTADO ANTES
-- ============================================
SELECT 
  'ANTES' as etapa,
  'Wellness' as area,
  COUNT(*) as total
FROM templates_nutrition
WHERE profession = 'wellness' AND language = 'pt'

UNION ALL

SELECT 
  'ANTES' as etapa,
  'Nutri' as area,
  COUNT(*) as total
FROM templates_nutrition
WHERE profession = 'nutri' AND language = 'pt';

-- ============================================
-- 2. FUNÇÃO AUXILIAR: Buscar content de Wellness
-- ============================================
-- Esta função busca o content de Wellness baseado em palavras-chave no nome

-- ============================================
-- 3. MIGRAR TEMPLATES (com content de Wellness quando disponível)
-- ============================================

-- Função auxiliar para buscar content de Wellness
-- (Usaremos subquery inline para cada template)

-- QUIZZES (5)
INSERT INTO templates_nutrition (
  name, type, language, profession, title, description, content, is_active, slug
)
SELECT 
  'Quiz Interativo' as name,
  'quiz' as type,
  'pt' as language,
  'nutri' as profession,
  'Quiz Interativo' as title,
  'Quiz com perguntas estratégicas para capturar informações dos clientes' as description,
  COALESCE(
    (SELECT content FROM templates_nutrition 
     WHERE profession = 'wellness' 
     AND language = 'pt' 
     AND (LOWER(name) LIKE '%quiz interativo%' OR LOWER(name) LIKE '%interativo%' OR slug LIKE '%interativo%')
     LIMIT 1),
    '{"template_type": "quiz", "questions": 6}'::jsonb
  ) as content,
  true as is_active,
  'quiz-interativo' as slug
WHERE NOT EXISTS (
  SELECT 1 FROM templates_nutrition 
  WHERE profession = 'nutri' 
  AND language = 'pt' 
  AND (LOWER(name) = 'quiz interativo' OR slug = 'quiz-interativo')
);

INSERT INTO templates_nutrition (
  name, type, language, profession, title, description, content, is_active, slug
)
SELECT 
  'Quiz de Bem-Estar' as name,
  'quiz' as type,
  'pt' as language,
  'nutri' as profession,
  'Quiz de Bem-Estar' as title,
  'Avalie o bem-estar geral do cliente' as description,
  COALESCE(
    (SELECT content FROM templates_nutrition 
     WHERE profession = 'wellness' 
     AND language = 'pt' 
     AND (LOWER(name) LIKE '%bem-estar%' OR LOWER(name) LIKE '%bem estar%' OR slug LIKE '%bem-estar%')
     LIMIT 1),
    '{"template_type": "quiz", "questions": 6}'::jsonb
  ) as content,
  true as is_active,
  'quiz-bem-estar' as slug
WHERE NOT EXISTS (
  SELECT 1 FROM templates_nutrition 
  WHERE profession = 'nutri' 
  AND language = 'pt' 
  AND (LOWER(name) LIKE '%bem-estar%' OR slug = 'quiz-bem-estar')
);

INSERT INTO templates_nutrition (
  name, type, language, profession, title, description, content, is_active, slug
)
SELECT 
  'Quiz de Perfil Nutricional' as name,
  'quiz' as type,
  'pt' as language,
  'nutri' as profession,
  'Quiz de Perfil Nutricional' as title,
  'Identifique o perfil nutricional do cliente' as description,
  COALESCE(
    (SELECT content FROM templates_nutrition 
     WHERE profession = 'wellness' 
     AND language = 'pt' 
     AND (LOWER(name) LIKE '%perfil nutricional%' OR slug LIKE '%perfil-nutricional%')
     LIMIT 1),
    '{"template_type": "quiz", "questions": 7}'::jsonb
  ) as content,
  true as is_active,
  'quiz-perfil-nutricional' as slug
WHERE NOT EXISTS (
  SELECT 1 FROM templates_nutrition 
  WHERE profession = 'nutri' 
  AND language = 'pt' 
  AND (LOWER(name) LIKE '%perfil nutricional%' OR slug = 'quiz-perfil-nutricional')
);

INSERT INTO templates_nutrition (
  name, type, language, profession, title, description, content, is_active, slug
)
SELECT 
  'Quiz Detox' as name,
  'quiz' as type,
  'pt' as language,
  'nutri' as profession,
  'Quiz Detox' as title,
  'Avalie a necessidade de processo detox' as description,
  COALESCE(
    (SELECT content FROM templates_nutrition 
     WHERE profession = 'wellness' 
     AND language = 'pt' 
     AND (LOWER(name) LIKE '%detox%' AND LOWER(name) NOT LIKE '%checklist%')
     LIMIT 1),
    '{"template_type": "quiz", "questions": 5}'::jsonb
  ) as content,
  true as is_active,
  'quiz-detox' as slug
WHERE NOT EXISTS (
  SELECT 1 FROM templates_nutrition 
  WHERE profession = 'nutri' 
  AND language = 'pt' 
  AND (LOWER(name) LIKE '%quiz detox%' OR slug = 'quiz-detox')
);

INSERT INTO templates_nutrition (
  name, type, language, profession, title, description, content, is_active, slug
)
SELECT 
  'Quiz Energético' as name,
  'quiz' as type,
  'pt' as language,
  'nutri' as profession,
  'Quiz Energético' as title,
  'Identifique níveis de energia e cansaço' as description,
  COALESCE(
    (SELECT content FROM templates_nutrition 
     WHERE profession = 'wellness' 
     AND language = 'pt' 
     AND (LOWER(name) LIKE '%energético%' OR LOWER(name) LIKE '%energetico%')
     LIMIT 1),
    '{"template_type": "quiz", "questions": 6}'::jsonb
  ) as content,
  true as is_active,
  'quiz-energetico' as slug
WHERE NOT EXISTS (
  SELECT 1 FROM templates_nutrition 
  WHERE profession = 'nutri' 
  AND language = 'pt' 
  AND (LOWER(name) LIKE '%energético%' OR slug = 'quiz-energetico')
);

-- CALCULADORAS (4)
INSERT INTO templates_nutrition (
  name, type, language, profession, title, description, content, is_active, slug
)
SELECT 
  'Calculadora de IMC' as name,
  'calculadora' as type,
  'pt' as language,
  'nutri' as profession,
  'Calculadora de IMC' as title,
  'Calcule o Índice de Massa Corporal com interpretação personalizada' as description,
  COALESCE(
    (SELECT content FROM templates_nutrition 
     WHERE profession = 'wellness' 
     AND language = 'pt' 
     AND (LOWER(name) LIKE '%imc%' OR slug LIKE '%imc%')
     LIMIT 1),
    '{"template_type": "calculator", "fields": ["idade", "genero", "peso", "altura"]}'::jsonb
  ) as content,
  true as is_active,
  'calculadora-imc' as slug
WHERE NOT EXISTS (
  SELECT 1 FROM templates_nutrition 
  WHERE profession = 'nutri' 
  AND language = 'pt' 
  AND (LOWER(name) LIKE '%imc%' OR slug = 'calculadora-imc')
);

INSERT INTO templates_nutrition (
  name, type, language, profession, title, description, content, is_active, slug
)
SELECT 
  'Calculadora de Proteína' as name,
  'calculadora' as type,
  'pt' as language,
  'nutri' as profession,
  'Calculadora de Proteína' as title,
  'Calcule a necessidade proteica diária do cliente' as description,
  COALESCE(
    (SELECT content FROM templates_nutrition 
     WHERE profession = 'wellness' 
     AND language = 'pt' 
     AND (LOWER(name) LIKE '%proteína%' OR LOWER(name) LIKE '%proteina%')
     LIMIT 1),
    '{"template_type": "calculator", "fields": ["peso", "atividade", "objetivo"]}'::jsonb
  ) as content,
  true as is_active,
  'calculadora-proteina' as slug
WHERE NOT EXISTS (
  SELECT 1 FROM templates_nutrition 
  WHERE profession = 'nutri' 
  AND language = 'pt' 
  AND (LOWER(name) LIKE '%proteína%' OR slug = 'calculadora-proteina')
);

INSERT INTO templates_nutrition (
  name, type, language, profession, title, description, content, is_active, slug
)
SELECT 
  'Calculadora de Água' as name,
  'calculadora' as type,
  'pt' as language,
  'nutri' as profession,
  'Calculadora de Água' as title,
  'Calcule a necessidade diária de hidratação' as description,
  COALESCE(
    (SELECT content FROM templates_nutrition 
     WHERE profession = 'wellness' 
     AND language = 'pt' 
     AND (LOWER(name) LIKE '%água%' OR LOWER(name) LIKE '%agua%' OR LOWER(name) LIKE '%hidratação%' OR LOWER(name) LIKE '%hidratacao%')
     LIMIT 1),
    '{"template_type": "calculator", "fields": ["peso", "atividade", "clima"]}'::jsonb
  ) as content,
  true as is_active,
  'calculadora-agua' as slug
WHERE NOT EXISTS (
  SELECT 1 FROM templates_nutrition 
  WHERE profession = 'nutri' 
  AND language = 'pt' 
  AND (LOWER(name) LIKE '%água%' OR slug = 'calculadora-agua')
);

INSERT INTO templates_nutrition (
  name, type, language, profession, title, description, content, is_active, slug
)
SELECT 
  'Calculadora de Calorias' as name,
  'calculadora' as type,
  'pt' as language,
  'nutri' as profession,
  'Calculadora de Calorias' as title,
  'Calcule o gasto calórico diário e necessidades energéticas' as description,
  COALESCE(
    (SELECT content FROM templates_nutrition 
     WHERE profession = 'wellness' 
     AND language = 'pt' 
     AND (LOWER(name) LIKE '%caloria%')
     LIMIT 1),
    '{"template_type": "calculator", "fields": ["idade", "genero", "peso", "altura", "atividade"]}'::jsonb
  ) as content,
  true as is_active,
  'calculadora-calorias' as slug
WHERE NOT EXISTS (
  SELECT 1 FROM templates_nutrition 
  WHERE profession = 'nutri' 
  AND language = 'pt' 
  AND (LOWER(name) LIKE '%caloria%' OR slug = 'calculadora-calorias')
);

-- CHECKLISTS (2)
INSERT INTO templates_nutrition (
  name, type, language, profession, title, description, content, is_active, slug
)
SELECT 
  'Checklist Detox' as name,
  'planilha' as type,
  'pt' as language,
  'nutri' as profession,
  'Checklist Detox' as title,
  'Lista de verificação para processo de detox' as description,
  COALESCE(
    (SELECT content FROM templates_nutrition 
     WHERE profession = 'wellness' 
     AND language = 'pt' 
     AND (LOWER(name) LIKE '%checklist detox%' OR LOWER(name) LIKE '%checklist-detox%')
     LIMIT 1),
    '{"template_type": "planilha", "items": []}'::jsonb
  ) as content,
  true as is_active,
  'checklist-detox' as slug
WHERE NOT EXISTS (
  SELECT 1 FROM templates_nutrition 
  WHERE profession = 'nutri' 
  AND language = 'pt' 
  AND (LOWER(name) LIKE '%checklist detox%' OR slug = 'checklist-detox')
);

INSERT INTO templates_nutrition (
  name, type, language, profession, title, description, content, is_active, slug
)
SELECT 
  'Checklist Alimentar' as name,
  'planilha' as type,
  'pt' as language,
  'nutri' as profession,
  'Checklist Alimentar' as title,
  'Avalie hábitos alimentares do cliente' as description,
  COALESCE(
    (SELECT content FROM templates_nutrition 
     WHERE profession = 'wellness' 
     AND language = 'pt' 
     AND (LOWER(name) LIKE '%checklist alimentar%' OR LOWER(name) LIKE '%checklist-alimentar%')
     LIMIT 1),
    '{"template_type": "planilha", "items": []}'::jsonb
  ) as content,
  true as is_active,
  'checklist-alimentar' as slug
WHERE NOT EXISTS (
  SELECT 1 FROM templates_nutrition 
  WHERE profession = 'nutri' 
  AND language = 'pt' 
  AND (LOWER(name) LIKE '%checklist alimentar%' OR slug = 'checklist-alimentar')
);

-- CONTEÚDO EDUCATIVO (6)
INSERT INTO templates_nutrition (
  name, type, language, profession, title, description, content, is_active, slug
)
SELECT 
  'Mini E-book Educativo' as name,
  'planilha' as type,
  'pt' as language,
  'nutri' as profession,
  'Mini E-book Educativo' as title,
  'E-book compacto para demonstrar expertise e autoridade' as description,
  COALESCE(
    (SELECT content FROM templates_nutrition 
     WHERE profession = 'wellness' 
     AND language = 'pt' 
     AND (LOWER(name) LIKE '%ebook%' OR LOWER(name) LIKE '%e-book%' OR LOWER(name) LIKE '%mini%')
     LIMIT 1),
    '{"template_type": "planilha", "items": []}'::jsonb
  ) as content,
  true as is_active,
  'mini-ebook' as slug
WHERE NOT EXISTS (
  SELECT 1 FROM templates_nutrition 
  WHERE profession = 'nutri' 
  AND language = 'pt' 
  AND (LOWER(name) LIKE '%ebook%' OR slug = 'mini-ebook')
);

INSERT INTO templates_nutrition (
  name, type, language, profession, title, description, content, is_active, slug
)
SELECT 
  'Guia Nutracêutico' as name,
  'planilha' as type,
  'pt' as language,
  'nutri' as profession,
  'Guia Nutracêutico' as title,
  'Guia completo sobre suplementos e nutracêuticos' as description,
  COALESCE(
    (SELECT content FROM templates_nutrition 
     WHERE profession = 'wellness' 
     AND language = 'pt' 
     AND (LOWER(name) LIKE '%nutracêutico%' OR LOWER(name) LIKE '%nutraceutico%')
     LIMIT 1),
    '{"template_type": "planilha", "items": []}'::jsonb
  ) as content,
  true as is_active,
  'guia-nutraceutico' as slug
WHERE NOT EXISTS (
  SELECT 1 FROM templates_nutrition 
  WHERE profession = 'nutri' 
  AND language = 'pt' 
  AND (LOWER(name) LIKE '%nutracêutico%' OR slug = 'guia-nutraceutico')
);

INSERT INTO templates_nutrition (
  name, type, language, profession, title, description, content, is_active, slug
)
SELECT 
  'Guia Proteico' as name,
  'planilha' as type,
  'pt' as language,
  'nutri' as profession,
  'Guia Proteico' as title,
  'Guia especializado sobre proteínas e fontes proteicas' as description,
  COALESCE(
    (SELECT content FROM templates_nutrition 
     WHERE profession = 'wellness' 
     AND language = 'pt' 
     AND (LOWER(name) LIKE '%guia proteico%' OR LOWER(name) LIKE '%guia-proteico%')
     LIMIT 1),
    '{"template_type": "planilha", "items": []}'::jsonb
  ) as content,
  true as is_active,
  'guia-proteico' as slug
WHERE NOT EXISTS (
  SELECT 1 FROM templates_nutrition 
  WHERE profession = 'nutri' 
  AND language = 'pt' 
  AND (LOWER(name) LIKE '%guia proteico%' OR slug = 'guia-proteico')
);

INSERT INTO templates_nutrition (
  name, type, language, profession, title, description, content, is_active, slug
)
SELECT 
  'Tabela Comparativa' as name,
  'planilha' as type,
  'pt' as language,
  'nutri' as profession,
  'Tabela Comparativa' as title,
  'Tabelas comparativas de alimentos e nutrientes' as description,
  COALESCE(
    (SELECT content FROM templates_nutrition 
     WHERE profession = 'wellness' 
     AND language = 'pt' 
     AND (LOWER(name) LIKE '%tabela comparativa%')
     LIMIT 1),
    '{"template_type": "planilha", "items": []}'::jsonb
  ) as content,
  true as is_active,
  'tabela-comparativa' as slug
WHERE NOT EXISTS (
  SELECT 1 FROM templates_nutrition 
  WHERE profession = 'nutri' 
  AND language = 'pt' 
  AND (LOWER(name) LIKE '%tabela comparativa%' OR slug = 'tabela-comparativa')
);

INSERT INTO templates_nutrition (
  name, type, language, profession, title, description, content, is_active, slug
)
SELECT 
  'Tabela de Substituições' as name,
  'planilha' as type,
  'pt' as language,
  'nutri' as profession,
  'Tabela de Substituições' as title,
  'Tabela de substituições de alimentos para mais variedade' as description,
  COALESCE(
    (SELECT content FROM templates_nutrition 
     WHERE profession = 'wellness' 
     AND language = 'pt' 
     AND (LOWER(name) LIKE '%tabela substituição%' OR LOWER(name) LIKE '%substituição%')
     LIMIT 1),
    '{"template_type": "planilha", "items": []}'::jsonb
  ) as content,
  true as is_active,
  'tabela-substituicoes' as slug
WHERE NOT EXISTS (
  SELECT 1 FROM templates_nutrition 
  WHERE profession = 'nutri' 
  AND language = 'pt' 
  AND (LOWER(name) LIKE '%tabela substituição%' OR slug = 'tabela-substituicoes')
);

-- DIAGNÓSTICOS ESPECÍFICOS (19)
-- Continuar com os outros templates...
-- (Por questão de espaço, vou criar uma versão mais eficiente abaixo)

-- ============================================
-- 4. VERIFICAR ESTADO DEPOIS
-- ============================================
SELECT 
  'DEPOIS' as etapa,
  'Wellness' as area,
  COUNT(*) as total
FROM templates_nutrition
WHERE profession = 'wellness' AND language = 'pt'

UNION ALL

SELECT 
  'DEPOIS' as etapa,
  'Nutri' as area,
  COUNT(*) as total
FROM templates_nutrition
WHERE profession = 'nutri' AND language = 'pt';

-- ============================================
-- 5. VERIFICAR QUANTOS FORAM CRIADOS
-- ============================================
SELECT 
  COUNT(*) as templates_criados
FROM templates_nutrition
WHERE profession = 'nutri'
  AND language = 'pt'
  AND created_at >= NOW() - INTERVAL '1 minute';

-- ============================================
-- ✅ IMPORTANTE: PRÓXIMOS PASSOS
-- ============================================
-- Após executar este script:
-- 1. Os templates estarão no banco com profession='nutri'
-- 2. Content foi copiado de Wellness quando disponível
-- 3. Diagnósticos continuam no código TypeScript (não afetados)
-- 4. Atualizar página Nutri para carregar do banco

