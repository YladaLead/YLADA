-- =====================================================
-- COMPARAR: Templates no Preview vs Esperados
-- Lista lado a lado para identificar qual está faltando
-- =====================================================

-- Lista dos 28 templates que já temos confirmados
WITH templates_esperados AS (
  SELECT * FROM (VALUES
    ('calc-hidratacao', 'Calculadora de Água'),
    ('calc-calorias', 'Calculadora de Calorias'),
    ('calc-imc', 'Calculadora de IMC'),
    ('calc-proteina', 'Calculadora de Proteína'),
    ('retencao-liquidos', 'Teste de Retenção de Líquidos'),
    ('conhece-seu-corpo', 'Você conhece o seu corpo?'),
    ('disciplinado-emocional', 'Você é mais disciplinado ou emocional com a comida?'),
    ('nutrido-vs-alimentado', 'Você está nutrido ou apenas alimentado?'),
    ('alimentacao-rotina', 'Você está se alimentando conforme sua rotina?'),
    ('diagnostico-sintomas-intestinais', 'Diagnóstico de Sintomas Intestinais'),
    ('pronto-emagrecer', 'Pronto para Emagrecer com Saúde?'),
    ('tipo-fome', 'Qual é o seu Tipo de Fome?'),
    ('perfil-intestino', 'Qual é seu perfil de intestino?'),
    ('quiz-bem-estar', 'Quiz de Bem-Estar'),
    ('quiz-perfil-nutricional', 'Quiz de Perfil Nutricional'),
    ('avaliacao-sono-energia', 'Avaliação do Sono e Energia'),
    ('avaliacao-inicial', 'Avaliação Inicial'),
    ('template-desafio-21dias', 'Desafio 21 Dias'),
    ('diagnostico-eletrolitos', 'Diagnóstico de Eletrólitos'),
    ('diagnostico-parasitose', 'Diagnóstico de Parasitose'),
    ('quiz-detox', 'Quiz Detox'),
    ('quiz-energetico', 'Quiz Energético'),
    ('quiz-interativo', 'Quiz Interativo'),
    ('quiz-alimentacao-saudavel', 'Quiz: Alimentação Saudável'),
    ('sindrome-metabolica', 'Risco de Síndrome Metabólica'),
    ('quiz-pedindo-detox', 'Seu corpo está pedindo Detox?'),
    ('avaliacao-intolerancia', 'Avaliação de Intolerâncias/Sensibilidades'),
    ('avaliacao-perfil-metabolico', 'Avaliação do Perfil Metabólico')
  ) AS t(slug_esperado, nome_esperado)
),
templates_no_preview AS (
  SELECT 
    name as nome_preview,
    slug as slug_preview,
    type as tipo_preview
  FROM coach_templates_nutrition
  WHERE is_active = true
    AND profession = 'coach'
    AND language = 'pt'
  ORDER BY name
)
-- =====================================================
-- COMPARAÇÃO LADO A LADO
-- =====================================================
-- Templates esperados vs Preview (FULL OUTER JOIN)
SELECT 
  COALESCE(te.nome_esperado, '❌ FALTANDO') as nome_esperado,
  COALESCE(te.slug_esperado, '---') as slug_esperado,
  COALESCE(tp.nome_preview, '❌ NÃO NO PREVIEW') as nome_no_preview,
  COALESCE(tp.slug_preview, '---') as slug_no_preview,
  CASE 
    WHEN te.slug_esperado IS NOT NULL AND tp.slug_preview IS NOT NULL THEN '✅ PRESENTE'
    WHEN te.slug_esperado IS NOT NULL AND tp.slug_preview IS NULL THEN '❌ FALTANDO NO PREVIEW'
    WHEN te.slug_esperado IS NULL AND tp.slug_preview IS NOT NULL THEN '⚠️ EXTRA NO PREVIEW'
  END as status
FROM templates_esperados te
FULL OUTER JOIN templates_no_preview tp ON te.slug_esperado = tp.slug_preview
ORDER BY 
  CASE 
    WHEN te.slug_esperado IS NOT NULL AND tp.slug_preview IS NOT NULL THEN 1
    WHEN te.slug_esperado IS NOT NULL AND tp.slug_preview IS NULL THEN 2
    WHEN te.slug_esperado IS NULL AND tp.slug_preview IS NOT NULL THEN 3
  END,
  COALESCE(te.nome_esperado, tp.nome_preview);

