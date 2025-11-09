-- ============================================
-- DESATIVAR QUIZ EXTRA AUTOMATICAMENTE - WELLNESS
-- Identifica e desativa o quiz extra automaticamente
-- ============================================

-- 1. VERIFICAR ANTES - IDENTIFICAR QUIZ EXTRA
WITH quizzes_esperados AS (
  SELECT name FROM (VALUES
    ('Quiz de Bem-Estar'),
    ('Quiz Detox'),
    ('Quiz Interativo'),
    ('Quiz Energético'),
    ('Quiz Perfil Nutricional'),
    ('Quiz: Alimentação Saudável'),
    ('Quiz: Potencial e Crescimento'),
    ('Quiz: Ganhos e Prosperidade'),
    ('Quiz: Propósito e Equilíbrio'),
    ('Avaliação Inicial'),
    ('Avaliação de Fome Emocional'),
    ('Avaliação de Intolerâncias/Sensibilidades'),
    ('Avaliação do Perfil Metabólico'),
    ('Diagnóstico de Eletrólitos'),
    ('Diagnóstico de Sintomas Intestinais'),
    ('Pronto para Emagrecer com Saúde?'),
    ('Qual é o seu Tipo de Fome?'),
    ('Risco de Síndrome Metabólica'),
    ('Teste de Retenção de Líquidos'),
    ('Você conhece o seu corpo?'),
    ('Você é mais disciplinado ou emocional com a comida?'),
    ('Você está nutrido ou apenas alimentado?'),
    ('Você está se alimentando conforme sua rotina?')
  ) AS t(name)
)
SELECT 
  'ANTES' as etapa,
  name as nome,
  id,
  slug,
  is_active,
  created_at,
  'Este quiz será desativado' as observacao
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
  AND type = 'quiz'
  AND is_active = true
  AND name NOT LIKE '%Desafio%'
  AND name NOT IN (
    SELECT name FROM quizzes_esperados
  );

-- 2. DESATIVAR QUIZ EXTRA
WITH quizzes_esperados AS (
  SELECT name FROM (VALUES
    ('Quiz de Bem-Estar'),
    ('Quiz Detox'),
    ('Quiz Interativo'),
    ('Quiz Energético'),
    ('Quiz Perfil Nutricional'),
    ('Quiz: Alimentação Saudável'),
    ('Quiz: Potencial e Crescimento'),
    ('Quiz: Ganhos e Prosperidade'),
    ('Quiz: Propósito e Equilíbrio'),
    ('Avaliação Inicial'),
    ('Avaliação de Fome Emocional'),
    ('Avaliação de Intolerâncias/Sensibilidades'),
    ('Avaliação do Perfil Metabólico'),
    ('Diagnóstico de Eletrólitos'),
    ('Diagnóstico de Sintomas Intestinais'),
    ('Pronto para Emagrecer com Saúde?'),
    ('Qual é o seu Tipo de Fome?'),
    ('Risco de Síndrome Metabólica'),
    ('Teste de Retenção de Líquidos'),
    ('Você conhece o seu corpo?'),
    ('Você é mais disciplinado ou emocional com a comida?'),
    ('Você está nutrido ou apenas alimentado?'),
    ('Você está se alimentando conforme sua rotina?')
  ) AS t(name)
)
UPDATE templates_nutrition
SET 
  is_active = false,
  updated_at = NOW()
WHERE profession = 'wellness'
  AND language = 'pt'
  AND type = 'quiz'
  AND is_active = true
  AND name NOT LIKE '%Desafio%'
  AND name NOT IN (
    SELECT name FROM quizzes_esperados
  );

