-- =====================================================
-- LIMPAR DUPLICATAS DO USUÁRIO faulaandre@gmail.com
-- Manter apenas o registro mais completo/recente
-- =====================================================

-- =====================================================
-- 1. VERIFICAR TODOS OS REGISTROS DUPLICADOS
-- =====================================================

-- Ver todos os registros do seu email
SELECT 
  id,
  user_id,
  perfil,
  nome_completo,
  email,
  whatsapp,
  bio,
  user_slug,
  country_code,
  is_admin,
  is_support,
  created_at,
  updated_at
FROM user_profiles
WHERE email = 'faulaandre@gmail.com'
ORDER BY updated_at DESC NULLS LAST, created_at DESC;

-- Contar quantos registros existem
SELECT COUNT(*) as total_registros
FROM user_profiles
WHERE email = 'faulaandre@gmail.com';

-- =====================================================
-- 2. IDENTIFICAR O REGISTRO MAIS COMPLETO PARA MANTER
-- =====================================================

-- Encontrar o registro mais completo (com mais campos preenchidos e mais recente)
SELECT 
  id,
  user_id,
  perfil,
  nome_completo,
  email,
  whatsapp,
  bio,
  user_slug,
  country_code,
  is_admin,
  is_support,
  created_at,
  updated_at,
  -- Contar campos preenchidos para priorizar
  (
    CASE WHEN nome_completo IS NOT NULL AND nome_completo != '' THEN 1 ELSE 0 END +
    CASE WHEN email IS NOT NULL AND email != '' THEN 1 ELSE 0 END +
    CASE WHEN whatsapp IS NOT NULL AND whatsapp != '' THEN 1 ELSE 0 END +
    CASE WHEN bio IS NOT NULL AND bio != '' THEN 1 ELSE 0 END +
    CASE WHEN user_slug IS NOT NULL AND user_slug != '' THEN 1 ELSE 0 END +
    CASE WHEN country_code IS NOT NULL AND country_code != '' THEN 1 ELSE 0 END +
    CASE WHEN is_admin IS NOT NULL THEN 1 ELSE 0 END +
    CASE WHEN is_support IS NOT NULL THEN 1 ELSE 0 END
  ) as campos_preenchidos
FROM user_profiles
WHERE email = 'faulaandre@gmail.com'
ORDER BY 
  campos_preenchidos DESC,
  updated_at DESC NULLS LAST,
  created_at DESC
LIMIT 1;

-- =====================================================
-- 3. CRIAR REGISTRO CONSOLIDADO (MESCLAR DADOS DE TODOS)
-- =====================================================

-- Criar uma view temporária com o melhor registro de cada campo
CREATE TEMP TABLE perfil_consolidado AS
SELECT 
  -- Pegar o user_id mais comum (ou o primeiro)
  (SELECT user_id FROM user_profiles WHERE email = 'faulaandre@gmail.com' LIMIT 1) as user_id,
  -- Pegar o perfil mais comum (ou 'wellness' se houver)
  COALESCE(
    (SELECT perfil FROM user_profiles WHERE email = 'faulaandre@gmail.com' AND perfil IS NOT NULL ORDER BY updated_at DESC LIMIT 1),
    'wellness'
  ) as perfil,
  -- Pegar o nome mais completo
  COALESCE(
    (SELECT nome_completo FROM user_profiles WHERE email = 'faulaandre@gmail.com' AND nome_completo IS NOT NULL AND nome_completo != '' ORDER BY updated_at DESC LIMIT 1),
    'ANDRE FAULA'
  ) as nome_completo,
  -- Pegar o email
  'faulaandre@gmail.com' as email,
  -- Pegar o whatsapp mais recente não nulo
  (SELECT whatsapp FROM user_profiles WHERE email = 'faulaandre@gmail.com' AND whatsapp IS NOT NULL AND whatsapp != '' ORDER BY updated_at DESC LIMIT 1) as whatsapp,
  -- Pegar a bio mais recente não nula
  (SELECT bio FROM user_profiles WHERE email = 'faulaandre@gmail.com' AND bio IS NOT NULL AND bio != '' ORDER BY updated_at DESC LIMIT 1) as bio,
  -- Pegar o user_slug mais recente não nulo
  (SELECT user_slug FROM user_profiles WHERE email = 'faulaandre@gmail.com' AND user_slug IS NOT NULL AND user_slug != '' ORDER BY updated_at DESC LIMIT 1) as user_slug,
  -- Pegar o country_code mais recente não nulo
  COALESCE(
    (SELECT country_code FROM user_profiles WHERE email = 'faulaandre@gmail.com' AND country_code IS NOT NULL AND country_code != '' ORDER BY updated_at DESC LIMIT 1),
    'BR'
  ) as country_code,
  -- Pegar is_admin (true se qualquer registro tiver true)
  COALESCE(
    (SELECT MAX(is_admin::int)::boolean FROM user_profiles WHERE email = 'faulaandre@gmail.com' AND is_admin IS NOT NULL),
    false
  ) as is_admin,
  -- Pegar is_support (true se qualquer registro tiver true)
  COALESCE(
    (SELECT MAX(is_support::int)::boolean FROM user_profiles WHERE email = 'faulaandre@gmail.com' AND is_support IS NOT NULL),
    false
  ) as is_support;

-- Ver o registro consolidado
SELECT * FROM perfil_consolidado;

-- =====================================================
-- 4. DELETAR TODOS OS REGISTROS DUPLICADOS
-- =====================================================

-- IMPORTANTE: Execute apenas após verificar o registro consolidado acima!

-- Deletar todos os registros do email
DELETE FROM user_profiles
WHERE email = 'faulaandre@gmail.com';

-- =====================================================
-- 5. INSERIR O REGISTRO CONSOLIDADO
-- =====================================================

-- Inserir o registro consolidado
INSERT INTO user_profiles (
  user_id,
  perfil,
  nome_completo,
  email,
  whatsapp,
  bio,
  user_slug,
  country_code,
  is_admin,
  is_support
)
SELECT 
  user_id,
  perfil,
  nome_completo,
  email,
  whatsapp,
  bio,
  user_slug,
  country_code,
  is_admin,
  is_support
FROM perfil_consolidado;

-- =====================================================
-- 6. VERIFICAÇÃO FINAL
-- =====================================================

-- Verificar que agora há apenas um registro
SELECT COUNT(*) as total_registros
FROM user_profiles
WHERE email = 'faulaandre@gmail.com';
-- Deve retornar 1

-- Ver o registro final
SELECT 
  id,
  user_id,
  perfil,
  nome_completo,
  email,
  whatsapp,
  bio,
  user_slug,
  country_code,
  is_admin,
  is_support,
  created_at,
  updated_at
FROM user_profiles
WHERE email = 'faulaandre@gmail.com';

-- =====================================================
-- 7. GARANTIR CONSTRAINT UNIQUE EM user_id
-- =====================================================

-- Verificar se a constraint já existe
SELECT 
  conname as constraint_name,
  contype as constraint_type
FROM pg_constraint
WHERE conrelid = 'user_profiles'::regclass
AND conname LIKE '%user_id%';

-- Se não existir, criar constraint UNIQUE
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM pg_constraint 
    WHERE conname = 'user_profiles_user_id_key'
  ) THEN
    ALTER TABLE user_profiles 
    ADD CONSTRAINT user_profiles_user_id_key UNIQUE (user_id);
  END IF;
END $$;

-- =====================================================
-- 8. LIMPAR TABELA TEMPORÁRIA
-- =====================================================

DROP TABLE IF EXISTS perfil_consolidado;

