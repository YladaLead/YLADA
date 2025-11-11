-- =====================================================
-- PREENCHER SLUGS DOS 31 TEMPLATES DA ÁREA DEMO WELLNESS
-- =====================================================
-- Este script preenche os slugs faltantes baseado nos nomes
-- dos templates da área de demonstração
-- IMPORTANTE: Atualiza apenas templates que ainda não têm slug

-- 1. Garantir que a coluna slug existe
ALTER TABLE templates_nutrition 
ADD COLUMN IF NOT EXISTS slug VARCHAR(255);

-- 2. Remover índice único temporariamente para permitir atualizações
DROP INDEX IF EXISTS idx_templates_nutrition_slug;

-- 3. Atualizar slugs baseado nos nomes exatos dos 31 templates
-- IMPORTANTE: Atualiza apenas templates que ainda não têm slug (slug IS NULL)

-- CALCULADORAS (4)
-- Atualizar apenas se não tiver slug E se o slug não estiver em uso por outro template
UPDATE templates_nutrition
SET slug = 'calc-hidratacao'
WHERE name = 'Calculadora de Água'
  AND profession = 'wellness'
  AND language = 'pt'
  AND (slug IS NULL OR slug = '')
  AND NOT EXISTS (
    SELECT 1 FROM templates_nutrition t2 
    WHERE t2.slug = 'calc-hidratacao' 
    AND t2.id != templates_nutrition.id
  );

UPDATE templates_nutrition
SET slug = 'calc-calorias'
WHERE name = 'Calculadora de Calorias'
  AND profession = 'wellness'
  AND language = 'pt'
  AND (slug IS NULL OR slug = '')
  AND NOT EXISTS (
    SELECT 1 FROM templates_nutrition t2 
    WHERE t2.slug = 'calc-calorias' 
    AND t2.id != templates_nutrition.id
  );

UPDATE templates_nutrition
SET slug = 'calc-imc'
WHERE name = 'Calculadora de IMC'
  AND profession = 'wellness'
  AND language = 'pt'
  AND (slug IS NULL OR slug = '')
  AND NOT EXISTS (
    SELECT 1 FROM templates_nutrition t2 
    WHERE t2.slug = 'calc-imc' 
    AND t2.id != templates_nutrition.id
  );

UPDATE templates_nutrition
SET slug = 'calc-proteina'
WHERE name = 'Calculadora de Proteína'
  AND profession = 'wellness'
  AND language = 'pt'
  AND (slug IS NULL OR slug = '')
  AND NOT EXISTS (
    SELECT 1 FROM templates_nutrition t2 
    WHERE t2.slug = 'calc-proteina' 
    AND t2.id != templates_nutrition.id
  );

-- GUIAS (1)
UPDATE templates_nutrition
SET slug = 'guia-hidratacao'
WHERE name = 'Guia de Hidratação'
  AND profession = 'wellness'
  AND language = 'pt'
  AND (slug IS NULL OR slug = '')
  AND NOT EXISTS (
    SELECT 1 FROM templates_nutrition t2 
    WHERE t2.slug = 'guia-hidratacao' 
    AND t2.id != templates_nutrition.id
  );

-- PLANILHAS (2)
UPDATE templates_nutrition
SET slug = 'checklist-alimentar'
WHERE name = 'Checklist Alimentar'
  AND profession = 'wellness'
  AND language = 'pt'
  AND (slug IS NULL OR slug = '')
  AND NOT EXISTS (
    SELECT 1 FROM templates_nutrition t2 
    WHERE t2.slug = 'checklist-alimentar' 
    AND t2.id != templates_nutrition.id
  );

UPDATE templates_nutrition
SET slug = 'checklist-detox'
WHERE name = 'Checklist Detox'
  AND profession = 'wellness'
  AND language = 'pt'
  AND (slug IS NULL OR slug = '')
  AND NOT EXISTS (
    SELECT 1 FROM templates_nutrition t2 
    WHERE t2.slug = 'checklist-detox' 
    AND t2.id != templates_nutrition.id
  );

-- QUIZZES (24)
-- Adicionar condição para atualizar apenas se não tiver slug e se o slug não estiver em uso
UPDATE templates_nutrition
SET slug = 'quiz-fome-emocional'
WHERE name = 'Avaliação de Fome Emocional'
  AND profession = 'wellness'
  AND language = 'pt'
  AND (slug IS NULL OR slug = '')
  AND NOT EXISTS (
    SELECT 1 FROM templates_nutrition t2 
    WHERE t2.slug = 'quiz-fome-emocional' 
    AND t2.id != templates_nutrition.id
  );

UPDATE templates_nutrition
SET slug = 'avaliacao-intolerancia'
WHERE name = 'Avaliação de Intolerâncias/Sensibilidades'
  AND profession = 'wellness'
  AND language = 'pt'
  AND (slug IS NULL OR slug = '')
  AND NOT EXISTS (SELECT 1 FROM templates_nutrition t2 WHERE t2.slug = 'avaliacao-intolerancia' AND t2.id != templates_nutrition.id);