-- 3. VERIFICAR DEPOIS
WITH quizzes_esperados AS (
  SELECT name FROM (VALUES
    ('Quiz de Bem-Estar'),
    ('Quiz Detox'),
    ('Quiz Interativo'),
    ('Quiz Energético'),
    ('Quiz Perfil Nutricional'),
    ('Quiz: Alimentação Saudável'),
    ('Quiz: Potencial e Crescimento'),
    ('Quiz: Ganhos e Prosperidade'),
    ('Quiz: Propósito e Equilíbrio'),
    ('Avaliação Inicial'),
    ('Avaliação de Fome Emocional'),
    ('Avaliação de Intolerâncias/Sensibilidades'),
    ('Avaliação do Perfil Metabólico'),
    ('Diagnóstico de Eletrólitos'),
    ('Diagnóstico de Sintomas Intestinais'),
    ('Pronto para Emagrecer com Saúde?'),
    ('Qual é o seu Tipo de Fome?'),
    ('Risco de Síndrome Metabólica'),
    ('Teste de Retenção de Líquidos'),
    ('Você conhece o seu corpo?'),
    ('Você é mais disciplinado ou emocional com a comida?'),
    ('Você está nutrido ou apenas alimentado?'),
    ('Você está se alimentando conforme sua rotina?')
  ) AS t(name)
)
SELECT 
  'DEPOIS' as etapa,
  name as nome,
  id,
  slug,
  is_active,
  updated_at
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
  AND type = 'quiz'
  AND name NOT LIKE '%Desafio%'
  AND name NOT IN (
    SELECT name FROM quizzes_esperados
  );

-- 4. CONTAGEM FINAL
SELECT 
  '📊 RESUMO FINAL' as info,
  COUNT(*) as total_ativos,
  COUNT(CASE WHEN type = 'calculadora' THEN 1 END) as calculadoras,
  COUNT(CASE WHEN type = 'planilha' THEN 1 END) as planilhas,
  COUNT(CASE WHEN type = 'guia' THEN 1 END) as guias,
  COUNT(CASE WHEN type = 'quiz' AND name LIKE '%Desafio%' THEN 1 END) as desafios,
  COUNT(CASE WHEN type = 'quiz' AND name NOT LIKE '%Desafio%' THEN 1 END) as quizzes_normais,
  COUNT(CASE WHEN type = 'quiz' THEN 1 END) as total_quizzes
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
  AND is_active = true;

-- DESATIVAR QUIZ EXTRA AUTOMATICAMENTE - WELLNESS
-- Identifica e desativa o quiz extra automaticamente
-- ============================================

-- 1. VERIFICAR ANTES
WITH quizzes_esperados AS (
  SELECT name FROM (VALUES
    ('Quiz de Bem-Estar'),
    ('Quiz Detox'),
    ('Quiz Interativo'),
    ('Quiz Energético'),
    ('Quiz Perfil Nutricional'),
    ('Quiz: Alimentação Saudável'),
    ('Quiz: Potencial e Crescimento'),
    ('Quiz: Ganhos e Prosperidade'),
    ('Quiz: Propósito e Equilíbrio'),
    ('Avaliação Inicial'),
    ('Avaliação de Fome Emocional'),
    ('Avaliação de Intolerâncias/Sensibilidades'),
    ('Avaliação do Perfil Metabólico'),
    ('Diagnóstico de Eletrólitos'),
    ('Diagnóstico de Sintomas Intestinais'),
    ('Pronto para Emagrecer com Saúde?'),
    ('Qual é o seu Tipo de Fome?'),
    ('Risco de Síndrome Metabólica'),
    ('Teste de Retenção de Líquidos'),
    ('Você conhece o seu corpo?'),
    ('Você é mais disciplinado ou emocional com a comida?'),
    ('Você está nutrido ou apenas alimentado?'),
    ('Você está se alimentando conforme sua rotina?')
  ) AS t(name)
),
quizzes_ativos AS (
  SELECT 
    name,
    id,
    slug,
    created_at
  FROM templates_nutrition
  WHERE profession = 'wellness'
    AND language = 'pt'
    AND is_active = true
    AND type = 'quiz'
    AND name NOT LIKE '%Desafio%'
)
SELECT 
  'ANTES' as etapa,
  qa.name as nome,
  qa.id,
  qa.slug,
  qa.is_active,
  'Este quiz será desativado' as observacao
FROM templates_nutrition qa
WHERE qa.profession = 'wellness'
  AND qa.language = 'pt'
  AND qa.type = 'quiz'
  AND qa.is_active = true
  AND qa.name NOT LIKE '%Desafio%'
  AND qa.name NOT IN (
    SELECT name FROM quizzes_esperados
  );

