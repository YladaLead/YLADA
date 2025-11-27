-- =====================================================
-- REMOVER TEMPLATES INCORRETOS DA ÁREA COACH
-- =====================================================
-- Este script remove os 8 templates que foram criados incorretamente
-- Mantém os 29 templates originais importados de Nutri
-- =====================================================

-- =====================================================
-- PASSO 1: VERIFICAR ANTES DE REMOVER
-- =====================================================

SELECT 
  'TEMPLATES A SEREM REMOVIDOS' as info,
  COUNT(*) as total
FROM coach_templates_nutrition
WHERE slug IN (
  'calc-composicao',
  'diagnostico-sintomas-intestinais',
  'guia-hidratacao',
  'quiz-ganhos',
  'quiz-potencial',
  'quiz-proposito',
  'template-desafio-21dias',
  'template-desafio-7dias'
)
AND language = 'pt'
AND profession = 'coach';

-- Listar os templates que serão removidos
SELECT 
  name as nome,
  slug,
  type as tipo,
  is_active,
  created_at as criado_em
FROM coach_templates_nutrition
WHERE slug IN (
  'calc-composicao',
  'diagnostico-sintomas-intestinais',
  'guia-hidratacao',
  'quiz-ganhos',
  'quiz-potencial',
  'quiz-proposito',
  'template-desafio-21dias',
  'template-desafio-7dias'
)
AND language = 'pt'
AND profession = 'coach'
ORDER BY name;

-- =====================================================
-- PASSO 2: REMOVER OS 8 TEMPLATES INCORRETOS
-- =====================================================

DELETE FROM coach_templates_nutrition
WHERE slug IN (
  'calc-composicao',
  'diagnostico-sintomas-intestinais',
  'guia-hidratacao',
  'quiz-ganhos',
  'quiz-potencial',
  'quiz-proposito',
  'template-desafio-21dias',
  'template-desafio-7dias'
)
AND language = 'pt'
AND profession = 'coach';

-- =====================================================
-- PASSO 3: VERIFICAÇÃO FINAL
-- =====================================================

-- Verificar se foram removidos
SELECT 
  'VERIFICAÇÃO - TEMPLATES REMOVIDOS' as info,
  COUNT(*) as ainda_existem
FROM coach_templates_nutrition
WHERE slug IN (
  'calc-composicao',
  'diagnostico-sintomas-intestinais',
  'guia-hidratacao',
  'quiz-ganhos',
  'quiz-potencial',
  'quiz-proposito',
  'template-desafio-21dias',
  'template-desafio-7dias'
)
AND language = 'pt'
AND profession = 'coach';

-- Contar total de templates Coach após remoção
SELECT 
  'TOTAL TEMPLATES COACH APÓS REMOÇÃO' as info,
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE is_active = true) as ativos,
  COUNT(*) FILTER (WHERE is_active = false) as inativos
FROM coach_templates_nutrition
WHERE language = 'pt'
AND profession = 'coach';

-- Listar todos os templates Coach restantes (para confirmar que os 29 originais estão mantidos)
SELECT 
  ROW_NUMBER() OVER (ORDER BY type, name) as num,
  name as nome,
  slug,
  type as tipo,
  is_active,
  CASE 
    WHEN slug IS NULL OR slug = '' THEN '⚠️ SEM SLUG'
    WHEN is_active = false THEN '⚠️ INATIVO'
    ELSE '✅ OK'
  END as status
FROM coach_templates_nutrition
WHERE language = 'pt'
AND profession = 'coach'
ORDER BY type, name;

-- Resumo por tipo
SELECT 
  type as tipo,
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE is_active = true) as ativos,
  STRING_AGG(name, ', ' ORDER BY name) as nomes
FROM coach_templates_nutrition
WHERE language = 'pt'
AND profession = 'coach'
GROUP BY type
ORDER BY type;

-- =====================================================
-- PASSO 4: CONFIRMAÇÃO
-- =====================================================

DO $$
DECLARE
  templates_removidos INTEGER;
  templates_restantes INTEGER;
BEGIN
  -- Verificar quantos dos 8 templates ainda existem
  SELECT COUNT(*) INTO templates_removidos
  FROM coach_templates_nutrition
  WHERE slug IN (
    'calc-composicao',
    'diagnostico-sintomas-intestinais',
    'guia-hidratacao',
    'quiz-ganhos',
    'quiz-potencial',
    'quiz-proposito',
    'template-desafio-21dias',
    'template-desafio-7dias'
  )
  AND language = 'pt'
  AND profession = 'coach';
  
  -- Contar total de templates restantes
  SELECT COUNT(*) INTO templates_restantes
  FROM coach_templates_nutrition
  WHERE language = 'pt'
  AND profession = 'coach'
  AND is_active = true;
  
  RAISE NOTICE '========================================';
  RAISE NOTICE 'RESUMO DA REMOÇÃO';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Templates incorretos ainda existentes: %', templates_removidos;
  RAISE NOTICE 'Total de templates Coach ativos: %', templates_restantes;
  
  IF templates_removidos = 0 THEN
    RAISE NOTICE '✅ SUCESSO: Todos os 8 templates incorretos foram removidos!';
  ELSE
    RAISE NOTICE '⚠️ ATENÇÃO: Ainda existem % templates incorretos', templates_removidos;
  END IF;
  
  IF templates_restantes = 29 THEN
    RAISE NOTICE '✅ PERFEITO: Os 29 templates originais de Nutri estão mantidos!';
  ELSE
    RAISE NOTICE 'ℹ️ Total de templates: % (esperado: 29)', templates_restantes;
  END IF;
END $$;

