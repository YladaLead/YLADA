-- =====================================================
-- COMPARAR: 29 TEMPLATES ESPERADOS vs BANCO
-- Este script compara os 29 templates das imagens
-- com o que realmente está no banco e aparece no preview
-- =====================================================

-- =====================================================
-- 1. TEMPLATES QUE ESTÃO NO BANCO E APARECEM NO PREVIEW
-- =====================================================
WITH templates_esperados AS (
  SELECT * FROM (VALUES
    ('Calculadora de Água', 'calc-hidratacao', 'calculadora'),
    ('Calculadora de Calorias', 'calc-calorias', 'calculadora'),
    ('Calculadora de IMC', 'calc-imc', 'calculadora'),
    ('Calculadora de Proteína', 'calc-proteina', 'calculadora'),
    ('Teste de Retenção de Líquidos', 'retencao-liquidos', 'quiz'),
    ('Você conhece o seu corpo?', 'conhece-seu-corpo', 'quiz'),
    ('Você é mais disciplinado ou emocional com a comida?', 'disciplinado-emocional', 'quiz'),
    ('Você está nutrido ou apenas alimentado?', 'nutrido-vs-alimentado', 'quiz'),
    ('Você está se alimentando conforme sua rotina?', 'alimentacao-rotina', 'quiz'),
    ('Diagnóstico de Sintomas Intestinais', 'diagnostico-sintomas-intestinais', 'diagnostico'),
    ('Pronto para Emagrecer com Saúde?', 'pronto-emagrecer', 'quiz'),
    ('Qual é o seu Tipo de Fome?', 'tipo-fome', 'quiz'),
    ('Qual é seu perfil de intestino?', 'perfil-intestino', 'quiz'),
    ('Quiz de Bem-Estar', 'quiz-bem-estar', 'quiz'),
    ('Quiz de Perfil Nutricional', 'quiz-perfil-nutricional', 'quiz'),
    ('Avaliação do Sono e Energia', 'avaliacao-sono-energia', 'quiz'),
    ('Avaliação Inicial', 'avaliacao-inicial', 'quiz'),
    ('Desafio 21 Dias', 'template-desafio-21dias', 'checklist'),
    ('Diagnóstico de Eletrólitos', 'diagnostico-eletrolitos', 'diagnostico'),
    ('Diagnóstico de Parasitose', 'diagnostico-parasitose', 'diagnostico'),
    ('Quiz Detox', 'quiz-detox', 'quiz'),
    ('Quiz Energético', 'quiz-energetico', 'quiz'),
    ('Quiz Interativo', 'quiz-interativo', 'quiz'),
    ('Quiz: Alimentação Saudável', 'quiz-alimentacao-saudavel', 'quiz'),
    ('Risco de Síndrome Metabólica', 'sindrome-metabolica', 'quiz'),
    ('Seu corpo está pedindo Detox?', 'quiz-pedindo-detox', 'quiz'),
    ('Avaliação de Intolerâncias/Sensibilidades', 'avaliacao-intolerancia', 'quiz'),
    ('Avaliação do Perfil Metabólico', 'avaliacao-perfil-metabolico', 'quiz'),
    ('Descubra seu Perfil de Bem-Estar', 'quiz-bem-estar', 'quiz')
  ) AS t(nome_esperado, slug_esperado, tipo_esperado)
),
templates_no_banco AS (
  SELECT 
    id,
    name,
    slug,
    type,
    description,
    is_active,
    profession,
    language
  FROM coach_templates_nutrition
  WHERE is_active = true
    AND profession = 'coach'
    AND language = 'pt'
)
SELECT 
  '✅ TEMPLATES NO BANCO (aparecem no preview)' as status,
  tb.name as nome_banco,
  tb.slug as slug_banco,
  tb.type as tipo_banco,
  CASE 
    WHEN te.nome_esperado IS NOT NULL THEN '✅ ESTÁ NA LISTA DOS 29'
    ELSE '⚠️ NÃO ESTÁ NA LISTA DOS 29'
  END as status_esperado
FROM templates_no_banco tb
LEFT JOIN templates_esperados te ON tb.slug = te.slug_esperado
ORDER BY 
  CASE WHEN te.nome_esperado IS NOT NULL THEN 0 ELSE 1 END,
  tb.name;

