-- =====================================================
-- SCRIPT 06: VERIFICAÇÃO FINAL DA DUPLICAÇÃO
-- =====================================================
-- Execute após todas as duplicações para validar
-- =====================================================

-- 1. Contagem geral por área
SELECT 
  profession,
  COUNT(*) as total_templates,
  SUM(CASE WHEN is_active THEN 1 ELSE 0 END) as ativos,
  SUM(CASE WHEN NOT is_active THEN 1 ELSE 0 END) as inativos
FROM templates_nutrition
WHERE profession IN ('nutri', 'wellness', 'coach', 'nutra')
GROUP BY profession
ORDER BY profession;

-- 2. Contagem por tipo e área
SELECT 
  profession,
  type,
  COUNT(*) as total
FROM templates_nutrition
WHERE profession IN ('nutri', 'wellness', 'coach', 'nutra')
GROUP BY profession, type
ORDER BY profession, type;

-- 3. Verificar se todos os templates Nutri foram duplicados
-- (deve ter o mesmo número em cada área)
SELECT 
  'nutri' as area,
  COUNT(*) as total
FROM templates_nutrition
WHERE profession = 'nutri'
UNION ALL
SELECT 
  'wellness' as area,
  COUNT(*) as total
FROM templates_nutrition
WHERE profession = 'wellness'
UNION ALL
SELECT 
  'coach' as area,
  COUNT(*) as total
FROM templates_nutrition
WHERE profession = 'coach'
UNION ALL
SELECT 
  'nutra' as area,
  COUNT(*) as total
FROM templates_nutrition
WHERE profession = 'nutra';

-- 4. Listar templates que estão em Nutri mas não em outras áreas
-- (para identificar possíveis falhas na duplicação)

-- Templates Nutri que não estão em Wellness
SELECT 
  'Faltando em Wellness' as problema,
  name,
  type,
  language
FROM templates_nutrition
WHERE profession = 'nutri'
AND NOT EXISTS (
  SELECT 1 FROM templates_nutrition t2
  WHERE t2.name = templates_nutrition.name
  AND t2.type = templates_nutrition.type
  AND t2.language = templates_nutrition.language
  AND t2.profession = 'wellness'
);

-- Templates Nutri que não estão em Coach
SELECT 
  'Faltando em Coach' as problema,
  name,
  type,
  language
FROM templates_nutrition
WHERE profession = 'nutri'
AND NOT EXISTS (
  SELECT 1 FROM templates_nutrition t2
  WHERE t2.name = templates_nutrition.name
  AND t2.type = templates_nutrition.type
  AND t2.language = templates_nutrition.language
  AND t2.profession = 'coach'
);

-- Templates Nutri que não estão em Nutra
SELECT 
  'Faltando em Nutra' as problema,
  name,
  type,
  language
FROM templates_nutrition
WHERE profession = 'nutri'
AND NOT EXISTS (
  SELECT 1 FROM templates_nutrition t2
  WHERE t2.name = templates_nutrition.name
  AND t2.type = templates_nutrition.type
  AND t2.language = templates_nutrition.language
  AND t2.profession = 'nutra'
);

-- 5. Verificar exemplo de template completo (todas as áreas)
SELECT 
  name,
  type,
  profession,
  is_active,
  created_at
FROM templates_nutrition
WHERE name = 'Checklist Alimentar'  -- Exemplo
ORDER BY profession;

-- ✅ Verificação concluída!
-- Se todos os números coincidirem, a duplicação foi bem-sucedida.

