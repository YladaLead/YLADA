-- =====================================================
-- VERIFICAÇÃO COMPLETA: Templates Coach no Banco
-- =====================================================
-- Este script lista TODOS os templates Coach que estão no banco
-- para comparar com os 29 templates das imagens
-- =====================================================

-- =====================================================
-- PASSO 1: LISTAR TODOS OS TEMPLATES COACH
-- =====================================================

SELECT 
  ROW_NUMBER() OVER (ORDER BY type, name) as num,
  name as nome,
  slug,
  type as tipo,
  is_active,
  profession,
  language,
  CASE 
    WHEN slug IS NULL OR slug = '' THEN '❌ SEM SLUG'
    WHEN is_active = false THEN '⚠️ INATIVO'
    WHEN profession != 'coach' THEN '⚠️ PROFESSION ERRADO'
    WHEN language != 'pt' THEN '⚠️ LANGUAGE ERRADO'
    ELSE '✅ OK'
  END as status
FROM coach_templates_nutrition
WHERE language = 'pt'
ORDER BY type, name;

-- =====================================================
-- PASSO 2: CONTAGEM POR TIPO
-- =====================================================

SELECT 
  type as tipo,
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE is_active = true) as ativos,
  COUNT(*) FILTER (WHERE is_active = false) as inativos,
  COUNT(*) FILTER (WHERE slug IS NULL OR slug = '') as sem_slug
FROM coach_templates_nutrition
WHERE language = 'pt'
  AND profession = 'coach'
GROUP BY type
ORDER BY type;

-- =====================================================
-- PASSO 3: VERIFICAR TEMPLATES ESPECÍFICOS DAS IMAGENS
-- =====================================================

-- Verificar templates que aparecem nas imagens
SELECT 
  name as nome,
  slug,
  type as tipo,
  is_active,
  CASE 
    WHEN slug IS NULL OR slug = '' THEN '❌ SEM SLUG'
    WHEN is_active = false THEN '⚠️ INATIVO'
    ELSE '✅ OK'
  END as status
