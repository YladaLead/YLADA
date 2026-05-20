-- =====================================================
-- ATUALIZAR PERFIL DO RENAN PARA SUPORTE
-- =====================================================
-- Este script atualiza apenas o campo is_support = true
-- para o usuário Renan Lieiria
-- =====================================================

-- Atualizar perfil do Renan para is_support = true
UPDATE user_profiles up
SET 
  is_support = true,
  is_admin = false,
  nome_completo = COALESCE(NULLIF(up.nome_completo, ''), 'Renan Lieiria'),
  updated_at = NOW()
FROM auth.users au
WHERE up.user_id = au.id
  AND au.email = 'renan.mdlr@gmail.com';

-- Verificar se foi atualizado
SELECT 
  up.id,
  up.user_id,
  up.email,
  up.nome_completo,
  up.perfil,
  up.is_admin,
  up.is_support,
  au.email_confirmed_at IS NOT NULL as email_confirmado
FROM user_profiles up
LEFT JOIN auth.users au ON up.user_id = au.id
WHERE au.email = 'renan.mdlr@gmail.com'
   OR up.email = 'renan.mdlr@gmail.com';

-- Se não encontrou nenhum registro, o usuário não existe
-- Nesse caso, você precisa criar o usuário primeiro no Supabase Dashboard
-- ou usar a API Route: POST /api/admin/create-support-user

