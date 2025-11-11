-- =====================================================
-- PREENCHER SLUGS DOS 31 TEMPLATES DA ÁREA DEMO WELLNESS (V2)
-- =====================================================
-- Versão melhorada que:
-- 1. Remove índice único temporariamente
-- 2. Atualiza apenas templates sem slug
-- 3. Gera slugs automáticos para os que não correspondem aos padrões

-- 1. Garantir que a coluna slug existe
ALTER TABLE templates_nutrition 
ADD COLUMN IF NOT EXISTS slug VARCHAR(255);

-- 2. Remover índice único temporariamente
DROP INDEX IF EXISTS idx_templates_nutrition_slug;

-- 3. PRIMEIRO: Atualizar templates que já têm slug definido mas podem estar duplicados
-- (manter apenas o mais recente de cada slug)

-- 4. SEGUNDO: Atualizar templates sem slug baseado nos nomes exatos
-- Usando uma abordagem mais flexível com TRIM e comparação case-insensitive

-- CALCULADORAS (4)
UPDATE templates_nutrition
SET slug = 'calc-hidratacao'
WHERE LOWER(TRIM(name)) = LOWER('Calculadora de Água')
  AND profession = 'wellness'
  AND language = 'pt'
  AND (slug IS NULL OR slug = '');

UPDATE templates_nutrition
SET slug = 'calc-calorias'
WHERE LOWER(TRIM(name)) = LOWER('Calculadora de Calorias')
  AND profession = 'wellness'
  AND language = 'pt'
  AND (slug IS NULL OR slug = '');

UPDATE templates_nutrition
SET slug = 'calc-imc'
WHERE LOWER(TRIM(name)) = LOWER('Calculadora de IMC')
  AND profession = 'wellness'
  AND language = 'pt'
  AND (slug IS NULL OR slug = '');

UPDATE templates_nutrition
SET slug = 'calc-proteina'
WHERE LOWER(TRIM(name)) = LOWER('Calculadora de Proteína')
  AND profession = 'wellness'
  AND language = 'pt'
  AND (slug IS NULL OR slug = '');

-- GUIAS (1)
UPDATE templates_nutrition
SET slug = 'guia-hidratacao'
WHERE LOWER(TRIM(name)) = LOWER('Guia de Hidratação')
  AND profession = 'wellness'
  AND language = 'pt'
  AND (slug IS NULL OR slug = '');

-- PLANILHAS (2)
UPDATE templates_nutrition
SET slug = 'checklist-alimentar'
WHERE LOWER(TRIM(name)) = LOWER('Checklist Alimentar')
  AND profession = 'wellness'
  AND language = 'pt'
  AND (slug IS NULL OR slug = '');

UPDATE templates_nutrition
SET slug = 'checklist-detox'
WHERE LOWER(TRIM(name)) = LOWER('Checklist Detox')
  AND profession = 'wellness'
  AND language = 'pt'
  AND (slug IS NULL OR slug = '');

-- QUIZZES (24)
UPDATE templates_nutrition
SET slug = 'quiz-fome-emocional'
WHERE LOWER(TRIM(name)) = LOWER('Avaliação de Fome Emocional')
  AND profession = 'wellness'
  AND language = 'pt'
  AND (slug IS NULL OR slug = '');

UPDATE templates_nutrition
SET slug = 'avaliacao-intolerancia'
WHERE LOWER(TRIM(name)) = LOWER('Avaliação de Intolerâncias/Sensibilidades')
  AND profession = 'wellness'
  AND language = 'pt'
  AND (slug IS NULL OR slug = '');

UPDATE templates_nutrition
SET slug = 'avaliacao-perfil-metabolico'
WHERE LOWER(TRIM(name)) = LOWER('Avaliação do Perfil Metabólico')
  AND profession = 'wellness'
  AND language = 'pt'
  AND (slug IS NULL OR slug = '');

