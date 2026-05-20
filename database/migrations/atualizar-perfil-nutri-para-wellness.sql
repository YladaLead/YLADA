-- =====================================================
-- ATUALIZAR PERFIL DE 'nutri' PARA 'wellness'
-- =====================================================
-- Este script atualiza a coluna 'perfil' de todos os usuários
-- que estão como 'nutri' para 'wellness'
-- =====================================================

-- 1. VERIFICAR QUANTOS USUÁRIOS SERÃO ATUALIZADOS
SELECT 
  COUNT(*) as total_nutri,
  'Usuários com perfil = nutri que serão atualizados' as descricao
FROM user_profiles
WHERE perfil = 'nutri';

-- 2. VER PREVIEW DOS USUÁRIOS QUE SERÃO ATUALIZADOS
SELECT 
  id,
  user_id,
  email,
  nome_completo,
  perfil as perfil_atual,
  profession,
  created_at
FROM user_profiles
WHERE perfil = 'nutri'
ORDER BY created_at DESC
LIMIT 10;

-- 3. ATUALIZAR TODOS OS PERFIS DE 'nutri' PARA 'wellness'
UPDATE user_profiles
SET 
  perfil = 'wellness',
  updated_at = NOW()
WHERE perfil = 'nutri';

-- 4. VERIFICAR RESULTADO
SELECT 
  perfil,
  COUNT(*) as total
FROM user_profiles
GROUP BY perfil
ORDER BY total DESC;

-- 5. VERIFICAR SE HÁ ALGUM REGISTRO QUE AINDA ESTÁ COMO 'nutri'
SELECT 
  COUNT(*) as ainda_nutri,
  'Se > 0, ainda há registros com perfil = nutri' as status
FROM user_profiles
WHERE perfil = 'nutri';

-- =====================================================
-- NOTA: A coluna 'profession' é diferente de 'perfil'
-- - 'profession' pode continuar como 'nutricionista'
-- - 'perfil' é o que o sistema usa ('wellness', 'nutri', 'coach', 'nutra')
-- =====================================================

