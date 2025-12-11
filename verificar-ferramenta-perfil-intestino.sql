-- =====================================================
-- VERIFICAR FERRAMENTA "perfil-intestino" DO USUÁRIO "edsondaluz"
-- =====================================================

-- PASSO 1: Verificar se o usuário "edsondaluz" existe
SELECT 
    up.user_id,
    up.user_slug,
    up.email,
    up.nome_completo,
    CASE 
        WHEN up.user_slug = 'edsondaluz' THEN '✅ User slug correto'
        WHEN up.user_slug ILIKE '%edsondaluz%' THEN '⚠️ User slug similar: ' || up.user_slug
        ELSE '❌ User slug diferente: ' || up.user_slug
    END as diagnostico_user
FROM user_profiles up
WHERE up.user_slug = 'edsondaluz'
   OR up.user_slug ILIKE '%edsondaluz%'
   OR up.email ILIKE '%edsondaluz%'
ORDER BY 
    CASE WHEN up.user_slug = 'edsondaluz' THEN 1 ELSE 2 END;

-- PASSO 2: Ver TODAS as ferramentas wellness do usuário "edsondaluz"
SELECT 
    ut.id,
    ut.title,
    ut.slug,
    ut.template_slug,
    ut.status,
    ut.profession,
    ut.user_id,
    up.user_slug,
    up.email,
    CASE 
        WHEN ut.status = 'active' THEN '✅ Ativa'
        ELSE '❌ Status: ' || ut.status
    END as status_diagnostico,
    CASE 
        WHEN ut.content IS NOT NULL AND ut.content::text != '{}' THEN '✅ Tem content'
        ELSE '⚠️ Sem content'
    END as content_diagnostico
FROM user_templates ut
LEFT JOIN user_profiles up ON up.user_id = ut.user_id
WHERE up.user_slug = 'edsondaluz'
  AND ut.profession = 'wellness'
ORDER BY ut.created_at DESC;

-- PASSO 3: Verificar especificamente a ferramenta "perfil-intestino"
SELECT 
    ut.id,
    ut.title,
    ut.slug,
    ut.template_slug,
    ut.status,
    ut.profession,
    ut.user_id,
    up.user_slug,
    up.email,
    ut.content IS NOT NULL as tem_content,
    CASE 
        WHEN ut.slug = 'perfil-intestino' AND ut.status = 'active' THEN '✅ FERRAMENTA CORRETA E ATIVA'
        WHEN ut.slug = 'perfil-intestino' AND ut.status != 'active' THEN '❌ Status incorreto: ' || ut.status
        WHEN ut.slug != 'perfil-intestino' THEN '⚠️ Slug diferente: ' || ut.slug
        ELSE '⚠️ Verificar'
    END as diagnostico,
    CASE 
        WHEN ut.content IS NOT NULL AND ut.content::text != '{}' THEN '✅ Tem content configurado'
        ELSE '❌ SEM CONTENT - precisa configurar'
    END as content_status
FROM user_templates ut
LEFT JOIN user_profiles up ON up.user_id = ut.user_id
WHERE up.user_slug = 'edsondaluz'
  AND ut.profession = 'wellness'
  AND (
    ut.slug = 'perfil-intestino' 
    OR ut.slug ILIKE '%perfil%intestino%'
    OR ut.title ILIKE '%perfil%intestino%'
    OR ut.template_slug = 'perfil-intestino'
    OR ut.template_slug ILIKE '%perfil%intestino%'
  );

-- PASSO 4: Verificar variações do slug "perfil-intestino"
SELECT 
    ut.id,
    ut.title,
    ut.slug,
    ut.template_slug,
    ut.status,
    CASE 
        WHEN ut.slug = 'perfil-intestino' THEN '✅ Slug exato'
        WHEN ut.slug ILIKE 'perfil-intestino%' THEN '⚠️ Slug com sufixo: ' || ut.slug
        WHEN ut.slug ILIKE '%perfil-intestino%' THEN '⚠️ Slug com prefixo/sufixo: ' || ut.slug
        WHEN ut.slug ILIKE '%perfil%intestino%' THEN '⚠️ Slug com variação: ' || ut.slug
        ELSE '❌ Slug diferente: ' || ut.slug
    END as slug_variacao
FROM user_templates ut
LEFT JOIN user_profiles up ON up.user_id = ut.user_id
WHERE up.user_slug = 'edsondaluz'
  AND ut.profession = 'wellness'
  AND (
    ut.slug ILIKE '%perfil%' 
    OR ut.slug ILIKE '%intestino%'
    OR ut.title ILIKE '%perfil%intestino%'
  )
ORDER BY 
    CASE 
        WHEN ut.slug = 'perfil-intestino' THEN 1
        WHEN ut.slug ILIKE 'perfil-intestino%' THEN 2
        WHEN ut.slug ILIKE '%perfil-intestino%' THEN 3
        ELSE 4
    END;

-- PASSO 5: Verificar se existe template base "perfil-intestino" na tabela templates_nutrition
SELECT 
    tn.id,
    tn.name,
    tn.slug,
    tn.is_active,
    tn.profession,
    CASE 
        WHEN tn.slug = 'perfil-intestino' THEN '✅ Template base encontrado'
        WHEN tn.slug ILIKE '%perfil%intestino%' THEN '⚠️ Template base com slug similar: ' || tn.slug
        ELSE '❌ Template base não encontrado'
    END as template_base_status
FROM templates_nutrition tn
WHERE (
    tn.slug = 'perfil-intestino'
    OR tn.slug ILIKE '%perfil%intestino%'
    OR tn.name ILIKE '%perfil%intestino%'
  )
  AND (tn.profession = 'wellness' OR tn.profession IS NULL)
  AND tn.is_active = true
ORDER BY 
    CASE WHEN tn.slug = 'perfil-intestino' THEN 1 ELSE 2 END;

-- PASSO 6: RESUMO - Verificar todas as ferramentas wellness do usuário e identificar qual pode ser "perfil-intestino"
SELECT 
    ut.id,
    ut.title,
    ut.slug as tool_slug,
    ut.template_slug,
    ut.status,
    ut.content IS NOT NULL as tem_content,
    up.user_slug,
    'https://www.ylada.com/pt/wellness/' || up.user_slug || '/' || ut.slug as url_completa,
    CASE 
        WHEN ut.slug = 'perfil-intestino' AND ut.status = 'active' THEN '✅ É A FERRAMENTA CORRETA'
        WHEN ut.slug ILIKE '%perfil%intestino%' THEN '⚠️ PODE SER (slug similar)'
        WHEN ut.title ILIKE '%perfil%intestino%' THEN '⚠️ PODE SER (título similar)'
        WHEN ut.template_slug = 'perfil-intestino' THEN '⚠️ TEM TEMPLATE_SLUG CORRETO MAS SLUG DIFERENTE'
        ELSE '❌ Não é perfil-intestino'
    END as diagnostico_final
FROM user_templates ut
LEFT JOIN user_profiles up ON up.user_id = ut.user_id
WHERE up.user_slug = 'edsondaluz'
  AND ut.profession = 'wellness'
ORDER BY 
    CASE 
        WHEN ut.slug = 'perfil-intestino' THEN 1
        WHEN ut.slug ILIKE '%perfil%intestino%' THEN 2
        WHEN ut.title ILIKE '%perfil%intestino%' THEN 3
        WHEN ut.template_slug = 'perfil-intestino' THEN 4
        ELSE 5
    END;
