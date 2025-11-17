-- =====================================================
-- ADICIONAR COLUNA profession EM QUIZZES E WELLNESS_PORTALS
-- =====================================================

-- =====================================================
-- 1. VERIFICAR SE COLUNA JÁ EXISTE
-- =====================================================

-- Verificar quizzes
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'quizzes' 
    AND column_name = 'profession'
  ) THEN
    -- Adicionar coluna profession em quizzes
    ALTER TABLE quizzes 
    ADD COLUMN profession VARCHAR(20) DEFAULT 'wellness';
    
    -- Atualizar quizzes existentes para 'wellness' (padrão)
    UPDATE quizzes 
    SET profession = 'wellness' 
    WHERE profession IS NULL;
    
    -- Criar índice para performance
    CREATE INDEX IF NOT EXISTS idx_quizzes_profession ON quizzes(profession);
    
    -- Comentário
    COMMENT ON COLUMN quizzes.profession IS 'Área do quiz: wellness, nutri, nutra, coach';
    
    RAISE NOTICE '✅ Coluna profession adicionada em quizzes';
  ELSE
    RAISE NOTICE 'ℹ️ Coluna profession já existe em quizzes';
  END IF;
END $$;

-- Verificar wellness_portals
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'wellness_portals' 
    AND column_name = 'profession'
  ) THEN
    -- Adicionar coluna profession em wellness_portals
    ALTER TABLE wellness_portals 
    ADD COLUMN profession VARCHAR(20) DEFAULT 'wellness';
    
    -- Atualizar portais existentes para 'wellness' (padrão)
    UPDATE wellness_portals 
    SET profession = 'wellness' 
    WHERE profession IS NULL;
    
    -- Criar índice para performance
    CREATE INDEX IF NOT EXISTS idx_wellness_portals_profession ON wellness_portals(profession);
    
    -- Comentário
    COMMENT ON COLUMN wellness_portals.profession IS 'Área do portal: wellness, nutri, nutra, coach';
    
    RAISE NOTICE '✅ Coluna profession adicionada em wellness_portals';
  ELSE
    RAISE NOTICE 'ℹ️ Coluna profession já existe em wellness_portals';
  END IF;
END $$;

-- =====================================================
-- 2. VERIFICAR RESULTADO
-- =====================================================

-- Listar colunas de quizzes
SELECT 
    'QUIZZES - Colunas:' as info,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'quizzes'
ORDER BY ordinal_position;

-- Listar colunas de wellness_portals
SELECT 
    'WELLNESS_PORTALS - Colunas:' as info,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'wellness_portals'
ORDER BY ordinal_position;

-- Verificar se índices foram criados
SELECT 
    'ÍNDICES CRIADOS:' as info,
    indexname,
    tablename
FROM pg_indexes
WHERE schemaname = 'public'
AND (indexname LIKE '%quizzes_profession%' OR indexname LIKE '%wellness_portals_profession%');

