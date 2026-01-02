-- ==========================================
-- LIBERAR TODOS OS 30 DIAS DA JORNADA
-- Conta: demo.nutri@ylada.com
-- ==========================================
-- Este script força a liberação de TODOS os 30 dias
-- mesmo que já existam alguns dias completos
-- ==========================================

DO $$ 
DECLARE
  demo_user_id UUID;
  dias_liberados INTEGER;
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
  -- PASSO 2: DELETAR PROGRESSO EXISTENTE
  -- ==========================================
  RAISE NOTICE '🗑️ Limpando progresso existente...';
  
  DELETE FROM journey_progress 
  WHERE user_id = demo_user_id;
  
  RAISE NOTICE '✅ Progresso anterior removido';
  RAISE NOTICE '';
  
  -- ==========================================
  -- PASSO 3: LIBERAR TODOS OS 30 DIAS
  -- ==========================================
  RAISE NOTICE '🔓 Liberando todos os 30 dias da jornada...';
  
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
    jd.day_number,
    jd.week_number,
    true as completed,
    NOW() as completed_at,
    (
      SELECT jsonb_agg(true)
      FROM jsonb_array_elements(COALESCE(jd.checklist_items, '[]'::jsonb))
    ) as checklist_completed,
    NOW() as created_at,
    NOW() as updated_at
  FROM journey_days jd
  WHERE jd.day_number BETWEEN 1 AND 30
  ORDER BY jd.day_number;
  
  -- Verificar
  SELECT COUNT(*) INTO dias_liberados
  FROM journey_progress
  WHERE user_id = demo_user_id AND completed = true;
  
  RAISE NOTICE '✅ Jornada liberada: %/30 dias', dias_liberados;
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE '🎉 JORNADA COMPLETAMENTE LIBERADA!';
  RAISE NOTICE '========================================';
  RAISE NOTICE '';
  RAISE NOTICE '✅ Todos os 30 dias estão acessíveis';
  RAISE NOTICE '✅ Todas as 5 semanas desbloqueadas';
  RAISE NOTICE '';
  RAISE NOTICE '📋 Próximos passos:';
  RAISE NOTICE '   1. Faça logout e login novamente';
  RAISE NOTICE '   2. Acesse: Menu "Método" → Jornada';
  RAISE NOTICE '   3. Todos os dias devem estar acessíveis';
  RAISE NOTICE '';
  
END $$;

-- ==========================================
-- VERIFICAÇÃO FINAL
-- ==========================================

-- Ver todos os dias liberados
SELECT 
  jp.day_number as dia,
  jp.week_number as semana,
  jd.title as titulo,
  jp.completed as completo,
  jp.completed_at as data_complecao
FROM journey_progress jp
JOIN auth.users u ON u.id = jp.user_id
LEFT JOIN journey_days jd ON jd.day_number = jp.day_number
WHERE u.email = 'demo.nutri@ylada.com'
  AND jp.completed = true
ORDER BY jp.day_number;

-- Contar total
SELECT 
  COUNT(*) as total_dias_liberados,
  COUNT(DISTINCT week_number) as semanas_liberadas
FROM journey_progress jp
JOIN auth.users u ON u.id = jp.user_id
WHERE u.email = 'demo.nutri@ylada.com'
  AND jp.completed = true;

-- ==========================================
-- FIM - Jornada liberada! 🎉
-- ==========================================









