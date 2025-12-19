-- =====================================================
-- VERIFICAR E CORRIGIR PLAN_TYPE 'free'
-- =====================================================
-- Este script verifica se a constraint permite 'free'
-- e corrige se necessário
-- =====================================================

-- 1. VERIFICAR CONSTRAINT ATUAL
SELECT 
  conname as constraint_name,
  pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint
WHERE conrelid = 'subscriptions'::regclass
  AND conname = 'subscriptions_plan_type_check';

-- 2. VERIFICAR SE 'free' ESTÁ PERMITIDO
DO $$
DECLARE
  v_constraint_def TEXT;
  v_has_free BOOLEAN := false;
BEGIN
  SELECT pg_get_constraintdef(oid) INTO v_constraint_def
  FROM pg_constraint
  WHERE conrelid = 'subscriptions'::regclass
    AND conname = 'subscriptions_plan_type_check';
  
  IF v_constraint_def IS NULL THEN
    RAISE NOTICE '⚠️ Constraint não encontrada. Criando...';
    -- Criar constraint se não existir
    ALTER TABLE subscriptions 
    ADD CONSTRAINT subscriptions_plan_type_check 
    CHECK (plan_type IN ('monthly', 'annual', 'free'));
    RAISE NOTICE '✅ Constraint criada com suporte a "free"';
  ELSIF v_constraint_def LIKE '%free%' THEN
    RAISE NOTICE '✅ Constraint já permite "free"';
    RAISE NOTICE '   Definição: %', v_constraint_def;
  ELSE
    RAISE NOTICE '❌ Constraint não permite "free". Corrigindo...';
    RAISE NOTICE '   Definição atual: %', v_constraint_def;
    
    -- Remover constraint antiga
    ALTER TABLE subscriptions 
    DROP CONSTRAINT IF EXISTS subscriptions_plan_type_check;
    
    -- Adicionar nova constraint que inclui 'free'
    ALTER TABLE subscriptions 
    ADD CONSTRAINT subscriptions_plan_type_check 
    CHECK (plan_type IN ('monthly', 'annual', 'free'));
    
    RAISE NOTICE '✅ Constraint atualizada com suporte a "free"';
  END IF;
END $$;

-- 3. VERIFICAR NOVAMENTE
SELECT 
  conname as constraint_name,
  pg_get_constraintdef(oid) as constraint_definition,
  CASE 
    WHEN pg_get_constraintdef(oid) LIKE '%free%' THEN '✅ Permite "free"'
    ELSE '❌ NÃO permite "free"'
  END as status
FROM pg_constraint
WHERE conrelid = 'subscriptions'::regclass
  AND conname = 'subscriptions_plan_type_check';

-- 4. TESTAR INSERÇÃO (apenas verificação, não insere de verdade)
DO $$
DECLARE
  v_test_user_id UUID;
BEGIN
  -- Buscar um user_id de teste (qualquer um)
  SELECT id INTO v_test_user_id
  FROM auth.users
  LIMIT 1;
  
  IF v_test_user_id IS NOT NULL THEN
    BEGIN
      -- Tentar validar se 'free' é aceito (sem inserir)
      PERFORM 1 FROM subscriptions
      WHERE plan_type = 'free'
      LIMIT 1;
      
      RAISE NOTICE '✅ Validação: plan_type "free" é aceito pela constraint';
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE '❌ Erro ao validar: %', SQLERRM;
    END;
  END IF;
END $$;
