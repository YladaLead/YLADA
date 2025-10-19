-- =====================================================
-- YLADA - QUICK SETUP SCRIPT
-- Execute este script no Supabase SQL Editor
-- =====================================================

-- 1. Criar estrutura básica
\i schema-complete.sql

-- 2. Verificar se tudo foi criado
SELECT 
  schemaname,
  tablename,
  tableowner
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;

-- 3. Verificar índices
SELECT 
  indexname,
  tablename,
  indexdef
FROM pg_indexes 
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- 4. Verificar políticas RLS
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- 5. Testar inserção de dados
INSERT INTO users (email, name) VALUES ('teste@ylada.com', 'Usuário Teste');
INSERT INTO user_profiles (user_id, profession, specialization, target_audience, main_objective) 
SELECT id, 'nutricionista', 'emagrecimento', 'mulheres 25-45', 'capturar-leads' 
FROM users WHERE email = 'teste@ylada.com';

-- 6. Verificar dados inseridos
SELECT u.email, up.profession, up.specialization 
FROM users u 
JOIN user_profiles up ON u.id = up.user_id 
WHERE u.email = 'teste@ylada.com';

-- 7. Limpar dados de teste
DELETE FROM user_profiles WHERE user_id IN (SELECT id FROM users WHERE email = 'teste@ylada.com');
DELETE FROM users WHERE email = 'teste@ylada.com';

-- =====================================================
-- SETUP COMPLETO!
-- =====================================================
