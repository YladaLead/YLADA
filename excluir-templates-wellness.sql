-- =====================================================
-- EXCLUIR TEMPLATES WELLNESS DEFINITIVAMENTE
-- =====================================================
-- Este script exclui permanentemente os templates listados
-- da área wellness.
-- 
-- ATENÇÃO: Esta operação é IRREVERSÍVEL!
-- Execute apenas se tiver certeza.
-- =====================================================

-- =====================================================
-- 1. VERIFICAR TEMPLATES QUE SERÃO EXCLUÍDOS
-- =====================================================
-- Primeiro, vamos listar os templates que correspondem aos nomes fornecidos
-- para verificar antes de excluir

SELECT 
  id,
  name,
  type,
  profession,
  language,
  is_active,
  created_at
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
  AND (
    -- Planilhas
    LOWER(name) LIKE '%cardapio%detox%' OR
    LOWER(name) LIKE '%cardápio%detox%' OR
    name = 'Cardápio Detox' OR
    LOWER(name) LIKE '%diario%alimentar%' OR
    LOWER(name) LIKE '%diário%alimentar%' OR
    name = 'Diário Alimentar' OR
    LOWER(name) LIKE '%infografico%' OR
    LOWER(name) LIKE '%infográfico%' OR
    name = 'Infográfico' OR
    LOWER(name) LIKE '%metas%semanais%' OR
    name = 'Metas Semanais' OR
    LOWER(name) LIKE '%planejador%semanal%' OR
    LOWER(name) LIKE '%planejdaro%semanal%' OR
    name = 'Planejador Semanal' OR
    LOWER(name) LIKE '%receitas%saudaveis%' OR
    LOWER(name) LIKE '%receitas%saudáveis%' OR
    LOWER(name) LIKE '%receistas%saudaveis%' OR
    name = 'Receitas Saudáveis' OR
    -- Quizzes/Diagnósticos
    LOWER(name) LIKE '%avaliacao%nutricional%' OR
    LOWER(name) LIKE '%avaliação%nutricional%' OR
    name = 'Avaliação Nutricional' OR
    LOWER(name) LIKE '%formulario%recomendacoes%' OR
    LOWER(name) LIKE '%formulário%recomendações%' OR
    LOWER(name) LIKE '%formlari%recomendacoes%' OR
    name = 'Formulário de Recomendações' OR
    LOWER(name) LIKE '%qual%perfil%intestino%' OR
    LOWER(name) LIKE '%qual%é%seu%perfil%de%intestino%' OR
    name = 'Qual é seu perfil de intestino?' OR
    LOWER(name) LIKE '%quiz%de%bem%estar%' OR
    LOWER(name) LIKE '%quiz%de%bem-estar%' OR
    name = 'Quiz de Bem-Estar' OR
    LOWER(name) LIKE '%quiz%perfil%nutricional%' OR
    LOWER(name) LIKE '%quiz%perfil%nutricionaç%' OR
    name = 'Quiz de Perfil Nutricional' OR
    LOWER(name) LIKE '%diagnostico%parasitose%' OR
    LOWER(name) LIKE '%diagnóstico%parasitose%' OR
    name = 'Diagnóstico de Parasitose' OR
    name = 'Quiz: Diagnóstico de Parasitas' OR
    LOWER(name) LIKE '%quiz%perfil%bem%estar%' OR
    LOWER(name) LIKE '%quiz:%perfil%do%bem%estar%' OR
    name = 'Quiz: Perfil de Bem-Estar' OR
    LOWER(name) LIKE '%quiz%detox%' OR
    name = 'Quiz Detox' OR
    LOWER(name) LIKE '%story%interativo%' OR
    LOWER(name) LIKE '%story%interativo%' OR
    name = 'Story Interativo'
  )
ORDER BY name;

-- =====================================================
-- 2. EXCLUIR TEMPLATES DEFINITIVAMENTE
-- =====================================================
-- ATENÇÃO: Esta operação é IRREVERSÍVEL!
-- Comente a linha abaixo se quiser apenas verificar sem excluir

