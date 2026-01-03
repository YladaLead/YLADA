-- =====================================================
-- POPULAR AGENDA DA CONTA DEMO NUTRI
-- =====================================================
-- Este script popula a agenda com muitas consultas para:
-- - Dezembro de 2024 (todo o mês bem lotado)
-- - 25 de novembro de 2025 (bem cheio)
-- =====================================================

DO $$
DECLARE
  v_user_id UUID;
  v_client_ids UUID[];
  v_client_id UUID;
  v_start_time TIMESTAMP WITH TIME ZONE;
  v_end_time TIMESTAMP WITH TIME ZONE;
  v_hour INTEGER;
  v_day INTEGER;
  v_appointment_count INTEGER := 0;
  v_client_index INTEGER;
  v_appointment_types TEXT[] := ARRAY['consulta', 'retorno', 'avaliacao', 'acompanhamento'];
  v_appointment_type TEXT;
  v_location_types TEXT[] := ARRAY['presencial', 'online'];
  v_location_type TEXT;
BEGIN
  -- Buscar user_id da conta demo
  SELECT user_id INTO v_user_id
  FROM user_profiles
  WHERE email = 'demo.nutri@ylada.com'
  LIMIT 1;

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION '❌ Conta demo.nutri@ylada.com não encontrada!';
  END IF;

  RAISE NOTICE '✅ Usando user_id da conta demo: %', v_user_id;

  -- Buscar todos os clientes da conta demo (ou criar alguns se não existirem)
  SELECT ARRAY_AGG(id) INTO v_client_ids
  FROM clients
  WHERE user_id = v_user_id;

  -- Se não tem clientes, criar alguns
  IF v_client_ids IS NULL OR array_length(v_client_ids, 1) IS NULL THEN
    RAISE NOTICE '⚠️ Nenhum cliente encontrado. Criando 10 clientes fictícios...';
    
    -- Criar 10 clientes fictícios
    FOR i IN 1..10 LOOP
      INSERT INTO clients (
        user_id,
        name,
        email,
        phone,
        birth_date,
        gender,
        created_at,
        updated_at
      )
      VALUES (
        v_user_id,
        'Cliente Demo ' || i,
        'cliente' || i || '@demo.com',
        '(11) 99999-' || LPAD(i::text, 4, '0'),
        (NOW() - INTERVAL '30 years' - (i || ' days')::INTERVAL)::DATE,
        CASE WHEN i % 2 = 0 THEN 'F' ELSE 'M' END,
        NOW(),
        NOW()
      )
      RETURNING id INTO v_client_id;
      
      v_client_ids := array_append(v_client_ids, v_client_id);
    END LOOP;
    
    RAISE NOTICE '✅ 10 clientes criados!';
  ELSE
    RAISE NOTICE '✅ Encontrados % clientes existentes', array_length(v_client_ids, 1);
  END IF;

  -- =====================================================
  -- DEZEMBRO DE 2024 - TODO O MÊS BEM LOTADO
  -- =====================================================
  RAISE NOTICE '📅 Populando Dezembro de 2024...';

  FOR v_day IN 1..31 LOOP
    -- Pular finais de semana (sábado = 6, domingo = 0)
    -- 1 de dezembro de 2024 é um domingo
    -- Vamos criar consultas de segunda a sexta (1-5)
    IF EXTRACT(DOW FROM ('2024-12-' || LPAD(v_day::text, 2, '0'))::DATE) BETWEEN 1 AND 5 THEN
      -- Criar 8-10 consultas por dia (das 8h às 18h)
      -- Criar consultas a cada hora, algumas com intervalo de 30min
      FOR v_hour IN 8..17 LOOP
        -- Criar consulta em todos os horários (exceto almoço)
        IF v_hour != 12 AND v_hour != 13 THEN
          -- Selecionar cliente aleatório
          v_client_index := ((v_day * 10 + v_hour) % array_length(v_client_ids, 1)) + 1;
          v_client_id := v_client_ids[v_client_index];
          
          -- Selecionar tipo e localização
          v_appointment_type := v_appointment_types[((v_day + v_hour) % array_length(v_appointment_types, 1)) + 1];
          v_location_type := v_location_types[((v_day + v_hour) % array_length(v_location_types, 1)) + 1];
          
          -- Definir horário
          v_start_time := ('2024-12-' || LPAD(v_day::text, 2, '0') || ' ' || LPAD(v_hour::text, 2, '0') || ':00:00')::TIMESTAMP WITH TIME ZONE;
          v_end_time := v_start_time + INTERVAL '1 hour';
          
          -- Inserir consulta (ignorar se já existir)
          BEGIN
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
              location_address,
              status,
              created_at,
              updated_at,
              created_by
            )
            VALUES (
              v_client_id,
              v_user_id,
              CASE v_appointment_type
                WHEN 'consulta' THEN 'Consulta Nutricional'
                WHEN 'retorno' THEN 'Retorno'
                WHEN 'avaliacao' THEN 'Avaliação Nutricional'
                WHEN 'acompanhamento' THEN 'Acompanhamento'
                ELSE 'Consulta'
              END,
              'Consulta agendada para demonstração',
              v_appointment_type,
              v_start_time,
              v_end_time,
              60,
              v_location_type,
              CASE WHEN v_location_type = 'presencial' THEN 'Consultório YLADA' ELSE NULL END,
              CASE WHEN v_start_time < NOW() THEN 'concluido' ELSE 'agendado' END,
              NOW(),
              NOW(),
              v_user_id
            );
            
            v_appointment_count := v_appointment_count + 1;
          EXCEPTION
            WHEN unique_violation THEN
              -- Ignorar se já existe
              NULL;
            WHEN OTHERS THEN
              -- Logar erro mas continuar
              RAISE NOTICE 'Erro ao inserir consulta: %', SQLERRM;
          END;
        END IF;
      END LOOP;
    END IF;
  END LOOP;

  -- =====================================================
  -- 25 DE NOVEMBRO DE 2025 - BEM CHEIO
  -- =====================================================
  RAISE NOTICE '📅 Populando 25 de novembro de 2025...';

  -- Criar 12 consultas no dia 25/11/2025 (das 8h às 19h, exceto almoço)
  FOR v_hour IN 8..19 LOOP
    -- Criar consulta a cada hora (exceto almoço)
    IF v_hour != 12 AND v_hour != 13 THEN
      -- Selecionar cliente aleatório
      v_client_index := ((v_hour) % array_length(v_client_ids, 1)) + 1;
      v_client_id := v_client_ids[v_client_index];
      
      -- Selecionar tipo e localização
      v_appointment_type := v_appointment_types[(v_hour % array_length(v_appointment_types, 1)) + 1];
      v_location_type := v_location_types[(v_hour % array_length(v_location_types, 1)) + 1];
      
      -- Definir horário
      v_start_time := ('2025-11-25 ' || LPAD(v_hour::text, 2, '0') || ':00:00')::TIMESTAMP WITH TIME ZONE;
      v_end_time := v_start_time + INTERVAL '1 hour';
      
      -- Inserir consulta (ignorar se já existir)
      BEGIN
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
          location_address,
          status,
          created_at,
          updated_at,
          created_by
        )
        VALUES (
          v_client_id,
          v_user_id,
          CASE v_appointment_type
            WHEN 'consulta' THEN 'Consulta Nutricional'
            WHEN 'retorno' THEN 'Retorno'
            WHEN 'avaliacao' THEN 'Avaliação Nutricional'
            WHEN 'acompanhamento' THEN 'Acompanhamento'
            ELSE 'Consulta'
          END,
          'Consulta agendada para demonstração',
          v_appointment_type,
          v_start_time,
          v_end_time,
          60,
          v_location_type,
          CASE WHEN v_location_type = 'presencial' THEN 'Consultório YLADA' ELSE NULL END,
          'agendado',
          NOW(),
          NOW(),
          v_user_id
        );
        
        v_appointment_count := v_appointment_count + 1;
      EXCEPTION
        WHEN unique_violation THEN
          -- Ignorar se já existe
          NULL;
        WHEN OTHERS THEN
          -- Logar erro mas continuar
          RAISE NOTICE 'Erro ao inserir consulta: %', SQLERRM;
      END;
    END IF;
  END LOOP;

  RAISE NOTICE '✅ Agenda populada com sucesso!';
  RAISE NOTICE '📊 Total de consultas criadas: %', v_appointment_count;
  RAISE NOTICE '';
  RAISE NOTICE '📅 Dezembro 2024: Mês completo com consultas de segunda a sexta';
  RAISE NOTICE '📅 25 Novembro 2025: Dia bem cheio com 12 consultas';
  RAISE NOTICE '';
  RAISE NOTICE '🎬 Agora você pode tirar os prints da agenda lotada!';

