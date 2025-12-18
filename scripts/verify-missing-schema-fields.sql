-- ==========================================
-- SCRIPT DE VERIFICAÇÃO: Campos do Schema
-- ==========================================
-- Data: 2025-12-18
-- Projeto: YLADA - Área Nutri
-- Objetivo: Verificar se todos os campos foram adicionados corretamente
--
-- Execute este script APÓS executar a migration:
-- migrations/add-missing-schema-fields.sql
-- ==========================================

-- ==========================================
-- 1. VERIFICAR CAMPOS DA TABELA CLIENTS
-- ==========================================

SELECT 
  '🔍 TABELA: clients' AS verificacao,
  '' AS campo,
  '' AS tipo,
  '' AS existe
UNION ALL
SELECT 
  '' AS verificacao,
  column_name AS campo,
  data_type || CASE 
    WHEN character_maximum_length IS NOT NULL 
    THEN '(' || character_maximum_length || ')' 
    ELSE '' 
  END AS tipo,
  '✅' AS existe
FROM information_schema.columns 
WHERE table_name = 'clients' 
  AND column_name IN ('goal', 'instagram', 'phone_country_code')
ORDER BY verificacao DESC, campo;

-- ==========================================
-- 2. VERIFICAR CAMPOS DA TABELA EMOTIONAL_BEHAVIORAL_HISTORY
-- ==========================================

SELECT 
  '🔍 TABELA: emotional_behavioral_history' AS verificacao,
  '' AS campo,
  '' AS tipo,
  '' AS existe
UNION ALL
SELECT 
  '' AS verificacao,
  column_name AS campo,
  data_type || CASE 
    WHEN character_maximum_length IS NOT NULL 
    THEN '(' || character_maximum_length || ')' 
    ELSE '' 
  END AS tipo,
  '✅' AS existe
FROM information_schema.columns 
WHERE table_name = 'emotional_behavioral_history' 
  AND column_name IN ('story', 'moment_of_change', 'commitment')
ORDER BY verificacao DESC, campo;

-- ==========================================
-- 3. VERIFICAR CAMPOS DA TABELA PROGRAMS
-- ==========================================

SELECT 
  '🔍 TABELA: programs' AS verificacao,
  '' AS campo,
  '' AS tipo,
  '' AS existe
UNION ALL
SELECT 
  '' AS verificacao,
  column_name AS campo,
  data_type || CASE 
    WHEN character_maximum_length IS NOT NULL 
    THEN '(' || character_maximum_length || ')' 
    ELSE '' 
  END AS tipo,
  '✅' AS existe
FROM information_schema.columns 
WHERE table_name = 'programs' 
  AND column_name IN ('stage', 'weekly_goal')
ORDER BY verificacao DESC, campo;

-- ==========================================
-- 4. VERIFICAR ÍNDICES CRIADOS
-- ==========================================

SELECT 
  '🔍 ÍNDICES CRIADOS' AS verificacao,
  '' AS indice,
  '' AS tabela,
  '' AS coluna
UNION ALL
SELECT 
  '' AS verificacao,
  indexname AS indice,
  tablename AS tabela,
  REGEXP_REPLACE(indexdef, '.*\((.*)\).*', '\1') AS coluna
FROM pg_indexes
WHERE tablename IN ('clients', 'programs')
  AND indexname IN (
    'idx_clients_instagram',
    'idx_clients_goal',
    'idx_programs_stage'
  )
ORDER BY verificacao DESC, tabela, indice;

-- ==========================================
-- 5. VERIFICAR CONSTRAINTS
-- ==========================================

SELECT 
  '🔍 CONSTRAINTS' AS verificacao,
  '' AS constraint_name,
  '' AS tabela,
  '' AS tipo
UNION ALL
SELECT 
  '' AS verificacao,
  constraint_name AS constraint_name,
  table_name AS tabela,
  constraint_type AS tipo
FROM information_schema.table_constraints
WHERE table_name = 'emotional_behavioral_history'
  AND constraint_name LIKE '%commitment%'
ORDER BY verificacao DESC, tabela, constraint_name;

-- ==========================================
-- 6. VERIFICAR COMENTÁRIOS DAS COLUNAS
-- ==========================================

SELECT 
  '🔍 COMENTÁRIOS NAS COLUNAS' AS verificacao,
  '' AS tabela,
  '' AS coluna,
  '' AS descricao