-- 2. DESATIVAR QUIZ EXTRA
WITH quizzes_esperados AS (
  SELECT name FROM (VALUES
    ('Quiz de Bem-Estar'),
    ('Quiz Detox'),
    ('Quiz Interativo'),
    ('Quiz Energético'),
    ('Quiz Perfil Nutricional'),
    ('Quiz: Alimentação Saudável'),
    ('Quiz: Potencial e Crescimento'),
    ('Quiz: Ganhos e Prosperidade'),
    ('Quiz: Propósito e Equilíbrio'),
    ('Avaliação Inicial'),
    ('Avaliação de Fome Emocional'),
    ('Avaliação de Intolerâncias/Sensibilidades'),
    ('Avaliação do Perfil Metabólico'),
    ('Diagnóstico de Eletrólitos'),
    ('Diagnóstico de Sintomas Intestinais'),
    ('Pronto para Emagrecer com Saúde?'),
    ('Qual é o seu Tipo de Fome?'),
    ('Risco de Síndrome Metabólica'),
    ('Teste de Retenção de Líquidos'),
    ('Você conhece o seu corpo?'),
    ('Você é mais disciplinado ou emocional com a comida?'),
    ('Você está nutrido ou apenas alimentado?'),
    ('Você está se alimentando conforme sua rotina?')
  ) AS t(name)
)
UPDATE templates_nutrition
SET 
  is_active = false,
  updated_at = NOW()
WHERE profession = 'wellness'
  AND language = 'pt'
  AND type = 'quiz'
  AND is_active = true
  AND name NOT LIKE '%Desafio%'
  AND name NOT IN (
    SELECT name FROM quizzes_esperados
  );

-- 3. VERIFICAR DEPOIS
WITH quizzes_esperados AS (
  SELECT name FROM (VALUES
    ('Quiz de Bem-Estar'),
    ('Quiz Detox'),
    ('Quiz Interativo'),
    ('Quiz Energético'),
    ('Quiz Perfil Nutricional'),
    ('Quiz: Alimentação Saudável'),
    ('Quiz: Potencial e Crescimento'),
    ('Quiz: Ganhos e Prosperidade'),
    ('Quiz: Propósito e Equilíbrio'),
    ('Avaliação Inicial'),
    ('Avaliação de Fome Emocional'),
    ('Avaliação de Intolerâncias/Sensibilidades'),
    ('Avaliação do Perfil Metabólico'),
    ('Diagnóstico de Eletrólitos'),
    ('Diagnóstico de Sintomas Intestinais'),
    ('Pronto para Emagrecer com Saúde?'),
    ('Qual é o seu Tipo de Fome?'),
    ('Risco de Síndrome Metabólica'),
    ('Teste de Retenção de Líquidos'),
    ('Você conhece o seu corpo?'),
    ('Você é mais disciplinado ou emocional com a comida?'),
    ('Você está nutrido ou apenas alimentado?'),
    ('Você está se alimentando conforme sua rotina?')
  ) AS t(name)
)
SELECT 
  'DEPOIS' as etapa,
  name as nome,
  id,
  slug,
  is_active,
  updated_at
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
  AND type = 'quiz'
  AND name NOT LIKE '%Desafio%'
  AND name NOT IN (
    SELECT name FROM quizzes_esperados
  );

-- 4. CONTAGEM FINAL
SELECT 
  '📊 RESUMO FINAL' as info,
  COUNT(*) as total_ativos,
  COUNT(CASE WHEN type = 'calculadora' THEN 1 END) as calculadoras,
  COUNT(CASE WHEN type = 'planilha' THEN 1 END) as planilhas,
  COUNT(CASE WHEN type = 'guia' THEN 1 END) as guias,
  COUNT(CASE WHEN type = 'quiz' AND name LIKE '%Desafio%' THEN 1 END) as desafios,
  COUNT(CASE WHEN type = 'quiz' AND name NOT LIKE '%Desafio%' THEN 1 END) as quizzes_normais,
  COUNT(CASE WHEN type = 'quiz' THEN 1 END) as total_quizzes
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
  AND is_active = true;



