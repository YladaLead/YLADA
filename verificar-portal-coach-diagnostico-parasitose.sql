-- =====================================================
-- VERIFICAR PORTAL "diagnostico-de-parasitose" NA ÁREA COACH
-- =====================================================

-- 1. Verificar se o portal existe em coach_portals
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
    created_at,
    updated_at
FROM coach_portals
WHERE slug = 'diagnostico-de-parasitose'
   OR slug ILIKE '%parasitose%'
   OR name ILIKE '%parasitose%';

-- 2. Verificar TODOS os portais do usuário (para ver se há algum problema)
-- Substitua 'USER_ID_AQUI' pelo ID do usuário que criou o portal
/*
SELECT 
    id,
    name,
    slug,
    status,
    profession,
    created_at
FROM coach_portals
WHERE user_id = 'USER_ID_AQUI'
ORDER BY created_at DESC;
*/

-- 3. Verificar se há portais com status diferente de 'active'
SELECT 
    id,
    name,
    slug,
    status,
    profession,
    created_at
FROM coach_portals
WHERE slug = 'diagnostico-de-parasitose'
   OR slug ILIKE '%parasitose%';

-- 4. Verificar se o slug está exatamente como esperado (case-sensitive)
SELECT 
    id,
    name,
    slug,
    LENGTH(slug) as slug_length,
    status,
    profession
FROM coach_portals
WHERE slug ILIKE '%diagnostico%'
   OR slug ILIKE '%parasitose%';

-- 5. Verificar ferramentas relacionadas ao portal
-- (Execute após encontrar o portal_id)
/*
SELECT 
    cpt.id,
    cpt.portal_id,
    cpt.tool_id,
    cpt.position,
    cpt.is_required,
    cut.title as tool_title,
    cut.slug as tool_slug,
    cut.status as tool_status
FROM coach_portal_tools cpt
LEFT JOIN coach_user_templates cut ON cut.id = cpt.tool_id
WHERE cpt.portal_id = (
    SELECT id FROM coach_portals WHERE slug = 'diagnostico-de-parasitose' LIMIT 1
)
ORDER BY cpt.position;
*/

-- =====================================================
-- CORREÇÕES POSSÍVEIS
-- =====================================================

-- Se o portal existir mas estiver com status 'inactive' ou 'draft':
/*
UPDATE coach_portals
SET status = 'active'
WHERE slug = 'diagnostico-de-parasitose'
  AND status != 'active';
*/

-- Se o portal existir mas profession não estiver como 'coach':
/*
UPDATE coach_portals
SET profession = 'coach'
WHERE slug = 'diagnostico-de-parasitose'
  AND profession != 'coach';
*/

-- Se o slug tiver espaços ou caracteres especiais:
/*
-- Verificar primeiro:
SELECT slug, LENGTH(slug), LENGTH(TRIM(slug)) 
FROM coach_portals 
WHERE slug ILIKE '%diagnostico%';

-- Corrigir se necessário:
UPDATE coach_portals
SET slug = TRIM(LOWER(slug))
WHERE slug = 'diagnostico-de-parasitose';
*/

