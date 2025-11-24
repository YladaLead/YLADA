-- ===========================================================
-- VERIFICAÇÃO: Templates Extras por Área
-- 
-- Este script identifica templates que NÃO fazem parte
-- dos templates oficiais de cada área
-- ===========================================================

-- ===========================================================
-- 1. TEMPLATES NUTRI (29 oficiais)
-- ===========================================================

-- Listar todos os templates Nutri ativos
SELECT 
  'NUTRI - ATIVOS' as categoria,
  id,
  name,
  slug,
  type,
  is_active,
  CASE 
    WHEN slug IN (
      'quiz-tipo-fome',
      'quiz-alimentacao-nutri',
      'template-diagnostico-parasitose',
      'disciplinado-emocional-nutri',
      'alimentacao-rotina-nutri',
      'desafio-21-dias-nutri',
      'quiz-bem-estar-nutri',
      'quiz-detox-nutri',
      'quiz-energetico-nutri',
      'quiz-interativo-nutri',
      'avaliacao-inicial-nutri',
      'pronto-emagrecer-nutri',
      'avaliacao-intolerancia-nutri',
      'avaliacao-perfil-metabolico-nutri',
      'diagnostico-eletrolitos-nutri',
      'diagnostico-sintomas-intestinais-nutri',
      'sindrome-metabolica-nutri',
      'retencao-liquidos-nutri',
      'conhece-seu-corpo-nutri',
      'nutrido-vs-alimentado-nutri',
      'perfil-intestino',
      'quiz-pedindo-detox',
      'calculadora-agua',
      'calculadora-calorias',
      'calculadora-imc',
      'calculadora-proteina',
      'avaliacao-sono-energia',
      'descoberta-perfil-bem-estar',
      'quiz-perfil-nutricional'
    ) THEN '✅ OFICIAL'
    ELSE '❌ EXTRA (NÃO OFICIAL)'
  END as status
FROM templates_nutrition
WHERE profession = 'nutri'
  AND language = 'pt'
ORDER BY status, name;

-- Contar templates extras
SELECT 
  'NUTRI - RESUMO' as categoria,
  COUNT(*) as total_templates,
  COUNT(CASE WHEN is_active = true THEN 1 END) as ativos,
  COUNT(CASE WHEN slug NOT IN (
    'quiz-tipo-fome',
    'quiz-alimentacao-nutri',
    'template-diagnostico-parasitose',
    'disciplinado-emocional-nutri',
    'alimentacao-rotina-nutri',
    'desafio-21-dias-nutri',
    'quiz-bem-estar-nutri',
    'quiz-detox-nutri',
    'quiz-energetico-nutri',
    'quiz-interativo-nutri',
    'avaliacao-inicial-nutri',
    'pronto-emagrecer-nutri',
    'avaliacao-intolerancia-nutri',
    'avaliacao-perfil-metabolico-nutri',
    'diagnostico-eletrolitos-nutri',
    'diagnostico-sintomas-intestinais-nutri',
    'sindrome-metabolica-nutri',
    'retencao-liquidos-nutri',
    'conhece-seu-corpo-nutri',
    'nutrido-vs-alimentado-nutri',
    'perfil-intestino',
    'quiz-pedindo-detox',
    'calculadora-agua',
    'calculadora-calorias',
    'calculadora-imc',
    'calculadora-proteina',
    'avaliacao-sono-energia',
    'descoberta-perfil-bem-estar',
    'quiz-perfil-nutricional'
  ) THEN 1 END) as templates_extras
FROM templates_nutrition
WHERE profession = 'nutri'
  AND language = 'pt';

-- ===========================================================
-- 2. TEMPLATES WELLNESS
-- ===========================================================

-- Listar todos os templates Wellness ativos
SELECT 
  'WELLNESS - ATIVOS' as categoria,
  id,
  name,
  slug,
  type,
  is_active
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
ORDER BY name;

-- Contar templates Wellness
SELECT 
  'WELLNESS - RESUMO' as categoria,
  COUNT(*) as total_templates,
  COUNT(CASE WHEN is_active = true THEN 1 END) as ativos
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt';

-- ===========================================================
-- 3. TEMPLATES COACH
-- ===========================================================

-- Listar todos os templates Coach ativos
SELECT 
  'COACH - ATIVOS' as categoria,
  id,
  name,
  slug,
  type,
  is_active
FROM templates_nutrition
WHERE profession = 'coach'
  AND language = 'pt'
ORDER BY name;

-- Contar templates Coach
SELECT 
  'COACH - RESUMO' as categoria,
  COUNT(*) as total_templates,
  COUNT(CASE WHEN is_active = true THEN 1 END) as ativos
FROM templates_nutrition
WHERE profession = 'coach'
  AND language = 'pt';

-- ===========================================================
-- 4. TEMPLATES COM SLUGS PROBLEMÁTICOS
-- ===========================================================

-- Templates Nutri com slugs que não são oficiais
SELECT 
  'NUTRI - SLUGS PROBLEMÁTICOS' as categoria,
  id,
  name,
  slug,
  is_active,
  'Possível template extra ou slug incorreto' as observacao
FROM templates_nutrition
WHERE profession = 'nutri'
  AND language = 'pt'
  AND slug NOT IN (
    'quiz-tipo-fome',
    'quiz-alimentacao-nutri',
    'template-diagnostico-parasitose',
    'disciplinado-emocional-nutri',
    'alimentacao-rotina-nutri',
    'desafio-21-dias-nutri',
    'quiz-bem-estar-nutri',
    'quiz-detox-nutri',
    'quiz-energetico-nutri',
    'quiz-interativo-nutri',
    'avaliacao-inicial-nutri',
    'pronto-emagrecer-nutri',
    'avaliacao-intolerancia-nutri',
    'avaliacao-perfil-metabolico-nutri',
    'diagnostico-eletrolitos-nutri',
    'diagnostico-sintomas-intestinais-nutri',
    'sindrome-metabolica-nutri',
    'retencao-liquidos-nutri',
    'conhece-seu-corpo-nutri',
    'nutrido-vs-alimentado-nutri',
    'perfil-intestino',
    'quiz-pedindo-detox',
    'calculadora-agua',
    'calculadora-calorias',
    'calculadora-imc',
    'calculadora-proteina',
    'avaliacao-sono-energia',
    'descoberta-perfil-bem-estar',
    'quiz-perfil-nutricional'
  )
ORDER BY name;

