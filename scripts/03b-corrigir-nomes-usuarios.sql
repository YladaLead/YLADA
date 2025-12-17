-- =====================================================
-- SCRIPT: Corrigir Nomes dos Usuários de Teste
-- =====================================================
-- Execute este script se os nomes estiverem vazios
-- =====================================================

UPDATE user_profiles
SET nome_completo = 'Nutricionista Teste 1'
WHERE email = 'nutri1@ylada.com';

UPDATE user_profiles
SET nome_completo = 'Nutricionista Teste 2'
WHERE email = 'nutri2@ylada.com';

UPDATE user_profiles
SET nome_completo = 'Nutricionista Teste 3'
WHERE email = 'nutri3@ylada.com';

-- Verificar
SELECT 
  email,
  nome_completo,
  perfil,
  CASE 
    WHEN diagnostico_completo = true THEN '✅ Com diagnóstico'
    ELSE '❌ Sem diagnóstico'
  END as status_diagnostico
FROM user_profiles
WHERE email IN ('nutri1@ylada.com', 'nutri2@ylada.com', 'nutri3@ylada.com')
ORDER BY email;