DELETE FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
  AND (
    -- Planilhas
    LOWER(name) LIKE '%cardapio%detox%' OR
    LOWER(name) LIKE '%cardápio%detox%' OR
    name = 'Cardápio Detox' OR
    LOWER(name) LIKE '%diario%alimentar%' OR
    LOWER(name) LIKE '%diário%alimentar%' OR
    name = 'Diário Alimentar' OR
    LOWER(name) LIKE '%infografico%' OR
    LOWER(name) LIKE '%infográfico%' OR
    name = 'Infográfico' OR
    LOWER(name) LIKE '%metas%semanais%' OR
    name = 'Metas Semanais' OR
    LOWER(name) LIKE '%planejador%semanal%' OR
    LOWER(name) LIKE '%planejdaro%semanal%' OR
    name = 'Planejador Semanal' OR
    LOWER(name) LIKE '%receitas%saudaveis%' OR
    LOWER(name) LIKE '%receitas%saudáveis%' OR
    LOWER(name) LIKE '%receistas%saudaveis%' OR
    name = 'Receitas Saudáveis' OR
    -- Quizzes/Diagnósticos
    LOWER(name) LIKE '%avaliacao%nutricional%' OR
    LOWER(name) LIKE '%avaliação%nutricional%' OR
    name = 'Avaliação Nutricional' OR
    LOWER(name) LIKE '%formulario%recomendacoes%' OR
    LOWER(name) LIKE '%formulário%recomendações%' OR
    LOWER(name) LIKE '%formlari%recomendacoes%' OR
    name = 'Formulário de Recomendações' OR
    LOWER(name) LIKE '%qual%perfil%intestino%' OR
    LOWER(name) LIKE '%qual%é%seu%perfil%de%intestino%' OR
    name = 'Qual é seu perfil de intestino?' OR
    LOWER(name) LIKE '%quiz%de%bem%estar%' OR
    LOWER(name) LIKE '%quiz%de%bem-estar%' OR
    name = 'Quiz de Bem-Estar' OR
    LOWER(name) LIKE '%quiz%perfil%nutricional%' OR
    LOWER(name) LIKE '%quiz%perfil%nutricionaç%' OR
    name = 'Quiz de Perfil Nutricional' OR
    LOWER(name) LIKE '%diagnostico%parasitose%' OR
    LOWER(name) LIKE '%diagnóstico%parasitose%' OR
    name = 'Diagnóstico de Parasitose' OR
    name = 'Quiz: Diagnóstico de Parasitas' OR
    LOWER(name) LIKE '%quiz%perfil%bem%estar%' OR
    LOWER(name) LIKE '%quiz:%perfil%do%bem%estar%' OR
    name = 'Quiz: Perfil de Bem-Estar' OR
    LOWER(name) LIKE '%quiz%detox%' OR
    name = 'Quiz Detox' OR
    LOWER(name) LIKE '%story%interativo%' OR
    LOWER(name) LIKE '%story%interativo%' OR
    name = 'Story Interativo'
  );

-- =====================================================
-- 3. VERIFICAR RESULTADO DA EXCLUSÃO
-- =====================================================
-- Contar quantos templates wellness restaram

SELECT 
  COUNT(*) as total_templates_wellness,
  COUNT(CASE WHEN type = 'calculadora' THEN 1 END) as calculadoras,
  COUNT(CASE WHEN type = 'quiz' THEN 1 END) as quizzes,
  COUNT(CASE WHEN type = 'planilha' THEN 1 END) as planilhas
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
  AND is_active = true;

-- =====================================================
-- 4. LISTAR TEMPLATES RESTANTES (OPCIONAL)
-- =====================================================
-- Descomente para ver todos os templates wellness restantes

-- SELECT 
--   id,
--   name,
--   type,
--   objective,
--   is_active
-- FROM templates_nutrition
-- WHERE profession = 'wellness'
--   AND language = 'pt'
-- ORDER BY type, name;





