-- ============================================
-- CORRIGIR CONTENT DAS PLANILHAS DETOX (WELLNESS)
-- Restaura o content correto para planilhas que foram atualizadas incorretamente
-- ============================================

-- ⚠️ IMPORTANTE:
-- Este script corrige o content das planilhas "Checklist Detox" e "Cardápio Detox"
-- que foram atualizadas incorretamente pelo script do Quiz Detox

-- ============================================
-- CORRIGIR CHECKLIST DETOX
-- ============================================
UPDATE templates_nutrition
SET 
  content = '{
    "template_type": "checklist",
    "profession": "wellness",
    "items": 10
  }'::jsonb,
  updated_at = NOW()
WHERE profession = 'wellness'
  AND language = 'pt'
  AND type = 'planilha'
  AND (
    LOWER(name) LIKE '%checklist detox%' OR
    LOWER(name) = 'checklist detox'
  );

-- ============================================
-- CORRIGIR CARDÁPIO DETOX
-- ============================================
UPDATE templates_nutrition
SET 
  content = '{
    "template_type": "spreadsheet",
    "profession": "wellness",
    "sections": ["cafe-da-manha", "almoco", "jantar", "lanches"]
  }'::jsonb,
  updated_at = NOW()
WHERE profession = 'wellness'
  AND language = 'pt'
  AND type = 'planilha'
  AND (
    LOWER(name) LIKE '%cardápio detox%' OR
    LOWER(name) LIKE '%cardapio detox%' OR
    LOWER(name) = 'cardápio detox' OR
    LOWER(name) = 'cardapio detox'
  );

-- ============================================
-- VERIFICAR RESULTADO
-- ============================================
SELECT 
  name, 
  slug, 
  type, 
  content->>'template_type' as template_type,
  CASE 
    WHEN type = 'quiz' AND content->>'template_type' = 'quiz' THEN '✅ Content correto (Quiz)'
    WHEN type = 'planilha' AND content->>'template_type' = 'checklist' THEN '✅ Content correto (Checklist)'
    WHEN type = 'planilha' AND content->>'template_type' = 'spreadsheet' THEN '✅ Content correto (Planilha)'
    WHEN type = 'planilha' AND content->>'template_type' = 'quiz' THEN '❌ Content incorreto (deveria ser checklist/spreadsheet)'
    ELSE '⚠️ Verificar manualmente'
  END as status_content
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
  AND (
    LOWER(name) LIKE '%detox%'
  )
ORDER BY type, name;

