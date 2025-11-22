-- =====================================================
-- ADICIONAR SISTEMA DE FEATURES/MÓDULOS
-- =====================================================
-- Este script adiciona suporte a features/módulos na tabela subscriptions
-- Permite planos separados: gestao, ferramentas, cursos, completo
-- =====================================================

-- Adicionar campo features (JSONB para flexibilidade)
ALTER TABLE subscriptions
ADD COLUMN IF NOT EXISTS features JSONB DEFAULT '["completo"]'::jsonb;

-- Criar índice GIN para buscas eficientes em JSONB
CREATE INDEX IF NOT EXISTS idx_subscriptions_features 
  ON subscriptions USING GIN (features);

-- Comentário para documentação
COMMENT ON COLUMN subscriptions.features IS 'Array JSON de features habilitadas: ["gestao", "ferramentas", "cursos", "completo"]. "completo" dá acesso a tudo.';

-- =====================================================
-- MIGRAR ASSINATURAS EXISTENTES (se houver)
-- =====================================================
-- Atualizar assinaturas existentes para terem "completo"
-- Isso garante que usuários existentes não percam acesso
UPDATE subscriptions
SET features = '["completo"]'::jsonb
WHERE features IS NULL OR features = '[]'::jsonb;

-- =====================================================
-- FUNÇÃO HELPER: Verificar se assinatura tem feature
-- =====================================================
CREATE OR REPLACE FUNCTION has_subscription_feature(
  p_user_id UUID,
  p_area VARCHAR(50),
  p_feature VARCHAR(50)
)
RETURNS BOOLEAN AS $$
DECLARE
  v_features JSONB;
  v_has_completo BOOLEAN;
BEGIN
  -- Buscar features da assinatura ativa
  SELECT features INTO v_features
  FROM subscriptions
  WHERE user_id = p_user_id
    AND area = p_area
    AND status = 'active'
    AND current_period_end > NOW()
  ORDER BY created_at DESC
  LIMIT 1;
  
  -- Se não encontrou assinatura, retornar false
  IF v_features IS NULL THEN
    RETURN false;
  END IF;
  
  -- Verificar se tem "completo" (dá acesso a tudo)
  v_has_completo := v_features ? 'completo';
  IF v_has_completo THEN
    RETURN true;
  END IF;
  
  -- Verificar se tem a feature específica
  RETURN v_features ? p_feature;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comentário da função
COMMENT ON FUNCTION has_subscription_feature IS 'Verifica se usuário tem acesso a uma feature específica. Retorna true se tiver "completo" ou a feature específica.';

-- =====================================================
-- VALIDAÇÃO: Verificar se migration funcionou
-- =====================================================
DO $$
BEGIN
  -- Verificar se coluna foi criada
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'subscriptions' 
    AND column_name = 'features'
  ) THEN
    RAISE EXCEPTION 'Coluna features não foi criada!';
  END IF;
  
  -- Verificar se índice foi criado
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'subscriptions' 
    AND indexname = 'idx_subscriptions_features'
  ) THEN
    RAISE EXCEPTION 'Índice idx_subscriptions_features não foi criado!';
  END IF;
  
  RAISE NOTICE '✅ Migration concluída com sucesso!';
END $$;

