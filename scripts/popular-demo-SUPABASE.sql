-- ==========================================
-- POPULAR CONTA DEMO - Para Supabase Dashboard
-- ==========================================
-- Data: 2025-12-18
-- Cria 8 clientes fictícias com perfis variados
-- Execute direto no Supabase SQL Editor
-- ==========================================

-- ⚠️ PASSO 1: Descubra seu user_id
-- Execute esta query primeiro:

SELECT id, email FROM auth.users LIMIT 5;

-- ⚠️ PASSO 2: Copie seu user_id e substitua em TODAS as queries abaixo
-- Procure por: 'SEU-USER-ID-AQUI' e substitua pelo UUID

-- ==========================================
-- CASO 1: Ana Silva - Emagrecimento (Ativa)
-- ==========================================
WITH new_client AS (
  INSERT INTO clients (
    user_id, name, email, phone, whatsapp, phone_country_code,
    birth_date, gender, instagram, goal,
    address_city, address_state, status, client_since,
    notes, tags
  ) VALUES (
    'SEU-USER-ID-AQUI'::uuid,  -- ⚠️ SUBSTITUA AQUI
    'Ana Silva',
    'ana.silva.demo@email.com',
    '11987654321', '11987654321', 'BR',
    '1992-03-15', 'feminino', '@ana_saude',
    'Emagrecimento: Perder 10kg para o casamento em 6 meses',
    'São Paulo', 'SP', 'ativa', NOW() - INTERVAL '2 months',
    'Cliente muito comprometida. Casamento em abril/2026. Evolução: -5.7kg em 2 meses!',
    ARRAY['emagrecimento', 'evento-importante', 'alta-adesao']
  ) RETURNING id, user_id
)
INSERT INTO client_evolution (client_id, user_id, measurement_date, weight, height, waist_circumference, hip_circumference, body_fat_percentage, notes)
SELECT id, user_id, NOW() - INTERVAL '2 months', 78.5, 1.65, 88, 108, 35.2, 'Início: 78.5kg - Meta: 68kg' FROM new_client
UNION ALL
SELECT id, user_id, NOW() - INTERVAL '1 month', 75.2, 1.65, 85, 105, 33.8, 'Mês 1: -3.3kg' FROM new_client
UNION ALL
SELECT id, user_id, NOW(), 72.8, 1.65, 82, 102, 32.1, 'Mês 2: -5.7kg total. Faltam 4.8kg!' FROM new_client;

-- ==========================================
-- CASO 2: Mariana Costa - Hipertrofia (Ativa)
-- ==========================================
WITH new_client AS (
  INSERT INTO clients (
    user_id, name, email, phone, whatsapp, phone_country_code,
    birth_date, gender, instagram, goal,
    address_city, address_state, status, client_since,
    notes, tags
  ) VALUES (
    'SEU-USER-ID-AQUI'::uuid,  -- ⚠️ SUBSTITUA AQUI
    'Mariana Costa',
    'mari.costa.demo@email.com',
    '11976543210', '11976543210', 'BR',
    '1996-08-22', 'feminino', '@mari_fitness',
    'Hipertrofia: Ganhar 5kg de massa muscular',
    'Rio de Janeiro', 'RJ', 'ativa', NOW() - INTERVAL '4 months',
    'Atleta amadora. Treina 6x/semana. Competirá em campeonato de fisiculturismo.',
    ARRAY['hipertrofia', 'atleta', 'musculacao']
  ) RETURNING id, user_id
)
INSERT INTO client_evolution (client_id, user_id, measurement_date, weight, height, body_fat_percentage, muscle_mass, notes)
SELECT id, user_id, NOW() - INTERVAL '4 months', 58.2, 1.68, 18.5, 44.2, 'Início: 58.2kg - Muito magra' FROM new_client
UNION ALL
SELECT id, user_id, NOW() - INTERVAL '2 months', 60.1, 1.68, 17.8, 46.5, 'Mês 2: +1.9kg' FROM new_client
UNION ALL
SELECT id, user_id, NOW(), 62.3, 1.68, 18.2, 48.1, 'Mês 4: +4.1kg, sendo 3.9kg massa magra!' FROM new_client;

