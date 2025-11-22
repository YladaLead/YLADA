-- =====================================================
-- COPIAR/CRIAR TEMPLATE "DESAFIO 21 DIAS" PARA COACH
-- =====================================================
-- Este script busca o template "desafio-21-dias" em Nutri ou Wellness
-- e copia para Coach. Se não existir, cria um template básico.

-- Verificar se já existe em Coach
DO $$
DECLARE
  ja_existe BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM coach_templates_nutrition 
    WHERE slug = 'desafio-21-dias' 
    AND profession = 'coach'
  ) INTO ja_existe;
  
  IF ja_existe THEN
    RAISE NOTICE 'ℹ️ Template "desafio-21-dias" já existe em Coach. Pulando criação.';
    RETURN;
  END IF;
END $$;

-- Tentar copiar de Nutri primeiro
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
  gen_random_uuid(),
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
  'coach' as profession,
  t.is_active,
  0 as usage_count,
  COALESCE(t.slug, 'desafio-21-dias') as slug,
  NULL as icon,
  NOW() as created_at,
  NOW() as updated_at
FROM templates_nutrition t
WHERE (t.slug = 'desafio-21-dias' OR LOWER(t.name) LIKE '%desafio%21%dias%')
  AND t.is_active = true
  AND t.language = 'pt'
  AND (t.profession = 'nutri' OR t.profession IS NULL OR t.profession = '')
  AND NOT EXISTS (
    SELECT 1 FROM coach_templates_nutrition c
    WHERE c.slug = 'desafio-21-dias'
  )
LIMIT 1;

-- Se não encontrou em Nutri, tentar copiar de Wellness
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM coach_templates_nutrition 
    WHERE slug = 'desafio-21-dias'
  ) THEN
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
      gen_random_uuid(),
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
      'coach' as profession,
      t.is_active,
      0 as usage_count,
      'desafio-21-dias' as slug,
      NULL as icon,
      NOW() as created_at,
      NOW() as updated_at
    FROM templates_nutrition t
    WHERE (t.slug = 'desafio-21-dias' OR LOWER(t.name) LIKE '%desafio%21%dias%')
      AND t.is_active = true
      AND t.language = 'pt'
      AND t.profession = 'wellness'
    LIMIT 1;
    
    RAISE NOTICE '✅ Template copiado de Wellness para Coach';
  END IF;
END $$;

-- Se ainda não encontrou, criar template básico
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM coach_templates_nutrition 
    WHERE slug = 'desafio-21-dias'
  ) THEN
    INSERT INTO coach_templates_nutrition (
      id,
      name,
      type,
      language,
      title,
      description,
      content,
      profession,
      is_active,
      usage_count,
      slug,
      created_at,
      updated_at
    )
    VALUES (
      gen_random_uuid(),
      'Desafio 21 Dias',
      'quiz',
      'pt',
      'Desafio 21 Dias',
      'Um desafio completo de 21 dias para transformação profunda e duradoura.',
      '{"template_type": "quiz", "profession": "coach", "questions": []}'::jsonb,
      'coach',
      true,
      0,
      'desafio-21-dias',
      NOW(),
      NOW()
    );
    
    RAISE NOTICE '✅ Template básico criado em Coach (sem conteúdo completo)';
  END IF;
END $$;

-- Verificar se foi copiado com sucesso
SELECT 
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM coach_templates_nutrition 
      WHERE slug = 'desafio-21-dias' 
      AND profession = 'coach'
      AND is_active = true
    ) THEN '✅ Template copiado com sucesso!'
    ELSE '❌ Erro: Template não foi copiado'
  END as resultado;

-- Mostrar detalhes do template copiado
SELECT 
  id,
  name,
  slug,
  type,
  profession,
  is_active,
  created_at
FROM coach_templates_nutrition
WHERE slug = 'desafio-21-dias'
  AND profession = 'coach';

