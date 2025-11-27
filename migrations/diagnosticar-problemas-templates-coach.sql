-- =====================================================
-- DIAGNOSTICAR PROBLEMAS: Templates Coach
-- Este script mostra detalhadamente quais templates
-- estão corretos, quais têm slugs errados, e quais são extras
-- =====================================================

-- =====================================================
-- 1. TEMPLATES CORRETOS (slug esperado = slug no banco)
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
    type
  FROM coach_templates_nutrition
  WHERE is_active = true
    AND profession = 'coach'
    AND language = 'pt'
)
SELECT 
  '✅ CORRETOS' as status,
  tb.name as nome_banco,
  tb.slug as slug_banco,
  te.slug_esperado as slug_esperado,
  tb.type as tipo
FROM templates_esperados te
JOIN templates_no_banco tb ON te.slug_esperado = tb.slug
ORDER BY tb.name;

-- =====================================================
-- 2. TEMPLATES FALTANTES (esperados mas não no banco)
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
  SELECT slug FROM coach_templates_nutrition
  WHERE is_active = true AND profession = 'coach' AND language = 'pt'
)
SELECT 
  '❌ FALTANTES' as status,
  te.slug_esperado,
  'NÃO ENCONTRADO NO BANCO' as observacao
FROM templates_esperados te
LEFT JOIN templates_no_banco tb ON te.slug_esperado = tb.slug
WHERE tb.slug IS NULL
ORDER BY te.slug_esperado;

-- =====================================================
-- 3. TEMPLATES EXTRAS (no banco mas não esperados)
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
    type
  FROM coach_templates_nutrition
  WHERE is_active = true
    AND profession = 'coach'
    AND language = 'pt'
)
SELECT 
  '⚠️ EXTRAS' as status,
  tb.id,
  tb.name as nome_banco,
  tb.slug as slug_banco,
  tb.type as tipo,
  'NÃO ESTÁ NA LISTA DOS 29' as observacao
FROM templates_no_banco tb
LEFT JOIN templates_esperados te ON tb.slug = te.slug_esperado
WHERE te.slug_esperado IS NULL
ORDER BY tb.name;

-- =====================================================
-- 4. TEMPLATES COM SLUGS DIFERENTES (mesmo nome, slug diferente)
-- =====================================================
-- Esta query tenta encontrar templates que podem ter o nome correto
-- mas slug diferente do esperado
WITH templates_esperados AS (
  SELECT * FROM (VALUES
    ('Calculadora de Água', 'calc-hidratacao'),
    ('Calculadora de Calorias', 'calc-calorias'),
    ('Calculadora de IMC', 'calc-imc'),
    ('Calculadora de Proteína', 'calc-proteina'),
    ('Teste de Retenção de Líquidos', 'retencao-liquidos'),
    ('Você conhece o seu corpo?', 'conhece-seu-corpo'),
    ('Você é mais disciplinado ou emocional com a comida?', 'disciplinado-emocional'),
    ('Você está nutrido ou apenas alimentado?', 'nutrido-vs-alimentado'),
    ('Você está se alimentando conforme sua rotina?', 'alimentacao-rotina'),
    ('Diagnóstico de Sintomas Intestinais', 'diagnostico-sintomas-intestinais'),
    ('Pronto para Emagrecer com Saúde?', 'pronto-emagrecer'),
    ('Qual é o seu Tipo de Fome?', 'tipo-fome'),
    ('Qual é seu perfil de intestino?', 'perfil-intestino'),
    ('Quiz de Bem-Estar', 'quiz-bem-estar'),
    ('Quiz de Perfil Nutricional', 'quiz-perfil-nutricional'),
    ('Avaliação do Sono e Energia', 'avaliacao-sono-energia'),
    ('Avaliação Inicial', 'avaliacao-inicial'),
    ('Desafio 21 Dias', 'template-desafio-21dias'),
    ('Diagnóstico de Eletrólitos', 'diagnostico-eletrolitos'),
    ('Diagnóstico de Parasitose', 'diagnostico-parasitose'),
    ('Quiz Detox', 'quiz-detox'),
    ('Quiz Energético', 'quiz-energetico'),
    ('Quiz Interativo', 'quiz-interativo'),
    ('Quiz: Alimentação Saudável', 'quiz-alimentacao-saudavel'),
    ('Risco de Síndrome Metabólica', 'sindrome-metabolica'),
    ('Seu corpo está pedindo Detox?', 'quiz-pedindo-detox'),
    ('Avaliação de Intolerâncias/Sensibilidades', 'avaliacao-intolerancia'),
    ('Avaliação do Perfil Metabólico', 'avaliacao-perfil-metabolico')
  ) AS t(nome_esperado, slug_esperado)
),
templates_no_banco AS (
  SELECT 
    id,
    name,
    slug,
    type
  FROM coach_templates_nutrition
  WHERE is_active = true
    AND profession = 'coach'
    AND language = 'pt'
)
SELECT 
  '🔄 SLUG DIFERENTE' as status,
  te.nome_esperado,
  te.slug_esperado as slug_esperado,
  tb.slug as slug_atual,
  tb.id,
  tb.name as nome_banco,
  tb.type as tipo
FROM templates_esperados te
JOIN templates_no_banco tb ON LOWER(TRIM(tb.name)) = LOWER(TRIM(te.nome_esperado))
WHERE tb.slug != te.slug_esperado
ORDER BY te.nome_esperado;

