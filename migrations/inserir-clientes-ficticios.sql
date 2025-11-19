-- =====================================================
-- INSERIR CLIENTES FICTÍCIOS PARA TESTE
-- =====================================================
-- Este script insere clientes fictícios com dados variados
-- para testar a interface do módulo de Gestão
-- Execute no Supabase SQL Editor
-- =====================================================

-- IMPORTANTE: Este script usa o primeiro usuário encontrado na tabela users
-- Se você quiser usar um usuário específico, substitua todas as ocorrências de
-- (SELECT id FROM users ORDER BY created_at LIMIT 1)
-- por seu user_id específico

-- =====================================================
-- 1. INSERIR CLIENTES FICTÍCIOS
-- =====================================================

DO $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Obter o user_id do primeiro usuário (ou você pode especificar um email)
  SELECT id INTO v_user_id 
  FROM users 
  ORDER BY created_at 
  LIMIT 1;
  
  -- Verificar se encontrou um usuário
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Nenhum usuário encontrado na tabela users. Crie um usuário primeiro.';
  END IF;

  -- Cliente 1: Ativa - Emagrecimento
  INSERT INTO clients (
    user_id,
    name,
    email,
    phone,
    phone_country_code,
    birth_date,
    gender,
    status,
    goal,
    instagram,
    address_city,
    address_state,
    converted_from_lead,
    lead_source,
    client_since,
    created_at
  ) VALUES (
    v_user_id,
  'Maria Silva Santos',
  'maria.silva@email.com',
  '5511999887766',
  'BR',
  '1990-05-15',
  'feminino',
  'ativa',
  'Perder 15kg e melhorar minha relação com a comida',
  '@mariassilva',
  'São Paulo',
  'SP',
  true,
  'quiz-emagrecimento',
  NOW() - INTERVAL '3 months',
  NOW() - INTERVAL '3 months'
) RETURNING id;

  -- Cliente 2: Ativa - Ganho de Massa
  INSERT INTO clients (
    user_id,
    name,
    email,
    phone,
    phone_country_code,
    birth_date,
    gender,
    status,
    goal,
    instagram,
    address_city,
    address_state,
    converted_from_lead,
    lead_source,
    client_since,
    created_at
  ) VALUES (
    v_user_id,
  'João Pedro Oliveira',
  'joao.pedro@email.com',
  '5511988776655',
  'BR',
  '1988-08-22',
  'masculino',
  'ativa',
  'Ganhar 8kg de massa muscular e melhorar performance no treino',
  '@joaopedrofit',
  'Rio de Janeiro',
  'RJ',
  true,
  'link-personalizado',
  NOW() - INTERVAL '2 months',
  NOW() - INTERVAL '2 months'
) RETURNING id;

  -- Cliente 3: Pré-Consulta
  INSERT INTO clients (
    user_id,
    name,
    email,
    phone,
    phone_country_code,
    birth_date,
    gender,
    status,
    goal,
    address_city,
    address_state,
    converted_from_lead,
    lead_source,
    client_since,
    created_at
  ) VALUES (
    v_user_id,
  'Ana Carolina Costa',
  'ana.carolina@email.com',
  '5511977665544',
  'BR',
  '1995-03-10',
  'feminino',
  'pre_consulta',
  'Melhorar minha alimentação e ter mais energia no dia a dia',
  'Belo Horizonte',
  'MG',
  true,
  'quiz-saude',
  NOW() - INTERVAL '1 week',
  NOW() - INTERVAL '1 week'
) RETURNING id;

  -- Cliente 4: Contato (Lead)
  INSERT INTO clients (
    user_id,
    name,
    email,
    phone,
    phone_country_code,
    birth_date,
    gender,
    status,
    goal,
    address_city,
    address_state,
    converted_from_lead,
    lead_source,
    created_at
  ) VALUES (
    v_user_id,
  'Carlos Eduardo Lima',
  'carlos.eduardo@email.com',
  '5511966554433',
  'BR',
  '1992-11-30',
  'masculino',
  'lead',
  'Quero emagrecer e ter mais disposição',
  'Curitiba',
  'PR',
  false,
  'calculadora-imc',
  NOW() - INTERVAL '2 days'
) RETURNING id;

  -- Cliente 5: Pausa
  INSERT INTO clients (
    user_id,
    name,
    email,
    phone,
    phone_country_code,
    birth_date,
    gender,
    status,
    goal,
    instagram,
    address_city,
    address_state,
    client_since,
    created_at
  ) VALUES (
    v_user_id,
  'Fernanda Alves',
  'fernanda.alves@email.com',
  '5511955443322',
  'BR',
  '1987-07-18',
  'feminino',
  'pausa',
  'Manter o peso e melhorar composição corporal',
  '@fernandaalves',
  'Porto Alegre',
  'RS',
  NOW() - INTERVAL '6 months',
  NOW() - INTERVAL '6 months'
) RETURNING id;

  -- Cliente 6: Finalizada
  INSERT INTO clients (
    user_id,
    name,
    email,
    phone,
    phone_country_code,
    birth_date,
    gender,
    status,
    goal,
    address_city,
    address_state,
    client_since,
    created_at
  ) VALUES (
    v_user_id,
  'Roberto Santos',
  'roberto.santos@email.com',
  '5511944332211',
  'BR',
  '1985-04-25',
  'masculino',
  'finalizada',
  'Alcançar objetivo de emagrecimento',
  'Salvador',
  'BA',
  NOW() - INTERVAL '1 year',
  NOW() - INTERVAL '1 year'
  ) RETURNING id;

  -- =====================================================
  -- 2. INSERIR EVOLUÇÕES FÍSICAS (para alguns clientes)
  -- =====================================================

  -- Evoluções para Maria Silva (Cliente 1)
  DECLARE
    cliente_maria_id UUID;
  BEGIN
    SELECT id INTO cliente_maria_id FROM clients WHERE name = 'Maria Silva Santos' AND user_id = v_user_id LIMIT 1;
    
    -- Evolução 1 (3 meses atrás)
    INSERT INTO client_evolution (
      client_id,
      user_id,
      measurement_date,
    weight,
    height,
    bmi,
    waist_circumference,
    hip_circumference,
    body_fat_percentage,
    muscle_mass,
    water_percentage,
    notes,
    created_at
  ) VALUES (
    cliente_maria_id,
    v_user_id,
    NOW() - INTERVAL '3 months',
    78.5,
    1.65,
    28.8,
    95.0,
    105.0,
    32.5,
    45.0,
    52.0,
    'Primeira avaliação - início do acompanhamento',
    NOW() - INTERVAL '3 months'
  );

    -- Evolução 2 (2 meses atrás)
    INSERT INTO client_evolution (
      client_id,
      user_id,
      measurement_date,
      weight,
      height,
      bmi,
      waist_circumference,
      hip_circumference,
      body_fat_percentage,
      muscle_mass,
      water_percentage,
      notes,
      created_at
    ) VALUES (
      cliente_maria_id,
      v_user_id,
    NOW() - INTERVAL '2 months',
    75.2,
    1.65,
    27.6,
    92.0,
    102.0,
    30.2,
    46.5,
    53.5,
    'Boa evolução - perda de 3.3kg',
    NOW() - INTERVAL '2 months'
  );

    -- Evolução 3 (1 mês atrás)
    INSERT INTO client_evolution (
      client_id,
      user_id,
      measurement_date,
      weight,
      height,
      bmi,
      waist_circumference,
      hip_circumference,
      body_fat_percentage,
      muscle_mass,
      water_percentage,
      notes,
      created_at
    ) VALUES (
      cliente_maria_id,
      v_user_id,
    NOW() - INTERVAL '1 month',
    72.8,
    1.65,
    26.8,
    89.0,
    99.0,
    28.5,
    47.8,
    54.2,
    'Excelente progresso - total de 5.7kg perdidos',
    NOW() - INTERVAL '1 month'
  );

    -- Evolução 4 (atual)
    INSERT INTO client_evolution (
      client_id,
      user_id,
      measurement_date,
      weight,
      height,
      bmi,
      waist_circumference,
      hip_circumference,
      body_fat_percentage,
      muscle_mass,
      water_percentage,
      notes,
      created_at
    ) VALUES (
      cliente_maria_id,
      v_user_id,
    NOW(),
    70.5,
    1.65,
    25.9,
    86.0,
    96.0,
    27.0,
    48.5,
    55.0,
    'Meta quase alcançada - 8kg perdidos!',
    NOW()
  );
  END;

  -- Evoluções para João Pedro (Cliente 2)
  DECLARE
    cliente_joao_id UUID;
  BEGIN
    SELECT id INTO cliente_joao_id FROM clients WHERE name = 'João Pedro Oliveira' AND user_id = v_user_id LIMIT 1;
    
    -- Evolução 1 (2 meses atrás)
    INSERT INTO client_evolution (
      client_id,
      user_id,
    measurement_date,
    weight,
    height,
    bmi,
    waist_circumference,
    chest_circumference,
    arm_circumference,
    body_fat_percentage,
    muscle_mass,
    water_percentage,
    notes,
    created_at
  ) VALUES (
    cliente_id,
    v_user_id,
    NOW() - INTERVAL '2 months',
    68.0,
    1.75,
    22.2,
    78.0,
    95.0,
    32.0,
    15.0,
    58.0,
    60.0,
    'Início - foco em ganho de massa',
    NOW() - INTERVAL '2 months'
  );

    -- Evolução 2 (atual)
    INSERT INTO client_evolution (
      client_id,
      user_id,
      measurement_date,
      weight,
      height,
      bmi,
      waist_circumference,
      chest_circumference,
      arm_circumference,
      body_fat_percentage,
      muscle_mass,
      water_percentage,
      notes,
      created_at
    ) VALUES (
      cliente_joao_id,
      v_user_id,
    NOW(),
    72.5,
    1.75,
    23.7,
    80.0,
    98.0,
    34.5,
    16.5,
    60.5,
    61.0,
    'Ganho de 4.5kg - boa evolução',
    NOW()
  );
  END;

  -- =====================================================
  -- 3. INSERIR CONSULTAS/AGENDAMENTOS
  -- =====================================================

  -- Consultas para Maria Silva
  DECLARE
    cliente_maria_id UUID;
  BEGIN
    SELECT id INTO cliente_maria_id FROM clients WHERE name = 'Maria Silva Santos' AND user_id = v_user_id LIMIT 1;
    
    -- Consulta 1 (passada - concluída)
    INSERT INTO appointments (
      client_id,
      user_id,
    title,
    description,
    appointment_type,
    start_time,
    end_time,
    duration_minutes,
    location_type,
    location_url,
    status,
    completed_at,
    notes,
    created_at
  ) VALUES (
    cliente_id,
    v_user_id,
    'Primeira Consulta',
    'Consulta inicial - anamnese completa',
    'consulta',
    NOW() - INTERVAL '3 months',
    NOW() - INTERVAL '3 months' + INTERVAL '1 hour',
    60,
    'online',
    'https://meet.google.com/abc-defg-hij',
    'concluido',
    NOW() - INTERVAL '3 months' + INTERVAL '1 hour',
    'Cliente muito motivada, objetivos claros',
    NOW() - INTERVAL '3 months'
  );

  -- Consulta 2 (próxima - agendada)
  INSERT INTO appointments (
    client_id,
    user_id,
    title,
    description,
    appointment_type,
    start_time,
    end_time,
    duration_minutes,
    location_type,
    location_url,
    status,
    created_at
  ) VALUES (
    cliente_maria_id,
    v_user_id,
    'Retorno Mensal',
    'Acompanhamento mensal',
    'retorno',
    NOW() + INTERVAL '1 week',
    NOW() + INTERVAL '1 week' + INTERVAL '30 minutes',
    30,
    'online',
    'https://meet.google.com/xyz-uvwx-rst',
    'agendado',
    NOW()
  );
