-- =====================================================
-- DIAGNÓSTICO E CORREÇÃO COMPLETA DO PORTAL "parasitose"
-- =====================================================

-- PASSO 1: Ver TODOS os portais do Coach (para entender o que existe)
SELECT 
    id,
    name,
    slug,
    status,
    profession,
    user_id,
    created_at,
    updated_at
FROM coach_portals
ORDER BY created_at DESC
LIMIT 20;

-- PASSO 2: Buscar especificamente portais com "parasitose" ou "diagnostico"
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
    OR slug ILIKE '%diagnostico%'
    OR name ILIKE '%parasitose%'
    OR name ILIKE '%diagnostico%'
ORDER BY created_at DESC;

-- PASSO 3: Verificar se existe portal com slug exato "parasitose"
SELECT 
    id,
    name,
    slug,
    status,
    profession,
    user_id
FROM coach_portals
WHERE slug = 'parasitose';

-- PASSO 4: CORRIGIR AUTOMATICAMENTE
-- Este UPDATE vai encontrar e corrigir o portal "parasitose"
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
        OR (slug ILIKE '%diagnostico%' AND slug ILIKE '%parasitose%')
    )
    AND user_id IS NOT NULL
RETURNING id, name, slug, status, profession, user_id;

-- PASSO 5: VERIFICAR SE FOI CORRIGIDO
SELECT 
    id,
    name,
    slug,
    status,
    profession,
    user_id,
    CASE 
        WHEN status = 'active' AND profession = 'coach' THEN '✅ CORRETO'
        WHEN status != 'active' THEN '❌ Status incorreto: ' || status
        WHEN profession != 'coach' THEN '❌ Profession incorreto: ' || profession
        ELSE '⚠️ Verificar'
    END as status_verificacao
FROM coach_portals
WHERE slug = 'parasitose';

-- PASSO 6: Verificar se o usuário tem assinatura ativa
-- (Substitua USER_ID_AQUI pelo user_id do portal encontrado)
SELECT 
    s.id,
    s.user_id,
    s.area,
    s.status,
    s.current_period_start,
    s.current_period_end,
    CASE 
        WHEN s.status = 'active' AND (s.current_period_end IS NULL OR s.current_period_end > NOW()) THEN '✅ Ativa'
        WHEN s.status = 'active' AND s.current_period_end <= NOW() THEN '❌ Expirada'
        ELSE '❌ Inativa'
    END as status_assinatura
FROM subscriptions s
WHERE s.user_id = (SELECT user_id FROM coach_portals WHERE slug = 'parasitose' LIMIT 1)
    AND s.area = 'coach'
ORDER BY s.created_at DESC
LIMIT 5;

