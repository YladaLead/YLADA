-- =====================================================
-- VERIFICAR E CORRIGIR SISTEMA DE RETENÇÃO
-- Execute este script - ele é seguro e só adiciona o que falta
-- =====================================================

-- 1. Verificar e adicionar campos em subscriptions (se não existirem)
DO $$ 
BEGIN
  -- Adicionar retention_offered_at
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'subscriptions' AND column_name = 'retention_offered_at'
  ) THEN
    ALTER TABLE subscriptions ADD COLUMN retention_offered_at TIMESTAMP WITH TIME ZONE;
    RAISE NOTICE '✅ Campo retention_offered_at adicionado';
  ELSE
    RAISE NOTICE 'ℹ️ Campo retention_offered_at já existe';
  END IF;

  -- Adicionar retention_attempts_count
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'subscriptions' AND column_name = 'retention_attempts_count'
  ) THEN
    ALTER TABLE subscriptions ADD COLUMN retention_attempts_count INTEGER DEFAULT 0;
    RAISE NOTICE '✅ Campo retention_attempts_count adicionado';
  ELSE
    RAISE NOTICE 'ℹ️ Campo retention_attempts_count já existe';
  END IF;
END $$;

-- 2. Verificar e criar índice (se não existir)
CREATE INDEX IF NOT EXISTS idx_subscriptions_retention_offered_at 
ON subscriptions(retention_offered_at);

-- 3. Verificar se RLS está habilitado
DO $$
BEGIN
  -- Verificar cancel_attempts
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE tablename = 'cancel_attempts' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE cancel_attempts ENABLE ROW LEVEL SECURITY;
    RAISE NOTICE '✅ RLS habilitado em cancel_attempts';
  ELSE
    RAISE NOTICE 'ℹ️ RLS já habilitado em cancel_attempts';
  END IF;

  -- Verificar trial_extensions
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE tablename = 'trial_extensions' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE trial_extensions ENABLE ROW LEVEL SECURITY;
    RAISE NOTICE '✅ RLS habilitado em trial_extensions';
  ELSE
    RAISE NOTICE 'ℹ️ RLS já habilitado em trial_extensions';
  END IF;
END $$;

-- 4. Verificar e criar políticas RLS (se não existirem)
DO $$
BEGIN
  -- Política para cancel_attempts - SELECT
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'cancel_attempts' 
    AND policyname = 'Users can view their own cancel attempts'
  ) THEN
    CREATE POLICY "Users can view their own cancel attempts"
    ON cancel_attempts FOR SELECT
    USING (auth.uid() = user_id);
    RAISE NOTICE '✅ Política SELECT criada para cancel_attempts';
  END IF;

  -- Política para cancel_attempts - INSERT
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'cancel_attempts' 
    AND policyname = 'Users can create their own cancel attempts'
  ) THEN
    CREATE POLICY "Users can create their own cancel attempts"
    ON cancel_attempts FOR INSERT
    WITH CHECK (auth.uid() = user_id);
    RAISE NOTICE '✅ Política INSERT criada para cancel_attempts';
  END IF;

  -- Política para cancel_attempts - UPDATE
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'cancel_attempts' 
    AND policyname = 'Users can update their own cancel attempts'
  ) THEN
    CREATE POLICY "Users can update their own cancel attempts"
    ON cancel_attempts FOR UPDATE
    USING (auth.uid() = user_id);
    RAISE NOTICE '✅ Política UPDATE criada para cancel_attempts';
  END IF;

  -- Política para trial_extensions - SELECT
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'trial_extensions' 
    AND policyname = 'Users can view their own trial extensions'
  ) THEN
    CREATE POLICY "Users can view their own trial extensions"
    ON trial_extensions FOR SELECT
    USING (auth.uid() = user_id);
    RAISE NOTICE '✅ Política SELECT criada para trial_extensions';
  END IF;

  -- Política para trial_extensions - INSERT
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'trial_extensions' 
    AND policyname = 'Users can create their own trial extensions'
  ) THEN
    CREATE POLICY "Users can create their own trial extensions"
    ON trial_extensions FOR INSERT
    WITH CHECK (auth.uid() = user_id);
    RAISE NOTICE '✅ Política INSERT criada para trial_extensions';
  END IF;
END $$;

-- 5. Verificar e criar view de analytics (se não existir)
CREATE OR REPLACE VIEW cancel_analytics AS
SELECT 
  ca.cancel_reason,
  ca.retention_offered,
  ca.retention_accepted,
  ca.final_action,
  COUNT(*) as total_attempts,
  COUNT(CASE WHEN ca.retention_accepted THEN 1 END) as retained_count,
  COUNT(CASE WHEN ca.final_action = 'canceled' THEN 1 END) as canceled_count,
  COUNT(CASE WHEN ca.final_action = 'retained' THEN 1 END) as retained_final_count,
  AVG(ca.days_since_purchase) as avg_days_since_purchase,
  MIN(ca.created_at) as first_attempt,
  MAX(ca.created_at) as last_attempt
FROM cancel_attempts ca
GROUP BY ca.cancel_reason, ca.retention_offered, ca.retention_accepted, ca.final_action;

-- 6. Verificar trigger de updated_at (se não existir)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_cancel_attempts_updated_at'
  ) THEN
    CREATE TRIGGER update_cancel_attempts_updated_at
    BEFORE UPDATE ON cancel_attempts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
    RAISE NOTICE '✅ Trigger updated_at criado para cancel_attempts';
  ELSE
    RAISE NOTICE 'ℹ️ Trigger updated_at já existe';
  END IF;
END $$;

-- 7. Resumo final
SELECT 
  '✅ VERIFICAÇÃO COMPLETA' as status,
  (SELECT COUNT(*) FROM information_schema.tables WHERE table_name = 'cancel_attempts') as cancel_attempts_exists,
  (SELECT COUNT(*) FROM information_schema.tables WHERE table_name = 'trial_extensions') as trial_extensions_exists,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'subscriptions' AND column_name = 'retention_offered_at') as retention_fields_exists;

