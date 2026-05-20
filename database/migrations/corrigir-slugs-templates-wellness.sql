-- =====================================================
-- VERIFICAR E CORRIGIR TODOS OS SLUGS DOS TEMPLATES WELLNESS
-- =====================================================
-- Este script verifica quantos templates Wellness existem
-- e garante que todos tenham slugs corretos
-- =====================================================

-- 1. VERIFICAR QUANTOS TEMPLATES WELLNESS EXISTEM
SELECT 
  'Total de templates Wellness' as info,
  COUNT(*) as total,
  COUNT(slug) as com_slug,
  COUNT(*) - COUNT(slug) as sem_slug
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
  AND is_active = true;

-- 2. LISTAR TODOS OS TEMPLATES WELLNESS COM SEUS SLUGS ATUAIS
SELECT 
  id,
  name,
  slug,
  type,
  specialization,
  CASE 
    WHEN slug IS NULL OR slug = '' THEN '❌ SEM SLUG'
    WHEN slug LIKE '-%' OR slug LIKE '%-' THEN '⚠️ SLUG MALFORMADO'
    ELSE '✅ OK'
  END as status_slug
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
  AND is_active = true
ORDER BY type, name;

-- 3. CORRIGIR SLUGS MALFORMADOS (que começam ou terminam com hífen)
UPDATE templates_nutrition
SET slug = TRIM(BOTH '-' FROM slug)
WHERE profession = 'wellness'
  AND language = 'pt'
  AND is_active = true
  AND (slug LIKE '-%' OR slug LIKE '%-');

