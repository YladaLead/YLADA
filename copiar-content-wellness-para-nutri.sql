-- =====================================================
-- SCRIPT: Copiar Content Wellness → Nutri
-- =====================================================
-- 
-- Este script copia o campo `content` dos templates Wellness
-- para os templates Nutri correspondentes (mesmo slug).
-- 
-- IMPORTANTE: Execute com cuidado! Faça backup antes.
-- 
-- =====================================================

-- =====================================================
-- 1. VERIFICAÇÃO PRÉVIA: Ver quais templates serão afetados
-- =====================================================
-- Execute esta query PRIMEIRO para ver o que será copiado
-- Inclui verificação de slugs idênticos E alternativos

SELECT 
  w.slug as slug_wellness,
  w.name as nome_wellness,
  w.type as tipo_wellness,
  CASE 
    WHEN w.content IS NULL THEN 'SEM CONTENT'
    WHEN w.content::text = '{}' THEN 'CONTENT VAZIO'
    WHEN w.content::text = 'null' THEN 'CONTENT NULL'
    WHEN w.content->'questions' IS NOT NULL AND jsonb_typeof(w.content->'questions') = 'array' THEN 
      'TEM CONTENT (' || jsonb_array_length(w.content->'questions') || ' perguntas)'
    WHEN w.content->'items' IS NOT NULL AND jsonb_typeof(w.content->'items') = 'array' THEN 
      'TEM CONTENT (' || jsonb_array_length(w.content->'items') || ' itens)'
    WHEN w.content->'steps' IS NOT NULL AND jsonb_typeof(w.content->'steps') = 'array' THEN 
      'TEM CONTENT (' || jsonb_array_length(w.content->'steps') || ' steps)'
    ELSE 'TEM CONTENT (outro formato)'
  END as status_content_wellness,
  COALESCE(n.slug, n2.slug) as slug_nutri,
  COALESCE(n.name, n2.name) as nome_nutri,
  COALESCE(n.type, n2.type) as tipo_nutri,
  CASE 
    WHEN COALESCE(n.content, n2.content) IS NULL THEN 'SEM CONTENT'
    WHEN COALESCE(n.content, n2.content)::text = '{}' THEN 'CONTENT VAZIO'
    WHEN COALESCE(n.content, n2.content)::text = 'null' THEN 'CONTENT NULL'
    WHEN COALESCE(n.content, n2.content)->'questions' IS NOT NULL AND jsonb_typeof(COALESCE(n.content, n2.content)->'questions') = 'array' THEN 
      'TEM CONTENT (' || jsonb_array_length(COALESCE(n.content, n2.content)->'questions') || ' perguntas)'
    WHEN COALESCE(n.content, n2.content)->'items' IS NOT NULL AND jsonb_typeof(COALESCE(n.content, n2.content)->'items') = 'array' THEN 
      'TEM CONTENT (' || jsonb_array_length(COALESCE(n.content, n2.content)->'items') || ' itens)'
    WHEN COALESCE(n.content, n2.content)->'steps' IS NOT NULL AND jsonb_typeof(COALESCE(n.content, n2.content)->'steps') = 'array' THEN 
      'TEM CONTENT (' || jsonb_array_length(COALESCE(n.content, n2.content)->'steps') || ' steps)'
    ELSE 'TEM CONTENT (outro formato)'
  END as status_content_nutri,
  CASE 
    WHEN n.id IS NULL AND n2.id IS NULL THEN '⚠️ TEMPLATE NUTRI NÃO EXISTE'
    WHEN w.content IS NULL OR w.content::text = '{}' OR w.content::text = 'null' THEN '⚠️ WELLNESS SEM CONTENT'
    WHEN COALESCE(n.content, n2.content) IS NOT NULL AND COALESCE(n.content, n2.content)::text != '{}' AND COALESCE(n.content, n2.content)::text != 'null' THEN '⚠️ NUTRI JÁ TEM CONTENT (será sobrescrito)'
    WHEN n.id IS NOT NULL THEN '✅ OK PARA COPIAR (slug idêntico)'
    WHEN n2.id IS NOT NULL THEN '✅ OK PARA COPIAR (slug alternativo)'
    ELSE '❌ ERRO'
  END as acao
FROM templates_nutrition w
LEFT JOIN templates_nutrition n 
  ON w.slug = n.slug 
  AND n.profession = 'nutri'
  AND n.language = 'pt'
