-- =====================================================
-- VERIFICAÇÃO SIMPLES DO PORTAL "parasitose"
-- Execute esta query para ver tudo de uma vez
-- =====================================================

-- Ver TODOS os portais do usuário portalmagra@gmail.com
SELECT 
    cp.id,
    cp.name,
    cp.slug,
    cp.status,
    cp.profession,
    cp.user_id,
    u.email,
    CASE 
        WHEN cp.slug = 'parasitose' AND cp.status = 'active' AND cp.profession = 'coach' THEN '✅ PERFEITO'
        WHEN cp.slug != 'parasitose' THEN '❌ Slug incorreto: ' || cp.slug
        WHEN cp.status != 'active' THEN '❌ Status incorreto: ' || cp.status
        WHEN cp.profession != 'coach' THEN '❌ Profession incorreto: ' || cp.profession
        ELSE '⚠️ Verificar'
    END as diagnostico
FROM coach_portals cp
LEFT JOIN auth.users u ON u.id = cp.user_id
WHERE u.email = 'portalmagra@gmail.com'
ORDER BY cp.created_at DESC;

