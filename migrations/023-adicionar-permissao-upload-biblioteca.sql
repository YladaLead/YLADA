-- =====================================================
-- ADICIONAR PERMISSÃO DE UPLOAD DE BIBLIOTECA
-- Migração 023: Permitir acesso restrito para upload sem ser admin
-- =====================================================

-- Adicionar coluna can_upload_library se não existir
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS can_upload_library BOOLEAN DEFAULT false;

-- Criar índice para melhor performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_can_upload_library 
ON user_profiles(can_upload_library) 
WHERE can_upload_library = true;

-- Comentário na coluna para documentação
COMMENT ON COLUMN user_profiles.can_upload_library IS 
'Permite acesso restrito apenas para upload de materiais na biblioteca Wellness, sem acesso à área administrativa completa';

-- =====================================================
-- VERIFICAÇÃO
-- =====================================================

-- Verificar se a coluna foi criada
SELECT 
  column_name,
  data_type,
  column_default,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'user_profiles'
  AND column_name = 'can_upload_library';

-- Listar usuários com can_upload_library = true (se houver)
SELECT 
  id,
  user_id,
  email,
  perfil,
  nome_completo,
  is_admin,
  can_upload_library
FROM user_profiles
WHERE can_upload_library = true;