LEFT JOIN templates_nutrition n2 
  ON (
    (w.slug = 'calc-hidratacao' AND n2.slug = 'calculadora-agua')
    OR (w.slug = 'calc-calorias' AND n2.slug = 'calculadora-calorias')
    OR (w.slug = 'calc-imc' AND n2.slug = 'calculadora-imc')
    OR (w.slug = 'calc-proteina' AND n2.slug = 'calculadora-proteina')
    OR (w.slug = 'quiz-fome-emocional' AND n2.slug = 'avaliacao-fome-emocional')
    OR (w.slug = 'quiz-alimentacao-saudavel' AND n2.slug = 'alimentacao-saudavel')
    OR (w.slug = 'quiz-ganhos' AND n2.slug = 'ganhos-prosperidade')
    OR (w.slug = 'quiz-potencial' AND n2.slug = 'potencial-crescimento')
    OR (w.slug = 'quiz-proposito' AND n2.slug = 'proposito-equilibrio')
    OR (w.slug = 'retencao-liquidos' AND n2.slug = 'teste-retencao-liquidos')
  )
  AND n2.profession = 'nutri'
  AND n2.language = 'pt'
WHERE w.profession = 'wellness'
  AND w.language = 'pt'
  AND w.is_active = true
  AND w.slug IS NOT NULL
  AND w.slug != ''
ORDER BY w.type, w.name;

-- =====================================================
-- 2. CONTAGEM: Quantos templates serão atualizados
-- =====================================================
-- Inclui contagem de slugs idênticos E alternativos

SELECT 
  COUNT(DISTINCT w.id) as total_wellness_com_content,
  COUNT(DISTINCT COALESCE(n.id, n2.id)) as total_nutri_correspondentes,
  COUNT(DISTINCT CASE 
    WHEN w.content IS NOT NULL 
      AND w.content::text != '{}' 
      AND w.content::text != 'null'
      AND (n.id IS NOT NULL OR n2.id IS NOT NULL)
    THEN w.id
  END) as total_para_copiar,
  COUNT(DISTINCT CASE WHEN n.id IS NOT NULL THEN w.id END) as com_slug_identico,
  COUNT(DISTINCT CASE WHEN n2.id IS NOT NULL AND n.id IS NULL THEN w.id END) as com_slug_alternativo
FROM templates_nutrition w
LEFT JOIN templates_nutrition n 
  ON w.slug = n.slug 
  AND n.profession = 'nutri'
  AND n.language = 'pt'
LEFT JOIN templates_nutrition n2 
  ON (
    (w.slug = 'calc-hidratacao' AND n2.slug = 'calculadora-agua')
    OR (w.slug = 'calc-calorias' AND n2.slug = 'calculadora-calorias')
    OR (w.slug = 'calc-imc' AND n2.slug = 'calculadora-imc')
    OR (w.slug = 'calc-proteina' AND n2.slug = 'calculadora-proteina')
    OR (w.slug = 'quiz-fome-emocional' AND n2.slug = 'avaliacao-fome-emocional')
    OR (w.slug = 'quiz-alimentacao-saudavel' AND n2.slug = 'alimentacao-saudavel')
    OR (w.slug = 'quiz-ganhos' AND n2.slug = 'ganhos-prosperidade')
    OR (w.slug = 'quiz-potencial' AND n2.slug = 'potencial-crescimento')
    OR (w.slug = 'quiz-proposito' AND n2.slug = 'proposito-equilibrio')
    OR (w.slug = 'retencao-liquidos' AND n2.slug = 'teste-retencao-liquidos')
  )
  AND n2.profession = 'nutri'
  AND n2.language = 'pt'
WHERE w.profession = 'wellness'
  AND w.language = 'pt'
  AND w.is_active = true
  AND w.slug IS NOT NULL
  AND w.slug != ''
  AND w.content IS NOT NULL
  AND w.content::text != '{}'
  AND w.content::text != 'null';

-- =====================================================
-- 3. BACKUP: Criar tabela de backup (OPCIONAL mas RECOMENDADO)
-- =====================================================
-- Execute esta query ANTES de copiar para ter um backup

CREATE TABLE IF NOT EXISTS templates_nutrition_backup_content AS
SELECT 
  id,
  slug,
  name,
  profession,
  content,
  updated_at,
  NOW() as backup_created_at
FROM templates_nutrition
WHERE profession = 'nutri'
  AND language = 'pt';

-- Verificar backup criado
SELECT COUNT(*) as total_backup FROM templates_nutrition_backup_content;

-- =====================================================
-- 4. COPIAR CONTENT: Wellness → Nutri
-- =====================================================
-- ⚠️ ATENÇÃO: Esta query VAI SOBRESCREVER o content dos templates Nutri!
-- Execute apenas após verificar as queries anteriores.

