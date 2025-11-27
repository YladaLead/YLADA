-- =====================================================
-- CORREÇÃO RÁPIDA: Templates Coach (calc-hidratacao e calc-proteina)
-- =====================================================
-- Este script corrige apenas os templates que estão dando erro imediato
-- Para correção completa, use: corrigir-e-sincronizar-todos-templates-coach.sql

-- =====================================================
-- PASSO 1: CORRIGIR SLUGS
-- =====================================================

-- Corrigir slug de Calculadora de Hidratação
UPDATE coach_templates_nutrition
SET slug = 'calc-hidratacao',
    is_active = true,
    updated_at = NOW()
WHERE (LOWER(name) LIKE '%hidratação%' OR LOWER(name) LIKE '%hidratacao%' OR LOWER(name) LIKE '%água%' OR LOWER(name) LIKE '%agua%')
  AND type = 'calculadora'
  AND (slug IS NULL OR slug != 'calc-hidratacao');

-- Corrigir slug de Calculadora de Proteína
UPDATE coach_templates_nutrition
SET slug = 'calc-proteina',
    is_active = true,
    updated_at = NOW()
WHERE (LOWER(name) LIKE '%proteína%' OR LOWER(name) LIKE '%proteina%')
  AND type = 'calculadora'
  AND (slug IS NULL OR slug != 'calc-proteina');

-- =====================================================
-- PASSO 2: COPIAR DA TABELA ORIGEM (se não existirem)
-- =====================================================

-- Copiar Calculadora de Hidratação
INSERT INTO coach_templates_nutrition (
  name, type, language, profession, is_active, slug,
  title, description, content, specialization, objective
)
SELECT 
  t.name,
  t.type,
  t.language,
  'coach' as profession,
  COALESCE(t.is_active, true) as is_active,
  'calc-hidratacao' as slug,
  t.title,
  t.description,
  t.content,
  t.specialization,
  t.objective
FROM templates_nutrition t
WHERE (LOWER(t.name) LIKE '%hidratação%' OR LOWER(t.name) LIKE '%hidratacao%' OR LOWER(t.name) LIKE '%água%' OR LOWER(t.name) LIKE '%agua%')
  AND t.type = 'calculadora'
  AND t.is_active = true
  AND t.language = 'pt'
  AND (t.profession = 'nutri' OR t.profession IS NULL OR t.profession = '')
  AND NOT EXISTS (
    SELECT 1 FROM coach_templates_nutrition c
    WHERE c.slug = 'calc-hidratacao'
  )
LIMIT 1;

-- Copiar Calculadora de Proteína
INSERT INTO coach_templates_nutrition (
  name, type, language, profession, is_active, slug,
  title, description, content, specialization, objective
)
SELECT 
  t.name,
  t.type,
  t.language,
  'coach' as profession,
  COALESCE(t.is_active, true) as is_active,
  'calc-proteina' as slug,
  t.title,
  t.description,
  t.content,
  t.specialization,
  t.objective
FROM templates_nutrition t
WHERE (LOWER(t.name) LIKE '%proteína%' OR LOWER(t.name) LIKE '%proteina%')
  AND t.type = 'calculadora'
  AND t.is_active = true
  AND t.language = 'pt'
  AND (t.profession = 'nutri' OR t.profession IS NULL OR t.profession = '')
  AND NOT EXISTS (
    SELECT 1 FROM coach_templates_nutrition c
    WHERE c.slug = 'calc-proteina'
  )
LIMIT 1;

-- =====================================================
-- PASSO 3: CRIAR SE AINDA NÃO EXISTIREM
-- =====================================================

-- Criar Calculadora de Hidratação (estrutura básica)
INSERT INTO coach_templates_nutrition (
  name, type, language, profession, is_active, slug,
  title, description, content
)
SELECT 
  'Calculadora de Hidratação',
  'calculadora',
  'pt',
  'coach',
  true,
  'calc-hidratacao',
  'Calculadora de Hidratação',
  'Calcule sua necessidade diária de água',
  '{"template_type": "calculator", "fields": ["peso", "atividade", "clima"]}'::jsonb
WHERE NOT EXISTS (
  SELECT 1 FROM coach_templates_nutrition 
  WHERE slug = 'calc-hidratacao'
);

-- Criar Calculadora de Proteína (estrutura básica)
INSERT INTO coach_templates_nutrition (
  name, type, language, profession, is_active, slug,
  title, description, content
)
SELECT 
  'Calculadora de Proteína',
  'calculadora',
  'pt',
  'coach',
  true,
  'calc-proteina',
  'Calculadora de Proteína',
  'Calcule sua necessidade diária de proteína',
  '{"template_type": "calculator", "fields": ["peso", "atividade", "objetivo"]}'::jsonb
WHERE NOT EXISTS (
  SELECT 1 FROM coach_templates_nutrition 
  WHERE slug = 'calc-proteina'
);

-- =====================================================
-- PASSO 4: VERIFICAÇÃO
-- =====================================================

SELECT 
  name,
  slug,
  type,
  is_active,
  profession,
  language,
  CASE 
    WHEN slug IS NULL THEN '❌ SEM SLUG'
    WHEN is_active = false THEN '⚠️ INATIVO'
    WHEN profession != 'coach' THEN '⚠️ PROFESSION DIFERENTE'
    WHEN language != 'pt' THEN '⚠️ LANGUAGE DIFERENTE'
    ELSE '✅ OK'
  END as status
FROM coach_templates_nutrition
WHERE slug IN ('calc-hidratacao', 'calc-proteina')
ORDER BY slug;

