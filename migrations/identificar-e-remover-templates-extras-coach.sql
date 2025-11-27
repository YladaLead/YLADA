-- =====================================================
-- IDENTIFICAR E REMOVER TEMPLATES EXTRAS: Coach
-- Este script identifica templates que não estão na lista dos 29
-- e os remove (ou desativa) do banco
-- =====================================================

-- =====================================================
-- 1. IDENTIFICAR TEMPLATES EXTRAS
-- =====================================================
WITH templates_esperados AS (
  SELECT * FROM (VALUES
    ('calc-hidratacao'),
    ('calc-calorias'),
    ('calc-imc'),
    ('calc-proteina'),
    ('retencao-liquidos'),
    ('conhece-seu-corpo'),
    ('disciplinado-emocional'),
    ('nutrido-vs-alimentado'),
    ('alimentacao-rotina'),
    ('diagnostico-sintomas-intestinais'),
    ('pronto-emagrecer'),
    ('tipo-fome'),
    ('perfil-intestino'),
    ('quiz-bem-estar'),
    ('quiz-perfil-nutricional'),
    ('avaliacao-sono-energia'),
    ('avaliacao-inicial'),
    ('template-desafio-21dias'),
    ('diagnostico-eletrolitos'),
    ('diagnostico-parasitose'),
    ('quiz-detox'),
    ('quiz-energetico'),
    ('quiz-interativo'),
    ('quiz-alimentacao-saudavel'),
    ('sindrome-metabolica'),
    ('quiz-pedindo-detox'),
    ('avaliacao-intolerancia'),
    ('avaliacao-perfil-metabolico')
  ) AS t(slug_esperado)
),
templates_no_banco AS (
  SELECT 
    id,
    name,
    slug,
    type,
    is_active
  FROM coach_templates_nutrition
  WHERE is_active = true
    AND profession = 'coach'
    AND language = 'pt'
)
SELECT 
  '⚠️ TEMPLATES EXTRAS (serão desativados)' as status,
  tb.id,
  tb.name as nome,
  tb.slug,
  tb.type as tipo
FROM templates_no_banco tb
LEFT JOIN templates_esperados te ON tb.slug = te.slug_esperado
WHERE te.slug_esperado IS NULL
ORDER BY tb.name;

-- =====================================================
-- 2. DESATIVAR TEMPLATES EXTRAS (NÃO REMOVER, APENAS DESATIVAR)
-- =====================================================
-- IMPORTANTE: Este script DESATIVA os templates extras ao invés de removê-los
-- Isso preserva os dados caso seja necessário reativá-los no futuro

WITH templates_esperados AS (
  SELECT * FROM (VALUES
    ('calc-hidratacao'),
    ('calc-calorias'),
    ('calc-imc'),
    ('calc-proteina'),
    ('retencao-liquidos'),
    ('conhece-seu-corpo'),
    ('disciplinado-emocional'),
    ('nutrido-vs-alimentado'),
    ('alimentacao-rotina'),
    ('diagnostico-sintomas-intestinais'),
    ('pronto-emagrecer'),
    ('tipo-fome'),
    ('perfil-intestino'),
    ('quiz-bem-estar'),
    ('quiz-perfil-nutricional'),
    ('avaliacao-sono-energia'),
    ('avaliacao-inicial'),
    ('template-desafio-21dias'),
    ('diagnostico-eletrolitos'),
    ('diagnostico-parasitose'),
    ('quiz-detox'),
    ('quiz-energetico'),
    ('quiz-interativo'),
    ('quiz-alimentacao-saudavel'),
    ('sindrome-metabolica'),
    ('quiz-pedindo-detox'),
    ('avaliacao-intolerancia'),
    ('avaliacao-perfil-metabolico')
  ) AS t(slug_esperado)
),
templates_extras AS (
  SELECT tb.id
  FROM coach_templates_nutrition tb
  LEFT JOIN templates_esperados te ON tb.slug = te.slug_esperado
  WHERE tb.is_active = true
    AND tb.profession = 'coach'
    AND tb.language = 'pt'
    AND te.slug_esperado IS NULL
)
UPDATE coach_templates_nutrition
SET is_active = false
WHERE id IN (SELECT id FROM templates_extras);

-- =====================================================
-- 3. VERIFICAÇÃO FINAL
-- =====================================================
SELECT 
  '📊 VERIFICAÇÃO FINAL' as info,
  COUNT(*) FILTER (WHERE is_active = true) as templates_ativos,
  COUNT(*) FILTER (WHERE is_active = false) as templates_desativados,
  COUNT(*) as total_templates
FROM coach_templates_nutrition
WHERE profession = 'coach'
  AND language = 'pt';

-- =====================================================
-- 4. LISTAR APENAS OS 29 TEMPLATES ATIVOS (CORRETOS)
-- =====================================================
SELECT 
  name as nome,
  slug,
  type as tipo,
  '✅ ATIVO' as status
FROM coach_templates_nutrition
WHERE is_active = true
  AND profession = 'coach'
  AND language = 'pt'
  AND slug IN (
    'calc-hidratacao', 'calc-calorias', 'calc-imc', 'calc-proteina',
    'retencao-liquidos', 'conhece-seu-corpo', 'disciplinado-emocional',
    'nutrido-vs-alimentado', 'alimentacao-rotina', 'diagnostico-sintomas-intestinais',
    'pronto-emagrecer', 'tipo-fome', 'perfil-intestino', 'quiz-bem-estar',
    'quiz-perfil-nutricional', 'avaliacao-sono-energia', 'avaliacao-inicial',
    'template-desafio-21dias', 'diagnostico-eletrolitos', 'diagnostico-parasitose',
    'quiz-detox', 'quiz-energetico', 'quiz-interativo', 'quiz-alimentacao-saudavel',
    'sindrome-metabolica', 'quiz-pedindo-detox', 'avaliacao-intolerancia',
    'avaliacao-perfil-metabolico'
  )
ORDER BY name;

