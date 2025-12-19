-- ==========================================
-- POPULAR CONTA DEMO - Casos de Teste
-- ==========================================
-- Data: 2025-12-18
-- Objetivo: Criar clientes fictícias com casos variados
-- Para: Testes, demonstrações e análise do sistema
-- ==========================================

-- ==========================================
-- IMPORTANTE: Configure o USER_ID
-- ==========================================
-- Opção 1: Se souber o user_id da conta demo, substitua abaixo:
-- \set demo_user_id 'COLE-O-UUID-AQUI'

-- Opção 2: Use o user_id do usuário logado atualmente:
DO $$ 
DECLARE
  demo_user_id UUID;
BEGIN
  -- Pega o primeiro usuário (ou você pode especificar o email)
  SELECT id INTO demo_user_id 
  FROM auth.users 
  WHERE email LIKE '%demo%' OR email LIKE '%test%'
  LIMIT 1;
  
  -- Se não encontrar conta demo, usa o primeiro usuário
  IF demo_user_id IS NULL THEN
    SELECT id INTO demo_user_id FROM auth.users LIMIT 1;
  END IF;

  RAISE NOTICE 'Usando user_id: %', demo_user_id;

-- ==========================================
-- CASO 1: Ana Silva - Emagrecimento (Ativa)
-- ==========================================
-- Perfil: 32 anos, objetivo emagrecimento, muito motivada
-- Status: Cliente ativa há 2 meses, boa evolução

INSERT INTO clients (
  user_id, name, email, phone, whatsapp, phone_country_code,
  birth_date, gender, instagram, goal,
  address_city, address_state,
  status, client_since,
  notes, tags
) VALUES (
  demo_user_id,
  'Ana Silva',
  'ana.silva@email.com',
  '11987654321',
  '11987654321',
  'BR',
  '1992-03-15',
  'feminino',
  '@ana_saude',
  'Emagrecimento: Perder 10kg para o casamento em 6 meses',
  'São Paulo',
  'SP',
  'ativa',
  NOW() - INTERVAL '2 months',
  'Cliente muito comprometida, segue bem o plano. Casamento em abril/2026.',
  ARRAY['emagrecimento', 'evento-importante', 'alta-adesao']
) RETURNING id INTO @ana_id;

-- Evolução física - Ana (3 medições)
INSERT INTO client_evolution (client_id, user_id, measurement_date, weight, height, bmi, waist_circumference, hip_circumference, body_fat_percentage, notes)
VALUES 
  -- Avaliação inicial
  (currval('clients_id_seq'), demo_user_id, NOW() - INTERVAL '2 months', 78.5, 1.65, 28.83, 88, 108, 35.2, 'Avaliação inicial - Objetivo: 68kg'),
  -- 1 mês depois
  (currval('clients_id_seq'), demo_user_id, NOW() - INTERVAL '1 month', 75.2, 1.65, 27.61, 85, 105, 33.8, 'Ótima evolução! -3.3kg'),
  -- Hoje
  (currval('clients_id_seq'), demo_user_id, NOW(), 72.8, 1.65, 26.74, 82, 102, 32.1, 'Continua bem! -5.7kg total. Faltam 4.8kg para meta.');

-- Histórico emocional - Ana
INSERT INTO emotional_behavioral_history (
  client_id, user_id, record_date, record_type,
  story, moment_of_change, commitment,
  emotional_state, stress_level, mood_score, sleep_quality, energy_level,
  adherence_score, meal_following_percentage, water_intake_liters,
  patterns_identified, triggers, notes
) VALUES (
  currval('clients_id_seq'), demo_user_id, NOW() - INTERVAL '2 months', 'ambos',
  'Sempre foi magra, ganhou peso após pandemia. Trabalha home office e começou a comer mais por ansiedade.',
  'Noivado - quer estar bem para o casamento',
  9,
  'motivado', 3, 9, 'bom', 'alta',
  9, 85.5, 2.5,
  ARRAY['come bem durante semana', 'desliza fim de semana', 'treina 5x/semana'],
  ARRAY['fim de semana', 'eventos sociais'],
  'Cliente exemplar. Muito disciplinada e comprometida com resultado.'
);

