-- Corrigir data de expiração do Jorge Mattar
-- Se a inscrição foi em 10/11/2025, a expiração deve ser 10/12/2025 (1 mês depois)

-- Primeiro, verificar os dados atuais
SELECT 
  u.email,
  up.nome_completo,
  s.id as subscription_id,
  s.current_period_end as data_vencimento_atual,
  s.current_period_end::date - CURRENT_DATE as dias_ate_vencimento_atual
FROM auth.users u
LEFT JOIN user_profiles up ON up.user_id = u.id
LEFT JOIN subscriptions s ON s.user_id = u.id AND s.area = 'wellness' AND s.status = 'active'
WHERE 
  u.email = 'jjmattar@gmail.com'
  OR up.nome_completo ILIKE '%jorge%mattar%';

-- Corrigir data de expiração para 10/12/2025 (1 mês após inscrição em 10/11/2025)
UPDATE subscriptions
SET 
  current_period_end = '2025-12-10T23:59:59Z'::timestamp with time zone,
  updated_at = NOW()
WHERE id = '013de1c8-5583-4ad0-9f24-2b3b188c0d06'
AND area = 'wellness'
AND status = 'active';

-- Verificar se foi atualizado corretamente
SELECT 
  u.email,
  up.nome_completo,
  s.id as subscription_id,
  s.current_period_end as nova_data_vencimento,
  s.current_period_end::date - CURRENT_DATE as dias_ate_vencimento_corrigido
FROM auth.users u
LEFT JOIN user_profiles up ON up.user_id = u.id
LEFT JOIN subscriptions s ON s.user_id = u.id AND s.area = 'wellness' AND s.status = 'active'
WHERE s.id = '013de1c8-5583-4ad0-9f24-2b3b188c0d06';

