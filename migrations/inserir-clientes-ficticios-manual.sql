-- =====================================================
-- INSERIR CLIENTES FICTÍCIOS - VERSÃO MANUAL
-- =====================================================
-- Use este script se o script automático não encontrar seu user_id
-- 
-- INSTRUÇÕES:
-- 1. Primeiro, execute este comando para encontrar seu user_id:
--    SELECT user_id, email, nome_completo FROM user_profiles WHERE perfil = 'nutri';
-- 
-- 2. Copie o user_id e substitua 'SEU_USER_ID_AQUI' abaixo pelo seu user_id
-- 
-- 3. Execute o script completo
-- =====================================================

-- ⚠️ SUBSTITUA 'SEU_USER_ID_AQUI' PELO SEU USER_ID REAL ⚠️
-- Para encontrar seu user_id, execute:
-- SELECT user_id, email, nome_completo FROM user_profiles WHERE perfil = 'nutri';

DO $$
DECLARE
  v_user_id UUID := 'SEU_USER_ID_AQUI'::UUID; -- ⚠️ SUBSTITUA AQUI!
  cliente_maria_id UUID;
  cliente_joao_id UUID;
  cliente_ana_id UUID;
  cliente_carlos_id UUID;
  cliente_fernanda_id UUID;
  cliente_roberto_id UUID;
  avaliacao_maria_id UUID;
