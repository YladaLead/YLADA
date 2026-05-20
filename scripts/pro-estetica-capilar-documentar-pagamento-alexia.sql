-- Documentar assinatura Pro Estética capilar após pagamento Mercado Pago (Alexia Lima).
-- Preencher os campos marcados com <<< >>> após o webhook ou confirmação no painel MP.
-- E-mail: studioalexialima@gmail.com

-- ---------- 1) Conferir utilizador e tenant ----------
SELECT up.user_id, up.email, up.nome_completo, lt.id AS tenant_id, lt.vertical_code
FROM user_profiles up
LEFT JOIN leader_tenants lt ON lt.owner_user_id = up.user_id
WHERE lower(trim(up.email)) = 'studioalexialima@gmail.com';

-- ---------- 2) Após MP autorizado: estender acesso (ajuste a data se necessário) ----------
-- Mensal: +1 mês a partir de hoje ou do fim atual | Anual: +12 meses
/*
UPDATE ylada_estetica_consult_clients c
SET
  access_valid_until = (CURRENT_DATE + INTERVAL '1 month')::DATE,  -- ou '12 months' se anual
  last_payment_at = NOW(),
  consulting_paid_amount = 300.00,  -- 300 mensal ou 1800 anual
  payment_currency = 'BRL',
  is_annual_plan = false,           -- true se anual
  admin_notes = COALESCE(admin_notes, '') || E'\n[MP ' || NOW()::text || '] Assinatura confirmada. preapproval_id=<<<ID_MP>>> plan=<<<monthly|annual>>>',
  access_expiry_reminder_sent_15d = false,
  access_expiry_reminder_sent_7d = false,
  access_expiry_reminder_sent_1d = false,
  updated_at = NOW()
FROM leader_tenants lt
WHERE c.leader_tenant_id = lt.id
  AND lt.owner_user_id = '3418c513-c6b5-44e9-959a-8a9a03c356b2'::uuid;
*/

-- ---------- 3) Se o webhook não gravou subscriptions, upsert manual ----------
/*
INSERT INTO subscriptions (
  user_id, area, plan_type, status, features,
  stripe_account, stripe_subscription_id, stripe_customer_id, stripe_price_id,
  amount, currency, current_period_start, current_period_end, updated_at
) VALUES (
  '3418c513-c6b5-44e9-959a-8a9a03c356b2'::uuid,
  'pro_estetica_capilar',
  'monthly',  -- ou 'annual'
  'active',
  '["painel_capilar"]'::jsonb,
  NULL,
  'mp_sub_<<<PREAPPROVAL_ID>>>',
  'mp_customer',
  'mp_recurring',
  30000,  -- centavos: 30000 mensal, 180000 anual
  'brl',
  NOW(),
  NOW() + INTERVAL '1 month',  -- ou '12 months'
  NOW()
)
ON CONFLICT (stripe_subscription_id) DO UPDATE SET
  status = 'active',
  current_period_end = EXCLUDED.current_period_end,
  updated_at = NOW();
*/

-- ---------- 4) Verificação final ----------
SELECT
  c.business_name,
  c.access_valid_until,
  c.last_payment_at,
  c.consulting_paid_amount,
  s.plan_type,
  s.status,
  s.stripe_subscription_id,
  s.current_period_end
FROM user_profiles up
JOIN leader_tenants lt ON lt.owner_user_id = up.user_id
LEFT JOIN ylada_estetica_consult_clients c ON c.leader_tenant_id = lt.id
LEFT JOIN subscriptions s ON s.user_id = up.user_id AND s.area = 'pro_estetica_capilar'
WHERE lower(trim(up.email)) = 'studioalexialima@gmail.com'
ORDER BY s.updated_at DESC NULLS LAST
LIMIT 3;
