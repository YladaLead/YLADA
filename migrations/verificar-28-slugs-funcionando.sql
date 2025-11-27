-- =====================================================
-- VERIFICAR: 28 Slugs Funcionando
-- Verifica se todos os 28 templates estão ativos e com slugs corretos
-- =====================================================

-- Lista dos 28 slugs válidos
WITH slugs_validos AS (
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
  ) AS t(slug_valido)
)
-- Verificar quais slugs estão no banco e ativos
SELECT 
  sv.slug_valido,
  CASE 
    WHEN ct.id IS NOT NULL AND ct.is_active = true THEN '✅ ATIVO E CORRETO'
    WHEN ct.id IS NOT NULL AND ct.is_active = false THEN '❌ INATIVO'
    WHEN ct.id IS NULL THEN '❌ NÃO ENCONTRADO'
  END as status,
  ct.name as nome_no_banco,
  ct.slug as slug_no_banco,
  ct.type as tipo,
  ct.is_active,
  ct.profession,
  ct.language
FROM slugs_validos sv
LEFT JOIN coach_templates_nutrition ct ON sv.slug_valido = ct.slug
  AND ct.profession = 'coach'
  AND ct.language = 'pt'
ORDER BY 
  CASE 
    WHEN ct.id IS NOT NULL AND ct.is_active = true THEN 1
    WHEN ct.id IS NOT NULL AND ct.is_active = false THEN 2
    WHEN ct.id IS NULL THEN 3
  END,
  sv.slug_valido;

-- =====================================================
-- RESUMO FINAL
-- =====================================================
WITH slugs_validos AS (
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
  ) AS t(slug_valido)
)
SELECT 
  '📊 RESUMO FINAL' as info,
  COUNT(*) as total_slugs_validos,
  COUNT(ct.id) FILTER (WHERE ct.is_active = true) as templates_ativos_corretos,
  COUNT(ct.id) FILTER (WHERE ct.is_active = false) as templates_inativos,
  COUNT(*) FILTER (WHERE ct.id IS NULL) as templates_nao_encontrados,
  CASE 
    WHEN COUNT(ct.id) FILTER (WHERE ct.is_active = true) = 28 THEN '✅ TODOS OS 28 ESTÃO ATIVOS'
    ELSE '⚠️ FALTAM TEMPLATES'
  END as status_final
FROM slugs_validos sv
LEFT JOIN coach_templates_nutrition ct ON sv.slug_valido = ct.slug
  AND ct.profession = 'coach'
  AND ct.language = 'pt';

-- =====================================================
-- LISTAR TEMPLATES QUE SERÃO RETORNADOS PELA API
-- (após a validação que adicionamos)
-- =====================================================
SELECT 
  '✅ TEMPLATES QUE SERÃO RETORNADOS PELA API' as status,
  name as nome,
  slug,
  type as tipo,
  is_active,
  profession,
  language
FROM coach_templates_nutrition
WHERE is_active = true
  AND profession = 'coach'
  AND language = 'pt'
  AND slug IN (
    'calc-hidratacao',
    'calc-calorias',
    'calc-imc',
    'calc-proteina',
    'retencao-liquidos',
    'conhece-seu-corpo',
    'disciplinado-emocional',
    'nutrido-vs-alimentado',
    'alimentacao-rotina',
    'diagnostico-sintomas-intestinais',
    'pronto-emagrecer',
    'tipo-fome',
    'perfil-intestino',
    'quiz-bem-estar',
    'quiz-perfil-nutricional',
    'avaliacao-sono-energia',
    'avaliacao-inicial',
    'template-desafio-21dias',
    'diagnostico-eletrolitos',
    'diagnostico-parasitose',
    'quiz-detox',
    'quiz-energetico',
    'quiz-interativo',
    'quiz-alimentacao-saudavel',
    'sindrome-metabolica',
    'quiz-pedindo-detox',
    'avaliacao-intolerancia',
    'avaliacao-perfil-metabolico'
  )
ORDER BY name;

