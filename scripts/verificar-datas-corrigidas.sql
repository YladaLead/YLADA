-- Verificar se todas as datas foram corrigidas corretamente
-- Comparar com o CSV

SELECT 
  u.email,
  up.nome_completo,
  s.current_period_end as data_vencimento_banco,
  s.current_period_end::date - CURRENT_DATE as dias_ate_vencimento,
  s.plan_type,
  CASE 
    WHEN s.current_period_end::date - CURRENT_DATE <= 3 THEN '⚠️ URGENTE (≤3 dias)'
    WHEN s.current_period_end::date - CURRENT_DATE <= 7 THEN '⚠️ ATENÇÃO (≤7 dias)'
    WHEN s.current_period_end::date - CURRENT_DATE <= 30 THEN '✅ OK (≤30 dias)'
    ELSE '✅ BOM (>30 dias)'
  END as status
FROM auth.users u
LEFT JOIN user_profiles up ON up.user_id = u.id
LEFT JOIN subscriptions s ON s.user_id = u.id AND s.area = 'wellness' AND s.status = 'active'
WHERE u.email IN (
  'pauloedufribe@gmail.com',
  'jjmattar@gmail.com',
  'carolina.landim.garcia@gmail.com',
  'donarosa59@hotmail.com',
  'slimrosolem@gmail.com',
  'vnnuneshbl297@gmail.com',
  'mmg.monica2017@gmail.com',
  'iaralallon56@gmail.com',
  'diasmizuno@hotmail.com',
  'stephanieizidio@hotmail.com',
  'olivio.ortola@gmail.com',
  'marta421@outlook.com',
  'gladisgordaliza@gmail.com',
  'claudiavitto@hotmail.com',
  'midiaseua@icloud.com',
  'thaconte@hotmail.com',
  'albuquerquegaldino1959@gmail.com',
  'joaoaraujo11@gmail.com',
  'deisefaula@gmail.com',
  'naytenutri@gmail.com',
  'andenutri@gmail.com',
  'julianazr94@gmail.com',
  'marcela_roberto@hotmail.com'
)
ORDER BY s.current_period_end;

