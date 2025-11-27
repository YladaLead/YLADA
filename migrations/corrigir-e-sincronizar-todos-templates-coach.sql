-- =====================================================
-- CORRIGIR E SINCRONIZAR TODOS OS TEMPLATES COACH
-- =====================================================
-- Este script:
-- 1. Verifica templates existentes
-- 2. Corrige slugs incorretos
-- 3. Copia templates faltantes da tabela origem
-- 4. Ativa templates inativos
-- 5. Garante que todos os templates principais estejam disponíveis

-- =====================================================
-- PASSO 1: DIAGNÓSTICO INICIAL
-- =====================================================
DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE 'DIAGNÓSTICO INICIAL - TEMPLATES COACH';
  RAISE NOTICE '========================================';
END $$;

-- Verificar estado atual
SELECT 
  'ANTES - Templates Coach' as status,
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE is_active = true) as ativos,
  COUNT(*) FILTER (WHERE is_active = false) as inativos,
  COUNT(*) FILTER (WHERE slug IS NULL) as sem_slug
FROM coach_templates_nutrition;

-- =====================================================
-- PASSO 2: CORRIGIR SLUGS DOS TEMPLATES EXISTENTES
-- =====================================================
DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE 'PASSO 2: CORRIGINDO SLUGS';
  RAISE NOTICE '========================================';
END $$;

-- Corrigir slug de Calculadora de Hidratação
UPDATE coach_templates_nutrition
SET slug = 'calc-hidratacao',
    updated_at = NOW()
WHERE (LOWER(name) LIKE '%hidratação%' OR LOWER(name) LIKE '%hidratacao%' OR LOWER(name) LIKE '%água%' OR LOWER(name) LIKE '%agua%')
  AND type = 'calculadora'
  AND (slug IS NULL OR slug != 'calc-hidratacao');

-- Corrigir slug de Calculadora de Proteína
UPDATE coach_templates_nutrition
SET slug = 'calc-proteina',
    updated_at = NOW()
WHERE (LOWER(name) LIKE '%proteína%' OR LOWER(name) LIKE '%proteina%')
  AND type = 'calculadora'
  AND (slug IS NULL OR slug != 'calc-proteina');

-- Corrigir slug de Calculadora de IMC
UPDATE coach_templates_nutrition
SET slug = 'calc-imc',
    updated_at = NOW()
WHERE (LOWER(name) LIKE '%imc%' OR LOWER(name) LIKE '%índice de massa%')
  AND type = 'calculadora'
  AND (slug IS NULL OR slug != 'calc-imc');

-- Corrigir slug de Calculadora de Calorias
UPDATE coach_templates_nutrition
SET slug = 'calc-calorias',
    updated_at = NOW()
WHERE (LOWER(name) LIKE '%caloria%')
  AND type = 'calculadora'
  AND (slug IS NULL OR slug != 'calc-calorias');

-- Corrigir slug de Calculadora de Composição Corporal
UPDATE coach_templates_nutrition
SET slug = 'calc-composicao',
    updated_at = NOW()
WHERE (LOWER(name) LIKE '%composição%' OR LOWER(name) LIKE '%composicao%' OR LOWER(name) LIKE '%corporal%')
  AND type = 'calculadora'
  AND (slug IS NULL OR slug != 'calc-composicao');

-- Corrigir slug de Quiz Ganhos
UPDATE coach_templates_nutrition
SET slug = 'quiz-ganhos',
    updated_at = NOW()
WHERE (LOWER(name) LIKE '%ganhos%' OR LOWER(name) LIKE '%prosperidade%')
  AND type = 'quiz'
  AND (slug IS NULL OR slug != 'quiz-ganhos');

-- Corrigir slug de Quiz Potencial
UPDATE coach_templates_nutrition
SET slug = 'quiz-potencial',
    updated_at = NOW()
WHERE (LOWER(name) LIKE '%potencial%' OR LOWER(name) LIKE '%crescimento%')
  AND type = 'quiz'
  AND (slug IS NULL OR slug != 'quiz-potencial');

-- Corrigir slug de Quiz Propósito
UPDATE coach_templates_nutrition
SET slug = 'quiz-proposito',
    updated_at = NOW()
WHERE (LOWER(name) LIKE '%propósito%' OR LOWER(name) LIKE '%proposito%' OR LOWER(name) LIKE '%equilíbrio%' OR LOWER(name) LIKE '%equilibrio%')
  AND type = 'quiz'
  AND (slug IS NULL OR slug != 'quiz-proposito');

