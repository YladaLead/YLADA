-- =====================================================
-- VERIFICAR COLUNAS DA TABELA user_profiles
-- =====================================================
-- Este script lista TODAS as colunas da tabela user_profiles
-- para comparar com o que o código está usando
-- =====================================================

-- 1. LISTAR TODAS AS COLUNAS COM SEUS TIPOS
SELECT 
  column_name as nome_coluna,
  data_type as tipo_dado,
  character_maximum_length as tamanho_maximo,
  is_nullable as permite_null,
  column_default as valor_padrao,
  ordinal_position as ordem
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'user_profiles'
ORDER BY ordinal_position;

-- 2. VER ESTRUTURA COMPLETA DA TABELA
SELECT 
  column_name,
  data_type,
  CASE 
    WHEN is_nullable = 'YES' THEN 'SIM'
    ELSE 'NÃO'
  END as permite_null,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'user_profiles'
ORDER BY ordinal_position;

-- 3. VER EXEMPLO DE DADOS (primeiras 5 linhas com todas as colunas)
SELECT *
FROM user_profiles
LIMIT 5;

-- 4. VERIFICAR QUAIS COLUNAS ESTÃO SENDO USADAS (não NULL)
SELECT 
  COUNT(*) FILTER (WHERE id IS NOT NULL) as tem_id,
  COUNT(*) FILTER (WHERE user_id IS NOT NULL) as tem_user_id,
  COUNT(*) FILTER (WHERE email IS NOT NULL) as tem_email,
  COUNT(*) FILTER (WHERE nome_completo IS NOT NULL) as tem_nome_completo,
  COUNT(*) FILTER (WHERE whatsapp IS NOT NULL) as tem_whatsapp,
  COUNT(*) FILTER (WHERE perfil IS NOT NULL) as tem_perfil,
  COUNT(*) FILTER (WHERE bio IS NOT NULL) as tem_bio,
  COUNT(*) FILTER (WHERE user_slug IS NOT NULL) as tem_user_slug,
  COUNT(*) FILTER (WHERE country_code IS NOT NULL) as tem_country_code,
  COUNT(*) FILTER (WHERE profession IS NOT NULL) as tem_profession,
  COUNT(*) FILTER (WHERE instagram IS NOT NULL) as tem_instagram,
  COUNT(*) FILTER (WHERE updated_at IS NOT NULL) as tem_updated_at
FROM user_profiles;

-- 5. VER TODAS AS COLUNAS DISPONÍVEIS (formato simples)
SELECT string_agg(column_name, ', ' ORDER BY ordinal_position) as todas_as_colunas
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'user_profiles';
