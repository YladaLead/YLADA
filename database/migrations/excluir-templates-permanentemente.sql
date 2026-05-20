-- =====================================================
-- EXCLUIR TEMPLATES PERMANENTEMENTE
-- =====================================================
-- Este script exclui permanentemente os templates listados abaixo
-- ⚠️ ATENÇÃO: Esta operação é IRREVERSÍVEL!
-- =====================================================

-- Lista de templates a serem excluídos:
-- 1. Diário alimentar
-- 2. Infográfico
-- 3. Metas semanais
-- 4. Planejador semanal
-- 5. Rastreador de alimentos
-- 6. Receitas saudáveis
-- 7. Tabela bem estar diário
-- 8. Avaliação nutricional
-- 9. Diagnóstico de parasitose
-- 10. Formulário de recomendações
-- 11. Qual é seu tipo de intestino
-- 12. Quiz diagnóstico de parasitas
-- 13. Simulador de resultados
-- 14. Story interativo

-- =====================================================
-- 1. VERIFICAR QUAIS TEMPLATES SERÃO EXCLUÍDOS
-- =====================================================
SELECT 
  '🔍 TEMPLATES QUE SERÃO EXCLUÍDOS' as info,
  id,
  name as nome,
  type as tipo,
  profession,
  language,
  is_active,
  created_at
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
  AND (
    LOWER(name) LIKE '%diário alimentar%' OR
    LOWER(name) LIKE '%infográfico%' OR
    LOWER(name) LIKE '%metas semanais%' OR
    LOWER(name) LIKE '%planejador semanal%' OR
    LOWER(name) LIKE '%rastreador de alimentos%' OR
    LOWER(name) LIKE '%receitas saudáveis%' OR
    LOWER(name) LIKE '%tabela bem estar diário%' OR
    LOWER(name) LIKE '%tabela bem-estar diário%' OR
    LOWER(name) LIKE '%avaliação nutricional%' OR
    LOWER(name) LIKE '%diagnóstico de parasitose%' OR
    LOWER(name) LIKE '%diagnostico de parasitose%' OR
    LOWER(name) LIKE '%formulário de recomendações%' OR
    LOWER(name) LIKE '%formulario de recomendações%' OR
    LOWER(name) LIKE '%qual é seu tipo de intestino%' OR
    LOWER(name) LIKE '%qual é seu perfil de intestino%' OR
    LOWER(name) LIKE '%quiz diagnóstico de parasitas%' OR
    LOWER(name) LIKE '%quiz: diagnóstico de parasitas%' OR
    LOWER(name) LIKE '%simulador de resultados%' OR
    LOWER(name) LIKE '%story interativo%'
  )
ORDER BY name;

-- =====================================================
-- 2. VERIFICAR SE HÁ FERRAMENTAS USANDO ESSES TEMPLATES
-- =====================================================
-- ⚠️ IMPORTANTE: Se houver ferramentas usando esses templates,
-- elas precisarão ser excluídas ou atualizadas primeiro!
SELECT 
  '⚠️ FERRAMENTAS USANDO ESSES TEMPLATES' as info,
  ut.id as ferramenta_id,
  ut.title as nome_ferramenta,
  ut.template_id,
  t.name as nome_template,
  ut.user_id,
  up.nome_completo as usuario,
  ut.created_at as criado_em
FROM user_templates ut
INNER JOIN templates_nutrition t ON ut.template_id = t.id
INNER JOIN user_profiles up ON ut.user_id = up.user_id
WHERE t.profession = 'wellness'
  AND t.language = 'pt'
  AND (
    LOWER(t.name) LIKE '%diário alimentar%' OR
    LOWER(t.name) LIKE '%infográfico%' OR
    LOWER(t.name) LIKE '%metas semanais%' OR
    LOWER(t.name) LIKE '%planejador semanal%' OR
    LOWER(t.name) LIKE '%rastreador de alimentos%' OR
    LOWER(t.name) LIKE '%receitas saudáveis%' OR
    LOWER(t.name) LIKE '%tabela bem estar diário%' OR
    LOWER(t.name) LIKE '%tabela bem-estar diário%' OR
    LOWER(t.name) LIKE '%avaliação nutricional%' OR
    LOWER(t.name) LIKE '%diagnóstico de parasitose%' OR
    LOWER(t.name) LIKE '%diagnostico de parasitose%' OR
    LOWER(t.name) LIKE '%formulário de recomendações%' OR
    LOWER(t.name) LIKE '%formulario de recomendações%' OR
    LOWER(t.name) LIKE '%qual é seu tipo de intestino%' OR
    LOWER(t.name) LIKE '%qual é seu perfil de intestino%' OR
    LOWER(t.name) LIKE '%quiz diagnóstico de parasitas%' OR
    LOWER(t.name) LIKE '%quiz: diagnóstico de parasitas%' OR
    LOWER(t.name) LIKE '%simulador de resultados%' OR
    LOWER(t.name) LIKE '%story interativo%'
  )
