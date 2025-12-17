-- ============================================
-- VERIFICAÇÃO COMPLETA: nutri1@ylada.com
-- ============================================

-- 1. VERIFICAR STATUS DO USUÁRIO E PERFIL
SELECT 
  u.email,
  up.perfil,
  up.diagnostico_completo,
  up.nome_completo,
  up.is_admin,
  up.is_support,
  up.created_at
FROM auth.users u
LEFT JOIN user_profiles up ON u.id = up.user_id
WHERE u.email = 'nutri1@ylada.com';

-- 2. VERIFICAR SE TEM DIAGNÓSTICO NO BANCO
SELECT 
  id,
  user_id,
  created_at,
  tipo_atuacao,
  tempo_atuacao
FROM nutri_diagnostico
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'nutri1@ylada.com');

-- 3. VERIFICAR SE TEM ASSINATURA
SELECT 
  id,
  user_id,
  plan_type,
  status,
  current_period_start,
  current_period_end
FROM subscriptions
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'nutri1@ylada.com');

-- 4. VERIFICAR PROGRESSO DA JORNADA
SELECT 
  id,
  user_id,
  current_day,
  completed_days,
  last_activity_at
FROM journey_progress
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'nutri1@ylada.com');

-- ============================================
-- RESETAR PARA ESTADO INICIAL (se necessário)
-- ============================================

-- ⚠️ DESCOMENTE AS LINHAS ABAIXO APENAS SE QUISER RESETAR O USUÁRIO

-- 4.1. Remover diagnóstico
-- DELETE FROM nutri_diagnostico
-- WHERE user_id = (SELECT id FROM auth.users WHERE email = 'nutri1@ylada.com');

-- 4.2. Atualizar perfil para sem diagnóstico
-- UPDATE user_profiles
-- SET 
--   diagnostico_completo = false,
--   nome_completo = 'Nutricionista Teste 1'
-- WHERE user_id = (SELECT id FROM auth.users WHERE email = 'nutri1@ylada.com');

-- 4.3. Remover progresso da jornada
-- DELETE FROM journey_progress
-- WHERE user_id = (SELECT id FROM auth.users WHERE email = 'nutri1@ylada.com');

-- 4.4. Remover assinatura (se houver)
-- DELETE FROM subscriptions
-- WHERE user_id = (SELECT id FROM auth.users WHERE email = 'nutri1@ylada.com');

-- 4.5. Verificar resultado após reset
-- SELECT 
--   email,
--   perfil,
--   diagnostico_completo,
--   nome_completo
-- FROM auth.users u
-- LEFT JOIN user_profiles up ON u.id = up.user_id
-- WHERE u.email = 'nutri1@ylada.com';
