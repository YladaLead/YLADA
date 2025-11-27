-- =====================================================
-- VERIFICAR TEMPLATE FALTANTE: Coach
-- Verificar se há algum template que deveria estar mas não está
-- =====================================================

-- Lista completa dos 29 templates esperados
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
    ('avaliacao-perfil-metabolico', 'Avaliação do Perfil Metabólico'),
    ('quiz-bem-estar', 'Descubra seu Perfil de Bem-Estar') -- Duplicado do #14, mas pode ter nome diferente
  ) AS t(slug_esperado, nome_esperado)
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
  'NÃO ENCONTRADO' as observacao
FROM templates_esperados te
LEFT JOIN templates_no_banco tb ON te.slug_esperado = tb.slug
WHERE tb.id IS NULL
ORDER BY te.nome_esperado;

-- Contar templates únicos esperados (removendo duplicados)
SELECT 
  '📊 CONTAGEM' as info,
  COUNT(DISTINCT slug_esperado) as templates_unicos_esperados,
  (SELECT COUNT(*) FROM coach_templates_nutrition 
   WHERE is_active = true AND profession = 'coach' AND language = 'pt') as templates_ativos_banco
FROM templates_esperados;

-- Listar todos os templates ativos no banco
SELECT 
  '✅ TEMPLATES ATIVOS NO BANCO' as status,
  name as nome,
  slug,
  type as tipo
FROM coach_templates_nutrition
WHERE is_active = true
  AND profession = 'coach'
  AND language = 'pt'
ORDER BY name;