-- Programa atual - Ana
INSERT INTO programs (
  client_id, user_id, name, description, program_type, stage, weekly_goal,
  start_date, status, content, adherence_percentage
) VALUES (
  currval('clients_id_seq'), demo_user_id,
  'Plano Emagrecimento Saudável',
  'Plano alimentar para perda de peso gradual e sustentável',
  'plano_alimentar',
  'progressao',
  'Manter dieta 90% + treinar 5x + 2.5L água/dia',
  NOW() - INTERVAL '2 months',
  'ativo',
  '{"calorias": 1600, "proteinas": 120, "carboidratos": 140, "gorduras": 50}',
  87.5
);

-- ==========================================
-- CASO 2: Mariana Costa - Ganho de Massa (Ativa)
-- ==========================================
-- Perfil: 28 anos, atleta, quer hipertrofia
-- Status: Cliente ativa há 4 meses

INSERT INTO clients (
  user_id, name, email, phone, whatsapp, phone_country_code,
  birth_date, gender, instagram, goal,
  address_city, address_state,
  status, client_since,
  notes, tags
) VALUES (
  demo_user_id,
  'Mariana Costa',
  'mari.costa@email.com',
  '11976543210',
  '11976543210',
  'BR',
  '1996-08-22',
  'feminino',
  '@mari_fitness',
  'Hipertrofia: Ganhar 5kg de massa muscular',
  'Rio de Janeiro',
  'RJ',
  'ativa',
  NOW() - INTERVAL '4 months',
  'Atleta amadora, treina musculação 6x/semana. Competirá em campeonato.',
  ARRAY['hipertrofia', 'atleta', 'musculacao']
);

-- Evolução física - Mariana
INSERT INTO client_evolution (client_id, user_id, measurement_date, weight, height, bmi, body_fat_percentage, muscle_mass, notes)
VALUES 
  (currval('clients_id_seq'), demo_user_id, NOW() - INTERVAL '4 months', 58.2, 1.68, 20.63, 18.5, 44.2, 'Avaliação inicial - Muito magra'),
  (currval('clients_id_seq'), demo_user_id, NOW() - INTERVAL '2 months', 60.1, 1.68, 21.31, 17.8, 46.5, 'Ganhando massa limpa!'),
  (currval('clients_id_seq'), demo_user_id, NOW(), 62.3, 1.68, 22.09, 18.2, 48.1, 'Excelente! +4.1kg, sendo 3.9kg de massa magra.');

-- Histórico emocional - Mariana
INSERT INTO emotional_behavioral_history (
  client_id, user_id, record_date, record_type,
  story, moment_of_change, commitment,
  emotional_state, stress_level, mood_score, sleep_quality, energy_level,
  adherence_score, meal_following_percentage, water_intake_liters,
  patterns_identified, notes
) VALUES (
  currval('clients_id_seq'), demo_user_id, NOW() - INTERVAL '4 months', 'ambos',
  'Sempre foi muito magra e tinha dificuldade para ganhar peso. Treina há 3 anos mas não conseguia hipertrofiar.',
  'Descobriu que comia pouco. Agora quer competir em campeonato de fisiculturismo.',
  10,
  'motivado', 4, 9, 'otimo', 'alta',
  10, 98.0, 3.5,
  ARRAY['disciplina extrema', 'não pula refeições', 'dorme 8h/dia'],
  'Cliente exemplar. Adesão de praticamente 100%.'
);

-- Programa - Mariana
INSERT INTO programs (
  client_id, user_id, name, program_type, stage, weekly_goal,
  start_date, status, content, adherence_percentage
) VALUES (
  currval('clients_id_seq'), demo_user_id,
  'Protocolo Hipertrofia Avançada',
  'plano_alimentar',
  'progressao',
  'Superávit de 300kcal + 2g proteína/kg + treino 6x',
  NOW() - INTERVAL '4 months',
  'ativo',
  '{"calorias": 2400, "proteinas": 140, "carboidratos": 280, "gorduras": 70}',
  98.0
);

