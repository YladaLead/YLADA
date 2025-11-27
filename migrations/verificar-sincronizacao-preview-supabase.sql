-- =====================================================
-- VERIFICAR SINCRONIZAÇÃO: PREVIEW vs SUPABASE
-- Este script verifica exatamente o que a API /api/coach/templates
-- está buscando e retornando para o preview
-- =====================================================

-- =====================================================
-- 1. TEMPLATES QUE A API BUSCA (mesmos filtros da API)
-- =====================================================
SELECT 
  '📊 TEMPLATES QUE APARECEM NO PREVIEW' as info,
  COUNT(*) as total_templates_preview
FROM coach_templates_nutrition
WHERE is_active = true
  AND profession = 'coach'
  AND language = 'pt';

-- =====================================================
-- 2. LISTAR TODOS OS TEMPLATES QUE APARECEM NO PREVIEW
-- (exatamente como a API retorna)
-- =====================================================
SELECT 
  id,
  name as nome,
  slug,
  type as tipo,
  description as descricao,
  objective as objetivo,
  profession,
  language,
  is_active,
  CASE 
    WHEN is_active = true AND profession = 'coach' AND language = 'pt' 
    THEN '✅ APARECE NO PREVIEW'
    ELSE '❌ NÃO APARECE'
  END as status_preview
FROM coach_templates_nutrition
WHERE is_active = true
  AND profession = 'coach'
  AND language = 'pt'
ORDER BY type, name;

-- =====================================================
-- 3. VERIFICAR TEMPLATES COM PROBLEMAS
-- =====================================================
-- Templates que estão inativos
SELECT 
  '❌ TEMPLATES INATIVOS (não aparecem no preview)' as info,
  name as nome,
  slug,
  is_active,
  profession,
  language
FROM coach_templates_nutrition
WHERE profession = 'coach'
  AND language = 'pt'
  AND is_active = false
ORDER BY name;

-- Templates com profession diferente
SELECT 
  '⚠️ TEMPLATES COM PROFESSION DIFERENTE' as info,
  name as nome,
  slug,
  profession,
  language,
  is_active
FROM coach_templates_nutrition
WHERE language = 'pt'
  AND (profession IS NULL OR profession != 'coach')
  AND is_active = true
ORDER BY name;

-- Templates com language diferente
SELECT 
  '⚠️ TEMPLATES COM LANGUAGE DIFERENTE' as info,
  name as nome,
  slug,
  profession,
  language,
  is_active
FROM coach_templates_nutrition
WHERE profession = 'coach'
  AND (language IS NULL OR language != 'pt')
  AND is_active = true
ORDER BY name;

-- Templates sem nome (seriam filtrados no frontend)
SELECT 
  '⚠️ TEMPLATES SEM NOME (seriam filtrados no frontend)' as info,
  id,
  slug,
  name as nome,
  is_active,
  profession,
  language
FROM coach_templates_nutrition
WHERE is_active = true
  AND profession = 'coach'
  AND language = 'pt'
  AND (name IS NULL OR name = '' OR TRIM(name) = '')
ORDER BY slug;

-- =====================================================
-- 4. RESUMO FINAL
-- =====================================================
SELECT 
  '📋 RESUMO FINAL' as info,
  COUNT(*) FILTER (WHERE is_active = true AND profession = 'coach' AND language = 'pt') as total_no_preview,
  COUNT(*) FILTER (WHERE is_active = false AND profession = 'coach' AND language = 'pt') as inativos_coach_pt,
  COUNT(*) FILTER (WHERE profession = 'coach' AND language = 'pt' AND (name IS NULL OR name = '')) as sem_nome,
  COUNT(*) FILTER (WHERE profession = 'coach' AND language = 'pt') as total_coach_pt
FROM coach_templates_nutrition;

