-- ============================================
-- VERIFICAR CONTENT DOS TEMPLATES WELLNESS
-- Lista todos os templates Wellness e verifica se têm content JSONB
-- ============================================

-- 1. LISTAR TODOS OS TEMPLATES WELLNESS COM STATUS DO CONTENT
SELECT 
  id,
  name,
  slug,
  type,
  CASE 
    WHEN content IS NULL OR content::text = '{}' THEN '❌ Sem content'
    WHEN content::text LIKE '%"questions"%' THEN '✅ Content Quiz'
    WHEN content::text LIKE '%"fields"%' THEN '✅ Content Calculadora'
    WHEN content::text LIKE '%"items"%' THEN '✅ Content Planilha/Checklist'
    WHEN content::text LIKE '%"template_type"%' THEN '✅ Content criado'
    ELSE '⚠️ Content desconhecido'
  END as status_content,
  CASE 
    WHEN content IS NULL OR content::text = '{}' THEN NULL
    ELSE jsonb_pretty(content)
  END as content_preview
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
  AND is_active = true
ORDER BY 
  CASE 
    WHEN content IS NULL OR content::text = '{}' THEN 1
    ELSE 2
  END,
  type,
  name;

-- ============================================
-- 2. CONTAR TEMPLATES POR STATUS
-- ============================================
SELECT 
  COUNT(*) as total_templates,
  COUNT(CASE WHEN content IS NULL OR content::text = '{}' THEN 1 END) as sem_content,
  COUNT(CASE WHEN content::text LIKE '%"questions"%' THEN 1 END) as com_content_quiz,
  COUNT(CASE WHEN content::text LIKE '%"fields"%' THEN 1 END) as com_content_calculadora,
  COUNT(CASE WHEN content::text LIKE '%"items"%' THEN 1 END) as com_content_planilha,
  COUNT(CASE WHEN content::text LIKE '%"template_type"%' THEN 1 END) as com_content_geral
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
  AND is_active = true;

-- ============================================
-- 3. LISTAR TEMPLATES SEM CONTENT (PRIORIDADE)
-- ============================================
SELECT 
  name,
  slug,
  type,
  '❌ Precisa criar content' as status
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
  AND is_active = true
  AND (content IS NULL OR content::text = '{}')
ORDER BY type, name;

