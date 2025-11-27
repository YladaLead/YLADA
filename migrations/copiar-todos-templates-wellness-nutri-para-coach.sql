-- =====================================================
-- COPIAR TODOS OS TEMPLATES WELLNESS/NUTRI PARA COACH
-- =====================================================
-- Este script copia TODOS os templates ativos de Wellness/Nutri
-- para coach_templates_nutrition, mantendo os nomes e slugs originais
-- =====================================================

-- =====================================================
-- PASSO 1: VERIFICAR ESTADO ANTES
-- =====================================================

SELECT 
  'ANTES - Templates Wellness/Nutri' as info,
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE is_active = true) as ativos
FROM templates_nutrition
WHERE is_active = true
  AND language = 'pt'
  AND (profession = 'wellness' OR profession = 'nutri' OR profession IS NULL OR profession = '');

SELECT 
  'ANTES - Templates Coach' as info,
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE is_active = true) as ativos
FROM coach_templates_nutrition
WHERE language = 'pt';

-- =====================================================
-- PASSO 2: COPIAR TODOS OS TEMPLATES ATIVOS
-- =====================================================
-- Copia todos os templates ativos de Wellness/Nutri para Coach
-- Mantém os nomes e slugs originais

INSERT INTO coach_templates_nutrition (
  id,
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
  profession,
  is_active,
  usage_count,
  slug,
  icon,
  created_at,
  updated_at
)
SELECT 
  gen_random_uuid(), -- Novo ID (para evitar conflitos)
  t.name, -- Manter nome original
  t.type,
  t.language,
  t.specialization,
  t.objective,
  t.title,
  t.description,
  t.content,
  t.cta_text,
  t.whatsapp_message,
  'coach' as profession, -- Sempre 'coach' para esta tabela
  t.is_active, -- Manter status ativo
  0 as usage_count, -- Resetar contador
  t.slug, -- Manter slug original
  NULL as icon, -- Icon será NULL (pode ser preenchido depois)
  NOW() as created_at,
  NOW() as updated_at
FROM templates_nutrition t
WHERE t.is_active = true -- APENAS ATIVOS
  AND t.language = 'pt'
  AND (t.profession = 'wellness' OR t.profession = 'nutri' OR t.profession IS NULL OR t.profession = '')
  AND NOT EXISTS (
    -- Não copiar se já existe em coach_templates_nutrition com mesmo nome e tipo
    SELECT 1 FROM coach_templates_nutrition c
    WHERE c.name = t.name 
      AND c.type = t.type 
      AND c.language = t.language
  );

-- =====================================================
-- PASSO 3: ATIVAR TEMPLATES QUE ESTÃO INATIVOS EM COACH
-- =====================================================
-- Se um template já existe mas está inativo, ativar

UPDATE coach_templates_nutrition c
SET is_active = true,
    updated_at = NOW()
FROM templates_nutrition t
WHERE c.name = t.name 
  AND c.type = t.type 
  AND c.language = t.language
  AND t.is_active = true
  AND c.is_active = false;

-- =====================================================
-- PASSO 4: ATUALIZAR SLUGS SE ESTIVEREM NULL
-- =====================================================
-- Se o template em Coach não tem slug mas o original tem, copiar

UPDATE coach_templates_nutrition c
SET slug = t.slug,
    updated_at = NOW()
FROM templates_nutrition t
WHERE c.name = t.name 
  AND c.type = t.type 
  AND c.language = t.language
  AND t.slug IS NOT NULL
  AND t.slug != ''
  AND (c.slug IS NULL OR c.slug = '');

-- =====================================================
-- PASSO 5: VERIFICAÇÃO FINAL
-- =====================================================

SELECT 
  'DEPOIS - Templates Coach' as info,
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE is_active = true) as ativos,
  COUNT(*) FILTER (WHERE is_active = false) as inativos,
  COUNT(*) FILTER (WHERE slug IS NULL OR slug = '') as sem_slug
FROM coach_templates_nutrition
WHERE language = 'pt';

-- Listar todos os templates copiados
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
ORDER BY type, name;

-- Comparação final
SELECT 
  'Comparação Final' as info,
  (SELECT COUNT(*) 
   FROM templates_nutrition 
   WHERE is_active = true 
   AND language = 'pt'
   AND (profession = 'wellness' OR profession = 'nutri' OR profession IS NULL OR profession = '')) as wellness_nutri_ativos,
  (SELECT COUNT(*) 
   FROM coach_templates_nutrition 
   WHERE language = 'pt' AND is_active = true) as coach_ativos,
  (SELECT COUNT(*) 
   FROM templates_nutrition 
   WHERE is_active = true 
   AND language = 'pt'
   AND (profession = 'wellness' OR profession = 'nutri' OR profession IS NULL OR profession = '')) - 
  (SELECT COUNT(*) 
   FROM coach_templates_nutrition 
   WHERE language = 'pt' AND is_active = true) as diferenca,
  CASE 
    WHEN (SELECT COUNT(*) FROM templates_nutrition WHERE is_active = true AND language = 'pt' AND (profession = 'wellness' OR profession = 'nutri' OR profession IS NULL OR profession = '')) = 
         (SELECT COUNT(*) FROM coach_templates_nutrition WHERE language = 'pt' AND is_active = true)
    THEN '✅ Sincronizado'
    ELSE '⚠️ Diferença encontrada'
  END as status;

-- Resumo por tipo
SELECT 
  type as tipo,
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE is_active = true) as ativos,
  STRING_AGG(name, ', ' ORDER BY name) as nomes
FROM coach_templates_nutrition
WHERE language = 'pt'
GROUP BY type
ORDER BY type;

