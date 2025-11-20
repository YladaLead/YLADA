-- =====================================================
-- VERIFICAÇÃO: Templates Nutri no Banco vs Diagnósticos
-- =====================================================
-- 
-- Este script verifica:
-- 1. Quais templates existem no banco (templates_nutrition)
-- 2. Quais têm content completo (sequência de perguntas)
-- 3. Comparar com diagnósticos disponíveis no código
--
-- =====================================================

-- 1. Listar TODOS os templates Nutri do banco
-- NOTA: Se a coluna 'profession' não existir, remova a linha "AND profession = 'nutri'"
SELECT 
  id,
  name as nome,
  slug,
  type as tipo,
  specialization as especializacao,
  is_active as ativo,
  CASE 
    WHEN content IS NULL THEN 'SEM CONTENT'
    WHEN content::text = '{}' THEN 'CONTENT VAZIO'
    WHEN content::text = 'null' THEN 'CONTENT NULL'
    ELSE 'TEM CONTENT'
  END as status_content,
  CASE 
    WHEN content->'questions' IS NOT NULL AND jsonb_typeof(content->'questions') = 'array' THEN jsonb_array_length(content->'questions')
    WHEN content->'items' IS NOT NULL AND jsonb_typeof(content->'items') = 'array' THEN jsonb_array_length(content->'items')
    WHEN content->'steps' IS NOT NULL AND jsonb_typeof(content->'steps') = 'array' THEN jsonb_array_length(content->'steps')
    ELSE 0
  END as num_itens,
  created_at as criado_em,
  updated_at as atualizado_em
FROM templates_nutrition
WHERE language = 'pt'
  AND is_active = true
  -- Se a coluna 'profession' existir, descomente a linha abaixo:
  -- AND profession = 'nutri'
ORDER BY type, name;

-- 2. Templates com content incompleto ou vazio
SELECT 
  id,
  name as nome,
  slug,
  type as tipo,
  CASE 
    WHEN content IS NULL THEN 'SEM CONTENT'
    WHEN content::text = '{}' THEN 'CONTENT VAZIO'
    WHEN content::text = 'null' THEN 'CONTENT NULL'
    ELSE 'TEM CONTENT MAS PODE ESTAR INCOMPLETO'
  END as problema,
  content::text as content_preview
FROM templates_nutrition
WHERE language = 'pt'
  AND is_active = true
  -- Se a coluna 'profession' existir, descomente a linha abaixo:
  -- AND profession = 'nutri'
  AND (
    content IS NULL 
    OR content::text = '{}' 
    OR content::text = 'null'
    OR (
      (content->'questions' IS NULL OR jsonb_typeof(content->'questions') != 'array' OR (jsonb_typeof(content->'questions') = 'array' AND jsonb_array_length(content->'questions') = 0))
      AND (content->'items' IS NULL OR jsonb_typeof(content->'items') != 'array' OR (jsonb_typeof(content->'items') = 'array' AND jsonb_array_length(content->'items') = 0))
      AND (content->'steps' IS NULL OR jsonb_typeof(content->'steps') != 'array' OR (jsonb_typeof(content->'steps') = 'array' AND jsonb_array_length(content->'steps') = 0))
    )
  )
ORDER BY type, name;

-- 3. Templates com content completo (para verificar estrutura)
SELECT 
  id,
  name as nome,
  slug,
  type as tipo,
  CASE 
    WHEN content->'questions' IS NOT NULL THEN 'questions'
    WHEN content->'items' IS NOT NULL THEN 'items'
    WHEN content->'steps' IS NOT NULL THEN 'steps'
    ELSE 'outro'
  END as estrutura_content,
  CASE 
    WHEN content->'questions' IS NOT NULL AND jsonb_typeof(content->'questions') = 'array' THEN jsonb_array_length(content->'questions')
    WHEN content->'items' IS NOT NULL AND jsonb_typeof(content->'items') = 'array' THEN jsonb_array_length(content->'items')
    WHEN content->'steps' IS NOT NULL AND jsonb_typeof(content->'steps') = 'array' THEN jsonb_array_length(content->'steps')
    ELSE 0
  END as num_itens,
  CASE 
    WHEN content->'questions' IS NOT NULL AND jsonb_typeof(content->'questions') = 'array' AND jsonb_array_length(content->'questions') > 0 
    THEN jsonb_pretty(content->'questions'->0)
    ELSE NULL
  END as exemplo_primeira_pergunta
FROM templates_nutrition
WHERE language = 'pt'
  AND is_active = true
  -- Se a coluna 'profession' existir, descomente a linha abaixo:
  -- AND profession = 'nutri'
  AND content IS NOT NULL
  AND content::text != '{}'
  AND content::text != 'null'
  AND (
    (content->'questions' IS NOT NULL AND jsonb_typeof(content->'questions') = 'array' AND jsonb_array_length(content->'questions') > 0)
    OR (content->'items' IS NOT NULL AND jsonb_typeof(content->'items') = 'array' AND jsonb_array_length(content->'items') > 0)
    OR (content->'steps' IS NOT NULL AND jsonb_typeof(content->'steps') = 'array' AND jsonb_array_length(content->'steps') > 0)
  )
ORDER BY type, name
LIMIT 10;

-- 4. Contagem por tipo
SELECT 
  type as tipo,
  COUNT(*) as total,
  COUNT(CASE WHEN content IS NOT NULL AND content::text != '{}' AND content::text != 'null' THEN 1 END) as com_content,
  COUNT(CASE WHEN content IS NULL OR content::text = '{}' OR content::text = 'null' THEN 1 END) as sem_content
FROM templates_nutrition
WHERE language = 'pt'
  AND is_active = true
  -- Se a coluna 'profession' existir, descomente a linha abaixo:
  -- AND profession = 'nutri'
GROUP BY type
ORDER BY total DESC;

-- 5. Lista de slugs para comparar com diagnósticos
SELECT 
  slug,
  name as nome,
  type as tipo,
  CASE 
    WHEN slug IS NULL OR slug = '' THEN 'SEM SLUG'
    ELSE 'TEM SLUG'
  END as status_slug
FROM templates_nutrition
WHERE language = 'pt'
  AND is_active = true
  -- Se a coluna 'profession' existir, descomente a linha abaixo:
  -- AND profession = 'nutri'
ORDER BY slug, name;

