-- ==========================================
-- POPULAR DADOS DE TESTE - EVOLUÇÃO FÍSICA
-- ==========================================
-- 
-- OBJETIVO: Popular o banco com dados realistas para testar
-- o sistema de evolução física com múltiplos clientes e medições
--
-- IMPORTANTE: Execute este script APENAS em ambiente de desenvolvimento/teste!
-- 
-- O QUE ESTE SCRIPT FAZ:
-- 1. Cria 5 clientes fictícios com perfis variados
-- 2. Cria evolução realista ao longo de 6 meses para cada cliente
-- 3. Simula diferentes cenários: perda de peso, ganho de massa, etc.
-- ==========================================

-- ⚠️ PASSO 1: Descubra seu user_id
-- Execute esta query primeiro:
--
-- SELECT id, email FROM auth.users LIMIT 5;
--
-- ⚠️ PASSO 2: Substitua 'SEU-USER-ID-AQUI' abaixo pelo seu UUID

-- ==========================================
-- LIMPAR DADOS DE TESTE ANTERIORES (OPCIONAL)
-- ==========================================
-- DELETE FROM client_evolution WHERE client_id IN (
--   SELECT id FROM clients WHERE email LIKE 'teste.evolucao.%@ylada.app'
-- );
-- DELETE FROM clients WHERE email LIKE 'teste.evolucao.%@ylada.app';

-- ==========================================
-- CONFIGURAÇÃO
-- ==========================================
DO $$
DECLARE
  v_user_id UUID := 'SEU-USER-ID-AQUI'::uuid;  -- ⚠️ SUBSTITUA AQUI COM SEU USER_ID
  v_client_id UUID;
  v_base_date DATE := CURRENT_DATE - INTERVAL '6 months';
  v_measurement_date DATE;
  v_weight DECIMAL(5,2);
  v_body_fat DECIMAL(5,2);
  v_muscle_mass DECIMAL(5,2);
  v_waist DECIMAL(5,2);
