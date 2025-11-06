-- =====================================================
-- RESTAURAR TEMPLATES WELLNESS QUE FORAM EXCLUÍDOS
-- =====================================================
-- Este script verifica se os templates excluídos ainda existem
-- em outras áreas (nutri, coach, nutra) e os restaura em wellness
-- =====================================================

-- 1. VERIFICAR SE OS TEMPLATES EXCLUÍDOS EXISTEM EM OUTRAS ÁREAS
SELECT 
  '🔍 TEMPLATES QUE PODEM SER RESTAURADOS' as info,
  t.name as nome,
  t.profession as area_atual,
  t.type as tipo,
  t.is_active as ativo,
  t.created_at as criado_em
FROM templates_nutrition t
WHERE t.language = 'pt'
  AND t.profession IN ('nutri', 'coach', 'nutra')
  AND (
    -- Planilhas que foram excluídas
    LOWER(t.name) LIKE '%cardapio%detox%' OR
    LOWER(t.name) LIKE '%cardápio%detox%' OR
    t.name = 'Cardápio Detox' OR
    LOWER(t.name) LIKE '%diario%alimentar%' OR
    LOWER(t.name) LIKE '%diário%alimentar%' OR
    t.name = 'Diário Alimentar' OR
    LOWER(t.name) LIKE '%infografico%' OR
    LOWER(t.name) LIKE '%infográfico%' OR
    t.name = 'Infográfico' OR
    LOWER(t.name) LIKE '%metas%semanais%' OR
    t.name = 'Metas Semanais' OR
    LOWER(t.name) LIKE '%planejador%semanal%' OR
    LOWER(t.name) LIKE '%planejdaro%semanal%' OR
    t.name = 'Planejador Semanal' OR
    LOWER(t.name) LIKE '%receitas%saudaveis%' OR
    LOWER(t.name) LIKE '%receitas%saudáveis%' OR
    LOWER(t.name) LIKE '%receistas%saudaveis%' OR
    t.name = 'Receitas Saudáveis' OR
    -- Quizzes/Diagnósticos que foram excluídos
    LOWER(t.name) LIKE '%avaliacao%nutricional%' OR
    LOWER(t.name) LIKE '%avaliação%nutricional%' OR
    t.name = 'Avaliação Nutricional' OR
    LOWER(t.name) LIKE '%formulario%recomendacoes%' OR
    LOWER(t.name) LIKE '%formulário%recomendações%' OR
    LOWER(t.name) LIKE '%formlari%recomendacoes%' OR
    t.name = 'Formulário de Recomendações' OR
    LOWER(t.name) LIKE '%qual%perfil%intestino%' OR
    LOWER(t.name) LIKE '%qual%é%seu%perfil%de%intestino%' OR
    t.name = 'Qual é seu perfil de intestino?' OR
    LOWER(t.name) LIKE '%quiz%de%bem%estar%' OR
    LOWER(t.name) LIKE '%quiz%de%bem-estar%' OR
    t.name = 'Quiz de Bem-Estar' OR
    LOWER(t.name) LIKE '%quiz%perfil%nutricional%' OR
    LOWER(t.name) LIKE '%quiz%perfil%nutricionaç%' OR
    t.name = 'Quiz de Perfil Nutricional' OR
    LOWER(t.name) LIKE '%diagnostico%parasitose%' OR
    LOWER(t.name) LIKE '%diagnóstico%parasitose%' OR
    t.name = 'Diagnóstico de Parasitose' OR
    t.name = 'Quiz: Diagnóstico de Parasitas' OR
    LOWER(t.name) LIKE '%quiz%perfil%bem%estar%' OR
    LOWER(t.name) LIKE '%quiz:%perfil%do%bem%estar%' OR
    t.name = 'Quiz: Perfil de Bem-Estar' OR
    LOWER(t.name) LIKE '%quiz%detox%' OR
    t.name = 'Quiz Detox' OR
    LOWER(t.name) LIKE '%story%interativo%' OR
    t.name = 'Story Interativo'
  )
  AND NOT EXISTS (
    -- Verificar se já existe em wellness
    SELECT 1 FROM templates_nutrition t2
    WHERE t2.name = t.name
      AND t2.type = t.type
      AND t2.language = t.language
      AND t2.profession = 'wellness'
  )
ORDER BY t.profession, t.name;

-- 2. RESTAURAR TEMPLATES DE OUTRAS ÁREAS PARA WELLNESS
-- Este INSERT copia os templates de nutri/coach/nutra para wellness
INSERT INTO templates_nutrition (
  name,
  type,
  language,
  specialization,
  objective,
  title,
  description,
  content,
  cta_text,
  whatsapp_message,
  is_active,
  profession,
  slug
)
SELECT 
  t.name,
  t.type,
  t.language,
  t.specialization,
  t.objective,
  t.title,
  t.description,
  t.content,
  t.cta_text,
  t.whatsapp_message,
  true, -- Ativar automaticamente
  'wellness' as profession,
  t.slug -- Manter o slug se existir
