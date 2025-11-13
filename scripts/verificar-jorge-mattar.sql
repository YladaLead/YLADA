-- Verificar dados do Jorge Mattar
-- Buscar assinatura e calcular dias até vencimento

SELECT 
  u.email,
  up.nome_completo,
  s.id as subscription_id,
  s.area,
  s.plan_type,
  s.status,
  s.current_period_end,
  s.is_migrated,
  s.requires_manual_renewal,
  -- Calcular dias até vencimento
  s.current_period_end::date - CURRENT_DATE as dias_ate_vencimento,
  -- Calcular com Math.ceil (como está no código)
  CEIL(EXTRACT(EPOCH FROM (s.current_period_end - NOW())) / 86400) as dias_ceil,
  -- Calcular com Math.floor (correto)
  FLOOR(EXTRACT(EPOCH FROM (s.current_period_end - NOW())) / 86400) as dias_floor,
  -- Calcular com Math.round (alternativa)
  ROUND(EXTRACT(EPOCH FROM (s.current_period_end - NOW())) / 86400) as dias_round
FROM auth.users u
LEFT JOIN user_profiles up ON up.user_id = u.id
LEFT JOIN subscriptions s ON s.user_id = u.id AND s.area = 'wellness' AND s.status = 'active'
WHERE 
  (u.email ILIKE '%jorge%mattar%' OR up.nome_completo ILIKE '%jorge%mattar%')
  OR (u.email ILIKE '%mattar%' OR up.nome_completo ILIKE '%mattar%')
ORDER BY s.current_period_end DESC;

