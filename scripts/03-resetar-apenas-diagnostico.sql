-- RESETAR APENAS diagnostico_completo para false
-- Execute esta query no Supabase SQL Editor
-- (Versão rápida - apenas atualiza o flag, não remove dados)

UPDATE user_profiles
SET diagnostico_completo = false
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'nutri1@ylada.com');

-- Verificar resultado
SELECT 
  u.email,
  up.perfil,
  up.diagnostico_completo,
  up.nome_completo
FROM auth.users u
LEFT JOIN user_profiles up ON u.id = up.user_id
WHERE u.email = 'nutri1@ylada.com';
