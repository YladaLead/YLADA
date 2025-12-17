-- ============================================
-- VERIFICAR E RESETAR nutri1@ylada.com
-- ============================================

-- 1. VERIFICAR STATUS ATUAL
SELECT 
  email,
  perfil,
  diagnostico_completo,
  nome_completo,
  created_at
FROM user_profiles
WHERE email = 'nutri1@ylada.com';

-- 2. VERIFICAR SE TEM DIAGNÓSTICO NO BANCO
SELECT 
  id,
  user_id,
  created_at,
  tipo_atuacao,
  tempo_atuacao
FROM nutri_diagnostico
WHERE user_id = (SELECT user_id FROM user_profiles WHERE email = 'nutri1@ylada.com');

-- 3. RESETAR PARA ESTADO INICIAL (SEM DIAGNÓSTICO)
-- Execute apenas se quiser resetar o usuário

-- 3.1. Remover diagnóstico
DELETE FROM nutri_diagnostico
WHERE user_id = (SELECT user_id FROM user_profiles WHERE email = 'nutri1@ylada.com');

-- 3.2. Atualizar perfil para sem diagnóstico
UPDATE user_profiles
SET 
  diagnostico_completo = false,
  nome_completo = 'Nutricionista Teste 1'
WHERE email = 'nutri1@ylada.com';

-- 3.3. Remover progresso da jornada (opcional)
DELETE FROM journey_progress
WHERE user_id = (SELECT user_id FROM user_profiles WHERE email = 'nutri1@ylada.com');

-- 3.4. Verificar resultado
SELECT 
  email,
  perfil,
  diagnostico_completo,
  nome_completo
FROM user_profiles
WHERE email = 'nutri1@ylada.com';
