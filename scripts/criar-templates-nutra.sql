-- =====================================================
-- CRIAR TEMPLATES NUTRA NO BANCO DE DADOS
-- Copia todos os templates Wellness para Nutra
-- =====================================================

-- ⚠️ IMPORTANTE: Execute este script no Supabase SQL Editor
-- Este script COPIA templates Wellness para Nutra (não remove Wellness)

-- 1. Copiar todos os templates Wellness para Nutra
INSERT INTO templates_nutrition (
  name, 
  type, 
  language, 
  profession, 
  specialization, 
  objective,
  title, 
  description, 
  content, 
  cta_text, 
  whatsapp_message, 
  is_active,
  slug, 
  categoria,
  created_at,
  updated_at
)
SELECT 
  name, 
  type, 
  language, 
  'nutra' as profession,  -- ✅ Mudança: wellness → nutra
  specialization, 
  objective,
  title, 
  description, 
  content, 
  cta_text, 
  whatsapp_message, 
  is_active,
  slug, 
  categoria,
  NOW() as created_at,  -- Nova data de criação
  NOW() as updated_at
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
  AND is_active = true;

-- 2. Verificar quantos templates foram criados
SELECT 
  COUNT(*) as total_nutra_templates,
  profession,
  language,
  is_active
FROM templates_nutrition
WHERE profession = 'nutra'
GROUP BY profession, language, is_active;

-- 3. Verificar se todos os templates foram copiados
SELECT 
  w.name as wellness_template,
  w.type as tipo,
  n.name as nutra_template,
  CASE 
    WHEN n.id IS NULL THEN '❌ FALTANDO' 
    ELSE '✅ OK' 
  END as status
FROM templates_nutrition w
LEFT JOIN templates_nutrition n ON w.name = n.name 
  AND n.profession = 'nutra' 
  AND w.type = n.type
WHERE w.profession = 'wellness'
  AND w.is_active = true
  AND w.language = 'pt'
ORDER BY status, w.name;

-- 4. Estatísticas
SELECT 
  'Wellness' as area,
  COUNT(*) as total_templates,
  COUNT(DISTINCT type) as tipos_diferentes,
  COUNT(DISTINCT categoria) as categorias_diferentes
FROM templates_nutrition
WHERE profession = 'wellness' AND is_active = true AND language = 'pt'

UNION ALL

SELECT 
  'Nutra' as area,
  COUNT(*) as total_templates,
  COUNT(DISTINCT type) as tipos_diferentes,
  COUNT(DISTINCT categoria) as categorias_diferentes
FROM templates_nutrition
WHERE profession = 'nutra' AND is_active = true AND language = 'pt';

-- ✅ Se tudo estiver OK, você deve ver:
-- - Mesmo número de templates em Wellness e Nutra
-- - Todos os templates com status "✅ OK"
-- - Mesmas categorias e tipos