-- Versão 1: Copiar quando slug é idêntico
UPDATE templates_nutrition n
SET 
  content = w.content,
  updated_at = NOW()
FROM templates_nutrition w
WHERE w.profession = 'wellness'
  AND w.language = 'pt'
  AND w.is_active = true
  AND w.slug IS NOT NULL
  AND w.slug != ''
  AND w.content IS NOT NULL
  AND w.content::text != '{}'
  AND w.content::text != 'null'
  AND n.profession = 'nutri'
  AND n.language = 'pt'
  AND n.slug = w.slug;

-- Versão 2: Copiar com mapeamento de slugs alternativos
-- (Para casos onde Wellness usa 'calc-*' e Nutri usa 'calculadora-*')
UPDATE templates_nutrition n
SET 
  content = w.content,
  updated_at = NOW()
FROM templates_nutrition w
WHERE w.profession = 'wellness'
  AND w.language = 'pt'
  AND w.is_active = true
  AND w.slug IS NOT NULL
  AND w.slug != ''
  AND w.content IS NOT NULL
  AND w.content::text != '{}'
  AND w.content::text != 'null'
  AND n.profession = 'nutri'
  AND n.language = 'pt'
  AND (
    -- Mapeamento de slugs alternativos
    (w.slug = 'calc-hidratacao' AND n.slug = 'calculadora-agua')
    OR (w.slug = 'calc-calorias' AND n.slug = 'calculadora-calorias')
    OR (w.slug = 'calc-imc' AND n.slug = 'calculadora-imc')
    OR (w.slug = 'calc-proteina' AND n.slug = 'calculadora-proteina')
    OR (w.slug = 'quiz-fome-emocional' AND n.slug = 'avaliacao-fome-emocional')
    OR (w.slug = 'quiz-alimentacao-saudavel' AND n.slug = 'alimentacao-saudavel')
    OR (w.slug = 'quiz-ganhos' AND n.slug = 'ganhos-prosperidade')
    OR (w.slug = 'quiz-potencial' AND n.slug = 'potencial-crescimento')
    OR (w.slug = 'quiz-proposito' AND n.slug = 'proposito-equilibrio')
    OR (w.slug = 'retencao-liquidos' AND n.slug = 'teste-retencao-liquidos')
  )
  -- Garantir que não foi atualizado na query anterior (slug idêntico)
  AND n.slug != w.slug;

-- =====================================================
-- 5. VERIFICAÇÃO PÓS-ATUALIZAÇÃO: Confirmar que foi copiado
-- =====================================================

SELECT 
  n.slug,
  n.name as nome_nutri,
  CASE 
    WHEN n.content IS NULL THEN '❌ SEM CONTENT'
    WHEN n.content::text = '{}' THEN '❌ CONTENT VAZIO'
    WHEN n.content::text = 'null' THEN '❌ CONTENT NULL'
    WHEN n.content->'questions' IS NOT NULL AND jsonb_typeof(n.content->'questions') = 'array' THEN 
      '✅ TEM CONTENT (' || jsonb_array_length(n.content->'questions') || ' perguntas)'
    WHEN n.content->'items' IS NOT NULL AND jsonb_typeof(n.content->'items') = 'array' THEN 
      '✅ TEM CONTENT (' || jsonb_array_length(n.content->'items') || ' itens)'
    WHEN n.content->'steps' IS NOT NULL AND jsonb_typeof(n.content->'steps') = 'array' THEN 
      '✅ TEM CONTENT (' || jsonb_array_length(n.content->'steps') || ' steps)'
    ELSE '✅ TEM CONTENT (outro formato)'
  END as status_content_nutri,
  w.name as nome_wellness_origem,
  CASE 
    WHEN w.content IS NULL THEN '❌ SEM CONTENT'
    WHEN w.content::text = '{}' THEN '❌ CONTENT VAZIO'
    WHEN w.content::text = 'null' THEN '❌ CONTENT NULL'
    WHEN w.content->'questions' IS NOT NULL AND jsonb_typeof(w.content->'questions') = 'array' THEN 
      '✅ TEM CONTENT (' || jsonb_array_length(w.content->'questions') || ' perguntas)'
    WHEN w.content->'items' IS NOT NULL AND jsonb_typeof(w.content->'items') = 'array' THEN 
      '✅ TEM CONTENT (' || jsonb_array_length(w.content->'items') || ' itens)'
    WHEN w.content->'steps' IS NOT NULL AND jsonb_typeof(w.content->'steps') = 'array' THEN 
      '✅ TEM CONTENT (' || jsonb_array_length(w.content->'steps') || ' steps)'
    ELSE '✅ TEM CONTENT (outro formato)'
  END as status_content_wellness,
  CASE 
    WHEN n.content::text = w.content::text THEN '✅ CONTENT IDÊNTICO'
    ELSE '⚠️ CONTENT DIFERENTE'
  END as comparacao
