-- =====================================================
-- Adicionar campo nome_presidente na tabela user_profiles
-- =====================================================

-- Adicionar coluna nome_presidente se não existir
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS nome_presidente VARCHAR(255);

-- Criar índice para facilitar buscas e agrupamentos
CREATE INDEX IF NOT EXISTS idx_user_profiles_nome_presidente 
ON user_profiles(nome_presidente);

-- Comentário para documentação
COMMENT ON COLUMN user_profiles.nome_presidente IS 'Nome do presidente Herbalife ao qual o usuário pertence';
