-- =====================================================
-- CORRIGIR SLUG DO PORTAL "diagnostico-de-parasitose"
-- Script que não depende de funções externas
-- =====================================================

-- 1. PRIMEIRO: Verificar o portal atual
SELECT 
    id,
    name,
    slug,
    LENGTH(slug) as slug_length,
    status,
    profession,
    created_at
FROM coach_portals
WHERE slug ILIKE '%diagnostico%' 
   OR slug ILIKE '%parasitose%'
   OR name ILIKE '%diagnostico%'
   OR name ILIKE '%parasitose%';

-- 2. Verificar TODOS os portais para ver padrão
SELECT 
    id,
    name,
    slug,
    status,
    profession
FROM coach_portals
ORDER BY created_at DESC
LIMIT 20;

-- =====================================================
-- CORREÇÃO: Normalizar slug manualmente
-- =====================================================

-- IMPORTANTE: Execute apenas se confirmar que o slug precisa ser corrigido!
-- PRIMEIRO: Execute a query de verificação acima para pegar o ID real do portal

-- Exemplo de correção (substitua o UUID pelo ID real encontrado na query acima):
/*
-- Opção 1: Se o slug estiver com acentos ou caracteres especiais
-- Normalizar manualmente para "diagnostico-de-parasitose"
-- Substitua '00000000-0000-0000-0000-000000000000' pelo ID real do portal
UPDATE coach_portals
SET slug = 'diagnostico-de-parasitose'
WHERE id = '00000000-0000-0000-0000-000000000000'::uuid;

-- Opção 2: Se o slug estiver correto mas com espaços ou maiúsculas
-- Substitua o UUID pelo ID real
UPDATE coach_portals
SET slug = LOWER(TRIM(slug))
WHERE id = '00000000-0000-0000-0000-000000000000'::uuid;

-- Opção 3: Se o slug estiver com múltiplos traços
-- Substitua o UUID pelo ID real
UPDATE coach_portals
SET slug = REGEXP_REPLACE(
  REGEXP_REPLACE(slug, '-+', '-', 'g'),
  '^-+|-+$', '', 'g'
)
WHERE id = '00000000-0000-0000-0000-000000000000'::uuid;
*/

-- =====================================================
-- VERIFICAÇÃO FINAL
-- =====================================================

-- Após corrigir, verificar novamente
SELECT 
    id,
    name,
    slug,
    status,
    profession
FROM coach_portals
WHERE slug = 'diagnostico-de-parasitose'
   OR slug ILIKE '%diagnostico%parasitose%';

-- Verificar se status está como 'active'
SELECT 
    id,
    name,
    slug,
    status,
    profession,
    CASE 
        WHEN status = 'active' THEN '✅ Ativo'
        ELSE '❌ Inativo'
    END as status_check
FROM coach_portals
WHERE slug ILIKE '%diagnostico%' OR slug ILIKE '%parasitose%';

-- =====================================================
-- CORREÇÃO RÁPIDA (Execute se necessário)
-- =====================================================

-- Se o portal existir mas estiver inativo:
/*
UPDATE coach_portals
SET status = 'active'
WHERE slug ILIKE '%diagnostico%parasitose%'
  AND status != 'active';
*/

-- Se o profession não estiver como 'coach':
/*
UPDATE coach_portals
SET profession = 'coach'
WHERE slug ILIKE '%diagnostico%parasitose%'
  AND profession != 'coach';
*/

-- Se o slug tiver caracteres estranhos, corrigir manualmente:
/*
-- Exemplo: se o slug for "diagnóstico-de-parasitose" (com acento)
UPDATE coach_portals
SET slug = 'diagnostico-de-parasitose'
WHERE slug = 'diagnóstico-de-parasitose';

-- Exemplo: se o slug for "Diagnostico-De-Parasitose" (com maiúsculas)
UPDATE coach_portals
SET slug = 'diagnostico-de-parasitose'
WHERE slug ILIKE 'diagnostico%parasitose';
*/