FROM templates_nutrition n
INNER JOIN templates_nutrition w
  ON n.slug = w.slug
  AND w.profession = 'wellness'
  AND w.language = 'pt'
WHERE n.profession = 'nutri'
  AND n.language = 'pt'
  AND n.is_active = true
ORDER BY n.type, n.name;

-- =====================================================
-- 6. TEMPLATES NUTRI SEM CORRESPONDENTE WELLNESS
-- =====================================================
-- Templates Nutri que NÃO têm correspondente Wellness (precisam de atenção)

SELECT 
  n.slug,
  n.name as nome_nutri,
  n.type as tipo,
  CASE 
    WHEN n.content IS NULL THEN 'SEM CONTENT'
    WHEN n.content::text = '{}' THEN 'CONTENT VAZIO'
    WHEN n.content::text = 'null' THEN 'CONTENT NULL'
    WHEN n.content->'questions' IS NOT NULL AND jsonb_typeof(n.content->'questions') = 'array' THEN 
      'TEM CONTENT (' || jsonb_array_length(n.content->'questions') || ' perguntas)'
    WHEN n.content->'items' IS NOT NULL AND jsonb_typeof(n.content->'items') = 'array' THEN 
      'TEM CONTENT (' || jsonb_array_length(n.content->'items') || ' itens)'
    WHEN n.content->'steps' IS NOT NULL AND jsonb_typeof(n.content->'steps') = 'array' THEN 
      'TEM CONTENT (' || jsonb_array_length(n.content->'steps') || ' steps)'
    ELSE 'TEM CONTENT (outro formato)'
  END as status_content
FROM templates_nutrition n
LEFT JOIN templates_nutrition w
  ON n.slug = w.slug
  AND w.profession = 'wellness'
  AND w.language = 'pt'
WHERE n.profession = 'nutri'
  AND n.language = 'pt'
  AND n.is_active = true
  AND w.id IS NULL
ORDER BY n.type, n.name;

-- =====================================================
-- 7. TEMPLATES WELLNESS SEM CORRESPONDENTE NUTRI
-- =====================================================
-- Templates Wellness que NÃO têm correspondente Nutri (podem precisar ser criados)

SELECT 
  w.slug,
  w.name as nome_wellness,
  w.type as tipo,
  CASE 
    WHEN w.content IS NULL THEN 'SEM CONTENT'
    WHEN w.content::text = '{}' THEN 'CONTENT VAZIO'
    WHEN w.content::text = 'null' THEN 'CONTENT NULL'
    WHEN w.content->'questions' IS NOT NULL AND jsonb_typeof(w.content->'questions') = 'array' THEN 
      'TEM CONTENT (' || jsonb_array_length(w.content->'questions') || ' perguntas)'
    WHEN w.content->'items' IS NOT NULL AND jsonb_typeof(w.content->'items') = 'array' THEN 
      'TEM CONTENT (' || jsonb_array_length(w.content->'items') || ' itens)'
    WHEN w.content->'steps' IS NOT NULL AND jsonb_typeof(w.content->'steps') = 'array' THEN 
      'TEM CONTENT (' || jsonb_array_length(w.content->'steps') || ' steps)'
    ELSE 'TEM CONTENT (outro formato)'
  END as status_content
FROM templates_nutrition w
LEFT JOIN templates_nutrition n
  ON w.slug = n.slug
  AND n.profession = 'nutri'
  AND n.language = 'pt'
WHERE w.profession = 'wellness'
  AND w.language = 'pt'
  AND w.is_active = true
  AND w.content IS NOT NULL
  AND w.content::text != '{}'
  AND w.content::text != 'null'
  AND n.id IS NULL
ORDER BY w.type, w.name;

-- =====================================================
-- INSTRUÇÕES DE USO:
-- =====================================================
-- 
-- 1. Execute a Query #1 primeiro para ver o que será copiado
-- 2. Execute a Query #2 para ver quantos templates serão afetados
-- 3. Execute a Query #3 para criar backup (RECOMENDADO)
-- 4. Execute a Query #4 para copiar o content (CUIDADO!)
-- 5. Execute a Query #5 para verificar se foi copiado corretamente
-- 6. Execute as Queries #6 e #7 para ver templates sem correspondente
-- 
-- =====================================================

