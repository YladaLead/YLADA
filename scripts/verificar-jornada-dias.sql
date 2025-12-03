-- Script para verificar se os dados da jornada existem no banco
-- Execute este script no Supabase SQL Editor

-- 1. Verificar se a tabela existe
SELECT 
  EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'journey_days'
  ) AS tabela_existe;

-- 2. Contar quantos registros existem
SELECT COUNT(*) AS total_dias FROM journey_days;

-- 3. Ver os primeiros 5 dias
SELECT 
  day_number,
  week_number,
  title,
  order_index
FROM journey_days
ORDER BY day_number
LIMIT 5;

-- 4. Verificar se há dados em todas as semanas
SELECT 
  week_number,
  COUNT(*) AS total_dias
FROM journey_days
GROUP BY week_number
ORDER BY week_number;

-- 5. Verificar estrutura da tabela
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'journey_days'
ORDER BY ordinal_position;

