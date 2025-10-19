-- =====================================================
-- YLADA - TESTE SIMPLES DO BANCO
-- Execute este script para testar se tudo está funcionando
-- =====================================================

-- 1. Verificar se as tabelas existem
SELECT 
  tablename,
  tableowner
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;

-- 2. Verificar se os índices foram criados
SELECT 
  indexname,
  tablename
FROM pg_indexes 
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- 3. Verificar se as políticas RLS estão ativas
SELECT 
  tablename,
  policyname,
  cmd
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- 4. Testar inserção de dados (simulação)
-- NOTA: Este teste não insere dados reais, apenas verifica a estrutura

-- Verificar estrutura da tabela users
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;

-- Verificar estrutura da tabela user_profiles
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
ORDER BY ordinal_position;

-- Verificar estrutura da tabela templates_base
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'templates_base' 
ORDER BY ordinal_position;

-- 5. Verificar se os templates iniciais foram inseridos
SELECT 
  name,
  type,
  profession,
  specialization,
  objective
FROM templates_base
ORDER BY created_at;

-- =====================================================
-- TESTE CONCLUÍDO!
-- =====================================================
