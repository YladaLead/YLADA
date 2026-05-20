-- =====================================================
-- CORREÇÃO RÁPIDA DO PORTAL "parasitose"
-- Execute este script para corrigir imediatamente
-- =====================================================

-- PASSO 1: Ver se existe portal com "parasitose"
SELECT 
    id,
    name,
    slug,
    status,
    profession,
    user_id
FROM coach_portals
WHERE 
    slug ILIKE '%parasitose%' 
    OR name ILIKE '%parasitose%';

-- PASSO 2: CORRIGIR (execute mesmo se não aparecer nada no PASSO 1)
UPDATE coach_portals
SET 
    slug = 'parasitose',
    status = 'active',
    profession = 'coach'
WHERE 
    (slug ILIKE '%parasitose%' OR name ILIKE '%parasitose%')
    AND user_id = '2ed249bc-3f9f-448a-81dc-eda1d0a75043'; -- ID do usuário portalmagra@gmail.com

-- PASSO 3: VERIFICAR SE FOI CORRIGIDO
SELECT 
    id,
    name,
    slug,
    status,
    profession,
    CASE 
        WHEN slug = 'parasitose' AND status = 'active' AND profession = 'coach' THEN '✅ CORRETO'
        ELSE '❌ AINDA COM PROBLEMA'
    END as resultado
FROM coach_portals
WHERE slug = 'parasitose';