UPDATE templates_nutrition
SET slug = 'avaliacao-inicial'
WHERE LOWER(TRIM(name)) = LOWER('Avaliação Inicial')
  AND profession = 'wellness'
  AND language = 'pt'
  AND (slug IS NULL OR slug = '');

UPDATE templates_nutrition
SET slug = 'desafio-21-dias'
WHERE LOWER(TRIM(name)) = LOWER('Desafio 21 Dias')
  AND profession = 'wellness'
  AND language = 'pt'
  AND (slug IS NULL OR slug = '');

UPDATE templates_nutrition
SET slug = 'desafio-7-dias'
WHERE LOWER(TRIM(name)) = LOWER('Desafio 7 Dias')
  AND profession = 'wellness'
  AND language = 'pt'
  AND (slug IS NULL OR slug = '');

UPDATE templates_nutrition
SET slug = 'diagnostico-eletrolitos'
WHERE LOWER(TRIM(name)) = LOWER('Diagnóstico de Eletrólitos')
  AND profession = 'wellness'
  AND language = 'pt'
  AND (slug IS NULL OR slug = '');

UPDATE templates_nutrition
SET slug = 'diagnostico-sintomas-intestinais'
WHERE LOWER(TRIM(name)) = LOWER('Diagnóstico de Sintomas Intestinais')
  AND profession = 'wellness'
  AND language = 'pt'
  AND (slug IS NULL OR slug = '');

UPDATE templates_nutrition
SET slug = 'pronto-emagrecer'
WHERE LOWER(TRIM(name)) = LOWER('Pronto para Emagrecer com Saúde?')
  AND profession = 'wellness'
  AND language = 'pt'
  AND (slug IS NULL OR slug = '');

UPDATE templates_nutrition
SET slug = 'tipo-fome'
WHERE LOWER(TRIM(name)) = LOWER('Qual é o seu Tipo de Fome?')
  AND profession = 'wellness'
  AND language = 'pt'
  AND (slug IS NULL OR slug = '');

UPDATE templates_nutrition
SET slug = 'quiz-bem-estar'
WHERE LOWER(TRIM(name)) = LOWER('Quiz de Bem-Estar')
  AND profession = 'wellness'
  AND language = 'pt'
  AND (slug IS NULL OR slug = '');

UPDATE templates_nutrition
SET slug = 'quiz-detox'
WHERE LOWER(TRIM(name)) = LOWER('Quiz Detox')
  AND profession = 'wellness'
  AND language = 'pt'
  AND (slug IS NULL OR slug = '');

UPDATE templates_nutrition
SET slug = 'quiz-energetico'
WHERE LOWER(TRIM(name)) = LOWER('Quiz Energético')
  AND profession = 'wellness'
  AND language = 'pt'
  AND (slug IS NULL OR slug = '');

UPDATE templates_nutrition
SET slug = 'quiz-interativo'
WHERE LOWER(TRIM(name)) = LOWER('Quiz Interativo')
  AND profession = 'wellness'
  AND language = 'pt'
  AND (slug IS NULL OR slug = '');

UPDATE templates_nutrition
SET slug = 'quiz-alimentacao-saudavel'
WHERE LOWER(TRIM(name)) = LOWER('Quiz: Alimentação Saudável')
  AND profession = 'wellness'
  AND language = 'pt'
  AND (slug IS NULL OR slug = '');

UPDATE templates_nutrition
SET slug = 'quiz-ganhos'
WHERE LOWER(TRIM(name)) = LOWER('Quiz: Ganhos e Prosperidade')
  AND profession = 'wellness'
  AND language = 'pt'
  AND (slug IS NULL OR slug = '');

UPDATE templates_nutrition
SET slug = 'quiz-potencial'
WHERE LOWER(TRIM(name)) = LOWER('Quiz: Potencial e Crescimento')
  AND profession = 'wellness'
  AND language = 'pt'
  AND (slug IS NULL OR slug = '');

