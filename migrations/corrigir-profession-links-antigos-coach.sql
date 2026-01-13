-- =====================================================
-- CORRIGIR PROFESSION EM LINKS ANTIGOS DO COACH
-- =====================================================
-- Atualiza links antigos que não têm profession definido
-- para garantir que apareçam na listagem
-- Funciona tanto para coach_user_templates quanto user_templates
-- =====================================================

-- 1. Verificar se a tabela coach_user_templates existe
DO $$
BEGIN
  -- Se a tabela coach_user_templates existe, atualizar lá
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'coach_user_templates'
  ) THEN
    RAISE NOTICE '✅ Tabela coach_user_templates encontrada';
    
    -- Verificar quantos links têm profession NULL
    RAISE NOTICE 'Verificando links sem profession em coach_user_templates...';
    
    -- Atualizar links antigos sem profession para 'coach'
    UPDATE coach_user_templates
    SET profession = 'coach',
        updated_at = NOW()
    WHERE profession IS NULL;
    
    RAISE NOTICE '✅ Links atualizados em coach_user_templates';
    
    -- Verificar resultado
    RAISE NOTICE 'Resultado:';
    FOR r IN 
      SELECT profession, COUNT(*) as total
      FROM coach_user_templates
      GROUP BY profession
      ORDER BY profession
    LOOP
      RAISE NOTICE '  profession: %, total: %', r.profession, r.total;
    END LOOP;
  ELSE
    RAISE NOTICE '⚠️ Tabela coach_user_templates não encontrada';
  END IF;
END $$;

-- 2. Verificar e atualizar em user_templates (caso os links estejam lá)
DO $$
BEGIN
  -- Se a tabela user_templates existe e tem coluna profession
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'user_templates'
  ) AND EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'user_templates'
    AND column_name = 'profession'
  ) THEN
    RAISE NOTICE '✅ Tabela user_templates encontrada com coluna profession';
    
    -- Verificar quantos links do Coach têm profession NULL
    RAISE NOTICE 'Verificando links do Coach sem profession em user_templates...';
    
    -- Atualizar links antigos do Coach sem profession para 'coach'
    -- Nota: Assumindo que links do Coach estão em user_templates com profession NULL ou 'coach'
    UPDATE user_templates
    SET profession = 'coach',
        updated_at = NOW()
    WHERE profession IS NULL
      AND user_id IN (
        -- Apenas usuários que são coaches (verificar pelo perfil)
        SELECT user_id FROM user_profiles 
        WHERE perfil = 'coach' OR profession = 'coach'
      );
    
    RAISE NOTICE '✅ Links do Coach atualizados em user_templates';
    
    -- Verificar resultado para links do Coach
    RAISE NOTICE 'Resultado em user_templates (apenas Coach):';
    FOR r IN 
      SELECT profession, COUNT(*) as total
      FROM user_templates
      WHERE user_id IN (
        SELECT user_id FROM user_profiles 
        WHERE perfil = 'coach' OR profession = 'coach'
      )
      GROUP BY profession
      ORDER BY profession
    LOOP
      RAISE NOTICE '  profession: %, total: %', r.profession, r.total;
    END LOOP;
  ELSE
    RAISE NOTICE '⚠️ Tabela user_templates não encontrada ou sem coluna profession';
  END IF;
END $$;

-- ✅ Script concluído!