END $$;

-- Verificar consultas criadas
SELECT 
  DATE(start_time) as data,
  COUNT(*) as total_consultas,
  COUNT(CASE WHEN status = 'agendado' THEN 1 END) as agendadas,
  COUNT(CASE WHEN status = 'concluido' THEN 1 END) as concluidas
FROM appointments a
JOIN user_profiles up ON up.user_id = a.user_id
WHERE up.email = 'demo.nutri@ylada.com'
  AND (
    (start_time >= '2024-12-01' AND start_time < '2025-01-01')
    OR DATE(start_time) = '2025-11-25'
  )
GROUP BY DATE(start_time)
ORDER BY data;

-- Resumo geral
SELECT 
  '📊 RESUMO DA AGENDA DEMO' as info,
  COUNT(*) as total_consultas,
  COUNT(CASE WHEN start_time >= '2024-12-01' AND start_time < '2025-01-01' THEN 1 END) as dezembro_2024,
  COUNT(CASE WHEN DATE(start_time) = '2025-11-25' THEN 1 END) as novembro_25_2025,
  COUNT(CASE WHEN status = 'agendado' THEN 1 END) as agendadas,
  COUNT(CASE WHEN status = 'concluido' THEN 1 END) as concluidas
FROM appointments a
JOIN user_profiles up ON up.user_id = a.user_id
WHERE up.email = 'demo.nutri@ylada.com'
  AND (
    (start_time >= '2024-12-01' AND start_time < '2025-01-01')
    OR DATE(start_time) = '2025-11-25'
  );

