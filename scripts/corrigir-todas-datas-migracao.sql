-- Script para corrigir todas as datas de vencimento baseado no CSV correto
-- As datas do CSV estão corretas, o banco tem data padrão errada (15/11/2025)

-- ============================================
-- CORREÇÕES BASEADAS NO CSV
-- ============================================

-- 1. Paulo - cadastro 12/11/2025, vencimento 11/12/2025
UPDATE subscriptions
SET 
  current_period_end = '2025-12-11T23:59:59Z'::timestamp with time zone,
  updated_at = NOW()
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'pauloedufribe@gmail.com')
AND area = 'wellness'
AND status = 'active';

-- 2. Jorge Mattar - cadastro 10/11/2025, vencimento 10/12/2025
UPDATE subscriptions
SET 
  current_period_end = '2025-12-10T23:59:59Z'::timestamp with time zone,
  updated_at = NOW()
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'jjmattar@gmail.com')
AND area = 'wellness'
AND status = 'active';

-- 3. Carol Garcia - cadastro 10/11/2025, vencimento 10/12/2025
UPDATE subscriptions
SET 
  current_period_end = '2025-12-10T23:59:59Z'::timestamp with time zone,
  updated_at = NOW()
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'carolina.landim.garcia@gmail.com')
AND area = 'wellness'
AND status = 'active';

-- 4. Donarosa59 - cadastro 10/11/2025, vencimento 10/12/2025
UPDATE subscriptions
SET 
  current_period_end = '2025-12-10T23:59:59Z'::timestamp with time zone,
  updated_at = NOW()
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'donarosa59@hotmail.com')
AND area = 'wellness'
AND status = 'active';

-- 5. Cleiton De Sá - cadastro 10/11/2025, vencimento 10/12/2025
UPDATE subscriptions
SET 
  current_period_end = '2025-12-10T23:59:59Z'::timestamp with time zone,
  updated_at = NOW()
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'slimrosolem@gmail.com')
AND area = 'wellness'
AND status = 'active';

-- 6. vnnuneshbl297 - cadastro 27/10/2025, vencimento 26/11/2025
UPDATE subscriptions
SET 
  current_period_end = '2025-11-26T23:59:59Z'::timestamp with time zone,
  updated_at = NOW()
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'vnnuneshbl297@gmail.com')
AND area = 'wellness'
AND status = 'active';

-- 7. Mônica Silva - cadastro 27/10/2025, vencimento 26/11/2025
UPDATE subscriptions
SET 
  current_period_end = '2025-11-26T23:59:59Z'::timestamp with time zone,
  updated_at = NOW()
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'mmg.monica2017@gmail.com')
AND area = 'wellness'
AND status = 'active';

-- 8. iaralallon56 - cadastro 27/10/2025, vencimento 26/11/2025
UPDATE subscriptions
SET 
  current_period_end = '2025-11-26T23:59:59Z'::timestamp with time zone,
  updated_at = NOW()
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'iaralallon56@gmail.com')
AND area = 'wellness'
AND status = 'active';

-- 9. Aracy - cadastro 23/10/2025, vencimento 22/11/2025 (mensal pago)
UPDATE subscriptions
SET 
  current_period_end = '2025-11-22T23:59:59Z'::timestamp with time zone,
  updated_at = NOW()
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'vidasaudavelaracy@gmail.com' OR email = 'aracy.vidasaudavelaracy@gmail.com')
AND area = 'wellness'
AND status = 'active';

-- 10. Cleuza Mizuno - cadastro 22/10/2025, vencimento 21/11/2025
UPDATE subscriptions
SET 
  current_period_end = '2025-11-21T23:59:59Z'::timestamp with time zone,
  updated_at = NOW()
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'diasmizuno@hotmail.com')
AND area = 'wellness'
AND status = 'active';

-- 11. Stephanie Izidio - cadastro 22/10/2025, vencimento 21/11/2025
UPDATE subscriptions
SET 
  current_period_end = '2025-11-21T23:59:59Z'::timestamp with time zone,
  updated_at = NOW()
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'stephanieizidio@hotmail.com')
AND area = 'wellness'
AND status = 'active';

-- 12. olivioortola - cadastro 21/10/2025, vencimento 20/11/2025
UPDATE subscriptions
SET 
  current_period_end = '2025-11-20T23:59:59Z'::timestamp with time zone,
  updated_at = NOW()
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'olivio.ortola@gmail.com')
AND area = 'wellness'
AND status = 'active';

-- 13. Marta - cadastro 21/10/2025, vencimento 21/11/2025
UPDATE subscriptions
SET 
  current_period_end = '2025-11-21T23:59:59Z'::timestamp with time zone,
  updated_at = NOW()
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'marta421@outlook.com')
AND area = 'wellness'
AND status = 'active';

-- 14. gladisgordaliza - cadastro 21/10/2025, vencimento 20/11/2025
UPDATE subscriptions
SET 
  current_period_end = '2025-11-20T23:59:59Z'::timestamp with time zone,
  updated_at = NOW()
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'gladisgordaliza@gmail.com')
AND area = 'wellness'
AND status = 'active';

