-- ============================================
-- DUPLICAR TEMPLATES WELLNESS → NUTRI
-- Completa a área Nutri com os templates faltantes
-- ============================================

-- ⚠️ IMPORTANTE: Execute este script no Supabase SQL Editor
-- Este script COPIA templates Wellness para Nutri (não remove Wellness)
-- Apenas cria templates que ainda não existem na Nutri

-- 1. VERIFICAR ESTADO ANTES
SELECT 
  'ANTES' as etapa,
  'Wellness' as area,
  COUNT(*) as total,
  COUNT(CASE WHEN is_active = true THEN 1 END) as ativos
FROM templates_nutrition
WHERE profession = 'wellness' AND language = 'pt'

UNION ALL

SELECT 
  'ANTES' as etapa,
  'Nutri' as area,
  COUNT(*) as total,
  COUNT(CASE WHEN is_active = true THEN 1 END) as ativos
FROM templates_nutrition
WHERE profession = 'nutri' AND language = 'pt';

-- 2. DUPLICAR TEMPLATES WELLNESS → NUTRI
-- Apenas os que não existem na Nutri (evita duplicatas)
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
  w.name,
  w.type,
  w.language,
  'nutri' as profession,  -- ✅ Mudança: wellness → nutri
  w.specialization,
  w.objective,
  w.title,
  w.description,
  w.content,
  w.cta_text,
  w.whatsapp_message,
  w.is_active,
  w.slug,
  w.categoria,
  NOW() as created_at,  -- Nova data de criação
  NOW() as updated_at
FROM templates_nutrition w
WHERE w.profession = 'wellness'
  AND w.language = 'pt'
  AND NOT EXISTS (
    -- Evitar duplicatas: verificar se já existe template Nutri com mesmo name+type+language
    SELECT 1 FROM templates_nutrition n
    WHERE LOWER(TRIM(n.name)) = LOWER(TRIM(w.name))
      AND n.type = w.type
      AND n.language = w.language
      AND n.profession = 'nutri'
  );

-- 3. VERIFICAR ESTADO DEPOIS
SELECT 
  'DEPOIS' as etapa,
  'Wellness' as area,
  COUNT(*) as total,
  COUNT(CASE WHEN is_active = true THEN 1 END) as ativos
FROM templates_nutrition
WHERE profession = 'wellness' AND language = 'pt'

UNION ALL

SELECT 
  'DEPOIS' as etapa,
  'Nutri' as area,
  COUNT(*) as total,
  COUNT(CASE WHEN is_active = true THEN 1 END) as ativos
FROM templates_nutrition
WHERE profession = 'nutri' AND language = 'pt';

-- 4. VERIFICAR QUANTOS TEMPLATES FORAM CRIADOS
SELECT 
  COUNT(*) as templates_criados
FROM templates_nutrition
WHERE profession = 'nutri'
  AND language = 'pt'
  AND created_at >= NOW() - INTERVAL '1 minute';

-- 5. LISTAR TEMPLATES QUE AINDA FALTAM (se houver)
SELECT 
  '❌ AINDA FALTANDO NA NUTRI' as status,
  w.name as nome_template,
  w.type as tipo,
  w.is_active as ativo_wellness
FROM templates_nutrition w
LEFT JOIN templates_nutrition n ON 
  LOWER(TRIM(w.name)) = LOWER(TRIM(n.name))
  AND w.type = n.type
  AND w.language = n.language
  AND n.profession = 'nutri'
WHERE w.profession = 'wellness'
  AND w.language = 'pt'
  AND n.id IS NULL
ORDER BY w.type, w.name;

-- 6. RESUMO POR TIPO - NUTRI (DEPOIS)
SELECT 
  'Nutri' as area,
  type as tipo,
  COUNT(*) as total,
  COUNT(CASE WHEN is_active = true THEN 1 END) as ativos
FROM templates_nutrition
WHERE profession = 'nutri' AND language = 'pt'
GROUP BY type
ORDER BY type;

-- 7. VERIFICAR SE TODOS OS TEMPLATES FORAM DUPLICADOS
SELECT 
  CASE 
    WHEN COUNT(*) = 0 THEN '✅ TODOS OS TEMPLATES FORAM DUPLICADOS!'
    ELSE CONCAT('⚠️ AINDA FALTAM ', COUNT(*), ' TEMPLATES')
  END as resultado
FROM templates_nutrition w
LEFT JOIN templates_nutrition n ON 
  LOWER(TRIM(w.name)) = LOWER(TRIM(n.name))
  AND w.type = n.type
  AND w.language = n.language
  AND n.profession = 'nutri'
WHERE w.profession = 'wellness'
  AND w.language = 'pt'
  AND n.id IS NULL;

-- ✅ Templates Nutri completados com sucesso!

