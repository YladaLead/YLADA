-- =====================================================
-- CORRIGIR DUPLICATAS NA TABELA user_profiles
-- Script para identificar e remover registros duplicados
-- =====================================================

-- =====================================================
-- 1. VERIFICAR DUPLICATAS POR user_id
-- =====================================================

-- Ver quantos registros duplicados existem
SELECT 
  user_id,
  COUNT(*) as total_registros,
  STRING_AGG(id::text, ', ') as ids,
  STRING_AGG(email, ', ') as emails,
  STRING_AGG(nome_completo, ', ') as nomes
FROM user_profiles
GROUP BY user_id
HAVING COUNT(*) > 1
ORDER BY total_registros DESC;

-- =====================================================
-- 2. VERIFICAR DUPLICATAS POR EMAIL
-- =====================================================

-- Ver quantos registros têm o mesmo email
SELECT 
  email,
  COUNT(*) as total_registros,
  STRING_AGG(user_id::text, ', ') as user_ids,
  STRING_AGG(id::text, ', ') as ids
FROM user_profiles
WHERE email IS NOT NULL AND email != ''
GROUP BY email
HAVING COUNT(*) > 1
ORDER BY total_registros DESC;

-- =====================================================
-- 3. CRIAR TABELA TEMPORÁRIA COM REGISTROS ÚNICOS
-- =====================================================

-- Para cada user_id, manter apenas o registro mais recente (ou com mais dados)
CREATE TEMP TABLE user_profiles_clean AS
SELECT DISTINCT ON (user_id)
  id,
  user_id,
  perfil,
  nome_completo,
  email,
  whatsapp,
  bio,
  user_slug,
  country_code,
  crn,
  especialidade_nutri,
  nivel_herbalife,
  cidade,
  estado,
  certificacoes,
  area_coaching,
  idioma_preferido,
  timezone,
  is_admin,
  is_support,
  created_at,
  updated_at,
  last_login,
  is_active
FROM user_profiles
ORDER BY user_id, 
  -- Priorizar registros com mais dados preenchidos
  CASE WHEN nome_completo IS NOT NULL AND nome_completo != '' THEN 1 ELSE 0 END DESC,
  CASE WHEN email IS NOT NULL AND email != '' THEN 1 ELSE 0 END DESC,
  CASE WHEN whatsapp IS NOT NULL AND whatsapp != '' THEN 1 ELSE 0 END DESC,
  CASE WHEN bio IS NOT NULL AND bio != '' THEN 1 ELSE 0 END DESC,
  CASE WHEN user_slug IS NOT NULL AND user_slug != '' THEN 1 ELSE 0 END DESC,
  -- Depois priorizar o mais recente
  updated_at DESC NULLS LAST,
  created_at DESC NULLS LAST;

-- =====================================================
-- 4. VERIFICAR ANTES DE DELETAR
-- =====================================================

-- Comparar contagem antes e depois
SELECT 
  'Antes' as etapa,
  COUNT(*) as total_registros,
  COUNT(DISTINCT user_id) as usuarios_unicos
FROM user_profiles
UNION ALL
SELECT 
  'Depois' as etapa,
  COUNT(*) as total_registros,
  COUNT(DISTINCT user_id) as usuarios_unicos
FROM user_profiles_clean;

-- =====================================================
-- 5. BACKUP DOS DADOS ORIGINAIS (OPCIONAL)
-- =====================================================

-- Criar backup antes de deletar (descomente se quiser fazer backup)
-- CREATE TABLE user_profiles_backup AS SELECT * FROM user_profiles;

-- =====================================================
-- 6. REMOVER DUPLICATAS
-- =====================================================

-- IMPORTANTE: Execute apenas após verificar os resultados acima!

-- Deletar todos os registros duplicados
DELETE FROM user_profiles
WHERE id NOT IN (
  SELECT id FROM user_profiles_clean
);

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
-- (Isso vai falhar se ainda houver duplicatas)
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
-- 8. VERIFICAÇÃO FINAL
-- =====================================================

-- Verificar se ainda há duplicatas
SELECT 
  user_id,
  COUNT(*) as total
FROM user_profiles
GROUP BY user_id
HAVING COUNT(*) > 1;

-- Se retornar 0 linhas, não há mais duplicatas!

-- =====================================================
-- 9. LIMPAR TABELA TEMPORÁRIA
-- =====================================================

DROP TABLE IF EXISTS user_profiles_clean;

-- =====================================================
-- 10. QUERIES ÚTEIS PARA VERIFICAR DADOS
-- =====================================================

-- Ver todos os perfis do seu email específico
-- SELECT * FROM user_profiles WHERE email = 'faulaandre@gmail.com';

-- Ver todos os perfis ordenados por data de atualização
-- SELECT user_id, email, nome_completo, perfil, updated_at 
-- FROM user_profiles 
-- ORDER BY updated_at DESC;