END $$;

-- Consultas para João Pedro
DO $$
DECLARE
  cliente_id UUID;
BEGIN
  SELECT id INTO cliente_id FROM clients WHERE name = 'João Pedro Oliveira' LIMIT 1;
  
  -- Consulta 1 (passada)
  INSERT INTO appointments (
    client_id,
    user_id,
    title,
    appointment_type,
    start_time,
    end_time,
    duration_minutes,
    location_type,
    status,
    completed_at,
    created_at
  ) VALUES (
    cliente_id,
    v_user_id,
    'Avaliação Inicial',
    'avaliacao',
    NOW() - INTERVAL '2 months',
    NOW() - INTERVAL '2 months' + INTERVAL '1 hour',
    60,
    'presencial',
    'concluido',
    NOW() - INTERVAL '2 months' + INTERVAL '1 hour',
    NOW() - INTERVAL '2 months'
  );

  -- Consulta 2 (próxima)
  INSERT INTO appointments (
    client_id,
    user_id,
    title,
    appointment_type,
    start_time,
    end_time,
    duration_minutes,
    location_type,
    status,
    created_at
  ) VALUES (
    cliente_id,
    v_user_id,
    'Retorno',
    'retorno',
    NOW() + INTERVAL '3 days',
    NOW() + INTERVAL '3 days' + INTERVAL '30 minutes',
    30,
    'online',
    'confirmado',
    NOW()
  );
