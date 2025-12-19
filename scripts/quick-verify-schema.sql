-- ==========================================
-- VERIFICAÇÃO RÁPIDA (Ultra-Simples)
-- ==========================================
-- Use este se os outros scripts derem erro
-- Funciona em QUALQUER versão do PostgreSQL
-- ==========================================

-- Contar campos em clients
SELECT 
  'clients' AS tabela,
  COUNT(*) AS campos_encontrados,
  3 AS campos_esperados,
  CASE 
    WHEN COUNT(*) = 3 THEN '✅ OK' 
    ELSE '❌ FALTANDO' 
  END AS status
FROM information_schema.columns 
WHERE table_name = 'clients' 
  AND column_name IN ('goal', 'instagram', 'phone_country_code');

-- Contar campos em emotional_behavioral_history
SELECT 
  'emotional_behavioral_history' AS tabela,
  COUNT(*) AS campos_encontrados,
  3 AS campos_esperados,
  CASE 
    WHEN COUNT(*) = 3 THEN '✅ OK' 
    ELSE '❌ FALTANDO' 
  END AS status
FROM information_schema.columns 
WHERE table_name = 'emotional_behavioral_history' 
  AND column_name IN ('story', 'moment_of_change', 'commitment');

-- Contar campos em programs
SELECT 
  'programs' AS tabela,
  COUNT(*) AS campos_encontrados,
  2 AS campos_esperados,
  CASE 
    WHEN COUNT(*) = 2 THEN '✅ OK' 
    ELSE '❌ FALTANDO' 
  END AS status
FROM information_schema.columns 
WHERE table_name = 'programs' 
  AND column_name IN ('stage', 'weekly_goal');

-- Contar índices
SELECT 
  'indices' AS item,
  COUNT(*) AS encontrados,
  3 AS esperados,
  CASE 
    WHEN COUNT(*) = 3 THEN '✅ OK' 
    ELSE '⚠️ VERIFICAR' 
  END AS status
FROM pg_indexes
WHERE tablename IN ('clients', 'programs')
  AND indexname IN ('idx_clients_instagram', 'idx_clients_goal', 'idx_programs_stage');

-- ==========================================
-- SE TODOS OS STATUS ESTIVEREM "✅ OK"
-- A MIGRATION FOI EXECUTADA COM SUCESSO!
-- ==========================================

