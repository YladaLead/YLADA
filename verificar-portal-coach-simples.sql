-- =====================================================
-- VERIFICAR PORTAL "diagnostico-de-parasitose" NA ÁREA COACH
-- Script simplificado e robusto
-- =====================================================

-- PRIMEIRO: Verificar se a tabela coach_portals existe
SELECT 
    table_name,
    table_schema
FROM information_schema.tables
WHERE table_schema = 'public' 
  AND table_name = 'coach_portals';

-- SEGUNDO: Se a tabela existir, buscar o portal
SELECT 
    'coach_portals' as tabela,
    id,
    user_id,
    name,
    slug,
    status,
    profession,
    short_code,
    views,
    created_at
FROM coach_portals
WHERE slug = 'diagnostico-de-parasitose'
   OR slug ILIKE '%parasitose%'
   OR name ILIKE '%parasitose%';

-- TERCEIRO: Verificar TODOS os portais (para debug)
SELECT 
    id,
    name,
    slug,
    status,
    profession,
    created_at
FROM coach_portals
ORDER BY created_at DESC
LIMIT 10;

-- QUARTO: Verificar se há portais com slug similar
SELECT 
    id,
    name,
    slug,
    LENGTH(slug) as slug_length,
    status,
    profession
FROM coach_portals
WHERE slug ILIKE '%diagnostico%'
   OR slug ILIKE '%parasitose%'
   OR name ILIKE '%diagnostico%'
   OR name ILIKE '%parasitose%';