-- Corrigir slug de Quiz Alimentação
UPDATE coach_templates_nutrition
SET slug = 'quiz-alimentacao',
    updated_at = NOW()
WHERE (LOWER(name) LIKE '%alimentação%' OR LOWER(name) LIKE '%alimentacao%' OR LOWER(name) LIKE '%saudável%' OR LOWER(name) LIKE '%saudavel%')
  AND type = 'quiz'
  AND (slug IS NULL OR slug != 'quiz-alimentacao');

-- Corrigir slug de Desafio 7 Dias
UPDATE coach_templates_nutrition
SET slug = 'template-desafio-7dias',
    updated_at = NOW()
WHERE (LOWER(name) LIKE '%7 dias%' OR LOWER(name) LIKE '%7dias%' OR LOWER(name) LIKE '%desafio 7%')
  AND (slug IS NULL OR (slug != 'template-desafio-7dias' AND slug != 'desafio-7-dias'));

-- Corrigir slug de Desafio 21 Dias
UPDATE coach_templates_nutrition
SET slug = 'template-desafio-21dias',
    updated_at = NOW()
WHERE (LOWER(name) LIKE '%21 dias%' OR LOWER(name) LIKE '%21dias%' OR LOWER(name) LIKE '%desafio 21%')
  AND (slug IS NULL OR (slug != 'template-desafio-21dias' AND slug != 'desafio-21-dias'));

-- Corrigir slug de Guia de Hidratação
UPDATE coach_templates_nutrition
SET slug = 'guia-hidratacao',
    updated_at = NOW()
WHERE (LOWER(name) LIKE '%guia%' AND (LOWER(name) LIKE '%hidratação%' OR LOWER(name) LIKE '%hidratacao%' OR LOWER(name) LIKE '%água%'))
  AND (slug IS NULL OR slug != 'guia-hidratacao');

-- Corrigir slug de Avaliação de Intolerância
UPDATE coach_templates_nutrition
SET slug = 'avaliacao-intolerancia',
    updated_at = NOW()
WHERE (LOWER(name) LIKE '%intolerância%' OR LOWER(name) LIKE '%intolerancia%' OR LOWER(name) LIKE '%sensibilidade%')
  AND (slug IS NULL OR slug != 'avaliacao-intolerancia');

-- Corrigir slug de Avaliação Perfil Metabólico
UPDATE coach_templates_nutrition
SET slug = 'avaliacao-perfil-metabolico',
    updated_at = NOW()
WHERE (LOWER(name) LIKE '%perfil metabólico%' OR LOWER(name) LIKE '%perfil metabolico%' OR LOWER(name) LIKE '%metabólico%')
  AND (slug IS NULL OR slug != 'avaliacao-perfil-metabolico');

-- Corrigir slug de Diagnóstico de Eletrólitos
UPDATE coach_templates_nutrition
SET slug = 'diagnostico-eletrolitos',
    updated_at = NOW()
WHERE (LOWER(name) LIKE '%eletrólito%' OR LOWER(name) LIKE '%eletrolito%')
  AND (slug IS NULL OR slug != 'diagnostico-eletrolitos');

-- Corrigir slug de Diagnóstico de Sintomas Intestinais
UPDATE coach_templates_nutrition
SET slug = 'diagnostico-sintomas-intestinais',
    updated_at = NOW()
WHERE (LOWER(name) LIKE '%sintoma%' AND (LOWER(name) LIKE '%intestinal%' OR LOWER(name) LIKE '%digestivo%'))
  AND (slug IS NULL OR slug != 'diagnostico-sintomas-intestinais');

-- Corrigir slug de Tipo de Fome
UPDATE coach_templates_nutrition
SET slug = 'tipo-fome',
    updated_at = NOW()
WHERE (LOWER(name) LIKE '%fome%' AND (LOWER(name) LIKE '%emocional%' OR LOWER(name) LIKE '%tipo%'))
  AND (slug IS NULL OR slug != 'tipo-fome');

-- Corrigir slug de Story Interativo
UPDATE coach_templates_nutrition
SET slug = 'template-story-interativo',
    updated_at = NOW()
WHERE (LOWER(name) LIKE '%story%' OR LOWER(name) LIKE '%interativo%' OR LOWER(name) LIKE '%quiz interativo%')
  AND (slug IS NULL OR slug != 'template-story-interativo');

