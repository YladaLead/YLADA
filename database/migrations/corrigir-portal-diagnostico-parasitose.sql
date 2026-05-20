-- =====================================================
-- CORRIGIR PORTAL "diagnostico-de-parasitose"
-- Script completo que encontra e corrige automaticamente
-- =====================================================

-- PASSO 1: Encontrar o portal e ver seu estado atual
SELECT 
    id,
    name,
    slug,
    status,
    profession,
    created_at
FROM coach_portals
WHERE slug ILIKE '%diagnostico%' 
   OR slug ILIKE '%parasitose%'
   OR name ILIKE '%diagnostico%'
   OR name ILIKE '%parasitose%';

-- PASSO 2: Corrigir TODOS os portais encontrados de uma vez
-- (Este UPDATE corrige todos os portais que correspondem à busca)
UPDATE coach_portals
SET 
    slug = 'diagnostico-de-parasitose',
    status = 'active',
    profession = 'coach'
WHERE (slug ILIKE '%diagnostico%' AND slug ILIKE '%parasitose%')
   OR (name ILIKE '%diagnostico%' AND name ILIKE '%parasitose%')
   OR slug ILIKE '%diagnostico-de-parasitose%';

-- PASSO 3: Verificar se foi corrigido
SELECT 
    id,
    name,
    slug,
    status,
    profession,
    CASE 
        WHEN slug = 'diagnostico-de-parasitose' AND status = 'active' AND profession = 'coach' 
        THEN '✅ Tudo correto'
        ELSE '⚠️ Ainda precisa correção'
    END as status_correcao
FROM coach_portals
WHERE slug = 'diagnostico-de-parasitose'
   OR slug ILIKE '%diagnostico%parasitose%';

-- =====================================================
-- SE PRECISAR CORRIGIR MANUALMENTE (use apenas se o UPDATE acima não funcionar)
-- =====================================================

-- Primeiro, encontre o ID executando o PASSO 1 acima
-- Depois, substitua 'AQUI_VAI_O_ID' pelo ID real (exemplo: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890')

/*
UPDATE coach_portals
SET 
    slug = 'diagnostico-de-parasitose',
    status = 'active',
    profession = 'coach'
WHERE id = 'AQUI_VAI_O_ID'::uuid;
*/

