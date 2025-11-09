-- ============================================
-- IDENTIFICAR E REMOVER QUIZ EXTRA - WELLNESS
-- Temos 23 quizzes normais, esperado 22
-- ============================================

-- 1. IDENTIFICAR QUIZ EXTRA (está no banco mas não está na lista esperada)
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
  '⚠️ QUIZ EXTRA IDENTIFICADO' as status,
  qa.name as nome,
  qa.id,
  qa.slug,
  qa.created_at,
  'Este quiz não está na lista esperada de 22 quizzes' as observacao
FROM quizzes_ativos qa
LEFT JOIN quizzes_esperados qe ON qa.name = qe.name
WHERE qe.name IS NULL;

-- 2. VERIFICAR TODOS OS QUIZZES NORMAIS
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
  CASE 
    WHEN qe.name IS NOT NULL THEN '✅ Esperado'
    ELSE '⚠️ EXTRA'
  END as status,
  qa.name as nome,
  qa.slug,
  qa.created_at
FROM quizzes_ativos qa
LEFT JOIN quizzes_esperados qe ON qa.name = qe.name
ORDER BY 
  CASE WHEN qe.name IS NOT NULL THEN 1 ELSE 2 END,
  qa.name;

-- 3. CONTAGEM
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
  '📊 CONTAGEM' as info,
  COUNT(*) as total_quizzes_normais,
  COUNT(CASE WHEN qe.name IS NOT NULL THEN 1 END) as esperados,
  COUNT(CASE WHEN qe.name IS NULL THEN 1 END) as extras
FROM quizzes_ativos qa
LEFT JOIN quizzes_esperados qe ON qa.name = qe.name;