-- ==========================================
-- CASO 3: Julia Mendes - Diabetes (Ativa)
-- ==========================================
-- Perfil: 45 anos, diabetes tipo 2, precisa controlar glicemia
-- Status: Cliente ativa há 3 meses

INSERT INTO clients (
  user_id, name, email, phone, whatsapp, phone_country_code,
  birth_date, gender, instagram, goal,
  address_city, address_state,
  status, client_since,
  notes, tags
) VALUES (
  demo_user_id,
  'Júlia Mendes',
  'julia.mendes@email.com',
  '11965432109',
  '11965432109',
  'BR',
  '1979-11-03',
  'feminino',
  '@julia_saude',
  'Controle de Diabetes: Reduzir glicemia e perder 8kg',
  'Belo Horizonte',
  'MG',
  'ativa',
  NOW() - INTERVAL '3 months',
  'Diagnóstico de diabetes tipo 2 há 6 meses. Medicada. Quer reverter quadro.',
  ARRAY['diabetes', 'emagrecimento', 'cronico']
);

-- Evolução física - Julia
INSERT INTO client_evolution (client_id, user_id, measurement_date, weight, height, bmi, waist_circumference, notes)
VALUES 
  (currval('clients_id_seq'), demo_user_id, NOW() - INTERVAL '3 months', 82.5, 1.60, 32.23, 95, 'Avaliação inicial - Glicemia em jejum: 145mg/dL'),
  (currval('clients_id_seq'), demo_user_id, NOW() - INTERVAL '1.5 months', 79.8, 1.60, 31.17, 92, 'Glicemia melhorando: 128mg/dL'),
  (currval('clients_id_seq'), demo_user_id, NOW(), 77.2, 1.60, 30.16, 89, 'Ótimo! Glicemia em jejum: 108mg/dL. Médico reduziu medicação.');

-- Histórico emocional - Julia
INSERT INTO emotional_behavioral_history (
  client_id, user_id, record_date, record_type,
  story, moment_of_change, commitment,
  emotional_state, stress_level, mood_score, sleep_quality, energy_level,
  adherence_score, meal_following_percentage, water_intake_liters,
  patterns_identified, triggers, notes
) VALUES (
  currval('clients_id_seq'), demo_user_id, NOW() - INTERVAL '3 months', 'ambos',
  'Descobriu diabetes após exames de rotina. Ficou assustada mas decidiu mudar de vida.',
  'Susto do diagnóstico - não quer depender de remédios para sempre',
  8,
  'ansioso', 6, 7, 'regular', 'media',
  8, 80.0, 2.0,
  ARRAY['dificuldade com doces', 'carboidratos simples', 'come melhor quando cozinha em casa'],
  ARRAY['estresse no trabalho', 'vontade de doce à noite'],
  'Evoluindo bem. Precisa trabalhar ansiedade e compulsão por doces.'
);

-- Programa - Julia
INSERT INTO programs (
  client_id, user_id, name, program_type, stage, weekly_goal,
  start_date, status, content, adherence_percentage
) VALUES (
  currval('clients_id_seq'), demo_user_id,
  'Protocolo Diabetes - Baixo IG',
  'plano_alimentar',
  'adaptacao',
  'Evitar açúcares + carboidratos baixo IG + medir glicemia 3x/dia',
  NOW() - INTERVAL '3 months',
  'ativo',
  '{"calorias": 1500, "proteinas": 90, "carboidratos": 120, "gorduras": 55, "fibras": 30}',
  80.0
);

-- ==========================================
-- CASO 4: Camila Oliveira - Vegetariana (Ativa)
-- ==========================================
-- Perfil: 26 anos, vegetariana há 2 anos, anemia
-- Status: Cliente ativa há 1 mês

