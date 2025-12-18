-- ==========================================
-- SETUP COMPLETO - Conta Demo
-- ==========================================
-- Data: 2025-12-18
-- Objetivo: Configurar conta demo completa em 1 script
-- - Libera todos os 30 dias da jornada
-- - Popula clientes de teste
-- - Deixa tudo pronto para demonstração
-- ==========================================

-- ==========================================
-- ⚠️ IMPORTANTE: SUBSTITUA SEU USER_ID
-- ==========================================
-- Execute primeiro:
-- SELECT id, email FROM auth.users;
-- 
-- Depois substitua TODAS as ocorrências de:
-- 'SEU-USER-ID-AQUI' pelo seu UUID

-- ==========================================
-- PARTE 1: LIBERAR JORNADA DE 30 DIAS
-- ==========================================

INSERT INTO journey_progress (
  user_id,
  day_number,
  week_number,
  completed,
  completed_at,
  checklist_completed,
  created_at,
  updated_at
)
SELECT 
  'SEU-USER-ID-AQUI'::uuid as user_id,
  day_number,
  week_number,
  true as completed,
  NOW() as completed_at,
  (
    SELECT jsonb_agg(true)
    FROM jsonb_array_elements(COALESCE(checklist_items, '[]'::jsonb))
  ) as checklist_completed,
  NOW() as created_at,
  NOW() as updated_at
FROM journey_days
WHERE day_number BETWEEN 1 AND 30
ON CONFLICT (user_id, day_number) 
DO UPDATE SET
  completed = true,
  completed_at = NOW(),
  updated_at = NOW();

-- ==========================================
-- PARTE 2: POPULAR CLIENTES DEMO
-- ==========================================

-- Cliente 1: Ana Silva - Emagrecimento (Ativa)
WITH new_client AS (
  INSERT INTO clients (
    user_id, name, email, phone, whatsapp, phone_country_code,
    birth_date, gender, instagram, goal,
    address_city, address_state, status, client_since,
    notes, tags
  ) VALUES (
    'SEU-USER-ID-AQUI'::uuid,
    'Ana Silva',
    'ana.silva.demo@email.com',
    '11987654321', '11987654321', 'BR',
    '1992-03-15', 'feminino', '@ana_saude',
    'Emagrecimento: Perder 10kg para o casamento',
    'São Paulo', 'SP', 'ativa', NOW() - INTERVAL '2 months',
    'Muito comprometida. Casamento em abril/2026. Evolução: -5.7kg!',
    ARRAY['emagrecimento', 'alta-adesao']
  ) RETURNING id, user_id
)
INSERT INTO client_evolution (client_id, user_id, measurement_date, weight, height, waist_circumference, hip_circumference, body_fat_percentage, notes)
SELECT id, user_id, NOW() - INTERVAL '2 months', 78.5, 1.65, 88, 108, 35.2, 'Início: 78.5kg' FROM new_client
UNION ALL
SELECT id, user_id, NOW() - INTERVAL '1 month', 75.2, 1.65, 85, 105, 33.8, 'Mês 1: -3.3kg' FROM new_client
UNION ALL
SELECT id, user_id, NOW(), 72.8, 1.65, 82, 102, 32.1, 'Mês 2: -5.7kg total' FROM new_client;

-- Cliente 2: Mariana Costa - Hipertrofia (Ativa)
WITH new_client AS (
  INSERT INTO clients (
    user_id, name, email, phone, whatsapp, phone_country_code,
    birth_date, gender, instagram, goal,
    address_city, address_state, status, client_since,
    notes, tags
  ) VALUES (
    'SEU-USER-ID-AQUI'::uuid,
    'Mariana Costa',
    'mari.costa.demo@email.com',
    '11976543210', '11976543210', 'BR',
    '1996-08-22', 'feminino', '@mari_fitness',
    'Hipertrofia: Ganhar 5kg de massa muscular',
    'Rio de Janeiro', 'RJ', 'ativa', NOW() - INTERVAL '4 months',
    'Atleta. Treina 6x/semana.',
    ARRAY['hipertrofia', 'atleta']
  ) RETURNING id, user_id
)
INSERT INTO client_evolution (client_id, user_id, measurement_date, weight, height, body_fat_percentage, muscle_mass, notes)
SELECT id, user_id, NOW() - INTERVAL '4 months', 58.2, 1.68, 18.5, 44.2, 'Início' FROM new_client
UNION ALL
SELECT id, user_id, NOW(), 62.3, 1.68, 18.2, 48.1, '+4.1kg massa magra!' FROM new_client;

-- Cliente 3: Júlia Mendes - Diabetes (Ativa)
INSERT INTO clients (
  user_id, name, email, phone, whatsapp, phone_country_code,
  birth_date, gender, instagram, goal,
  address_city, address_state, status, client_since,
  notes, tags
) VALUES (
  'SEU-USER-ID-AQUI'::uuid,
  'Júlia Mendes',
  'julia.mendes.demo@email.com',
  '11965432109', '11965432109', 'BR',
  '1979-11-03', 'feminino', '@julia_saude',
  'Controle de Diabetes tipo 2',
  'Belo Horizonte', 'MG', 'ativa', NOW() - INTERVAL '3 months',
  'Glicemia baixou de 145→108mg/dL!',
  ARRAY['diabetes', 'cronico']
);

