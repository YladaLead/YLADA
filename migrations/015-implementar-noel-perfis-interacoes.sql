-- ============================================
-- MIGRAÇÃO 015: Implementar NOEL - Perfis e Interações
-- Data: 2025-01-27
-- Objetivo: Criar estrutura para detecção de perfil e registro de interações
-- ============================================

-- 1. Adicionar coluna profile_type em user_profiles (se não existir)
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS profile_type TEXT 
CHECK (profile_type IN ('beverage_distributor', 'product_distributor', 'wellness_activator'));

-- Índice para performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_profile_type 
ON user_profiles(profile_type);

-- Comentário
COMMENT ON COLUMN user_profiles.profile_type IS 'Perfil do distribuidor: beverage_distributor, product_distributor ou wellness_activator';

-- 2. Atualizar tabela noel_interactions (já existe, adicionar colunas novas)
-- A tabela já foi criada na migration 010 com estrutura antiga
-- Vamos adicionar as novas colunas sem quebrar a estrutura existente

-- Adicionar category_detected se não existir
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'noel_interactions' AND column_name = 'category_detected'
  ) THEN
    ALTER TABLE noel_interactions ADD COLUMN category_detected TEXT;
    RAISE NOTICE '✅ Coluna category_detected adicionada';
  END IF;
END $$;

-- Adicionar profile_detected se não existir
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'noel_interactions' AND column_name = 'profile_detected'
  ) THEN
    ALTER TABLE noel_interactions ADD COLUMN profile_detected TEXT 
      CHECK (profile_detected IN ('beverage_distributor', 'product_distributor', 'wellness_activator'));
    RAISE NOTICE '✅ Coluna profile_detected adicionada';
  END IF;
END $$;

-- Adicionar module_used se não existir (já existe 'module', mas vamos manter ambos por compatibilidade)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'noel_interactions' AND column_name = 'module_used'
  ) THEN
    ALTER TABLE noel_interactions ADD COLUMN module_used TEXT;
    RAISE NOTICE '✅ Coluna module_used adicionada';
  END IF;
END $$;

-- Adicionar thread_id se não existir
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'noel_interactions' AND column_name = 'thread_id'
  ) THEN
    ALTER TABLE noel_interactions ADD COLUMN thread_id TEXT;
    RAISE NOTICE '✅ Coluna thread_id adicionada';
  END IF;
END $$;

-- Adicionar coluna 'message' se não existir (manter user_message também por compatibilidade)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'noel_interactions' AND column_name = 'message'
  ) THEN
    ALTER TABLE noel_interactions ADD COLUMN message TEXT;
    -- Copiar dados de user_message para message se existir
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'noel_interactions' AND column_name = 'user_message'
    ) THEN
      UPDATE noel_interactions SET message = user_message WHERE message IS NULL;
    END IF;
    RAISE NOTICE '✅ Coluna message adicionada';
  END IF;
END $$;

-- Adicionar coluna 'response' se não existir (manter noel_response também por compatibilidade)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'noel_interactions' AND column_name = 'response'
  ) THEN
    ALTER TABLE noel_interactions ADD COLUMN response TEXT;
    -- Copiar dados de noel_response para response se existir
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'noel_interactions' AND column_name = 'noel_response'
    ) THEN
      UPDATE noel_interactions SET response = noel_response WHERE response IS NULL;
    END IF;
    RAISE NOTICE '✅ Coluna response adicionada';
  END IF;
END $$;

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_noel_interactions_user_id 
ON noel_interactions(user_id);

CREATE INDEX IF NOT EXISTS idx_noel_interactions_created_at 
ON noel_interactions(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_noel_interactions_thread_id 
ON noel_interactions(thread_id);

CREATE INDEX IF NOT EXISTS idx_noel_interactions_profile_detected 
ON noel_interactions(profile_detected);

CREATE INDEX IF NOT EXISTS idx_noel_interactions_category_detected 
ON noel_interactions(category_detected);

-- Comentários
COMMENT ON TABLE noel_interactions IS 'Registro de todas as interações do usuário com o NOEL';
COMMENT ON COLUMN noel_interactions.category_detected IS 'Categoria detectada: vendas, convites, recrutamento, etc';
COMMENT ON COLUMN noel_interactions.profile_detected IS 'Perfil detectado do usuário na interação';
COMMENT ON COLUMN noel_interactions.module_used IS 'Módulo do NOEL usado para gerar a resposta';

-- 3. Criar tabela noel_user_settings
CREATE TABLE IF NOT EXISTS noel_user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_type TEXT CHECK (profile_type IN ('beverage_distributor', 'product_distributor', 'wellness_activator')),
  last_mode TEXT, -- último modo usado (vendas, convites, etc)
  last_topic TEXT, -- último assunto trabalhado
  preferences JSONB DEFAULT '{}', -- preferências do usuário
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice
CREATE INDEX IF NOT EXISTS idx_noel_user_settings_user_id 
ON noel_user_settings(user_id);

CREATE INDEX IF NOT EXISTS idx_noel_user_settings_profile_type 
ON noel_user_settings(profile_type);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_noel_user_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_noel_user_settings_updated_at
BEFORE UPDATE ON noel_user_settings
FOR EACH ROW
EXECUTE FUNCTION update_noel_user_settings_updated_at();

-- Comentários
COMMENT ON TABLE noel_user_settings IS 'Configurações e preferências do usuário no NOEL';
COMMENT ON COLUMN noel_user_settings.profile_type IS 'Perfil salvo do usuário';
COMMENT ON COLUMN noel_user_settings.last_mode IS 'Último módulo usado pelo usuário';
COMMENT ON COLUMN noel_user_settings.last_topic IS 'Último assunto/tópico trabalhado';

-- 4. Verificar se tabela antiga noel_interactions existe e migrar dados (se necessário)
-- Nota: Se já existir uma tabela noel_interactions com estrutura diferente,
-- pode ser necessário criar uma migration específica para migrar dados

-- ============================================
-- VERIFICAÇÕES FINAIS
-- ============================================

-- Verificar se as tabelas foram criadas
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'noel_interactions') THEN
    RAISE EXCEPTION 'Tabela noel_interactions não foi criada';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'noel_user_settings') THEN
    RAISE EXCEPTION 'Tabela noel_user_settings não foi criada';
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' AND column_name = 'profile_type'
  ) THEN
    RAISE EXCEPTION 'Coluna profile_type não foi adicionada em user_profiles';
  END IF;
  
  RAISE NOTICE '✅ Todas as tabelas e colunas foram criadas com sucesso!';
END $$;
