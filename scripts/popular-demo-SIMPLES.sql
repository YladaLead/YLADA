-- ==========================================
-- POPULAR CONTA DEMO - Versão Simplificada
-- ==========================================
-- Data: 2025-12-18
-- Cria 8 clientes fictícias com casos variados
-- ==========================================

-- ⚠️ IMPORTANTE: Substitua o user_id abaixo pelo seu
-- Para descobrir seu user_id, execute primeiro:
-- SELECT id, email FROM auth.users;

-- Depois cole o UUID aqui:
\set user_id 'COLE-SEU-USER-ID-AQUI'

-- OU execute este SELECT e copie o resultado:
-- SELECT id FROM auth.users WHERE email = 'seu-email@aqui.com';

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
    :'user_id',
    'Ana Silva',
    'ana.silva.demo@email.com',
    '11987654321', '11987654321', 'BR',
    '1992-03-15', 'feminino', '@ana_saude',
    'Emagrecimento: Perder 10kg para o casamento em 6 meses',
    'São Paulo', 'SP', 'ativa', NOW() - INTERVAL '2 months',
    'Cliente muito comprometida, segue bem o plano. Casamento em abril/2026.',
    ARRAY['emagrecimento', 'evento-importante', 'alta-adesao']
  ) RETURNING id, user_id
)
INSERT INTO client_evolution (client_id, user_id, measurement_date, weight, height, waist_circumference, hip_circumference, body_fat_percentage, notes)
SELECT id, user_id, NOW() - INTERVAL '2 months', 78.5, 1.65, 88, 108, 35.2, 'Avaliação inicial - Objetivo: 68kg' FROM new_client
UNION ALL
SELECT id, user_id, NOW() - INTERVAL '1 month', 75.2, 1.65, 85, 105, 33.8, 'Ótima evolução! -3.3kg' FROM new_client
UNION ALL
SELECT id, user_id, NOW(), 72.8, 1.65, 82, 102, 32.1, 'Continua bem! -5.7kg total.' FROM new_client;

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
    :'user_id',
    'Mariana Costa',
    'mari.costa.demo@email.com',
    '11976543210', '11976543210', 'BR',
    '1996-08-22', 'feminino', '@mari_fitness',
    'Hipertrofia: Ganhar 5kg de massa muscular',
    'Rio de Janeiro', 'RJ', 'ativa', NOW() - INTERVAL '4 months',
    'Atleta amadora, treina musculação 6x/semana.',
    ARRAY['hipertrofia', 'atleta', 'musculacao']
  ) RETURNING id, user_id
)
INSERT INTO client_evolution (client_id, user_id, measurement_date, weight, height, body_fat_percentage, muscle_mass, notes)
SELECT id, user_id, NOW() - INTERVAL '4 months', 58.2, 1.68, 18.5, 44.2, 'Avaliação inicial' FROM new_client
UNION ALL
SELECT id, user_id, NOW() - INTERVAL '2 months', 60.1, 1.68, 17.8, 46.5, 'Ganhando massa!' FROM new_client
UNION ALL
SELECT id, user_id, NOW(), 62.3, 1.68, 18.2, 48.1, '+4.1kg massa magra' FROM new_client;

-- ==========================================
-- CASO 3: Júlia Mendes - Diabetes (Ativa)
-- ==========================================
INSERT INTO clients (
  user_id, name, email, phone, whatsapp, phone_country_code,
  birth_date, gender, instagram, goal,
  address_city, address_state, status, client_since,
  notes, tags
) VALUES (
  :'user_id',
  'Júlia Mendes',
  'julia.mendes.demo@email.com',
  '11965432109', '11965432109', 'BR',
  '1979-11-03', 'feminino', '@julia_saude',
  'Controle de Diabetes: Reduzir glicemia e perder 8kg',
  'Belo Horizonte', 'MG', 'ativa', NOW() - INTERVAL '3 months',
  'Diabetes tipo 2 há 6 meses. Glicemia baixou de 145→108mg/dL!',
  ARRAY['diabetes', 'emagrecimento', 'cronico']
);

-- ==========================================
-- CASO 4: Camila Oliveira - Vegetariana (Ativa)
-- ==========================================
INSERT INTO clients (
  user_id, name, email, phone, whatsapp, phone_country_code,
  birth_date, gender, instagram, goal,
  address_city, address_state, status, client_since,
  notes, tags
) VALUES (
  :'user_id',
  'Camila Oliveira',
  'camila.oliveira.demo@email.com',
  '11954321098', '11954321098', 'BR',
  '1998-05-17', 'feminino', '@camiveg',
  'Melhorar nutrição vegetariana: Corrigir anemia',
  'Curitiba', 'PR', 'ativa', NOW() - INTERVAL '1 month',
  'Vegetariana com anemia ferropriva. Suplementando B12 e ferro.',
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
  :'user_id',
  'Patricia Santos',
  'patricia.santos.demo@email.com',
  '11943210987', '11943210987', 'BR',
  '1986-07-28', 'feminino',
  'Controlar compulsão alimentar noturna',
  'Porto Alegre', 'RS', 'pausa', NOW() - INTERVAL '5 months',
  'Compulsão alimentar noturna. Iniciou terapia. Pausa de 1 mês.',
  ARRAY['compulsao-alimentar', 'obesidade', 'terapia']
);

