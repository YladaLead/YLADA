-- Script para verificar e corrigir o portal "parasitose"

-- PASSO 1: Ver todos os portais que contêm "parasitose" no nome ou slug
SELECT 
    id,
    name,
    slug,
    status,
    profession,
    user_id,
    created_at
FROM coach_portals
WHERE 
    slug ILIKE '%parasitose%' 
    OR name ILIKE '%parasitose%'
    OR slug ILIKE '%diagnostico%'
ORDER BY created_at DESC;

-- PASSO 2: Corrigir AUTOMATICAMENTE o portal "parasitose"
-- Este UPDATE vai:
-- 1. Normalizar o slug para "parasitose"
-- 2. Garantir que status = 'active'
-- 3. Garantir que profession = 'coach'
UPDATE coach_portals
SET 
    slug = 'parasitose',
    status = 'active',
    profession = 'coach'
WHERE 
    (slug ILIKE '%parasitose%' OR name ILIKE '%parasitose%')
    AND user_id IS NOT NULL; -- Apenas portais com usuário válido

-- PASSO 3: Verificar se foi corrigido
SELECT 
    id,
    name,
    slug,
    status,
    profession,
    user_id
FROM coach_portals
WHERE slug = 'parasitose';

-- PASSO 4: Se ainda não encontrou, verificar se existe com outro nome
SELECT 
    id,
    name,
    slug,
    status,
    profession
FROM coach_portals
WHERE 
    name ILIKE '%diagnostico%' 
    AND name ILIKE '%parasitose%';

