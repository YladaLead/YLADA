-- =====================================================
-- ADICIONAR COLUNA PARA SENHA PROVISÓRIA
-- =====================================================
-- Esta coluna armazena a data de expiração da senha provisória
-- =====================================================

-- Adicionar coluna se não existir
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'user_profiles' 
      AND column_name = 'temporary_password_expires_at'
  ) THEN
    ALTER TABLE user_profiles 
    ADD COLUMN temporary_password_expires_at TIMESTAMP WITH TIME ZONE;
    
    COMMENT ON COLUMN user_profiles.temporary_password_expires_at IS 
    'Data e hora de expiração da senha provisória. Se NULL, não há senha provisória ativa.';
  END IF;
END $$;

-- Verificar se foi criada
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'user_profiles'
  AND column_name = 'temporary_password_expires_at';