ORDER BY t.name, ut.created_at;

-- =====================================================
-- 3. EXCLUIR FERRAMENTAS QUE USAM ESSES TEMPLATES
-- =====================================================
-- ⚠️ ATENÇÃO: Execute apenas se quiser excluir também as ferramentas!
-- DELETE FROM user_templates
-- WHERE template_id IN (
--   SELECT id
--   FROM templates_nutrition
--   WHERE profession = 'wellness'
--     AND language = 'pt'
--     AND (
--       LOWER(name) LIKE '%diário alimentar%' OR
--       LOWER(name) LIKE '%infográfico%' OR
--       LOWER(name) LIKE '%metas semanais%' OR
--       LOWER(name) LIKE '%planejador semanal%' OR
--       LOWER(name) LIKE '%rastreador de alimentos%' OR
--       LOWER(name) LIKE '%receitas saudáveis%' OR
--       LOWER(name) LIKE '%tabela bem estar diário%' OR
--       LOWER(name) LIKE '%tabela bem-estar diário%' OR
--       LOWER(name) LIKE '%avaliação nutricional%' OR
--       LOWER(name) LIKE '%diagnóstico de parasitose%' OR
--       LOWER(name) LIKE '%diagnostico de parasitose%' OR
--       LOWER(name) LIKE '%formulário de recomendações%' OR
--       LOWER(name) LIKE '%formulario de recomendações%' OR
--       LOWER(name) LIKE '%qual é seu tipo de intestino%' OR
--       LOWER(name) LIKE '%qual é seu perfil de intestino%' OR
--       LOWER(name) LIKE '%quiz diagnóstico de parasitas%' OR
--       LOWER(name) LIKE '%quiz: diagnóstico de parasitas%' OR
--       LOWER(name) LIKE '%simulador de resultados%' OR
--       LOWER(name) LIKE '%story interativo%'
--     )
-- );

-- =====================================================
-- 4. EXCLUIR TEMPLATES PERMANENTEMENTE
-- =====================================================
-- ⚠️ ATENÇÃO: Esta operação é IRREVERSÍVEL!
-- Execute apenas após revisar as queries acima!
DELETE FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
  AND (
    LOWER(name) LIKE '%diário alimentar%' OR
    LOWER(name) LIKE '%infográfico%' OR
    LOWER(name) LIKE '%metas semanais%' OR
    LOWER(name) LIKE '%planejador semanal%' OR
    LOWER(name) LIKE '%rastreador de alimentos%' OR
    LOWER(name) LIKE '%receitas saudáveis%' OR
    LOWER(name) LIKE '%tabela bem estar diário%' OR
    LOWER(name) LIKE '%tabela bem-estar diário%' OR
    LOWER(name) LIKE '%avaliação nutricional%' OR
    LOWER(name) LIKE '%diagnóstico de parasitose%' OR
    LOWER(name) LIKE '%diagnostico de parasitose%' OR
    LOWER(name) LIKE '%formulário de recomendações%' OR
    LOWER(name) LIKE '%formulario de recomendações%' OR
    LOWER(name) LIKE '%qual é seu tipo de intestino%' OR
    LOWER(name) LIKE '%qual é seu perfil de intestino%' OR
    LOWER(name) LIKE '%quiz diagnóstico de parasitas%' OR
    LOWER(name) LIKE '%quiz: diagnóstico de parasitas%' OR
    LOWER(name) LIKE '%simulador de resultados%' OR
    LOWER(name) LIKE '%story interativo%'
  );

-- =====================================================
-- 5. VERIFICAÇÃO FINAL
-- =====================================================
-- Verificar quantos templates restam após exclusão
SELECT 
  '✅ RESULTADO FINAL' as info,
  COUNT(*) as total_templates_wellness,
  COUNT(CASE WHEN type = 'calculadora' THEN 1 END) as calculadoras,
  COUNT(CASE WHEN type = 'quiz' THEN 1 END) as quizzes,
  COUNT(CASE WHEN type = 'planilha' THEN 1 END) as planilhas,
  COUNT(CASE WHEN is_active = true THEN 1 END) as ativos,
  COUNT(CASE WHEN is_active = false THEN 1 END) as inativos
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt';

-- Listar todos os templates restantes
SELECT 
  '📋 TEMPLATES RESTANTES' as info,
  name as nome,
  type as tipo,
  is_active as ativo,
  created_at as criado_em
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
ORDER BY type, name;

