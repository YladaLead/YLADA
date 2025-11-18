-- =====================================================
-- VERIFICAR E CONFIGURAR ROTAS PÚBLICAS NUTRI
-- =====================================================
-- Este script verifica e garante que todas as colunas
-- necessárias para as rotas públicas Nutri estão configuradas
-- =====================================================

-- =====================================================
-- 1. VERIFICAR E ADICIONAR profession EM QUIZZES
-- =====================================================
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
    RAISE NOTICE 'ℹ️ Coluna profession já existe em quizzes - OK!';
    -- Garantir que índices existem mesmo se coluna já existir
    CREATE INDEX IF NOT EXISTS idx_quizzes_profession ON quizzes(profession);
  END IF;
END $$;

-- =====================================================
-- 2. VERIFICAR E ADICIONAR profession EM WELLNESS_PORTALS
-- =====================================================
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
    RAISE NOTICE 'ℹ️ Coluna profession já existe em wellness_portals - OK!';
    -- Garantir que índices existem mesmo se coluna já existir
    CREATE INDEX IF NOT EXISTS idx_wellness_portals_profession ON wellness_portals(profession);
  END IF;
END $$;

-- =====================================================
-- 3. VERIFICAR E ADICIONAR profession EM USER_TEMPLATES
-- =====================================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'user_templates' 
    AND column_name = 'profession'
  ) THEN
    -- Adicionar coluna profession em user_templates
    ALTER TABLE user_templates 
    ADD COLUMN profession VARCHAR(20) DEFAULT 'wellness';
    
    -- Atualizar ferramentas existentes para 'wellness' (padrão)
    UPDATE user_templates 
    SET profession = 'wellness' 
    WHERE profession IS NULL;
    
    -- Criar índices para performance
    CREATE INDEX IF NOT EXISTS idx_user_templates_profession ON user_templates(profession);
    CREATE INDEX IF NOT EXISTS idx_user_templates_status_profession ON user_templates(status, profession);
    
    -- Comentário
    COMMENT ON COLUMN user_templates.profession IS 'Área da ferramenta: wellness, nutri, nutra, coach';
    
    RAISE NOTICE '✅ Coluna profession adicionada em user_templates';
  ELSE
    RAISE NOTICE 'ℹ️ Coluna profession já existe em user_templates - OK!';
    -- Garantir que índices existem mesmo se coluna já existir
    CREATE INDEX IF NOT EXISTS idx_user_templates_profession ON user_templates(profession);
    CREATE INDEX IF NOT EXISTS idx_user_templates_status_profession ON user_templates(status, profession);
  END IF;
END $$;

-- =====================================================
-- 4. VERIFICAR RESULTADO - RESUMO
-- =====================================================

-- Verificar colunas profession
SELECT 
    'RESUMO - COLUNAS PROFESSION:' as info,
    'user_templates' as tabela,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'user_templates' 
            AND column_name = 'profession'
        ) THEN '✅ Existe'
        ELSE '❌ Não existe'
    END as status
UNION ALL
SELECT 
    '',
    'quizzes',
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'quizzes' 
            AND column_name = 'profession'
        ) THEN '✅ Existe'
        ELSE '❌ Não existe'
    END
UNION ALL
SELECT 
    '',
    'wellness_portals',
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'wellness_portals' 
            AND column_name = 'profession'
        ) THEN '✅ Existe'
        ELSE '❌ Não existe'
    END;

-- =====================================================
-- 5. VERIFICAR ÍNDICES
-- =====================================================
SELECT 
    'ÍNDICES CRIADOS:' as info,
    indexname,
    tablename
FROM pg_indexes
WHERE schemaname = 'public'
AND (
    indexname LIKE '%quizzes_profession%' 
    OR indexname LIKE '%wellness_portals_profession%'
    OR indexname LIKE '%user_templates_profession%'
)
ORDER BY tablename, indexname;

-- =====================================================
-- 6. CONTAGEM POR PROFESSION (se colunas existirem)
-- =====================================================

-- Contar user_templates por profession
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_templates' 
    AND column_name = 'profession'
  ) THEN
    RAISE NOTICE '📊 user_templates por profession:';
    FOR rec IN 
      SELECT profession, COUNT(*) as total 
      FROM user_templates 
      GROUP BY profession 
      ORDER BY profession
    LOOP
      RAISE NOTICE '  - %: %', rec.profession, rec.total;
    END LOOP;
  END IF;
END $$;

-- Contar quizzes por profession
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'quizzes' 
    AND column_name = 'profession'
  ) THEN
    RAISE NOTICE '📊 quizzes por profession:';
    FOR rec IN 
      SELECT profession, COUNT(*) as total 
      FROM quizzes 
      GROUP BY profession 
      ORDER BY profession
    LOOP
      RAISE NOTICE '  - %: %', rec.profession, rec.total;
    END LOOP;
  END IF;
END $$;

-- Contar wellness_portals por profession
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wellness_portals' 
    AND column_name = 'profession'
  ) THEN
    RAISE NOTICE '📊 wellness_portals por profession:';
    FOR rec IN 
      SELECT profession, COUNT(*) as total 
      FROM wellness_portals 
      GROUP BY profession 
      ORDER BY profession
    LOOP
      RAISE NOTICE '  - %: %', rec.profession, rec.total;
    END LOOP;
  END IF;
END $$;

-- =====================================================
-- ✅ SCRIPT CONCLUÍDO
-- =====================================================
-- Todas as colunas profession foram verificadas e
-- adicionadas se necessário. As rotas públicas Nutri
-- agora devem funcionar corretamente!
-- =====================================================

