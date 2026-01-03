-- =====================================================
-- POPULAR AGENDA DEMO - VERSÃO SIMPLES E GARANTIDA
-- =====================================================
-- Este script popula NOVEMBRO 2025 com 8 consultas por dia útil
-- Execute no Supabase SQL Editor

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
BEGIN
  -- 1. Buscar user_id da conta demo
  SELECT user_id INTO v_user_id
  FROM user_profiles
  WHERE email = 'demo.nutri@ylada.com'
  LIMIT 1;

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION '❌ Conta demo.nutri@ylada.com não encontrada!';
  END IF;

  RAISE NOTICE '✅ User ID encontrado: %', v_user_id;

  -- 2. Buscar ou criar clientes
  SELECT ARRAY_AGG(id) INTO v_client_ids
  FROM clients
  WHERE user_id = v_user_id;

  IF v_client_ids IS NULL OR array_length(v_client_ids, 1) IS NULL THEN
    RAISE NOTICE '⚠️ Criando 15 clientes...';
    
    FOR i IN 1..15 LOOP
      INSERT INTO clients (
        user_id, name, email, phone, birth_date, gender, created_at, updated_at
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
  END IF;

  RAISE NOTICE '✅ Clientes: %', array_length(v_client_ids, 1);

  -- 3. LIMPAR consultas antigas de novembro 2025 (opcional)
  DELETE FROM appointments
  WHERE user_id = v_user_id
    AND start_time >= '2025-11-01'
    AND start_time < '2025-12-01';

  RAISE NOTICE '🧹 Consultas antigas removidas';

  -- 4. POPULAR NOVEMBRO 2025 - MUITO LOTADO
  RAISE NOTICE '📅 Populando Novembro 2025...';

  FOR v_day IN 1..30 LOOP
    -- Apenas dias úteis (segunda a sexta = 1 a 5)
    IF EXTRACT(DOW FROM ('2025-11-' || LPAD(v_day::text, 2, '0'))::DATE) BETWEEN 1 AND 5 THEN
      -- 8 consultas por dia (8h, 9h, 10h, 11h, 14h, 15h, 16h, 17h)
      -- Manhã: 8h, 9h, 10h, 11h
      FOR v_hour IN 8..11 LOOP
        v_client_index := ((v_day * 10 + v_hour) % array_length(v_client_ids, 1)) + 1;
        v_client_id := v_client_ids[v_client_index];
        
        v_start_time := ('2025-11-' || LPAD(v_day::text, 2, '0') || ' ' || LPAD(v_hour::text, 2, '0') || ':00:00')::TIMESTAMP WITH TIME ZONE;
        v_end_time := v_start_time + INTERVAL '1 hour';
        
        INSERT INTO appointments (
          client_id, user_id, title, appointment_type,
          start_time, end_time, duration_minutes,
          location_type, status, created_at, updated_at, created_by
        )
        VALUES (
          v_client_id, v_user_id, 'Consulta Nutricional', 'consulta',
          v_start_time, v_end_time, 60,
          'presencial', 'agendado',
          NOW(), NOW(), v_user_id
        );
        
        v_appointment_count := v_appointment_count + 1;
      END LOOP;
      
      -- Tarde: 14h, 15h, 16h, 17h
      FOR v_hour IN 14..17 LOOP
        v_client_index := ((v_day * 10 + v_hour) % array_length(v_client_ids, 1)) + 1;
        v_client_id := v_client_ids[v_client_index];
        
        v_start_time := ('2025-11-' || LPAD(v_day::text, 2, '0') || ' ' || LPAD(v_hour::text, 2, '0') || ':00:00')::TIMESTAMP WITH TIME ZONE;
        v_end_time := v_start_time + INTERVAL '1 hour';
        
        INSERT INTO appointments (
          client_id, user_id, title, appointment_type,
          start_time, end_time, duration_minutes,
          location_type, status, created_at, updated_at, created_by
        )
        VALUES (
          v_client_id, v_user_id, 'Consulta Nutricional', 'consulta',
          v_start_time, v_end_time, 60,
          'presencial', 'agendado',
          NOW(), NOW(), v_user_id
        );
        
        v_appointment_count := v_appointment_count + 1;
      END LOOP;
    END IF;
  END LOOP;


  RAISE NOTICE '✅ CONCLUÍDO!';
  RAISE NOTICE '📊 Total de consultas criadas: %', v_appointment_count;
  RAISE NOTICE '📅 Novembro 2025: ~120 consultas (8 por dia útil)';

END $$;

-- VERIFICAR RESULTADO
SELECT 
  DATE(start_time) as data,
  COUNT(*) as total,
  COUNT(CASE WHEN status = 'agendado' THEN 1 END) as agendadas
FROM appointments a
JOIN user_profiles up ON up.user_id = a.user_id
WHERE up.email = 'demo.nutri@ylada.com'
  AND start_time >= '2025-11-01'
  AND start_time < '2025-12-01'
GROUP BY DATE(start_time)
ORDER BY data
LIMIT 35;