-- ==========================================
-- CASO 6: Fernanda Lima - Gestante (Ativa)
-- ==========================================
INSERT INTO clients (
  user_id, name, email, phone, whatsapp, phone_country_code,
  birth_date, gender, instagram, goal,
  address_city, address_state, status, client_since,
  notes, tags
) VALUES (
  :'user_id',
  'Fernanda Lima',
  'fernanda.lima.demo@email.com',
  '11932109876', '11932109876', 'BR',
  '1993-02-14', 'feminino', '@fe_maternidade',
  'Gestação saudável: Controlar ganho de peso',
  'Brasília', 'DF', 'ativa', NOW() - INTERVAL '2 months',
  'Gestante 20 semanas. Ganho de peso controlado após intervenção nutricional.',
  ARRAY['gestante', 'ganho-peso-excessivo', 'diabetes-gestacional']
);

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
  :'user_id',
  'Beatriz Souza',
  'beatriz.souza.demo@email.com',
  '11921098765', '11921098765', 'BR',
  '1995-09-30', 'feminino',
  'Emagrecer e melhorar relação com comida',
  'Campinas', 'SP', 'pre_consulta', NOW() - INTERVAL '3 days',
  true, 'quiz-emagrecimento',
  'Lead do quiz. Primeira consulta agendada para próxima semana.',
  ARRAY['lead', 'quiz', 'emagrecimento']
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
    :'user_id',
    'Larissa Rodrigues',
    'larissa.rodrigues.demo@email.com',
    '11910987654', '11910987654', 'BR',
    '1989-12-08', 'feminino', '@lari_vida_saudavel',
    'Emagrecimento: Perder 12kg',
    'Florianópolis', 'SC', 'finalizada', NOW() - INTERVAL '8 months',
    'CASO DE SUCESSO! Perdeu 13kg em 6 meses. Finalizou em outubro/2025.',
    ARRAY['sucesso', 'objetivo-atingido', 'emagrecimento']
  ) RETURNING id, user_id
)
INSERT INTO client_evolution (client_id, user_id, measurement_date, weight, height, notes)
SELECT id, user_id, NOW() - INTERVAL '8 months', 78.0, 1.60, 'Início' FROM new_client
UNION ALL
SELECT id, user_id, NOW() - INTERVAL '4 months', 71.5, 1.60, 'Meio' FROM new_client
UNION ALL
SELECT id, user_id, NOW() - INTERVAL '2 months', 65.0, 1.60, 'META ATINGIDA! 🎉' FROM new_client
UNION ALL
SELECT id, user_id, NOW(), 64.5, 1.60, 'Mantendo peso' FROM new_client;

-- ==========================================
-- VERIFICAÇÃO
-- ==========================================
SELECT 
  '✅ CONTA DEMO POPULADA!' AS status,
  COUNT(*) AS total_clientes,
  COUNT(*) FILTER (WHERE status = 'ativa') AS ativas,
  COUNT(*) FILTER (WHERE status = 'pausa') AS pausadas,
  COUNT(*) FILTER (WHERE status = 'pre_consulta') AS pre_consulta,
  COUNT(*) FILTER (WHERE status = 'finalizada') AS finalizadas
FROM clients
WHERE user_id = :'user_id'
  AND email LIKE '%.demo@email.com';

-- ==========================================
-- LISTAR CLIENTES CRIADAS
-- ==========================================
SELECT 
  name AS nome,
  status,
  CASE 
    WHEN goal LIKE '%Emagrecimento%' THEN '🎯 Emagrecer'
    WHEN goal LIKE '%Hipertrofia%' THEN '💪 Hipertrofia'
    WHEN goal LIKE '%Diabetes%' THEN '🩺 Diabetes'
    WHEN goal LIKE '%Vegetariana%' THEN '🌱 Vegetariana'
    WHEN goal LIKE '%Compulsão%' THEN '🧠 Compulsão'
    WHEN goal LIKE '%Gestação%' THEN '🤰 Gestante'
    ELSE '📋 Outro'
  END AS objetivo,
  EXTRACT(DAY FROM NOW() - client_since) || ' dias' AS tempo_cliente
FROM clients
WHERE user_id = :'user_id'
  AND email LIKE '%.demo@email.com'
ORDER BY client_since DESC;

-- ==========================================
-- FIM - Conta demo pronta! 🎉
-- ==========================================