UPDATE templates_nutrition
SET slug = 'avaliacao-perfil-metabolico'
WHERE name = 'Avaliação do Perfil Metabólico'
  AND profession = 'wellness'
  AND language = 'pt'
  AND (slug IS NULL OR slug = '')
  AND NOT EXISTS (SELECT 1 FROM templates_nutrition t2 WHERE t2.slug = 'avaliacao-perfil-metabolico' AND t2.id != templates_nutrition.id);

UPDATE templates_nutrition
SET slug = 'avaliacao-inicial'
WHERE name = 'Avaliação Inicial'
  AND profession = 'wellness'
  AND language = 'pt'
  AND (slug IS NULL OR slug = '')
  AND NOT EXISTS (SELECT 1 FROM templates_nutrition t2 WHERE t2.slug = 'avaliacao-inicial' AND t2.id != templates_nutrition.id);

UPDATE templates_nutrition
SET slug = 'desafio-21-dias'
WHERE name = 'Desafio 21 Dias'
  AND profession = 'wellness'
  AND language = 'pt'
  AND (slug IS NULL OR slug = '')
  AND NOT EXISTS (SELECT 1 FROM templates_nutrition t2 WHERE t2.slug = 'desafio-21-dias' AND t2.id != templates_nutrition.id);

UPDATE templates_nutrition
SET slug = 'desafio-7-dias'
WHERE name = 'Desafio 7 Dias'
  AND profession = 'wellness'
  AND language = 'pt'
  AND (slug IS NULL OR slug = '')
  AND NOT EXISTS (SELECT 1 FROM templates_nutrition t2 WHERE t2.slug = 'desafio-7-dias' AND t2.id != templates_nutrition.id);

UPDATE templates_nutrition
SET slug = 'diagnostico-eletrolitos'
WHERE name = 'Diagnóstico de Eletrólitos'
  AND profession = 'wellness'
  AND language = 'pt'
  AND (slug IS NULL OR slug = '')
  AND NOT EXISTS (SELECT 1 FROM templates_nutrition t2 WHERE t2.slug = 'diagnostico-eletrolitos' AND t2.id != templates_nutrition.id);

UPDATE templates_nutrition
SET slug = 'diagnostico-sintomas-intestinais'
WHERE name = 'Diagnóstico de Sintomas Intestinais'
  AND profession = 'wellness'
  AND language = 'pt'
  AND (slug IS NULL OR slug = '')
  AND NOT EXISTS (SELECT 1 FROM templates_nutrition t2 WHERE t2.slug = 'diagnostico-sintomas-intestinais' AND t2.id != templates_nutrition.id);

UPDATE templates_nutrition
SET slug = 'pronto-emagrecer'
WHERE name = 'Pronto para Emagrecer com Saúde?'
  AND profession = 'wellness'
  AND language = 'pt'
  AND (slug IS NULL OR slug = '')
  AND NOT EXISTS (SELECT 1 FROM templates_nutrition t2 WHERE t2.slug = 'pronto-emagrecer' AND t2.id != templates_nutrition.id);

UPDATE templates_nutrition
SET slug = 'tipo-fome'
WHERE name = 'Qual é o seu Tipo de Fome?'
  AND profession = 'wellness'
  AND language = 'pt'
  AND (slug IS NULL OR slug = '')
  AND NOT EXISTS (SELECT 1 FROM templates_nutrition t2 WHERE t2.slug = 'tipo-fome' AND t2.id != templates_nutrition.id);

UPDATE templates_nutrition
SET slug = 'quiz-bem-estar'
WHERE name = 'Quiz de Bem-Estar'
  AND profession = 'wellness'
  AND language = 'pt'
  AND (slug IS NULL OR slug = '')
  AND NOT EXISTS (SELECT 1 FROM templates_nutrition t2 WHERE t2.slug = 'quiz-bem-estar' AND t2.id != templates_nutrition.id);

UPDATE templates_nutrition
SET slug = 'quiz-detox'
WHERE name = 'Quiz Detox'
  AND profession = 'wellness'
  AND language = 'pt'
  AND (slug IS NULL OR slug = '')
  AND NOT EXISTS (SELECT 1 FROM templates_nutrition t2 WHERE t2.slug = 'quiz-detox' AND t2.id != templates_nutrition.id);

UPDATE templates_nutrition
SET slug = 'quiz-energetico'
WHERE name = 'Quiz Energético'
  AND profession = 'wellness'
  AND language = 'pt'
  AND (slug IS NULL OR slug = '')
  AND NOT EXISTS (SELECT 1 FROM templates_nutrition t2 WHERE t2.slug = 'quiz-energetico' AND t2.id != templates_nutrition.id);

UPDATE templates_nutrition
SET slug = 'quiz-interativo'
WHERE name = 'Quiz Interativo'
  AND profession = 'wellness'
  AND language = 'pt'
  AND (slug IS NULL OR slug = '')
  AND NOT EXISTS (SELECT 1 FROM templates_nutrition t2 WHERE t2.slug = 'quiz-interativo' AND t2.id != templates_nutrition.id);