BEGIN
  -- Verificar se o user_id foi definido
  IF v_user_id = '00000000-0000-0000-0000-000000000000'::UUID OR v_user_id IS NULL THEN
    RAISE EXCEPTION 'Por favor, substitua SEU_USER_ID_AQUI pelo seu user_id real. Execute: SELECT user_id FROM user_profiles WHERE perfil = ''nutri'';';
  END IF;

  -- Verificar se o usuário existe
  IF NOT EXISTS (SELECT 1 FROM user_profiles WHERE user_id = v_user_id) THEN
    RAISE EXCEPTION 'User ID não encontrado em user_profiles. Verifique se o user_id está correto.';
  END IF;

  RAISE NOTICE 'Usando user_id: %', v_user_id;

  -- =====================================================
  -- 1. INSERIR CLIENTES
  -- =====================================================

  INSERT INTO clients (user_id, name, email, phone, phone_country_code, birth_date, gender, status, goal, instagram, address_city, address_state, converted_from_lead, lead_source, client_since, created_at)
  VALUES (v_user_id, 'Maria Silva Santos', 'maria.silva@email.com', '5511999887766', 'BR', '1990-05-15', 'feminino', 'ativa', 'Perder 15kg e melhorar minha relação com a comida', '@mariassilva', 'São Paulo', 'SP', true, 'quiz-emagrecimento', NOW() - INTERVAL '3 months', NOW() - INTERVAL '3 months')
  RETURNING id INTO cliente_maria_id;

  INSERT INTO clients (user_id, name, email, phone, phone_country_code, birth_date, gender, status, goal, instagram, address_city, address_state, converted_from_lead, lead_source, client_since, created_at)
  VALUES (v_user_id, 'João Pedro Oliveira', 'joao.pedro@email.com', '5511988776655', 'BR', '1988-08-22', 'masculino', 'ativa', 'Ganhar 8kg de massa muscular e melhorar performance no treino', '@joaopedrofit', 'Rio de Janeiro', 'RJ', true, 'link-personalizado', NOW() - INTERVAL '2 months', NOW() - INTERVAL '2 months')
  RETURNING id INTO cliente_joao_id;

  INSERT INTO clients (user_id, name, email, phone, phone_country_code, birth_date, gender, status, goal, address_city, address_state, converted_from_lead, lead_source, client_since, created_at)
  VALUES (v_user_id, 'Ana Carolina Costa', 'ana.carolina@email.com', '5511977665544', 'BR', '1995-03-10', 'feminino', 'pre_consulta', 'Melhorar minha alimentação e ter mais energia no dia a dia', 'Belo Horizonte', 'MG', true, 'quiz-saude', NOW() - INTERVAL '1 week', NOW() - INTERVAL '1 week')
  RETURNING id INTO cliente_ana_id;

  INSERT INTO clients (user_id, name, email, phone, phone_country_code, birth_date, gender, status, goal, address_city, address_state, converted_from_lead, lead_source, created_at)
  VALUES (v_user_id, 'Carlos Eduardo Lima', 'carlos.eduardo@email.com', '5511966554433', 'BR', '1992-11-30', 'masculino', 'lead', 'Quero emagrecer e ter mais disposição', 'Curitiba', 'PR', false, 'calculadora-imc', NOW() - INTERVAL '2 days')
  RETURNING id INTO cliente_carlos_id;

  INSERT INTO clients (user_id, name, email, phone, phone_country_code, birth_date, gender, status, goal, instagram, address_city, address_state, client_since, created_at)
  VALUES (v_user_id, 'Fernanda Alves', 'fernanda.alves@email.com', '5511955443322', 'BR', '1987-07-18', 'feminino', 'pausa', 'Manter o peso e melhorar composição corporal', '@fernandaalves', 'Porto Alegre', 'RS', NOW() - INTERVAL '6 months', NOW() - INTERVAL '6 months')
  RETURNING id INTO cliente_fernanda_id;

  INSERT INTO clients (user_id, name, email, phone, phone_country_code, birth_date, gender, status, goal, address_city, address_state, client_since, created_at)
  VALUES (v_user_id, 'Roberto Santos', 'roberto.santos@email.com', '5511944332211', 'BR', '1985-04-25', 'masculino', 'finalizada', 'Alcançar objetivo de emagrecimento', 'Salvador', 'BA', NOW() - INTERVAL '1 year', NOW() - INTERVAL '1 year')
  RETURNING id INTO cliente_roberto_id;

  -- =====================================================
  -- 2. EVOLUÇÕES
  -- =====================================================

  INSERT INTO client_evolution (client_id, user_id, measurement_date, weight, height, bmi, waist_circumference, hip_circumference, body_fat_percentage, muscle_mass, water_percentage, notes, created_at)
  VALUES (cliente_maria_id, v_user_id, NOW() - INTERVAL '3 months', 78.5, 1.65, 28.8, 95.0, 105.0, 32.5, 45.0, 52.0, 'Primeira avaliação', NOW() - INTERVAL '3 months');

  INSERT INTO client_evolution (client_id, user_id, measurement_date, weight, height, bmi, waist_circumference, hip_circumference, body_fat_percentage, muscle_mass, water_percentage, notes, created_at)
  VALUES (cliente_maria_id, v_user_id, NOW() - INTERVAL '2 months', 75.2, 1.65, 27.6, 92.0, 102.0, 30.2, 46.5, 53.5, 'Boa evolução', NOW() - INTERVAL '2 months');

  INSERT INTO client_evolution (client_id, user_id, measurement_date, weight, height, bmi, waist_circumference, hip_circumference, body_fat_percentage, muscle_mass, water_percentage, notes, created_at)
  VALUES (cliente_maria_id, v_user_id, NOW() - INTERVAL '1 month', 72.8, 1.65, 26.8, 89.0, 99.0, 28.5, 47.8, 54.2, 'Excelente progresso', NOW() - INTERVAL '1 month');

  INSERT INTO client_evolution (client_id, user_id, measurement_date, weight, height, bmi, waist_circumference, hip_circumference, body_fat_percentage, muscle_mass, water_percentage, notes, created_at)
  VALUES (cliente_maria_id, v_user_id, NOW(), 70.5, 1.65, 25.9, 86.0, 96.0, 27.0, 48.5, 55.0, 'Meta quase alcançada', NOW());

  INSERT INTO client_evolution (client_id, user_id, measurement_date, weight, height, bmi, waist_circumference, chest_circumference, arm_circumference, body_fat_percentage, muscle_mass, water_percentage, notes, created_at)
  VALUES (cliente_joao_id, v_user_id, NOW() - INTERVAL '2 months', 68.0, 1.75, 22.2, 78.0, 95.0, 32.0, 15.0, 58.0, 60.0, 'Início', NOW() - INTERVAL '2 months');

  INSERT INTO client_evolution (client_id, user_id, measurement_date, weight, height, bmi, waist_circumference, chest_circumference, arm_circumference, body_fat_percentage, muscle_mass, water_percentage, notes, created_at)
  VALUES (cliente_joao_id, v_user_id, NOW(), 72.5, 1.75, 23.7, 80.0, 98.0, 34.5, 16.5, 60.5, 61.0, 'Ganho de massa', NOW());

  -- =====================================================
  -- 3. CONSULTAS
  -- =====================================================

  INSERT INTO appointments (client_id, user_id, title, description, appointment_type, start_time, end_time, duration_minutes, location_type, location_url, status, completed_at, notes, created_at)
  VALUES (cliente_maria_id, v_user_id, 'Primeira Consulta', 'Consulta inicial', 'consulta', NOW() - INTERVAL '3 months', NOW() - INTERVAL '3 months' + INTERVAL '1 hour', 60, 'online', 'https://meet.google.com/abc', 'concluido', NOW() - INTERVAL '3 months' + INTERVAL '1 hour', 'Cliente motivada', NOW() - INTERVAL '3 months');

  INSERT INTO appointments (client_id, user_id, title, description, appointment_type, start_time, end_time, duration_minutes, location_type, location_url, status, created_at)
  VALUES (cliente_maria_id, v_user_id, 'Retorno', 'Acompanhamento', 'retorno', NOW() + INTERVAL '1 week', NOW() + INTERVAL '1 week' + INTERVAL '30 minutes', 30, 'online', 'https://meet.google.com/xyz', 'agendado', NOW());

  INSERT INTO appointments (client_id, user_id, title, appointment_type, start_time, end_time, duration_minutes, location_type, status, completed_at, created_at)
  VALUES (cliente_joao_id, v_user_id, 'Avaliação', 'avaliacao', NOW() - INTERVAL '2 months', NOW() - INTERVAL '2 months' + INTERVAL '1 hour', 60, 'presencial', 'concluido', NOW() - INTERVAL '2 months' + INTERVAL '1 hour', NOW() - INTERVAL '2 months');

  INSERT INTO appointments (client_id, user_id, title, appointment_type, start_time, end_time, duration_minutes, location_type, status, created_at)
  VALUES (cliente_joao_id, v_user_id, 'Retorno', 'retorno', NOW() + INTERVAL '3 days', NOW() + INTERVAL '3 days' + INTERVAL '30 minutes', 30, 'online', 'confirmado', NOW());

  INSERT INTO appointments (client_id, user_id, title, appointment_type, start_time, end_time, duration_minutes, location_type, status, created_at)
  VALUES (cliente_ana_id, v_user_id, 'Primeira Consulta', 'consulta', NOW() + INTERVAL '5 days', NOW() + INTERVAL '5 days' + INTERVAL '1 hour', 60, 'online', 'agendado', NOW());

  -- =====================================================
  -- 4. REGISTROS EMOCIONAIS/COMPORTAMENTAIS
  -- =====================================================

  INSERT INTO emotional_behavioral_history (client_id, user_id, record_date, record_type, emotional_state, stress_level, mood_score, sleep_quality, energy_level, adherence_score, meal_following_percentage, exercise_frequency, water_intake_liters, patterns_identified, triggers, notes, created_at)
  VALUES (cliente_maria_id, v_user_id, NOW() - INTERVAL '2 months', 'ambos', 'motivado', 3, 8, 'bom', 'alta', 9, 95.0, '3x por semana', 2.5, ARRAY['come por ansiedade'], ARRAY['trabalho'], 'Muito motivada', NOW() - INTERVAL '2 months');

  INSERT INTO emotional_behavioral_history (client_id, user_id, record_date, record_type, emotional_state, stress_level, mood_score, sleep_quality, energy_level, adherence_score, meal_following_percentage, exercise_frequency, water_intake_liters, patterns_identified, notes, created_at)
  VALUES (cliente_maria_id, v_user_id, NOW() - INTERVAL '1 month', 'ambos', 'equilibrado', 4, 7, 'otimo', 'alta', 8, 90.0, '4x por semana', 2.8, ARRAY['melhorou relação com comida'], 'Evolução constante', NOW() - INTERVAL '1 month');

  INSERT INTO emotional_behavioral_history (client_id, user_id, record_date, record_type, emotional_state, stress_level, mood_score, sleep_quality, energy_level, adherence_score, meal_following_percentage, exercise_frequency, water_intake_liters, notes, created_at)
  VALUES (cliente_maria_id, v_user_id, NOW(), 'ambos', 'motivado', 2, 9, 'otimo', 'alta', 10, 98.0, '5x por semana', 3.0, 'Excelente adesão', NOW());

  INSERT INTO emotional_behavioral_history (client_id, user_id, record_date, record_type, emotional_state, stress_level, mood_score, adherence_score, meal_following_percentage, exercise_frequency, water_intake_liters, notes, created_at)
  VALUES (cliente_joao_id, v_user_id, NOW(), 'comportamental', 'motivado', 3, 8, 9, 92.0, '6x por semana', 3.5, 'Treinando pesado', NOW());

  -- =====================================================
  -- 5. AVALIAÇÕES
  -- =====================================================

  INSERT INTO assessments (client_id, user_id, assessment_type, assessment_name, is_reevaluation, assessment_number, data, status, completed_at, created_at)
  VALUES (cliente_maria_id, v_user_id, 'antropometrica', 'Avaliação Inicial', false, 1, jsonb_build_object('weight', 78.5, 'height', 1.65, 'bmi', 28.8, 'waist_circumference', 95.0, 'hip_circumference', 105.0, 'body_fat_percentage', 32.5, 'muscle_mass', 45.0, 'water_percentage', 52.0), 'completo', NOW() - INTERVAL '3 months', NOW() - INTERVAL '3 months')
  RETURNING id INTO avaliacao_maria_id;

  INSERT INTO assessments (client_id, user_id, assessment_type, assessment_name, is_reevaluation, parent_assessment_id, assessment_number, data, status, completed_at, created_at)
  VALUES (cliente_maria_id, v_user_id, 'antropometrica', '1ª Reavaliação', true, avaliacao_maria_id, 2, jsonb_build_object('weight', 72.8, 'height', 1.65, 'bmi', 26.8, 'waist_circumference', 89.0, 'hip_circumference', 99.0, 'body_fat_percentage', 28.5, 'muscle_mass', 47.8, 'water_percentage', 54.2), 'completo', NOW() - INTERVAL '1 month', NOW() - INTERVAL '1 month');

  -- =====================================================
  -- 6. HISTÓRICO
  -- =====================================================

  INSERT INTO client_history (client_id, user_id, activity_type, title, description, created_at)
  VALUES (cliente_maria_id, v_user_id, 'cliente_criado', 'Cliente criada', 'Convertida de lead', NOW() - INTERVAL '3 months');

  INSERT INTO client_history (client_id, user_id, activity_type, title, description, created_at)
  VALUES (cliente_maria_id, v_user_id, 'consulta', 'Primeira consulta', 'Consulta inicial', NOW() - INTERVAL '3 months');

  INSERT INTO client_history (client_id, user_id, activity_type, title, description, created_at)
  VALUES (cliente_maria_id, v_user_id, 'evolucao_registrada', 'Registro de evolução', 'Primeira medição', NOW() - INTERVAL '3 months');

  RAISE NOTICE '✅ Dados fictícios inseridos com sucesso!';
  RAISE NOTICE 'Clientes: 6 | Evoluções: 6 | Consultas: 5 | Registros: 4 | Avaliações: 2';

END $$;

-- Verificação
SELECT 'Clientes criados:' as info, COUNT(*) as total 
FROM clients 
WHERE name IN ('Maria Silva Santos', 'João Pedro Oliveira', 'Ana Carolina Costa', 'Carlos Eduardo Lima', 'Fernanda Alves', 'Roberto Santos');

