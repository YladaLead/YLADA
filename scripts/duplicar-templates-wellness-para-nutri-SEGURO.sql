-- ============================================
-- DUPLICAR TEMPLATES WELLNESS → NUTRI (SEGURO)
-- Preserva diagnósticos já revisados da Nutri
-- ============================================

-- ⚠️ IMPORTANTE: 
-- 1. Este script APENAS duplica os registros no banco de dados
-- 2. Os diagnósticos estão no código TypeScript (diagnosticos-nutri.ts)
-- 3. Os diagnósticos já revisados da Nutri NÃO serão alterados
-- 4. Apenas cria templates faltantes na tabela templates_nutrition

-- ============================================
-- 1. VERIFICAR ESTADO ANTES
-- ============================================
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

-- ============================================
-- 2. LISTAR TEMPLATES QUE SERÃO DUPLICADOS
-- ============================================
SELECT 
  'TEMPLATES QUE SERÃO DUPLICADOS' as info,
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

-- ============================================
-- 3. DUPLICAR TEMPLATES (APENAS OS FALTANTES)
-- ============================================
-- ⚠️ ATENÇÃO: Este INSERT copia TUDO do template Wellness
-- Mas os diagnósticos são buscados do código TypeScript
-- então os diagnósticos revisados da Nutri serão preservados
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
  w.content,  -- ⚠️ Copia o content, mas diagnósticos vêm do código
  w.cta_text,
  w.whatsapp_message,
  w.is_active,
  w.slug,
  w.categoria,
  NOW() as created_at,
  NOW() as updated_at
FROM templates_nutrition w
WHERE w.profession = 'wellness'
  AND w.language = 'pt'
  AND NOT EXISTS (
    -- Evitar duplicatas: verificar se já existe template Nutri
    SELECT 1 FROM templates_nutrition n
    WHERE LOWER(TRIM(n.name)) = LOWER(TRIM(w.name))
      AND n.type = w.type
      AND n.language = w.language
      AND n.profession = 'nutri'
  );

-- ============================================
-- 4. VERIFICAR ESTADO DEPOIS
-- ============================================
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

-- ============================================
-- 5. VERIFICAR QUANTOS FORAM CRIADOS
-- ============================================
SELECT 
  COUNT(*) as templates_criados
FROM templates_nutrition
WHERE profession = 'nutri'
  AND language = 'pt'
  AND created_at >= NOW() - INTERVAL '1 minute';

-- ============================================
-- 6. VERIFICAR SE AINDA FALTAM TEMPLATES
-- ============================================
SELECT 
  CASE 
    WHEN COUNT(*) = 0 THEN '✅ TODOS OS TEMPLATES FORAM DUPLICADOS!'
    ELSE CONCAT('⚠️ AINDA FALTAM ', COUNT(*), ' TEMPLATES')
  END as resultado,
  COUNT(*) as faltando
FROM templates_nutrition w
LEFT JOIN templates_nutrition n ON 
  LOWER(TRIM(w.name)) = LOWER(TRIM(n.name))
  AND w.type = n.type
  AND w.language = n.language
  AND n.profession = 'nutri'
WHERE w.profession = 'wellness'
  AND w.language = 'pt'
  AND n.id IS NULL;

-- ============================================
-- ✅ IMPORTANTE: PRÓXIMOS PASSOS
-- ============================================
-- Após executar este script:
-- 1. Os templates estarão duplicados no banco
-- 2. Mas os diagnósticos precisam ser adicionados em:
--    src/lib/diagnosticos-nutri.ts
-- 3. Para templates que já existem em diagnosticos-nutri.ts:
--    ✅ Os diagnósticos já revisados serão preservados
-- 4. Para templates novos que não existem:
--    ⚠️ Precisam ser adicionados no arquivo diagnosticos-nutri.ts
--    (usando os diagnósticos de Wellness como base, mas adaptando para Nutri)

