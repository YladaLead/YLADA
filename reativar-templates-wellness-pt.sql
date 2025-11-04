-- =====================================================
-- REATIVAR TODOS OS TEMPLATES PT PARA WELLNESS
-- =====================================================

-- Reativar todos os templates PT que estiverem inativos
UPDATE templates_nutrition 
SET is_active = true
WHERE (language = 'pt' OR language LIKE 'pt%')
AND is_active = false;

-- Verificar resultado
SELECT 
  COUNT(*) as total_ativados,
  'Templates PT reativados' as info
FROM templates_nutrition
WHERE (language = 'pt' OR language LIKE 'pt%')
AND is_active = true;

-- Listar todos os templates PT ativos agora
SELECT 
  id,
  name,
  type,
  language,
  is_active
FROM templates_nutrition
WHERE (language = 'pt' OR language LIKE 'pt%')
AND is_active = true
ORDER BY type, name;

