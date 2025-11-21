-- =====================================================
-- SINCRONIZAR TEMPLATES COACH COM NUTRI
-- =====================================================
-- Este script limpa a tabela coach_templates_nutrition
-- e copia APENAS os templates ativos que estão no Nutri
-- Garantindo que Coach tenha exatamente os mesmos templates do Nutri

-- =====================================================
-- 1. VERIFICAR ESTADO ANTES
-- =====================================================
SELECT 
  'ANTES - Nutri' as area,
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE is_active = true) as ativos,
  COUNT(*) FILTER (WHERE is_active = false) as inativos
FROM templates_nutrition
WHERE (profession = 'nutri' OR profession IS NULL OR profession = '')
  AND language = 'pt';

SELECT 
  'ANTES - Coach' as area,
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE is_active = true) as ativos,
  COUNT(*) FILTER (WHERE is_active = false) as inativos
FROM coach_templates_nutrition;

-- =====================================================
-- 2. LIMPAR TODA A TABELA COACH (PARA RECOMEÇAR)
-- =====================================================
TRUNCATE TABLE coach_templates_nutrition CASCADE;

-- =====================================================
-- 3. COPIAR APENAS TEMPLATES ATIVOS DO NUTRI
-- =====================================================
-- Copiar apenas os templates que estão ativos no Nutri
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
  'coach' as profession, -- Sempre 'coach' para esta tabela
  t.is_active, -- Manter o mesmo status (deve ser true)
  0 as usage_count, -- Resetar contador
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'templates_nutrition' 
      AND column_name = 'slug'
    ) THEN t.slug
    ELSE NULL
  END as slug,
  NULL as icon, -- Icon não existe na tabela original
  NOW() as created_at,
  NOW() as updated_at
FROM templates_nutrition t
WHERE t.is_active = true -- APENAS ATIVOS
  AND t.language = 'pt'
  AND (t.profession = 'nutri' OR t.profession IS NULL OR t.profession = ''); -- Apenas templates do Nutri

-- =====================================================
-- 4. ATUALIZAR SLUGS (SE A COLUNA EXISTIR)
-- =====================================================
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'templates_nutrition' 
    AND column_name = 'slug'
  ) THEN
    -- Atualizar slugs dos templates copiados
    UPDATE coach_templates_nutrition c
    SET slug = t.slug
    FROM templates_nutrition t
    WHERE c.name = t.name 
      AND c.type = t.type 
      AND c.language = t.language
      AND t.slug IS NOT NULL
      AND (t.profession = 'nutri' OR t.profession IS NULL OR t.profession = '')
      AND t.is_active = true;
    
    RAISE NOTICE '✅ Slugs atualizados dos templates copiados';
  END IF;
END $$;

-- =====================================================
-- 5. VERIFICAR ESTADO DEPOIS
-- =====================================================
SELECT 
  'DEPOIS - Nutri' as area,
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE is_active = true) as ativos,
  COUNT(*) FILTER (WHERE is_active = false) as inativos
FROM templates_nutrition
WHERE (profession = 'nutri' OR profession IS NULL OR profession = '')
  AND language = 'pt';

SELECT 
  'DEPOIS - Coach' as area,
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE is_active = true) as ativos,
  COUNT(*) FILTER (WHERE is_active = false) as inativos
FROM coach_templates_nutrition;

-- =====================================================
-- 6. COMPARAR RESULTADO FINAL
-- =====================================================
SELECT 
  'Comparação Final' as info,
  (SELECT COUNT(*) 
   FROM templates_nutrition 
   WHERE is_active = true 
   AND language = 'pt'
   AND (profession = 'nutri' OR profession IS NULL OR profession = '')) as nutri_ativos,
  (SELECT COUNT(*) 
   FROM coach_templates_nutrition 
   WHERE is_active = true) as coach_ativos,
  (SELECT COUNT(*) 
   FROM templates_nutrition 
   WHERE is_active = true 
   AND language = 'pt'
   AND (profession = 'nutri' OR profession IS NULL OR profession = '')) - 
  (SELECT COUNT(*) 
   FROM coach_templates_nutrition 
   WHERE is_active = true) as diferenca,
  CASE 
    WHEN (SELECT COUNT(*) FROM templates_nutrition WHERE is_active = true AND language = 'pt' AND (profession = 'nutri' OR profession IS NULL OR profession = '')) = 
         (SELECT COUNT(*) FROM coach_templates_nutrition WHERE is_active = true)
    THEN '✅ Sincronizado'
    ELSE '⚠️ Diferença encontrada'
  END as status;

-- =====================================================
-- 7. LISTAR TEMPLATES COPIADOS (PARA VERIFICAÇÃO)
-- =====================================================
SELECT 
  name,
  type,
  language,
  is_active,
  slug
FROM coach_templates_nutrition
ORDER BY name, type, language;

