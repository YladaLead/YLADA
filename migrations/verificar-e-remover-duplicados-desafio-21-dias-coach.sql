-- =====================================================
-- VERIFICAR E REMOVER DUPLICADOS: "desafio-21-dias" em Coach
-- =====================================================
-- Este script verifica quantos templates "desafio-21-dias" existem
-- e remove os duplicados, mantendo apenas o correto (o que tem profession='coach' e está ativo)

-- PASSO 1: Verificar quantos templates existem
SELECT 
  id,
  name,
  slug,
  profession,
  language,
  is_active,
  created_at,
  updated_at,
  usage_count,
  (SELECT COUNT(*) FROM coach_user_templates WHERE template_id = coach_templates_nutrition.id) as ferramentas_usando,
  CASE 
    WHEN is_active = true AND profession = 'coach' AND (language = 'pt' OR language IS NULL) 
    THEN '✅ APARECE NA API'
    ELSE '❌ NÃO APARECE NA API'
  END as status_api
FROM coach_templates_nutrition
WHERE slug = 'desafio-21-dias' OR name ILIKE '%desafio%21%dias%'
ORDER BY 
  CASE 
    WHEN is_active = true AND profession = 'coach' AND (language = 'pt' OR language IS NULL) 
    THEN 0 
    ELSE 1 
  END,
  created_at DESC;

-- PASSO 2: Identificar qual é o correto
-- O template correto deve ter:
-- - profession = 'coach'
-- - is_active = true
-- - slug = 'desafio-21-dias'
-- - created_at mais recente (ou o que foi criado pelo script de migração)

-- PASSO 3: Verificar se há ferramentas usando cada template
SELECT 
  t.id as template_id,
  t.name as template_name,
  t.slug as template_slug,
  COUNT(ut.id) as ferramentas_usando
FROM coach_templates_nutrition t
LEFT JOIN coach_user_templates ut ON ut.template_id = t.id
WHERE t.slug = 'desafio-21-dias' OR t.name ILIKE '%desafio%21%dias%'
GROUP BY t.id, t.name, t.slug
ORDER BY ferramentas_usando DESC, t.created_at DESC;

-- PASSO 4: Remover duplicados (manter apenas o correto)
-- O template correto é o que:
-- 1. Tem profession = 'coach'
-- 2. Está ativo (is_active = true)
-- 3. Tem slug = 'desafio-21-dias'
-- 4. Foi criado pelo script de migração (tem created_at mais recente)

DO $$
DECLARE
  template_correto_id UUID;
  template_correto_name TEXT;
  template_duplicado RECORD;
  ferramentas_afetadas INTEGER;
  total_duplicados INTEGER := 0;
BEGIN
  -- Encontrar o template correto (o mais recente com profession='coach' e is_active=true)
  -- Priorizar o que tem language='pt' (necessário para aparecer na API)
  SELECT id, name INTO template_correto_id, template_correto_name
  FROM coach_templates_nutrition
  WHERE slug = 'desafio-21-dias'
    AND profession = 'coach'
    AND is_active = true
    AND (language = 'pt' OR language IS NULL) -- API busca language='pt'
  ORDER BY 
    CASE WHEN language = 'pt' THEN 0 ELSE 1 END, -- Priorizar com language='pt'
    created_at DESC
  LIMIT 1;

  IF template_correto_id IS NULL THEN
    RAISE NOTICE '⚠️ Nenhum template correto encontrado. Verifique manualmente.';
    RAISE NOTICE 'Procurando por templates com nome similar...';
    
    -- Tentar encontrar por nome similar (priorizar com language='pt')
    SELECT id, name INTO template_correto_id, template_correto_name
    FROM coach_templates_nutrition
    WHERE name ILIKE '%desafio%21%dias%'
      AND profession = 'coach'
      AND is_active = true
      AND (language = 'pt' OR language IS NULL)
    ORDER BY 
      CASE WHEN language = 'pt' THEN 0 ELSE 1 END,
      created_at DESC
    LIMIT 1;
    
    IF template_correto_id IS NULL THEN
      RAISE EXCEPTION 'Nenhum template "desafio-21-dias" correto encontrado. Execute o script de migração primeiro.';
    END IF;
  END IF;

  RAISE NOTICE '✅ Template correto identificado:';
  RAISE NOTICE '   - ID: %', template_correto_id;
  RAISE NOTICE '   - Nome: %', template_correto_name;

  -- Atualizar todas as ferramentas que usam templates duplicados para usar o correto
  -- Remover TODOS os duplicados, independente de language
  FOR template_duplicado IN
    SELECT id, name, slug, created_at, language
    FROM coach_templates_nutrition
    WHERE (slug = 'desafio-21-dias' OR name ILIKE '%desafio%21%dias%')
      AND id != template_correto_id
      AND profession = 'coach'
    ORDER BY created_at ASC
  LOOP
    total_duplicados := total_duplicados + 1;
    
    -- Atualizar ferramentas que usam o template duplicado
    UPDATE coach_user_templates
    SET template_id = template_correto_id
    WHERE template_id = template_duplicado.id;

    GET DIAGNOSTICS ferramentas_afetadas = ROW_COUNT;
    
    IF ferramentas_afetadas > 0 THEN
      RAISE NOTICE '📝 Atualizadas % ferramentas do template duplicado % (%) para usar o template correto', 
        ferramentas_afetadas, template_duplicado.id, template_duplicado.name;
    ELSE
      RAISE NOTICE 'ℹ️ Template duplicado % (%) não tem ferramentas associadas', 
        template_duplicado.id, template_duplicado.name;
    END IF;

    -- Remover o template duplicado
    DELETE FROM coach_templates_nutrition
    WHERE id = template_duplicado.id;

    RAISE NOTICE '🗑️ Template duplicado removido: % (%) [language: %]', 
      template_duplicado.id, template_duplicado.name, COALESCE(template_duplicado.language, 'NULL');
  END LOOP;

  IF total_duplicados = 0 THEN
    RAISE NOTICE '✅ Nenhum duplicado encontrado. Template correto já é o único.';
  ELSE
    RAISE NOTICE '✅ Total de % duplicados removidos. Template correto mantido: %', total_duplicados, template_correto_id;
  END IF;

  -- Verificar se ainda há duplicados (casos especiais)
  IF EXISTS (
    SELECT 1
    FROM coach_templates_nutrition
    WHERE (slug = 'desafio-21-dias' OR name ILIKE '%desafio%21%dias%')
      AND id != template_correto_id
  ) THEN
    RAISE WARNING '⚠️ Ainda existem templates duplicados. Verifique manualmente.';
  END IF;
END $$;

-- PASSO 5: Verificar resultado final
SELECT 
  id,
  name,
  slug,
  profession,
  language,
  is_active,
  created_at,
  (SELECT COUNT(*) FROM coach_user_templates WHERE template_id = coach_templates_nutrition.id) as ferramentas_usando,
  CASE 
    WHEN is_active = true AND profession = 'coach' AND (language = 'pt' OR language IS NULL) 
    THEN '✅ APARECE NA API'
    ELSE '❌ NÃO APARECE NA API'
  END as status_api
FROM coach_templates_nutrition
WHERE slug = 'desafio-21-dias' OR name ILIKE '%desafio%21%dias%'
ORDER BY created_at DESC;

-- =====================================================
-- RESULTADO ESPERADO:
-- =====================================================
-- Deve restar apenas 1 template "desafio-21-dias" com:
-- - profession = 'coach'
-- - is_active = true
-- - slug = 'desafio-21-dias'
-- =====================================================

