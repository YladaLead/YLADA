-- =====================================================
-- VERIFICAR CONTENT JSONB DO TEMPLATE "perfil-intestino"
-- Para encontrar textos explicativos dentro do content
-- =====================================================

-- Verificar se há textos explicativos no content JSONB
SELECT 
  id,
  name,
  slug,
  profession,
  -- Verificar se o content contém textos explicativos
  CASE 
    WHEN content::text ILIKE '%identificar pessoas%' THEN '❌ TEM TEXTO EXPLICATIVO NO CONTENT'
    WHEN content::text ILIKE '%direcionando%' THEN '❌ TEM TEXTO EXPLICATIVO NO CONTENT'
    WHEN content::text ILIKE '%kit acelera%' THEN '❌ TEM TEXTO EXPLICATIVO NO CONTENT'
    ELSE '✅ SEM TEXTO EXPLICATIVO NO CONTENT'
  END as diagnostico_content,
  -- Mostrar o content completo para inspeção
  content::text as content_completo
FROM templates_nutrition
WHERE slug = 'perfil-intestino'
  AND profession = 'wellness';

-- Verificar especificamente nos diagnósticos dentro do content
SELECT 
  id,
  name,
  slug,
  -- Extrair diagnósticos do content (se existirem)
  jsonb_path_query_array(
    content,
    '$.diagnostics[*] ? (@.description like_regex "identificar pessoas|direcionando|kit acelera" flag "i")'
  ) as diagnosticos_com_texto_explicativo
FROM templates_nutrition
WHERE slug = 'perfil-intestino'
  AND profession = 'wellness'
  AND content IS NOT NULL;