-- ==========================================
-- CASO 3: Júlia Mendes - Diabetes (Ativa)
-- ==========================================
WITH new_client AS (
  INSERT INTO clients (
    user_id, name, email, phone, whatsapp, phone_country_code,
    birth_date, gender, instagram, goal,
    address_city, address_state, status, client_since,
    notes, tags
  ) VALUES (
    'SEU-USER-ID-AQUI'::uuid,  -- ⚠️ SUBSTITUA AQUI
    'Júlia Mendes',
    'julia.mendes.demo@email.com',
    '11965432109', '11965432109', 'BR',
    '1979-11-03', 'feminino', '@julia_saude',
    'Controle de Diabetes: Reduzir glicemia e perder 8kg',
    'Belo Horizonte', 'MG', 'ativa', NOW() - INTERVAL '3 months',
    'Diabetes tipo 2 há 6 meses. SUCESSO: Glicemia baixou de 145→108mg/dL! Médico reduziu medicação.',
    ARRAY['diabetes', 'emagrecimento', 'cronico']
  ) RETURNING id, user_id
)
INSERT INTO client_evolution (client_id, user_id, measurement_date, weight, height, waist_circumference, notes)
SELECT id, user_id, NOW() - INTERVAL '3 months', 82.5, 1.60, 95, 'Início: Glicemia 145mg/dL' FROM new_client
UNION ALL
SELECT id, user_id, NOW() - INTERVAL '1.5 months', 79.8, 1.60, 92, 'Melhora: Glicemia 128mg/dL' FROM new_client
UNION ALL
SELECT id, user_id, NOW(), 77.2, 1.60, 89, 'Agora: Glicemia 108mg/dL - NORMAL!' FROM new_client;

-- ==========================================
-- CASO 4: Camila Oliveira - Vegetariana (Ativa)
-- ==========================================
INSERT INTO clients (
  user_id, name, email, phone, whatsapp, phone_country_code,
  birth_date, gender, instagram, goal,
  address_city, address_state, status, client_since,
  notes, tags
) VALUES (
  'SEU-USER-ID-AQUI'::uuid,  -- ⚠️ SUBSTITUA AQUI
  'Camila Oliveira',
  'camila.oliveira.demo@email.com',
  '11954321098', '11954321098', 'BR',
  '1998-05-17', 'feminino', '@camiveg',
  'Melhorar nutrição vegetariana: Corrigir anemia e ganhar energia',
  'Curitiba', 'PR', 'ativa', NOW() - INTERVAL '1 month',
  'Vegetariana estrita há 2 anos. Anemia ferropriva grave (ferritina 12ng/mL). Suplementando B12 e ferro. Melhorando energia.',
  ARRAY['vegetariana', 'anemia', 'deficiencia-nutricional']
);

-- ==========================================
-- CASO 5: Patricia Santos - Compulsão (Pausa)
-- ==========================================
INSERT INTO clients (
  user_id, name, email, phone, whatsapp, phone_country_code,
  birth_date, gender, goal,
  address_city, address_state, status, client_since,
  notes, tags
) VALUES (
  'SEU-USER-ID-AQUI'::uuid,  -- ⚠️ SUBSTITUA AQUI
  'Patricia Santos',
  'patricia.santos.demo@email.com',
  '11943210987', '11943210987', 'BR',
  '1986-07-28', 'feminino',
  'Controlar compulsão alimentar noturna e emagrecer',
  'Porto Alegre', 'RS', 'pausa', NOW() - INTERVAL '5 months',
  'Compulsão alimentar noturna desde adolescência. Iniciou terapia. Pediu pausa de 1 mês para trabalhar questões emocionais. Perdeu 4.7kg até pedir pausa.',
  ARRAY['compulsao-alimentar', 'obesidade', 'terapia', 'caso-complexo']
);

