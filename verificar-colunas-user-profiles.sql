-- =====================================================
-- VERIFICAR ESTRUTURA DA TABELA user_profiles
-- =====================================================

-- 1. VER TODAS AS COLUNAS DA TABELA
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'user_profiles'
ORDER BY ordinal_position;

-- 2. VER DIFERENÇA ENTRE 'perfil' E 'profession'
SELECT 
  perfil,
  profession,
  COUNT(*) as total
FROM user_profiles
GROUP BY perfil, profession
ORDER BY total DESC;

-- 3. VER USUÁRIOS COM PERFIL 'nutri' (que devem ser atualizados)
SELECT 
  id,
  user_id,
  email,
  nome_completo,
  perfil,
  profession,
  created_at
FROM user_profiles
WHERE perfil = 'nutri'
ORDER BY created_at DESC;

-- 4. VER USUÁRIOS COM PERFIL 'wellness' (já atualizados)
SELECT 
  id,
  user_id,
  email,
  nome_completo,
  perfil,
  profession,
  created_at
FROM user_profiles
WHERE perfil = 'wellness'
ORDER BY created_at DESC
LIMIT 10;
