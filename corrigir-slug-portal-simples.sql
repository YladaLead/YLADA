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

-- PASSO 3: Corrigir o slug (substitua o ID abaixo pelo ID real)
/*
UPDATE coach_portals
SET slug = 'diagnostico-de-parasitose'
WHERE id = 'COLE_O_ID_AQUI'::uuid;
*/

-- PASSO 4: Corrigir status se necessário (substitua o ID)
/*
UPDATE coach_portals
SET status = 'active'
WHERE id = 'COLE_O_ID_AQUI'::uuid
  AND status != 'active';
*/

-- PASSO 5: Corrigir profession se necessário (substitua o ID)
/*
UPDATE coach_portals
SET profession = 'coach'
WHERE id = 'COLE_O_ID_AQUI'::uuid
  AND profession != 'coach';
*/

-- PASSO 6: Verificar se foi corrigido
SELECT 
    id,
    name,
    slug,
    status,
    profession
FROM coach_portals
WHERE slug = 'diagnostico-de-parasitose';

