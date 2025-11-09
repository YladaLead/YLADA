-- ============================================
-- VERIFICAR TEMPLATES FALTANTES - WELLNESS
-- Meta: 35 templates ativos
-- Atual: 31 templates ativos
-- Faltam: 4 templates
-- ============================================

-- 1. LISTA COMPLETA DE TEMPLATES ESPERADOS (35)
WITH templates_esperados AS (
  SELECT name, type FROM (VALUES
    -- Calculadoras (4)
    ('Calculadora de IMC', 'calculadora'),
    ('Calculadora de Proteína', 'calculadora'),
    ('Calculadora de Água', 'calculadora'),
    ('Calculadora de Calorias', 'calculadora'),
    
    -- Planilhas (2)
    ('Checklist Alimentar', 'planilha'),
    ('Checklist Detox', 'planilha'),
    
    -- Guias (esperado: 3-4)
    ('Guia de Hidratação', 'guia'),
    ('Guia Nutracêutico', 'guia'),
    ('Guia Proteico', 'guia'),
    ('Mini E-book', 'guia'),
    
    -- Quizzes (24: 22 normais + 2 desafios)
    ('Quiz de Bem-Estar', 'quiz'),
    ('Quiz Detox', 'quiz'),
    ('Quiz Interativo', 'quiz'),
    ('Quiz Energético', 'quiz'),
    ('Quiz Perfil Nutricional', 'quiz'),
    ('Quiz: Alimentação Saudável', 'quiz'),
    ('Quiz: Potencial e Crescimento', 'quiz'),
    ('Quiz: Ganhos e Prosperidade', 'quiz'),
    ('Quiz: Propósito e Equilíbrio', 'quiz'),
    ('Avaliação Inicial', 'quiz'),
    ('Avaliação de Fome Emocional', 'quiz'),
    ('Avaliação de Intolerâncias/Sensibilidades', 'quiz'),
    ('Avaliação do Perfil Metabólico', 'quiz'),
    ('Diagnóstico de Eletrólitos', 'quiz'),
    ('Diagnóstico de Sintomas Intestinais', 'quiz'),
    ('Pronto para Emagrecer com Saúde?', 'quiz'),
    ('Qual é o seu Tipo de Fome?', 'quiz'),
    ('Risco de Síndrome Metabólica', 'quiz'),
    ('Teste de Retenção de Líquidos', 'quiz'),
    ('Você conhece o seu corpo?', 'quiz'),
    ('Você é mais disciplinado ou emocional com a comida?', 'quiz'),
    ('Você está nutrido ou apenas alimentado?', 'quiz'),
    ('Você está se alimentando conforme sua rotina?', 'quiz'),
    ('Desafio 7 Dias', 'quiz'),
    ('Desafio 21 Dias', 'quiz')
  ) AS t(name, type)
),
-- 2. TEMPLATES ATIVOS NO BANCO
templates_ativos AS (
  SELECT 
    name,
    type,
    is_active,
    slug
  FROM templates_nutrition
  WHERE profession = 'wellness'
    AND language = 'pt'
    AND is_active = true
)
-- 3. IDENTIFICAR TEMPLATES FALTANTES
SELECT 
  '⚠️ TEMPLATE FALTANTE' as status,
  te.name as nome_esperado,
  te.type as tipo,
  'Este template não está ativo no banco' as observacao
FROM templates_esperados te
LEFT JOIN templates_ativos ta ON te.name = ta.name AND te.type = ta.type
WHERE ta.name IS NULL
ORDER BY te.type, te.name;