-- Corrigir slug de Diagnóstico de Parasitose
UPDATE coach_templates_nutrition
SET slug = 'template-diagnostico-parasitose',
    updated_at = NOW()
WHERE (LOWER(name) LIKE '%parasitose%' OR LOWER(name) LIKE '%parasita%')
  AND (slug IS NULL OR slug != 'template-diagnostico-parasitose');

-- =====================================================
-- PASSO 3: ATIVAR TEMPLATES INATIVOS (se existirem)
-- =====================================================
DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE 'PASSO 3: ATIVANDO TEMPLATES INATIVOS';
  RAISE NOTICE '========================================';
END $$;

-- Ativar templates principais que estão inativos
UPDATE coach_templates_nutrition
SET is_active = true,
    updated_at = NOW()
WHERE is_active = false
  AND (
    slug IN ('calc-hidratacao', 'calc-proteina', 'calc-imc', 'calc-calorias', 'calc-composicao',
             'quiz-ganhos', 'quiz-potencial', 'quiz-proposito', 'quiz-alimentacao',
             'template-desafio-7dias', 'template-desafio-21dias', 'guia-hidratacao',
             'avaliacao-intolerancia', 'avaliacao-perfil-metabolico', 'diagnostico-eletrolitos',
             'diagnostico-sintomas-intestinais', 'tipo-fome', 'template-story-interativo',
             'template-diagnostico-parasitose')
    OR (LOWER(name) LIKE '%hidratação%' AND type = 'calculadora')
    OR (LOWER(name) LIKE '%proteína%' AND type = 'calculadora')
    OR (LOWER(name) LIKE '%imc%' AND type = 'calculadora')
  );

-- =====================================================
-- PASSO 4: COPIAR TEMPLATES FALTANTES DA TABELA ORIGEM
-- =====================================================
DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE 'PASSO 4: COPIANDO TEMPLATES FALTANTES';
  RAISE NOTICE '========================================';
END $$;

-- Lista de slugs essenciais que devem existir
WITH templates_essenciais AS (
  SELECT unnest(ARRAY[
    'calc-hidratacao',
    'calc-proteina',
    'calc-imc',
    'calc-calorias',
    'calc-composicao',
    'quiz-ganhos',
    'quiz-potencial',
    'quiz-proposito',
    'quiz-alimentacao',
    'template-desafio-7dias',
    'template-desafio-21dias',
    'guia-hidratacao',
    'avaliacao-intolerancia',
    'avaliacao-perfil-metabolico',
    'diagnostico-eletrolitos',
    'diagnostico-sintomas-intestinais',
    'tipo-fome',
    'template-story-interativo',
    'template-diagnostico-parasitose'
  ]) as slug_esperado
),
templates_faltantes AS (
  SELECT te.slug_esperado
  FROM templates_essenciais te
  WHERE NOT EXISTS (
    SELECT 1 FROM coach_templates_nutrition c
    WHERE c.slug = te.slug_esperado
      AND c.is_active = true
  )
)
SELECT 
  'Templates faltantes:' as info,
  COUNT(*) as total_faltantes,
  string_agg(slug_esperado, ', ') as slugs_faltantes
FROM templates_faltantes;

