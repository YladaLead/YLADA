-- ============================================
-- VERIFICAÇÕES NO SUPABASE - NOEL Functions
-- ============================================
-- Execute estes SQLs no Supabase SQL Editor
-- ============================================

-- ============================================
-- 1. VERIFICAR FLUXOS DE REATIVAÇÃO
-- ============================================
-- Verifica se existe fluxo de reativação e quais códigos existem

SELECT 
  id,
  codigo,
  titulo,
  descricao,
  categoria,
  ativo,
  created_at
FROM wellness_fluxos
WHERE 
  ativo = true
  AND (
    codigo ILIKE '%reativ%' 
    OR codigo ILIKE '%retenc%'
    OR titulo ILIKE '%reativ%'
    OR titulo ILIKE '%retenc%'
  )
ORDER BY codigo;

-- ============================================
-- 2. VERIFICAR TODOS OS FLUXOS ATIVOS
-- ============================================
-- Lista todos os fluxos ativos para ver os códigos disponíveis

SELECT 
  codigo,
  titulo,
  categoria,
  ativo,
  created_at
FROM wellness_fluxos
WHERE ativo = true
ORDER BY codigo;

-- ============================================
-- 3. VERIFICAR CALCULADORA DE ÁGUA
-- ============================================
-- Verifica se existe template de calculadora de água

SELECT 
  id,
  slug,
  name,
  type,
  description,
  is_active,
  created_at
FROM templates_nutrition
WHERE 
  is_active = true
  AND (
    slug ILIKE '%agua%' 
    OR slug ILIKE '%hidrat%'
    OR slug ILIKE '%water%'
    OR name ILIKE '%água%'
    OR name ILIKE '%hidrat%'
  )
ORDER BY slug;

-- ============================================
-- 4. VERIFICAR TODOS OS TEMPLATES ATIVOS
-- ============================================
-- Lista todos os templates ativos para ver os slugs disponíveis

SELECT 
  slug,
  name,
  type,
  is_active,
  created_at
FROM templates_nutrition
WHERE is_active = true
ORDER BY slug;

-- ============================================
-- 5. VERIFICAR FLUXOS COM PASSOS E SCRIPTS
-- ============================================
-- Verifica se os fluxos têm passos e scripts configurados

SELECT 
  f.codigo,
  f.titulo,
  f.ativo,
  COUNT(DISTINCT p.id) as total_passos,
  COUNT(DISTINCT s.id) as total_scripts
FROM wellness_fluxos f
LEFT JOIN wellness_fluxos_passos p ON p.fluxo_id = f.id
LEFT JOIN wellness_fluxos_scripts s ON s.fluxo_id = f.id
WHERE f.ativo = true
GROUP BY f.id, f.codigo, f.titulo, f.ativo
ORDER BY f.codigo;

-- ============================================
-- 6. VERIFICAR FLUXO ESPECÍFICO: "reativacao"
-- ============================================
-- Verifica se existe fluxo com código exato "reativacao"

SELECT 
  id,
  codigo,
  titulo,
  descricao,
  categoria,
  ativo
FROM wellness_fluxos
WHERE codigo = 'reativacao';

-- ============================================
-- 7. VERIFICAR TEMPLATE ESPECÍFICO: "calculadora-agua"
-- ============================================
-- Verifica se existe template com slug exato "calculadora-agua"

SELECT 
  id,
  slug,
  name,
  type,
  description,
  is_active
FROM templates_nutrition
WHERE slug = 'calculadora-agua';

-- ============================================
-- 8. VERIFICAR OUTROS CÓDIGOS COMUNS DE FLUXOS
-- ============================================
-- Verifica se existem outros fluxos comuns mencionados nas functions

SELECT 
  codigo,
  titulo,
  ativo
FROM wellness_fluxos
WHERE codigo IN (
  'reativacao',
  'pos-venda',
  'convite-leve',
  '2-5-10',
  'fluxo-retencao-cliente',
  'reativacao-cliente'
)
ORDER BY codigo;

-- ============================================
-- 9. VERIFICAR OUTROS SLUGS COMUNS DE TEMPLATES
-- ============================================
-- Verifica se existem outros templates comuns mencionados nas functions

SELECT 
  slug,
  name,
  type,
  is_active
FROM templates_nutrition
WHERE slug IN (
  'calculadora-agua',
  'calculadora-proteina',
  'calc-hidratacao',
  'calc-agua',
  'calculadora-hidratacao'
)
ORDER BY slug;

-- ============================================
-- 10. RESUMO GERAL
-- ============================================
-- Resumo de quantos fluxos e templates existem

SELECT 
  'Fluxos Ativos' as tipo,
  COUNT(*) as total
FROM wellness_fluxos
WHERE ativo = true

UNION ALL

SELECT 
  'Templates Ativos' as tipo,
  COUNT(*) as total
FROM templates_nutrition
WHERE is_active = true;


















