-- ===========================================================
-- ATIVAR TEMPLATES COACH
-- 
-- Este script ativa todos os templates Coach para que a área
-- funcione corretamente com diagnósticos independentes
-- ===========================================================

BEGIN;

-- Verificar templates Coach antes da ativação
SELECT 
  'ANTES DA ATIVAÇÃO' as status,
  COUNT(*) as total_templates,
  COUNT(CASE WHEN is_active = true THEN 1 END) as ativos,
  COUNT(CASE WHEN is_active = false THEN 1 END) as inativos
FROM templates_nutrition
WHERE profession = 'coach'
  AND language = 'pt';

-- Ativar todos os templates Coach
UPDATE templates_nutrition
SET 
  is_active = true,
  updated_at = NOW()
WHERE profession = 'coach'
  AND language = 'pt'
  AND is_active = false;

-- Verificar templates Coach após a ativação
SELECT 
  'APÓS A ATIVAÇÃO' as status,
  COUNT(*) as total_templates,
  COUNT(CASE WHEN is_active = true THEN 1 END) as ativos,
  COUNT(CASE WHEN is_active = false THEN 1 END) as inativos
FROM templates_nutrition
WHERE profession = 'coach'
  AND language = 'pt';

-- Listar todos os templates Coach ativos
SELECT 
  'TEMPLATES COACH ATIVOS' as categoria,
  id,
  name,
  slug,
  type,
  is_active,
  created_at
FROM templates_nutrition
WHERE profession = 'coach'
  AND language = 'pt'
  AND is_active = true
ORDER BY name;

COMMIT;

-- ===========================================================
-- RESULTADO ESPERADO:
-- - Todos os 8 templates Coach devem ficar ativos
-- - Coach terá diagnósticos independentes funcionando
-- ===========================================================
