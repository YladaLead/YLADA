-- ============================================
-- VERIFICAR CÓDIGOS ESPECÍFICOS QUE AS FUNCTIONS ESPERAM
-- ============================================
-- Execute estes SQLs para verificar se os códigos/slugs exatos existem
-- ============================================

-- ============================================
-- 1. VERIFICAR CÓDIGOS DE FLUXOS ESPECÍFICOS
-- ============================================
-- Verifica se existem os códigos que getFluxoInfo espera

SELECT 
  codigo,
  titulo,
  categoria,
  ativo,
  CASE 
    WHEN codigo = 'reativacao' THEN '✅ CÓDIGO CORRETO'
    WHEN codigo ILIKE '%reativ%' THEN '⚠️ CÓDIGO SIMILAR (pode precisar ajuste)'
    ELSE '❌ CÓDIGO DIFERENTE'
  END as status
FROM wellness_fluxos
WHERE 
  ativo = true
  AND (
    codigo = 'reativacao'
    OR codigo = 'pos-venda'
    OR codigo = 'convite-leve'
    OR codigo = '2-5-10'
    OR codigo ILIKE '%reativ%'
    OR codigo ILIKE '%retenc%'
  )
ORDER BY 
  CASE 
    WHEN codigo = 'reativacao' THEN 1
    WHEN codigo ILIKE '%reativ%' THEN 2
    ELSE 3
  END,
  codigo;

-- ============================================
-- 2. LISTAR TODOS OS CÓDIGOS DE FLUXOS DISPONÍVEIS
-- ============================================
-- Para ver todos os códigos que existem e comparar

SELECT 
  codigo,
  titulo,
  categoria
FROM wellness_fluxos
WHERE ativo = true
ORDER BY codigo;

-- ============================================
-- 3. VERIFICAR SLUGS DE TEMPLATES ESPECÍFICOS
-- ============================================
-- Verifica se existem os slugs que getFerramentaInfo espera

SELECT 
  slug,
  name,
  type,
  is_active,
  CASE 
    WHEN slug = 'calculadora-agua' THEN '✅ SLUG CORRETO'
    WHEN slug = 'calculadora-proteina' THEN '✅ SLUG CORRETO'
    WHEN slug = 'calc-hidratacao' THEN '✅ SLUG CORRETO'
    WHEN slug ILIKE '%agua%' THEN '⚠️ SLUG SIMILAR (pode precisar ajuste)'
    WHEN slug ILIKE '%hidrat%' THEN '⚠️ SLUG SIMILAR (pode precisar ajuste)'
    ELSE '❌ SLUG DIFERENTE'
  END as status
FROM templates_nutrition
WHERE 
  is_active = true
  AND (
    slug = 'calculadora-agua'
    OR slug = 'calculadora-proteina'
    OR slug = 'calc-hidratacao'
    OR slug ILIKE '%agua%'
    OR slug ILIKE '%hidrat%'
    OR slug ILIKE '%water%'
  )
ORDER BY 
  CASE 
    WHEN slug = 'calculadora-agua' THEN 1
    WHEN slug = 'calculadora-proteina' THEN 2
    WHEN slug = 'calc-hidratacao' THEN 3
    WHEN slug ILIKE '%agua%' THEN 4
    ELSE 5
  END,
  slug;

-- ============================================
-- 4. LISTAR TODOS OS SLUGS DE TEMPLATES DISPONÍVEIS
-- ============================================
-- Para ver todos os slugs que existem e comparar

SELECT 
  slug,
  name,
  type
FROM templates_nutrition
WHERE is_active = true
ORDER BY slug;

-- ============================================
-- 5. VERIFICAÇÃO ESPECÍFICA: "reativacao"
-- ============================================

SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM wellness_fluxos WHERE codigo = 'reativacao' AND ativo = true) 
    THEN '✅ EXISTE: Código "reativacao" encontrado'
    ELSE '❌ NÃO EXISTE: Código "reativacao" não encontrado'
  END as resultado_reativacao;

-- ============================================
-- 6. VERIFICAÇÃO ESPECÍFICA: "calculadora-agua"
-- ============================================

SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM templates_nutrition WHERE slug = 'calculadora-agua' AND is_active = true) 
    THEN '✅ EXISTE: Slug "calculadora-agua" encontrado'
    ELSE '❌ NÃO EXISTE: Slug "calculadora-agua" não encontrado'
  END as resultado_calculadora_agua;

-- ============================================
-- 7. RESUMO: O QUE EXISTE vs O QUE AS FUNCTIONS ESPERAM
-- ============================================

SELECT 
  'Códigos que getFluxoInfo espera' as tipo,
  'reativacao' as esperado,
  CASE WHEN EXISTS (SELECT 1 FROM wellness_fluxos WHERE codigo = 'reativacao' AND ativo = true) 
    THEN '✅ EXISTE' 
    ELSE '❌ NÃO EXISTE' 
  END as status
UNION ALL
SELECT 
  'Códigos que getFluxoInfo espera',
  'pos-venda',
  CASE WHEN EXISTS (SELECT 1 FROM wellness_fluxos WHERE codigo = 'pos-venda' AND ativo = true) 
    THEN '✅ EXISTE' 
    ELSE '❌ NÃO EXISTE' 
  END
UNION ALL
SELECT 
  'Códigos que getFluxoInfo espera',
  'convite-leve',
  CASE WHEN EXISTS (SELECT 1 FROM wellness_fluxos WHERE codigo = 'convite-leve' AND ativo = true) 
    THEN '✅ EXISTE' 
    ELSE '❌ NÃO EXISTE' 
  END
UNION ALL
SELECT 
  'Códigos que getFluxoInfo espera',
  '2-5-10',
  CASE WHEN EXISTS (SELECT 1 FROM wellness_fluxos WHERE codigo = '2-5-10' AND ativo = true) 
    THEN '✅ EXISTE' 
    ELSE '❌ NÃO EXISTE' 
  END
UNION ALL
SELECT 
  'Slugs que getFerramentaInfo espera',
  'calculadora-agua',
  CASE WHEN EXISTS (SELECT 1 FROM templates_nutrition WHERE slug = 'calculadora-agua' AND is_active = true) 
    THEN '✅ EXISTE' 
    ELSE '❌ NÃO EXISTE' 
  END
UNION ALL
SELECT 
  'Slugs que getFerramentaInfo espera',
  'calculadora-proteina',
  CASE WHEN EXISTS (SELECT 1 FROM templates_nutrition WHERE slug = 'calculadora-proteina' AND is_active = true) 
    THEN '✅ EXISTE' 
    ELSE '❌ NÃO EXISTE' 
  END
UNION ALL
SELECT 
  'Slugs que getFerramentaInfo espera',
  'calc-hidratacao',
  CASE WHEN EXISTS (SELECT 1 FROM templates_nutrition WHERE slug = 'calc-hidratacao' AND is_active = true) 
    THEN '✅ EXISTE' 
    ELSE '❌ NÃO EXISTE' 
  END;








