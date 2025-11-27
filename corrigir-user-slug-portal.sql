-- =====================================================
-- CORRIGIR USER_SLUG "portal" DO USUÁRIO
-- O slug "portal" conflita com a rota /pt/c/portal/[slug]
-- =====================================================

-- PASSO 1: Ver o user_slug atual
SELECT 
    user_id,
    nome_completo,
    email,
    user_slug
FROM user_profiles
WHERE user_id = '2ed249bc-3f9f-448a-81dc-eda1d0a75043';

-- PASSO 2: Corrigir user_slug (mudar de "portal" para "portalmagra")
UPDATE user_profiles
SET 
    user_slug = 'portalmagra',
    updated_at = NOW()
WHERE user_id = '2ed249bc-3f9f-448a-81dc-eda1d0a75043'
    AND user_slug = 'portal';

-- PASSO 3: Verificar se foi corrigido
SELECT 
    user_id,
    nome_completo,
    email,
    user_slug,
    CASE 
        WHEN user_slug = 'portalmagra' THEN '✅ CORRETO'
        WHEN user_slug = 'portal' THEN '❌ AINDA É "portal" - precisa corrigir'
        ELSE '⚠️ Outro valor: ' || user_slug
    END as resultado
FROM user_profiles
WHERE user_id = '2ed249bc-3f9f-448a-81dc-eda1d0a75043';

