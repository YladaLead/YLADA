-- =====================================================
-- ATUALIZAR COLUNA 'profession' DE 'nutricionista' PARA 'wellness'
-- =====================================================
-- Esta coluna é diferente de 'perfil' e pode ser usada para análises
-- =====================================================

-- 1. VERIFICAR QUANTOS USUÁRIOS SERÃO ATUALIZADOS
SELECT 
  COUNT(*) as total_nutricionista,
  'Usuários com profession = nutricionista que serão atualizados' as descricao
FROM user_profiles
WHERE profession = 'nutricionista';

-- 2. VER PREVIEW DOS USUÁRIOS QUE SERÃO ATUALIZADOS
SELECT 
  id,
  user_id,
  email,
  nome_completo,
  perfil,
  profession as profession_atual,
  created_at
FROM user_profiles
WHERE profession = 'nutricionista'
ORDER BY created_at DESC
LIMIT 10;

-- 3. ATUALIZAR TODOS OS PROFESSIONS DE 'nutricionista' PARA 'wellness'
UPDATE user_profiles
SET 
  profession = 'wellness',
  updated_at = NOW()
WHERE profession = 'nutricionista';

-- 4. VERIFICAR RESULTADO
SELECT 
  profession,
  COUNT(*) as total
FROM user_profiles
GROUP BY profession
ORDER BY total DESC;

-- 5. VERIFICAR SE HÁ ALGUM REGISTRO QUE AINDA ESTÁ COMO 'nutricionista'
SELECT 
  COUNT(*) as ainda_nutricionista,
  'Se > 0, ainda há registros com profession = nutricionista' as status
FROM user_profiles
WHERE profession = 'nutricionista';

-- 6. VER COMPARAÇÃO ENTRE 'perfil' E 'profession'
SELECT 
  perfil,
  profession,
  COUNT(*) as total
FROM user_profiles
GROUP BY perfil, profession
ORDER BY total DESC;

