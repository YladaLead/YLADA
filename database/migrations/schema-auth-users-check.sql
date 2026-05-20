-- =====================================================
-- SCRIPT DE VERIFICAÇÃO - Execute este PRIMEIRO
-- Para ver a estrutura atual das tabelas
-- =====================================================

-- Verificar se a tabela user_profiles existe e sua estrutura
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'user_profiles'
ORDER BY ordinal_position;

-- Verificar se existem dados na tabela
SELECT COUNT(*) as total_registros FROM user_profiles;

-- Verificar constraints existentes
SELECT 
    conname as constraint_name,
    contype as constraint_type
FROM pg_constraint
WHERE conrelid = 'user_profiles'::regclass;

-- Verificar índices existentes
SELECT 
    indexname,
    indexdef
FROM pg_indexes
WHERE tablename = 'user_profiles';