-- Copiar templates da tabela origem (templates_nutrition) para coach_templates_nutrition
-- Apenas se não existirem em coach_templates_nutrition
INSERT INTO coach_templates_nutrition (
  name,
  type,
  language,
  specialization,
  objective,
  title,
  description,
  content,
  cta_text,
  whatsapp_message,
  profession,
  is_active,
  usage_count,
  slug,
  icon,
  created_at,
  updated_at
)
SELECT 
  t.name,
  t.type,
  t.language,
  t.specialization,
  t.objective,
  t.title,
  t.description,
  t.content,
  t.cta_text,
  t.whatsapp_message,
  'coach' as profession,
  COALESCE(t.is_active, true) as is_active,
  0 as usage_count,
  -- Mapear slugs da origem para slugs canônicos
  CASE 
    WHEN t.slug = 'calc-hidratacao' OR LOWER(t.name) LIKE '%hidratação%' OR LOWER(t.name) LIKE '%hidratacao%' THEN 'calc-hidratacao'
    WHEN t.slug = 'calc-proteina' OR LOWER(t.name) LIKE '%proteína%' OR LOWER(t.name) LIKE '%proteina%' THEN 'calc-proteina'
    WHEN t.slug = 'calc-imc' OR LOWER(t.name) LIKE '%imc%' THEN 'calc-imc'
    WHEN t.slug = 'calc-calorias' OR LOWER(t.name) LIKE '%caloria%' THEN 'calc-calorias'
    WHEN t.slug = 'calc-composicao' OR (LOWER(t.name) LIKE '%composição%' OR LOWER(t.name) LIKE '%composicao%') THEN 'calc-composicao'
    WHEN t.slug = 'quiz-ganhos' OR LOWER(t.name) LIKE '%ganhos%' OR LOWER(t.name) LIKE '%prosperidade%' THEN 'quiz-ganhos'
    WHEN t.slug = 'quiz-potencial' OR LOWER(t.name) LIKE '%potencial%' OR LOWER(t.name) LIKE '%crescimento%' THEN 'quiz-potencial'
    WHEN t.slug = 'quiz-proposito' OR LOWER(t.name) LIKE '%propósito%' OR LOWER(t.name) LIKE '%proposito%' THEN 'quiz-proposito'
    WHEN t.slug = 'quiz-alimentacao' OR (LOWER(t.name) LIKE '%alimentação%' OR LOWER(t.name) LIKE '%alimentacao%') THEN 'quiz-alimentacao'
    WHEN t.slug = 'template-desafio-7dias' OR t.slug = 'desafio-7-dias' OR LOWER(t.name) LIKE '%7 dias%' THEN 'template-desafio-7dias'
    WHEN t.slug = 'template-desafio-21dias' OR t.slug = 'desafio-21-dias' OR LOWER(t.name) LIKE '%21 dias%' THEN 'template-desafio-21dias'
    WHEN t.slug = 'guia-hidratacao' OR (LOWER(t.name) LIKE '%guia%' AND (LOWER(t.name) LIKE '%hidratação%' OR LOWER(t.name) LIKE '%hidratacao%')) THEN 'guia-hidratacao'
    WHEN t.slug = 'avaliacao-intolerancia' OR LOWER(t.name) LIKE '%intolerância%' OR LOWER(t.name) LIKE '%intolerancia%' THEN 'avaliacao-intolerancia'
    WHEN t.slug = 'avaliacao-perfil-metabolico' OR LOWER(t.name) LIKE '%perfil metabólico%' THEN 'avaliacao-perfil-metabolico'
    WHEN t.slug = 'diagnostico-eletrolitos' OR LOWER(t.name) LIKE '%eletrólito%' THEN 'diagnostico-eletrolitos'
    WHEN t.slug = 'diagnostico-sintomas-intestinais' OR (LOWER(t.name) LIKE '%sintoma%' AND LOWER(t.name) LIKE '%intestinal%') THEN 'diagnostico-sintomas-intestinais'
    WHEN t.slug = 'tipo-fome' OR (LOWER(t.name) LIKE '%fome%' AND LOWER(t.name) LIKE '%emocional%') THEN 'tipo-fome'
    WHEN t.slug = 'template-story-interativo' OR LOWER(t.name) LIKE '%story%' OR LOWER(t.name) LIKE '%interativo%' THEN 'template-story-interativo'
    WHEN t.slug = 'template-diagnostico-parasitose' OR LOWER(t.name) LIKE '%parasitose%' THEN 'template-diagnostico-parasitose'
    ELSE t.slug -- Manter slug original se não houver mapeamento
  END as slug,
  NULL as icon,
  NOW() as created_at,
  NOW() as updated_at
FROM templates_nutrition t
WHERE t.is_active = true
  AND t.language = 'pt'
  AND (t.profession = 'nutri' OR t.profession IS NULL OR t.profession = '')
  AND NOT EXISTS (
    -- Não copiar se já existe em coach_templates_nutrition com mesmo nome e tipo
    SELECT 1 FROM coach_templates_nutrition c
    WHERE c.name = t.name 
      AND c.type = t.type 
      AND c.language = t.language
  );

-- =====================================================
-- PASSO 5: GARANTIR QUE TEMPLATES ESSENCIAIS EXISTAM
-- =====================================================
DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE 'PASSO 5: CRIANDO TEMPLATES ESSENCIAIS FALTANTES';
  RAISE NOTICE '========================================';
END $$;

-- Se ainda faltarem templates essenciais, criar com estrutura básica
-- (Isso só acontece se não existirem nem na tabela origem)

-- Calculadora de Hidratação (se não existir)
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

