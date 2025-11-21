-- =====================================================
-- COPIAR TEMPLATES DA TABELA COMPARTILHADA PARA COACH
-- =====================================================
-- Este script copia todos os templates ativos
-- da tabela templates_nutrition para coach_templates_nutrition

-- Verificar se a tabela coach_templates_nutrition existe
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'coach_templates_nutrition'
  ) THEN
    RAISE EXCEPTION 'Tabela coach_templates_nutrition não existe. Execute primeiro criar-tabelas-templates-coach.sql';
  END IF;
END $$;

-- Copiar TODOS os templates ativos
-- Usar apenas colunas que existem na tabela templates_nutrition
-- Se slug não existir, será NULL (aceitável)
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
  t.is_active,
  0 as usage_count, -- Resetar contador
  NULL as slug, -- Slug será NULL se não existir na tabela original (pode ser preenchido depois)
  NULL as icon, -- Icon não existe na tabela original, usar NULL
  NOW() as created_at,
  NOW() as updated_at
FROM templates_nutrition t
WHERE t.is_active = true
  AND t.language = 'pt'
  AND NOT EXISTS (
    -- Verificar duplicatas: por name+type+language (mais confiável)
    SELECT 1 FROM coach_templates_nutrition c
    WHERE c.name = t.name 
      AND c.type = t.type 
      AND c.language = t.language
  );

-- Se a coluna slug existir na tabela original, atualizar os registros copiados
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
      AND c.slug IS NULL;
    
    RAISE NOTICE '✅ Slugs atualizados dos templates copiados';
  ELSE
    RAISE NOTICE 'ℹ️ Coluna slug não existe na tabela templates_nutrition, pulando atualização';
  END IF;
END $$;

-- Log do resultado
DO $$
DECLARE
  total_depois INTEGER;
BEGIN
  SELECT COUNT(*) INTO total_depois
  FROM coach_templates_nutrition;
  
  RAISE NOTICE '✅ Templates Coach - Total: %', total_depois;
END $$;

-- Verificar resultado final
SELECT 
  'Templates Coach' as tabela,
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE is_active = true) as ativos,
  COUNT(*) FILTER (WHERE is_active = false) as inativos,
  COUNT(DISTINCT type) as tipos_diferentes
FROM coach_templates_nutrition;

-- Comparar com templates_nutrition original
SELECT 
  'Comparação' as info,
  (SELECT COUNT(*) FROM templates_nutrition WHERE is_active = true AND language = 'pt') as total_originais,
  (SELECT COUNT(*) FROM coach_templates_nutrition WHERE is_active = true) as total_coach,
  (SELECT COUNT(*) FROM templates_nutrition WHERE is_active = true AND language = 'pt') - 
  (SELECT COUNT(*) FROM coach_templates_nutrition WHERE is_active = true) as diferenca;