END $$;

-- Consulta para Ana Carolina (pré-consulta)
DO $$
DECLARE
  cliente_id UUID;
BEGIN
  SELECT id INTO cliente_id FROM clients WHERE name = 'Ana Carolina Costa' LIMIT 1;
  
  INSERT INTO appointments (
    client_id,
    user_id,
    title,
    appointment_type,
    start_time,
    end_time,
    duration_minutes,
    location_type,
    status,
    created_at
  ) VALUES (
    cliente_id,
    v_user_id,
    'Primeira Consulta',
    'consulta',
    NOW() + INTERVAL '5 days',
    NOW() + INTERVAL '5 days' + INTERVAL '1 hour',
    60,
    'online',
    'agendado',
    NOW()
  );
END $$;

-- =====================================================
-- 4. INSERIR REGISTROS EMOCIONAIS/COMPORTAMENTAIS
-- =====================================================

-- Registros para Maria Silva
DO $$
DECLARE
  cliente_id UUID;
BEGIN
  SELECT id INTO cliente_id FROM clients WHERE name = 'Maria Silva Santos' LIMIT 1;
  
  -- Registro 1
  INSERT INTO emotional_behavioral_history (
    client_id,
    user_id,
    record_date,
    record_type,
    emotional_state,
    stress_level,
    mood_score,
    sleep_quality,
    energy_level,
    adherence_score,
    meal_following_percentage,
    exercise_frequency,
    water_intake_liters,
    patterns_identified,
    triggers,
    notes,
    created_at
  ) VALUES (
    cliente_id,
    v_user_id,
    NOW() - INTERVAL '2 months',
    'ambos',
    'motivado',
    3,
    8,
    'bom',
    'alta',
    9,
    95.0,
    '3x por semana',
    2.5,
    ARRAY['come por ansiedade', 'pula café da manhã'],
    ARRAY['trabalho', 'fim de semana'],
    'Muito motivada, seguindo o plano à risca',
    NOW() - INTERVAL '2 months'
  );

  -- Registro 2
  INSERT INTO emotional_behavioral_history (
    client_id,
    user_id,
    record_date,
    record_type,
    emotional_state,
    stress_level,
    mood_score,
    sleep_quality,
    energy_level,
    adherence_score,
    meal_following_percentage,
    exercise_frequency,
    water_intake_liters,
    patterns_identified,
    notes,
    created_at
  ) VALUES (
    cliente_id,
    v_user_id,
    NOW() - INTERVAL '1 month',
    'ambos',
    'equilibrado',
    4,
    7,
    'otimo',
    'alta',
    8,
    90.0,
    '4x por semana',
    2.8,
    ARRAY['melhorou relação com comida'],
    'Evolução constante, mais confiante',
    NOW() - INTERVAL '1 month'
  );

  -- Registro 3 (atual)
  INSERT INTO emotional_behavioral_history (
    client_id,
    user_id,
    record_date,
    record_type,
    emotional_state,
    stress_level,
    mood_score,
    sleep_quality,
    energy_level,
    adherence_score,
    meal_following_percentage,
    exercise_frequency,
    water_intake_liters,
    notes,
    created_at
  ) VALUES (
    cliente_id,
    v_user_id,
    NOW(),
    'ambos',
    'motivado',
    2,
    9,
    'otimo',
    'alta',
    10,
    98.0,
    '5x por semana',
    3.0,
    'Excelente adesão, muito satisfeita com os resultados',
    NOW()
  );
