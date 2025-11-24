-- ===========================================================
-- CORRIGIR SLUGS FALTANTES - TEMPLATES COACH
-- 
-- Alguns templates Coach estão com slug NULL, o que pode
-- causar problemas na geração de links públicos
-- ===========================================================

BEGIN;

-- Verificar templates Coach com slug NULL
SELECT 
  'ANTES DA CORREÇÃO' as status,
  id,
  name,
  slug,
  'Slug faltante' as problema
FROM templates_nutrition
WHERE profession = 'coach'
  AND language = 'pt'
  AND is_active = true
  AND slug IS NULL;

-- Corrigir slugs faltantes baseado no nome do template
UPDATE templates_nutrition
SET slug = 'avaliacao-perfil-metabolico-coach'
WHERE profession = 'coach'
  AND language = 'pt'
  AND name = 'Avaliação do Perfil Metabólico'
  AND slug IS NULL;

UPDATE templates_nutrition
SET slug = 'quiz-tipo-fome-coach'
WHERE profession = 'coach'
  AND language = 'pt'
  AND name = 'Qual é o seu Tipo de Fome?'
  AND slug IS NULL;

UPDATE templates_nutrition
SET slug = 'sindrome-metabolica-coach'
WHERE profession = 'coach'
  AND language = 'pt'
  AND name = 'Risco de Síndrome Metabólica'
  AND slug IS NULL;

UPDATE templates_nutrition
SET slug = 'nutrido-vs-alimentado-coach'
WHERE profession = 'coach'
  AND language = 'pt'
  AND name = 'Você está nutrido ou apenas alimentado?'
  AND slug IS NULL;

UPDATE templates_nutrition
SET slug = 'alimentacao-rotina-coach'
WHERE profession = 'coach'
  AND language = 'pt'
  AND name = 'Você está se alimentando conforme sua rotina?'
  AND slug IS NULL;

-- Verificar correções aplicadas
SELECT 
  'APÓS A CORREÇÃO' as status,
  id,
  name,
  slug,
  CASE 
    WHEN slug IS NOT NULL THEN '✅ Slug corrigido'
    ELSE '❌ Ainda sem slug'
  END as resultado
FROM templates_nutrition
WHERE profession = 'coach'
  AND language = 'pt'
  AND is_active = true
ORDER BY name;

-- Verificar se ainda há slugs NULL
SELECT 
  COUNT(*) as templates_sem_slug
FROM templates_nutrition
WHERE profession = 'coach'
  AND language = 'pt'
  AND is_active = true
  AND slug IS NULL;

COMMIT;

-- ===========================================================
-- RESULTADO ESPERADO:
-- - Todos os 8 templates Coach devem ter slugs únicos
-- - Links públicos funcionarão corretamente
-- - Diagnósticos independentes continuam funcionando
-- ===========================================================