-- =====================================================
-- 2. TEMPLATES ESPERADOS QUE NÃO ESTÃO NO BANCO
-- =====================================================
WITH templates_esperados AS (
  SELECT * FROM (VALUES
    ('Calculadora de Água', 'calc-hidratacao', 'calculadora'),
    ('Calculadora de Calorias', 'calc-calorias', 'calculadora'),
    ('Calculadora de IMC', 'calc-imc', 'calculadora'),
    ('Calculadora de Proteína', 'calc-proteina', 'calculadora'),
    ('Teste de Retenção de Líquidos', 'retencao-liquidos', 'quiz'),
    ('Você conhece o seu corpo?', 'conhece-seu-corpo', 'quiz'),
    ('Você é mais disciplinado ou emocional com a comida?', 'disciplinado-emocional', 'quiz'),
    ('Você está nutrido ou apenas alimentado?', 'nutrido-vs-alimentado', 'quiz'),
    ('Você está se alimentando conforme sua rotina?', 'alimentacao-rotina', 'quiz'),
    ('Diagnóstico de Sintomas Intestinais', 'diagnostico-sintomas-intestinais', 'diagnostico'),
    ('Pronto para Emagrecer com Saúde?', 'pronto-emagrecer', 'quiz'),
    ('Qual é o seu Tipo de Fome?', 'tipo-fome', 'quiz'),
    ('Qual é seu perfil de intestino?', 'perfil-intestino', 'quiz'),
    ('Quiz de Bem-Estar', 'quiz-bem-estar', 'quiz'),
    ('Quiz de Perfil Nutricional', 'quiz-perfil-nutricional', 'quiz'),
    ('Avaliação do Sono e Energia', 'avaliacao-sono-energia', 'quiz'),
    ('Avaliação Inicial', 'avaliacao-inicial', 'quiz'),
    ('Desafio 21 Dias', 'template-desafio-21dias', 'checklist'),
    ('Diagnóstico de Eletrólitos', 'diagnostico-eletrolitos', 'diagnostico'),
    ('Diagnóstico de Parasitose', 'diagnostico-parasitose', 'diagnostico'),
    ('Quiz Detox', 'quiz-detox', 'quiz'),
    ('Quiz Energético', 'quiz-energetico', 'quiz'),
    ('Quiz Interativo', 'quiz-interativo', 'quiz'),
    ('Quiz: Alimentação Saudável', 'quiz-alimentacao-saudavel', 'quiz'),
    ('Risco de Síndrome Metabólica', 'sindrome-metabolica', 'quiz'),
    ('Seu corpo está pedindo Detox?', 'quiz-pedindo-detox', 'quiz'),
    ('Avaliação de Intolerâncias/Sensibilidades', 'avaliacao-intolerancia', 'quiz'),
    ('Avaliação do Perfil Metabólico', 'avaliacao-perfil-metabolico', 'quiz'),
    ('Descubra seu Perfil de Bem-Estar', 'quiz-bem-estar', 'quiz')
  ) AS t(nome_esperado, slug_esperado, tipo_esperado)
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
  '❌ TEMPLATES FALTANTES (esperados mas não no banco)' as status,
  te.nome_esperado,
  te.slug_esperado,
  te.tipo_esperado,
  'FALTANDO' as status_banco
FROM templates_esperados te
LEFT JOIN templates_no_banco tb ON te.slug_esperado = tb.slug
WHERE tb.id IS NULL
ORDER BY te.nome_esperado;

-- =====================================================
-- 3. TEMPLATES NO BANCO QUE NÃO ESTÃO NA LISTA DOS 29
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
  '⚠️ TEMPLATES EXTRAS (no banco mas não na lista dos 29)' as status,
  tb.name as nome_banco,
  tb.slug as slug_banco,
  tb.type as tipo_banco,
  'EXTRA' as status_esperado
FROM templates_no_banco tb
LEFT JOIN templates_esperados te ON tb.slug = te.slug_esperado
WHERE te.slug_esperado IS NULL
ORDER BY tb.name;

-- =====================================================
-- 4. RESUMO FINAL
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
    slug
  FROM coach_templates_nutrition
  WHERE is_active = true
    AND profession = 'coach'
    AND language = 'pt'
)
SELECT 
  '📊 RESUMO FINAL' as info,
  (SELECT COUNT(*) FROM templates_esperados) as total_esperados,
  (SELECT COUNT(*) FROM templates_no_banco) as total_no_banco,
  (SELECT COUNT(*) FROM templates_esperados te 
   JOIN templates_no_banco tb ON te.slug_esperado = tb.slug) as total_corretos,
  (SELECT COUNT(*) FROM templates_esperados te 
   LEFT JOIN templates_no_banco tb ON te.slug_esperado = tb.slug 
   WHERE tb.id IS NULL) as total_faltantes,
  (SELECT COUNT(*) FROM templates_no_banco tb 
   LEFT JOIN templates_esperados te ON tb.slug = te.slug_esperado 
   WHERE te.slug_esperado IS NULL) as total_extras;