END $$;

-- Registro para João Pedro
DO $$
DECLARE
  cliente_id UUID;
BEGIN
  SELECT id INTO cliente_id FROM clients WHERE name = 'João Pedro Oliveira' LIMIT 1;
  
  INSERT INTO emotional_behavioral_history (
    client_id,
    user_id,
    record_date,
    record_type,
    emotional_state,
    stress_level,
    mood_score,
    adherence_score,
    meal_following_percentage,
    exercise_frequency,
    water_intake_liters,
    notes,
    created_at
  ) VALUES (
    cliente_id,
    v_user_id,
    NOW(),
    'comportamental',
    'motivado',
    3,
    8,
    9,
    92.0,
    '6x por semana',
    3.5,
    'Treinando pesado, seguindo dieta rigorosamente',
    NOW()
  );
END $$;

-- =====================================================
-- 5. INSERIR AVALIAÇÕES
-- =====================================================

-- Avaliação inicial para Maria Silva
DO $$
DECLARE
  cliente_id UUID;
  avaliacao_id UUID;
BEGIN
  SELECT id INTO cliente_id FROM clients WHERE name = 'Maria Silva Santos' LIMIT 1;
  
  INSERT INTO assessments (
    client_id,
    user_id,
    assessment_type,
    assessment_name,
    is_reevaluation,
    assessment_number,
    data,
    status,
    completed_at,
    created_at
  ) VALUES (
    cliente_id,
    v_user_id,
    'antropometrica',
    'Avaliação Inicial',
    false,
    1,
    jsonb_build_object(
      'weight', 78.5,
      'height', 1.65,
      'bmi', 28.8,
      'waist_circumference', 95.0,
      'hip_circumference', 105.0,
      'body_fat_percentage', 32.5,
      'muscle_mass', 45.0,
      'water_percentage', 52.0
    ),
    'completo',
    NOW() - INTERVAL '3 months',
    NOW() - INTERVAL '3 months'
  ) RETURNING id INTO avaliacao_id;

  -- Reavaliação 1
  INSERT INTO assessments (
    client_id,
    user_id,
    assessment_type,
    assessment_name,
    is_reevaluation,
    parent_assessment_id,
    assessment_number,
    data,
    status,
    completed_at,
    created_at
  ) VALUES (
    cliente_id,
    v_user_id,
    'antropometrica',
    '1ª Reavaliação',
    true,
    avaliacao_id,
    2,
    jsonb_build_object(
      'weight', 72.8,
      'height', 1.65,
      'bmi', 26.8,
      'waist_circumference', 89.0,
      'hip_circumference', 99.0,
      'body_fat_percentage', 28.5,
      'muscle_mass', 47.8,
      'water_percentage', 54.2
    ),
    'completo',
    NOW() - INTERVAL '1 month',
    NOW() - INTERVAL '1 month'
  );