UNION ALL
SELECT 
  '' AS verificacao,
  c.table_name AS tabela,
  c.column_name AS coluna,
  COALESCE(pgd.description, '⚠️ Sem descrição') AS descricao
FROM information_schema.columns c
LEFT JOIN pg_catalog.pg_statio_all_tables st 
  ON c.table_name = st.relname
LEFT JOIN pg_catalog.pg_description pgd 
  ON pgd.objoid = st.relid 
  AND pgd.objsubid = c.ordinal_position
WHERE c.table_name IN ('clients', 'emotional_behavioral_history', 'programs')
  AND c.column_name IN (
    'goal', 'instagram', 'phone_country_code',
    'story', 'moment_of_change', 'commitment',
    'stage', 'weekly_goal'
  )
ORDER BY verificacao DESC, tabela, coluna;

-- ==========================================
-- 7. RESUMO GERAL
-- ==========================================

DO $$ 
DECLARE
  total_campos_esperados INTEGER := 8;
  total_campos_encontrados INTEGER;
  total_indices_esperados INTEGER := 3;
  total_indices_encontrados INTEGER;
  percentual_conclusao DECIMAL(5,2);
BEGIN
  -- Contar campos encontrados
  SELECT COUNT(*) INTO total_campos_encontrados
  FROM information_schema.columns 
  WHERE (table_name = 'clients' AND column_name IN ('goal', 'instagram', 'phone_country_code'))
     OR (table_name = 'emotional_behavioral_history' AND column_name IN ('story', 'moment_of_change', 'commitment'))
     OR (table_name = 'programs' AND column_name IN ('stage', 'weekly_goal'));

  -- Contar índices encontrados
  SELECT COUNT(*) INTO total_indices_encontrados
  FROM pg_indexes
  WHERE tablename IN ('clients', 'programs')
    AND indexname IN ('idx_clients_instagram', 'idx_clients_goal', 'idx_programs_stage');

  -- Calcular percentual
  percentual_conclusao := ((total_campos_encontrados::DECIMAL + total_indices_encontrados::DECIMAL) / 
                           (total_campos_esperados::DECIMAL + total_indices_esperados::DECIMAL)) * 100;

  -- Exibir resumo
  RAISE NOTICE '========================================';
  RAISE NOTICE '📊 RESUMO DA VERIFICAÇÃO';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Campos esperados: %', total_campos_esperados;
  RAISE NOTICE 'Campos encontrados: %', total_campos_encontrados;
  RAISE NOTICE 'Índices esperados: %', total_indices_esperados;
  RAISE NOTICE 'Índices encontrados: %', total_indices_encontrados;
  RAISE NOTICE '----------------------------------------';
  RAISE NOTICE 'Percentual de conclusão: %%%', percentual_conclusao;
  RAISE NOTICE '========================================';

  IF percentual_conclusao = 100 THEN
    RAISE NOTICE '✅ PERFEITO! Schema está 100%% completo!';
    RAISE NOTICE 'Todos os campos e índices foram criados com sucesso.';
  ELSIF percentual_conclusao >= 80 THEN
    RAISE WARNING '⚠️ ATENÇÃO: Schema quase completo (%%)', percentual_conclusao;
    RAISE WARNING 'Alguns campos ou índices podem estar faltando.';
  ELSE
    RAISE WARNING '❌ ERRO: Migration não foi aplicada corretamente!';
    RAISE WARNING 'Execute novamente: migrations/add-missing-schema-fields.sql';
  END IF;
END $$;

-- ==========================================
-- 8. LISTAR TODOS OS CAMPOS DAS TABELAS
-- (Para referência completa)
-- ==========================================

-- Descomente abaixo se quiser ver TODOS os campos de cada tabela:

/*
-- CLIENTS - Todos os campos
SELECT 
  ordinal_position,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'clients'
ORDER BY ordinal_position;

-- EMOTIONAL_BEHAVIORAL_HISTORY - Todos os campos
SELECT 
  ordinal_position,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'emotional_behavioral_history'
ORDER BY ordinal_position;

-- PROGRAMS - Todos os campos
SELECT 
  ordinal_position,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'programs'
ORDER BY ordinal_position;
*/

-- ==========================================
-- FIM DO SCRIPT DE VERIFICAÇÃO
-- ==========================================
