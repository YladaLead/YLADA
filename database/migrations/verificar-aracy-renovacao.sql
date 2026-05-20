-- =====================================================
-- VERIFICAÇÃO: Cadastro e Renovação - Usuária ARACY
-- =====================================================
-- 
-- INSTRUÇÕES:
-- 1. Execute a QUERY #4 (Verificação completa combinada) - É a mais completa
-- 2. Ou execute as queries individuais (#1, #2, #3) se precisar de detalhes específicos
-- 3. A query #6 mostra estatísticas de ferramentas criadas
--
-- O que verificar após executar:
-- ✅ status_renovacao = 'ATIVA' (se renovação foi processada)
-- ✅ current_period_end > NOW() (data de vencimento no futuro)
-- ✅ dias_restantes > 0 (dias restantes da assinatura)
-- ✅ status_assinatura = 'active' (status no banco)
-- ✅ amount e currency corretos (valor e moeda)
--
-- =====================================================

-- 1. Buscar usuário por email ou nome
SELECT 
  u.id as user_id,
  u.email,
  u.created_at as usuario_criado_em,
  u.last_sign_in_at as ultimo_login,
  u.email_confirmed_at as email_confirmado_em,
  u.raw_user_meta_data->>'full_name' as nome_completo,
  u.raw_user_meta_data->>'phone' as telefone
FROM auth.users u
WHERE 
  LOWER(u.email) LIKE '%aracy%'
  OR LOWER(u.raw_user_meta_data->>'full_name') LIKE '%aracy%'
ORDER BY u.created_at DESC;

-- 2. Verificar perfil completo (user_profiles)
SELECT 
  up.id,
  up.user_id,
  up.nome_completo,
  up.email,
  up.user_slug,
  up.perfil,
  up.whatsapp,
  up.is_admin,
  up.is_support,
  up.created_at as perfil_criado_em,
  up.updated_at as perfil_atualizado_em
FROM user_profiles up
WHERE 
  LOWER(up.email) LIKE '%aracy%'
  OR LOWER(up.nome_completo) LIKE '%aracy%'
  OR LOWER(up.user_slug) LIKE '%aracy%';

-- 3. Verificar assinaturas (tabela subscriptions)
SELECT 
  s.id,
  s.user_id,
  s.area,
  s.plan_type,
  s.amount,
  s.currency,
  s.status,
  s.current_period_start,
  s.current_period_end,
  s.is_migrated,
  s.migrated_from,
  s.requires_manual_renewal,
  s.created_at as assinatura_criada_em,
  CASE 
    WHEN s.current_period_end > NOW() AND s.status = 'active' THEN 'ATIVA'
    WHEN s.current_period_end <= NOW() THEN 'EXPIRADA'
    WHEN s.status = 'canceled' THEN 'CANCELADA'
    WHEN s.status = 'past_due' THEN 'ATRASADA'
    WHEN s.status = 'unpaid' THEN 'NÃO PAGA'
    ELSE UPPER(s.status)
  END as status_renovacao,
  s.current_period_end - NOW() as dias_restantes
FROM subscriptions s
WHERE s.user_id IN (
  SELECT u.id 
  FROM auth.users u 
  WHERE LOWER(u.email) LIKE '%aracy%'
     OR LOWER(u.raw_user_meta_data->>'full_name') LIKE '%aracy%'
)
ORDER BY s.created_at DESC;

-- 4. Verificação completa combinada (JOIN) - RECOMENDADO (USE ESTA)
SELECT 
  u.id as user_id,
  u.email as email_auth,
  u.created_at as usuario_criado_em,
  u.last_sign_in_at as ultimo_login,
  up.nome_completo,
  up.user_slug,
  up.perfil,
  up.whatsapp,
  up.is_admin,
  up.is_support,
  s.id as subscription_id,
  s.area,
  s.plan_type,
  s.amount,
  s.currency,
  s.status as status_assinatura,
  s.current_period_start,
  s.current_period_end,
  s.is_migrated,
  s.requires_manual_renewal,
  CASE 
    WHEN s.current_period_end > NOW() AND s.status = 'active' THEN 'ATIVA'
    WHEN s.current_period_end <= NOW() THEN 'EXPIRADA'
    WHEN s.status = 'canceled' THEN 'CANCELADA'
    WHEN s.status = 'past_due' THEN 'ATRASADA'
    WHEN s.status = 'unpaid' THEN 'NÃO PAGA'
    WHEN s.id IS NULL THEN 'SEM ASSINATURA'
    ELSE UPPER(s.status)
  END as status_renovacao,
  CASE 
    WHEN s.current_period_end > NOW() THEN 
      EXTRACT(DAY FROM (s.current_period_end - NOW()))::INTEGER
    ELSE NULL
  END as dias_restantes
FROM auth.users u
LEFT JOIN user_profiles up ON u.id = up.user_id
LEFT JOIN subscriptions s ON u.id = s.user_id
WHERE 
  LOWER(u.email) LIKE '%aracy%'
  OR LOWER(up.nome_completo) LIKE '%aracy%'
  OR LOWER(up.user_slug) LIKE '%aracy%'
ORDER BY s.created_at DESC NULLS LAST;

-- 6. Verificar se há ferramentas/quizzes criados pela usuária
SELECT 
  COUNT(*) as total_ferramentas,
  COUNT(CASE WHEN status = 'active' THEN 1 END) as ferramentas_ativas,
  COUNT(CASE WHEN profession = 'wellness' THEN 1 END) as ferramentas_wellness,
  COUNT(CASE WHEN profession = 'nutri' THEN 1 END) as ferramentas_nutri
FROM user_templates
WHERE user_id IN (
  SELECT u.id 
  FROM auth.users u 
  WHERE LOWER(u.email) LIKE '%aracy%'
     OR LOWER(u.raw_user_meta_data->>'full_name') LIKE '%aracy%'
);