END $$;

-- =====================================================
-- 6. INSERIR EVENTOS NO HISTÓRICO
-- =====================================================

-- Histórico para Maria Silva
DO $$
DECLARE
  cliente_id UUID;
BEGIN
  SELECT id INTO cliente_id FROM clients WHERE name = 'Maria Silva Santos' LIMIT 1;
  
  INSERT INTO client_history (
    client_id,
    user_id,
    activity_type,
    title,
    description,
    created_at
  ) VALUES
  (
    cliente_id,
    v_user_id,
    'cliente_criado',
    'Cliente criada',
    'Cliente convertida de lead do quiz de emagrecimento',
    NOW() - INTERVAL '3 months'
  ),
  (
    cliente_id,
    v_user_id,
    'consulta',
    'Primeira consulta realizada',
    'Consulta inicial concluída com sucesso',
    NOW() - INTERVAL '3 months'
  ),
  (
    cliente_id,
    v_user_id,
    'evolucao_registrada',
    'Registro de evolução',
    'Primeira medição registrada',
    NOW() - INTERVAL '3 months'
  ),
  (
    cliente_id,
    v_user_id,
    'status_alterado',
    'Status alterado',
    'Status alterado para: Ativa',
    NOW() - INTERVAL '3 months'
  );

  -- =====================================================
  -- VERIFICAÇÃO FINAL
  -- =====================================================

  RAISE NOTICE 'Clientes criados: %', (SELECT COUNT(*) FROM clients WHERE user_id = v_user_id);
  RAISE NOTICE 'Evoluções criadas: %', (SELECT COUNT(*) FROM client_evolution WHERE user_id = v_user_id);
  RAISE NOTICE 'Consultas criadas: %', (SELECT COUNT(*) FROM appointments WHERE user_id = v_user_id);
  RAISE NOTICE 'Registros emocionais/comportamentais: %', (SELECT COUNT(*) FROM emotional_behavioral_history WHERE user_id = v_user_id);
  RAISE NOTICE 'Avaliações criadas: %', (SELECT COUNT(*) FROM assessments WHERE user_id = v_user_id);

END $$;

-- Verificar quantos clientes foram criados
SELECT 
  'Clientes criados:' as info,
  COUNT(*) as total,
  COUNT(CASE WHEN status = 'ativa' THEN 1 END) as ativas,
  COUNT(CASE WHEN status = 'lead' THEN 1 END) as leads,
  COUNT(CASE WHEN status = 'pre_consulta' THEN 1 END) as pre_consulta