-- Calculadora de Proteína (se não existir)
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
-- PASSO 6: VERIFICAÇÃO FINAL
-- =====================================================
DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE 'PASSO 6: VERIFICAÇÃO FINAL';
  RAISE NOTICE '========================================';
END $$;

-- Verificar estado final
SELECT 
  'DEPOIS - Templates Coach' as status,
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE is_active = true) as ativos,
  COUNT(*) FILTER (WHERE is_active = false) as inativos,
  COUNT(*) FILTER (WHERE slug IS NULL) as sem_slug
FROM coach_templates_nutrition;

-- Listar templates principais com seus slugs
SELECT 
  name,
  type,
  slug,
  is_active,
  CASE 
    WHEN slug IS NULL THEN '❌ SEM SLUG'
    WHEN is_active = false THEN '⚠️ INATIVO'
    ELSE '✅ OK'
  END as status
FROM coach_templates_nutrition
WHERE slug IN (
  'calc-hidratacao', 'calc-proteina', 'calc-imc', 'calc-calorias', 'calc-composicao',
  'quiz-ganhos', 'quiz-potencial', 'quiz-proposito', 'quiz-alimentacao',
  'template-desafio-7dias', 'template-desafio-21dias', 'guia-hidratacao',
  'avaliacao-intolerancia', 'avaliacao-perfil-metabolico', 'diagnostico-eletrolitos',
  'diagnostico-sintomas-intestinais', 'tipo-fome', 'template-story-interativo',
  'template-diagnostico-parasitose'
)
ORDER BY type, name;

-- Verificar templates faltantes
WITH templates_essenciais AS (
  SELECT unnest(ARRAY[
    'calc-hidratacao',
    'calc-proteina',
    'calc-imc',
    'calc-calorias',
    'calc-composicao',
    'quiz-ganhos',
    'quiz-potencial',
    'quiz-proposito',
    'quiz-alimentacao',
    'template-desafio-7dias',
    'template-desafio-21dias',
    'guia-hidratacao',
    'avaliacao-intolerancia',
    'avaliacao-perfil-metabolico',
    'diagnostico-eletrolitos',
    'diagnostico-sintomas-intestinais',
    'tipo-fome',
    'template-story-interativo',
    'template-diagnostico-parasitose'
  ]) as slug_esperado
)
SELECT 
  te.slug_esperado as template_faltante,
  '❌ FALTANDO' as status
FROM templates_essenciais te
WHERE NOT EXISTS (
  SELECT 1 FROM coach_templates_nutrition c
  WHERE c.slug = te.slug_esperado
    AND c.is_active = true
)
ORDER BY te.slug_esperado;

-- Resumo final
DO $$
DECLARE
  total_templates INTEGER;
  ativos_templates INTEGER;
  faltantes_templates INTEGER;
BEGIN
  SELECT COUNT(*) INTO total_templates FROM coach_templates_nutrition;
  SELECT COUNT(*) INTO ativos_templates FROM coach_templates_nutrition WHERE is_active = true;
  
  SELECT COUNT(*) INTO faltantes_templates
  FROM (
    SELECT unnest(ARRAY[
      'calc-hidratacao', 'calc-proteina', 'calc-imc', 'calc-calorias', 'calc-composicao',
      'quiz-ganhos', 'quiz-potencial', 'quiz-proposito', 'quiz-alimentacao',
      'template-desafio-7dias', 'template-desafio-21dias', 'guia-hidratacao',
      'avaliacao-intolerancia', 'avaliacao-perfil-metabolico', 'diagnostico-eletrolitos',
      'diagnostico-sintomas-intestinais', 'tipo-fome', 'template-story-interativo',
      'template-diagnostico-parasitose'
    ]) as slug_esperado
  ) te
  WHERE NOT EXISTS (
    SELECT 1 FROM coach_templates_nutrition c
    WHERE c.slug = te.slug_esperado AND c.is_active = true
  );
  
  RAISE NOTICE '========================================';
  RAISE NOTICE 'RESUMO FINAL';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Total de templates: %', total_templates;
  RAISE NOTICE 'Templates ativos: %', ativos_templates;
  RAISE NOTICE 'Templates essenciais faltantes: %', faltantes_templates;
  
  IF faltantes_templates = 0 THEN
    RAISE NOTICE '✅ SUCESSO: Todos os templates essenciais estão disponíveis!';
  ELSE
    RAISE NOTICE '⚠️ ATENÇÃO: Ainda faltam % templates essenciais', faltantes_templates;
  END IF;
END $$;

