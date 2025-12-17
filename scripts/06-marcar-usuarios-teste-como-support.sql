-- Script para marcar usuários de teste como SUPPORT (bypass automático de assinatura)
-- Execute este script no Supabase SQL Editor
-- Esta é uma alternativa MAIS LIMPA que criar assinaturas falsas

-- Marcar nutri1, nutri2 e nutri3 como suporte
UPDATE user_profiles
SET is_support = true
WHERE user_id IN (
  SELECT id FROM auth.users 
  WHERE email IN ('nutri1@ylada.com', 'nutri2@ylada.com', 'nutri3@ylada.com')
);

-- Verificar resultado
SELECT 
  u.email,
  up.nome_completo,
  up.is_admin,
  up.is_support,
  CASE 
    WHEN up.is_support = true THEN '✅ Bypass de assinatura ativo'
    WHEN up.is_admin = true THEN '✅ Bypass de assinatura ativo (admin)'
    ELSE '❌ Sem bypass'
  END as status_bypass
FROM auth.users u
LEFT JOIN user_profiles up ON u.id = up.user_id
WHERE u.email IN ('nutri1@ylada.com', 'nutri2@ylada.com', 'nutri3@ylada.com')
ORDER BY u.email;