INSERT INTO clients (
  user_id, name, email, phone, whatsapp, phone_country_code,
  birth_date, gender, instagram, goal,
  address_city, address_state,
  status, client_since,
  notes, tags
) VALUES (
  demo_user_id,
  'Camila Oliveira',
  'camila.oliveira@email.com',
  '11954321098',
  '11954321098',
  'BR',
  '1998-05-17',
  'feminino',
  '@camiveg',
  'Melhorar nutrição vegetariana: Corrigir anemia e ganhar energia',
  'Curitiba',
  'PR',
  'ativa',
  NOW() - INTERVAL '1 month',
  'Vegetariana estrita. Exames mostraram anemia ferropriva e B12 baixa.',
  ARRAY['vegetariana', 'anemia', 'deficiencia-nutricional']
);

-- Evolução física - Camila
INSERT INTO client_evolution (client_id, user_id, measurement_date, weight, height, bmi, notes)
VALUES 
  (currval('clients_id_seq'), demo_user_id, NOW() - INTERVAL '1 month', 55.3, 1.65, 20.32, 'Avaliação inicial - Muito cansada, ferritina 12ng/mL'),
  (currval('clients_id_seq'), demo_user_id, NOW(), 56.1, 1.65, 20.61, 'Ganhando peso de forma saudável. Mais energia.');

-- Histórico emocional - Camila
INSERT INTO emotional_behavioral_history (
  client_id, user_id, record_date, record_type,
  story, moment_of_change, commitment,
  emotional_state, stress_level, mood_score, sleep_quality, energy_level,
  adherence_score, meal_following_percentage, water_intake_liters,
  patterns_identified, notes
) VALUES (
  currval('clients_id_seq'), demo_user_id, NOW() - INTERVAL '1 month', 'ambos',
  'Virou vegetariana por questões éticas mas não se educou nutricionalmente. Começou a sentir muito cansaço.',
  'Exames mostrando anemia grave - percebeu que precisava de ajuda profissional',
  8,
  'preocupado', 5, 6, 'ruim', 'baixa',
  8, 75.0, 2.0,
  ARRAY['come muitos carboidratos', 'pouca proteína', 'não gosta de leguminosas'],
  'Aprendendo a balancear alimentação vegetariana. Suplementando B12 e ferro.'
);

-- Programa - Camila
INSERT INTO programs (
  client_id, user_id, name, program_type, stage, weekly_goal,
  start_date, status, content, adherence_percentage
) VALUES (
  currval('clients_id_seq'), demo_user_id,
  'Plano Vegetariano Balanceado',
  'plano_alimentar',
  'adaptacao',
  'Proteínas vegetais em todas refeições + suplementação + vitamina C com ferro',
  NOW() - INTERVAL '1 month',
  'ativo',
  '{"calorias": 1800, "proteinas": 75, "carboidratos": 200, "gorduras": 60, "ferro_mg": 18}',
  75.0
);

-- ==========================================
-- CASO 5: Patricia Santos - Compulsão Alimentar (Pausa)
-- ==========================================
-- Perfil: 38 anos, compulsão alimentar noturna, obesidade grau 1
-- Status: Em pausa (pediu 1 mês para resolver questões emocionais)

INSERT INTO clients (
  user_id, name, email, phone, whatsapp, phone_country_code,
  birth_date, gender, goal,
  address_city, address_state,
  status, client_since,
  notes, tags
) VALUES (
  demo_user_id,
  'Patricia Santos',
  'patricia.santos@email.com',
  '11943210987',
  '11943210987',
  'BR',
  '1986-07-28',
  'feminino',
  'Controlar compulsão alimentar e emagrecer 15kg',
  'Porto Alegre',
  'RS',
  'pausa',
  NOW() - INTERVAL '5 months',
  'Cliente com histórico de compulsão alimentar noturna. Iniciou terapia. Pediu pausa de 1 mês.',
  ARRAY['compulsao-alimentar', 'obesidade', 'acompanhamento-psicologico']
);