-- ==========================================
-- CASO 6: Fernanda Lima - Gestante (Ativa)
-- ==========================================
WITH new_client AS (
  INSERT INTO clients (
    user_id, name, email, phone, whatsapp, phone_country_code,
    birth_date, gender, instagram, goal,
    address_city, address_state, status, client_since,
    notes, tags
  ) VALUES (
    'SEU-USER-ID-AQUI'::uuid,  -- ⚠️ SUBSTITUA AQUI
    'Fernanda Lima',
    'fernanda.lima.demo@email.com',
    '11932109876', '11932109876', 'BR',
    '1993-02-14', 'feminino', '@fe_maternidade',
    'Gestação saudável: Controlar ganho de peso e prevenir diabetes gestacional',
    'Brasília', 'DF', 'ativa', NOW() - INTERVAL '2 months',
    'Primeira gestação. 20 semanas. Ganho de peso excessivo no início (12kg). Após intervenção, ganho controlado. Glicemia normal.',
    ARRAY['gestante', 'ganho-peso-excessivo', 'prevencao-diabetes']
  ) RETURNING id, user_id
)
INSERT INTO client_evolution (client_id, user_id, measurement_date, weight, height, notes)
SELECT id, user_id, NOW() - INTERVAL '2 months', 70.5, 1.68, '18 sem. Peso pré: 62kg. Já +8.5kg (rápido!)' FROM new_client
UNION ALL
SELECT id, user_id, NOW() - INTERVAL '1 month', 73.2, 1.68, '19 sem. +11.2kg. Médico alertou!' FROM new_client
UNION ALL
SELECT id, user_id, NOW(), 74.8, 1.68, '20 sem. +12.8kg. Ganho controlado agora!' FROM new_client;

-- ==========================================
-- CASO 7: Beatriz Souza - Pré-Consulta (Lead)
-- ==========================================
INSERT INTO clients (
  user_id, name, email, phone, whatsapp, phone_country_code,
  birth_date, gender, goal,
  address_city, address_state, status, client_since,
  converted_from_lead, lead_source,
  notes, tags
) VALUES (
  'SEU-USER-ID-AQUI'::uuid,  -- ⚠️ SUBSTITUA AQUI
  'Beatriz Souza',
  'beatriz.souza.demo@email.com',
  '11921098765', '11921098765', 'BR',
  '1995-09-30', 'feminino',
  'Emagrecer e melhorar relação com comida',
  'Campinas', 'SP', 'pre_consulta', NOW() - INTERVAL '3 days',
  true, 'quiz-emagrecimento',
  'Lead convertida do quiz de emagrecimento. Primeira consulta agendada para próxima semana. Muito interessada!',
  ARRAY['lead', 'quiz', 'emagrecimento', 'primeira-consulta']
);

-- ==========================================
-- CASO 8: Larissa Rodrigues - Finalizada (Sucesso!)
-- ==========================================
WITH new_client AS (
  INSERT INTO clients (
    user_id, name, email, phone, whatsapp, phone_country_code,
    birth_date, gender, instagram, goal,
    address_city, address_state, status, client_since,
    notes, tags
  ) VALUES (
    'SEU-USER-ID-AQUI'::uuid,  -- ⚠️ SUBSTITUA AQUI
    'Larissa Rodrigues',
    'larissa.rodrigues.demo@email.com',
    '11910987654', '11910987654', 'BR',
    '1989-12-08', 'feminino', '@lari_vida_saudavel',
    'Emagrecimento: Perder 12kg',
    'Florianópolis', 'SC', 'finalizada', NOW() - INTERVAL '8 months',
    '🎉 CASO DE SUCESSO! Meta: -12kg. Resultado: -13.5kg em 6 meses! Finalizou acompanhamento em outubro/2025 mantendo peso.',
    ARRAY['sucesso', 'objetivo-atingido', 'emagrecimento', 'caso-exemplar']
  ) RETURNING id, user_id
)
INSERT INTO client_evolution (client_id, user_id, measurement_date, weight, height, notes)
SELECT id, user_id, NOW() - INTERVAL '8 months', 78.0, 1.60, 'Início: 78kg - Meta: 66kg' FROM new_client
UNION ALL
SELECT id, user_id, NOW() - INTERVAL '4 months', 71.5, 1.60, 'Mês 4: -6.5kg' FROM new_client
UNION ALL
SELECT id, user_id, NOW() - INTERVAL '2 months', 65.0, 1.60, 'Mês 6: -13kg - META ATINGIDA! 🎉' FROM new_client
UNION ALL
SELECT id, user_id, NOW(), 64.5, 1.60, 'Mês 8: -13.5kg - Mantendo! Finalizou.' FROM new_client;

