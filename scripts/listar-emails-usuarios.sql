-- =====================================================
-- SCRIPT: Listar Todos os Emails de Usuários
-- =====================================================
-- Use este script ANTES de usar os scripts de reset
-- Ele mostra todos os emails disponíveis para você escolher
-- =====================================================

-- Listar todos os emails de usuários Nutri
SELECT 
  au.email,
  au.created_at as data_cadastro,
  au.last_sign_in_at as ultimo_login,
  up.nome_completo,
  up.perfil,
  up.diagnostico_completo,
  CASE 
    WHEN up.diagnostico_completo = true THEN '✅ Com diagnóstico'
    ELSE '❌ Sem diagnóstico'
  END as status_diagnostico,
  COUNT(jp.day_number) as dias_jornada_completos,
  CASE 
    WHEN COUNT(jp.day_number) = 0 THEN 'Sem jornada'
    WHEN MAX(jp.day_number) <= 7 THEN 'Fase 1'
    WHEN MAX(jp.day_number) <= 15 THEN 'Fase 2'
    ELSE 'Fase 3'
  END as fase_atual
FROM auth.users au
LEFT JOIN user_profiles up ON au.id = up.user_id
LEFT JOIN journey_progress jp ON au.id = jp.user_id AND jp.completed = true
WHERE up.perfil = 'nutri' OR up.perfil IS NULL
GROUP BY au.email, au.created_at, au.last_sign_in_at, up.nome_completo, up.perfil, up.diagnostico_completo
ORDER BY au.created_at DESC;

-- =====================================================
-- COMO USAR:
-- =====================================================
-- 1. Execute este script primeiro
-- 2. Copie o email que você quer usar
-- 3. Cole no script de reset (substitua 'seu-email@exemplo.com')
-- =====================================================