UPDATE templates_nutrition
SET slug = 'quiz-proposito'
WHERE LOWER(TRIM(name)) = LOWER('Quiz: Propósito e Equilíbrio')
  AND profession = 'wellness'
  AND language = 'pt'
  AND (slug IS NULL OR slug = '');

UPDATE templates_nutrition
SET slug = 'sindrome-metabolica'
WHERE LOWER(TRIM(name)) = LOWER('Risco de Síndrome Metabólica')
  AND profession = 'wellness'
  AND language = 'pt'
  AND (slug IS NULL OR slug = '');

UPDATE templates_nutrition
SET slug = 'retencao-liquidos'
WHERE LOWER(TRIM(name)) = LOWER('Teste de Retenção de Líquidos')
  AND profession = 'wellness'
  AND language = 'pt'
  AND (slug IS NULL OR slug = '');

UPDATE templates_nutrition
SET slug = 'conhece-seu-corpo'
WHERE LOWER(TRIM(name)) = LOWER('Você conhece o seu corpo?')
  AND profession = 'wellness'
  AND language = 'pt'
  AND (slug IS NULL OR slug = '');

UPDATE templates_nutrition
SET slug = 'disciplinado-emocional'
WHERE LOWER(TRIM(name)) = LOWER('Você é mais disciplinado ou emocional com a comida?')
  AND profession = 'wellness'
  AND language = 'pt'
  AND (slug IS NULL OR slug = '');

UPDATE templates_nutrition
SET slug = 'nutrido-vs-alimentado'
WHERE LOWER(TRIM(name)) = LOWER('Você está nutrido ou apenas alimentado?')
  AND profession = 'wellness'
  AND language = 'pt'
  AND (slug IS NULL OR slug = '');

UPDATE templates_nutrition
SET slug = 'alimentacao-rotina'
WHERE LOWER(TRIM(name)) = LOWER('Você está se alimentando conforme sua rotina?')
  AND profession = 'wellness'
  AND language = 'pt'
  AND (slug IS NULL OR slug = '');

-- 5. Para templates que ainda não têm slug, gerar automaticamente do nome
UPDATE templates_nutrition
SET slug = TRIM(
  BOTH '-' FROM
  REGEXP_REPLACE(
    REGEXP_REPLACE(
      REGEXP_REPLACE(
        REGEXP_REPLACE(
          REGEXP_REPLACE(
            REGEXP_REPLACE(
              LOWER(TRIM(name)),
              '[àáâãäå]', 'a', 'gi'
            ),
            '[èéêë]', 'e', 'gi'
          ),
          '[ìíîï]', 'i', 'gi'
        ),
        '[òóôõö]', 'o', 'gi'
      ),
      '[ùúûü]', 'u', 'gi'
    ),
    '[^a-z0-9]+', '-', 'g'
  )
)
WHERE profession = 'wellness'
  AND language = 'pt'
  AND is_active = true
  AND (slug IS NULL OR slug = '');

-- 6. Lidar com duplicatas: se houver templates com mesmo slug, manter apenas o mais recente
-- (o que tem maior id ou created_at mais recente)
DELETE FROM templates_nutrition t1
WHERE EXISTS (
  SELECT 1 FROM templates_nutrition t2
  WHERE t2.slug = t1.slug
    AND t2.slug IS NOT NULL
    AND t2.slug != ''
    AND t2.id != t1.id
    AND t2.profession = 'wellness'
    AND t2.language = 'pt'
    AND t2.is_active = true
    AND (
      t2.created_at > t1.created_at
      OR (t2.created_at = t1.created_at AND t2.id > t1.id)
    )
);

-- 7. Recriar índice único APÓS todas as atualizações e limpeza
CREATE UNIQUE INDEX IF NOT EXISTS idx_templates_nutrition_slug 
ON templates_nutrition(slug) 
WHERE slug IS NOT NULL;

-- 8. Verificar resultado final
SELECT 
  name,
  slug,
  type,
  is_active
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

-- 9. Verificar quantos ainda estão sem slug
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

