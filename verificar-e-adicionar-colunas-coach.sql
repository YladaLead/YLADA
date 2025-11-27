-- =====================================================
-- VERIFICAR E ADICIONAR COLUNAS NECESSÁRIAS PARA COACH
-- Execute este script no Supabase SQL Editor
-- =====================================================

-- Verificar quais colunas existem
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'user_profiles'
  AND column_name IN (
    'bio',
    'filosofia',
    'formacao_empresarial',
    'user_slug',
    'country_code',
    'whatsapp'
  )
ORDER BY column_name;

-- Adicionar colunas que não existem
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS filosofia TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS formacao_empresarial TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS user_slug VARCHAR(255);
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS country_code VARCHAR(10) DEFAULT 'BR';
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS whatsapp VARCHAR(50);

-- Verificar novamente após adicionar
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'user_profiles'
  AND column_name IN (
    'bio',
    'filosofia',
    'formacao_empresarial',
    'user_slug',
    'country_code',
    'whatsapp'
  )
ORDER BY column_name;

-- Verificar perfil específico do Coach (portalmagra@gmail.com)
SELECT 
  user_id,
  nome_completo,
  email,
  perfil,
  whatsapp,
  country_code,
  user_slug,
  bio,
  filosofia,
  formacao_empresarial,
  updated_at
FROM user_profiles
WHERE email = 'portalmagra@gmail.com'
   OR user_id IN (
     SELECT id FROM auth.users WHERE email = 'portalmagra@gmail.com'
   );

