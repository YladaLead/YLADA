-- =====================================================
-- LIMPAR DUPLICATAS DE TEMPLATES WELLNESS
-- =====================================================
-- Este script identifica e remove templates duplicados,
-- mantendo apenas uma versão de cada template
-- =====================================================

-- 1. VERIFICAR DUPLICATAS ANTES DE LIMPAR
SELECT 
  '🔍 DUPLICATAS ENCONTRADAS' as info,
  name as nome,
  type as tipo,
  COUNT(*) as quantidade,
  STRING_AGG(id::text, ', ') as ids,
  STRING_AGG(created_at::text, ', ') as datas_criacao
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
GROUP BY name, type
HAVING COUNT(*) > 1
ORDER BY quantidade DESC, name;

-- 2. VER QUANTOS TEMPLATES ÚNICOS TEMOS
SELECT 
  '📊 TEMPLATES ÚNICOS' as info,
  COUNT(DISTINCT name) as templates_unicos,
  COUNT(*) as total_registros,
  COUNT(*) - COUNT(DISTINCT name) as duplicatas_a_remover
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt';

-- 3. IDENTIFICAR QUAIS DUPLICATAS MANTER (manter o mais antigo)
WITH duplicatas AS (
  SELECT 
    name,
    type,
    MIN(created_at) as data_mais_antiga,
    MIN(id) as id_manter
  FROM templates_nutrition
  WHERE profession = 'wellness'
    AND language = 'pt'
  GROUP BY name, type
  HAVING COUNT(*) > 1
)
SELECT 
  '✅ TEMPLATES QUE SERÃO MANTIDOS' as info,
  t.name as nome,
  t.type as tipo,
  t.id as id_manter,
  t.created_at as data_criacao
FROM templates_nutrition t
INNER JOIN duplicatas d ON t.name = d.name AND t.type = d.type
WHERE t.profession = 'wellness'
  AND t.language = 'pt'
  AND t.id = d.id_manter
ORDER BY t.name, t.type;

-- 4. IDENTIFICAR QUAIS DUPLICATAS SERÃO REMOVIDAS
WITH duplicatas AS (
  SELECT 
    name,
    type,
    MIN(created_at) as data_mais_antiga,
    MIN(id) as id_manter
  FROM templates_nutrition
  WHERE profession = 'wellness'
    AND language = 'pt'
  GROUP BY name, type
  HAVING COUNT(*) > 1
)
SELECT 
  '🗑️ TEMPLATES QUE SERÃO REMOVIDOS' as info,
  t.name as nome,
  t.type as tipo,
  t.id as id_remover,
  t.created_at as data_criacao
FROM templates_nutrition t
INNER JOIN duplicatas d ON t.name = d.name AND t.type = d.type
WHERE t.profession = 'wellness'
  AND t.language = 'pt'
  AND t.id != d.id_manter
ORDER BY t.name, t.type;

-- 5. REMOVER DUPLICATAS (manter apenas o mais antigo de cada)
-- ⚠️ ATENÇÃO: Execute apenas após revisar as queries acima!
WITH duplicatas AS (
  SELECT 
    name,
    type,
    MIN(created_at) as data_mais_antiga,
    MIN(id) as id_manter
  FROM templates_nutrition
  WHERE profession = 'wellness'
    AND language = 'pt'
  GROUP BY name, type
  HAVING COUNT(*) > 1
)
DELETE FROM templates_nutrition
WHERE id IN (
  SELECT t.id
  FROM templates_nutrition t
  INNER JOIN duplicatas d ON t.name = d.name AND t.type = d.type
  WHERE t.profession = 'wellness'
    AND t.language = 'pt'
    AND t.id != d.id_manter
);

-- 6. VERIFICAÇÃO FINAL APÓS LIMPEZA
SELECT 
  '✅ RESULTADO FINAL' as info,
  COUNT(*) as total_templates,
  COUNT(DISTINCT name) as templates_unicos,
  COUNT(CASE WHEN type = 'calculadora' THEN 1 END) as calculadoras,
  COUNT(CASE WHEN type = 'quiz' THEN 1 END) as quizzes,
  COUNT(CASE WHEN type = 'planilha' THEN 1 END) as planilhas,
  COUNT(CASE WHEN is_active = true THEN 1 END) as ativos,
  COUNT(CASE WHEN is_active = false THEN 1 END) as inativos
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt';

-- 7. LISTAR TODOS OS TEMPLATES ÚNICOS RESTANTES
SELECT 
  name as nome,
  type as tipo,
  objective as objetivo,
  is_active as ativo,
  created_at as criado_em
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
ORDER BY type, name;

-- 8. VERIFICAR SE AINDA HÁ DUPLICATAS
SELECT 
  '🔍 VERIFICAÇÃO FINAL DE DUPLICATAS' as info,
  name as nome,
  type as tipo,
  COUNT(*) as quantidade
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
GROUP BY name, type
HAVING COUNT(*) > 1;
-- Se esta query retornar 0 linhas, todas as duplicatas foram removidas!