-- =====================================================
-- LISTAR APENAS OS TEMPLATES NO PREVIEW (ORDENADOS)
-- =====================================================
SELECT 
  ROW_NUMBER() OVER (ORDER BY name) as numero,
  name as nome_no_preview,
  slug as slug_no_preview,
  type as tipo,
  CASE 
    WHEN slug IN (
      'calc-hidratacao', 'calc-calorias', 'calc-imc', 'calc-proteina',
      'retencao-liquidos', 'conhece-seu-corpo', 'disciplinado-emocional',
      'nutrido-vs-alimentado', 'alimentacao-rotina', 'diagnostico-sintomas-intestinais',
      'pronto-emagrecer', 'tipo-fome', 'perfil-intestino', 'quiz-bem-estar',
      'quiz-perfil-nutricional', 'avaliacao-sono-energia', 'avaliacao-inicial',
      'template-desafio-21dias', 'diagnostico-eletrolitos', 'diagnostico-parasitose',
      'quiz-detox', 'quiz-energetico', 'quiz-interativo', 'quiz-alimentacao-saudavel',
      'sindrome-metabolica', 'quiz-pedindo-detox', 'avaliacao-intolerancia',
      'avaliacao-perfil-metabolico'
    ) THEN '✅ ESTÁ NA LISTA'
    ELSE '⚠️ NÃO ESTÁ NA LISTA'
  END as status
FROM coach_templates_nutrition
WHERE is_active = true
  AND profession = 'coach'
  AND language = 'pt'
ORDER BY name;

-- =====================================================
-- LISTAR APENAS OS 28 ESPERADOS (ORDENADOS)
-- =====================================================
SELECT 
  ROW_NUMBER() OVER (ORDER BY nome_esperado) as numero,
  nome_esperado,
  slug_esperado,
  CASE 
    WHEN slug_esperado IN (
      SELECT slug FROM coach_templates_nutrition
      WHERE is_active = true AND profession = 'coach' AND language = 'pt'
    ) THEN '✅ NO PREVIEW'
    ELSE '❌ FALTANDO'
  END as status
FROM (VALUES
  ('calc-hidratacao', 'Calculadora de Água'),
  ('calc-calorias', 'Calculadora de Calorias'),
  ('calc-imc', 'Calculadora de IMC'),
  ('calc-proteina', 'Calculadora de Proteína'),
  ('retencao-liquidos', 'Teste de Retenção de Líquidos'),
  ('conhece-seu-corpo', 'Você conhece o seu corpo?'),
  ('disciplinado-emocional', 'Você é mais disciplinado ou emocional com a comida?'),
  ('nutrido-vs-alimentado', 'Você está nutrido ou apenas alimentado?'),
  ('alimentacao-rotina', 'Você está se alimentando conforme sua rotina?'),
  ('diagnostico-sintomas-intestinais', 'Diagnóstico de Sintomas Intestinais'),
  ('pronto-emagrecer', 'Pronto para Emagrecer com Saúde?'),
  ('tipo-fome', 'Qual é o seu Tipo de Fome?'),
  ('perfil-intestino', 'Qual é seu perfil de intestino?'),
  ('quiz-bem-estar', 'Quiz de Bem-Estar'),
  ('quiz-perfil-nutricional', 'Quiz de Perfil Nutricional'),
  ('avaliacao-sono-energia', 'Avaliação do Sono e Energia'),
  ('avaliacao-inicial', 'Avaliação Inicial'),
  ('template-desafio-21dias', 'Desafio 21 Dias'),
  ('diagnostico-eletrolitos', 'Diagnóstico de Eletrólitos'),
  ('diagnostico-parasitose', 'Diagnóstico de Parasitose'),
  ('quiz-detox', 'Quiz Detox'),
  ('quiz-energetico', 'Quiz Energético'),
  ('quiz-interativo', 'Quiz Interativo'),
  ('quiz-alimentacao-saudavel', 'Quiz: Alimentação Saudável'),
  ('sindrome-metabolica', 'Risco de Síndrome Metabólica'),
  ('quiz-pedindo-detox', 'Seu corpo está pedindo Detox?'),
  ('avaliacao-intolerancia', 'Avaliação de Intolerâncias/Sensibilidades'),
  ('avaliacao-perfil-metabolico', 'Avaliação do Perfil Metabólico')
) AS t(slug_esperado, nome_esperado)
ORDER BY nome_esperado;