UPDATE templates_nutrition
SET slug = 'quiz-alimentacao-saudavel'
WHERE name = 'Quiz: Alimentação Saudável'
  AND profession = 'wellness'
  AND language = 'pt'
  AND (slug IS NULL OR slug = '')
  AND NOT EXISTS (SELECT 1 FROM templates_nutrition t2 WHERE t2.slug = 'quiz-alimentacao-saudavel' AND t2.id != templates_nutrition.id);

UPDATE templates_nutrition
SET slug = 'quiz-ganhos'
WHERE name = 'Quiz: Ganhos e Prosperidade'
  AND profession = 'wellness'
  AND language = 'pt'
  AND (slug IS NULL OR slug = '')
  AND NOT EXISTS (SELECT 1 FROM templates_nutrition t2 WHERE t2.slug = 'quiz-ganhos' AND t2.id != templates_nutrition.id);

UPDATE templates_nutrition
SET slug = 'quiz-potencial'
WHERE name = 'Quiz: Potencial e Crescimento'
  AND profession = 'wellness'
  AND language = 'pt'
  AND (slug IS NULL OR slug = '')
  AND NOT EXISTS (SELECT 1 FROM templates_nutrition t2 WHERE t2.slug = 'quiz-potencial' AND t2.id != templates_nutrition.id);

UPDATE templates_nutrition
SET slug = 'quiz-proposito'
WHERE name = 'Quiz: Propósito e Equilíbrio'
  AND profession = 'wellness'
  AND language = 'pt'
  AND (slug IS NULL OR slug = '')
  AND NOT EXISTS (SELECT 1 FROM templates_nutrition t2 WHERE t2.slug = 'quiz-proposito' AND t2.id != templates_nutrition.id);

UPDATE templates_nutrition
SET slug = 'sindrome-metabolica'
WHERE name = 'Risco de Síndrome Metabólica'
  AND profession = 'wellness'
  AND language = 'pt'
  AND (slug IS NULL OR slug = '')
  AND NOT EXISTS (SELECT 1 FROM templates_nutrition t2 WHERE t2.slug = 'sindrome-metabolica' AND t2.id != templates_nutrition.id);

UPDATE templates_nutrition
SET slug = 'retencao-liquidos'
WHERE name = 'Teste de Retenção de Líquidos'
  AND profession = 'wellness'
  AND language = 'pt'
  AND (slug IS NULL OR slug = '')
  AND NOT EXISTS (SELECT 1 FROM templates_nutrition t2 WHERE t2.slug = 'retencao-liquidos' AND t2.id != templates_nutrition.id);

UPDATE templates_nutrition
SET slug = 'conhece-seu-corpo'
WHERE name = 'Você conhece o seu corpo?'
  AND profession = 'wellness'
  AND language = 'pt'
  AND (slug IS NULL OR slug = '')
  AND NOT EXISTS (SELECT 1 FROM templates_nutrition t2 WHERE t2.slug = 'conhece-seu-corpo' AND t2.id != templates_nutrition.id);

UPDATE templates_nutrition
SET slug = 'disciplinado-emocional'
WHERE name = 'Você é mais disciplinado ou emocional com a comida?'
  AND profession = 'wellness'
  AND language = 'pt'
  AND (slug IS NULL OR slug = '')
  AND NOT EXISTS (SELECT 1 FROM templates_nutrition t2 WHERE t2.slug = 'disciplinado-emocional' AND t2.id != templates_nutrition.id);

UPDATE templates_nutrition
SET slug = 'nutrido-vs-alimentado'
WHERE name = 'Você está nutrido ou apenas alimentado?'
  AND profession = 'wellness'
  AND language = 'pt'
  AND (slug IS NULL OR slug = '')
  AND NOT EXISTS (SELECT 1 FROM templates_nutrition t2 WHERE t2.slug = 'nutrido-vs-alimentado' AND t2.id != templates_nutrition.id);

UPDATE templates_nutrition
SET slug = 'alimentacao-rotina'
WHERE name = 'Você está se alimentando conforme sua rotina?'
  AND profession = 'wellness'
  AND language = 'pt'
  AND (slug IS NULL OR slug = '')
  AND NOT EXISTS (SELECT 1 FROM templates_nutrition t2 WHERE t2.slug = 'alimentacao-rotina' AND t2.id != templates_nutrition.id);

-- 4. Recriar índice único APÓS todas as atualizações
CREATE UNIQUE INDEX IF NOT EXISTS idx_templates_nutrition_slug 
ON templates_nutrition(slug) 
WHERE slug IS NOT NULL;

-- 5. Verificar resultado
SELECT 
  name,
  slug,
  type,
  is_active,
  profession,
  language
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
  AND is_active = true
ORDER BY 
  CASE type
    WHEN 'calculadora' THEN 1
    WHEN 'guia' THEN 2
    WHEN 'planilha' THEN 3
    WHEN 'quiz' THEN 4
    ELSE 5
  END,
  name;

-- 4. Verificar quantos ainda estão sem slug
SELECT 
  COUNT(*) as templates_sem_slug,
  type
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
  AND is_active = true
  AND (slug IS NULL OR slug = '')
GROUP BY type
ORDER BY type;