-- 4. GERAR SLUGS PARA TEMPLATES QUE NÃO TÊM SLUG
-- Usando a mesma lógica do código JavaScript
UPDATE templates_nutrition
SET slug = TRIM(
  BOTH '-' FROM
  REGEXP_REPLACE(
    REGEXP_REPLACE(
      REGEXP_REPLACE(
        REGEXP_REPLACE(
          REGEXP_REPLACE(
            REGEXP_REPLACE(
              LOWER(name),
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

-- 5. APLICAR PADRONIZAÇÃO DE SLUGS ESPECÍFICOS (baseado no nome)
-- Calculadora de Hidratação/Água
UPDATE templates_nutrition
SET slug = 'calc-hidratacao'
WHERE profession = 'wellness'
  AND language = 'pt'
  AND is_active = true
  AND type = 'calculadora'
  AND (LOWER(name) LIKE '%água%' OR LOWER(name) LIKE '%agua%' OR LOWER(name) LIKE '%hidratação%' OR LOWER(name) LIKE '%hidratacao%');

-- Calculadora IMC
UPDATE templates_nutrition
SET slug = 'calc-imc'
WHERE profession = 'wellness'
  AND language = 'pt'
  AND is_active = true
  AND type = 'calculadora'
  AND (LOWER(name) LIKE '%imc%' OR LOWER(name) LIKE '%índice de massa corporal%');

-- Calculadora de Proteína
UPDATE templates_nutrition
SET slug = 'calc-proteina'
WHERE profession = 'wellness'
  AND language = 'pt'
  AND is_active = true
  AND type = 'calculadora'
  AND (LOWER(name) LIKE '%proteína%' OR LOWER(name) LIKE '%proteina%');

-- Calculadora de Composição
UPDATE templates_nutrition
SET slug = 'calc-composicao'
WHERE profession = 'wellness'
  AND language = 'pt'
  AND is_active = true
  AND type = 'calculadora'
  AND (LOWER(name) LIKE '%composição%' OR LOWER(name) LIKE '%composicao%' OR LOWER(name) LIKE '%corporal%');

-- Quiz Ganhos
UPDATE templates_nutrition
SET slug = 'quiz-ganhos'
WHERE profession = 'wellness'
  AND language = 'pt'
  AND is_active = true
  AND type = 'quiz'
  AND (LOWER(name) LIKE '%ganhos%' AND LOWER(name) LIKE '%prosperidade%');

-- Quiz Potencial
UPDATE templates_nutrition
SET slug = 'quiz-potencial'
WHERE profession = 'wellness'
  AND language = 'pt'
  AND is_active = true
  AND type = 'quiz'
  AND (LOWER(name) LIKE '%potencial%' AND LOWER(name) LIKE '%crescimento%');

-- Quiz Propósito
UPDATE templates_nutrition
SET slug = 'quiz-proposito'
WHERE profession = 'wellness'
  AND language = 'pt'
  AND is_active = true
  AND type = 'quiz'
  AND (LOWER(name) LIKE '%propósito%' OR LOWER(name) LIKE '%proposito%');

-- Quiz Parasitas
UPDATE templates_nutrition
SET slug = 'quiz-parasitas'
WHERE profession = 'wellness'
  AND language = 'pt'
  AND is_active = true
  AND type = 'quiz'
  AND LOWER(name) LIKE '%parasitas%';

-- Quiz Alimentação
UPDATE templates_nutrition
SET slug = 'quiz-alimentacao'
WHERE profession = 'wellness'
  AND language = 'pt'
  AND is_active = true
  AND type = 'quiz'
  AND (LOWER(name) LIKE '%alimentação%' OR LOWER(name) LIKE '%alimentacao%')
  AND slug != 'quiz-alimentacao-saudavel'; -- Não sobrescrever se já tem slug específico

-- Planilha Meal Planner
UPDATE templates_nutrition
SET slug = 'planilha-meal-planner'
WHERE profession = 'wellness'
  AND language = 'pt'
  AND is_active = true
  AND type = 'planilha'
  AND (LOWER(name) LIKE '%meal planner%' OR LOWER(name) LIKE '%planejador%' OR LOWER(name) LIKE '%cardápio%');

-- Planilha Diário Alimentar
UPDATE templates_nutrition
SET slug = 'planilha-diario-alimentar'
WHERE profession = 'wellness'
  AND language = 'pt'
  AND is_active = true
  AND type = 'planilha'
  AND (LOWER(name) LIKE '%diário%' OR LOWER(name) LIKE '%diario%');

-- Planilha Metas Semanais
UPDATE templates_nutrition
SET slug = 'planilha-metas-semanais'
WHERE profession = 'wellness'
  AND language = 'pt'
  AND is_active = true
  AND type = 'planilha'
  AND (LOWER(name) LIKE '%metas%' OR LOWER(name) LIKE '%semanal%');

-- Guia de Hidratação
UPDATE templates_nutrition
SET slug = 'guia-hidratacao'
WHERE profession = 'wellness'
  AND language = 'pt'
  AND is_active = true
  AND type = 'planilha'
  AND (LOWER(name) LIKE '%guia%' AND (LOWER(name) LIKE '%hidratação%' OR LOWER(name) LIKE '%hidratacao%'));

-- Desafio 21 Dias
UPDATE templates_nutrition
SET slug = 'template-desafio-21dias'
WHERE profession = 'wellness'
  AND language = 'pt'
  AND is_active = true
  AND type = 'planilha'
  AND (LOWER(name) LIKE '%desafio%' AND (LOWER(name) LIKE '%21%' OR LOWER(name) LIKE '%vinte e um%'));

-- Desafio 7 Dias
UPDATE templates_nutrition
SET slug = 'template-desafio-7dias'
WHERE profession = 'wellness'
  AND language = 'pt'
  AND is_active = true
  AND type = 'planilha'
  AND (LOWER(name) LIKE '%desafio%' AND (LOWER(name) LIKE '%7%' OR LOWER(name) LIKE '%sete%'));

-- Cardápio Detox
UPDATE templates_nutrition
SET slug = 'cardapio-detox'
WHERE profession = 'wellness'
  AND language = 'pt'
  AND is_active = true
  AND type = 'planilha'
  AND (LOWER(name) LIKE '%cardápio%' OR LOWER(name) LIKE '%cardapio%') AND LOWER(name) LIKE '%detox%';

-- Receitas
UPDATE templates_nutrition
SET slug = 'template-receitas'
WHERE profession = 'wellness'
  AND language = 'pt'
  AND is_active = true
  AND type = 'planilha'
  AND (LOWER(name) LIKE '%receita%' OR LOWER(name) LIKE '%recipe%');

-- Infográfico
UPDATE templates_nutrition
SET slug = 'infografico-educativo'
WHERE profession = 'wellness'
  AND language = 'pt'
  AND is_active = true
  AND type = 'planilha'
  AND (LOWER(name) LIKE '%infográfico%' OR LOWER(name) LIKE '%infografico%' OR LOWER(name) LIKE '%infographic%');

-- Checklist Detox
UPDATE templates_nutrition
SET slug = 'checklist-detox'
WHERE profession = 'wellness'
  AND language = 'pt'
  AND is_active = true
  AND type = 'planilha'
  AND LOWER(name) LIKE '%checklist%' AND LOWER(name) LIKE '%detox%';

-- Checklist Alimentar
UPDATE templates_nutrition
SET slug = 'checklist-alimentar'
WHERE profession = 'wellness'
  AND language = 'pt'
  AND is_active = true
  AND type = 'planilha'
  AND LOWER(name) LIKE '%checklist%' AND LOWER(name) LIKE '%alimentar%';

-- Quiz Wellness Profile
UPDATE templates_nutrition
SET slug = 'quiz-wellness-profile'
WHERE profession = 'wellness'
  AND language = 'pt'
  AND is_active = true
  AND type = 'quiz'
  AND (LOWER(name) LIKE '%perfil de bem-estar%' OR LOWER(name) LIKE '%wellness profile%' OR LOWER(name) LIKE '%descubra seu perfil%');

-- Quiz Perfil Nutricional (Avaliação Nutricional)
UPDATE templates_nutrition
SET slug = 'quiz-perfil-nutricional'
WHERE profession = 'wellness'
  AND language = 'pt'
  AND is_active = true
  AND type = 'quiz'
  AND (LOWER(name) LIKE '%avaliação nutricional%' OR LOWER(name) LIKE '%avaliacao nutricional%' OR LOWER(name) LIKE '%nutrition assessment%');

-- Avaliação Inicial
UPDATE templates_nutrition
SET slug = 'template-avaliacao-inicial'
WHERE profession = 'wellness'
  AND language = 'pt'
  AND is_active = true
  AND type = 'quiz'
  AND (LOWER(name) LIKE '%avaliação inicial%' OR LOWER(name) LIKE '%avaliacao inicial%' OR LOWER(name) LIKE '%initial assessment%');

-- Story Interativo
UPDATE templates_nutrition
SET slug = 'template-story-interativo'
WHERE profession = 'wellness'
  AND language = 'pt'
  AND is_active = true
  AND type = 'quiz'
  AND (LOWER(name) LIKE '%story interativo%' OR LOWER(name) LIKE '%interactive story%');

-- Formulário de Recomendações
UPDATE templates_nutrition
SET slug = 'formulario-recomendacao'
WHERE (LOWER(name) LIKE '%formulário%' OR LOWER(name) LIKE '%formulario%') AND LOWER(name) LIKE '%recomenda%'
  AND profession = 'wellness'
  AND language = 'pt'
  AND is_active = true;

-- 6. VERIFICAÇÃO FINAL
SELECT 
  '✅ RESULTADO FINAL' as status,
  COUNT(*) as total_templates,
  COUNT(slug) as com_slug,
  COUNT(*) - COUNT(slug) as sem_slug,
  COUNT(CASE WHEN slug LIKE '-%' OR slug LIKE '%-' THEN 1 END) as slugs_malformados
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
  AND is_active = true;

-- 7. LISTAR TODOS OS TEMPLATES COM SLUGS CORRIGIDOS
SELECT 
  id,
  name,
  slug,
  type,
  CASE 
    WHEN slug IS NULL OR slug = '' THEN '❌ SEM SLUG'
    WHEN slug LIKE '-%' OR slug LIKE '%-' THEN '⚠️ SLUG MALFORMADO'
    ELSE '✅ OK'
  END as status_slug
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
  AND is_active = true
ORDER BY type, name;

