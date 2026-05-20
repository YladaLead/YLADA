-- =====================================================
-- DIAGNÓSTICO COMPLETO: LISTAR TODOS OS TEMPLATES WELLNESS
-- =====================================================
-- Este script lista TODOS os templates Wellness que existem no banco
-- independente de estarem ativos ou inativos
-- =====================================================

-- 1. CONTAGEM GERAL
SELECT 
  '📊 ESTATÍSTICAS GERAIS' as info,
  COUNT(*) as total_templates,
  COUNT(CASE WHEN is_active = true THEN 1 END) as ativos,
  COUNT(CASE WHEN is_active = false THEN 1 END) as inativos,
  COUNT(CASE WHEN slug IS NULL OR slug = '' THEN 1 END) as sem_slug,
  COUNT(CASE WHEN slug LIKE '-%' OR slug LIKE '%-' THEN 1 END) as slugs_malformados,
  COUNT(CASE WHEN name IS NULL OR name = '' THEN 1 END) as sem_nome
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt';

-- 2. LISTAR TODOS OS TEMPLATES (ATIVOS E INATIVOS)
-- Ordenado por data de criação (mais antigos primeiro)
SELECT 
  id,
  name as nome,
  slug,
  type as tipo,
  is_active as ativo,
  created_at as criado_em,
  updated_at as atualizado_em,
  CASE 
    WHEN is_active = false THEN '❌ INATIVO'
    WHEN slug IS NULL OR slug = '' THEN '⚠️ SEM SLUG'
    WHEN slug LIKE '-%' OR slug LIKE '%-' THEN '⚠️ SLUG MALFORMADO'
    ELSE '✅ OK'
  END as status
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
ORDER BY created_at ASC, name ASC;

-- 3. CONTAGEM POR TIPO
SELECT 
  type as tipo,
  COUNT(*) as total,
  COUNT(CASE WHEN is_active = true THEN 1 END) as ativos,
  COUNT(CASE WHEN is_active = false THEN 1 END) as inativos
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
GROUP BY type
ORDER BY type;

-- 4. TEMPLATES INATIVOS (que podem estar escondidos)
SELECT 
  id,
  name as nome,
  slug,
  type as tipo,
  created_at as criado_em,
  updated_at as atualizado_em,
  CASE 
    WHEN slug IS NULL OR slug = '' THEN '⚠️ SEM SLUG'
    WHEN slug LIKE '-%' OR slug LIKE '%-' THEN '⚠️ SLUG MALFORMADO'
    ELSE '✅ SLUG OK'
  END as status_slug
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
  AND is_active = false
ORDER BY created_at ASC, name ASC;

-- 5. TEMPLATES SEM SLUG OU COM SLUG MALFORMADO
SELECT 
  id,
  name as nome,
  slug,
  type as tipo,
  is_active as ativo,
  CASE 
    WHEN slug IS NULL OR slug = '' THEN '❌ SEM SLUG'
    WHEN slug LIKE '-%' OR slug LIKE '%-' THEN '⚠️ SLUG MALFORMADO'
  END as problema
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
  AND (slug IS NULL OR slug = '' OR slug LIKE '-%' OR slug LIKE '%-')
ORDER BY type, name;

-- 6. VERIFICAR SE HÁ TEMPLATES DUPLICADOS (mesmo nome)
SELECT 
  name as nome,
  COUNT(*) as quantidade,
  STRING_AGG(id::text, ', ') as ids,
  STRING_AGG(CASE WHEN is_active THEN 'ATIVO' ELSE 'INATIVO' END, ', ') as status
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
GROUP BY name
HAVING COUNT(*) > 1
ORDER BY quantidade DESC, name;

-- 7. TEMPLATES CRIADOS HOJE (para ver o que foi modificado recentemente)
SELECT 
  id,
  name as nome,
  slug,
  type as tipo,
  is_active as ativo,
  created_at as criado_em,
  updated_at as atualizado_em
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
  AND (
    DATE(created_at) = CURRENT_DATE 
    OR DATE(updated_at) = CURRENT_DATE
  )
ORDER BY updated_at DESC, created_at DESC;

-- 8. HISTÓRICO DE MODIFICAÇÕES (últimos 7 dias)
SELECT 
  DATE(updated_at) as data_modificacao,
  COUNT(*) as templates_modificados,
  COUNT(CASE WHEN is_active = true THEN 1 END) as ativos,
  COUNT(CASE WHEN is_active = false THEN 1 END) as inativos
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
  AND updated_at >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY DATE(updated_at)
ORDER BY data_modificacao DESC;

-- 9. VERIFICAR SE HÁ TEMPLATES COM PROFESSION DIFERENTE QUE DEVERIAM SER WELLNESS
SELECT 
  id,
  name as nome,
  profession,
  language,
  is_active as ativo,
  created_at as criado_em
FROM templates_nutrition
WHERE language = 'pt'
  AND (profession IS NULL OR profession != 'wellness')
  AND (
    LOWER(name) LIKE '%wellness%' 
    OR LOWER(name) LIKE '%bem-estar%'
    OR LOWER(name) LIKE '%bem estar%'
  )
ORDER BY created_at DESC
LIMIT 20;

-- 10. RESUMO FINAL PARA COMPARAÇÃO
SELECT 
  '📋 RESUMO FINAL' as info,
  COUNT(*) as total_templates_no_banco,
  COUNT(CASE WHEN is_active = true THEN 1 END) as templates_ativos,
  COUNT(CASE WHEN is_active = false THEN 1 END) as templates_inativos,
  COUNT(DISTINCT type) as tipos_diferentes,
  COUNT(DISTINCT name) as nomes_unicos
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt';

