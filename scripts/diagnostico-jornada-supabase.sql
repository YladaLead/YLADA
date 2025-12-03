-- =====================================================
-- DIAGNÓSTICO COMPLETO DA JORNADA NO SUPABASE
-- =====================================================
-- Execute cada query abaixo no Supabase SQL Editor
-- e me envie os resultados

-- 1. VERIFICAR SE A TABELA EXISTE
SELECT 
  EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'journey_days'
  ) AS tabela_existe;

-- 2. CONTAR REGISTROS
SELECT COUNT(*) AS total_dias FROM journey_days;

-- 3. VER PRIMEIROS 10 DIAS
SELECT 
  day_number,
  week_number,
  title,
  order_index,
  created_at,
  updated_at
FROM journey_days
ORDER BY day_number
LIMIT 10;

-- 4. VERIFICAR DISTRIBUIÇÃO POR SEMANA
SELECT 
  week_number,
  COUNT(*) AS total_dias,
  MIN(day_number) AS primeiro_dia,
  MAX(day_number) AS ultimo_dia
FROM journey_days
GROUP BY week_number
ORDER BY week_number;

-- 5. VERIFICAR ESTRUTURA DA TABELA
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'journey_days'
ORDER BY ordinal_position;

-- 6. VERIFICAR POLÍTICAS RLS (Row Level Security)
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'journey_days';

-- 7. VERIFICAR SE RLS ESTÁ ATIVO
SELECT 
  tablename,
  rowsecurity AS rls_ativo
FROM pg_tables
WHERE tablename = 'journey_days';

-- 8. VER ÚLTIMOS REGISTROS INSERIDOS/ATUALIZADOS
SELECT 
  day_number,
  title,
  created_at,
  updated_at
FROM journey_days
ORDER BY updated_at DESC
LIMIT 5;

-- 9. VERIFICAR SE HÁ DADOS NA TABELA journey_progress
SELECT COUNT(*) AS total_progressos FROM journey_progress;

-- 10. VERIFICAR SE HÁ ÍNDICES NA TABELA
SELECT 
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename = 'journey_days';

