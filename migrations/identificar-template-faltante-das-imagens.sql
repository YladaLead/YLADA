-- =====================================================
-- IDENTIFICAR TEMPLATE FALTANTE: Baseado nas Imagens
-- Comparar os 28 templates no preview com as imagens
-- =====================================================

-- Lista dos 28 templates que estão no preview
WITH templates_no_preview AS (
  SELECT slug, name FROM coach_templates_nutrition
  WHERE is_active = true AND profession = 'coach' AND language = 'pt'
),
-- Lista dos 29 templates das imagens (baseado na descrição das imagens)
templates_das_imagens AS (
  SELECT * FROM (VALUES
    -- Imagem 1 (6 templates)
    ('calc-hidratacao', 'Calculadora de Água'),
    ('calc-calorias', 'Calculadora de Calorias'),
    ('calc-imc', 'Calculadora de IMC'),
    ('calc-proteina', 'Calculadora de Proteína'),
    ('avaliacao-intolerancia', 'Avaliação de Intolerâncias/Sensibilidades'),
    ('avaliacao-perfil-metabolico', 'Avaliação do Perfil Metabólico'),
    
    -- Imagem 2 (6 templates)
    ('quiz-detox', 'Quiz Detox'),
    ('quiz-energetico', 'Quiz Energético'),
    ('quiz-interativo', 'Quiz Interativo'),
    ('quiz-alimentacao-saudavel', 'Quiz: Alimentação Saudável'),
    ('sindrome-metabolica', 'Risco de Síndrome Metabólica'),
    ('quiz-pedindo-detox', 'Seu corpo está pedindo Detox?'),
    
    -- Imagem 3 (6 templates)
    ('avaliacao-sono-energia', 'Avaliação do Sono e Energia'),
    ('avaliacao-inicial', 'Avaliação Inicial'),
    ('template-desafio-21dias', 'Desafio 21 Dias'),
    ('descubra-seu-perfil-de-bem-estar', 'Descubra seu Perfil de Bem-Estar'), -- POSSÍVEL FALTANTE!
    ('diagnostico-eletrolitos', 'Diagnóstico de Eletrólitos'),
    ('diagnostico-parasitose', 'Diagnóstico de Parasitose'),
    
    -- Imagem 4 (6 templates - alguns com nomes diferentes)
    ('retencao-liquidos', 'Teste de Retenção de Líquidos'), -- "desequilíbrio mineral"
    ('conhece-seu-corpo', 'Você conhece o seu corpo?'), -- "corporal e nutricional"
    ('disciplinado-emocional', 'Você é mais disciplinado ou emocional com a comida?'),
    ('nutrido-vs-alimentado', 'Você está nutrido ou apenas alimentado?'),
    ('alimentacao-rotina', 'Você está se alimentando conforme sua rotina?'),
    -- (6º parcialmente visível)
    
    -- Imagem 5 (6 templates)
    ('diagnostico-sintomas-intestinais', 'Diagnóstico de Sintomas Intestinais'),
    ('pronto-emagrecer', 'Pronto para Emagrecer com Saúde?'),
    ('tipo-fome', 'Qual é o seu Tipo de Fome?'),
    ('perfil-intestino', 'Qual é seu perfil de intestino?'),
    ('quiz-bem-estar', 'Quiz de Bem-Estar'),
    ('quiz-perfil-nutricional', 'Quiz de Perfil Nutricional')
  ) AS t(slug_imagem, nome_imagem)
)
-- Verificar qual template das imagens NÃO está no preview
SELECT 
  '❌ TEMPLATE FALTANTE' as status,
  ti.nome_imagem,
  ti.slug_imagem,
  CASE 
    WHEN tp.slug IS NULL THEN '❌ NÃO ENCONTRADO NO PREVIEW'
    ELSE '✅ ENCONTRADO'
  END as status_preview
FROM templates_das_imagens ti
LEFT JOIN templates_no_preview tp ON ti.slug_imagem = tp.slug
WHERE tp.slug IS NULL
ORDER BY ti.nome_imagem;

-- Verificar se "Descubra seu Perfil de Bem-Estar" existe com outro nome/slug
SELECT 
  '🔍 BUSCAR: Descubra seu Perfil de Bem-Estar' as tipo_busca,
  id,
  name as nome,
  slug,
  type as tipo,
  is_active,
  CASE 
    WHEN is_active = true THEN '✅ ATIVO'
    ELSE '❌ INATIVO'
  END as status
FROM coach_templates_nutrition
WHERE (
  name ILIKE '%Descubra%Perfil%Bem-Estar%' OR
  name ILIKE '%Descubra%Perfil%' OR
  name ILIKE '%Perfil de Bem-Estar%' OR
  slug ILIKE '%descubra%' OR
  slug ILIKE '%perfil-bem-estar%' OR
  slug ILIKE '%wellness-profile%'
)
AND profession = 'coach'
AND language = 'pt'
ORDER BY is_active DESC, name;

-- Listar TODOS os templates relacionados a "bem-estar" para comparação
SELECT 
  '🔍 TODOS RELACIONADOS A BEM-ESTAR' as tipo_busca,
  id,
  name as nome,
  slug,
  type as tipo,
  is_active,
  CASE 
    WHEN is_active = true THEN '✅ ATIVO'
    ELSE '❌ INATIVO'
  END as status
FROM coach_templates_nutrition
WHERE (
  name ILIKE '%bem-estar%' OR
  name ILIKE '%wellness%' OR
  slug ILIKE '%bem-estar%' OR
  slug ILIKE '%wellness%'
)
AND profession = 'coach'
AND language = 'pt'
ORDER BY is_active DESC, name;

