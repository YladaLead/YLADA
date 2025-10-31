-- =====================================================
-- SCRIPT DE TESTE E VALIDAÇÃO - YLADA
-- Use este script para validar que o sistema está funcionando
-- =====================================================

-- =====================================================
-- 1. VERIFICAR ESTRUTURA E POLÍTICAS RLS
-- =====================================================

-- Verificar se tabelas existem e se RLS está ativo
SELECT 
  t.table_name,
  CASE 
    WHEN pt.rowsecurity = true THEN '✅ RLS Ativo' 
    ELSE '❌ RLS Inativo' 
  END as rls_status
FROM information_schema.tables t
LEFT JOIN pg_tables pt ON pt.tablename = t.table_name AND pt.schemaname = 'public'
WHERE t.table_schema = 'public' 
  AND t.table_type = 'BASE TABLE'
  AND t.table_name IN ('user_profiles', 'user_templates', 'leads', 'generated_links')
ORDER BY t.table_name;

-- Verificar políticas RLS criadas
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename IN ('user_profiles', 'user_templates', 'leads', 'generated_links')
ORDER BY tablename, policyname;

-- =====================================================
-- 2. VERIFICAR USUÁRIOS E PERFIS EXISTENTES
-- =====================================================

-- Listar todos os perfis
SELECT 
  up.id,
  up.user_id,
  au.email,
  up.perfil,
  up.nome_completo,
  up.is_admin,
  up.created_at,
  up.last_login
FROM user_profiles up
LEFT JOIN auth.users au ON au.id = up.user_id
ORDER BY up.created_at DESC;

-- Verificar se há admins
SELECT 
  COUNT(*) as total_admins,
  COUNT(*) FILTER (WHERE is_admin = true) as admins_ativos
FROM user_profiles;

-- =====================================================
-- 3. VERIFICAR ISOLAMENTO DE DADOS (RLS)
-- =====================================================

-- Como administrador, você pode ver todos os dados
-- Mas usuários comuns só veem seus próprios dados

-- Contar registros por usuário (visualização admin)
SELECT 
  up.email,
  up.perfil,
  COUNT(DISTINCT ut.id) as total_templates,
  COUNT(DISTINCT l.id) as total_leads
FROM user_profiles up
LEFT JOIN user_templates ut ON ut.user_id = up.user_id
LEFT JOIN leads l ON l.user_id = up.user_id
GROUP BY up.id, up.email, up.perfil
ORDER BY total_templates DESC, total_leads DESC;

-- =====================================================
-- 4. CRIAR USUÁRIO ADMIN DE TESTE (OPCIONAL)
-- =====================================================

-- NOTA: Este usuário deve ser criado via Supabase Auth primeiro
-- Depois, atualize o perfil para admin:

-- Primeiro, crie o usuário no Supabase Dashboard > Authentication
-- Depois execute:
/*
UPDATE user_profiles 
SET is_admin = true, perfil = 'admin'
WHERE email = 'admin@ylada.com';
*/

-- =====================================================
-- 5. VERIFICAR FUNÇÃO is_admin()
-- =====================================================

-- Testar função helper
SELECT is_admin();

-- Se retornar erro, criar a função:
/*
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_id = auth.uid()
    AND is_admin = true
  );
END;
$$;
*/

-- =====================================================
-- 6. VALIDAÇÕES FINAIS
-- =====================================================

-- Verificar constraints
SELECT 
  conname as constraint_name,
  contype as constraint_type,
  pg_get_constraintdef(oid) as definition
FROM pg_constraint
WHERE conrelid = 'user_profiles'::regclass
  AND contype IN ('c', 'f', 'u');

-- Verificar índices
SELECT 
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename IN ('user_profiles', 'user_templates', 'leads')
ORDER BY tablename, indexname;

-- =====================================================
-- 7. ESTATÍSTICAS DO SISTEMA
-- =====================================================

SELECT 
  'user_profiles' as tabela,
  COUNT(*) as total_registros,
  COUNT(DISTINCT perfil) as perfis_diferentes,
  COUNT(DISTINCT CASE WHEN is_admin = true THEN user_id END) as total_admins
FROM user_profiles

UNION ALL

SELECT 
  'user_templates' as tabela,
  COUNT(*) as total_registros,
  COUNT(DISTINCT user_id) as usuarios_diferentes,
  COUNT(DISTINCT CASE WHEN status = 'active' THEN id END) as templates_ativos
FROM user_templates

UNION ALL

SELECT 
  'leads' as tabela,
  COUNT(*) as total_registros,
  COUNT(DISTINCT user_id) as usuarios_diferentes,
  COUNT(DISTINCT CASE WHEN created_at > NOW() - INTERVAL '7 days' THEN id END) as leads_semana
FROM leads;

-- =====================================================
-- PRÓXIMOS PASSOS
-- =====================================================

/*
1. ✅ Verificar se todas as políticas RLS estão ativas
2. ✅ Testar login em cada perfil
3. ✅ Verificar isolamento de dados
4. ✅ Testar APIs protegidas
5. ✅ Validar coleta de leads

Consulte TESTES-SEGURANCA.md para guia completo de testes.
*/

