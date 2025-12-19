-- ==========================================
-- VERIFICAÇÃO SIMPLES: Campos do Schema
-- ==========================================
-- Versão simplificada sem UNION ALL complexos
-- Execute após: migrations/add-missing-schema-fields.sql
-- ==========================================

-- ==========================================
-- 1. CAMPOS DA TABELA CLIENTS
-- ==========================================
\echo '\n🔍 TABELA: clients\n'

SELECT 
  column_name AS campo,
  data_type AS tipo,
  CASE 
    WHEN character_maximum_length IS NOT NULL 
    THEN '(' || character_maximum_length || ')' 
    ELSE '' 
  END AS tamanho,
  CASE 
    WHEN column_default IS NOT NULL 
    THEN column_default 
    ELSE '-' 
  END AS padrao
FROM information_schema.columns 
WHERE table_name = 'clients' 
  AND column_name IN ('goal', 'instagram', 'phone_country_code')
ORDER BY column_name;

-- ==========================================
-- 2. CAMPOS DA TABELA EMOTIONAL_BEHAVIORAL_HISTORY
-- ==========================================
\echo '\n🔍 TABELA: emotional_behavioral_history\n'

SELECT 
  column_name AS campo,
  data_type AS tipo,
  CASE 
    WHEN character_maximum_length IS NOT NULL 
    THEN '(' || character_maximum_length || ')' 
    ELSE '' 
  END AS tamanho
FROM information_schema.columns 
WHERE table_name = 'emotional_behavioral_history' 
  AND column_name IN ('story', 'moment_of_change', 'commitment')
ORDER BY column_name;

-- ==========================================
-- 3. CAMPOS DA TABELA PROGRAMS
-- ==========================================
\echo '\n🔍 TABELA: programs\n'

SELECT 
  column_name AS campo,
  data_type AS tipo,
  CASE 
    WHEN character_maximum_length IS NOT NULL 
    THEN '(' || character_maximum_length || ')' 
    ELSE '' 
  END AS tamanho
FROM information_schema.columns 
WHERE table_name = 'programs' 
  AND column_name IN ('stage', 'weekly_goal')
ORDER BY column_name;

-- ==========================================
-- 4. ÍNDICES CRIADOS
-- ==========================================
\echo '\n🔍 ÍNDICES\n'

SELECT 
  indexname AS indice,
  tablename AS tabela
FROM pg_indexes
WHERE tablename IN ('clients', 'programs')
  AND indexname IN (
    'idx_clients_instagram',
    'idx_clients_goal',
    'idx_programs_stage'
  )
ORDER BY tablename, indexname;

-- ==========================================
-- 5. CONSTRAINTS
-- ==========================================
\echo '\n🔍 CONSTRAINTS\n'

SELECT 
  constraint_name AS constraint,
  table_name AS tabela,
  constraint_type AS tipo
FROM information_schema.table_constraints
WHERE table_name = 'emotional_behavioral_history'
  AND constraint_name LIKE '%commitment%'
ORDER BY constraint_name;

-- ==========================================
-- 6. RESUMO FINAL
-- ==========================================
\echo '\n📊 RESUMO\n'

DO $$ 
DECLARE
  total_campos_esperados INTEGER := 8;
  total_campos_encontrados INTEGER;
  total_indices_esperados INTEGER := 3;
  total_indices_encontrados INTEGER;
  percentual_conclusao DECIMAL(5,2);
  campos_faltantes TEXT[] := ARRAY[]::TEXT[];
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

  -- Verificar campos faltantes
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'goal') THEN
    campos_faltantes := array_append(campos_faltantes, 'clients.goal');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'instagram') THEN
    campos_faltantes := array_append(campos_faltantes, 'clients.instagram');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'phone_country_code') THEN
    campos_faltantes := array_append(campos_faltantes, 'clients.phone_country_code');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'emotional_behavioral_history' AND column_name = 'story') THEN
    campos_faltantes := array_append(campos_faltantes, 'emotional_behavioral_history.story');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'emotional_behavioral_history' AND column_name = 'moment_of_change') THEN
    campos_faltantes := array_append(campos_faltantes, 'emotional_behavioral_history.moment_of_change');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'emotional_behavioral_history' AND column_name = 'commitment') THEN
    campos_faltantes := array_append(campos_faltantes, 'emotional_behavioral_history.commitment');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'programs' AND column_name = 'stage') THEN
    campos_faltantes := array_append(campos_faltantes, 'programs.stage');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'programs' AND column_name = 'weekly_goal') THEN
    campos_faltantes := array_append(campos_faltantes, 'programs.weekly_goal');
  END IF;

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
  
  IF array_length(campos_faltantes, 1) > 0 THEN
    RAISE NOTICE 'Campos faltantes: %', array_to_string(campos_faltantes, ', ');
  END IF;
  
  RAISE NOTICE 'Percentual de conclusão: %%%', ROUND(percentual_conclusao, 2);
  RAISE NOTICE '========================================';

  IF percentual_conclusao = 100 THEN
    RAISE NOTICE '✅ PERFEITO! Schema está 100%% completo!';
  ELSIF percentual_conclusao >= 80 THEN
    RAISE WARNING '⚠️ ATENÇÃO: Schema quase completo (%%)', ROUND(percentual_conclusao, 2);
  ELSE
    RAISE WARNING '❌ ERRO: Migration não foi aplicada corretamente!';
  END IF;
END $$;

-- ==========================================
-- FIM DA VERIFICAÇÃO
-- ==========================================


