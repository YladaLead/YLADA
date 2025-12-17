-- VERIFICAR STATUS DO nutri1@ylada.com
-- Execute esta query no Supabase SQL Editor

SELECT 
  u.email,
  up.perfil,
  up.diagnostico_completo,
  up.nome_completo,
  up.is_admin,
  up.is_support
FROM auth.users u
LEFT JOIN user_profiles up ON u.id = up.user_id
WHERE u.email = 'nutri1@ylada.com';