-- 4. RESUMO POR TIPO
WITH templates_esperados AS (
  SELECT name, type FROM (VALUES
    ('Calculadora de IMC', 'calculadora'),
    ('Calculadora de Proteína', 'calculadora'),
    ('Calculadora de Água', 'calculadora'),
    ('Calculadora de Calorias', 'calculadora'),
    ('Checklist Alimentar', 'planilha'),
    ('Checklist Detox', 'planilha'),
    ('Guia de Hidratação', 'guia'),
    ('Guia Nutracêutico', 'guia'),
    ('Guia Proteico', 'guia'),
    ('Mini E-book', 'guia'),
    ('Quiz de Bem-Estar', 'quiz'),
    ('Quiz Detox', 'quiz'),
    ('Quiz Interativo', 'quiz'),
    ('Quiz Energético', 'quiz'),
    ('Quiz Perfil Nutricional', 'quiz'),
    ('Quiz: Alimentação Saudável', 'quiz'),
    ('Quiz: Potencial e Crescimento', 'quiz'),
    ('Quiz: Ganhos e Prosperidade', 'quiz'),
    ('Quiz: Propósito e Equilíbrio', 'quiz'),
    ('Avaliação Inicial', 'quiz'),
    ('Avaliação de Fome Emocional', 'quiz'),
    ('Avaliação de Intolerâncias/Sensibilidades', 'quiz'),
    ('Avaliação do Perfil Metabólico', 'quiz'),
    ('Diagnóstico de Eletrólitos', 'quiz'),
    ('Diagnóstico de Sintomas Intestinais', 'quiz'),
    ('Pronto para Emagrecer com Saúde?', 'quiz'),
    ('Qual é o seu Tipo de Fome?', 'quiz'),
    ('Risco de Síndrome Metabólica', 'quiz'),
    ('Teste de Retenção de Líquidos', 'quiz'),
    ('Você conhece o seu corpo?', 'quiz'),
    ('Você é mais disciplinado ou emocional com a comida?', 'quiz'),
    ('Você está nutrido ou apenas alimentado?', 'quiz'),
    ('Você está se alimentando conforme sua rotina?', 'quiz'),
    ('Desafio 7 Dias', 'quiz'),
    ('Desafio 21 Dias', 'quiz')
  ) AS t(name, type)
),
templates_ativos AS (
  SELECT name, type
  FROM templates_nutrition
  WHERE profession = 'wellness'
    AND language = 'pt'
    AND is_active = true
)
SELECT 
  '📊 RESUMO' as info,
  te.type as tipo,
  COUNT(DISTINCT te.name) as esperados,
  COUNT(DISTINCT ta.name) as ativos,
  COUNT(DISTINCT te.name) - COUNT(DISTINCT ta.name) as faltantes
FROM templates_esperados te
LEFT JOIN templates_ativos ta ON te.name = ta.name AND te.type = ta.type
GROUP BY te.type
ORDER BY te.type;

-- 5. CONTAGEM GERAL
WITH templates_esperados AS (
  SELECT name, type FROM (VALUES
    ('Calculadora de IMC', 'calculadora'),
    ('Calculadora de Proteína', 'calculadora'),
    ('Calculadora de Água', 'calculadora'),
    ('Calculadora de Calorias', 'calculadora'),
    ('Checklist Alimentar', 'planilha'),
    ('Checklist Detox', 'planilha'),
    ('Guia de Hidratação', 'guia'),
    ('Guia Nutracêutico', 'guia'),
    ('Guia Proteico', 'guia'),
    ('Mini E-book', 'guia'),
    ('Quiz de Bem-Estar', 'quiz'),
    ('Quiz Detox', 'quiz'),
    ('Quiz Interativo', 'quiz'),
    ('Quiz Energético', 'quiz'),
    ('Quiz Perfil Nutricional', 'quiz'),
    ('Quiz: Alimentação Saudável', 'quiz'),
    ('Quiz: Potencial e Crescimento', 'quiz'),
    ('Quiz: Ganhos e Prosperidade', 'quiz'),
    ('Quiz: Propósito e Equilíbrio', 'quiz'),
    ('Avaliação Inicial', 'quiz'),
    ('Avaliação de Fome Emocional', 'quiz'),
    ('Avaliação de Intolerâncias/Sensibilidades', 'quiz'),
    ('Avaliação do Perfil Metabólico', 'quiz'),
    ('Diagnóstico de Eletrólitos', 'quiz'),
    ('Diagnóstico de Sintomas Intestinais', 'quiz'),
    ('Pronto para Emagrecer com Saúde?', 'quiz'),
    ('Qual é o seu Tipo de Fome?', 'quiz'),
    ('Risco de Síndrome Metabólica', 'quiz'),
    ('Teste de Retenção de Líquidos', 'quiz'),
    ('Você conhece o seu corpo?', 'quiz'),
    ('Você é mais disciplinado ou emocional com a comida?', 'quiz'),
    ('Você está nutrido ou apenas alimentado?', 'quiz'),
    ('Você está se alimentando conforme sua rotina?', 'quiz'),
    ('Desafio 7 Dias', 'quiz'),
    ('Desafio 21 Dias', 'quiz')
  ) AS t(name, type)
),
templates_ativos AS (
  SELECT name, type
  FROM templates_nutrition
  WHERE profession = 'wellness'
    AND language = 'pt'
    AND is_active = true
)
SELECT 
  '📊 CONTAGEM GERAL' as info,
  COUNT(DISTINCT te.name) as total_esperado,
  COUNT(DISTINCT ta.name) as total_ativo,
  COUNT(DISTINCT te.name) - COUNT(DISTINCT ta.name) as total_faltante
FROM templates_esperados te
LEFT JOIN templates_ativos ta ON te.name = ta.name AND te.type = ta.type;

