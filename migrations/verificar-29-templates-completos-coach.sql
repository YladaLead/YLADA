-- =====================================================
-- VERIFICAR OS 29 TEMPLATES COMPLETOS: Coach
-- Baseado nas imagens fornecidas, verificar se todos estão presentes
-- =====================================================

-- Lista completa dos 29 templates baseada nas imagens
WITH templates_esperados_completos AS (
  SELECT * FROM (VALUES
    -- CALCULADORAS (4)
    ('calc-hidratacao', 'Calculadora de Água', 'calculadora'),
    ('calc-calorias', 'Calculadora de Calorias', 'calculadora'),
    ('calc-imc', 'Calculadora de IMC', 'calculadora'),
    ('calc-proteina', 'Calculadora de Proteína', 'calculadora'),
    
    -- QUIZZES/DIAGNÓSTICOS (25)
    ('retencao-liquidos', 'Teste de Retenção de Líquidos', 'quiz'),
    ('conhece-seu-corpo', 'Você conhece o seu corpo?', 'quiz'),
    ('disciplinado-emocional', 'Você é mais disciplinado ou emocional com a comida?', 'quiz'),
    ('nutrido-vs-alimentado', 'Você está nutrido ou apenas alimentado?', 'quiz'),
    ('alimentacao-rotina', 'Você está se alimentando conforme sua rotina?', 'quiz'),
    ('diagnostico-sintomas-intestinais', 'Diagnóstico de Sintomas Intestinais', 'quiz'),
    ('pronto-emagrecer', 'Pronto para Emagrecer com Saúde?', 'quiz'),
    ('tipo-fome', 'Qual é o seu Tipo de Fome?', 'quiz'),
    ('perfil-intestino', 'Qual é seu perfil de intestino?', 'quiz'),
    ('quiz-bem-estar', 'Quiz de Bem-Estar', 'quiz'),
    ('quiz-perfil-nutricional', 'Quiz de Perfil Nutricional', 'quiz'),
    ('avaliacao-sono-energia', 'Avaliação do Sono e Energia', 'quiz'),
    ('avaliacao-inicial', 'Avaliação Inicial', 'quiz'),
    ('template-desafio-21dias', 'Desafio 21 Dias', 'quiz'),
    ('diagnostico-eletrolitos', 'Diagnóstico de Eletrólitos', 'quiz'),
    ('diagnostico-parasitose', 'Diagnóstico de Parasitose', 'quiz'),
    ('quiz-detox', 'Quiz Detox', 'quiz'),
    ('quiz-energetico', 'Quiz Energético', 'quiz'),
    ('quiz-interativo', 'Quiz Interativo', 'quiz'),
    ('quiz-alimentacao-saudavel', 'Quiz: Alimentação Saudável', 'quiz'),
    ('sindrome-metabolica', 'Risco de Síndrome Metabólica', 'quiz'),
    ('quiz-pedindo-detox', 'Seu corpo está pedindo Detox?', 'quiz'),
    ('avaliacao-intolerancia', 'Avaliação de Intolerâncias/Sensibilidades', 'quiz'),
    ('avaliacao-perfil-metabolico', 'Avaliação do Perfil Metabólico', 'quiz'),
    ('descubra-seu-perfil-de-bem-estar', 'Descubra seu Perfil de Bem-Estar', 'quiz') -- Este pode ser diferente do quiz-bem-estar
  ) AS t(slug_esperado, nome_esperado, tipo_esperado)
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
-- Verificar quais templates esperados NÃO estão no banco
SELECT 
  '❌ FALTANTES' as status,
  te.nome_esperado,
  te.slug_esperado,
  te.tipo_esperado,
  'NÃO ENCONTRADO NO BANCO' as observacao
FROM templates_esperados_completos te
LEFT JOIN templates_no_banco tb ON te.slug_esperado = tb.slug
WHERE tb.id IS NULL
ORDER BY te.nome_esperado;

-- Verificar se "Descubra seu Perfil de Bem-Estar" existe com outro slug
SELECT 
  '🔍 VERIFICAR: Descubra seu Perfil de Bem-Estar' as status,
  id,
  name,
  slug,
  type,
  is_active
FROM coach_templates_nutrition
WHERE (name ILIKE '%Descubra seu Perfil%' OR name ILIKE '%Perfil de Bem-Estar%')
  AND profession = 'coach'
  AND language = 'pt'
ORDER BY is_active DESC, name;

-- Listar todos os templates ativos para comparação
SELECT 
  '✅ TEMPLATES ATIVOS NO BANCO' as status,
  name as nome,
  slug,
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
      'avaliacao-perfil-metabolico', 'descubra-seu-perfil-de-bem-estar'
    ) THEN '✅ CORRETO'
    ELSE '⚠️ VERIFICAR'
  END as status_slug
FROM coach_templates_nutrition
WHERE is_active = true
  AND profession = 'coach'
  AND language = 'pt'
ORDER BY name;

-- Contar templates únicos
SELECT 
  '📊 CONTAGEM FINAL' as info,
  COUNT(*) as total_templates_ativos,
  COUNT(*) FILTER (WHERE slug IN (
    'calc-hidratacao', 'calc-calorias', 'calc-imc', 'calc-proteina',
    'retencao-liquidos', 'conhece-seu-corpo', 'disciplinado-emocional',
    'nutrido-vs-alimentado', 'alimentacao-rotina', 'diagnostico-sintomas-intestinais',
    'pronto-emagrecer', 'tipo-fome', 'perfil-intestino', 'quiz-bem-estar',
    'quiz-perfil-nutricional', 'avaliacao-sono-energia', 'avaliacao-inicial',
    'template-desafio-21dias', 'diagnostico-eletrolitos', 'diagnostico-parasitose',
    'quiz-detox', 'quiz-energetico', 'quiz-interativo', 'quiz-alimentacao-saudavel',
    'sindrome-metabolica', 'quiz-pedindo-detox', 'avaliacao-intolerancia',
    'avaliacao-perfil-metabolico', 'descubra-seu-perfil-de-bem-estar'
  )) as templates_com_slug_esperado
FROM coach_templates_nutrition
WHERE is_active = true
  AND profession = 'coach'
  AND language = 'pt';

