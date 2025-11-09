-- ============================================
-- CORRIGIR TEMPLATE SEM CONTENT
-- Adicionar content para "Planilha Dieta Emagrecimento"
-- ============================================

-- Planilha Dieta Emagrecimento (slug: lanilha-ieta-magrecimento - parece ter typo)
UPDATE templates_nutrition
SET 
  content = '{
    "template_type": "planilha",
    "sections": [
      {"id": 1, "title": "Café da Manhã", "content": "Opções de café da manhã para emagrecimento"},
      {"id": 2, "title": "Lanche da Manhã", "content": "Lanche saudável"},
      {"id": 3, "title": "Almoço", "content": "Refeição principal balanceada"},
      {"id": 4, "title": "Lanche da Tarde", "content": "Lanche nutritivo"},
      {"id": 5, "title": "Jantar", "content": "Jantar leve e nutritivo"},
      {"id": 6, "title": "Ceia (opcional)", "content": "Ceia leve se necessário"}
    ],
    "profession": "nutri"
  }'::jsonb,
  updated_at = NOW()
WHERE profession = 'nutri'
  AND language = 'pt'
  AND slug = 'lanilha-ieta-magrecimento';

-- ============================================
-- VERIFICAR SE HÁ OUTROS TEMPLATES SEM CONTENT
-- ============================================
SELECT 
  name,
  slug,
  type,
  CASE 
    WHEN content IS NULL OR content::text = '{}' THEN '❌ Sem content'
    WHEN content::text LIKE '%"profession": "nutri"%' THEN '✅ Content Nutri'
    WHEN content::text LIKE '%template_type%' THEN '⚠️ Content sem profession'
    ELSE '❌ Content inválido'
  END as status
FROM templates_nutrition
WHERE profession = 'nutri'
  AND language = 'pt'
  AND (content IS NULL OR content::text = '{}' OR content::text NOT LIKE '%template_type%')
ORDER BY status, name;

-- ============================================
-- VERIFICAR DUPLICATAS (mesmo nome, slugs diferentes)
-- ============================================
SELECT 
  name,
  COUNT(*) as quantidade,
  STRING_AGG(slug, ', ') as slugs
FROM templates_nutrition
WHERE profession = 'nutri'
  AND language = 'pt'
GROUP BY name
HAVING COUNT(*) > 1
ORDER BY quantidade DESC, name;

-- ============================================
-- VERIFICAR RESULTADO FINAL
-- ============================================
SELECT 
  COUNT(*) as total_templates,
  COUNT(CASE WHEN content::text LIKE '%"profession": "nutri"%' THEN 1 END) as com_content_nutri,
  COUNT(CASE WHEN content::text LIKE '%template_type%' THEN 1 END) as com_content_geral,
  COUNT(CASE WHEN content IS NULL OR content::text = '{}' THEN 1 END) as sem_content
FROM templates_nutrition
WHERE profession = 'nutri'
  AND language = 'pt';

