-- =====================================================
-- VERIFICAR PORTAL "diagnostico-de-parasitose"
-- =====================================================

-- 1. Verificar em wellness_portals
SELECT 
    'wellness_portals' as tabela,
    id,
    user_id,
    name,
    slug,
    status,
    created_at
FROM wellness_portals
WHERE slug = 'diagnostico-de-parasitose'
   OR slug ILIKE '%parasitose%'
   OR name ILIKE '%parasitose%';

-- 2. Verificar em coach_portals
SELECT 
    'coach_portals' as tabela,
    id,
    user_id,
    name,
    slug,
    status,
    profession,
    created_at
FROM coach_portals
WHERE slug = 'diagnostico-de-parasitose'
   OR slug ILIKE '%parasitose%'
   OR name ILIKE '%parasitose%';

-- 3. Verificar em nutri_portals (se existir)
-- Descomente se a tabela nutri_portals existir:
/*
SELECT 
    'nutri_portals' as tabela,
    id,
    user_id,
    name,
    slug,
    status,
    profession,
    created_at
FROM nutri_portals
WHERE slug = 'diagnostico-de-parasitose'
   OR slug ILIKE '%parasitose%'
   OR name ILIKE '%parasitose%';
*/

-- 4. Verificar short_code relacionado
SELECT 
    'wellness_portals' as tabela,
    id,
    slug,
    short_code
FROM wellness_portals
WHERE short_code ILIKE '%parasitose%'
   OR short_code = 'diagnostico-de-parasitose';

SELECT 
    'coach_portals' as tabela,
    id,
    slug,
    short_code
FROM coach_portals
WHERE short_code ILIKE '%parasitose%'
   OR short_code = 'diagnostico-de-parasitose';

-- =====================================================
-- CORREÇÃO: Se o portal estiver em wellness_portals mas deveria estar em coach_portals
-- =====================================================

-- IMPORTANTE: Execute apenas se confirmar que o portal está na tabela errada!
-- Descomente e ajuste conforme necessário:

/*
-- Passo 1: Verificar dados do portal em wellness_portals
SELECT * FROM wellness_portals WHERE slug = 'diagnostico-de-parasitose';

-- Passo 2: Verificar ferramentas relacionadas
SELECT pt.*, ut.title as tool_title
FROM portal_tools pt
JOIN user_templates ut ON ut.id = pt.tool_id
WHERE pt.portal_id = (SELECT id FROM wellness_portals WHERE slug = 'diagnostico-de-parasitose');

-- Passo 3: Se confirmar que está na tabela errada, mover para coach_portals:
-- (CUIDADO: Isso requer mover também as ferramentas relacionadas)

-- 3.1. Criar portal em coach_portals
INSERT INTO coach_portals (
    user_id,
    name,
    slug,
    description,
    navigation_type,
    status,
    custom_colors,
    header_text,
    footer_text,
    tools_order,
    short_code,
    views,
    profession
)
SELECT 
    user_id,
    name,
    slug,
    description,
    navigation_type,
    status,
    custom_colors,
    header_text,
    footer_text,
    tools_order,
    short_code,
    views,
    'coach' as profession  -- Corrigir profession
FROM wellness_portals
WHERE slug = 'diagnostico-de-parasitose';

-- 3.2. Mover ferramentas (se necessário)
-- (Isso depende da estrutura das tabelas de ferramentas)
*/