-- 15. claudiavitto - cadastro 21/10/2025, vencimento 20/11/2025
UPDATE subscriptions
SET 
  current_period_end = '2025-11-20T23:59:59Z'::timestamp with time zone,
  updated_at = NOW()
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'claudiavitto@hotmail.com')
AND area = 'wellness'
AND status = 'active';

-- 16. Midia EUA - cadastro 21/10/2025, vencimento 20/11/2025
UPDATE subscriptions
SET 
  current_period_end = '2025-11-20T23:59:59Z'::timestamp with time zone,
  updated_at = NOW()
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'midiaseua@icloud.com')
AND area = 'wellness'
AND status = 'active';

-- 17. ThaisConte - cadastro 21/10/2025, vencimento 20/11/2025
UPDATE subscriptions
SET 
  current_period_end = '2025-11-20T23:59:59Z'::timestamp with time zone,
  updated_at = NOW()
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'thaconte@hotmail.com')
AND area = 'wellness'
AND status = 'active';

-- 18. Galdino Albuquerque Junior - cadastro 21/10/2025, vencimento 20/11/2025
UPDATE subscriptions
SET 
  current_period_end = '2025-11-20T23:59:59Z'::timestamp with time zone,
  updated_at = NOW()
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'albuquerquegaldino1959@gmail.com')
AND area = 'wellness'
AND status = 'active';

-- 19. João Araújo - cadastro 21/10/2025, vencimento 21/11/2025
UPDATE subscriptions
SET 
  current_period_end = '2025-11-21T23:59:59Z'::timestamp with time zone,
  updated_at = NOW()
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'joaoaraujo11@gmail.com')
AND area = 'wellness'
AND status = 'active';

-- 20. Deise - cadastro 18/10/2025, vencimento 27/11/2025 (verificar se é correto)
UPDATE subscriptions
SET 
  current_period_end = '2025-11-27T23:59:59Z'::timestamp with time zone,
  updated_at = NOW()
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'deisefaula@gmail.com')
AND area = 'wellness'
AND status = 'active';

-- 21. Nayara Fernandes - cadastro 16/10/2025, vencimento 15/11/2025
UPDATE subscriptions
SET 
  current_period_end = '2025-11-15T23:59:59Z'::timestamp with time zone,
  updated_at = NOW()
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'naytenutri@gmail.com')
AND area = 'wellness'
AND status = 'active';

-- 22. Andenutri - cadastro 16/10/2025, vencimento 15/11/2025
UPDATE subscriptions
SET 
  current_period_end = '2025-11-15T23:59:59Z'::timestamp with time zone,
  updated_at = NOW()
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'andenutri@gmail.com')
AND area = 'wellness'
AND status = 'active';

-- 23. JULIANA BORTOLAZZO - cadastro 15/10/2025, vencimento 15/11/2025
UPDATE subscriptions
SET 
  current_period_end = '2025-11-15T23:59:59Z'::timestamp with time zone,
  updated_at = NOW()
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'julianazr94@gmail.com')
AND area = 'wellness'
AND status = 'active';

-- 24. marcela lucas / marcela roberta (mesma pessoa) - cadastro 27/10/2025, vencimento 27/11/2025 (mensal pago)
-- Já está correto no banco (27/11/2025), mas garantindo
UPDATE subscriptions
SET 
  current_period_end = '2025-11-27T23:59:59Z'::timestamp with time zone,
  updated_at = NOW()
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'marcela_roberto@hotmail.com')
AND area = 'wellness'
AND status = 'active';

-- 25. Carlota de Moraes Batista - cadastro 13/10/2025, anual gratuito
UPDATE subscriptions
SET 
  current_period_end = '2026-10-13T23:59:59Z'::timestamp with time zone,
  plan_type = 'annual',
  updated_at = NOW()
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'cbatis@terra.com.br')
AND area = 'wellness'
AND status = 'active';

-- 26. Anna Slim (Portal) - cadastro 11/10/2025, anual gratuito
UPDATE subscriptions
SET 
  current_period_end = '2026-10-11T23:59:59Z'::timestamp with time zone,
  plan_type = 'annual',
  updated_at = NOW()
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'portalmagra@gmail.com')
AND area = 'wellness'
AND status = 'active';

-- ============================================
-- VERIFICAÇÃO FINAL
-- ============================================
-- Execute este SELECT para verificar se todas as datas foram corrigidas

SELECT 
  u.email,
  up.nome_completo,
  s.current_period_end as data_vencimento,
  s.current_period_end::date - CURRENT_DATE as dias_ate_vencimento,
  s.plan_type
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
  'vidasaudavelaracy@gmail.com',
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
  'marcela_roberto@hotmail.com',
  'cbatis@terra.com.br',
  'portalmagra@gmail.com'
)
ORDER BY s.current_period_end;

