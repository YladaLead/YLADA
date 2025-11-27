-- =====================================================
-- CORRIGIR SLUG DO PORTAL - VERSÃO SIMPLES
-- Execute passo a passo
-- =====================================================

-- PASSO 1: Encontrar o portal
SELECT 
    id,
    name,
    slug,
    status,
    profession
FROM coach_portals
WHERE slug ILIKE '%diagnostico%' 
   OR slug ILIKE '%parasitose%'
   OR name ILIKE '%diagnostico%'
   OR name ILIKE '%parasitose%';

-- PASSO 2: Copie o ID do portal encontrado acima e use nas queries abaixo
-- Exemplo: se o ID for 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'

-- PASSO 3: Corrigir o slug AUTOMATICAMENTE (corrige todos os portais encontrados)
UPDATE coach_portals
SET slug = 'diagnostico-de-parasitose'
WHERE (slug ILIKE '%diagnostico%' AND slug ILIKE '%parasitose%')
   OR (name ILIKE '%diagnostico%' AND name ILIKE '%parasitose%');

-- PASSO 4: Corrigir status e profession AUTOMATICAMENTE
UPDATE coach_portals
SET 
    status = 'active',
    profession = 'coach'
WHERE (slug ILIKE '%diagnostico%' AND slug ILIKE '%parasitose%')
   OR slug = 'diagnostico-de-parasitose';

-- PASSO 6: Verificar se foi corrigido
SELECT 
    id,
    name,
    slug,
    status,
    profession
FROM coach_portals
WHERE slug = 'diagnostico-de-parasitose';