-- Evolução física - Patricia (antes da pausa)
INSERT INTO client_evolution (client_id, user_id, measurement_date, weight, height, bmi, notes)
VALUES 
  (currval('clients_id_seq'), demo_user_id, NOW() - INTERVAL '5 months', 92.5, 1.63, 34.81, 'Avaliação inicial - Obesidade grau 1'),
  (currval('clients_id_seq'), demo_user_id, NOW() - INTERVAL '3 months', 89.2, 1.63, 33.57, 'Evolução boa mas com altos e baixos'),
  (currval('clients_id_seq'), demo_user_id, NOW() - INTERVAL '1 month', 87.8, 1.63, 33.05, 'Pediu pausa. Iniciando terapia.');

-- Histórico emocional - Patricia
INSERT INTO emotional_behavioral_history (
  client_id, user_id, record_date, record_type,
  story, moment_of_change, commitment,
  emotional_state, stress_level, mood_score, sleep_quality, energy_level,
  adherence_score, meal_following_percentage, water_intake_liters,
  patterns_identified, triggers, notes
) VALUES (
  currval('clients_id_seq'), demo_user_id, NOW() - INTERVAL '5 months', 'ambos',
  'Compulsão alimentar desde adolescência. Come muito à noite, especialmente doces. Tentou várias dietas restritivas que nunca funcionaram.',
  'Percebeu que a questão é mais emocional do que nutricional',
  7,
  'ansioso', 8, 5, 'ruim', 'baixa',
  6, 60.0, 1.5,
  ARRAY['come muito à noite', 'come escondido', 'ciclo dieta-compulsão'],
  ARRAY['estresse', 'solidão', 'noite', 'ansiedade'],
  'Caso complexo. Necessita trabalho conjunto: nutri + psicólogo. Cliente está trabalhando questões emocionais.'
);

-- Programa - Patricia (pausado)
INSERT INTO programs (
  client_id, user_id, name, program_type, stage, weekly_goal,
  start_date, end_date, status, content, adherence_percentage
) VALUES (
  currval('clients_id_seq'), demo_user_id,
  'Protocolo Compulsão Alimentar',
  'plano_alimentar',
  'adaptacao',
  'Sem restrições rígidas + diário alimentar + terapia semanal',
  NOW() - INTERVAL '5 months',
  NOW() - INTERVAL '1 month',
  'pausado',
  '{"calorias": 1700, "proteinas": 85, "carboidratos": 180, "gorduras": 60, "observacao": "Foco em nutrição comportamental"}',
  60.0
);

-- ==========================================
-- CASO 6: Fernanda Lima - Gestante (Ativa)
-- ==========================================
-- Perfil: 31 anos, gestante (2º trimestre), ganho de peso excessivo
-- Status: Cliente ativa há 2 meses

INSERT INTO clients (
  user_id, name, email, phone, whatsapp, phone_country_code,
  birth_date, gender, instagram, goal,
  address_city, address_state,
  status, client_since,
  notes, tags
) VALUES (
  demo_user_id,
  'Fernanda Lima',
  'fernanda.lima@email.com',
  '11932109876',
  '11932109876',
  'BR',
  '1993-02-14',
  'feminino',
  '@fe_maternidade',
  'Gestação saudável: Controlar ganho de peso e prevenir diabetes gestacional',
  'Brasília',
  'DF',
  'ativa',
  NOW() - INTERVAL '2 months',
  'Primeira gestação. 20 semanas. Ganhou 12kg (acima do recomendado). Obstetra solicitou acompanhamento.',
  ARRAY['gestante', 'ganho-peso-excessivo', 'prevencao-diabetes-gestacional']
);

-- Evolução física - Fernanda
INSERT INTO client_evolution (client_id, user_id, measurement_date, weight, height, bmi, notes)
VALUES 
  (currval('clients_id_seq'), demo_user_id, NOW() - INTERVAL '2 months', 70.5, 1.68, 24.97, 'Peso pré-gestacional: 62kg. 18 semanas. Ganhou 8.5kg até aqui.'),
  (currval('clients_id_seq'), demo_user_id, NOW() - INTERVAL '1 month', 73.2, 1.68, 25.95, '19 semanas. +11.2kg. Médico alertou sobre ganho rápido.'),
  (currval('clients_id_seq'), demo_user_id, NOW(), 74.8, 1.68, 26.51, '20 semanas. +12.8kg. Ganho controlando. Glicemia normal.');