-- Cliente 4: Beatriz Souza - Lead (Pré-consulta)
INSERT INTO clients (
  user_id, name, email, phone, whatsapp, phone_country_code,
  birth_date, gender, goal,
  address_city, address_state, status, client_since,
  converted_from_lead, lead_source,
  notes, tags
) VALUES (
  'SEU-USER-ID-AQUI'::uuid,
  'Beatriz Souza',
  'beatriz.souza.demo@email.com',
  '11921098765', '11921098765', 'BR',
  '1995-09-30', 'feminino',
  'Emagrecer e melhorar relação com comida',
  'Campinas', 'SP', 'pre_consulta', NOW() - INTERVAL '3 days',
  true, 'quiz-emagrecimento',
  'Lead do quiz. 1ª consulta semana que vem.',
  ARRAY['lead', 'quiz']
);

-- Cliente 5: Larissa Rodrigues - Caso de Sucesso (Finalizada)
WITH new_client AS (
  INSERT INTO clients (
    user_id, name, email, phone, whatsapp, phone_country_code,
    birth_date, gender, instagram, goal,
    address_city, address_state, status, client_since,
    notes, tags
  ) VALUES (
    'SEU-USER-ID-AQUI'::uuid,
    'Larissa Rodrigues',
    'larissa.rodrigues.demo@email.com',
    '11910987654', '11910987654', 'BR',
    '1989-12-08', 'feminino', '@lari_vida_saudavel',
    'Emagrecimento: Perder 12kg',
    'Florianópolis', 'SC', 'finalizada', NOW() - INTERVAL '8 months',
    '🎉 SUCESSO! -13.5kg em 6 meses!',
    ARRAY['sucesso', 'objetivo-atingido']
  ) RETURNING id, user_id
)
INSERT INTO client_evolution (client_id, user_id, measurement_date, weight, height, notes)
SELECT id, user_id, NOW() - INTERVAL '8 months', 78.0, 1.60, 'Início' FROM new_client
UNION ALL
SELECT id, user_id, NOW() - INTERVAL '2 months', 65.0, 1.60, 'META ATINGIDA! 🎉' FROM new_client
UNION ALL
SELECT id, user_id, NOW(), 64.5, 1.60, 'Mantendo peso' FROM new_client;

-- ==========================================
-- VERIFICAÇÃO FINAL
-- ==========================================

-- 1. Verificar Jornada
SELECT 
  '✅ JORNADA DE 30 DIAS' as item,
  COUNT(*) FILTER (WHERE completed = true) || '/30 dias' as status,
  CASE 
    WHEN COUNT(*) FILTER (WHERE completed = true) = 30 THEN '🎉 Liberado!'
    ELSE '⚠️ Verificar'
  END as resultado
FROM journey_progress
WHERE user_id = 'SEU-USER-ID-AQUI'::uuid;

-- 2. Verificar Clientes Demo
SELECT 
  '✅ CLIENTES DEMO' as item,
  COUNT(*)::text || ' clientes' as status,
  CASE 
    WHEN COUNT(*) >= 5 THEN '🎉 Criadas!'
    ELSE '⚠️ Verificar'
  END as resultado
FROM clients
WHERE user_id = 'SEU-USER-ID-AQUI'::uuid
  AND email LIKE '%.demo@email.com';

-- 3. Listar Clientes Criadas
SELECT 
  name as nome,
  status,
  tags[1] as tag,
  EXTRACT(DAY FROM NOW() - client_since)::integer || ' dias' as tempo
FROM clients
WHERE user_id = 'SEU-USER-ID-AQUI'::uuid
  AND email LIKE '%.demo@email.com'
ORDER BY client_since DESC;

-- ==========================================
-- RESUMO FINAL
-- ==========================================
SELECT 
  '🎉 SETUP COMPLETO!' as titulo
UNION ALL SELECT ''
UNION ALL SELECT '✅ Jornada de 30 dias: LIBERADA'
UNION ALL SELECT '✅ Clientes demo: CRIADAS'
UNION ALL SELECT ''
UNION ALL SELECT '📋 Clientes criadas:'
UNION ALL SELECT '  1. Ana Silva - Emagrecimento (ativa)'
UNION ALL SELECT '  2. Mariana Costa - Hipertrofia (ativa)'
UNION ALL SELECT '  3. Júlia Mendes - Diabetes (ativa)'
UNION ALL SELECT '  4. Beatriz Souza - Lead (pré-consulta)'
UNION ALL SELECT '  5. Larissa Rodrigues - Sucesso (finalizada)'
UNION ALL SELECT ''
UNION ALL SELECT '🚀 Conta pronta para demonstração!';

-- ==========================================
-- FIM - Conta demo configurada! 🎉
-- ==========================================
