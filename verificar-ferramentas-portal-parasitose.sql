-- =====================================================
-- VERIFICAR FERRAMENTAS DO PORTAL "parasitose"
-- =====================================================

-- Ver se o portal tem ferramentas associadas
SELECT 
    cp.id as portal_id,
    cp.name as portal_name,
    cp.slug as portal_slug,
    cpt.id as portal_tool_id,
    cpt.position,
    cpt.tool_id,
    cut.title as tool_title,
    cut.slug as tool_slug,
    cut.status as tool_status
FROM coach_portals cp
LEFT JOIN coach_portal_tools cpt ON cpt.portal_id = cp.id
LEFT JOIN coach_user_templates cut ON cut.id = cpt.tool_id
WHERE cp.slug = 'parasitose'
    AND cp.user_id = '2ed249bc-3f9f-448a-81dc-eda1d0a75043'
ORDER BY cpt.position;

-- Se não aparecer nenhuma ferramenta, você precisa adicionar ferramentas ao portal
-- através da interface em /pt/coach/c/portals

