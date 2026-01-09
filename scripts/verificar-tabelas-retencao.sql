-- =====================================================
-- VERIFICAR ESTRUTURA DAS TABELAS DE RETENÇÃO
-- Execute este script para verificar se está tudo OK
-- =====================================================

-- 1. Verificar estrutura de cancel_attempts
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'cancel_attempts'
ORDER BY ordinal_position;

-- 2. Verificar estrutura de trial_extensions
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'trial_extensions'
ORDER BY ordinal_position;

-- 3. Verificar se campos foram adicionados em subscriptions
SELECT 
  column_name,
  data_type
FROM information_schema.columns
WHERE table_name = 'subscriptions'
  AND column_name IN ('retention_offered_at', 'retention_attempts_count');

-- 4. Verificar RLS (Row Level Security)
SELECT 
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename IN ('cancel_attempts', 'trial_extensions');

-- 5. Verificar índices
SELECT 
  tablename,
  indexname
FROM pg_indexes
WHERE tablename IN ('cancel_attempts', 'trial_extensions')
ORDER BY tablename, indexname;

-- 6. Verificar view de analytics (se existe)
SELECT 
  table_name,
  table_type
FROM information_schema.tables
WHERE table_name = 'cancel_analytics';

-- 7. Teste: Verificar se consegue inserir (não vai inserir de verdade)
-- Descomente para testar
-- INSERT INTO cancel_attempts (user_id, subscription_id, cancel_reason, final_action)
-- VALUES ('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000000', 'no_time', 'pending')
-- ON CONFLICT DO NOTHING;

