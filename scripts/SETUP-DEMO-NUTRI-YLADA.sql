-- ==========================================
-- SETUP COMPLETO - demo.nutri@ylada.com
-- ==========================================
-- Data: 2025-12-18
-- Conta: demo.nutri@ylada.com
-- 
-- Este script:
-- ✅ Busca automaticamente o user_id da conta demo.nutri@ylada.com
-- ✅ Libera todos os 30 dias da jornada YLADA
-- ✅ Popula 5 clientes demo com evolução
-- ✅ Deixa tudo pronto para demonstração
-- 
-- APENAS EXECUTE - Não precisa substituir nada!
-- ==========================================

DO $$ 
DECLARE
  demo_user_id UUID;
  dias_liberados INTEGER;
  clientes_criadas INTEGER;
BEGIN
  -- ==========================================
  -- PASSO 1: Buscar user_id da conta demo
  -- ==========================================
  SELECT id INTO demo_user_id 
  FROM auth.users 
  WHERE email = 'demo.nutri@ylada.com';
  
  IF demo_user_id IS NULL THEN
    RAISE EXCEPTION '❌ Conta demo.nutri@ylada.com não encontrada! Crie a conta primeiro.';
  END IF;
  
  RAISE NOTICE '✅ Conta encontrada: demo.nutri@ylada.com';
  RAISE NOTICE 'User ID: %', demo_user_id;
  RAISE NOTICE '';
  
  -- ==========================================
  -- PASSO 2: LIBERAR JORNADA DE 30 DIAS
  -- ==========================================
  RAISE NOTICE '🔓 Liberando jornada de 30 dias...';
  
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
    demo_user_id,
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
  
  -- Verificar
  SELECT COUNT(*) INTO dias_liberados
  FROM journey_progress
  WHERE user_id = demo_user_id AND completed = true;
  
  RAISE NOTICE '✅ Jornada liberada: %/30 dias', dias_liberados;
  RAISE NOTICE '';
  
  -- ==========================================
  -- PASSO 3: POPULAR CLIENTES DEMO
  -- ==========================================
  RAISE NOTICE '👥 Criando clientes demo...';
  
  -- Cliente 1: Ana Silva - Emagrecimento
  -- Verifica se já existe, se não cria
  IF NOT EXISTS (SELECT 1 FROM clients WHERE user_id = demo_user_id AND email = 'ana.silva.demo@email.com') THEN
    INSERT INTO clients (
      user_id, name, email, phone, whatsapp, phone_country_code,
      birth_date, gender, instagram, goal,
      address_city, address_state, status, client_since,
      notes, tags
    ) VALUES (
      demo_user_id,
      'Ana Silva',
      'ana.silva.demo@email.com',
      '11987654321', '11987654321', 'BR',
      '1992-03-15', 'feminino', '@ana_saude',
      'Emagrecimento: Perder 10kg para o casamento em 6 meses',
      'São Paulo', 'SP', 'ativa', NOW() - INTERVAL '2 months',
      'Cliente muito comprometida. Casamento em abril/2026. Evolução: -5.7kg em 2 meses!',
      ARRAY['emagrecimento', 'evento-importante', 'alta-adesao']
    );
    
    -- Adicionar evolução
    INSERT INTO client_evolution (
      client_id, user_id, measurement_date, weight, height, 
      waist_circumference, hip_circumference, body_fat_percentage, notes
    )
    SELECT 
      c.id, demo_user_id, NOW() - INTERVAL '2 months', 78.5, 1.65, 88, 108, 35.2, 
      'Início: 78.5kg - Meta: 68kg'
    FROM clients c
    WHERE c.user_id = demo_user_id AND c.email = 'ana.silva.demo@email.com'
    UNION ALL
    SELECT 
      c.id, demo_user_id, NOW() - INTERVAL '1 month', 75.2, 1.65, 85, 105, 33.8, 
      'Mês 1: -3.3kg'
    FROM clients c
    WHERE c.user_id = demo_user_id AND c.email = 'ana.silva.demo@email.com'
    UNION ALL
    SELECT 
      c.id, demo_user_id, NOW(), 72.8, 1.65, 82, 102, 32.1, 
      'Mês 2: -5.7kg total. Faltam 4.8kg!'
    FROM clients c
    WHERE c.user_id = demo_user_id AND c.email = 'ana.silva.demo@email.com';
  END IF;
  
  RAISE NOTICE '  ✓ Ana Silva - Emagrecimento (ativa)';
  
  -- Cliente 2: Mariana Costa - Hipertrofia
  IF NOT EXISTS (SELECT 1 FROM clients WHERE user_id = demo_user_id AND email = 'mari.costa.demo@email.com') THEN
    INSERT INTO clients (
      user_id, name, email, phone, whatsapp, phone_country_code,
      birth_date, gender, instagram, goal,
      address_city, address_state, status, client_since,
      notes, tags
    ) VALUES (
      demo_user_id,
      'Mariana Costa',
      'mari.costa.demo@email.com',
      '11976543210', '11976543210', 'BR',
      '1996-08-22', 'feminino', '@mari_fitness',
      'Hipertrofia: Ganhar 5kg de massa muscular',
      'Rio de Janeiro', 'RJ', 'ativa', NOW() - INTERVAL '4 months',
      'Atleta amadora. Treina musculação 6x/semana. Competirá em campeonato.',
      ARRAY['hipertrofia', 'atleta', 'musculacao']
    );
    
    INSERT INTO client_evolution (
      client_id, user_id, measurement_date, weight, height, 
      body_fat_percentage, muscle_mass, notes
    )
    SELECT 
      c.id, demo_user_id, NOW() - INTERVAL '4 months', 58.2, 1.68, 18.5, 44.2,
      'Início: 58.2kg - Muito magra'
    FROM clients c
    WHERE c.user_id = demo_user_id AND c.email = 'mari.costa.demo@email.com'
    UNION ALL
    SELECT 
      c.id, demo_user_id, NOW() - INTERVAL '2 months', 60.1, 1.68, 17.8, 46.5,
      'Mês 2: +1.9kg'
    FROM clients c
    WHERE c.user_id = demo_user_id AND c.email = 'mari.costa.demo@email.com'
    UNION ALL
    SELECT 
      c.id, demo_user_id, NOW(), 62.3, 1.68, 18.2, 48.1,
      'Mês 4: +4.1kg, sendo 3.9kg massa magra!'
    FROM clients c
    WHERE c.user_id = demo_user_id AND c.email = 'mari.costa.demo@email.com';
  END IF;
  
  RAISE NOTICE '  ✓ Mariana Costa - Hipertrofia (ativa)';
  
  -- Cliente 3: Júlia Mendes - Diabetes
  IF NOT EXISTS (SELECT 1 FROM clients WHERE user_id = demo_user_id AND email = 'julia.mendes.demo@email.com') THEN
    INSERT INTO clients (
      user_id, name, email, phone, whatsapp, phone_country_code,
      birth_date, gender, instagram, goal,
      address_city, address_state, status, client_since,
      notes, tags
    ) VALUES (
      demo_user_id,
      'Júlia Mendes',
      'julia.mendes.demo@email.com',
      '11965432109', '11965432109', 'BR',
      '1979-11-03', 'feminino', '@julia_saude',
      'Controle de Diabetes: Reduzir glicemia e perder 8kg',
      'Belo Horizonte', 'MG', 'ativa', NOW() - INTERVAL '3 months',
      'Diabetes tipo 2 há 6 meses. SUCESSO: Glicemia baixou de 145→108mg/dL! Médico reduziu medicação.',
      ARRAY['diabetes', 'emagrecimento', 'cronico']
    );
    
    INSERT INTO client_evolution (
      client_id, user_id, measurement_date, weight, height, waist_circumference, notes
    )
    SELECT 
      c.id, demo_user_id, NOW() - INTERVAL '3 months', 82.5, 1.60, 95,
      'Início: Glicemia 145mg/dL'
    FROM clients c
    WHERE c.user_id = demo_user_id AND c.email = 'julia.mendes.demo@email.com'
    UNION ALL
    SELECT 
      c.id, demo_user_id, NOW() - INTERVAL '1.5 months', 79.8, 1.60, 92,
      'Melhora: Glicemia 128mg/dL'
    FROM clients c
    WHERE c.user_id = demo_user_id AND c.email = 'julia.mendes.demo@email.com'
    UNION ALL
    SELECT 
      c.id, demo_user_id, NOW(), 77.2, 1.60, 89,
      'Agora: Glicemia 108mg/dL - NORMAL!'
    FROM clients c
    WHERE c.user_id = demo_user_id AND c.email = 'julia.mendes.demo@email.com';
  END IF;
  
  RAISE NOTICE '  ✓ Júlia Mendes - Diabetes (ativa)';
  
  -- Cliente 4: Beatriz Souza - Lead
  IF NOT EXISTS (SELECT 1 FROM clients WHERE user_id = demo_user_id AND email = 'beatriz.souza.demo@email.com') THEN
    INSERT INTO clients (
      user_id, name, email, phone, whatsapp, phone_country_code,
      birth_date, gender, goal,
      address_city, address_state, status, client_since,
      converted_from_lead, lead_source,
      notes, tags
    ) VALUES (
      demo_user_id,
      'Beatriz Souza',
      'beatriz.souza.demo@email.com',
      '11921098765', '11921098765', 'BR',
      '1995-09-30', 'feminino',
      'Emagrecer e melhorar relação com comida',
      'Campinas', 'SP', 'pre_consulta', NOW() - INTERVAL '3 days',
      true, 'quiz-emagrecimento',
      'Lead convertida do quiz de emagrecimento. Primeira consulta agendada para próxima semana.',
      ARRAY['lead', 'quiz', 'emagrecimento', 'primeira-consulta']
    );
  END IF;
  
  RAISE NOTICE '  ✓ Beatriz Souza - Lead (pré-consulta)';
  
  -- Cliente 5: Larissa Rodrigues - Caso de Sucesso
  IF NOT EXISTS (SELECT 1 FROM clients WHERE user_id = demo_user_id AND email = 'larissa.rodrigues.demo@email.com') THEN
    INSERT INTO clients (
      user_id, name, email, phone, whatsapp, phone_country_code,
      birth_date, gender, instagram, goal,
      address_city, address_state, status, client_since,
      notes, tags
    ) VALUES (
      demo_user_id,
      'Larissa Rodrigues',
      'larissa.rodrigues.demo@email.com',
      '11910987654', '11910987654', 'BR',
      '1989-12-08', 'feminino', '@lari_vida_saudavel',
      'Emagrecimento: Perder 12kg',
      'Florianópolis', 'SC', 'finalizada', NOW() - INTERVAL '8 months',
      '🎉 CASO DE SUCESSO! Meta: -12kg. Resultado: -13.5kg em 6 meses! Finalizou mantendo peso.',
      ARRAY['sucesso', 'objetivo-atingido', 'emagrecimento', 'caso-exemplar']
    );
    
    INSERT INTO client_evolution (client_id, user_id, measurement_date, weight, height, notes)
    SELECT 
      c.id, demo_user_id, NOW() - INTERVAL '8 months', 78.0, 1.60,
      'Início: 78kg - Meta: 66kg'
    FROM clients c
    WHERE c.user_id = demo_user_id AND c.email = 'larissa.rodrigues.demo@email.com'
    UNION ALL
    SELECT 
      c.id, demo_user_id, NOW() - INTERVAL '4 months', 71.5, 1.60,
      'Mês 4: -6.5kg'
    FROM clients c
    WHERE c.user_id = demo_user_id AND c.email = 'larissa.rodrigues.demo@email.com'
    UNION ALL
    SELECT 
      c.id, demo_user_id, NOW() - INTERVAL '2 months', 65.0, 1.60,
      'Mês 6: -13kg - META ATINGIDA! 🎉'
    FROM clients c
    WHERE c.user_id = demo_user_id AND c.email = 'larissa.rodrigues.demo@email.com'
    UNION ALL
    SELECT 
      c.id, demo_user_id, NOW(), 64.5, 1.60,
      'Mês 8: -13.5kg - Mantendo! Finalizou.'
    FROM clients c
    WHERE c.user_id = demo_user_id AND c.email = 'larissa.rodrigues.demo@email.com';
  END IF;
  
  RAISE NOTICE '  ✓ Larissa Rodrigues - Caso de Sucesso (finalizada)';
  RAISE NOTICE '';
  
  -- Verificar
  SELECT COUNT(*) INTO clientes_criadas
  FROM clients
  WHERE user_id = demo_user_id AND email LIKE '%.demo@email.com';
  
  RAISE NOTICE '✅ Clientes criadas: %', clientes_criadas;
  RAISE NOTICE '';
  
  -- ==========================================
  -- RESUMO FINAL
  -- ==========================================
  RAISE NOTICE '========================================';
  RAISE NOTICE '🎉 SETUP COMPLETO - demo.nutri@ylada.com';
  RAISE NOTICE '========================================';
  RAISE NOTICE '';
  RAISE NOTICE '✅ Jornada YLADA:';
  RAISE NOTICE '   → %/30 dias liberados e completos', dias_liberados;
  RAISE NOTICE '   → Todas as 5 semanas desbloqueadas';
  RAISE NOTICE '';
  RAISE NOTICE '✅ Clientes Demo:';
  RAISE NOTICE '   → % clientes criadas', clientes_criadas;
  RAISE NOTICE '   → Evolução física registrada';
  RAISE NOTICE '   → Perfis diversos para teste';
  RAISE NOTICE '';
  RAISE NOTICE '📋 Clientes:';
  RAISE NOTICE '   1. Ana Silva - Emagrecimento (-5.7kg)';
  RAISE NOTICE '   2. Mariana Costa - Hipertrofia (+4.1kg)';
  RAISE NOTICE '   3. Júlia Mendes - Diabetes (glicemia OK)';
  RAISE NOTICE '   4. Beatriz Souza - Lead (pré-consulta)';
  RAISE NOTICE '   5. Larissa Rodrigues - Sucesso! 🎉';
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE '🚀 PRONTO PARA DEMONSTRAÇÃO!';
  RAISE NOTICE '========================================';
  RAISE NOTICE '';
  RAISE NOTICE '🔐 Acesso:';
  RAISE NOTICE '   Email: demo.nutri@ylada.com';
  RAISE NOTICE '   URL: https://ylada-app.vercel.app';
  RAISE NOTICE '';
  RAISE NOTICE '📂 Verificar:';
  RAISE NOTICE '   → Menu "Método" → Jornada (30 dias)';
  RAISE NOTICE '   → Menu "Gestão" → Clientes (5 perfis)';
  RAISE NOTICE '';
  
END $$;

-- ==========================================
-- VERIFICAÇÃO DETALHADA (Opcional)
-- ==========================================

-- Ver progresso da jornada
SELECT 
  week_number as semana,
  COUNT(*) as dias_na_semana,
  COUNT(*) FILTER (WHERE completed = true) as completos,
  STRING_AGG(day_number::text, ', ' ORDER BY day_number) as dias
FROM journey_progress jp
JOIN auth.users u ON u.id = jp.user_id
WHERE u.email = 'demo.nutri@ylada.com'
GROUP BY week_number
ORDER BY week_number;

-- Ver clientes criadas
SELECT 
  name as nome,
  status,
  tags[1] as tag_principal,
  EXTRACT(DAY FROM NOW() - client_since)::integer || ' dias' as tempo_cliente
FROM clients c
JOIN auth.users u ON u.id = c.user_id
WHERE u.email = 'demo.nutri@ylada.com'
  AND c.email LIKE '%.demo@email.com'
ORDER BY c.client_since DESC;

-- ==========================================
-- FIM - Conta demo.nutri@ylada.com pronta! 🎉
-- ==========================================
