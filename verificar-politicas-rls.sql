-- =====================================================
-- VERIFICAR POLÍTICAS RLS DE user_profiles
-- Execute este script para verificar se tudo está correto
-- =====================================================

-- 1. Verificar se a função is_admin() existe
SELECT 
  proname as function_name,
  'Função existe!' as status
FROM pg_proc
WHERE proname = 'is_admin'
  AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public');

-- 2. Verificar todas as políticas criadas
SELECT 
  policyname,
  cmd,
  CASE 
    WHEN qual IS NOT NULL THEN substring(qual, 1, 200)
    ELSE 'Sem USING'
  END as using_clause,
  CASE 
    WHEN with_check IS NOT NULL THEN substring(with_check, 1, 200)
    ELSE 'Sem WITH CHECK'
  END as with_check_clause
FROM pg_policies
WHERE tablename = 'user_profiles'
ORDER BY cmd, policyname;

-- 3. Verificar se RLS está habilitado
SELECT 
  tablename,
  rowsecurity as rls_enabled,
  'RLS está habilitado!' as status
FROM pg_tables
WHERE schemaname = 'public'
AND tablename = 'user_profiles';

-- 4. Contar quantas políticas existem (deve ter 6: 3 para usuários + 3 para admins)
SELECT 
  COUNT(*) as total_policies,
  COUNT(CASE WHEN cmd = 'SELECT' THEN 1 END) as select_policies,
  COUNT(CASE WHEN cmd = 'UPDATE' THEN 1 END) as update_policies,
  COUNT(CASE WHEN cmd = 'INSERT' THEN 1 END) as insert_policies
FROM pg_policies
WHERE tablename = 'user_profiles';

