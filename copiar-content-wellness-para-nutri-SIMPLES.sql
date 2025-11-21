-- =====================================================
-- SCRIPT SIMPLIFICADO: Copiar Content Wellness → Nutri
-- =====================================================
-- 
-- Este script copia o campo `content` dos templates Wellness
-- para os templates Nutri correspondentes.
-- 
-- ⚠️ ATENÇÃO: Este script VAI SOBRESCREVER o content dos templates Nutri!
-- 
-- =====================================================

-- =====================================================
-- 1. BACKUP: Criar tabela de backup (OBRIGATÓRIO)
-- =====================================================
-- Execute esta query PRIMEIRO para ter um backup

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
-- 2. COPIAR CONTENT: Wellness → Nutri
-- =====================================================
-- ⚠️ Esta query VAI SOBRESCREVER o content dos templates Nutri!

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
-- 3. VERIFICAÇÃO: Confirmar que foi copiado
-- =====================================================
-- Execute esta query para verificar se foi copiado corretamente

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
  END as status_content,
  w.name as nome_wellness_origem,
  CASE 
    WHEN n.content::text = w.content::text THEN '✅ CONTENT IDÊNTICO'
    ELSE '⚠️ CONTENT DIFERENTE'
  END as comparacao
FROM templates_nutrition n
INNER JOIN templates_nutrition w
  ON (
    n.slug = w.slug
    OR (w.slug = 'calc-hidratacao' AND n.slug = 'calculadora-agua')
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
  AND w.profession = 'wellness'
  AND w.language = 'pt'
WHERE n.profession = 'nutri'
  AND n.language = 'pt'
  AND n.is_active = true
ORDER BY n.type, n.name;

-- =====================================================
-- INSTRUÇÕES:
-- =====================================================
-- 
-- 1. Execute a Query #1 (BACKUP) - OBRIGATÓRIO
-- 2. Execute as 2 queries da Query #2 (COPIAR) - CUIDADO!
-- 3. Execute a Query #3 (VERIFICAÇÃO) - Para confirmar
-- 
-- =====================================================