FROM coach_templates_nutrition
WHERE language = 'pt'
  AND profession = 'coach'
  AND (
    -- Calculadoras
    LOWER(name) LIKE '%água%' OR LOWER(name) LIKE '%agua%' OR LOWER(name) LIKE '%hidratação%' OR LOWER(name) LIKE '%hidratacao%' OR slug = 'calc-hidratacao' OR slug = 'calculadora-agua'
    OR LOWER(name) LIKE '%caloria%' OR slug = 'calc-calorias' OR slug = 'calculadora-calorias'
    OR LOWER(name) LIKE '%imc%' OR slug = 'calc-imc' OR slug = 'calculadora-imc'
    OR LOWER(name) LIKE '%proteína%' OR LOWER(name) LIKE '%proteina%' OR slug = 'calc-proteina' OR slug = 'calculadora-proteina'
    -- Quizzes/Diagnósticos
    OR LOWER(name) LIKE '%desequilíbrio mineral%' OR LOWER(name) LIKE '%retenção%' OR LOWER(name) LIKE '%retencao%' OR slug = 'retencao-liquidos'
    OR LOWER(name) LIKE '%corporal e nutricional%' OR LOWER(name) LIKE '%conhece seu corpo%' OR LOWER(name) LIKE '%autoconhecimento%' OR slug = 'conhece-seu-corpo'
    OR LOWER(name) LIKE '%comportamento alimentar%' OR LOWER(name) LIKE '%disciplinado%' OR LOWER(name) LIKE '%emocional%' OR slug = 'disciplinado-emocional'
    OR LOWER(name) LIKE '%nutrido%' AND LOWER(name) LIKE '%alimentado%' OR slug = 'nutrido-vs-alimentado'
    OR LOWER(name) LIKE '%alimentando conforme%' OR LOWER(name) LIKE '%rotina%' OR slug = 'alimentacao-rotina'
    OR LOWER(name) LIKE '%sintomas intestinais%' OR slug = 'diagnostico-sintomas-intestinais'
    OR LOWER(name) LIKE '%pronto para emagrecer%' OR slug = 'pronto-emagrecer'
    OR LOWER(name) LIKE '%tipo de fome%' OR slug = 'tipo-fome'
    OR LOWER(name) LIKE '%perfil de intestino%' OR slug = 'perfil-intestino'
    OR LOWER(name) LIKE '%bem-estar%' OR LOWER(name) LIKE '%bem estar%' OR slug = 'quiz-bem-estar' OR slug = 'quiz-wellness-profile'
    OR LOWER(name) LIKE '%perfil nutricional%' OR slug = 'quiz-perfil-nutricional'
    OR LOWER(name) LIKE '%sono%' AND LOWER(name) LIKE '%energia%' OR slug = 'avaliacao-sono-energia'
    OR LOWER(name) LIKE '%avaliação inicial%' OR LOWER(name) LIKE '%avaliacao inicial%' OR slug = 'avaliacao-inicial'
    OR LOWER(name) LIKE '%21 dias%' OR LOWER(name) LIKE '%21dias%' OR slug = 'desafio-21-dias' OR slug = 'template-desafio-21dias'
    OR LOWER(name) LIKE '%perfil de bem-estar%' OR LOWER(name) LIKE '%perfil bem estar%' OR slug = 'quiz-wellness-profile'
    OR LOWER(name) LIKE '%eletrólito%' OR LOWER(name) LIKE '%eletrolito%' OR slug = 'diagnostico-eletrolitos'
    OR LOWER(name) LIKE '%parasitose%' OR slug = 'diagnostico-parasitose' OR slug = 'template-diagnostico-parasitose'
    OR LOWER(name) LIKE '%quiz detox%' OR slug = 'quiz-detox'
    OR LOWER(name) LIKE '%quiz energético%' OR LOWER(name) LIKE '%quiz energetico%' OR slug = 'quiz-energetico'
    OR LOWER(name) LIKE '%quiz interativo%' OR slug = 'quiz-interativo' OR slug = 'template-story-interativo'
    OR LOWER(name) LIKE '%alimentação saudável%' OR LOWER(name) LIKE '%alimentacao saudavel%' OR slug = 'quiz-alimentacao-saudavel' OR slug = 'alimentacao-saudavel'
    OR LOWER(name) LIKE '%síndrome metabólica%' OR LOWER(name) LIKE '%sindrome metabolica%' OR slug = 'sindrome-metabolica'
    OR LOWER(name) LIKE '%corpo está pedindo detox%' OR LOWER(name) LIKE '%corpo esta pedindo detox%' OR slug = 'quiz-pedindo-detox'
    OR LOWER(name) LIKE '%intolerância%' OR LOWER(name) LIKE '%intolerancia%' OR slug = 'avaliacao-intolerancia'
    OR LOWER(name) LIKE '%perfil metabólico%' OR LOWER(name) LIKE '%perfil metabolico%' OR slug = 'avaliacao-perfil-metabolico' OR slug = 'perfil-metabolico'
  )
ORDER BY type, name;

-- =====================================================
-- PASSO 4: VERIFICAR SLUGS ESPECÍFICOS
-- =====================================================