BEGIN
  
  -- Verificar se o user_id foi substituído (tenta converter e captura erro)
  BEGIN
    IF v_user_id IS NULL THEN
      RAISE EXCEPTION 'ERRO: Você precisa substituir SEU-USER-ID-AQUI pelo seu UUID real! Execute: SELECT id, email FROM auth.users LIMIT 5;';
    END IF;
  EXCEPTION
    WHEN OTHERS THEN
      RAISE EXCEPTION 'ERRO: UUID inválido! Você precisa substituir SEU-USER-ID-AQUI pelo seu UUID real. Execute: SELECT id, email FROM auth.users LIMIT 5;';
  END;

  RAISE NOTICE 'Usando user_id: %', v_user_id;

  -- ==========================================
  -- CLIENTE 1: Maria Silva - Perda de Peso Gradual
  -- ==========================================
  -- Perfil: Mulher, 32 anos, objetivo perda de peso
  -- Evolução: Perdeu 8kg em 6 meses (saudável)
  
  INSERT INTO clients (
    user_id, name, email, phone, status, gender, birth_date,
    goals, health_conditions
  ) VALUES (
    v_user_id,
    'Maria Silva (TESTE)',
    'teste.evolucao.maria@ylada.app',
    '+5511999990001',
    'ativo',
    'feminino',
    CURRENT_DATE - INTERVAL '32 years',
    'Perder peso de forma saudável e sustentável',
    'Sem restrições'
  ) RETURNING id INTO v_client_id;

  RAISE NOTICE 'Cliente 1 criado: Maria Silva - %', v_client_id;

  -- Criar 12 medições ao longo de 6 meses (quinzenais)
  v_weight := 78.5;
  v_body_fat := 32.0;
  v_muscle_mass := 48.0;
  v_waist := 88.0;

  FOR i IN 0..11 LOOP
    v_measurement_date := v_base_date + (i * 15);
    
    -- Simular perda gradual de peso (-0.6kg a cada 15 dias)
    v_weight := v_weight - (0.6 + (random() * 0.2 - 0.1));
    v_body_fat := v_body_fat - (0.3 + (random() * 0.1));
    v_muscle_mass := v_muscle_mass - (0.1 + (random() * 0.1));
    v_waist := v_waist - (0.8 + (random() * 0.2));

    INSERT INTO client_evolution (
      client_id, user_id, measurement_date,
      weight, height, bmi,
      waist_circumference, hip_circumference,
      body_fat_percentage, muscle_mass, water_percentage,
      notes, created_by
    ) VALUES (
      v_client_id, v_user_id, v_measurement_date,
      v_weight, 1.65, ROUND((v_weight / (1.65 * 1.65))::numeric, 2),
      v_waist, 102.0 - (i * 0.5),
      v_body_fat, v_muscle_mass, 55.0 + (i * 0.2),
      CASE 
        WHEN i = 0 THEN 'Medição inicial - Cliente motivada'
        WHEN i = 5 THEN 'Ótimo progresso! Cliente está seguindo o plano'
        WHEN i = 11 THEN 'Resultado final - Meta alcançada!'
        ELSE NULL
      END,
      v_user_id
    );
  END LOOP;

  -- ==========================================
  -- CLIENTE 2: João Santos - Ganho de Massa Muscular
  -- ==========================================
  -- Perfil: Homem, 28 anos, objetivo hipertrofia
  -- Evolução: Ganhou 5kg de massa muscular em 6 meses
  
  INSERT INTO clients (
    user_id, name, email, phone, status, gender, birth_date,
    goals, health_conditions
  ) VALUES (
    v_user_id,
    'João Santos (TESTE)',
    'teste.evolucao.joao@ylada.app',
    '+5511999990002',
    'ativo',
    'masculino',
    CURRENT_DATE - INTERVAL '28 years',
    'Ganhar massa muscular e definição',
    'Praticante de musculação 5x/semana'
  ) RETURNING id INTO v_client_id;

  RAISE NOTICE 'Cliente 2 criado: João Santos - %', v_client_id;

  v_weight := 75.0;
  v_body_fat := 18.0;
  v_muscle_mass := 58.0;
  v_waist := 82.0;

  FOR i IN 0..11 LOOP
    v_measurement_date := v_base_date + (i * 15);
    
    -- Simular ganho de massa muscular
    v_weight := v_weight + (0.4 + (random() * 0.2));
    v_body_fat := v_body_fat - (0.2 + (random() * 0.1));
    v_muscle_mass := v_muscle_mass + (0.5 + (random() * 0.2));
    v_waist := v_waist + (0.1 + (random() * 0.1));

    INSERT INTO client_evolution (
      client_id, user_id, measurement_date,
      weight, height, bmi,
      waist_circumference, hip_circumference, chest_circumference,
      arm_circumference, thigh_circumference,
      body_fat_percentage, muscle_mass, water_percentage, visceral_fat,
      notes, created_by
    ) VALUES (
      v_client_id, v_user_id, v_measurement_date,
      v_weight, 1.78, ROUND((v_weight / (1.78 * 1.78))::numeric, 2),
      v_waist, 95.0 + (i * 0.2), 102.0 + (i * 0.5),
      32.0 + (i * 0.3), 58.0 + (i * 0.4),
      v_body_fat, v_muscle_mass, 62.0 + (i * 0.1), 5.0 - (i * 0.1),
      CASE 
        WHEN i = 0 THEN 'Avaliação inicial - Boa base muscular'
        WHEN i = 6 THEN 'Excelente evolução nas medidas'
        WHEN i = 11 THEN 'Objetivo alcançado! Ganho de massa limpo'
        ELSE NULL
      END,
      v_user_id
    );
  END LOOP;

  -- ==========================================
  -- CLIENTE 3: Ana Costa - Manutenção de Peso
  -- ==========================================
  -- Perfil: Mulher, 45 anos, manutenção
  -- Evolução: Peso estável, mas melhorou composição corporal
  
  INSERT INTO clients (
    user_id, name, email, phone, status, gender, birth_date,
    goals, health_conditions
  ) VALUES (
    v_user_id,
    'Ana Costa (TESTE)',
    'teste.evolucao.ana@ylada.app',
    '+5511999990003',
    'ativo',
    'feminino',
    CURRENT_DATE - INTERVAL '45 years',
    'Manter peso e melhorar composição corporal',
    'Hipertensão controlada'
  ) RETURNING id INTO v_client_id;

  RAISE NOTICE 'Cliente 3 criado: Ana Costa - %', v_client_id;

  v_weight := 65.0;
  v_body_fat := 28.0;
  v_muscle_mass := 42.0;

  FOR i IN 0..11 LOOP
    v_measurement_date := v_base_date + (i * 15);
    
    -- Peso estável, mas composição melhora
    v_weight := 65.0 + (random() * 1.0 - 0.5);
    v_body_fat := v_body_fat - (0.2 + (random() * 0.1));
    v_muscle_mass := v_muscle_mass + (0.2 + (random() * 0.1));

    INSERT INTO client_evolution (
      client_id, user_id, measurement_date,
      weight, height, bmi,
      waist_circumference, hip_circumference,
      body_fat_percentage, muscle_mass, water_percentage,
      notes, created_by
    ) VALUES (
      v_client_id, v_user_id, v_measurement_date,
      v_weight, 1.60, ROUND((v_weight / (1.60 * 1.60))::numeric, 2),
      75.0 - (i * 0.3), 98.0 - (i * 0.2),
      v_body_fat, v_muscle_mass, 56.0 + (i * 0.15),
      CASE 
        WHEN i = 0 THEN 'Foco em recomposição corporal'
        WHEN i = 11 THEN 'Ótima evolução na composição!'
        ELSE NULL
      END,
      v_user_id
    );
  END LOOP;

  -- ==========================================
  -- CLIENTE 4: Carlos Mendes - Perda Rápida (Plateau)
  -- ==========================================
  -- Perfil: Homem, 38 anos, perda de peso com plateau
  -- Evolução: Perdeu bem no início, depois estabilizou
  
  INSERT INTO clients (
    user_id, name, email, phone, status, gender, birth_date,
    goals, health_conditions
  ) VALUES (
    v_user_id,
    'Carlos Mendes (TESTE)',
    'teste.evolucao.carlos@ylada.app',
    '+5511999990004',
    'ativo',
    'masculino',
    CURRENT_DATE - INTERVAL '38 years',
    'Perder 15kg e melhorar saúde',
    'Pré-diabético'
  ) RETURNING id INTO v_client_id;

  RAISE NOTICE 'Cliente 4 criado: Carlos Mendes - %', v_client_id;

  v_weight := 95.0;
  v_body_fat := 35.0;
  v_muscle_mass := 55.0;

  FOR i IN 0..11 LOOP
    v_measurement_date := v_base_date + (i * 15);
    
    -- Perda rápida nos primeiros 3 meses, depois plateau
    IF i < 6 THEN
      v_weight := v_weight - (1.0 + (random() * 0.3));
      v_body_fat := v_body_fat - (0.5 + (random() * 0.2));
    ELSE
      v_weight := v_weight - (0.1 + (random() * 0.2 - 0.1));
      v_body_fat := v_body_fat - (0.05 + (random() * 0.05));
    END IF;

    INSERT INTO client_evolution (
      client_id, user_id, measurement_date,
      weight, height, bmi,
      waist_circumference, hip_circumference, neck_circumference,
      body_fat_percentage, muscle_mass, water_percentage, visceral_fat,
      notes, created_by
    ) VALUES (
      v_client_id, v_user_id, v_measurement_date,
      v_weight, 1.75, ROUND((v_weight / (1.75 * 1.75))::numeric, 2),
      105.0 - (i * 1.5), 108.0 - (i * 1.2), 42.0 - (i * 0.2),
      v_body_fat, v_muscle_mass, 58.0 + (i * 0.2), 12.0 - (i * 0.3),
      CASE 
        WHEN i = 0 THEN 'Início do tratamento - Alto risco metabólico'
        WHEN i = 5 THEN 'Ótimo progresso inicial!'
        WHEN i = 8 THEN 'Plateau - ajustar plano alimentar'
        WHEN i = 11 THEN 'Quebrando o plateau com novas estratégias'
        ELSE NULL
      END,
      v_user_id
    );
  END LOOP;

  -- ==========================================
  -- CLIENTE 5: Juliana Oliveira - Pós-Gestação
  -- ==========================================
  -- Perfil: Mulher, 30 anos, recuperação pós-parto
  -- Evolução: Perda gradual e saudável no pós-parto
  
  INSERT INTO clients (
    user_id, name, email, phone, status, gender, birth_date,
    goals, health_conditions
  ) VALUES (
    v_user_id,
    'Juliana Oliveira (TESTE)',
    'teste.evolucao.juliana@ylada.app',
    '+5511999990005',
    'ativo',
    'feminino',
    CURRENT_DATE - INTERVAL '30 years',
    'Recuperar peso pré-gestação com saúde',
    'Pós-parto, amamentando'
  ) RETURNING id INTO v_client_id;

  RAISE NOTICE 'Cliente 5 criado: Juliana Oliveira - %', v_client_id;

  v_weight := 72.0;
  v_body_fat := 30.0;
  v_muscle_mass := 45.0;
  v_waist := 85.0;

  FOR i IN 0..11 LOOP
    v_measurement_date := v_base_date + (i * 15);
    
    -- Perda lenta e saudável (amamentação)
    v_weight := v_weight - (0.4 + (random() * 0.2));
    v_body_fat := v_body_fat - (0.25 + (random() * 0.1));
    v_waist := v_waist - (0.6 + (random() * 0.2));

    INSERT INTO client_evolution (
      client_id, user_id, measurement_date,
      weight, height, bmi,
      waist_circumference, hip_circumference,
      body_fat_percentage, muscle_mass, water_percentage,
      notes, created_by
    ) VALUES (
      v_client_id, v_user_id, v_measurement_date,
      v_weight, 1.68, ROUND((v_weight / (1.68 * 1.68))::numeric, 2),
      v_waist, 104.0 - (i * 0.5),
      v_body_fat, v_muscle_mass, 57.0 + (i * 0.15),
      CASE 
        WHEN i = 0 THEN 'Início acompanhamento pós-parto (3 meses)'
        WHEN i = 5 THEN 'Evolução excelente! Bebê saudável'
        WHEN i = 11 THEN 'Peso pré-gestação alcançado!'
        ELSE NULL
      END,
      v_user_id
    );
  END LOOP;

  RAISE NOTICE '==================================';
  RAISE NOTICE 'DADOS DE TESTE CRIADOS COM SUCESSO!';
  RAISE NOTICE '==================================';
  RAISE NOTICE '5 clientes criados';
  RAISE NOTICE '60 medições de evolução criadas (12 por cliente)';
  RAISE NOTICE '';
  RAISE NOTICE 'PERFIS CRIADOS:';
  RAISE NOTICE '1. Maria Silva - Perda de peso gradual (78.5kg → 70.5kg)';
  RAISE NOTICE '2. João Santos - Ganho de massa muscular (75kg → 80kg)';
  RAISE NOTICE '3. Ana Costa - Manutenção com recomposição';
  RAISE NOTICE '4. Carlos Mendes - Perda com plateau';
  RAISE NOTICE '5. Juliana Oliveira - Pós-gestação';
  RAISE NOTICE '';
  RAISE NOTICE 'Acesse a área de clientes e veja a evolução de cada um!';

END $$;

