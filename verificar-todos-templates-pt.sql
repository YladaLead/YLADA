-- =====================================================
-- VERIFICAR TODOS OS TEMPLATES PT (ativos e inativos)
-- Para identificar o que aconteceu com os 38 templates
-- =====================================================

-- 1. Contar todos os templates PT (ativos e inativos)
SELECT 
  COUNT(*) as total_pt,
  COUNT(*) FILTER (WHERE is_active = true) as ativos,
  COUNT(*) FILTER (WHERE is_active = false) as inativos
FROM templates_nutrition
WHERE language = 'pt' OR language LIKE 'pt%';

-- 2. Listar TODOS os templates PT (sem filtrar is_active)
SELECT 
  id,
  name,
  type,
  language,
  profession,
  is_active,
  created_at,
  updated_at
FROM templates_nutrition
WHERE language = 'pt' OR language LIKE 'pt%'
ORDER BY is_active DESC, name;

-- 3. Verificar se há templates com profession diferente
SELECT 
  COALESCE(profession, 'NULL') as profession_status,
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE is_active = true) as ativos,
  COUNT(*) FILTER (WHERE is_active = false) as inativos
FROM templates_nutrition
WHERE language = 'pt' OR language LIKE 'pt%'
GROUP BY profession_status
ORDER BY profession_status;

-- 4. Reativar TODOS os templates PT que estiverem inativos
UPDATE templates_nutrition 
SET is_active = true
WHERE (language = 'pt' OR language LIKE 'pt%')
AND is_active = false;

-- 5. Remover profession='nutri' dos templates PT (deixar NULL para aparecerem em Wellness)
UPDATE templates_nutrition 
SET profession = NULL
WHERE (language = 'pt' OR language LIKE 'pt%')
AND profession = 'nutri';

-- 6. Verificar resultado final
SELECT 
  COUNT(*) as total_pt_ativos,
  'Templates PT ativos após correção' as info
FROM templates_nutrition
WHERE (language = 'pt' OR language LIKE 'pt%')
AND is_active = true;

