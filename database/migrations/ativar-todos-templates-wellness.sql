-- =====================================================
-- ATIVAR TODOS OS TEMPLATES WELLNESS QUE DEVEM ESTAR ATIVOS
-- =====================================================
-- Este script ativa todos os templates Wellness que estão inativos
-- Use com cuidado - pode ativar templates que foram desativados intencionalmente
-- =====================================================

-- 1. VER QUANTOS TEMPLATES ESTÃO INATIVOS
SELECT 
  '📊 TEMPLATES INATIVOS' as info,
  COUNT(*) as total_inativos,
  COUNT(CASE WHEN slug IS NULL OR slug = '' THEN 1 END) as sem_slug,
  COUNT(CASE WHEN slug LIKE '-%' OR slug LIKE '%-' THEN 1 END) as slugs_malformados
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
  AND is_active = false;

-- 2. LISTAR TEMPLATES INATIVOS
SELECT 
  id,
  name,
  slug,
  type,
  is_active,
  created_at,
  updated_at
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
  AND is_active = false
ORDER BY type, name;

-- 3. ATIVAR TODOS OS TEMPLATES INATIVOS
-- ⚠️ ATENÇÃO: Isso vai ativar TODOS os templates inativos
-- Execute apenas se tiver certeza que quer reativar todos
UPDATE templates_nutrition
SET is_active = true,
    updated_at = NOW()
WHERE profession = 'wellness'
  AND language = 'pt'
  AND is_active = false;

-- 4. VERIFICAÇÃO FINAL
SELECT 
  '✅ RESULTADO FINAL' as status,
  COUNT(*) as total_templates,
  COUNT(CASE WHEN is_active = true THEN 1 END) as ativos,
  COUNT(CASE WHEN is_active = false THEN 1 END) as inativos
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt';