-- Histórico emocional - Fernanda
INSERT INTO emotional_behavioral_history (
  client_id, user_id, record_date, record_type,
  story, moment_of_change, commitment,
  emotional_state, stress_level, mood_score, sleep_quality, energy_level,
  adherence_score, meal_following_percentage, water_intake_liters,
  patterns_identified, notes
) VALUES (
  currval('clients_id_seq'), demo_user_id, NOW() - INTERVAL '2 months', 'ambos',
  'Primeira gravidez. Acreditava que deveria "comer por dois". Ganhou peso muito rápido no primeiro trimestre.',
  'Médico alertou sobre risco de diabetes gestacional e complicações',
  9,
  'ansioso', 5, 8, 'regular', 'media',
  9, 85.0, 2.5,
  ARRAY['come bem durante dia', 'vontades à noite', 'dificuldade com enjoos matinais'],
  ARRAY['vontades intensas', 'medo de prejudicar bebê'],
  'Muito preocupada com saúde do bebê. Aderindo bem ao plano. Fazendo pré-natal corretamente.'
);

-- Programa - Fernanda
INSERT INTO programs (
  client_id, user_id, name, program_type, stage, weekly_goal,
  start_date, status, content, adherence_percentage
) VALUES (
  currval('clients_id_seq'), demo_user_id,
  'Protocolo Gestacional - 2º Trimestre',
  'plano_alimentar',
  'manutencao',
  'Ganho máximo 500g/semana + alimentos ricos em ferro e ácido fólico',
  NOW() - INTERVAL '2 months',
  'ativo',
  '{"calorias": 2200, "proteinas": 100, "carboidratos": 250, "gorduras": 70, "calcio_mg": 1000, "ferro_mg": 27}',
  85.0
);

-- ==========================================
-- CASO 7: Beatriz Souza - Pré-Consulta (Lead)
-- ==========================================
-- Perfil: 29 anos, agendou primeira consulta
-- Status: Pré-consulta (ainda não é cliente ativa)

INSERT INTO clients (
  user_id, name, email, phone, whatsapp, phone_country_code,
  birth_date, gender, goal,
  address_city, address_state,
  status, client_since,
  converted_from_lead, lead_source,
  notes, tags
) VALUES (
  demo_user_id,
  'Beatriz Souza',
  'beatriz.souza@email.com',
  '11921098765',
  '11921098765',
  'BR',
  '1995-09-30',
  'feminino',
  'Emagrecer e melhorar relação com comida',
  'Campinas',
  'SP',
  'pre_consulta',
  NOW() - INTERVAL '3 days',
  true,
  'quiz-emagrecimento',
  'Veio do quiz de emagrecimento. Primeira consulta agendada para próxima semana.',
  ARRAY['lead', 'quiz', 'emagrecimento']
);

-- ==========================================
-- CASO 8: Larissa Rodrigues - Finalizada
-- ==========================================
-- Perfil: 35 anos, atingiu objetivo
-- Status: Finalizada (atingiu meta e encerrou acompanhamento)

INSERT INTO clients (
  user_id, name, email, phone, whatsapp, phone_country_code,
  birth_date, gender, instagram, goal,
  address_city, address_state,
  status, client_since,
  notes, tags
) VALUES (
  demo_user_id,
  'Larissa Rodrigues',
  'larissa.rodrigues@email.com',
  '11910987654',
  '11910987654',
  'BR',
  '1989-12-08',
  'feminino',
  '@lari_vida_saudavel',
  'Emagrecimento: Perder 12kg',
  'Florianópolis',
  'SC',
  'finalizada',
  NOW() - INTERVAL '8 months',
  'Cliente que atingiu objetivo! Perdeu 13kg em 6 meses. Finalizou acompanhamento em outubro/2025.',
  ARRAY['sucesso', 'objetivo-atingido', 'emagrecimento']
);