-- ==========================================
-- VERIFICAÇÃO FINAL
-- ==========================================
SELECT 
  '✅ CONTA DEMO POPULADA COM SUCESSO!' AS status,
  '' AS separador,
  COUNT(*) AS total_clientes_criadas,
  COUNT(*) FILTER (WHERE status = 'ativa') AS clientes_ativas,
  COUNT(*) FILTER (WHERE status = 'pausa') AS em_pausa,
  COUNT(*) FILTER (WHERE status = 'pre_consulta') AS pre_consulta,
  COUNT(*) FILTER (WHERE status = 'finalizada') AS finalizadas
FROM clients
WHERE email LIKE '%.demo@email.com';

-- ==========================================
-- LISTAR TODAS AS CLIENTES DEMO
-- ==========================================
SELECT 
  name AS nome,
  status,
  address_city AS cidade,
  tags[1] AS tag_principal,
  EXTRACT(DAY FROM NOW() - client_since)::integer || ' dias' AS tempo_cliente,
  CASE 
    WHEN goal LIKE '%Emagrecimento%' THEN '🎯 Emagrecer'
    WHEN goal LIKE '%Hipertrofia%' THEN '💪 Hipertrofia'
    WHEN goal LIKE '%Diabetes%' THEN '🩺 Diabetes'
    WHEN goal LIKE '%vegetariana%' THEN '🌱 Vegetariana'
    WHEN goal LIKE '%Compulsão%' THEN '🧠 Compulsão'
    WHEN goal LIKE '%Gestação%' THEN '🤰 Gestante'
    ELSE '📋 Outro'
  END AS objetivo_emoji
FROM clients
WHERE email LIKE '%.demo@email.com'
ORDER BY client_since DESC;

-- ==========================================
-- RESUMO DOS CASOS
-- ==========================================
SELECT 
  '📊 RESUMO DOS 8 CASOS CRIADOS:' AS titulo
UNION ALL SELECT ''
UNION ALL SELECT '1️⃣ Ana Silva (ATIVA) - Emagrecimento para casamento → -5.7kg em 2 meses'
UNION ALL SELECT '2️⃣ Mariana Costa (ATIVA) - Hipertrofia/Atleta → +4.1kg massa magra em 4 meses'
UNION ALL SELECT '3️⃣ Júlia Mendes (ATIVA) - Diabetes tipo 2 → Glicemia 145→108mg/dL em 3 meses'
UNION ALL SELECT '4️⃣ Camila Oliveira (ATIVA) - Vegetariana com anemia → Corrigindo deficiências'
UNION ALL SELECT '5️⃣ Patricia Santos (PAUSA) - Compulsão alimentar → Em terapia, pausou 1 mês'
UNION ALL SELECT '6️⃣ Fernanda Lima (ATIVA) - Gestante 20 sem → Controlando ganho de peso'
UNION ALL SELECT '7️⃣ Beatriz Souza (PRÉ-CONSULTA) - Lead do quiz → 1ª consulta semana que vem'
UNION ALL SELECT '8️⃣ Larissa Rodrigues (FINALIZADA) - SUCESSO! → -13.5kg, meta atingida! 🎉'
UNION ALL SELECT ''
UNION ALL SELECT '✅ Pronto! Agora sua conta tem casos diversos para testar o sistema.';

-- ==========================================
-- FIM - Conta demo pronta para uso! 🎉
-- ==========================================


