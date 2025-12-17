-- RESETAR nutri1@ylada.com PARA ESTADO INICIAL (SEM DIAGNÓSTICO)
-- Execute esta query no Supabase SQL Editor

-- 1. Remover diagnóstico
DELETE FROM nutri_diagnostico
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'nutri1@ylada.com');

-- 2. Atualizar perfil para sem diagnóstico
UPDATE user_profiles
SET 
  diagnostico_completo = false,
  nome_completo = 'Nutricionista Teste 1'
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'nutri1@ylada.com');

-- 3. Remover progresso da jornada
DELETE FROM journey_progress
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'nutri1@ylada.com');

-- 4. Verificar resultado
SELECT 
  u.email,
  up.perfil,
  up.diagnostico_completo,
  up.nome_completo
FROM auth.users u
LEFT JOIN user_profiles up ON u.id = up.user_id
WHERE u.email = 'nutri1@ylada.com';
