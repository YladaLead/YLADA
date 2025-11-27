-- =====================================================
-- CRIAR OU CORRIGIR PORTAL "parasitose"
-- Este script cria o portal se não existir, ou corrige se existir
-- =====================================================

-- PASSO 1: Verificar se existe portal
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

-- PASSO 2: Verificar se existe ferramenta com esse nome (pode ter sido criado como ferramenta)
SELECT 
    id,
    title,
    slug,
    status,
    user_id
FROM coach_user_templates
WHERE 
    slug ILIKE '%parasitose%' 
    OR title ILIKE '%parasitose%';

-- PASSO 3: CORRIGIR portal existente OU CRIAR novo
-- Primeiro, tentar corrigir se existir
UPDATE coach_portals
SET 
    slug = 'parasitose',
    status = 'active',
    profession = 'coach',
    updated_at = NOW()
WHERE 
    (slug ILIKE '%parasitose%' OR name ILIKE '%parasitose%')
    AND user_id = '2ed249bc-3f9f-448a-81dc-eda1d0a75043'
RETURNING id, name, slug, status, profession;

-- PASSO 4: Se não encontrou para corrigir, CRIAR novo portal
-- (Execute apenas se o PASSO 3 não retornou nenhuma linha)
INSERT INTO coach_portals (
    id,
    user_id,
    name,
    slug,
    description,
    status,
    profession,
    navigation_type,
    custom_colors,
    created_at,
    updated_at
)
SELECT 
    gen_random_uuid(),
    '2ed249bc-3f9f-448a-81dc-eda1d0a75043',
    'Parasitose',
    'parasitose',
    'Diagnóstico de Parasitose',
    'active',
    'coach',
    'menu',
    '{"primary": "#9333EA", "secondary": "#7C3AED"}'::jsonb,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM coach_portals 
    WHERE slug = 'parasitose' 
    AND user_id = '2ed249bc-3f9f-448a-81dc-eda1d0a75043'
)
RETURNING id, name, slug, status, profession;

-- PASSO 5: VERIFICAR RESULTADO FINAL
SELECT 
    id,
    name,
    slug,
    status,
    profession,
    user_id,
    CASE 
        WHEN slug = 'parasitose' AND status = 'active' AND profession = 'coach' THEN '✅ CORRETO - Portal funcionando!'
        ELSE '❌ AINDA COM PROBLEMA'
    END as resultado
FROM coach_portals
WHERE slug = 'parasitose'
    AND user_id = '2ed249bc-3f9f-448a-81dc-eda1d0a75043';