FROM templates_nutrition t
WHERE t.language = 'pt'
  AND t.profession IN ('nutri', 'coach', 'nutra')
  AND (
    -- Planilhas
    LOWER(t.name) LIKE '%cardapio%detox%' OR
    LOWER(t.name) LIKE '%cardápio%detox%' OR
    t.name = 'Cardápio Detox' OR
    LOWER(t.name) LIKE '%diario%alimentar%' OR
    LOWER(t.name) LIKE '%diário%alimentar%' OR
    t.name = 'Diário Alimentar' OR
    LOWER(t.name) LIKE '%infografico%' OR
    LOWER(t.name) LIKE '%infográfico%' OR
    t.name = 'Infográfico' OR
    LOWER(t.name) LIKE '%metas%semanais%' OR
    t.name = 'Metas Semanais' OR
    LOWER(t.name) LIKE '%planejador%semanal%' OR
    LOWER(t.name) LIKE '%planejdaro%semanal%' OR
    t.name = 'Planejador Semanal' OR
    LOWER(t.name) LIKE '%receitas%saudaveis%' OR
    LOWER(t.name) LIKE '%receitas%saudáveis%' OR
    LOWER(t.name) LIKE '%receistas%saudaveis%' OR
    t.name = 'Receitas Saudáveis' OR
    -- Quizzes/Diagnósticos
    LOWER(t.name) LIKE '%avaliacao%nutricional%' OR
    LOWER(t.name) LIKE '%avaliação%nutricional%' OR
    t.name = 'Avaliação Nutricional' OR
    LOWER(t.name) LIKE '%formulario%recomendacoes%' OR
    LOWER(t.name) LIKE '%formulário%recomendações%' OR
    LOWER(t.name) LIKE '%formlari%recomendacoes%' OR
    t.name = 'Formulário de Recomendações' OR
    LOWER(t.name) LIKE '%qual%perfil%intestino%' OR
    LOWER(t.name) LIKE '%qual%é%seu%perfil%de%intestino%' OR
    t.name = 'Qual é seu perfil de intestino?' OR
    LOWER(t.name) LIKE '%quiz%de%bem%estar%' OR
    LOWER(t.name) LIKE '%quiz%de%bem-estar%' OR
    t.name = 'Quiz de Bem-Estar' OR
    LOWER(t.name) LIKE '%quiz%perfil%nutricional%' OR
    LOWER(t.name) LIKE '%quiz%perfil%nutricionaç%' OR
    t.name = 'Quiz de Perfil Nutricional' OR
    LOWER(t.name) LIKE '%diagnostico%parasitose%' OR
    LOWER(t.name) LIKE '%diagnóstico%parasitose%' OR
    t.name = 'Diagnóstico de Parasitose' OR
    t.name = 'Quiz: Diagnóstico de Parasitas' OR
    LOWER(t.name) LIKE '%quiz%perfil%bem%estar%' OR
    LOWER(t.name) LIKE '%quiz:%perfil%do%bem%estar%' OR
    t.name = 'Quiz: Perfil de Bem-Estar' OR
    LOWER(t.name) LIKE '%quiz%detox%' OR
    t.name = 'Quiz Detox' OR
    LOWER(t.name) LIKE '%story%interativo%' OR
    t.name = 'Story Interativo'
  )
  AND NOT EXISTS (
    -- Evitar duplicatas: verificar se já existe em wellness
    SELECT 1 FROM templates_nutrition t2
    WHERE t2.name = t.name
      AND t2.type = t.type
      AND t2.language = t.language
      AND t2.profession = 'wellness'
  );

-- 3. VERIFICAR RESULTADO DA RESTAURAÇÃO
SELECT 
  '✅ TEMPLATES WELLNESS APÓS RESTAURAÇÃO' as info,
  COUNT(*) as total_templates,
  COUNT(CASE WHEN type = 'calculadora' THEN 1 END) as calculadoras,
  COUNT(CASE WHEN type = 'quiz' THEN 1 END) as quizzes,
  COUNT(CASE WHEN type = 'planilha' THEN 1 END) as planilhas
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
  AND is_active = true;

-- 4. LISTAR TODOS OS TEMPLATES WELLNESS RESTAURADOS
SELECT 
  name as nome,
  slug,
  type as tipo,
  is_active as ativo,
  created_at as criado_em
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
  AND is_active = true
ORDER BY type, name;

-- 5. APLICAR SLUGS LIMPOS AOS TEMPLATES RESTAURADOS
-- Usar a função gerar_slug_limpo se existir, senão usar regex
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
  AND (slug IS NULL OR slug = '' OR slug LIKE '-%' OR slug LIKE '%-');

-- 6. VERIFICAÇÃO FINAL
SELECT 
  '📊 RESUMO FINAL' as info,
  COUNT(*) as total_templates_wellness,
  COUNT(CASE WHEN is_active = true THEN 1 END) as ativos,
  COUNT(CASE WHEN is_active = false THEN 1 END) as inativos,
  COUNT(CASE WHEN slug IS NULL OR slug = '' THEN 1 END) as sem_slug,
  COUNT(CASE WHEN slug LIKE '-%' OR slug LIKE '%-' THEN 1 END) as slugs_malformados
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt';

