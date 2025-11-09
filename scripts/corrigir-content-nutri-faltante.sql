-- ============================================
-- CORRIGIR CONTENT NUTRI FALTANTE
-- Adicionar "profession": "nutri" nos templates que não têm
-- ============================================

-- ============================================
-- 1. IDENTIFICAR TEMPLATES SEM "profession": "nutri"
-- ============================================
SELECT 
  name,
  slug,
  type,
  CASE 
    WHEN content::text LIKE '%"profession": "nutri"%' THEN '✅ Tem profession'
    WHEN content::text LIKE '%template_type%' THEN '⚠️ Tem content mas sem profession'
    ELSE '❌ Sem content'
  END as status
FROM templates_nutrition
WHERE profession = 'nutri'
  AND language = 'pt'
  AND (content::text NOT LIKE '%"profession": "nutri"%' OR content IS NULL)
ORDER BY type, name;

-- ============================================
-- 2. ADICIONAR "profession": "nutri" NOS TEMPLATES QUE FALTAM
-- ============================================

-- Atualizar templates que têm content mas não têm "profession": "nutri"
UPDATE templates_nutrition
SET 
  content = content || '{"profession": "nutri"}'::jsonb,
  updated_at = NOW()
WHERE profession = 'nutri'
  AND language = 'pt'
  AND content IS NOT NULL
  AND content::text NOT LIKE '%"profession": "nutri"%'
  AND content::text LIKE '%template_type%';

-- ============================================
-- 3. VERIFICAR RESULTADO
-- ============================================
SELECT 
  COUNT(*) as total_templates,
  COUNT(CASE WHEN content::text LIKE '%"profession": "nutri"%' THEN 1 END) as com_content_nutri,
  COUNT(CASE WHEN content::text LIKE '%template_type%' THEN 1 END) as com_content_geral,
  COUNT(CASE WHEN content IS NULL OR content::text = '{}' THEN 1 END) as sem_content
FROM templates_nutrition
WHERE profession = 'nutri'
  AND language = 'pt';

-- ============================================
-- 4. LISTAR TODOS OS TEMPLATES COM STATUS
-- ============================================
SELECT 
  name,
  type,
  slug,
  CASE 
    WHEN content::text LIKE '%"profession": "nutri"%' THEN '✅ Content Nutri específico'
    WHEN content::text LIKE '%template_type%' THEN '⚠️ Content criado (sem profession)'
    ELSE '❌ Content vazio'
  END as status_content
FROM templates_nutrition
WHERE profession = 'nutri'
  AND language = 'pt'
ORDER BY 
  CASE 
    WHEN content::text LIKE '%"profession": "nutri"%' THEN 1
    WHEN content::text LIKE '%template_type%' THEN 2
    ELSE 3
  END,
  type, 
  name;

