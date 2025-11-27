-- =====================================================
-- EXECUTE ESTE SCRIPT NO SUPABASE SQL EDITOR
-- Copie e cole TODO o conteúdo abaixo
-- =====================================================

-- PASSO 1: Ver se existe portal
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

-- PASSO 2: Corrigir se existir
UPDATE coach_portals
SET 
    slug = 'parasitose',
    status = 'active',
    profession = 'coach',
    updated_at = NOW()
WHERE 
    (slug ILIKE '%parasitose%' OR name ILIKE '%parasitose%')
    AND user_id = '2ed249bc-3f9f-448a-81dc-eda1d0a75043';

-- PASSO 3: Criar se não existir (só cria se não encontrou no PASSO 2)
INSERT INTO coach_portals (
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
);

-- PASSO 4: Verificar resultado
SELECT 
    id,
    name,
    slug,
    status,
    profession,
    CASE 
        WHEN slug = 'parasitose' AND status = 'active' AND profession = 'coach' THEN '✅ CORRETO - Portal funcionando!'
        ELSE '❌ AINDA COM PROBLEMA'
    END as resultado
FROM coach_portals
WHERE slug = 'parasitose'
    AND user_id = '2ed249bc-3f9f-448a-81dc-eda1d0a75043';

