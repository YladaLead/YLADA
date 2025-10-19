-- =====================================================
-- YLADA - TESTE SIMPLES DO BANCO
-- Execute este script para verificar se tudo está funcionando
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

-- 4. Verificar estrutura da tabela users
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;

-- 5. Verificar estrutura da tabela user_profiles
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
ORDER BY ordinal_position;

-- 6. Verificar estrutura da tabela templates_base
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'templates_base' 
ORDER BY ordinal_position;

-- 7. Verificar se os templates iniciais foram inseridos
SELECT 
  name,
  type,
  profession,
  specialization,
  objective
FROM templates_base
ORDER BY created_at;

-- 8. Testar inserção de dados (simulação)
-- NOTA: Este teste não insere dados reais, apenas verifica a estrutura

-- Verificar se conseguimos fazer SELECT nas tabelas principais
SELECT COUNT(*) as total_users FROM users;
SELECT COUNT(*) as total_profiles FROM user_profiles;
SELECT COUNT(*) as total_templates FROM templates_base;
SELECT COUNT(*) as total_tools FROM generated_tools;
SELECT COUNT(*) as total_leads FROM leads;

-- =====================================================
-- TESTE CONCLUÍDO!
-- =====================================================