-- Evolução física - Larissa (caso de sucesso)
INSERT INTO client_evolution (client_id, user_id, measurement_date, weight, height, bmi, notes)
VALUES 
  (currval('clients_id_seq'), demo_user_id, NOW() - INTERVAL '8 months', 78.0, 1.60, 30.47, 'Início: Obesidade grau 1'),
  (currval('clients_id_seq'), demo_user_id, NOW() - INTERVAL '4 months', 71.5, 1.60, 27.93, 'Meio do processo'),
  (currval('clients_id_seq'), demo_user_id, NOW() - INTERVAL '2 months', 65.0, 1.60, 25.39, 'META ATINGIDA! 🎉 Passou para fase manutenção.'),
  (currval('clients_id_seq'), demo_user_id, NOW() - INTERVAL '1 week', 64.5, 1.60, 25.20, 'Mantendo peso. Finalizou acompanhamento.');

-- ==========================================
-- RESUMO FINAL
-- ==========================================

  RAISE NOTICE '========================================';
  RAISE NOTICE '✅ CONTA DEMO POPULADA COM SUCESSO!';
  RAISE NOTICE '========================================';
  RAISE NOTICE '';
  RAISE NOTICE '📊 CASOS CRIADOS:';
  RAISE NOTICE '';
  RAISE NOTICE '1. Ana Silva - Emagrecimento (ATIVA)';
  RAISE NOTICE '   → Objetivo: Casamento, -10kg';
  RAISE NOTICE '   → Evolução: -5.7kg em 2 meses';
  RAISE NOTICE '';
  RAISE NOTICE '2. Mariana Costa - Hipertrofia (ATIVA)';
  RAISE NOTICE '   → Objetivo: Ganhar massa muscular';
  RAISE NOTICE '   → Evolução: +4.1kg em 4 meses';
  RAISE NOTICE '';
  RAISE NOTICE '3. Júlia Mendes - Diabetes (ATIVA)';
  RAISE NOTICE '   → Objetivo: Controlar glicemia';
  RAISE NOTICE '   → Evolução: Glicemia 145→108mg/dL';
  RAISE NOTICE '';
  RAISE NOTICE '4. Camila Oliveira - Vegetariana (ATIVA)';
  RAISE NOTICE '   → Objetivo: Corrigir anemia';
  RAISE NOTICE '   → Status: Adaptação à dieta balanceada';
  RAISE NOTICE '';
  RAISE NOTICE '5. Patricia Santos - Compulsão (PAUSA)';
  RAISE NOTICE '   → Objetivo: Controlar compulsão';
  RAISE NOTICE '   → Status: Em terapia, pausou 1 mês';
  RAISE NOTICE '';
  RAISE NOTICE '6. Fernanda Lima - Gestante (ATIVA)';
  RAISE NOTICE '   → Objetivo: Gestação saudável';
  RAISE NOTICE '   → Status: 20 semanas, controlando peso';
  RAISE NOTICE '';
  RAISE NOTICE '7. Beatriz Souza - Lead (PRÉ-CONSULTA)';
  RAISE NOTICE '   → Status: Primeira consulta agendada';
  RAISE NOTICE '';
  RAISE NOTICE '8. Larissa Rodrigues - Sucesso (FINALIZADA)';
  RAISE NOTICE '   → Objetivo ATINGIDO: -13kg em 6 meses';
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE '🎯 Agora você tem casos diversos para:';
  RAISE NOTICE '   ✓ Testar interfaces';
  RAISE NOTICE '   ✓ Demonstrar sistema';
  RAISE NOTICE '   ✓ Analisar diferentes perfis';
  RAISE NOTICE '   ✓ Treinar uso da plataforma';
  RAISE NOTICE '========================================';

END $$;

-- ==========================================
-- FIM DO SCRIPT
-- ==========================================