FROM clients
WHERE name IN ('Maria Silva Santos', 'João Pedro Oliveira', 'Ana Carolina Costa', 'Carlos Eduardo Lima', 'Fernanda Alves', 'Roberto Santos');

-- Verificar evoluções criadas
SELECT 
  'Evoluções criadas:' as info,
  COUNT(*) as total
FROM client_evolution ce
JOIN clients c ON ce.client_id = c.id
WHERE c.name IN ('Maria Silva Santos', 'João Pedro Oliveira', 'Ana Carolina Costa', 'Carlos Eduardo Lima', 'Fernanda Alves', 'Roberto Santos');

-- Verificar consultas criadas
SELECT 
  'Consultas criadas:' as info,
  COUNT(*) as total,
  COUNT(CASE WHEN status = 'agendado' THEN 1 END) as agendadas,
  COUNT(CASE WHEN status = 'concluido' THEN 1 END) as concluidas
FROM appointments a
JOIN clients c ON a.client_id = c.id
WHERE c.name IN ('Maria Silva Santos', 'João Pedro Oliveira', 'Ana Carolina Costa', 'Carlos Eduardo Lima', 'Fernanda Alves', 'Roberto Santos');

-- Verificar registros emocionais/comportamentais
SELECT 
  'Registros emocionais/comportamentais:' as info,
  COUNT(*) as total
FROM emotional_behavioral_history ebh
JOIN clients c ON ebh.client_id = c.id
WHERE c.name IN ('Maria Silva Santos', 'João Pedro Oliveira', 'Ana Carolina Costa', 'Carlos Eduardo Lima', 'Fernanda Alves', 'Roberto Santos');

-- Verificar avaliações
SELECT 
  'Avaliações criadas:' as info,
  COUNT(*) as total,
  COUNT(CASE WHEN is_reevaluation = true THEN 1 END) as reavaliacoes
FROM assessments a
JOIN clients c ON a.client_id = c.id
WHERE c.name IN ('Maria Silva Santos', 'João Pedro Oliveira', 'Ana Carolina Costa', 'Carlos Eduardo Lima', 'Fernanda Alves', 'Roberto Santos');

-- =====================================================
-- FIM DO SCRIPT
-- =====================================================
-- 
-- IMPORTANTE: 
-- 1. Este script usa (SELECT id FROM users LIMIT 1) para pegar o primeiro usuário
-- 2. Se você tiver múltiplos usuários, substitua por seu user_id específico
-- 3. Para remover os dados fictícios depois, execute:
--    DELETE FROM client_history WHERE client_id IN (SELECT id FROM clients WHERE name IN ('Maria Silva Santos', 'João Pedro Oliveira', 'Ana Carolina Costa', 'Carlos Eduardo Lima', 'Fernanda Alves', 'Roberto Santos'));
--    DELETE FROM emotional_behavioral_history WHERE client_id IN (SELECT id FROM clients WHERE name IN ('Maria Silva Santos', 'João Pedro Oliveira', 'Ana Carolina Costa', 'Carlos Eduardo Lima', 'Fernanda Alves', 'Roberto Santos'));
--    DELETE FROM assessments WHERE client_id IN (SELECT id FROM clients WHERE name IN ('Maria Silva Santos', 'João Pedro Oliveira', 'Ana Carolina Costa', 'Carlos Eduardo Lima', 'Fernanda Alves', 'Roberto Santos'));
--    DELETE FROM appointments WHERE client_id IN (SELECT id FROM clients WHERE name IN ('Maria Silva Santos', 'João Pedro Oliveira', 'Ana Carolina Costa', 'Carlos Eduardo Lima', 'Fernanda Alves', 'Roberto Santos'));
--    DELETE FROM client_evolution WHERE client_id IN (SELECT id FROM clients WHERE name IN ('Maria Silva Santos', 'João Pedro Oliveira', 'Ana Carolina Costa', 'Carlos Eduardo Lima', 'Fernanda Alves', 'Roberto Santos'));
--    DELETE FROM clients WHERE name IN ('Maria Silva Santos', 'João Pedro Oliveira', 'Ana Carolina Costa', 'Carlos Eduardo Lima', 'Fernanda Alves', 'Roberto Santos');
-- =====================================================

