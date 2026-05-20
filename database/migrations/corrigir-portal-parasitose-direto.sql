-- =====================================================
-- CORREÇÃO DIRETA DO PORTAL "parasitose"
-- Execute este script para corrigir automaticamente
-- =====================================================

-- PASSO 1: Ver TODOS os portais do usuário portalmagra@gmail.com
SELECT 
    cp.id,
    cp.name,
    cp.slug,
    cp.status,
    cp.profession,
    cp.user_id,
    u.email
FROM coach_portals cp
LEFT JOIN auth.users u ON u.id = cp.user_id
WHERE u.email = 'portalmagra@gmail.com'
ORDER BY cp.created_at DESC;

-- PASSO 2: Ver TODOS os portais que contêm "parasitose"
SELECT 
    cp.id,
    cp.name,
    cp.slug,
    cp.status,
    cp.profession,
    cp.user_id,
    u.email
FROM coach_portals cp
LEFT JOIN auth.users u ON u.id = cp.user_id
WHERE 
    cp.slug ILIKE '%parasitose%' 
    OR cp.name ILIKE '%parasitose%'
ORDER BY cp.created_at DESC;

-- PASSO 3: CORRIGIR AUTOMATICAMENTE
-- Este UPDATE vai encontrar e corrigir QUALQUER portal com "parasitose" no nome ou slug
UPDATE coach_portals
SET 
    slug = 'parasitose',
    status = 'active',
    profession = 'coach',
    updated_at = NOW()
WHERE 
    (
        slug ILIKE '%parasitose%' 
        OR name ILIKE '%parasitose%'
    )
    AND user_id IS NOT NULL
RETURNING 
    id, 
    name, 
    slug, 
    status, 
    profession, 
    user_id;

-- PASSO 4: VERIFICAR SE FOI CORRIGIDO
SELECT 
    cp.id,
    cp.name,
    cp.slug,
    cp.status,
    cp.profession,
    cp.user_id,
    u.email,
    CASE 
        WHEN cp.status = 'active' AND cp.profession = 'coach' AND cp.slug = 'parasitose' THEN '✅ PERFEITO'
        WHEN cp.status != 'active' THEN '❌ Status: ' || cp.status
        WHEN cp.profession != 'coach' THEN '❌ Profession: ' || cp.profession
        WHEN cp.slug != 'parasitose' THEN '❌ Slug: ' || cp.slug
        ELSE '⚠️ Verificar'
    END as status_verificacao
FROM coach_portals cp
LEFT JOIN auth.users u ON u.id = cp.user_id
WHERE cp.slug = 'parasitose';

-- PASSO 5: Verificar assinatura do usuário
SELECT 
    s.id,
    s.user_id,
    s.area,
    s.status,
    s.current_period_start,
    s.current_period_end,
    u.email,
    CASE 
        WHEN s.status = 'active' AND (s.current_period_end IS NULL OR s.current_period_end > NOW()) THEN '✅ Ativa'
        WHEN s.status = 'active' AND s.current_period_end <= NOW() THEN '❌ Expirada'
        ELSE '❌ Inativa'
    END as status_assinatura
FROM subscriptions s
INNER JOIN auth.users u ON u.id = s.user_id
WHERE u.email = 'portalmagra@gmail.com'
    AND s.area = 'coach'
ORDER BY s.created_at DESC
LIMIT 5;

