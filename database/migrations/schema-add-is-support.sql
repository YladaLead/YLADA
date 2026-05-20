-- =====================================================
-- ADICIONAR COLUNAS is_admin E is_support
-- =====================================================
-- Este script adiciona as colunas is_admin e is_support
-- para controle de acesso administrativo e suporte
-- =====================================================

-- Adicionar coluna is_admin se não existir
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Adicionar coluna is_support se não existir
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS is_support BOOLEAN DEFAULT false;

-- Criar índices para melhor performance em queries
CREATE INDEX IF NOT EXISTS idx_user_profiles_is_admin 
ON user_profiles(is_admin) 
WHERE is_admin = true;

CREATE INDEX IF NOT EXISTS idx_user_profiles_is_support 
ON user_profiles(is_support) 
WHERE is_support = true;

-- Comentários nas colunas para documentação
COMMENT ON COLUMN user_profiles.is_admin IS 
'Permite acesso administrativo completo a todas as áreas e funcionalidades';

COMMENT ON COLUMN user_profiles.is_support IS 
'Permite que funcionários/parceiros naveguem em todas as áreas para guiar usuários, sem acesso administrativo completo';

-- =====================================================
-- VERIFICAÇÃO
-- =====================================================

-- Verificar se as colunas foram criadas
SELECT 
  column_name,
  data_type,
  column_default,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'user_profiles'
  AND column_name IN ('is_admin', 'is_support')
ORDER BY column_name;

-- Listar usuários com is_admin = true (se houver)
SELECT 
  id,
  user_id,
  email,
  perfil,
  is_admin,
  is_support,
  nome_completo
FROM user_profiles
WHERE is_admin = true;

-- Listar usuários com is_support = true (se houver)
SELECT 
  id,
  user_id,
  email,
  perfil,
  is_admin,
  is_support,
  nome_completo
FROM user_profiles
WHERE is_support = true;