-- Verificar quais slugs esperados NÃO existem (versão corrigida)
WITH slugs_esperados AS (
  SELECT unnest(ARRAY[
    'calc-hidratacao', 'calculadora-agua',
    'calc-calorias', 'calculadora-calorias',
    'calc-imc', 'calculadora-imc',
    'calc-proteina', 'calculadora-proteina',
    'retencao-liquidos',
    'conhece-seu-corpo', 'autoconhecimento-corporal',
    'disciplinado-emocional',
    'nutrido-vs-alimentado',
    'alimentacao-rotina',
    'diagnostico-sintomas-intestinais',
    'pronto-emagrecer',
    'tipo-fome',
    'perfil-intestino',
    'quiz-bem-estar', 'quiz-wellness-profile',
    'quiz-perfil-nutricional',
    'avaliacao-sono-energia',
    'avaliacao-inicial', 'template-avaliacao-inicial',
    'desafio-21-dias', 'template-desafio-21dias',
    'diagnostico-eletrolitos',
    'diagnostico-parasitose', 'template-diagnostico-parasitose',
    'quiz-detox',
    'quiz-energetico',
    'quiz-interativo', 'template-story-interativo',
    'quiz-alimentacao-saudavel', 'alimentacao-saudavel',
    'sindrome-metabolica', 'risco-sindrome-metabolica',
    'quiz-pedindo-detox',
    'avaliacao-intolerancia', 'quiz-intolerancia',
    'avaliacao-perfil-metabolico', 'perfil-metabolico'
  ]) as slug_esperado
)
SELECT 
  se.slug_esperado,
  CASE 
    WHEN c.id IS NOT NULL THEN '✅ EXISTE'
    ELSE '❌ FALTANDO'
  END as status,
  c.name as nome_no_banco,
  c.slug as slug_no_banco
FROM slugs_esperados se
LEFT JOIN coach_templates_nutrition c
  ON c.slug = se.slug_esperado
  AND c.language = 'pt'
  AND c.profession = 'coach'
  AND c.is_active = true
ORDER BY 
  CASE WHEN c.id IS NULL THEN 0 ELSE 1 END,
  se.slug_esperado;

-- Verificar quais slugs esperados NÃO existem
WITH slugs_esperados AS (
  SELECT unnest(ARRAY[
    'calc-hidratacao', 'calculadora-agua',
    'calc-calorias', 'calculadora-calorias',
    'calc-imc', 'calculadora-imc',
    'calc-proteina', 'calculadora-proteina',
    'retencao-liquidos',
    'conhece-seu-corpo', 'autoconhecimento-corporal',
    'disciplinado-emocional',
    'nutrido-vs-alimentado',
    'alimentacao-rotina',
    'diagnostico-sintomas-intestinais',
    'pronto-emagrecer',
    'tipo-fome',
    'perfil-intestino',
    'quiz-bem-estar', 'quiz-wellness-profile',
    'quiz-perfil-nutricional',
    'avaliacao-sono-energia',
    'avaliacao-inicial', 'template-avaliacao-inicial',
    'desafio-21-dias', 'template-desafio-21dias',
    'diagnostico-eletrolitos',
    'diagnostico-parasitose', 'template-diagnostico-parasitose',
    'quiz-detox',
    'quiz-energetico',
    'quiz-interativo', 'template-story-interativo',
    'quiz-alimentacao-saudavel', 'alimentacao-saudavel',
    'sindrome-metabolica', 'risco-sindrome-metabolica',
    'quiz-pedindo-detox',
    'avaliacao-intolerancia', 'quiz-intolerancia',
    'avaliacao-perfil-metabolico', 'perfil-metabolico'
  ]) as slug
)
SELECT 
  se.slug as slug_esperado,
  '❌ FALTANDO' as status
FROM slugs_esperados se
WHERE NOT EXISTS (
  SELECT 1 FROM coach_templates_nutrition c
  WHERE c.slug = se.slug
    AND c.language = 'pt'
    AND c.profession = 'coach'
    AND c.is_active = true
)
ORDER BY se.slug;

-- =====================================================
-- PASSO 5: RESUMO FINAL
-- =====================================================

SELECT 
  'RESUMO FINAL' as info,
  COUNT(*) as total_templates,
  COUNT(*) FILTER (WHERE is_active = true) as ativos,
  COUNT(*) FILTER (WHERE is_active = false) as inativos,
  COUNT(*) FILTER (WHERE slug IS NULL OR slug = '') as sem_slug,
  COUNT(DISTINCT type) as tipos_diferentes
FROM coach_templates_nutrition
WHERE language = 'pt'
  AND profession = 'coach';

-- Listar todos os nomes e slugs para comparação manual
SELECT 
  name as nome_completo,
  slug,
  type as tipo,
  is_active
FROM coach_templates_nutrition
WHERE language = 'pt'
  AND profession = 'coach'
ORDER BY type, name;

