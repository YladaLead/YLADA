-- =====================================================
-- COMPLETAR JORNADA PARA ADMIN NUTRI
-- =====================================================
-- Marca todas as aulas/jornada como concluídas para:
-- Email: faulaandre@gmail.com
-- =====================================================

DO $$
DECLARE
  v_user_id UUID;
  v_day_number INTEGER;
  v_week_number INTEGER;
  v_total_days INTEGER;
  v_checklist_items JSONB;
  v_checklist_completed JSONB;
  v_item_count INTEGER;
  v_i INTEGER;
BEGIN
  -- 1. Buscar user_id pelo email
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = 'faulaandre@gmail.com'
  LIMIT 1;

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Usuário com email faulaandre@gmail.com não encontrado';
  END IF;

  RAISE NOTICE '✅ Usuário encontrado: %', v_user_id;

  -- 2. Buscar todos os dias da jornada
  SELECT COUNT(*) INTO v_total_days
  FROM journey_days;

  RAISE NOTICE '📚 Total de dias na jornada: %', v_total_days;

  -- 3. Para cada dia da jornada, marcar como concluído
  FOR v_day_number IN 1..30 LOOP
    -- Buscar week_number do dia
    SELECT week_number INTO v_week_number
    FROM journey_days
    WHERE day_number = v_day_number
    LIMIT 1;

    -- Se o dia existe, marcar como concluído
    IF v_week_number IS NOT NULL THEN
      -- Inicializar checklist_completed
      v_checklist_completed := '[]'::jsonb;
      
      -- Buscar checklist_items do dia
      SELECT checklist_items INTO v_checklist_items
      FROM journey_days
      WHERE day_number = v_day_number
      LIMIT 1;

      -- Se tem checklist, criar array de true para todos os itens
      IF v_checklist_items IS NOT NULL AND jsonb_array_length(v_checklist_items) > 0 THEN
        v_item_count := jsonb_array_length(v_checklist_items);
        -- Criar array de true com o mesmo tamanho do checklist
        FOR v_i IN 1..v_item_count LOOP
          v_checklist_completed := v_checklist_completed || 'true'::jsonb;
        END LOOP;
      END IF;

      -- Inserir ou atualizar progresso do dia
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
      VALUES (
        v_user_id,
        v_day_number,
        v_week_number,
        true,
        NOW(),
        v_checklist_completed,
        NOW(),
        NOW()
      )
      ON CONFLICT (user_id, day_number)
      DO UPDATE SET
        completed = true,
        completed_at = NOW(),
        checklist_completed = v_checklist_completed,
        updated_at = NOW();

      RAISE NOTICE '✅ Dia % concluído', v_day_number;
    ELSE
      RAISE NOTICE '⚠️ Dia % não encontrado na jornada', v_day_number;
    END IF;
  END LOOP;

  -- 4. Marcar diagnóstico como completo (se a coluna existir)
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'user_profiles'
    AND column_name = 'diagnostico_completo'
  ) THEN
    UPDATE user_profiles
    SET diagnostico_completo = true,
        updated_at = NOW()
    WHERE user_id = v_user_id
      AND (diagnostico_completo IS NULL OR diagnostico_completo = false);
    
    RAISE NOTICE '✅ Diagnóstico marcado como completo';
  ELSE
    RAISE NOTICE 'ℹ️ Coluna diagnostico_completo não existe, pulando...';
  END IF;

  -- 5. Verificar resultado
  SELECT COUNT(*) INTO v_total_days
  FROM journey_progress
  WHERE user_id = v_user_id
    AND completed = true;

  RAISE NOTICE '✅ Total de dias concluídos: %', v_total_days;

END $$;

-- Verificar resultado final
SELECT 
  'Verificação Final' as info,
  up.email,
  up.nome_completo,
  COUNT(jp.id) as dias_concluidos,
  MAX(jp.day_number) as ultimo_dia_concluido,
  up.diagnostico_completo
FROM auth.users au
JOIN user_profiles up ON au.id = up.user_id
LEFT JOIN journey_progress jp ON au.id = jp.user_id AND jp.completed = true
WHERE au.email = 'faulaandre@gmail.com'
GROUP BY up.email, up.nome_completo, up.diagnostico_completo;
