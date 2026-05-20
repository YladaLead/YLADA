-- =====================================================
-- VERIFICAR E CORRIGIR COUNTRY_CODE DO USUÁRIO
-- =====================================================

-- PASSO 1: Verificar country_code do usuário portalmagra@gmail.com
SELECT 
    user_id,
    nome_completo,
    email,
    country_code,
    whatsapp,
    telefone
FROM user_profiles
WHERE user_id = '2ed249bc-3f9f-448a-81dc-eda1d0a75043'
   OR email = 'portalmagra@gmail.com';

-- PASSO 2: Verificar se o country_code está NULL ou incorreto
SELECT 
    user_id,
    email,
    country_code,
    CASE 
        WHEN country_code IS NULL THEN '❌ NULL - Precisa definir'
        WHEN country_code = 'US' THEN '✅ EUA'
        WHEN country_code = 'BR' THEN '✅ Brasil'
        ELSE '⚠️ Outro: ' || country_code
    END as status_country_code
FROM user_profiles
WHERE user_id = '2ed249bc-3f9f-448a-81dc-eda1d0a75043'
   OR email = 'portalmagra@gmail.com';

-- PASSO 3: CORRIGIR country_code para 'US' (Estados Unidos)
-- Execute apenas se o country_code estiver NULL ou incorreto
UPDATE user_profiles
SET 
    country_code = 'US',
    updated_at = NOW()
WHERE (user_id = '2ed249bc-3f9f-448a-81dc-eda1d0a75043'
   OR email = 'portalmagra@gmail.com')
   AND (country_code IS NULL OR country_code != 'US');

-- PASSO 4: Verificar se foi corrigido
SELECT 
    user_id,
    email,
    country_code,
    CASE 
        WHEN country_code = 'US' THEN '✅ CORRETO - EUA'
        WHEN country_code IS NULL THEN '❌ AINDA NULL'
        ELSE '⚠️ Outro valor: ' || country_code
    END as resultado
FROM user_profiles
WHERE user_id = '2ed249bc-3f9f-448a-81dc-eda1d0a75043'
   OR email = 'portalmagra@gmail.com';

