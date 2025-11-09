-- ============================================
-- IDENTIFICAR TEMPLATES EXTRAS RESTANTES
-- Após remover duplicatas, ainda temos:
-- - 3 planilhas (esperado 2) = 1 extra
-- - 25 quizzes (esperado 24) = 1 extra
-- ============================================

-- 1. PLANILHAS ATIVAS (3 ativas, esperado 2)
SELECT 
  '📊 PLANILHAS ATIVAS' as categoria,
  name as nome,
  slug,
  created_at,
  CASE 
    WHEN name LIKE '%Checklist Alimentar%' THEN '✅ Esperado'
    WHEN name LIKE '%Checklist Detox%' THEN '✅ Esperado'
    WHEN name LIKE '%Cardápio%' THEN '✅ Esperado (se for Cardápio Detox)'
    WHEN name LIKE '%Tabela%' THEN '✅ Esperado (se for Tabela Comparativa)'
    WHEN name LIKE '%Guia de Hidratação%' THEN '⚠️ Verificar - pode ser guia ou planilha'
    ELSE '❓ Verificar'
  END as status
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
  AND is_active = true
  AND type = 'planilha'
ORDER BY name;

-- 2. QUIZZES ATIVOS - LISTAR TODOS PARA IDENTIFICAR O EXTRA
-- Esperamos 24: 22 quizzes + 2 desafios
SELECT 
  '🎯 QUIZZES ATIVOS' as categoria,
  name as nome,
  slug,
  created_at,
  CASE 
    WHEN name LIKE '%Desafio%' THEN '🚀 DESAFIO'
    WHEN name = 'Quiz de Bem-Estar' THEN '✅ Bem-Estar'
    WHEN name = 'Quiz Detox' THEN '✅ Detox'
    WHEN name = 'Quiz Interativo' THEN '✅ Interativo/Metabolismo'
    WHEN name = 'Quiz Energético' THEN '✅ Energético'
    WHEN name = 'Quiz Perfil Nutricional' THEN '✅ Perfil Nutricional'
    WHEN name = 'Quiz: Alimentação Saudável' THEN '✅ Alimentação'
    WHEN name = 'Quiz: Potencial e Crescimento' THEN '✅ Potencial'
    WHEN name = 'Quiz: Ganhos e Prosperidade' THEN '✅ Ganhos'
    WHEN name = 'Quiz: Propósito e Equilíbrio' THEN '✅ Propósito'
    WHEN name = 'Avaliação Inicial' THEN '✅ Avaliação'
    WHEN name = 'Avaliação de Fome Emocional' THEN '✅ Fome Emocional'
    WHEN name = 'Avaliação de Intolerâncias/Sensibilidades' THEN '✅ Intolerâncias'
    WHEN name = 'Avaliação do Perfil Metabólico' THEN '✅ Perfil Metabólico'
    WHEN name = 'Diagnóstico de Eletrólitos' THEN '✅ Eletrólitos'
    WHEN name = 'Diagnóstico de Sintomas Intestinais' THEN '✅ Intestinais'
    WHEN name = 'Pronto para Emagrecer com Saúde?' THEN '✅ Emagrecimento'
    WHEN name = 'Qual é o seu Tipo de Fome?' THEN '✅ Tipo de Fome'
    WHEN name = 'Risco de Síndrome Metabólica' THEN '✅ Síndrome Metabólica'
    WHEN name = 'Teste de Retenção de Líquidos' THEN '✅ Retenção'
    WHEN name = 'Você conhece o seu corpo?' THEN '✅ Conhece Corpo'
    WHEN name = 'Você é mais disciplinado ou emocional com a comida?' THEN '✅ Disciplina/Emoção'
    WHEN name = 'Você está nutrido ou apenas alimentado?' THEN '✅ Nutrido/Alimentado'
    WHEN name = 'Você está se alimentando conforme sua rotina?' THEN '✅ Rotina'
    ELSE '❓ Verificar - possível extra'
  END as observacao
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
  AND is_active = true
  AND type = 'quiz'
ORDER BY 
  CASE 
    WHEN name LIKE '%Desafio%' THEN 1
    ELSE 2
  END,
  name;

-- 3. CONTAGEM POR CATEGORIA
SELECT 
  '📊 CONTAGEM' as info,
  COUNT(*) as total_quizzes,
  COUNT(CASE WHEN name LIKE '%Desafio%' THEN 1 END) as desafios,
  COUNT(CASE WHEN name NOT LIKE '%Desafio%' THEN 1 END) as quizzes_normais
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
  AND is_active = true
  AND type = 'quiz';


